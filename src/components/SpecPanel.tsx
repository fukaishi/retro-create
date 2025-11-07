import type { PresetId, BodyType, CharacterClass, Element } from '../types';
import { PRESETS } from '../lib/presets';

interface SpecPanelProps {
  preset: PresetId;
  size: number;
  bodyType: BodyType;
  characterClass: CharacterClass;
  element: Element;
  seed: number;
  onPresetChange: (preset: PresetId) => void;
  onSizeChange: (size: number) => void;
  onBodyTypeChange: (bodyType: BodyType) => void;
  onClassChange: (characterClass: CharacterClass) => void;
  onElementChange: (element: Element) => void;
  onSeedChange: (seed: number) => void;
  onRegenerate: () => void;
}

export function SpecPanel({
  preset,
  size,
  bodyType,
  characterClass,
  element,
  seed,
  onPresetChange,
  onSizeChange,
  onBodyTypeChange,
  onClassChange,
  onElementChange,
  onSeedChange,
  onRegenerate,
}: SpecPanelProps) {
  const currentPreset = PRESETS[preset];

  return (
    <div className="spec-panel">
      <h2>Specifications</h2>

      <div className="control-group">
        <label>Preset</label>
        <select value={preset} onChange={e => onPresetChange(e.target.value as PresetId)}>
          {Object.values(PRESETS).map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <small>{currentPreset.description}</small>
      </div>

      <div className="control-group">
        <label>Size (px)</label>
        <input
          type="number"
          min="8"
          max="32"
          step="8"
          value={size}
          onChange={e => onSizeChange(parseInt(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label>Body Type</label>
        <select value={bodyType} onChange={e => onBodyTypeChange(e.target.value as BodyType)}>
          <option value="chibi">Chibi</option>
          <option value="standard">Standard</option>
          <option value="tall">Tall</option>
        </select>
      </div>

      <div className="control-group">
        <label>Class</label>
        <select
          value={characterClass}
          onChange={e => onClassChange(e.target.value as CharacterClass)}
        >
          <option value="warrior">Warrior</option>
          <option value="mage">Mage</option>
          <option value="archer">Archer</option>
          <option value="rogue">Rogue</option>
          <option value="robot">Robot</option>
          <option value="monster">Monster</option>
        </select>
      </div>

      <div className="control-group">
        <label>Element</label>
        <select value={element} onChange={e => onElementChange(e.target.value as Element)}>
          <option value="neutral">Neutral</option>
          <option value="fire">Fire</option>
          <option value="ice">Ice</option>
          <option value="poison">Poison</option>
          <option value="lightning">Lightning</option>
          <option value="holy">Holy</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div className="control-group">
        <label>Seed</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={seed}
            onChange={e => onSeedChange(parseInt(e.target.value) || 0)}
            style={{ flex: 1 }}
          />
          <button onClick={onRegenerate}>Randomize</button>
        </div>
      </div>

      <div className="preset-info">
        <h3>Constraints</h3>
        <p>Max Colors: {currentPreset.maxColors}</p>
        <p>Simultaneous: {currentPreset.simultaneousColors}</p>
        <p>Palette: {currentPreset.defaultPalette}</p>
      </div>
    </div>
  );
}
