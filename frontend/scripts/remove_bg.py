"""Remove large page-canvas regions; keep small white UI badges/labels."""
from PIL import Image
import collections
import colorsys

src_in = r"c:\Users\DELL\Desktop\clipforge\frontend\public\features\reframe-showcase-original.png"
src_out = r"c:\Users\DELL\Desktop\clipforge\frontend\public\features\reframe-showcase-clean.png"

img = Image.open(src_in).convert("RGBA")
w, h = img.size
px = img.load()


def hsv(r, g, b):
    return colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)


def is_canvas(r, g, b, a):
    if a < 20:
        return True
    _, s, v = hsv(r, g, b)
    if r >= 245 and g >= 245 and b >= 245:
        return True
    if r >= 235 and g >= 232 and b >= 240 and s <= 0.12 and v >= 0.93:
        return True
    if r >= 228 and g >= 225 and b >= 235 and s <= 0.10 and v >= 0.91:
        return True
    return False


# Label every canvas-colored connected component
label = [[-1] * h for _ in range(w)]
components = []  # list of list[(x,y)]
dirs = ((1, 0), (-1, 0), (0, 1), (0, -1))
next_id = 0

for y in range(h):
    for x in range(w):
        if label[x][y] != -1:
            continue
        r, g, b, a = px[x, y]
        if not is_canvas(r, g, b, a):
            continue
        # BFS this component
        q = collections.deque([(x, y)])
        label[x][y] = next_id
        cells = [(x, y)]
        while q:
            cx, cy = q.popleft()
            for dx, dy in dirs:
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < w and 0 <= ny < h and label[nx][ny] == -1:
                    rr, gg, bb, aa = px[nx, ny]
                    if is_canvas(rr, gg, bb, aa):
                        label[nx][ny] = next_id
                        q.append((nx, ny))
                        cells.append((nx, ny))
        components.append(cells)
        next_id += 1

# Remove only large canvas components (page background).
# Keep small ones (BEFORE chip, AI badge, platform labels).
# Also remove components that touch the image border (always background).
AREA_KEEP_MAX = 600  # keep tiny badge/label islands only

removed = 0
for cells in components:
    area = len(cells)
    touches_border = any(
        x == 0 or y == 0 or x == w - 1 or y == h - 1 for x, y in cells
    )
    if touches_border or area > AREA_KEEP_MAX:
        for x, y in cells:
            px[x, y] = (0, 0, 0, 0)
            removed += 1

img.save(src_out, "PNG")
print(f"saved {src_out}")
print(f"components: {len(components)}")
print(f"removed pixels: {removed} ({100 * removed / (w * h):.1f}%)")
ox = Image.open(src_in).convert("RGBA").load()
# Count removed pixels that were NOT near-white page (should be ~0 for badges kept)
# Check BEFORE badge area still opaque
badge_ok = sum(1 for y in range(12, 40) for x in range(12, 90) if px[x, y][3] > 200)
print(f"BEFORE-badge opaque samples: {badge_ok}")
