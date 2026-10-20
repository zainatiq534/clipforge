"""
Remove ONLY outer page background.
- Original HQ RGB never rewritten
- Mask built on small copy; holes sealed on mask; applied as alpha only
"""
from __future__ import annotations

import collections
import colorsys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "scripts" / "realesrgan-out" / "editor-export-paste-before-nobg-frames.png"
OUT = ROOT / "public" / "features" / "editor-export-paste.png"
CHECK = ROOT / "scripts" / "realesrgan-out" / "nobg-on-lavender.jpg"
MASK_W = 585


def hsv(r: int, g: int, b: int) -> tuple[float, float, float]:
    return colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)


def is_content(r: int, g: int, b: int, a: int) -> bool:
    if a < 20:
        return False
    h, s, v = hsv(r, g, b)
    if v < 0.88:
        return True
    if s >= 0.12:
        return True
    if s >= 0.08 and 0.55 <= h <= 0.95:
        return True
    return False


def is_outer(r: int, g: int, b: int, a: int) -> bool:
    if a < 20:
        return True
    if is_content(r, g, b, a):
        return False
    h, s, v = hsv(r, g, b)
    mn = min(r, g, b)
    if v >= 0.91 and s <= 0.14 and mn >= 220:
        return True
    if v >= 0.89 and 0.02 <= s <= 0.18 and 0.55 <= h <= 0.95 and mn >= 210:
        return True
    return False


def build_keep_mask(small_rgba: Image.Image) -> np.ndarray:
    img = small_rgba.copy()
    w, h = img.size
    px = img.load()

    protect = Image.new("L", (w, h), 0)
    pp = protect.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_content(r, g, b, a):
                pp[x, y] = 255

    protect = protect.filter(ImageFilter.MaxFilter(11))
    protect = protect.filter(ImageFilter.MaxFilter(7))
    pp = protect.load()

    visited = [[False] * h for _ in range(w)]
    q: collections.deque[tuple[int, int]] = collections.deque()
    dirs = ((1, 0), (-1, 0), (0, 1), (0, -1))

    def seed(x: int, y: int) -> None:
        if visited[x][y] or pp[x, y]:
            return
        r, g, b, a = px[x, y]
        if is_outer(r, g, b, a):
            visited[x][y] = True
            q.append((x, y))

    for x in range(w):
        seed(x, 0)
        seed(x, h - 1)
    for y in range(h):
        seed(0, y)
        seed(w - 1, y)

    while q:
        x, y = q.popleft()
        px[x, y] = (0, 0, 0, 0)
        for dx, dy in dirs:
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny] and pp[nx, ny] == 0:
                r, g, b, a = px[nx, ny]
                if is_outer(r, g, b, a):
                    visited[nx][ny] = True
                    q.append((nx, ny))

    for _ in range(3):
        edge: list[tuple[int, int]] = []
        for y in range(h):
            for x in range(w):
                r, g, b, a = px[x, y]
                if a < 10 or not is_outer(r, g, b, a) or pp[x, y]:
                    continue
                for dx, dy in dirs:
                    nx, ny = x + dx, y + dy
                    if not (0 <= nx < w and 0 <= ny < h) or px[nx, ny][3] < 10:
                        edge.append((x, y))
                        break
        for x, y in edge:
            px[x, y] = (0, 0, 0, 0)

    alpha = (np.array(img)[:, :, 3] > 20).astype(np.uint8) * 255

    # Seal holes inside the white cards on the MASK only (keeps more of original)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (17, 17))
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, k)

    # Drop tiny leftover letters / arrows outside the main frames
    num, labels, stats, _ = cv2.connectedComponentsWithStats((alpha > 0).astype(np.uint8), 8)
    if num > 1:
        areas = sorted(
            [(i, stats[i, cv2.CC_STAT_AREA]) for i in range(1, num)],
            key=lambda t: t[1],
            reverse=True,
        )
        largest = areas[0][1]
        keep = {i for i, ar in areas if ar >= largest * 0.10}
        if len(keep) > 2:
            keep = {i for i, _ in areas[:2]}
        print("mask components", areas[:6], "keep", sorted(keep))
        alpha = np.where(np.isin(labels, list(keep)), 255, 0).astype(np.uint8)

    return alpha


def main() -> None:
    hq = Image.open(SRC).convert("RGBA")
    print("HQ source", hq.size, "(RGB will stay original)")

    small = hq.resize(
        (MASK_W, max(1, int(hq.size[1] * MASK_W / hq.size[0]))),
        Image.Resampling.BILINEAR,
    )
    print("mask size", small.size)
    mask_small = build_keep_mask(small)

    mask_hq = np.array(
        Image.fromarray(mask_small, "L").resize(hq.size, Image.Resampling.BILINEAR)
    )
    # Hard keep / drop — no semi-transparent mush
    keep = mask_hq >= 128

    out = np.array(hq)
    # ONLY change alpha; RGB of kept pixels identical to source
    out[~keep, 3] = 0
    out[keep, 3] = 255

    img = Image.fromarray(out, "RGBA")
    bbox = img.getbbox()
    if bbox:
        x0, y0, x1, y1 = bbox
        pad = 4
        w, h = img.size
        img = img.crop(
            (max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad))
        )

    # Verify RGB preserved vs source on a kept pixel
    a = np.array(img)
    ys, xs = np.where(a[:, :, 3] > 200)
    if len(xs):
        # map back roughly — just show sample looks like UI color
        print("sample kept rgba", tuple(a[ys[len(ys) // 2], xs[len(xs) // 2]]))

    print("final", img.size, "corner", img.getpixel((0, 0)))
    tmp = OUT.with_suffix(".tmp.png")
    img.save(tmp, "PNG", compress_level=1)
    tmp.replace(OUT)

    bg = Image.new("RGBA", img.size, (235, 228, 250, 255))
    Image.alpha_composite(bg, img).convert("RGB").save(CHECK, quality=92)
    print("saved", OUT)


if __name__ == "__main__":
    main()
