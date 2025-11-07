import type { PixelData, AnimationState, AnimationStateConfig, Frame } from '../types';
import { SeededRandom } from './random';
import { createEmptyPixels } from './spriteGenerator';

// Generate animation frames for a given state
export function generateAnimationFrames(
  basePixels: PixelData,
  state: AnimationState,
  seed: number,
  frameCount?: number
): Frame[] {
  const rng = new SeededRandom(seed);

  switch (state) {
    case 'idle':
      return generateIdleFrames(basePixels, rng, frameCount || 4);
    case 'walk':
      return generateWalkFrames(basePixels, rng, frameCount || 4);
    case 'run':
      return generateRunFrames(basePixels, rng, frameCount || 4);
    case 'jump':
      return generateJumpFrames(basePixels, rng, frameCount || 3);
    case 'attack':
      return generateAttackFrames(basePixels, rng, frameCount || 3);
    case 'hurt':
      return generateHurtFrames(basePixels, rng, frameCount || 2);
    case 'dead':
      return generateDeadFrames(basePixels, rng, frameCount || 1);
    default:
      return [{ pixels: basePixels, index: 0 }];
  }
}

// Idle animation: subtle breathing/bobbing
function generateIdleFrames(basePixels: PixelData, _rng: SeededRandom, count: number): Frame[] {
  const frames: Frame[] = [];

  for (let i = 0; i < count; i++) {
    const phase = (i / count) * Math.PI * 2;
    const offset = Math.round(Math.sin(phase) * 0.5); // Very subtle vertical movement

    const pixels = shiftPixelsVertical(basePixels, offset);
    frames.push({ pixels, index: i });
  }

  return frames;
}

// Walk animation: alternating leg/arm positions
function generateWalkFrames(basePixels: PixelData, _rng: SeededRandom, count: number): Frame[] {
  const frames: Frame[] = [];
  const size = basePixels.length;

  for (let i = 0; i < count; i++) {
    const phase = (i / count) * Math.PI * 2;

    // Create a copy
    let pixels = basePixels.map(row => [...row]);

    // Simulate leg movement by shifting lower portion
    const bobOffset = Math.round(Math.sin(phase) * 1);
    pixels = shiftPixelsVertical(pixels, bobOffset);

    // Could add more sophisticated limb movement here

    frames.push({ pixels, index: i });
  }

  return frames;
}

// Run animation: faster, more pronounced movement
function generateRunFrames(basePixels: PixelData, _rng: SeededRandom, count: number): Frame[] {
  const frames: Frame[] = [];

  for (let i = 0; i < count; i++) {
    const phase = (i / count) * Math.PI * 2;
    const offset = Math.round(Math.sin(phase) * 1.5);

    let pixels = shiftPixelsVertical(basePixels, offset);

    // Add slight horizontal lean
    const lean = i < count / 2 ? 1 : -1;
    pixels = shiftPixelsHorizontal(pixels, lean);

    frames.push({ pixels, index: i });
  }

  return frames;
}

// Jump animation: up -> peak -> down
function generateJumpFrames(basePixels: PixelData, _rng: SeededRandom, count: number): Frame[] {
  const frames: Frame[] = [];

  const offsets = [-2, -3, -2]; // Simple jump arc
  for (let i = 0; i < count; i++) {
    const offset = offsets[i] || 0;
    const pixels = shiftPixelsVertical(basePixels, offset);
    frames.push({ pixels, index: i });
  }

  return frames;
}

// Attack animation: forward thrust
function generateAttackFrames(basePixels: PixelData, _rng: SeededRandom, count: number): Frame[] {
  const frames: Frame[] = [];

  for (let i = 0; i < count; i++) {
    let pixels = basePixels.map(row => [...row]);

    if (i === 1) {
      // Attack frame: shift forward
      pixels = shiftPixelsHorizontal(pixels, 2);
    }

    frames.push({ pixels, index: i });
  }

  return frames;
}

// Hurt animation: recoil
function generateHurtFrames(basePixels: PixelData, _rng: SeededRandom, _count: number): Frame[] {
  const frames: Frame[] = [];

  frames.push({ pixels: basePixels, index: 0 });

  // Recoil frame
  const recoilPixels = shiftPixelsHorizontal(basePixels, -2);
  frames.push({ pixels: recoilPixels, index: 1 });

  return frames;
}

// Dead animation: fall down
function generateDeadFrames(basePixels: PixelData, _rng: SeededRandom, _count: number): Frame[] {
  // Rotate sprite 90 degrees or just show collapsed state
  const collapsed = rotatePixels90(basePixels);
  return [{ pixels: collapsed, index: 0 }];
}

// Shift pixels vertically
function shiftPixelsVertical(pixels: PixelData, offset: number): PixelData {
  const size = pixels.length;
  const result = createEmptyPixels(size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const newY = y - offset;
      if (newY >= 0 && newY < size) {
        result[newY][x] = pixels[y][x];
      }
    }
  }

  return result;
}

// Shift pixels horizontally
function shiftPixelsHorizontal(pixels: PixelData, offset: number): PixelData {
  const size = pixels.length;
  const result = createEmptyPixels(size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const newX = x + offset;
      if (newX >= 0 && newX < size) {
        result[y][newX] = pixels[y][x];
      }
    }
  }

  return result;
}

// Rotate pixels 90 degrees clockwise
function rotatePixels90(pixels: PixelData): PixelData {
  const size = pixels.length;
  const result = createEmptyPixels(size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      result[x][size - 1 - y] = pixels[y][x];
    }
  }

  return result;
}

// Get default animation config for each state
export function getDefaultAnimationConfig(state: AnimationState): AnimationStateConfig {
  switch (state) {
    case 'idle':
      return { frames: [0, 1, 2, 3], fps: 4, loop: true };
    case 'walk':
      return { frames: [0, 1, 2, 3], fps: 8, loop: true };
    case 'run':
      return { frames: [0, 1, 2, 3], fps: 12, loop: true };
    case 'jump':
      return { frames: [0, 1, 2], fps: 10, loop: false };
    case 'attack':
      return { frames: [0, 1, 2], fps: 12, loop: false };
    case 'hurt':
      return { frames: [0, 1], fps: 8, loop: false };
    case 'dead':
      return { frames: [0], fps: 1, loop: false };
  }
}

// Generate all animation states for a character
export function generateAllAnimations(
  basePixels: PixelData,
  seed: number
): Record<AnimationState, Frame[]> {
  const states: AnimationState[] = ['idle', 'walk', 'run', 'jump', 'attack', 'hurt', 'dead'];

  const animations: Partial<Record<AnimationState, Frame[]>> = {};

  states.forEach(state => {
    animations[state] = generateAnimationFrames(basePixels, state, seed + states.indexOf(state));
  });

  return animations as Record<AnimationState, Frame[]>;
}
