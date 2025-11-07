import type { Palette, RGB } from '../types';

// Utility to create RGB colors
const rgb = (r: number, g: number, b: number): RGB => ({ r, g, b });

// Game Boy (4 colors)
export const GB_PALETTE: Palette = {
  id: 'gb_four',
  name: 'Game Boy (4 colors)',
  colors: [
    rgb(15, 56, 15),    // Darkest green
    rgb(48, 98, 48),    // Dark green
    rgb(139, 172, 15),  // Light green
    rgb(155, 188, 15),  // Lightest green
  ],
  transparent: undefined,
};

// NES Palette (simplified subset)
export const NES_PALETTE: Palette = {
  id: 'nes',
  name: 'NES (16 colors)',
  colors: [
    rgb(0, 0, 0),       // Black
    rgb(252, 252, 252), // White
    rgb(248, 56, 0),    // Red
    rgb(252, 160, 68),  // Orange
    rgb(252, 224, 168), // Tan
    rgb(0, 232, 216),   // Cyan
    rgb(60, 188, 252),  // Light Blue
    rgb(0, 120, 248),   // Blue
    rgb(104, 68, 252),  // Purple
    rgb(216, 0, 204),   // Magenta
    rgb(228, 92, 16),   // Brown
    rgb(172, 124, 0),   // Dark Orange
    rgb(0, 184, 0),     // Green
    rgb(0, 168, 0),     // Dark Green
    rgb(164, 228, 252), // Pale Blue
    rgb(188, 188, 188), // Gray
  ],
  transparent: 0,
};

// PICO-8 Palette (16 colors)
export const PICO8_PALETTE: Palette = {
  id: 'pico8',
  name: 'PICO-8 (16 colors)',
  colors: [
    rgb(0, 0, 0),       // Black
    rgb(29, 43, 83),    // Dark Blue
    rgb(126, 37, 83),   // Dark Purple
    rgb(0, 135, 81),    // Dark Green
    rgb(171, 82, 54),   // Brown
    rgb(95, 87, 79),    // Dark Gray
    rgb(194, 195, 199), // Light Gray
    rgb(255, 241, 232), // White
    rgb(255, 0, 77),    // Red
    rgb(255, 163, 0),   // Orange
    rgb(255, 236, 39),  // Yellow
    rgb(0, 228, 54),    // Green
    rgb(41, 173, 255),  // Blue
    rgb(131, 118, 156), // Indigo
    rgb(255, 119, 168), // Pink
    rgb(255, 204, 170), // Peach
  ],
  transparent: 0,
};

// Commodore 64 Palette
export const C64_PALETTE: Palette = {
  id: 'c64',
  name: 'Commodore 64 (16 colors)',
  colors: [
    rgb(0, 0, 0),       // Black
    rgb(255, 255, 255), // White
    rgb(136, 0, 0),     // Red
    rgb(170, 255, 238), // Cyan
    rgb(204, 68, 204),  // Purple
    rgb(0, 204, 85),    // Green
    rgb(0, 0, 170),     // Blue
    rgb(238, 238, 119), // Yellow
    rgb(221, 136, 85),  // Orange
    rgb(102, 68, 0),    // Brown
    rgb(255, 119, 119), // Light Red
    rgb(51, 51, 51),    // Dark Gray
    rgb(119, 119, 119), // Gray
    rgb(170, 255, 102), // Light Green
    rgb(0, 136, 255),   // Light Blue
    rgb(187, 187, 187), // Light Gray
  ],
  transparent: 0,
};

// DawnBringer 16
export const DB16_PALETTE: Palette = {
  id: 'db16',
  name: 'DawnBringer 16',
  colors: [
    rgb(20, 12, 28),    // Black
    rgb(68, 36, 52),    // Dark Purple
    rgb(48, 52, 109),   // Dark Blue
    rgb(78, 74, 78),    // Dark Gray
    rgb(133, 76, 48),   // Brown
    rgb(52, 101, 36),   // Dark Green
    rgb(208, 70, 72),   // Red
    rgb(117, 113, 97),  // Gray
    rgb(89, 125, 206),  // Blue
    rgb(210, 125, 44),  // Orange
    rgb(133, 149, 161), // Light Gray
    rgb(109, 170, 44),  // Green
    rgb(210, 170, 153), // Tan
    rgb(109, 194, 202), // Cyan
    rgb(218, 212, 94),  // Yellow
    rgb(222, 238, 214), // White
  ],
  transparent: undefined,
};

