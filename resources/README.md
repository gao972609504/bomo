# Resources

This directory contains application icons and assets for 泊墨 (Bomo).

## Required Icons

| File | Size | Format | Usage |
|------|------|--------|-------|
| `icon.png` | 256×256 | PNG | Linux / fallback |
| `icon.ico` | 256×256 | ICO | Windows |
| `icon.icns` | 512×512 | ICNS | macOS |

## How to Generate Icons

1. Prepare a 1024×1024 PNG source image
2. Use [electron-icon-builder](https://github.com/nicktoby/electron-icon-builder) or [electron-icon-maker](https://github.com/jaretburkett/electron-icon-maker):

```bash
# Install tool
npm install -g electron-icon-builder

# Generate all formats from a 1024x1024 PNG
electron-icon-builder --input=./icon-source.png --output=./resources
```

## Notes

- The `icon.ico` must contain multiple sizes: 16×16, 24×24, 32×32, 48×48, 64×64, 128×128, 256×256
- The `icon.icns` must contain sizes from 16×16 up to 512×512@2x
- Keep the source SVG or high-resolution PNG for future edits
