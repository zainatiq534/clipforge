"""
Remove outer page canvas only — preserve purple/pink card glow outlines.
"""
from PIL import Image, ImageFilter
import collections
import colorsys
import sys

src_in = sys.argv[1]
src_out = sys.argv[2]

img = Image.open(src_in).convert("RGBA")
w, h = img.size
px = img.load()


def hsv(r, g, b):
    return colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)


def is_glow_or_content(r, g, b, a):
    """Anything that is UI content OR soft purple/pink outline glow."""
    if a < 20:
        return False
    h_val, s, v = hsv(r, g, b)

    # dark / mid content
    if v < 0.88:
        return True
    # saturated color (borders, buttons, brand)
    if s >= 0.12:
        # purple / pink / blue glow hues
        if 0.55 <= h_val <= 0.95 or h_val <= 0.08:
            return True
        if s >= 0.22:
            return True
    # soft lavender glow fringe still counts as outline
    if s >= 0.06 and v >= 0.85 and (0.6 <= h_val <= 0.92):
        return True
    return False


def is_canvas(r, g, b, a):
    if is_glow_or_content(r, g, b, a):
        return False
    if a < 20:
        return True
    _, s, v = hsv(r, g, b)
    if min(r, g, b) >= 240:
        return True
    if v >= 0.93 and s <= 0.10 and min(r, g, b) >= 228:
        return True
    if v >= 0.90 and s <= 0.08 and min(r, g, b) >= 232:
        return True
    # cool mist only if very desaturated
    if v >= 0.92 and s <= 0.12 and b >= g >= r and min(r, g, b) >= 220:
        return True
    return False


# Protect content + glow, dilate so outline halo stays
protect = Image.new("L", (w, h), 0)
pp = protect.load()
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if is_glow_or_content(r, g, b, a):
            pp[x, y] = 255

protect = protect.filter(ImageFilter.MaxFilter(5))
protect = protect.filter(ImageFilter.MaxFilter(3))
pp = protect.load()

visited = [[False] * h for _ in range(w)]
q = collections.deque()
dirs = ((1, 0), (-1, 0), (0, 1), (0, -1))

for x in range(w):
    for y in (0, h - 1):
        r, g, b, a = px[x, y]
        if is_canvas(r, g, b, a) and pp[x, y] == 0 and not visited[x][y]:
            q.append((x, y))
            visited[x][y] = True
for y in range(h):
    for x in (0, w - 1):
        if visited[x][y]:
            continue
        r, g, b, a = px[x, y]
        if is_canvas(r, g, b, a) and pp[x, y] == 0:
            q.append((x, y))
            visited[x][y] = True

removed = 0
while q:
    x, y = q.popleft()
    px[x, y] = (0, 0, 0, 0)
    removed += 1
    for dx, dy in dirs:
        nx, ny = x + dx, y + dy
        if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny]:
            if pp[nx, ny] != 0:
                continue
            r, g, b, a = px[nx, ny]
            if is_canvas(r, g, b, a):
                visited[nx][ny] = True
                q.append((nx, ny))

img.save(src_out, "PNG")
print(f"{src_in} -> {src_out}")
print(f"removed {removed} ({100 * removed / (w * h):.1f}%)")
