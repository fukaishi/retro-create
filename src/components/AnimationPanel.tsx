import { useState, useEffect, useCallback } from 'react';
import type { AnimationState, Sprite } from '../types';
import {
  exportSpriteSheet,
  exportMetadata,
  exportForPhaser3,
  exportAseprite,
  exportAll,
} from '../lib/export';

interface AnimationPanelProps {
  sprite: Sprite;
  currentState: AnimationState;
  currentFrame: number;
  isPlaying: boolean;
  onStateChange: (state: AnimationState) => void;
  onFrameChange: (frame: number) => void;
  onPlayToggle: () => void;
}

const ANIMATION_STATES: AnimationState[] = [
  'idle',
  'walk',
  'run',
  'jump',
  'attack',
  'hurt',
  'dead',
];

export function AnimationPanel({
  sprite,
  currentState,
  currentFrame,
  isPlaying,
  onStateChange,
  onFrameChange,
  onPlayToggle,
}: AnimationPanelProps) {
  const [scale, setScale] = useState(4);
  const [exportFormat, setExportFormat] = useState<'spritesheet' | 'phaser' | 'aseprite' | 'all'>(
    'spritesheet'
  );

  const stateConfig = sprite.metadata.states[currentState];
  const frameCount = stateConfig.frames.length;

  // Animation playback
  useEffect(() => {
    if (!isPlaying) return;

    const fps = stateConfig.fps;
    const interval = 1000 / fps;

    const timer = setInterval(() => {
      onFrameChange((currentFrame + 1) % frameCount);
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, currentFrame, frameCount, stateConfig.fps, onFrameChange]);

  const handleExport = useCallback(async () => {
    switch (exportFormat) {
      case 'spritesheet':
        await exportSpriteSheet(sprite, {
          format: 'atlas',
          scale,
          padding: 1,
          layout: 'grid',
          includeMetadata: true,
        });
        break;
      case 'phaser':
        await exportForPhaser3(sprite, scale);
        break;
      case 'aseprite':
        await exportAseprite(sprite);
        break;
      case 'all':
        await exportAll(sprite, scale);
        break;
    }
  }, [sprite, exportFormat, scale]);

  return (
    <div className="animation-panel">
      <h2>Animation</h2>

      <div className="states-list">
        <label>State</label>
        <div className="state-buttons">
          {ANIMATION_STATES.map(state => (
            <button
              key={state}
              className={currentState === state ? 'active' : ''}
              onClick={() => onStateChange(state)}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      <div className="playback-controls">
        <button onClick={onPlayToggle}>{isPlaying ? 'Pause (P)' : 'Play (P)'}</button>

        <div className="frame-control">
          <label>Frame: {currentFrame + 1} / {frameCount}</label>
          <input
            type="range"
            min="0"
            max={frameCount - 1}
            value={currentFrame}
            onChange={e => onFrameChange(parseInt(e.target.value))}
          />
        </div>

        <div className="info">
          <small>FPS: {stateConfig.fps}</small>
          <small>Loop: {stateConfig.loop ? 'Yes' : 'No'}</small>
        </div>
      </div>

      <div className="export-section">
        <h3>Export</h3>

        <div className="control-group">
          <label>Scale</label>
          <input
            type="number"
            min="1"
            max="16"
            value={scale}
            onChange={e => setScale(parseInt(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>Format</label>
          <select
            value={exportFormat}
            onChange={e =>
              setExportFormat(e.target.value as 'spritesheet' | 'phaser' | 'aseprite' | 'all')
            }
          >
            <option value="spritesheet">Sprite Sheet + Atlas</option>
            <option value="phaser">Phaser 3</option>
            <option value="aseprite">Aseprite JSON</option>
            <option value="all">All Formats</option>
          </select>
        </div>

        <button onClick={handleExport} className="export-button">
          Export (S)
        </button>

        <button onClick={() => exportMetadata(sprite)} className="secondary-button">
          Export Metadata Only
        </button>
      </div>
    </div>
  );
}
