"""Remove only the 4 user-marked leftovers. Touch nothing else inside the UI frames."""
from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "scripts" / "realesrgan-out" / "editor-export-paste-before-nobg-frames.png"
OUT = ROOT / "public" / "features" / "editor-export-paste.png"
CHECK = ROOT / "scripts" / "realesrgan-out" / "parts-removed-check.jpg"
DEBUG = ROOT / "scripts" / "realesrgan-out" / "parts-removed-mask-debug.jpg"


def main() -> None:
    hq = np.array(Image.open(SRC).convert("RGB"))
    hay = cv2.cvtColor(hq, cv2.COLOR_RGB2BGR)
    H, W = hay.shape[:2]
    hsv = cv2.cvtColor(hay, cv2.COLOR_BGR2HSV)
    h, s, v = hsv[:, :, 0], hsv[:, :, 1], hsv[:, :, 2]
    full = np.zeros((H, W), np.uint8)

    # Part 1: left navy leftover text (g / orm. / body lines)
    # Ink is dark navy: low V, HIGH S, hue ~120.
    left_roi = np.zeros((H, W), dtype=bool)
    left_roi[90:760, :92] = True
    left_ink = left_roi & (((v < 170) & (s >= 40) & (h >= 90) & (h <= 150)) | (v < 80))
    left_m = left_ink.astype(np.uint8) * 255
    left_m = cv2.morphologyEx(
        left_m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    )
    n, lab, st, _ = cv2.connectedComponentsWithStats(left_m)
    left_keep = np.zeros_like(left_m)
    for i in range(1, n):
        if st[i, cv2.CC_STAT_AREA] >= 8:
            left_keep[lab == i] = 255
            print(
                "left",
                i,
                st[i, cv2.CC_STAT_AREA],
                st[i, cv2.CC_STAT_LEFT],
                st[i, cv2.CC_STAT_TOP],
                st[i, cv2.CC_STAT_WIDTH],
                st[i, cv2.CC_STAT_HEIGHT],
            )
    left_keep = cv2.dilate(
        left_keep, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)), 1
    )
    full = cv2.bitwise_or(full, left_keep)

    # Parts 2–4: purple handwriting + arrows ABOVE the UI cards.
    # Bright marker ink can have V=255 — do not cap V.
    top_roi = np.zeros((H, W), dtype=bool)
    top_roi[:165, :] = True
    top_ink = top_roi & (h >= 110) & (h <= 165) & (s >= 35) & (v >= 40)
    top_m = top_ink.astype(np.uint8) * 255
    top_m = cv2.dilate(top_m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)), 1)

    # Protect both UI frames (headers start ~y=125)
    protect = np.zeros((H, W), dtype=bool)
    protect[125:1680, 130:2260] = True
    ui = (
        (h >= 120)
        & (h <= 150)
        & (s >= 130)
        & (v >= 130)
        & (np.arange(H)[:, None] >= 115)
        & (np.arange(W)[None, :] >= 130)
        & (np.arange(W)[None, :] < 2260)
    )
    protect |= ui
    top_m[protect] = 0

    n, lab, st, _ = cv2.connectedComponentsWithStats(top_m)
    top_keep = np.zeros_like(top_m)
    for i in range(1, n):
        area = st[i, cv2.CC_STAT_AREA]
        if area < 10:
            continue
        top_keep[lab == i] = 255
        print(
            "top",
            i,
            area,
            st[i, cv2.CC_STAT_LEFT],
            st[i, cv2.CC_STAT_TOP],
            st[i, cv2.CC_STAT_WIDTH],
            st[i, cv2.CC_STAT_HEIGHT],
        )
    full = cv2.bitwise_or(full, top_keep)
    full[protect] = 0

    print("mask pixels", int((full > 0).sum()), "coverage", float((full > 0).mean()))

    repaired = cv2.inpaint(hay, full, 5, cv2.INPAINT_TELEA)

    unchanged = full == 0
    diff = np.abs(repaired[unchanged].astype(np.int16) - hay[unchanged].astype(np.int16))
    print("unchanged max rgb diff", int(diff.max()) if diff.size else 0)

    out_rgb = cv2.cvtColor(repaired, cv2.COLOR_BGR2RGB)
    assert np.array_equal(hq[200:1500, 200:1400], out_rgb[200:1500, 200:1400]), (
        "UI interior changed — abort"
    )

    out = Image.fromarray(out_rgb, "RGB").convert("RGBA")
    tmp = OUT.with_suffix(".tmp.png")
    out.save(tmp, "PNG", compress_level=1)
    tmp.replace(OUT)

    Image.fromarray(out_rgb).save(CHECK, quality=92)
    dbg = hay.copy()
    dbg[full > 0] = (0, 255, 0)
    Image.fromarray(cv2.cvtColor(dbg, cv2.COLOR_BGR2RGB)).save(DEBUG, quality=90)
    print("saved", OUT)


if __name__ == "__main__":
    main()
