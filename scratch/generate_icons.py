import os
import base64
from PIL import Image, ImageFilter
import numpy as np
from collections import deque

src_path = r"C:\Users\dhrub\.gemini\antigravity\brain\35f30af5-2408-4ee9-9c49-665a1f05b0a7\.user_uploaded\media_1795081247520_c04fd3d9.jpg"
out_dir = r"c:\Users\dhrub\Documents\student-data\icons"

if not os.path.exists(src_path):
    raise FileNotFoundError(f"Source image not found: {src_path}")

orig = Image.open(src_path)
arr = np.array(orig, dtype=float)
H, W, _ = arr.shape

# Detect checkerboard background pixels (near-zero color difference and high brightness)
diff = np.max(arr, axis=2) - np.min(arr, axis=2)
mean_val = np.mean(arr, axis=2)
is_bg_candidate = (diff < 20) & (mean_val > 165)

# Border-connected flood fill so interior gray toggles/buttons are never affected
visited = np.zeros((H, W), dtype=bool)
queue = deque()
for x in range(W):
    if is_bg_candidate[0, x]:
        visited[0, x] = True
        queue.append((0, x))
    if is_bg_candidate[H - 1, x]:
        visited[H - 1, x] = True
        queue.append((H - 1, x))

for y in range(H):
    if is_bg_candidate[y, 0] and not visited[y, 0]:
        visited[y, 0] = True
        queue.append((y, 0))
    if is_bg_candidate[y, W - 1] and not visited[y, W - 1]:
        visited[y, W - 1] = True
        queue.append((y, W - 1))

while queue:
    cy, cx = queue.popleft()
    for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        ny, nx = cy + dy, cx + dx
        if 0 <= ny < H and 0 <= nx < W:
            if not visited[ny, nx] and is_bg_candidate[ny, nx]:
                visited[ny, nx] = True
                queue.append((ny, nx))

# Smooth anti-aliased edge mask
raw_mask = (~visited).astype(np.uint8) * 255
mask_img = Image.fromarray(raw_mask, mode="L")
smooth_mask = mask_img.filter(ImageFilter.GaussianBlur(radius=0.75))

fg = orig.convert("RGBA")
fg.putalpha(smooth_mask)
bbox = smooth_mask.getbbox()
cropped = fg.crop(bbox)

# 1. Base 512x512 Canvas with Radial Dark Navy Studio Gradient
W_CANVAS, H_CANVAS = 512, 512
y_grid, x_grid = np.ogrid[:H_CANVAS, :W_CANVAS]
dist = np.sqrt((x_grid - 256) ** 2 + (y_grid - 256) ** 2)
max_dist = np.sqrt(256**2 + 256**2)
factor = np.clip(dist / max_dist, 0, 1)

r = (24 * (1 - factor) + 6 * factor).astype(np.uint8)
g = (34 * (1 - factor) + 10 * factor).astype(np.uint8)
b = (64 * (1 - factor) + 20 * factor).astype(np.uint8)
a = np.full((H_CANVAS, W_CANVAS), 255, dtype=np.uint8)
bg_grad = Image.fromarray(np.dstack([r, g, b, a]), mode="RGBA")

# Scale to fit comfortably within Android's 80% circular safe zone (370px)
target_size = 370
scale = min(target_size / cropped.width, target_size / cropped.height)
cw, ch = int(cropped.width * scale), int(cropped.height * scale)
scaled_512 = cropped.resize((cw, ch), Image.Resampling.LANCZOS)
pos_x = (W_CANVAS - cw) // 2
pos_y = (H_CANVAS - ch) // 2 - 4

# Soft 3D contact shadow
shadow_canvas = Image.new("RGBA", (W_CANVAS, H_CANVAS), (0, 0, 0, 0))
s_alpha = scaled_512.split()[-1]
shadow_color = Image.new("RGBA", (cw, ch), (0, 0, 0, 150))
shadow_canvas.paste(shadow_color, (pos_x, pos_y + 14), s_alpha)
shadow_canvas = shadow_canvas.filter(ImageFilter.GaussianBlur(radius=12))

final_512 = Image.alpha_composite(bg_grad, shadow_canvas)
final_512.paste(scaled_512, (pos_x, pos_y), scaled_512)

# Generate 192x192 version
final_192 = final_512.resize((192, 192), Image.Resampling.LANCZOS)

# Save icons
p_512 = os.path.join(out_dir, "icon-512.png")
final_512.save(p_512, "PNG", optimize=True)
print(f"Saved {p_512} ({os.path.getsize(p_512)} bytes)")

p_192 = os.path.join(out_dir, "icon-192.png")
final_192.save(p_192, "PNG", optimize=True)
print(f"Saved {p_192} ({os.path.getsize(p_192)} bytes)")

p_m512 = os.path.join(out_dir, "icon-maskable-512.png")
final_512.save(p_m512, "PNG", optimize=True)
print(f"Saved {p_m512} ({os.path.getsize(p_m512)} bytes)")

p_m192 = os.path.join(out_dir, "icon-maskable-192.png")
final_192.save(p_m192, "PNG", optimize=True)
print(f"Saved {p_m192} ({os.path.getsize(p_m192)} bytes)")

# Favicon: 64x64 transparent crisp 3D calendar for browser tabs and notification badges
fav_scale = min(58 / cropped.width, 58 / cropped.height)
fw, fh = int(cropped.width * fav_scale), int(cropped.height * fav_scale)
scaled_fav = cropped.resize((fw, fh), Image.Resampling.LANCZOS)
fav_img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
fav_img.paste(scaled_fav, ((64 - fw) // 2, (64 - fh) // 2), scaled_fav)
p_fav = os.path.join(out_dir, "favicon.png")
fav_img.save(p_fav, "PNG", optimize=True)
print(f"Saved {p_fav} ({os.path.getsize(p_fav)} bytes)")

# SVG with squircle clip
with open(p_512, "rb") as f:
    b64_data = base64.b64encode(f.read()).decode("utf-8")

svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <clipPath id="squircleClip">
      <rect width="512" height="512" rx="112" ry="112" />
    </clipPath>
  </defs>
  <image href="data:image/png;base64,{b64_data}" width="512" height="512" preserveAspectRatio="xMidYMid slice" clip-path="url(#squircleClip)" />
</svg>
"""
p_svg = os.path.join(out_dir, "icon.svg")
with open(p_svg, "w", encoding="utf-8") as f:
    f.write(svg_content)
print(f"Saved {p_svg} ({os.path.getsize(p_svg)} bytes)")

print("All 6 PWA icon assets generated successfully!")