// PC-98 inspired (8 colors)
export const PC98_PALETTE: Palette = {
  id: 'pc98',
  name: 'PC-98 Style (8 colors)',
  colors: [
    rgb(0, 0, 0),       // Black
    rgb(0, 0, 170),     // Blue
    rgb(0, 170, 0),     // Green
    rgb(0, 170, 170),   // Cyan
    rgb(170, 0, 0),     // Red
    rgb(170, 0, 170),   // Magenta
    rgb(170, 85, 0),    // Brown
    rgb(170, 170, 170), // Light Gray
  ],
  transparent: 0,
};

// Monochrome palettes
export const MONO_PALETTE: Palette = {
  id: 'mono',
  name: 'Monochrome (4 shades)',
  colors: [
    rgb(0, 0, 0),       // Black
    rgb(85, 85, 85),    // Dark Gray
    rgb(170, 170, 170), // Light Gray
    rgb(255, 255, 255), // White
  ],
  transparent: undefined,
};

// CGA Palette (4 colors - magenta/cyan/white)
export const CGA_PALETTE: Palette = {
  id: 'cga',
  name: 'CGA (4 colors)',
  colors: [
    rgb(0, 0, 0),       // Black
    rgb(0, 170, 170),   // Cyan
    rgb(170, 0, 170),   // Magenta
    rgb(170, 170, 170), // White
  ],
  transparent: 0,
};

// All available palettes
export const PALETTES: Record<string, Palette> = {
  gb_four: GB_PALETTE,
  nes: NES_PALETTE,
  pico8: PICO8_PALETTE,
  c64: C64_PALETTE,
  db16: DB16_PALETTE,
  pc98: PC98_PALETTE,
  mono: MONO_PALETTE,
  cga: CGA_PALETTE,
};

// Get palette by ID
export function getPalette(id: string): Palette {
  return PALETTES[id] || GB_PALETTE;
}

// Color distance calculation (Euclidean in RGB space)
export function colorDistance(c1: RGB, c2: RGB): number {
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

// Find closest color in palette
export function findClosestColor(color: RGB, palette: Palette): number {
  let minDistance = Infinity;
  let closestIndex = 0;

  palette.colors.forEach((paletteColor, index) => {
    const distance = colorDistance(color, paletteColor);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

// Floyd-Steinberg dithering
export function ditherImage(
  pixels: RGB[][],
  palette: Palette
): number[][] {
  const height = pixels.length;
  const width = pixels[0]?.length || 0;
  const result: number[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill(0));

  // Create a copy for error diffusion
  const working: RGB[][] = pixels.map(row =>
    row.map(pixel => ({ ...pixel }))
  );

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const oldPixel = working[y][x];
      const newIndex = findClosestColor(oldPixel, palette);
      const newPixel = palette.colors[newIndex];

      result[y][x] = newIndex;

      // Calculate error
      const errR = oldPixel.r - newPixel.r;
      const errG = oldPixel.g - newPixel.g;
      const errB = oldPixel.b - newPixel.b;

      // Distribute error to neighboring pixels
      const distributeError = (dx: number, dy: number, factor: number) => {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          working[ny][nx].r = Math.max(0, Math.min(255, working[ny][nx].r + errR * factor));
          working[ny][nx].g = Math.max(0, Math.min(255, working[ny][nx].g + errG * factor));
          working[ny][nx].b = Math.max(0, Math.min(255, working[ny][nx].b + errB * factor));
        }
      };

      distributeError(1, 0, 7 / 16);
      distributeError(-1, 1, 3 / 16);
      distributeError(0, 1, 5 / 16);
      distributeError(1, 1, 1 / 16);
    }
  }

  return result;
}

// Simple quantization (no dithering)
export function quantizeImage(
  pixels: RGB[][],
  palette: Palette
): number[][] {
  return pixels.map(row =>
    row.map(pixel => findClosestColor(pixel, palette))
  );
}
