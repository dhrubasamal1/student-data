import os
import base64
from PIL import Image

src_path = r"C:\Users\dhrub\.gemini\antigravity\brain\35f30af5-2408-4ee9-9c49-665a1f05b0a7\app_icon_1795030919439.jpg"
out_dir = r"c:\Users\dhrub\Documents\student-data\icons"

if not os.path.exists(src_path):
    raise FileNotFoundError(f"Source image not found: {src_path}")

img = Image.open(src_path).convert("RGBA")
print(f"Loaded source image: {img.size}")

# 1. Generate 512x512
img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
p_512 = os.path.join(out_dir, "icon-512.png")
img_512.save(p_512, "PNG", optimize=True)
print(f"Saved {p_512} ({os.path.getsize(p_512)} bytes)")

# 2. Generate 192x192
img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
p_192 = os.path.join(out_dir, "icon-192.png")
img_192.save(p_192, "PNG", optimize=True)
print(f"Saved {p_192} ({os.path.getsize(p_192)} bytes)")

# 3. Generate maskable 512x512 (full bleed)
p_m512 = os.path.join(out_dir, "icon-maskable-512.png")
img_512.save(p_m512, "PNG", optimize=True)
print(f"Saved {p_m512} ({os.path.getsize(p_m512)} bytes)")

# 4. Generate maskable 192x192 (full bleed)
p_m192 = os.path.join(out_dir, "icon-maskable-192.png")
img_192.save(p_m192, "PNG", optimize=True)
print(f"Saved {p_m192} ({os.path.getsize(p_m192)} bytes)")

# 5. Generate favicon 64x64
img_fav = img.resize((64, 64), Image.Resampling.LANCZOS)
p_fav = os.path.join(out_dir, "favicon.png")
img_fav.save(p_fav, "PNG", optimize=True)
print(f"Saved {p_fav} ({os.path.getsize(p_fav)} bytes)")

# 6. Generate SVG containing base64 data
with open(p_512, "rb") as f:
    b64_data = base64.b64encode(f.read()).decode("utf-8")

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <clipPath id="squircleClip">
      <rect width="512" height="512" rx="112" ry="112" />
    </clipPath>
  </defs>
  <image href="data:image/png;base64,{b64_data}" width="512" height="512" preserveAspectRatio="xMidYMid slice" clip-path="url(#squircleClip)" />
</svg>
'''
p_svg = os.path.join(out_dir, "icon.svg")
with open(p_svg, "w", encoding="utf-8") as f:
    f.write(svg_content)
print(f"Saved {p_svg} ({os.path.getsize(p_svg)} bytes)")

print("All icons successfully generated!")
