import type { PixelData, Palette, RGB } from '../types';

// Render pixel data to canvas with scaling
export function renderPixelsToCanvas(
  canvas: HTMLCanvasElement,
  pixels: PixelData,
  palette: Palette,
  scale = 1,
  showGrid = false
): void {
  const size = pixels.length;
  canvas.width = size * scale;
  canvas.height = size * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw pixels
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const colorIndex = pixels[y][x];

      // Skip transparent pixels (index 0 typically, but check palette)
      if (palette.transparent !== undefined && colorIndex === palette.transparent) {
        continue;
      }

      const color = palette.colors[colorIndex] || { r: 0, g: 0, b: 0 };
      ctx.fillStyle = rgbToHex(color);
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }

  // Draw grid
  if (showGrid && scale >= 4) {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;

    for (let i = 0; i <= size; i++) {
      ctx.beginPath();
      ctx.moveTo(i * scale, 0);
      ctx.lineTo(i * scale, size * scale);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * scale);
      ctx.lineTo(size * scale, i * scale);
      ctx.stroke();
    }
  }
}

// Convert RGB to hex color string
export function rgbToHex(color: RGB): string {
  const r = Math.max(0, Math.min(255, color.r));
  const g = Math.max(0, Math.min(255, color.g));
  const b = Math.max(0, Math.min(255, color.b));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
    .toString(16)
    .padStart(2, '0')}`;
}

// Convert hex to RGB
export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Create image data from pixel data
export function createImageData(pixels: PixelData, palette: Palette): ImageData {
  const size = pixels.length;
  const imageData = new ImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const colorIndex = pixels[y][x];
      const color = palette.colors[colorIndex] || { r: 0, g: 0, b: 0 };
      const index = (y * size + x) * 4;

      imageData.data[index] = color.r;
      imageData.data[index + 1] = color.g;
      imageData.data[index + 2] = color.b;

      // Alpha channel (transparent if index matches transparent color)
      imageData.data[index + 3] =
        palette.transparent !== undefined && colorIndex === palette.transparent ? 0 : 255;
    }
  }

  return imageData;
}

// Export canvas to blob
export function canvasToBlob(canvas: HTMLCanvasElement, mimeType = 'image/png'): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      mimeType,
      1.0
    );
  });
}

// Export canvas to data URL
export function canvasToDataURL(canvas: HTMLCanvasElement, mimeType = 'image/png'): string {
  return canvas.toDataURL(mimeType, 1.0);
}

// Create sprite sheet from multiple frames
export function createSpriteSheet(
  frames: PixelData[],
  palette: Palette,
  layout: 'horizontal' | 'vertical' | 'grid' = 'horizontal',
  padding = 0,
  scale = 1
): HTMLCanvasElement {
  if (frames.length === 0) {
    const emptyCanvas = document.createElement('canvas');
    emptyCanvas.width = 1;
    emptyCanvas.height = 1;
    return emptyCanvas;
  }

  const frameSize = frames[0].length;
  const scaledSize = frameSize * scale;
  const scaledPadding = padding * scale;

  let width: number, height: number, cols: number, rows: number;

  if (layout === 'horizontal') {
    cols = frames.length;
    rows = 1;
    width = cols * scaledSize + (cols - 1) * scaledPadding;
    height = scaledSize;
  } else if (layout === 'vertical') {
    cols = 1;
    rows = frames.length;
    width = scaledSize;
    height = rows * scaledSize + (rows - 1) * scaledPadding;
  } else {
    // Grid layout
    cols = Math.ceil(Math.sqrt(frames.length));
    rows = Math.ceil(frames.length / cols);
    width = cols * scaledSize + (cols - 1) * scaledPadding;
    height = rows * scaledSize + (rows - 1) * scaledPadding;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Clear with transparent background
  ctx.clearRect(0, 0, width, height);

  // Render each frame
  frames.forEach((pixels, index) => {
    const col = layout === 'vertical' ? 0 : layout === 'horizontal' ? index : index % cols;
    const row =
      layout === 'horizontal' ? 0 : layout === 'vertical' ? index : Math.floor(index / cols);

    const x = col * (scaledSize + scaledPadding);
    const y = row * (scaledSize + scaledPadding);

    // Create temporary canvas for this frame
    const tempCanvas = document.createElement('canvas');
    renderPixelsToCanvas(tempCanvas, pixels, palette, scale, false);

    // Draw to sprite sheet
    ctx.drawImage(tempCanvas, x, y);
  });

  return canvas;
}

// Draw checkerboard background (for transparency visualization)
export function drawCheckerboard(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cellSize = 8
): void {
  const lightColor = '#ffffff';
  const darkColor = '#cccccc';

  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      const isLight = ((x / cellSize) % 2 === 0) !== ((y / cellSize) % 2 === 0);
      ctx.fillStyle = isLight ? lightColor : darkColor;
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }
}
