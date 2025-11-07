import { useState, useCallback, useMemo } from 'react';
import type {
  Sprite,
  PresetId,
  BodyType,
  CharacterClass,
  Element,
  AnimationState,
  SpriteMetadata,
  Frame,
} from '../types';
import { getPreset } from '../lib/presets';
import { getPalette } from '../lib/palettes';
import { generateCharacterSprite } from '../lib/spriteGenerator';
import { generateAllAnimations, getDefaultAnimationConfig } from '../lib/animator';

export interface SpriteConfig {
  preset: PresetId;
  size: number;
  bodyType: BodyType;
  characterClass: CharacterClass;
  element: Element;
  seed: number;
}

export function useSprite(initialConfig: SpriteConfig) {
  const [config, setConfig] = useState<SpriteConfig>(initialConfig);
  const [currentState, setCurrentState] = useState<AnimationState>('idle');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Generate sprite based on current config
  const sprite = useMemo<Sprite>(() => {
    const preset = getPreset(config.preset);
    const palette = getPalette(preset.defaultPalette);

    // Generate base sprite
    const basePixels = generateCharacterSprite(
      config.size,
      config.bodyType,
      config.characterClass,
      config.element,
      config.seed
    );

    // Generate all animations
    const animations = generateAllAnimations(basePixels, config.seed);

    // Flatten all frames
    const frames: Frame[] = [];
    const states: Record<AnimationState, any> = {} as any;

    let frameIndex = 0;
    Object.entries(animations).forEach(([stateName, stateFrames]) => {
      const state = stateName as AnimationState;
      const frameIndices: number[] = [];

      stateFrames.forEach(frame => {
        frames.push({ ...frame, index: frameIndex });
        frameIndices.push(frameIndex);
        frameIndex++;
      });

      states[state] = {
        ...getDefaultAnimationConfig(state),
        frames: frameIndices,
      };
    });

    const metadata: SpriteMetadata = {
      id: `sprite_${config.seed}`,
      preset: config.preset,
      size: config.size,
      palette: preset.defaultPalette,
      states,
      hitbox: {
        x: Math.floor(config.size * 0.25),
        y: Math.floor(config.size * 0.2),
        w: Math.floor(config.size * 0.5),
        h: Math.floor(config.size * 0.7),
      },
      origin: {
        x: Math.floor(config.size / 2),
        y: config.size - 2,
      },
    };

    return {
      metadata,
      frames,
      palette,
    };
  }, [config]);

  // Update configuration
  const updateConfig = useCallback((updates: Partial<SpriteConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    setCurrentFrame(0);
  }, []);

  // Regenerate with new seed
  const regenerate = useCallback(() => {
    setConfig(prev => ({ ...prev, seed: Math.floor(Math.random() * 1000000) }));
    setCurrentFrame(0);
  }, []);

  // Change animation state
  const changeState = useCallback(
    (state: AnimationState) => {
      setCurrentState(state);
      setCurrentFrame(0);
      setIsPlaying(true);
    },
    []
  );

  // Get frames for current state
  const currentStateFrames = useMemo(() => {
    const stateConfig = sprite.metadata.states[currentState];
    return stateConfig.frames.map(idx => sprite.frames[idx]).filter(f => f !== undefined);
  }, [sprite, currentState]);

  // Get current frame pixels
  const currentFramePixels = useMemo(() => {
    const frameIndex = currentFrame % currentStateFrames.length;
    return currentStateFrames[frameIndex]?.pixels || sprite.frames[0]?.pixels;
  }, [currentStateFrames, currentFrame, sprite.frames]);

  return {
    sprite,
    config,
    updateConfig,
    regenerate,
    currentState,
    changeState,
    currentFrame,
    setCurrentFrame,
    currentStateFrames,
    currentFramePixels,
    isPlaying,
    setIsPlaying,
  };
}
