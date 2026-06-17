/**
 * ============================================================================
 * Ploc Types - types.ts
 * ============================================================================
 * Descrição: Definições de tipos TypeScript essenciais para o mascote Ploc.
 * 
 * Principais responsabilidades:
 * - Define o estado do Ploc (PlocState), incluindo modo.
 * - Define os modos do mascote (PlocMode: sleeping, active, stressing, pissed).
 * - Define as props aceitas pelo componente principal PlocAvatar (PlocAvatarProps).
 * ============================================================================
 */

export type PlocMode = 'sleeping' | 'active' | 'stressing' | 'pissed' | 'dizzy';

export interface PlocState {
  mode: PlocMode;
  levelLockTimer?: NodeJS.Timeout | null;
}

export interface PlocAppearance {
  bodyColor?: 'classic' | 'rose' | 'gold' | 'emerald' | 'purple' | 'lava';
}

export const DEFAULT_PLOC_APPEARANCE: PlocAppearance = {
  bodyColor: 'classic',
};

export interface PlocCustomControlsProps {
  isChatOpen: boolean;
  gameMode: string | null;
  showChoiceButtons: boolean;
  onboardingStage: string;
  phase1PopCount: number;
  showPriorityConfirmButtons: boolean;
  handleRegisterChoice: () => void;
  handleContinuePlaying: () => void;
  handleStartPhase2: () => void;
  handleConfirmPriorityPillar: () => void;
}

export interface PlocAvatarProps {
  draggable?: boolean;
  emotion?: 'calm' | 'happy' | 'stressed' | 'pissed' | 'sleeping' | 'dizzy';
  appearance?: PlocAppearance;
  renderCustomControls?: (chatProps: PlocCustomControlsProps) => React.ReactNode;
}
