import type { Preset } from '../types';

// NES preset (8x8 or 16x16 sprites)
export const NES_PRESET: Preset = {
  id: 'nes',
  name: 'NES / Famicom',
  resolution: 16,
  maxColors: 16,
  simultaneousColors: 4, // 3 colors + 1 transparent per sprite
  hasOutline: false,
  defaultPalette: 'nes',
  description: '16x16 sprites with NES color constraints (4 colors including transparent)',
};

// Game Boy preset
export const GB_PRESET: Preset = {
  id: 'gb',
  name: 'Game Boy',
  resolution: 16,
  maxColors: 4,
  simultaneousColors: 4,
  hasOutline: false,
  defaultPalette: 'gb_four',
  description: '16x16 sprites with 4-shade green palette',
};

// PICO-8 preset
export const PICO8_PRESET: Preset = {
  id: 'pico8',
  name: 'PICO-8',
  resolution: 8,
  maxColors: 16,
  simultaneousColors: 16,
  hasOutline: false,
  defaultPalette: 'pico8',
  description: '8x8 sprites with PICO-8\'s 16-color palette',
};

// PC-98 preset
export const PC98_PRESET: Preset = {
  id: 'pc98',
  name: 'PC-98',
  resolution: 16,
  maxColors: 8,
  simultaneousColors: 8,
  hasOutline: false,
  defaultPalette: 'pc98',
  description: '16x16 sprites with PC-98 8-color palette',
};

// C64 preset
export const C64_PRESET: Preset = {
  id: 'c64',
  name: 'Commodore 64',
  resolution: 24,
  maxColors: 16,
  simultaneousColors: 4,
  hasOutline: false,
  defaultPalette: 'c64',
  description: '24x24 sprites with C64 palette (4 simultaneous colors)',
};

// Custom preset
export const CUSTOM_PRESET: Preset = {
  id: 'custom',
  name: 'Custom',
  resolution: 16,
  maxColors: 16,
  simultaneousColors: 16,
  hasOutline: true,
  defaultPalette: 'db16',
  description: 'Customizable settings with DawnBringer 16 palette',
};

// All available presets
export const PRESETS: Record<string, Preset> = {
  nes: NES_PRESET,
  gb: GB_PRESET,
  pico8: PICO8_PRESET,
  pc98: PC98_PRESET,
  c64: C64_PRESET,
  custom: CUSTOM_PRESET,
};

// Get preset by ID
export function getPreset(id: string): Preset {
  return PRESETS[id] || GB_PRESET;
}

// Validate sprite against preset constraints
export function validateSpriteAgainstPreset(
  colorIndices: Set<number>,
  preset: Preset
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check simultaneous color count
  if (colorIndices.size > preset.simultaneousColors) {
    errors.push(
      `Sprite uses ${colorIndices.size} colors but preset allows only ${preset.simultaneousColors}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Get recommended sizes for preset
export function getRecommendedSizes(preset: Preset): number[] {
  switch (preset.id) {
    case 'nes':
      return [8, 16];
    case 'gb':
      return [8, 16];
    case 'pico8':
      return [8, 16];
    case 'pc98':
      return [16, 32];
    case 'c64':
      return [16, 24];
    default:
      return [8, 16, 24, 32];
  }
}
