#!/usr/bin/env python3
"""
Generate app icons with flexible parameter logic.
- If a size is specified without a color, it scales the existing icon as-is.
- If a color preset is specified, it masks the text and changes the background color.

Usage:
    python3 generate_icons.py <input-filename> [preset-color / SIZE] [SIZE]

Examples:
    python3 generate_icons.py logo.png 256          # Scales existing icon as-is to 256x256
    python3 generate_icons.py logo.png cyan 256     # Applies cyan background and scales to 256x256
"""
import sys
import os
from PIL import Image

COLOR_PRESETS = {
    "orange": (244, 111, 35, 255),
    "red": (235, 10, 10, 255),
    "yellow": (255, 210, 32, 255),
    "blue": (0, 102, 255, 255),
    "green": (0, 200, 80, 255),
    "purple": (120, 40, 240, 255),
    "cyan": (0, 210, 255, 255),
    "magenta": (240, 0, 140, 255)
}

if len(sys.argv) < 2:
    print("Error: Missing input filename.", file=sys.stderr)
    print("Usage: python3 generate_icons.py <input-filename> [color] [SIZE]", file=sys.stderr)
    sys.exit(1)

LOGO_PATH = sys.argv[1]
PRESET_CHOICE = None  # None indicates we should preserve original styling as-is
SIZE = 256            # Smart default size

if not os.path.exists(LOGO_PATH):
    print(f"Error: File '{LOGO_PATH}' not found.", file=sys.stderr)
    sys.exit(1)

# Smart Parsing logic for flexible command line entries
if len(sys.argv) == 3:
    arg2 = sys.argv[2]
    if arg2.isdigit():
        SIZE = int(arg2)  # User passed: python3 generate_icons.py logo.png 256
    else:
        PRESET_CHOICE = arg2.lower()  # User passed: python3 generate_icons.py logo.png blue
elif len(sys.argv) > 3:
    PRESET_CHOICE = sys.argv[2].lower()
    try:
        SIZE = int(sys.argv[3])  # User passed: python3 generate_icons.py logo.png blue 256
    except ValueError:
        print("Error: The third argument (SIZE) must be an integer.", file=sys.stderr)
        sys.exit(1)

base_name, _ = os.path.splitext(os.path.basename(LOGO_PATH))
src_img = Image.open(LOGO_PATH).convert("RGBA")

# 1. PATH A: Scale original image as-is (No color preset provided)
if PRESET_CHOICE is None:
    print(f"Config: Mode=As-Is Scaling, Canvas Size={SIZE}x{SIZE}px")
    
    # Standard resize preserving layout aspect ratios directly onto the new canvas
    resized_canvas = src_img.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    final_output = resized_canvas.convert("RGB")
    output_filename = f"{base_name}-asis-{SIZE}.png"
    final_output.save(output_filename, "PNG")

# 2. PATH B: Handle Color Swapping and Transparency Masking
else:
    if PRESET_CHOICE in COLOR_PRESETS:
        BG_COLOR = COLOR_PRESETS[PRESET_CHOICE]
        print(f"Config: Mode=Color-Swap ('{PRESET_CHOICE}'), Canvas Size={SIZE}x{SIZE}px")
    else:
        supported = ", ".join(COLOR_PRESETS.keys())
        print(f"Error: Unknown preset '{PRESET_CHOICE}'. Supported: {supported}", file=sys.stderr)
        sys.exit(1)

    gray_img = src_img.convert("L")
    mask = gray_img.point(lambda p: 255 if p < 120 else 0, mode='1')

    black_layer = Image.new("RGBA", src_img.size, (0, 0, 0, 255))
    logo_transparent = Image.new("RGBA", src_img.size, (0, 0, 0, 0))
    logo_transparent.paste(black_layer, (0, 0), mask)

    bbox = logo_transparent.getbbox()
    if bbox:
        logo_transparent = logo_transparent.crop(bbox)

    lw, lh = logo_transparent.size
    target_size = SIZE
    safe_bounding_size = round(target_size * (820 / 1024))

    scale = safe_bounding_size / max(lw, lh)
    new_w, new_h = max(1, round(lw * scale)), max(1, round(lh * scale))
    resized_logo = logo_transparent.resize((new_w, new_h), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (target_size, target_size), BG_COLOR)
    canvas.paste(resized_logo, ((target_size - new_w) // 2, (target_size - new_h) // 2), resized_logo)

    final_output = canvas.convert("RGB")
    output_filename = f"{base_name}-{PRESET_CHOICE}-{target_size}.png"
    final_output.save(output_filename, "PNG")

print(f"Success! Generated asset: {output_filename}")

