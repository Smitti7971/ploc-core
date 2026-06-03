/**
 * ============================================================================
 * Partículas de Bolhas - PlocBubbles.tsx
 * ============================================================================
 * Descrição: Componente visual de segundo plano que gera pequenas bolhas de ar
 * flutuando de baixo para cima atrás do mascote Ploc.
 * 
 * Principais responsabilidades:
 * - Renderiza 5 pequenas bolhas semi-transparentes em posições aleatórias.
 * - Aplica micro-animações infinitas usando Framer Motion (mudanças suaves
 *   de opacidade, trajetórias senoidais horizontais e elevação vertical).
 * ============================================================================
 */

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function PlocBubbles() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setIsMobile(window.innerWidth < 768);
  }, []);

  const sizeMultiplier = isMobile ? 0.6 : 1;

  return (
    <div className="absolute inset-0 z-0">
      {[1, 2, 3, 4, 5].map((b) => (
        <motion.div
          key={b}
          animate={{
            y: [0, -30 * sizeMultiplier, 0],
            x: [0, Math.cos(b) * 15 * sizeMultiplier, 0],
            opacity: [.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5 + b,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute border border-white/30 rounded-full"
          style={{
            bottom: `${10 + b * 15}%`,
            left: `${15 + (b % 3) * 20}%`,
            width: `${(6 + b * 2) * sizeMultiplier}px`,
            height: `${(6 + b * 2) * sizeMultiplier}px`,
            // background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 70%)',
          }}
        />
      ))}
    </div>
  );
}
