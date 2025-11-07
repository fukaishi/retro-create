import type { PixelData, BodyType, CharacterClass, Element } from '../types';
import { SeededRandom } from './random';

// Color indices for parts (these map to palette indices)
export const COLOR_INDICES = {
  TRANSPARENT: 0,
  OUTLINE: 1,
  SKIN: 2,
  SKIN_SHADOW: 3,
  CLOTHING: 4,
  CLOTHING_SHADOW: 5,
  ACCENT: 6,
  ACCENT_HIGHLIGHT: 7,
};

// Create empty pixel grid
export function createEmptyPixels(size: number): PixelData {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(COLOR_INDICES.TRANSPARENT));
}

// Draw a pixel rectangle
export function drawRect(
  pixels: PixelData,
  x: number,
  y: number,
  w: number,
  h: number,
  color: number,
  filled = true
): void {
  if (filled) {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const px = x + dx;
        const py = y + dy;
        if (py >= 0 && py < pixels.length && px >= 0 && px < pixels[0].length) {
          pixels[py][px] = color;
        }
      }
    }
  } else {
    // Draw outline
    for (let dx = 0; dx < w; dx++) {
      if (y >= 0 && y < pixels.length && x + dx >= 0 && x + dx < pixels[0].length) {
        pixels[y][x + dx] = color;
      }
      if (y + h - 1 >= 0 && y + h - 1 < pixels.length && x + dx >= 0 && x + dx < pixels[0].length) {
        pixels[y + h - 1][x + dx] = color;
      }
    }
    for (let dy = 0; dy < h; dy++) {
      if (y + dy >= 0 && y + dy < pixels.length && x >= 0 && x < pixels[0].length) {
        pixels[y + dy][x] = color;
      }
      if (y + dy >= 0 && y + dy < pixels.length && x + w - 1 >= 0 && x + w - 1 < pixels[0].length) {
        pixels[y + dy][x + w - 1] = color;
      }
    }
  }
}

// Add outline to sprite
export function addOutline(pixels: PixelData, outlineColor = COLOR_INDICES.OUTLINE): PixelData {
  const size = pixels.length;
  const result = pixels.map(row => [...row]);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (pixels[y][x] !== COLOR_INDICES.TRANSPARENT) {
        // Check 4 neighbors
        const neighbors = [
          [x - 1, y],
          [x + 1, y],
          [x, y - 1],
          [x, y + 1],
        ];

        for (const [nx, ny] of neighbors) {
          if (
            nx >= 0 &&
            nx < size &&
            ny >= 0 &&
            ny < size &&
            pixels[ny][nx] === COLOR_INDICES.TRANSPARENT
          ) {
            result[ny][nx] = outlineColor;
          }
        }
      }
    }
  }

  return result;
}

// Mirror pixels horizontally
export function mirrorHorizontal(pixels: PixelData): PixelData {
  return pixels.map(row => [...row].reverse());
}

// Generate a simple humanoid body template
export function generateBodyTemplate(
  size: number,
  bodyType: BodyType,
  rng: SeededRandom
): PixelData {
  const pixels = createEmptyPixels(size);
  const center = Math.floor(size / 2);

  // Adjust proportions based on body type
  let headSize: number, bodyHeight: number, legHeight: number;

  switch (bodyType) {
    case 'chibi':
      headSize = Math.floor(size * 0.4);
      bodyHeight = Math.floor(size * 0.3);
      legHeight = Math.floor(size * 0.25);
      break;
    case 'tall':
      headSize = Math.floor(size * 0.2);
      bodyHeight = Math.floor(size * 0.4);
      legHeight = Math.floor(size * 0.35);
      break;
    case 'standard':
    default:
      headSize = Math.floor(size * 0.3);
      bodyHeight = Math.floor(size * 0.35);
      legHeight = Math.floor(size * 0.3);
      break;
  }

  // Draw head (circle approximation)
  const headY = 1;
  const headWidth = Math.max(3, headSize);
  const headHeight = Math.max(3, headSize);
  drawRect(pixels, center - Math.floor(headWidth / 2), headY, headWidth, headHeight, COLOR_INDICES.SKIN);

  // Draw body
  const bodyY = headY + headHeight;
  const bodyWidth = Math.max(3, Math.floor(headWidth * 1.2));
  drawRect(
    pixels,
    center - Math.floor(bodyWidth / 2),
    bodyY,
    bodyWidth,
    bodyHeight,
    COLOR_INDICES.CLOTHING
  );

  // Draw legs
  const legY = bodyY + bodyHeight;
  const legWidth = Math.max(1, Math.floor(bodyWidth / 2.5));
  const legGap = 1;

  // Left leg
  drawRect(
    pixels,
    center - legGap - legWidth,
    legY,
    legWidth,
    legHeight,
    COLOR_INDICES.CLOTHING
  );

  // Right leg
  drawRect(pixels, center + legGap, legY, legWidth, legHeight, COLOR_INDICES.CLOTHING);

  // Draw arms
  const armY = bodyY + 1;
  const armHeight = Math.floor(bodyHeight * 0.6);
  const armWidth = Math.max(1, Math.floor(legWidth * 0.8));

  // Left arm
  drawRect(
    pixels,
    center - Math.floor(bodyWidth / 2) - armWidth,
    armY,
    armWidth,
    armHeight,
    COLOR_INDICES.SKIN
  );

  // Right arm
  drawRect(
    pixels,
    center + Math.floor(bodyWidth / 2),
    armY,
    armWidth,
    armHeight,
    COLOR_INDICES.SKIN
  );

  return pixels;
}

