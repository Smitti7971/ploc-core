export type PlocMode = 'sleeping' | 'active' | 'stressing' | 'pissed';

export interface PlocState {
  mode: PlocMode;
  angerLevel: number;
  angerClicks: number;
  isHurt: boolean;
}

export interface PlocAvatarProps {
  draggable?: boolean;
  emotion?: 'calm' | 'happy' | 'stressed' | 'pissed' | 'sleeping' | 'dizzy';
}
