"""Remove outer page bg from editor+export compose paste; keep white UI cards."""
from __future__ import annotations

import collections
import colorsys
from pathlib import Path

from PIL import Image, ImageFilter

SRC = Path(
    r"C:\Users\DELL\.cursor\projects\c-Users-DELL-Desktop-clipforge\assets"
    r"\c__Users_DELL_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"e8d7a129b92aa088cd3e7f82679785c5_images_image-6e61e7b7-7d57-4bce-b72d-a55cf5756655.png"
)
OUT = Path(__file__).resolve().parents[1] / "public" / "features" / "editor-export-compose.png"
BACKUP = Path(__file__).resolve().parents[1] / "scripts" / "realesrgan-out" / "editor-export-compose-src.png"


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
    # stronger purple/pink UI glow only
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
    # lavender / near-white page mist
    if v >= 0.91 and s <= 0.14 and mn >= 220:
        return True
    if v >= 0.89 and 0.02 <= s <= 0.18 and 0.55 <= h <= 0.95 and mn >= 210:
        return True
    return False


def main() -> None:
    BACKUP.parent.mkdir(parents=True, exist_ok=True)
    src_img = Image.open(SRC).convert("RGBA")
    src_img.save(BACKUP, "PNG", compress_level=1)

    img = src_img.copy()
    w, h = img.size
    px = img.load()

    protect = Image.new("L", (w, h), 0)
    pp = protect.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_content(r, g, b, a):
                pp[x, y] = 255

    # Dilate so white card fill stays sealed behind chrome/shadows
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

    removed = 0
    while q:
        x, y = q.popleft()
        px[x, y] = (0, 0, 0, 0)
        removed += 1
        for dx, dy in dirs:
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny] and pp[nx, ny] == 0:
                r, g, b, a = px[nx, ny]
                if is_outer(r, g, b, a):
                    visited[nx][ny] = True
                    q.append((nx, ny))

    # Force-clear any leftover mist still touching the transparent edge
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
            removed += 1

    bbox = img.getbbox()
    if bbox:
        x0, y0, x1, y1 = bbox
        pad = 1
        img = img.crop(
            (max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad))
        )

    px = img.load()
    W, H = img.size
    print(f"removed {removed}; final {img.size}")
    print("corners", px[0, 0], px[W - 1, 0], px[0, H - 1], px[W - 1, H - 1])
    img.save(OUT, "PNG", compress_level=1)
    print("saved", OUT)


if __name__ == "__main__":
    main()
