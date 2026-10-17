from PIL import Image

src_path = r"c:\Users\DELL\Desktop\clipforge\frontend\public\features\platform-showcase.png"
out_path = r"c:\Users\DELL\Desktop\clipforge\frontend\public\features\platform-showcase-hq.png"

im = Image.open(src_path).convert("RGBA")
w, h = im.size
px = im.load()

for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a < 8:
            continue
        mx = max(r, g, b)
        mn = min(r, g, b)
        sat = mx - mn
        # washed pastel / near-white
        if r > 210 and g > 210 and b > 220 and sat < 55:
            px[x, y] = (0, 0, 0, 0)
            continue
        # soft blue-lavender blobs
        if r > 190 and g > 195 and b > 220 and sat < 70 and b >= r and b >= g:
            px[x, y] = (0, 0, 0, 0)
            continue
        # soft pink-lavender blobs
        if r > 220 and g > 200 and b > 230 and sat < 60:
            px[x, y] = (0, 0, 0, 0)
            continue
        # pale gray-white
        if r > 235 and g > 235 and b > 235 and sat < 20:
            px[x, y] = (0, 0, 0, 0)

hq = im.resize((w * 3, h * 3), Image.Resampling.LANCZOS)
hq.save(out_path, "PNG", optimize=True)
print("saved", out_path, hq.size, hq.mode)
data = list(hq.getdata())
trans = sum(1 for _r, _g, _b, a in data if a < 10)
print("transparent%", round(100 * trans / len(data), 1))
