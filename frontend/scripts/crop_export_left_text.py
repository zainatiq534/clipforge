"""Remove leftover left marketing-text strip from editor-export paste images."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
FEATURES = ROOT / "public" / "features"
OUTDIR = ROOT / "scripts" / "realesrgan-out"


def crop_left_text(path: Path, min_crop: int, look_after: int) -> int:
    im = Image.open(path).convert("RGBA")
    backup = OUTDIR / f"{path.stem}-before-leftcrop.png"
    OUTDIR.mkdir(parents=True, exist_ok=True)
    if not backup.exists():
        im.save(backup, "PNG", compress_level=1)

    a = np.array(im)
    w, h = im.size
    rgb = a[:, :, :3].astype(np.int16)
    s = rgb.max(axis=2) - rgb.min(axis=2)
    v = rgb.max(axis=2)
    content = (a[:, :, 3] > 200) & ((s > 28) | (v < 220))
    col = content.mean(axis=0)

    crop = 0
    for i in range(w):
        if col[i] > 0.06 and col[i : i + 40].mean() > 0.1 and i > look_after:
            crop = max(0, i - 8)
            break

    crop = max(crop, min_crop)

    # Only crop if left band has dark leftover text
    left = a[:, : max(45, min_crop // 2)]
    dark = (
        (left[:, :, 3] > 200)
        & (left[:, :, 0] < 90)
        & (left[:, :, 1] < 90)
        & (left[:, :, 2] < 90)
    )
    if int(dark.sum()) < 200:
        print(f"{path.name}: no leftover text (dark={int(dark.sum())}), skip")
        return 0

    print(f"{path.name}: crop_x={crop} dark_left={int(dark.sum())} size={im.size}")
    im.crop((0, 0, crop, h)).save(OUTDIR / f"{path.stem}-left-removed.png")

    cropped = im.crop((crop, 0, w, h))
    arr = np.array(cropped)
    alpha = arr[:, :, 3]
    ys = np.where(alpha.max(axis=1) > 10)[0]
    xs = np.where(alpha.max(axis=0) > 10)[0]
    if len(xs) and len(ys):
        cropped = cropped.crop((xs[0], ys[0], xs[-1] + 1, ys[-1] + 1))

    cropped.save(path, "PNG", compress_level=1)
    print(f"  saved {path.name} -> {cropped.size}")
    return crop


def main() -> None:
    crop_left_text(FEATURES / "editor-export-paste.png", min_crop=160, look_after=120)
    for name in ("editor-export-compose-v2.png", "editor-export-compose.png"):
        p = FEATURES / name
        if p.exists():
            crop_left_text(p, min_crop=40, look_after=30)


if __name__ == "__main__":
    main()
