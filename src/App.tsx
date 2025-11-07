import { useState, useEffect } from 'react';
import type { PresetId, BodyType, CharacterClass, Element } from './types';
import { useSprite } from './hooks/useSprite';
import { SpecPanel } from './components/SpecPanel';
import { SpriteCanvas } from './components/SpriteCanvas';
import { AnimationPanel } from './components/AnimationPanel';
import './App.css';

function App() {
  const [scale, setScale] = useState(16);
  const [showGrid, setShowGrid] = useState(true);

  const {
    sprite,
    config,
    updateConfig,
    regenerate,
    currentState,
    changeState,
    currentFrame,
    setCurrentFrame,
    currentFramePixels,
    isPlaying,
    setIsPlaying,
  } = useSprite({
    preset: 'gb',
    size: 16,
    bodyType: 'standard',
    characterClass: 'warrior',
    element: 'neutral',
    seed: 12345,
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key.toLowerCase()) {
        case 'p':
          setIsPlaying(prev => !prev);
          break;
        case 'r':
          regenerate();
          break;
        case 'arrowleft':
          e.preventDefault();
          setCurrentFrame(prev => Math.max(0, prev - 1));
          break;
        case 'arrowright':
          e.preventDefault();
          setCurrentFrame(prev => prev + 1);
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          {
            const zoomLevel = parseInt(e.key);
            setScale(zoomLevel * 2);
          }
          break;
        case 'g':
          setShowGrid(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [regenerate, setCurrentFrame, setIsPlaying]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Retro Sprite Creator</h1>
        <p className="subtitle">Pixel art sprite generator for retro games</p>
      </header>

      <div className="app-layout">
        <aside className="left-panel">
          <SpecPanel
            preset={config.preset}
            size={config.size}
            bodyType={config.bodyType}
            characterClass={config.characterClass}
            element={config.element}
            seed={config.seed}
            onPresetChange={preset => updateConfig({ preset })}
            onSizeChange={size => updateConfig({ size })}
            onBodyTypeChange={bodyType => updateConfig({ bodyType })}
            onClassChange={characterClass => updateConfig({ characterClass })}
            onElementChange={element => updateConfig({ element })}
            onSeedChange={seed => updateConfig({ seed })}
            onRegenerate={regenerate}
          />
        </aside>

        <main className="center-panel">
          <div className="canvas-section">
            <div className="canvas-header">
              <h2>Preview</h2>
              <div className="canvas-controls">
                <label>
                  Zoom:
                  <input
                    type="range"
                    min="4"
                    max="32"
                    value={scale}
                    onChange={e => setScale(parseInt(e.target.value))}
                  />
                  {scale}x
                </label>
                <label>
                  <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} />
                  Grid (G)
                </label>
              </div>
            </div>

            <div className="canvas-wrapper">
              <SpriteCanvas
                pixels={currentFramePixels}
                palette={sprite.palette}
                scale={scale}
                showGrid={showGrid}
              />
            </div>

            <div className="keyboard-hints">
              <small>
                <strong>Shortcuts:</strong> ←/→ Frame | P Play/Pause | R Regenerate | 1-9 Zoom | G Grid
              </small>
            </div>
          </div>
        </main>

        <aside className="right-panel">
          <AnimationPanel
            sprite={sprite}
            currentState={currentState}
            currentFrame={currentFrame}
            isPlaying={isPlaying}
            onStateChange={changeState}
            onFrameChange={setCurrentFrame}
            onPlayToggle={() => setIsPlaying(prev => !prev)}
          />
        </aside>
      </div>
    </div>
  );
}

export default App;
