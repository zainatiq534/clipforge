"""Upscale + deblur speaker stills with RealESRGAN (spandrel) + sharpen."""
from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np
import torch
from PIL import Image, ImageEnhance, ImageFilter
from spandrel import ImageModelDescriptor, ModelLoader
from torchvision.transforms.functional import to_pil_image, to_tensor

ROOT = Path(__file__).resolve().parents[1]
WEIGHTS = ROOT / "scripts" / "realesrgan-tools" / "weights" / "RealESRGAN_x4plus.pth"
PUBLIC = ROOT / "public" / "features"

# Larger tiles = fewer passes (faster on CPU)
TILE = 320
PAD = 12
SCALE = 4

JOBS = [
    # src -> dest, final display size
    (PUBLIC / "reframe-speaker-wide-src.jpg", PUBLIC / "reframe-speaker-wide.jpg", (3200, 1800)),
    (PUBLIC / "reframe-speaker-vert-src.jpg", PUBLIC / "reframe-speaker-vert.jpg", (1620, 2880)),
]


def upscale_tiled(img: Image.Image, model: ImageModelDescriptor) -> Image.Image:
    w, h = img.size
    canvas = Image.new("RGB", (w * SCALE, h * SCALE))
    ys = list(range(0, h, TILE))
    xs = list(range(0, w, TILE))
    total = len(ys) * len(xs)
    done = 0
    for y0 in ys:
        for x0 in xs:
            x1 = min(x0 + TILE, w)
            y1 = min(y0 + TILE, h)
            xa, ya = max(0, x0 - PAD), max(0, y0 - PAD)
            xb, yb = min(w, x1 + PAD), min(h, y1 + PAD)
            crop = img.crop((xa, ya, xb, yb))
            with torch.inference_mode():
                pred = model(to_tensor(crop).unsqueeze(0))
            tile_img = to_pil_image(pred.squeeze(0).clamp(0, 1).cpu())
            left = (x0 - xa) * SCALE
            top = (y0 - ya) * SCALE
            piece = tile_img.crop(
                (left, top, left + (x1 - x0) * SCALE, top + (y1 - y0) * SCALE)
            )
            canvas.paste(piece, (x0 * SCALE, y0 * SCALE))
            done += 1
            print(f"  tile {done}/{total}", flush=True)
    return canvas


def deblur_cv(pil: Image.Image) -> Image.Image:
    """Unsharp + light detail restore (keeps studio bokeh, sharpens subject)."""
    bgr = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)
    # Gentle denoise on chroma-ish noise without killing edges
    den = cv2.bilateralFilter(bgr, d=5, sigmaColor=35, sigmaSpace=35)
    blur = cv2.GaussianBlur(den, (0, 0), 1.15)
    sharp = cv2.addWeighted(den, 1.45, blur, -0.45, 0)
    return Image.fromarray(cv2.cvtColor(sharp, cv2.COLOR_BGR2RGB))


def enhance(src: Path, dest: Path, target: tuple[int, int], model: ImageModelDescriptor) -> None:
    print("enhancing", src.name, flush=True)
    img = Image.open(src).convert("RGB")
    up = upscale_tiled(img, model)
    up = up.resize(target, Image.Resampling.LANCZOS)
    up = deblur_cv(up)
    up = up.filter(ImageFilter.UnsharpMask(radius=1.0, percent=95, threshold=3))
    up = ImageEnhance.Contrast(up).enhance(1.04)
    up = ImageEnhance.Sharpness(up).enhance(1.05)
    up.save(dest, "JPEG", quality=96, optimize=True, subsampling=0)
    print("saved", dest.name, up.size, dest.stat().st_size, flush=True)


def main() -> None:
    print("loading weights…", flush=True)
    model = ModelLoader().load_from_file(str(WEIGHTS))
    assert isinstance(model, ImageModelDescriptor)
    model.eval().cpu()
    for src, dest, target in JOBS:
        enhance(src, dest, target, model)


if __name__ == "__main__":
    main()
