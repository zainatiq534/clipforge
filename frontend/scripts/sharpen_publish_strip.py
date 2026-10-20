"""Sharpen RealESRGAN publish strip + re-remove outer lavender page bg."""
from __future__ import annotations

import collections
import colorsys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ESR = ROOT / "scripts" / "realesrgan-out" / "publish-strip-esr.png"
OUT = ROOT / "public" / "features" / "ready-to-publish-strip.png"
PREVIEW = ROOT / "scripts" / "realesrgan-out" / "publish-strip-hq-green.jpg"


def hsv(r: int, g: int, b: int) -> tuple[float, float, float]:
    return colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)


def clarify(rgb: np.ndarray) -> np.ndarray:
    den = cv2.bilateralFilter(rgb, d=5, sigmaColor=20, sigmaSpace=5)
    blur = cv2.GaussianBlur(den, (0, 0), 1.15)
    sharp = cv2.addWeighted(den, 1.6, blur, -0.6, 0)
    lab = cv2.cvtColor(sharp, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    l = cv2.createCLAHE(clipLimit=1.35, tileGridSize=(8, 8)).apply(l)
    sharp2 = cv2.cvtColor(cv2.merge([l, a, b]), cv2.COLOR_LAB2RGB)
    blur2 = cv2.GaussianBlur(sharp2, (0, 0), 0.75)
    out = cv2.addWeighted(sharp2, 1.28, blur2, -0.28, 0)
    return np.clip(out, 0, 255).astype(np.uint8)


def remove_outer_bg(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    w, h = img.size
    px = img.load()

    protect = Image.new("L", (w, h), 0)
    pp = protect.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 20:
                continue
            hh, s, v = hsv(r, g, b)
            mn, mx = min(r, g, b), max(r, g, b)
            content = v < 0.90 or s >= 0.10 or (s >= 0.06 and 0.55 <= hh <= 0.95)
            white_card = mn >= 248 and (mx - mn) <= 8 and s <= 0.03
            if content or white_card:
                pp[x, y] = 255

    protect = protect.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MaxFilter(7))
    pp = protect.load()

    def outer_at(x: int, y: int) -> bool:
        r, g, b, a = px[x, y]
        if a < 20:
            return True
        if pp[x, y] != 0:
            return False
        hh, s, v = hsv(r, g, b)
        mn = min(r, g, b)
        if v >= 0.90 and s <= 0.18 and mn >= 210:
            return True
        if v >= 0.88 and 0.01 <= s <= 0.20 and 0.55 <= hh <= 0.95 and mn >= 200:
            return True
        return False

    visited = [[False] * h for _ in range(w)]
    q: collections.deque[tuple[int, int]] = collections.deque()

    def try_seed(x: int, y: int) -> None:
        if visited[x][y] or pp[x, y] != 0:
            return
        if outer_at(x, y):
            visited[x][y] = True
            q.append((x, y))

    for x in range(w):
        try_seed(x, 0)
        try_seed(x, h - 1)
    for y in range(h):
        try_seed(0, y)
        try_seed(w - 1, y)

    dirs = ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1))
    removed = 0
    while q:
        x, y = q.popleft()
        px[x, y] = (0, 0, 0, 0)
        removed += 1
        for dx, dy in dirs:
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny] and pp[nx, ny] == 0:
                if outer_at(nx, ny):
                    visited[nx][ny] = True
                    q.append((nx, ny))

    bbox = img.getbbox()
    if bbox:
        x0, y0, x1, y1 = bbox
        pad = 8
        img = img.crop(
            (max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad))
        )
    print(f"removed {removed} outer pixels; final {img.size}")
    return img


def main() -> None:
    esr = Image.open(ESR).convert("RGB")
    clarified = clarify(np.array(esr))
    out = remove_outer_bg(Image.fromarray(clarified, "RGB"))
    out.save(OUT, "PNG", compress_level=1)
    print("saved", OUT, out.size)

    prev = Image.new("RGBA", out.size, (160, 230, 160, 255))
    prev.alpha_composite(out)
    prev.convert("RGB").save(PREVIEW, quality=92)

    arr = np.array(out)
    cy, cx = arr.shape[0] // 2, arr.shape[1] // 2
    Image.fromarray(arr[max(0, cy - 90) : cy + 90, cx - 420 : cx + 420]).save(
        ROOT / "scripts/realesrgan-out/publish-strip-text-zoom.png"
    )
    Image.fromarray(arr[10 : arr.shape[0] - 10, 20:520]).save(
        ROOT / "scripts/realesrgan-out/publish-strip-phones-zoom.png"
    )


if __name__ == "__main__":
    main()
