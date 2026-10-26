"""AI upscale captions mockup with RealESRGAN_x4plus (spandrel) + alpha restore."""
from __future__ import annotations

import math
from pathlib import Path

import numpy as np
import torch
from PIL import Image
from spandrel import ImageModelDescriptor, ModelLoader
from torchvision.transforms.functional import to_tensor

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "features" / "captions-mockup-source.png"
WEIGHTS = ROOT / "scripts" / "realesrgan-tools" / "weights" / "RealESRGAN_x4plus.pth"
OUT = ROOT / "public" / "features" / "captions-mockup.png"
TILE = 192
PAD = 8


@torch.inference_mode()
def upscale_rgb(model: ImageModelDescriptor, rgb: Image.Image, scale: int) -> Image.Image:
    device = torch.device("cpu")
    model = model.to(device).eval()
    img = to_tensor(rgb).unsqueeze(0).to(device)
    _, _, h, w = img.shape
    out_h, out_w = h * scale, w * scale
    output = torch.zeros((1, 3, out_h, out_w), device=device)

    tiles_y = max(1, math.ceil(h / TILE))
    tiles_x = max(1, math.ceil(w / TILE))

    for ty in range(tiles_y):
        for tx in range(tiles_x):
            y0 = ty * TILE
            x0 = tx * TILE
            y1 = min(y0 + TILE, h)
            x1 = min(x0 + TILE, w)

            ys0 = max(0, y0 - PAD)
            xs0 = max(0, x0 - PAD)
            ys1 = min(h, y1 + PAD)
            xs1 = min(w, x1 + PAD)

            tile = img[:, :, ys0:ys1, xs0:xs1]
            up = model(tile)

            # crop padding in output space
            top = (y0 - ys0) * scale
            left = (x0 - xs0) * scale
            bottom = top + (y1 - y0) * scale
            right = left + (x1 - x0) * scale

            oy0, ox0 = y0 * scale, x0 * scale
            oy1, ox1 = y1 * scale, x1 * scale
            output[:, :, oy0:oy1, ox0:ox1] = up[:, :, top:bottom, left:right]
            print(f"  tile {ty+1}/{tiles_y},{tx+1}/{tiles_x}", flush=True)

    out = (output.squeeze(0).clamp(0, 1).permute(1, 2, 0).cpu().numpy() * 255.0).astype(
        np.uint8
    )
    return Image.fromarray(out, "RGB")


def main() -> None:
    print("loading model…", flush=True)
    loaded = ModelLoader().load_from_file(str(WEIGHTS))
    if not isinstance(loaded, ImageModelDescriptor):
        raise TypeError(f"Unexpected model type: {type(loaded)}")
    scale = int(getattr(loaded, "scale", 4) or 4)

    src = Image.open(SRC).convert("RGBA")
    print(f"source {src.size} scale={scale}", flush=True)

    # Soft lavender matte so transparent edges don't fringe after upscale
    bg = np.array([248, 246, 252], dtype=np.float32)
    arr = np.array(src)
    a = arr[:, :, 3:4].astype(np.float32) / 255.0
    rgb = (arr[:, :, :3].astype(np.float32) * a + bg * (1.0 - a)).astype(np.uint8)
    rgb_img = Image.fromarray(rgb, "RGB")

    print("upscaling RGB…", flush=True)
    up_rgb = upscale_rgb(loaded, rgb_img, scale)

    print("upscaling alpha…", flush=True)
    alpha = src.split()[-1]
    up_a = alpha.resize(up_rgb.size, Image.Resampling.LANCZOS)

    out = Image.merge("RGBA", (*up_rgb.split(), up_a))
    out.save(OUT, "PNG", compress_level=1)
    print(f"saved {OUT} {out.size}", flush=True)


if __name__ == "__main__":
    main()
