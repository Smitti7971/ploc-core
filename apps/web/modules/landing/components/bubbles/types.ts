export interface BubbleConcept {
  id?: string;
  word: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  theme: 'blue' | 'emerald' | 'gold' | 'violet' | 'dark' | 'rose' | 'glass';
  maxOpacity: number;
  zIndex: number;
  driftX?: number;
  noCollision?: boolean;
  initialY?: string;
}

export interface FloatingBubbleProps {
  concept: BubbleConcept;
  isFirstPageLoad?: boolean;
  gameMode: 'decor' | 'onboarding_game' | 'normal';
  isWhirlwind?: boolean;
  density: 'none' | 'low' | 'medium' | 'high';
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
}
