"""RealESRGAN x4 + sharpen + remove outer page bg for ready-to-publish strip."""
from __future__ import annotations

import collections
import colorsys
import math
from pathlib import Path

import numpy as np
import torch
from PIL import Image, ImageEnhance, ImageFilter
from spandrel import ImageModelDescriptor, ModelLoader
from torchvision.transforms.functional import to_tensor

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "features" / "ready-to-publish-strip-src.png"
WEIGHTS = ROOT / "scripts" / "realesrgan-tools" / "weights" / "RealESRGAN_x4plus.pth"
ESR = ROOT / "scripts" / "realesrgan-out" / "publish-strip-esr.png"
OUT = ROOT / "public" / "features" / "ready-to-publish-strip.png"
BACKUP = ROOT / "scripts" / "realesrgan-out" / "publish-strip-before-hq.png"
TILE = 256
PAD = 12


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
            top = (y0 - ys0) * scale
            left = (x0 - xs0) * scale
            bottom = top + (y1 - y0) * scale
            right = left + (x1 - x0) * scale
            oy0, ox0 = y0 * scale, x0 * scale
            oy1, ox1 = y1 * scale, x1 * scale
            output[:, :, oy0:oy1, ox0:ox1] = up[:, :, top:bottom, left:right]
            print(f"  tile {ty + 1}/{tiles_y},{tx + 1}/{tiles_x}", flush=True)
    out = (output.squeeze(0).clamp(0, 1).permute(1, 2, 0).cpu().numpy() * 255.0).astype(
        np.uint8
    )
    return Image.fromarray(out, "RGB")


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


def is_white_card(r: int, g: int, b: int, a: int) -> bool:
    if a < 20:
        return False
    _, s, _ = hsv(r, g, b)
    mn, mx = min(r, g, b), max(r, g, b)
    return mn >= 248 and (mx - mn) <= 8 and s <= 0.025


def is_outer_page(r: int, g: int, b: int, a: int) -> bool:
    """Lavender/mist outside the rounded card — not the white card fill."""
    if a < 20:
        return True
    if is_content(r, g, b, a) or is_white_card(r, g, b, a):
        return False
    h, s, v = hsv(r, g, b)
    mn = min(r, g, b)
    if v >= 0.90 and s <= 0.16 and mn >= 210:
        return True
    if v >= 0.88 and 0.015 <= s <= 0.18 and 0.55 <= h <= 0.95 and mn >= 200:
        return True
    return False


def remove_outer_bg(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    w, h = img.size
    px = img.load()

    protect = Image.new("L", (w, h), 0)
    pp = protect.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_content(r, g, b, a) or is_white_card(r, g, b, a):
                pp[x, y] = 255

    protect = protect.filter(ImageFilter.MaxFilter(7))
    protect = protect.filter(ImageFilter.MaxFilter(5))
    pp = protect.load()

    visited = [[False] * h for _ in range(w)]
    q: collections.deque[tuple[int, int]] = collections.deque()
    dirs = ((1, 0), (-1, 0), (0, 1), (0, -1))

    def try_seed(x: int, y: int) -> None:
        if visited[x][y] or pp[x, y] != 0:
            return
        r, g, b, a = px[x, y]
        if is_outer_page(r, g, b, a):
            visited[x][y] = True
            q.append((x, y))

    for x in range(w):
        try_seed(x, 0)
        try_seed(x, h - 1)
    for y in range(h):
        try_seed(0, y)
        try_seed(w - 1, y)

    removed = 0
    while q:
        x, y = q.popleft()
        px[x, y] = (0, 0, 0, 0)
        removed += 1
        for dx, dy in dirs:
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny] and pp[nx, ny] == 0:
                r, g, b, a = px[nx, ny]
                if is_outer_page(r, g, b, a):
                    visited[nx][ny] = True
                    q.append((nx, ny))

    bbox = img.getbbox()
    if bbox:
        x0, y0, x1, y1 = bbox
        pad = 4
        img = img.crop(
            (max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad))
        )

    print(f"removed {removed} outer pixels; final {img.size}")
    return img


def main() -> None:
    ESR.parent.mkdir(parents=True, exist_ok=True)
    if OUT.exists():
        BACKUP.write_bytes(OUT.read_bytes())
        print("backup", BACKUP)

    print("loading model…", flush=True)
    loaded = ModelLoader().load_from_file(str(WEIGHTS))
    if not isinstance(loaded, ImageModelDescriptor):
        raise TypeError(type(loaded))
    scale = int(getattr(loaded, "scale", 4) or 4)

    src = Image.open(SRC).convert("RGB")
    print(f"source {src.size} scale={scale}", flush=True)
    print("upscaling…", flush=True)
    up = upscale_rgb(loaded, src, scale)
    up.save(ESR, "PNG", compress_level=1)
    print("esr saved", ESR, up.size)

    sharp = up.filter(ImageFilter.UnsharpMask(radius=1.4, percent=140, threshold=2))
    sharp = ImageEnhance.Sharpness(sharp).enhance(1.15)
    sharp = ImageEnhance.Contrast(sharp).enhance(1.04)

    out = remove_outer_bg(sharp)
    px = out.load()
    w, h = out.size
    print("corners", px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1])
    data = list(out.getdata())
    trans = sum(1 for *_, a in data if a < 10)
    print(f"transparent% {100 * trans / len(data):.1f}")

    out.save(OUT, "PNG", compress_level=1)
    print("saved", OUT, out.size)


if __name__ == "__main__":
    main()
