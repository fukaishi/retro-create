import { useEffect, useRef } from 'react';
import type { PixelData, Palette } from '../types';
import { renderPixelsToCanvas } from '../lib/canvas';

interface SpriteCanvasProps {
  pixels: PixelData;
  palette: Palette;
  scale: number;
  showGrid: boolean;
}

export function SpriteCanvas({ pixels, palette, scale, showGrid }: SpriteCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderPixelsToCanvas(canvas, pixels, palette, scale, showGrid);
  }, [pixels, palette, scale, showGrid]);

  return (
    <div className="sprite-canvas-container">
      <canvas ref={canvasRef} className="sprite-canvas" />
    </div>
  );
}
