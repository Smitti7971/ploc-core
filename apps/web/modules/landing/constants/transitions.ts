/**
 * Presets de Transições e Curvas do Framer Motion para a Landing Page do Ploc.
 * Fornece micro-interações elegantes e acelerações fluidas e unificadas.
 */

// Curva Bezier Ultra-Suave Premium (Semelhante a Quintic Out / Apple Spring)
export const PREMIUM_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Transição padrão para painéis, tooltips de HUD e balões de chat
export const PANEL_TRANSITION = {
  duration: 0.5,
  ease: PREMIUM_EASE
};

// Transição de transição para títulos com blur
export const HEADER_TRANSITION = {
  duration: 1.5,
  ease: PREMIUM_EASE
};

// Transição para botões e ações rápidas
export const BUTTON_TRANSITION = {
  duration: 0.3,
  ease: PREMIUM_EASE
};

// Presets físicos de molas (springs) para física de bolhas prioritárias e Ploc Mascot
export const SPRING_PRESETS = {
  soft: { type: 'spring', stiffness: 50, damping: 15 },
  snappy: { type: 'spring', stiffness: 100, damping: 12 },
  bouncy: { type: 'spring', stiffness: 150, damping: 10 }
} as const;
