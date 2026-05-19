export const THEME_STYLES = {
  blue: {
    bg: 'rgba(56, 189, 248, 0.04)',
    border: 'rgba(56, 189, 248, 0.12)',
    text: 'rgba(56, 189, 248, 0.35)',
    shadow: '0 4px 16px rgba(56, 189, 248, 0.02)',
    particle: '#38bdf8'
  },
  emerald: {
    bg: 'rgba(16, 185, 129, 0.04)',
    border: 'rgba(16, 185, 129, 0.12)',
    text: 'rgba(52, 211, 153, 0.35)',
    shadow: '0 4px 16px rgba(16, 185, 129, 0.02)',
    particle: '#10b981'
  },
  gold: {
    bg: 'rgba(251, 191, 36, 0.04)',
    border: 'rgba(251, 191, 36, 0.12)',
    text: 'rgba(251, 191, 36, 0.35)',
    shadow: '0 4px 16px rgba(251, 191, 36, 0.02)',
    particle: '#fbbf24'
  },
  violet: {
    bg: 'rgba(139, 92, 246, 0.04)',
    border: 'rgba(139, 92, 246, 0.12)',
    text: 'rgba(167, 139, 250, 0.35)',
    shadow: '0 4px 16px rgba(139, 92, 246, 0.02)',
    particle: '#8b5cf6'
  },
  rose: {
    bg: 'rgba(239, 68, 68, 0.04)',
    border: 'rgba(239, 68, 68, 0.16)',
    text: 'rgba(248, 113, 113, 0.45)',
    shadow: '0 4px 16px rgba(239, 68, 68, 0.02)',
    particle: '#ef4444'
  },
  dark: {
    bg: 'rgba(0, 0, 0, 0.45)',
    border: 'rgba(255, 255, 255, 0.03)',
    text: 'rgba(255, 255, 255, 0.15)',
    shadow: 'none',
    particle: 'rgba(0, 0, 0, 0.5)'
  },
  glass: {
    bg: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.03) 70%, rgba(255, 255, 255, 0.01) 100%)',
    border: 'rgba(255, 255, 255, 0.16)',
    text: 'rgba(255, 255, 255, 0.28)',
    shadow: 'inset 0 0 6px rgba(255,255,255,0.06), 0 4px 12px rgba(255, 255, 255, 0.01)',
    particle: 'rgba(255, 255, 255, 0.4)'
  }
} as const;
