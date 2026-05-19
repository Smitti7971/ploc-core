/**
 * ============================================================================
 * Ploc Types - types.ts
 * ============================================================================
 * Descrição: Definições de tipos TypeScript essenciais para o mascote Ploc.
 * 
 * Principais responsabilidades:
 * - Define o estado do Ploc (PlocState), incluindo modo, fúria e se está ferido.
 * - Define os modos do mascote (PlocMode: sleeping, active, stressing, pissed).
 * - Define as props aceitas pelo componente principal PlocAvatar (PlocAvatarProps).
 * ============================================================================
 */

export type PlocMode = 'sleeping' | 'active' | 'stressing' | 'pissed';

export interface PlocState {
  mode: PlocMode;
  angerLevel: number;
  angerClicks: number;
  isHurt: boolean;
  isHit?: boolean;
  isPositiveHit?: boolean;
  angerTimer?: number;
}

export type PlocEyeType = 'bored' | 'cute' | 'anime' | 'nerd' | 'sparkle' | 'spiral';
export type PlocMouthType = 'none' | 'smile' | 'straight' | 'masculine' | 'feminine' | 'shock' | 'sad' | 'wavy';
export type PlocHairType = 'none' | 'pompadour' | 'spiky' | 'afro' | 'curls' | 'bangs';
export type PlocClothesType = 'none' | 'hoodie' | 'suit' | 'cape' | 'armor';
export type PlocHatType = 'none' | 'cap' | 'tophat' | 'crown' | 'beanie' | 'horns';
export type PlocAuraType = 'none' | 'success' | 'disaster' | 'fire' | 'star';
export type PlocShoesType = 'none' | 'sneakers' | 'boots' | 'slippers';
export type PlocBodyType = 'classic' | 'muscular' | 'slender';

export interface PlocAppearance {
  eyes: PlocEyeType;
  mouth: PlocMouthType;
  hair: PlocHairType;
  clothes: PlocClothesType;
  hat: PlocHatType;
  aura: PlocAuraType;
  shoes: PlocShoesType;
  bodyType: PlocBodyType;
  bodyColor?: 'classic' | 'rose' | 'gold' | 'emerald' | 'purple' | 'lava';
}

export const DEFAULT_PLOC_APPEARANCE: PlocAppearance = {
  eyes: 'bored',
  mouth: 'straight',
  hair: 'none',
  clothes: 'none',
  hat: 'none',
  aura: 'none',
  shoes: 'none',
  bodyType: 'classic',
  bodyColor: 'classic',
};

export interface PlocAvatarProps {
  draggable?: boolean;
  emotion?: 'calm' | 'happy' | 'stressed' | 'pissed' | 'sleeping' | 'dizzy';
  appearance?: PlocAppearance;
}

