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
}

export function PlocLimbs({ limbColor, limbShadow, appearance }: PlocLimbsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Braços Stick (Esquerda/Direita) */}
      {[-1, 1].map((side) => (
        <motion.div
          key={`stick-arm-${side}`}
          animate={{ rotate: [side * 20, side * 40, side * 20] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-1/2 w-5 h-[6px] rounded-[3px] ${
            side === -1 ? 'left-[-25%]' : 'right-[-25%]'
          }`}
          style={{
            background: limbColor,
            boxShadow: limbShadow,
            transformOrigin: side === -1 ? 'right center' : 'left center',
          }}
        >
          {/* Mãozinhas Redondas */}
          <div
            className={`absolute top-[-2px] w-2.5 h-2.5 rounded-full ${
              side === -1 ? 'left-[-8px]' : 'right-[-8px]'
            }`}
            style={{
              background: limbColor,
              boxShadow: limbShadow,
            }}
          />
        </motion.div>
      ))}

      {/* Perninhas Stick Flutuantes (Esquerda/Direita) */}
      {[-1, 1].map((side) => (
        <motion.div
          key={`stick-leg-${side}`}
          animate={{ 
            y: [0, 4, 0], 
            rotate: [0, side * 10, 0] 
          }}
          transition={{ 
            duration: 1.5 + Math.abs(side) * 0.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className={`absolute bottom-[-12%] w-2 h-4 rounded-[4px] ${
            side === -1 ? 'left-[22%]' : 'right-[22%]'
          }`}
          style={{
            background: limbColor,
            boxShadow: limbShadow,
            transformOrigin: 'top center',
          }}
        >
          {/* Sapatos */}
          {appearance && appearance.shoes !== 'none' && (
            <div
              className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-4.5 h-3 rounded-[3px] z-10 flex items-center justify-center"
              style={{
                background: appearance.shoes === 'sneakers' ? '#f43f5e' : (appearance.shoes === 'boots' ? '#b45309' : '#f472b6'),
                borderBottom: appearance.shoes === 'sneakers' ? '2px solid #ffffff' : 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
