/**
 * ============================================================================
 * Membros do Ploc - PlocLimbs.tsx
 * ============================================================================
 * Descrição: Componente gráfico que renderiza os membros (braços e pernas) do
 * mascote Ploc com estilo de traço ("stick figure").
 * 
 * Principais responsabilidades:
 * - Desenha braços e perninhas animados e flutuantes nas laterais e base do Ploc.
 * - Aplica oscilações infinitas em tempo real usando Framer Motion para dar a
 *   sensação tridimensional de flutuação em água ("gelatin breathe").
 * - Recebe dinamicamente as cores e sombras de membros baseadas no estado de
 *   humor/irritação atual do mascote.
 * ============================================================================
 */

import { motion } from 'framer-motion';
import { PlocAppearance } from './types';

interface PlocLimbsProps {
  limbColor: string;
  limbShadow: string;
  appearance?: PlocAppearance;
  size?: number;
}

export function PlocLimbs({ limbColor, limbShadow, appearance, size = 120 }: PlocLimbsProps) {
  const scale = size / 120;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Braços Stick (Esquerda/Direita) */}
      {[-1, 1].map((side) => (
        <motion.div
          key={`stick-arm-${side}`}
          animate={{ rotate: [side * 20, side * 40, side * 20] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-1/2 ${side === -1 ? 'left-[-19%]' : 'right-[-19%]'
            }`}
          style={{
            background: limbColor,
            boxShadow: limbShadow,
            transformOrigin: side === -1 ? 'right center' : 'left center',
            width: `${20 * scale}px`,
            height: `${6 * scale}px`,
            borderRadius: `${3 * scale}px`,
          }}
        >
          {/* Mãozinhas Redondas */}
          <div
            className="absolute rounded-full"
            style={{
              background: limbColor,
              boxShadow: limbShadow,
              top: `${-2 * scale}px`,
              width: `${10 * scale}px`,
              height: `${10 * scale}px`,
              left: side === -1 ? `${-8 * scale}px` : undefined,
              right: side === 1 ? `${-8 * scale}px` : undefined,
            }}
          />
        </motion.div>
      ))}

      {/* Perninhas Stick Flutuantes (Esquerda/Direita) */}
      {[-1, 1].map((side) => (
        <motion.div
          key={`stick-leg-${side}`}
          animate={{
            y: [0, 4 * scale, 0],
            rotate: [0, side * 10, 0]
          }}
          transition={{
            duration: 1.5 + Math.abs(side) * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute bottom-[-12%] ${side === -1 ? 'left-[22%]' : 'right-[22%]'
            }`}
          style={{
            background: limbColor,
            boxShadow: limbShadow,
            transformOrigin: 'top center',
            width: `${8 * scale}px`,
            height: `${16 * scale}px`,
            borderRadius: `${4 * scale}px`,
          }}
        >
          {/* Sapatos */}
          {appearance && appearance.shoes !== 'none' && (
            <div
              className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center justify-center"
              style={{
                background: appearance.shoes === 'sneakers' ? '#f43f5e' : (appearance.shoes === 'boots' ? '#b45309' : '#f472b6'),
                borderBottom: appearance.shoes === 'sneakers' ? `${2 * scale}px solid #ffffff` : 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                width: `${18 * scale}px`,
                height: `${12 * scale}px`,
                bottom: `${-6 * scale}px`,
                borderRadius: `${3 * scale}px`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
