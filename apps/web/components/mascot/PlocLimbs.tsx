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

import { motion, useTransform, useMotionValue } from 'framer-motion';
import { PlocAppearance } from './types';

interface PlocLimbsProps {
  limbColor: string;
  limbShadow: string;
  appearance?: PlocAppearance;
  size?: number;
  dragX?: any;
  isSick?: boolean;
  hungerLevel?: number;
}

export function PlocLimbs({ limbColor, limbShadow, appearance, size = 120, dragX, isSick = false, hungerLevel }: PlocLimbsProps) {
  const scale = size / 120;
  
  // Guarantee activeDragX is a MotionValue to prevent type mismatches
  const fallbackDragX = useMotionValue(0);
  const activeDragX = dragX || fallbackDragX;

  // Parallax horizontal shifts for 2D perspective
  // When facing Right (80): Right arm is BACK (-18), Left arm is FRONT (+14).
  // When facing Left (-80): Left arm is BACK (18), Right arm is FRONT (-14).
  const leftArmX = useTransform(activeDragX, [-80, 0, 80], [18, 0, 14], { clamp: true });
  const rightArmX = useTransform(activeDragX, [-80, 0, 80], [-14, 0, -18], { clamp: true });
  
  const leftLegX = useTransform(activeDragX, [-80, 0, 80], [12, 0, 2], { clamp: true });
  const rightLegX = useTransform(activeDragX, [-80, 0, 80], [-2, 0, -12], { clamp: true });

  // Darkness overlay for hardware-accelerated 3D shading
  const leftDarkness = useTransform(activeDragX, [-80, 0, 80], [0.45, 0, 0], { clamp: true });
  const rightDarkness = useTransform(activeDragX, [-80, 0, 80], [0, 0, 0.45], { clamp: true });

  // Left side transforms (Screen Left limbs)
  const leftZIndex = useTransform(activeDragX, [-80, 0, 80], [0, 25, 25], { clamp: true });
  const leftZIndexRounded = useTransform(leftZIndex, (z: number) => Math.round(z));

  // Right side transforms (Screen Right limbs)
  const rightZIndex = useTransform(activeDragX, [-80, 0, 80], [25, 25, 0], { clamp: true });
  const rightZIndexRounded = useTransform(rightZIndex, (z: number) => Math.round(z));

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Braços Stick (Esquerda/Direita) */}
      {[-1, 1].map((side) => {
        const zIndexVal = side === -1 ? leftZIndexRounded : rightZIndexRounded;
        const armXVal = side === -1 ? leftArmX : rightArmX;
        const isHungry = hungerLevel !== undefined && hungerLevel < 40;
        const isRubbingBelly = isHungry && side === -1;

        return (
          <motion.div
            key={`stick-arm-wrapper-${side}`}
            className={`absolute top-1/2 ${side === -1 ? 'left-[-19%]' : 'right-[-19%]'}`}
            style={{ zIndex: (isRubbingBelly ? 30 : zIndexVal) as any }}
            initial={false}
            animate={isRubbingBelly ? {
              x: [35 * scale, 45 * scale, 35 * scale, 25 * scale, 35 * scale],
              y: [15 * scale, 25 * scale, 35 * scale, 25 * scale, 15 * scale],
            } : {
              x: 0,
              y: 0,
            }}
            transition={isRubbingBelly 
              ? { duration: 1.5, repeat: Infinity, ease: "linear" } 
              : { duration: 0.5, ease: "easeInOut" }
            }
          >
            <motion.div
              key={`stick-arm-${side}`}
              animate={{ 
                rotate: isSick 
                  ? [side * 65, side * 75, side * 65] 
                  : (isRubbingBelly ? [-130, -110, -130] : [side * 20, side * 40, side * 20])
              }}
              transition={{ 
                duration: isSick ? 3 : (isRubbingBelly ? 1.5 : 2), 
                repeat: Infinity, 
                ease: isRubbingBelly ? "linear" : "easeInOut" 
              }}
              style={{
                background: limbColor,
                boxShadow: limbShadow,
                transformOrigin: side === -1 ? 'right center' : 'left center',
                width: `${20 * scale}px`,
                height: `${6 * scale}px`,
                borderRadius: `${3 * scale}px`,
                x: armXVal,
                transition: 'background 1.5s ease, box-shadow 1.5s ease',
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
                overflow: 'hidden',
                transition: 'background 1.5s ease, box-shadow 1.5s ease',
              }}
            >
              <motion.div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: side === -1 ? leftDarkness : rightDarkness }} />
            </div>

            {/* Sombra de Profundidade no Braço */}
            <motion.div 
              className="absolute inset-0 pointer-events-none" 
              style={{ 
                backgroundColor: 'black', 
                opacity: side === -1 ? leftDarkness : rightDarkness,
                borderRadius: `${3 * scale}px`,
              }} 
            />
            </motion.div>
          </motion.div>
        );
      })}

      {/* Perninhas Stick Flutuantes (Esquerda/Direita) */}
      {[-1, 1].map((side) => {
        const zIndexVal = side === -1 ? leftZIndexRounded : rightZIndexRounded;
        const legXVal = side === -1 ? leftLegX : rightLegX;

        return (
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
            className={`absolute bottom-[-12%] ${side === -1 ? 'left-[22%]' : 'right-[22%]'}`}
            style={{
              background: limbColor,
              boxShadow: limbShadow,
              transformOrigin: 'top center',
              width: `${8 * scale}px`,
              height: `${16 * scale}px`,
              borderRadius: `${4 * scale}px`,
              x: legXVal,
              zIndex: zIndexVal as any,
              transition: 'background 1.5s ease, box-shadow 1.5s ease',
            }}
          >
            {/* Sapatos */}
            {appearance && appearance.shoes !== 'none' && (
              <div
                className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center justify-center overflow-hidden"
                style={{
                  background: appearance.shoes === 'sneakers' ? '#f43f5e' : (appearance.shoes === 'boots' ? '#b45309' : '#f472b6'),
                  borderBottom: appearance.shoes === 'sneakers' ? `${2 * scale}px solid #ffffff` : 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  width: `${18 * scale}px`,
                  height: `${12 * scale}px`,
                  bottom: `${-6 * scale}px`,
                  borderRadius: `${3 * scale}px`,
                }}
              >
                <motion.div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: side === -1 ? leftDarkness : rightDarkness }} />
              </div>
            )}
            {/* Sombra de Profundidade na Perna */}
            <motion.div 
              className="absolute inset-0 pointer-events-none" 
              style={{ 
                backgroundColor: 'black', 
                opacity: side === -1 ? leftDarkness : rightDarkness,
                borderRadius: `${4 * scale}px`,
              }} 
            />
          </motion.div>
        );
      })}
    </div>
  );
}
