// Core types for the pixel sprite generator

export type PresetId = 'nes' | 'gb' | 'pico8' | 'pc98' | 'c64' | 'custom';

export type BodyType = 'chibi' | 'standard' | 'tall';

export type CharacterClass = 'warrior' | 'mage' | 'archer' | 'rogue' | 'robot' | 'monster';

export type Element = 'neutral' | 'fire' | 'ice' | 'poison' | 'lightning' | 'holy' | 'dark';

export type AnimationState = 'idle' | 'walk' | 'run' | 'jump' | 'attack' | 'hurt' | 'dead';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface Palette {
  id: string;
  name: string;
  colors: RGB[];
  transparent?: number; // Index of transparent color
}

export interface Preset {
  id: PresetId;
  name: string;
  resolution: number; // e.g., 16 for 16x16
  maxColors: number; // Total colors in palette
  simultaneousColors: number; // Colors that can be used at once
  hasOutline: boolean;
  defaultPalette: string; // Palette ID
  description: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface AnimationFrame {
  frameIndex: number;
  duration: number; // in milliseconds
}

export interface AnimationStateConfig {
  frames: number[]; // Frame indices
  fps: number;
  loop: boolean;
}

export interface SpriteMetadata {
  id: string;
  preset: PresetId;
  size: number;
  palette: string;
  states: Record<AnimationState, AnimationStateConfig>;
  hitbox: Rectangle;
  origin: Point;
}

// Pixel data: 2D array where each value is a color index
export type PixelData = number[][];

export interface Frame {
  pixels: PixelData;
  index: number;
}

export interface Sprite {
  metadata: SpriteMetadata;
  frames: Frame[];
  palette: Palette;
}

// Parts system
export type PartType = 'head' | 'hair' | 'face' | 'body' | 'arms' | 'legs' | 'weapon' | 'accessory';

export interface Part {
  type: PartType;
  id: string;
  pixels: PixelData;
  attachmentPoints?: Record<string, Point>;
  colorMapping?: Record<number, number>; // Map color indices to palette indices
}

export interface CharacterConfig {
  bodyType: BodyType;
  characterClass: CharacterClass;
  element: Element;
  parts: Record<PartType, string>; // Part ID for each type
  colorSeed: number;
  animationSeed: number;
}

// Export formats
export type ExportFormat = 'png' | 'spritesheet' | 'atlas' | 'aseprite' | 'gif';

export interface ExportOptions {
  format: ExportFormat;
  scale: number; // Upscale factor
  padding: number; // Pixels between frames in spritesheet
  layout: 'horizontal' | 'vertical' | 'grid';
  includeMetadata: boolean;
}

export interface SpriteSheetData {
  image: Blob;
  atlas: AtlasData;
}

export interface AtlasData {
  frames: Record<string, FrameData>;
  meta: {
    app: string;
    version: string;
    image: string;
    size: { w: number; h: number };
    scale: number;
  };
}

export interface FrameData {
  frame: Rectangle;
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: Rectangle;
  sourceSize: { w: number; h: number };
  duration?: number;
}

// Aseprite format support
export interface AsepriteLayer {
  name: string;
  opacity: number;
  blendMode: string;
}

export interface AsepriteFrame {
  duration: number;
  layers: { pixels: PixelData }[];
}

export interface AsepriteData {
  width: number;
  height: number;
  layers: AsepriteLayer[];
  frames: AsepriteFrame[];
  palette: RGB[];
}