// Generate a robot body template
export function generateRobotTemplate(size: number, rng: SeededRandom): PixelData {
  const pixels = createEmptyPixels(size);
  const center = Math.floor(size / 2);

  // Robot head (square)
  const headSize = Math.floor(size * 0.3);
  drawRect(pixels, center - Math.floor(headSize / 2), 1, headSize, headSize, COLOR_INDICES.ACCENT);

  // Eyes
  const eyeY = 1 + Math.floor(headSize / 3);
  pixels[eyeY][center - 1] = COLOR_INDICES.ACCENT_HIGHLIGHT;
  pixels[eyeY][center + 1] = COLOR_INDICES.ACCENT_HIGHLIGHT;

  // Body
  const bodyY = 1 + headSize;
  const bodyWidth = Math.floor(size * 0.5);
  const bodyHeight = Math.floor(size * 0.4);
  drawRect(
    pixels,
    center - Math.floor(bodyWidth / 2),
    bodyY,
    bodyWidth,
    bodyHeight,
    COLOR_INDICES.CLOTHING
  );

  // Legs
  const legY = bodyY + bodyHeight;
  const legWidth = Math.floor(bodyWidth / 3);
  const legHeight = Math.floor(size * 0.25);
  const legGap = 1;

  drawRect(pixels, center - legGap - legWidth, legY, legWidth, legHeight, COLOR_INDICES.ACCENT);
  drawRect(pixels, center + legGap, legY, legWidth, legHeight, COLOR_INDICES.ACCENT);

  return pixels;
}

// Generate a monster template
export function generateMonsterTemplate(size: number, rng: SeededRandom): PixelData {
  const pixels = createEmptyPixels(size);
  const center = Math.floor(size / 2);

  // Blob-like body
  const bodySize = Math.floor(size * 0.7);
  const bodyY = Math.floor(size * 0.2);

  // Draw rounded body
  drawRect(
    pixels,
    center - Math.floor(bodySize / 2),
    bodyY,
    bodySize,
    bodySize,
    COLOR_INDICES.CLOTHING
  );

  // Eyes (asymmetric for monster look)
  const eyeY = bodyY + Math.floor(bodySize / 3);
  pixels[eyeY][center - 2] = COLOR_INDICES.ACCENT_HIGHLIGHT;
  pixels[eyeY][center + 1] = COLOR_INDICES.ACCENT_HIGHLIGHT;

  // Mouth
  const mouthY = bodyY + Math.floor(bodySize * 0.6);
  for (let x = center - 2; x <= center + 2; x++) {
    if (x >= 0 && x < size) {
      pixels[mouthY][x] = COLOR_INDICES.OUTLINE;
    }
  }

  return pixels;
}

// Generate sprite based on character class
export function generateCharacterSprite(
  size: number,
  bodyType: BodyType,
  characterClass: CharacterClass,
  _element: Element,
  seed: number
): PixelData {
  const rng = new SeededRandom(seed);

  let pixels: PixelData;

  // Generate base template
  switch (characterClass) {
    case 'robot':
      pixels = generateRobotTemplate(size, rng);
      break;
    case 'monster':
      pixels = generateMonsterTemplate(size, rng);
      break;
    default:
      pixels = generateBodyTemplate(size, bodyType, rng);
      break;
  }

  // Add class-specific details
  switch (characterClass) {
    case 'warrior':
      // Add helmet/armor details
      pixels = addWarriorDetails(pixels, rng);
      break;
    case 'mage':
      // Add hat/robe details
      pixels = addMageDetails(pixels, rng);
      break;
    case 'archer':
      // Add hood/bow
      pixels = addArcherDetails(pixels, rng);
      break;
    case 'rogue':
      // Add hood/mask
      pixels = addRogueDetails(pixels, rng);
      break;
  }

  // Add element-based color variations (would modify color mapping)
  // This is handled at the palette level

  return pixels;
}

// Add warrior-specific details
function addWarriorDetails(pixels: PixelData, rng: SeededRandom): PixelData {
  const size = pixels.length;
  const center = Math.floor(size / 2);

  // Add helmet horns or crest
  if (size >= 16) {
    pixels[0][center - 2] = COLOR_INDICES.ACCENT;
    pixels[0][center + 2] = COLOR_INDICES.ACCENT;
  }

  return pixels;
}

// Add mage-specific details
function addMageDetails(pixels: PixelData, rng: SeededRandom): PixelData {
  const size = pixels.length;
  const center = Math.floor(size / 2);

  // Add pointy hat
  if (size >= 16) {
    pixels[0][center] = COLOR_INDICES.ACCENT;
    if (size >= 24) {
      pixels[0][center - 1] = COLOR_INDICES.ACCENT;
      pixels[0][center + 1] = COLOR_INDICES.ACCENT;
    }
  }

  return pixels;
}

// Add archer-specific details
function addArcherDetails(pixels: PixelData, rng: SeededRandom): PixelData {
  const size = pixels.length;

  // Add hood (simplified)
  // Could add more detailed hood shape

  return pixels;
}

// Add rogue-specific details
function addRogueDetails(pixels: PixelData, rng: SeededRandom): PixelData {
  const size = pixels.length;

  // Add mask or hood
  // Simplified for now

  return pixels;
}

// Composite multiple pixel layers
export function compositeLayers(layers: PixelData[]): PixelData {
  if (layers.length === 0) return createEmptyPixels(16);

  const size = layers[0].length;
  const result = createEmptyPixels(size);

  for (const layer of layers) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (layer[y][x] !== COLOR_INDICES.TRANSPARENT) {
          result[y][x] = layer[y][x];
        }
      }
    }
  }

  return result;
}
