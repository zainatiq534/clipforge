"""Captions mockup: outer page bg only. Keep UI cards, icons, outlines."""
from PIL import Image, ImageFilter
import collections
import colorsys

src_in = r"c:\Users\DELL\Desktop\clipforge\frontend\public\features\captions-mockup-original.png"
src_out = r"c:\Users\DELL\Desktop\clipforge\frontend\public\features\captions-mockup.png"

img = Image.open(src_in).convert("RGBA")
w, h = img.size
px = img.load()


def hsv(r, g, b):
    return colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)


def is_content(r, g, b, a):
    """UI / video / outlines — NOT flat page silk."""
    if a < 20:
        return False
    h_val, s, v = hsv(r, g, b)
    # dark / mid tones = content
    if v < 0.86:
        return True
    # real color (borders, purple accents, icons)
    if s >= 0.14:
        return True
    # soft purple outline glow (need enough sat to not eat page mist)
    if s >= 0.10 and 0.58 <= h_val <= 0.92 and v >= 0.80:
        return True
    return False


def is_canvas(r, g, b, a):
    if is_content(r, g, b, a):
        return False
    if a < 20:
        return True
    _, s, v = hsv(r, g, b)
    if min(r, g, b) >= 238:
        return True
    if v >= 0.92 and s <= 0.12 and min(r, g, b) >= 225:
        return True
    if v >= 0.90 and s <= 0.10 and min(r, g, b) >= 228:
        return True
    if v >= 0.90 and s <= 0.14 and b >= g >= r - 5 and min(r, g, b) >= 215:
        return True
    return False


protect = Image.new("L", (w, h), 0)
pp = protect.load()
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if is_content(r, g, b, a):
            pp[x, y] = 255

# Dilate so card outlines / soft glows stay attached
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
print(f"removed {removed} ({100 * removed / (w * h):.1f}%)")
print("corners", px[5, 5], px[50, 50], px[w - 5, 5], px[5, h - 5])
print("sidebar-ish", px[40, 120])
print("video-ish", px[220, 180])
