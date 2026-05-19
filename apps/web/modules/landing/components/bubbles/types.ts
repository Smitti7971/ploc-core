export interface BubbleConcept {
  id?: string;
  word: string; // Mantido por compatibilidade
  pillar: 'corpo' | 'mente' | 'vida' | 'liberdade' | 'proposito';
  ref: string;            // Identificador interno (ex: "sono", "sedentarismo")
  label: string;          // O texto exibido ao usuário (ex: "Sono", "Sedentarismo")
  value: 'positive' | 'negative' | 'decor'; // Influência de valor
  points: number;         // Pontuação concedida/retirada no minijogo (ex: +1, -1, +2, -2)
  isGameActive: boolean;  // Se afeta o minijogo atual ou é apenas decorativa
  
  // Atributos físicos e de profundidade
  left: string;
  size: number;           // Tamanho para variação física
  duration: number;
  delay: number;
  zIndex: number;         // Efeito de profundidade tridimensional
  theme: 'blue' | 'emerald' | 'gold' | 'violet' | 'dark' | 'rose' | 'glass';
  maxOpacity: number;
  driftX?: number;
  noCollision?: boolean;
  initialY?: string;
  impacts?: {
    corpo?: number;
    mente?: number;
    vida?: number;
    liberdade?: number;
    proposito?: number;
  };
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
