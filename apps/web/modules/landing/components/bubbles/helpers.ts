import { Activity, Brain, Heart, Bird, Flag } from 'lucide-react';

// Mapeamento elegante de cores vibrantes e harmônicas para cada pilar do Ploc
const PILLAR_COLORS: Record<string, string> = {
  corpo: '#10b981',      // Emerald
  mente: '#3b82f6',      // Blue
  vida: '#ec4899',       // Pink/Rose/Violet
  liberdade: '#06b6d4',  // Cyan/Teal
  proposito: '#8b5cf6'   // Violet/Purple
};

const PILLAR_ICONS: Record<string, any> = {
  corpo: Activity,
  mente: Brain,
  vida: Heart,
  liberdade: Bird,
  proposito: Flag
};

export const getBubbleWordColor = (word: string, pillar?: string): string => {
  if (pillar && PILLAR_COLORS[pillar]) {
    return PILLAR_COLORS[pillar];
  }
  return 'rgba(255, 255, 255, 0.9)';
};

export const getBubbleIcon = (word: string, pillar?: string) => {
  if (pillar && PILLAR_ICONS[pillar]) {
    return PILLAR_ICONS[pillar];
  }
  return null;
};

export const getDecorIcon = (word: string, pillar?: string) => {
  if (pillar && PILLAR_ICONS[pillar]) {
    return PILLAR_ICONS[pillar];
  }
  return null;
};
