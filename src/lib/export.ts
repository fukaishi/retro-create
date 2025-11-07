import { saveAs } from 'file-saver';
import type {
  Sprite,
  ExportOptions,
  AtlasData,
  FrameData,
  AnimationState,
  AsepriteData,
  Frame,
} from '../types';
import { createSpriteSheet, canvasToBlob } from './canvas';

// Export sprite as PNG
export async function exportPNG(
  sprite: Sprite,
  state: AnimationState,
  frameIndex: number,
  scale = 1
): Promise<void> {
  const frame = sprite.frames[frameIndex];
  if (!frame) return;

  const canvas = document.createElement('canvas');
  const { renderPixelsToCanvas } = await import('./canvas');

  renderPixelsToCanvas(canvas, frame.pixels, sprite.palette, scale, false);

  const blob = await canvasToBlob(canvas);
  const filename = `${sprite.metadata.id}_${state}_${frameIndex}.png`;
  saveAs(blob, filename);
}

// Export sprite sheet with JSON atlas
export async function exportSpriteSheet(
  sprite: Sprite,
  options: ExportOptions
): Promise<void> {
  const { layout, scale, padding, includeMetadata } = options;

  // Collect all frames
  const allFrames: Frame[] = sprite.frames;
  const framePixels = allFrames.map(f => f.pixels);

  // Create sprite sheet
  const canvas = createSpriteSheet(framePixels, sprite.palette, layout, padding, scale);

  // Export PNG
  const blob = await canvasToBlob(canvas);
  const baseName = sprite.metadata.id;
  const pngFilename = `${baseName}_spritesheet.png`;
  saveAs(blob, pngFilename);

  // Generate atlas data
  if (includeMetadata) {
    const atlas = generateAtlasData(sprite, canvas.width, canvas.height, layout, padding, scale);
    const atlasJson = JSON.stringify(atlas, null, 2);
    const atlasBlob = new Blob([atlasJson], { type: 'application/json' });
    const jsonFilename = `${baseName}_atlas.json`;
    saveAs(atlasBlob, jsonFilename);

    // Also export metadata
    const metadataJson = JSON.stringify(sprite.metadata, null, 2);
    const metadataBlob = new Blob([metadataJson], { type: 'application/json' });
    const metaFilename = `${baseName}_metadata.json`;
    saveAs(metadataBlob, metaFilename);
  }
}

// Generate atlas data (Phaser/Pixi compatible)
function generateAtlasData(
  sprite: Sprite,
  sheetWidth: number,
  sheetHeight: number,
  layout: 'horizontal' | 'vertical' | 'grid',
  padding: number,
  scale: number
): AtlasData {
  const frameSize = sprite.frames[0].pixels.length;
  const scaledSize = frameSize * scale;
  const scaledPadding = padding * scale;

  const frames: Record<string, FrameData> = {};

  let cols: number, rows: number;
  if (layout === 'horizontal') {
    cols = sprite.frames.length;
    rows = 1;
  } else if (layout === 'vertical') {
    cols = 1;
    rows = sprite.frames.length;
  } else {
    cols = Math.ceil(Math.sqrt(sprite.frames.length));
    rows = Math.ceil(sprite.frames.length / cols);
  }

  sprite.frames.forEach((_, index) => {
    const col = layout === 'vertical' ? 0 : layout === 'horizontal' ? index : index % cols;
    const row =
      layout === 'horizontal' ? 0 : layout === 'vertical' ? index : Math.floor(index / cols);

    const x = col * (scaledSize + scaledPadding);
    const y = row * (scaledSize + scaledPadding);

    const frameName = `frame_${index.toString().padStart(3, '0')}`;

    frames[frameName] = {
      frame: { x, y, w: scaledSize, h: scaledSize },
      rotated: false,
      trimmed: false,
      spriteSourceSize: { x: 0, y: 0, w: scaledSize, h: scaledSize },
      sourceSize: { w: scaledSize, h: scaledSize },
    };
  });

  return {
    frames,
    meta: {
      app: 'Retro Sprite Creator',
      version: '1.0.0',
      image: `${sprite.metadata.id}_spritesheet.png`,
      size: { w: sheetWidth, h: sheetHeight },
      scale: scale,
    },
  };
}

