"""
Only remove the OUTER page background behind the graphic.
Do NOT touch front content: cards, buttons, video, captions, glows, labels.
Method: flood-fill from image border only; stop at any non-canvas pixel.
"""
from PIL import Image, ImageFilter
import collections
import colorsys

src_in = r"c:\Users\DELL\Desktop\clipforge\frontend\public\features\platform-showcase-original.png"
src_out = r"c:\Users\DELL\Desktop\clipforge\frontend\public\features\platform-showcase-clean.png"

img = Image.open(src_in).convert("RGBA")
w, h = img.size
px = img.load()


def hsv(r, g, b):
    return colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)


def is_canvas(r, g, b, a):
    """Outer page fill only — bright + low saturation."""
    if a < 20:
        return True
    _, s, v = hsv(r, g, b)

    # stop before real content / purple glow / pink glow
    if v < 0.86:
        return False
    if s >= 0.18:
        return False

    # near-white / pale blue-lavender page
    if min(r, g, b) >= 238:
        return True
    if v >= 0.93 and s <= 0.12 and min(r, g, b) >= 225:
        return True
    if v >= 0.90 and s <= 0.10 and min(r, g, b) >= 230:
        return True
    # soft sky-blue mist (still page, not UI)
    if v >= 0.90 and s <= 0.16 and b >= g >= r and min(r, g, b) >= 200:
        return True
    return False


# Protect real content (anything that is NOT canvas), lightly dilated
# so soft card glows stay attached and flood can't leak inside.
protect = Image.new("L", (w, h), 0)
pp = protect.load()
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if not is_canvas(r, g, b, a):
            pp[x, y] = 255

protect = protect.filter(ImageFilter.MaxFilter(3))
pp = protect.load()

visited = [[False] * h for _ in range(w)]
q = collections.deque()
dirs = ((1, 0), (-1, 0), (0, 1), (0, -1))

# Seed ONLY from border
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
                continue  # never enter protected content
            r, g, b, a = px[nx, ny]
            if is_canvas(r, g, b, a):
                visited[nx][ny] = True
                q.append((nx, ny))

img.save(src_out, "PNG")
# also overwrite the other path used earlier
img.save(
    r"c:\Users\DELL\Desktop\clipforge\frontend\public\features\platform-showcase.png",
    "PNG",
)
print(f"saved {src_out}")
print(f"removed outer pixels only: {removed} ({100 * removed / (w * h):.1f}%)")
print("corners", px[2, 2], px[50, 50], px[470, 5])
# sanity: sample inside a card area should still be opaque
print("card sample (100,200)", px[100, 200])
print("card sample (240,200)", px[240, 200])
print("card sample (400,200)", px[400, 200])
