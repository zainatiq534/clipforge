from PIL import Image

im = Image.open(
    r"c:\Users\DELL\Desktop\clipforge\frontend\public\features\platform-showcase-hq.png"
).convert("RGBA")
w, h = im.size
px = im.load()

# Find opaque bounding box
minx, miny, maxx, maxy = w, h, 0, 0
opaque = 0
for y in range(h):
    for x in range(w):
        if px[x, y][3] > 40:
            opaque += 1
            minx = min(minx, x)
            miny = min(miny, y)
            maxx = max(maxx, x)
            maxy = max(maxy, y)

print("size", w, h)
print("bbox", minx, miny, maxx, maxy, "bbox_size", maxx - minx + 1, maxy - miny + 1)
print("opaque%", round(100 * opaque / (w * h), 1))

# Sample horizontal opaque density at mid phone band and presets band
for band_name, y0, y1 in [("top", 80, 200), ("mid", 500, 700), ("lower", 900, 1100), ("bottom", 1400, 1600)]:
    counts = []
    for x in range(0, w, 40):
        c = 0
        for y in range(y0, y1):
            if px[x, y][3] > 40:
                c += 1
        counts.append(c)
    print(band_name, counts)