// Export as Aseprite-compatible JSON
export async function exportAseprite(sprite: Sprite): Promise<void> {
  const aseData: AsepriteData = {
    width: sprite.metadata.size,
    height: sprite.metadata.size,
    layers: [
      {
        name: 'Layer 1',
        opacity: 255,
        blendMode: 'normal',
      },
    ],
    frames: sprite.frames.map((frame) => ({
      duration: 100, // milliseconds, can be customized
      layers: [{ pixels: frame.pixels }],
    })),
    palette: sprite.palette.colors,
  };

  const json = JSON.stringify(aseData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const filename = `${sprite.metadata.id}.aseprite.json`;
  saveAs(blob, filename);
}

// Export as animated GIF
export async function exportGIF(
  sprite: Sprite,
  state: AnimationState,
  scale = 1
): Promise<void> {
  // Note: This is a simplified implementation
  // For full GIF support, you would use a library like gif.js
  // For now, we'll just note that this functionality would require the GIF encoder

  const config = sprite.metadata.states[state];
  if (!config) return;

  const stateFrames = config.frames.map(idx => sprite.frames[idx]).filter(f => f !== undefined);

  // TODO: Implement actual GIF encoding with gif.js library
  // This would require creating frames, encoding them, and downloading
  console.warn('GIF export not fully implemented yet. Use sprite sheet export instead.');

  // Placeholder: Export first frame as PNG
  if (stateFrames.length > 0) {
    await exportPNG(sprite, state, config.frames[0], scale);
  }
}

// Export metadata JSON for game engines
export function exportMetadata(sprite: Sprite): void {
  const json = JSON.stringify(sprite.metadata, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const filename = `${sprite.metadata.id}_metadata.json`;
  saveAs(blob, filename);
}

// Export Phaser 3 compatible format
export async function exportForPhaser3(sprite: Sprite, scale = 1): Promise<void> {
  // Export sprite sheet
  await exportSpriteSheet(sprite, {
    format: 'atlas',
    scale,
    padding: 1,
    layout: 'grid',
    includeMetadata: true,
  });

  // Create Phaser-specific animation config
  const phaserAnimations = Object.entries(sprite.metadata.states).map(([name, config]) => ({
    key: `${sprite.metadata.id}_${name}`,
    frames: config.frames.map(idx => ({
      key: sprite.metadata.id,
      frame: `frame_${idx.toString().padStart(3, '0')}`,
    })),
    frameRate: config.fps,
    repeat: config.loop ? -1 : 0,
  }));

  const phaserConfig = {
    spritesheet: `${sprite.metadata.id}_spritesheet.png`,
    atlas: `${sprite.metadata.id}_atlas.json`,
    animations: phaserAnimations,
  };

  const json = JSON.stringify(phaserConfig, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const filename = `${sprite.metadata.id}_phaser.json`;
  saveAs(blob, filename);
}

// Export Pixi.js compatible format
export async function exportForPixi(sprite: Sprite, scale = 1): Promise<void> {
  await exportSpriteSheet(sprite, {
    format: 'atlas',
    scale,
    padding: 1,
    layout: 'grid',
    includeMetadata: true,
  });
}

// Export Unity compatible format
export async function exportForUnity(sprite: Sprite, scale = 1): Promise<void> {
  await exportSpriteSheet(sprite, {
    format: 'atlas',
    scale,
    padding: 2,
    layout: 'grid',
    includeMetadata: true,
  });

  // Unity-specific metadata
  const unityMeta = {
    sprites: sprite.frames.map((_, index) => ({
      name: `${sprite.metadata.id}_${index}`,
      rect: {
        x: 0,
        y: 0,
        width: sprite.metadata.size * scale,
        height: sprite.metadata.size * scale,
      },
      pivot: {
        x: sprite.metadata.origin.x / sprite.metadata.size,
        y: sprite.metadata.origin.y / sprite.metadata.size,
      },
    })),
    animations: Object.entries(sprite.metadata.states).map(([name, config]) => ({
      name: `${sprite.metadata.id}_${name}`,
      frames: config.frames,
      fps: config.fps,
      loop: config.loop,
    })),
  };

  const json = JSON.stringify(unityMeta, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const filename = `${sprite.metadata.id}_unity.json`;
  saveAs(blob, filename);
}

// Batch export all formats
export async function exportAll(sprite: Sprite, scale = 1): Promise<void> {
  await exportSpriteSheet(sprite, {
    format: 'spritesheet',
    scale,
    padding: 1,
    layout: 'grid',
    includeMetadata: true,
  });

  exportMetadata(sprite);
  await exportAseprite(sprite);
  await exportForPhaser3(sprite, scale);
}
