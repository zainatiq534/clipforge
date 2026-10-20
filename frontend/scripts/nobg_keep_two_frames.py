"""Isolate editor + export frames: transparent outside, then optional HQ upscale."""
from __future__ import annotations

import collections
import colorsys
import math
from pathlib import Path

import cv2
import numpy as np
import torch
from PIL import Image, ImageFilter
from spandrel import ImageModelDescriptor, ModelLoader
from torchvision.transforms.functional import to_tensor

ROOT = Path(__file__).resolve().parents[1]
# Prefer original full paste before bad crops
SRC_CANDIDATES = [
    ROOT / "scripts" / "realesrgan-out" / "editor-export-paste-before-nobg-frames.png",
    ROOT
    / "public"
    / "features"
    / "editor-export-paste-src.png",
]
OUT_LQ = ROOT / "public" / "features" / "editor-export-compose.png"
OUT_HQ = ROOT / "public" / "features" / "editor-export-paste.png"
CHECK = ROOT / "scripts" / "realesrgan-out" / "nobg-on-lavender.jpg"
WEIGHTS = ROOT / "scripts" / "realesrgan-tools" / "weights" / "RealESRGAN_x4plus.pth"
TILE, PAD = 256, 12


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


def is_outer_page(r: int, g: int, b: int, a: int) -> bool:
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


def flood_remove_outer(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
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
        if is_outer_page(r, g, b, a):
            visited[x][y] = True
            q.append((x, y))

    for x in range(w):
        seed(x, 0)
        seed(x, h - 1)
    for y in range(h):
        seed(0, y)
        seed(w - 1, y)

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

    for _ in range(4):
        edge: list[tuple[int, int]] = []
        for y in range(h):
            for x in range(w):
                r, g, b, a = px[x, y]
                if a < 10 or not is_outer_page(r, g, b, a) or pp[x, y]:
                    continue
                for dx, dy in dirs:
                    nx, ny = x + dx, y + dy
                    if not (0 <= nx < w and 0 <= ny < h) or px[nx, ny][3] < 10:
                        edge.append((x, y))
                        break
        for x, y in edge:
            px[x, y] = (0, 0, 0, 0)
            removed += 1

    print(f"flood removed {removed}")
    return img


def drop_small_components(img: Image.Image, min_frac: float = 0.08) -> Image.Image:
    a = np.array(img)
    alpha = (a[:, :, 3] > 20).astype(np.uint8)
    num, labels, stats, _ = cv2.connectedComponentsWithStats(alpha, 8)
    if num <= 1:
        return img
    areas = [(i, stats[i, cv2.CC_STAT_AREA]) for i in range(1, num)]
    areas.sort(key=lambda t: t[1], reverse=True)
    largest = areas[0][1]
    keep = {i for i, ar in areas if ar >= largest * min_frac}
    if len(keep) > 2:
        keep = {i for i, _ in areas[:2]}
    print("components", areas[:8], "keep", sorted(keep))
    mask = np.isin(labels, list(keep))
    a[~mask] = (0, 0, 0, 0)
    return Image.fromarray(a, "RGBA")


def crop_bbox(img: Image.Image, pad: int = 4) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    w, h = img.size
    return img.crop((max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad)))


@torch.inference_mode()
def upscale_rgba(model: ImageModelDescriptor, rgba: Image.Image, scale: int) -> Image.Image:
    device = torch.device("cpu")
    model = model.to(device).eval()
    rgb = rgba.convert("RGB")
    alpha = rgba.getchannel("A")
    img = to_tensor(rgb).unsqueeze(0).to(device)
    _, _, h, w = img.shape
    out_h, out_w = h * scale, w * scale
    output = torch.zeros((1, 3, out_h, out_w), device=device)
    tiles_y = max(1, math.ceil(h / TILE))
    tiles_x = max(1, math.ceil(w / TILE))
    for ty in range(tiles_y):
        for tx in range(tiles_x):
            y0, x0 = ty * TILE, tx * TILE
            y1, x1 = min(y0 + TILE, h), min(x0 + TILE, w)
            ys0, xs0 = max(0, y0 - PAD), max(0, x0 - PAD)
            ys1, xs1 = min(h, y1 + PAD), min(w, x1 + PAD)
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
    arr = (output.squeeze(0).clamp(0, 1).permute(1, 2, 0).cpu().numpy() * 255.0).astype(
        np.uint8
    )
    up_rgb = Image.fromarray(arr, "RGB")
    up_a = alpha.resize(up_rgb.size, Image.Resampling.BILINEAR)
    up_rgb.putalpha(up_a)
    return up_rgb


def save_check(img: Image.Image) -> None:
    bg = Image.new("RGBA", img.size, (235, 228, 250, 255))
    Image.alpha_composite(bg, img).convert("RGB").save(CHECK, quality=92)


def main() -> None:
    src_path = next((p for p in SRC_CANDIDATES if p.exists()), None)
    if src_path is None:
        raise SystemExit("no source")
    # If HQ backup, work at source scale first for speed/quality of mask
    src = Image.open(src_path).convert("RGBA")
    print("source", src_path.name, src.size)

    # If already HQ (~2k), downscale for clean mask then upscale result
    work = src
    did_downscale = False
    if max(src.size) > 1200:
        scale = 585 / src.size[0]
        work = src.resize((585, max(1, int(src.size[1] * scale))), Image.Resampling.LANCZOS)
        did_downscale = True
        print("work size", work.size)

    img = flood_remove_outer(work)
    img = drop_small_components(img, min_frac=0.10)
    img = crop_bbox(img, pad=3)
    print("lq final", img.size)

    tmp = OUT_LQ.with_suffix(".tmp.png")
    img.save(tmp, "PNG", compress_level=1)
    tmp.replace(OUT_LQ)
    save_check(img)

    if WEIGHTS.exists():
        print("upscaling with RealESRGAN…", flush=True)
        loaded = ModelLoader().load_from_file(str(WEIGHTS))
        if not isinstance(loaded, ImageModelDescriptor):
            raise TypeError(type(loaded))
        scale = int(getattr(loaded, "scale", 4) or 4)
        hq = upscale_rgba(loaded, img, scale)
        # Re-trim after upscale alpha
        hq = crop_bbox(hq, pad=4)
        tmp_hq = OUT_HQ.with_suffix(".tmp.png")
        hq.save(tmp_hq, "PNG", compress_level=1)
        tmp_hq.replace(OUT_HQ)
        save_check(hq)
        print("hq saved", OUT_HQ, hq.size)
    else:
        # No weights: lanczos upscale x4 from clean LQ
        hq = img.resize((img.size[0] * 4, img.size[1] * 4), Image.Resampling.LANCZOS)
        tmp_hq = OUT_HQ.with_suffix(".tmp.png")
        hq.save(tmp_hq, "PNG", compress_level=1)
        tmp_hq.replace(OUT_HQ)
        print("hq lanczos saved", OUT_HQ, hq.size)

    print("corners HQ", Image.open(OUT_HQ).convert("RGBA").getpixel((0, 0)))


if __name__ == "__main__":
    main()
