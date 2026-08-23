"""Flatten Vendor2.png onto a solid white background.

Vendor2.png is an RGBA PNG with a transparent background, while the other
vendor images are opaque JPEGs. This script composites Vendor2's artwork onto
an opaque white canvas, keeping the exact same square dimensions (800x800) so
it renders at the same size/aspect ratio as the other vendor images without any
cropping, stretching, or distortion of the artwork itself.
"""
from PIL import Image

SRC = "src/images/Vendor2.png"
DST = "src/images/Vendor2.png"

im = Image.open(SRC).convert("RGBA")

# Create an opaque white canvas of the same dimensions.
white = Image.new("RGBA", im.size, (255, 255, 255, 255))

# Composite the vendor artwork onto the white background (alpha compositing).
composite = Image.alpha_composite(white, im).convert("RGB")

# Preserve the original size/aspect ratio exactly; just drop the alpha so the
# result is an opaque RGB image like the other vendors.
print(f"Input : {im.size} mode={im.mode}")
print(f"Output: {composite.size} mode={composite.mode}")
composite.save(DST)
print("Saved:", DST)
