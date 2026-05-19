'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BubbleConcept } from './types';
import { THEME_STYLES } from './constants';
import { getBubbleIcon, getBubbleWordColor, getDecorIcon } from './helpers';
import { blackboardEventBus } from '@/modules/blackboard/events/eventBus';

interface BubbleBodyProps {
  concept: BubbleConcept;
  gameMode: 'decor' | 'onboarding_game' | 'normal';
  size: number;
  innerKey: number;
}

export default function BubbleBody({
  concept,
  gameMode,
  size,
  innerKey
}: BubbleBodyProps) {
  const themeStyles = THEME_STYLES[concept.theme];

  const isRarePositive = concept.value === 'positive' && Math.abs(concept.points) === 2;
  const isRareNegative = concept.value === 'negative' && Math.abs(concept.points) === 2;
  const isNegative = concept.value === 'negative';

  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (concept.ref.startsWith('prio_')) {
      const handleSelected = (pillar: any) => {
        setIsSelected(pillar === concept.pillar);
      };
      const handleReset = () => {
        setIsSelected(false);
      };
      const sub1 = blackboardEventBus.subscribe('PRIORITY_PILLAR_SELECTED', handleSelected);
      const sub2 = blackboardEventBus.subscribe('PRIORITY_PILLAR_RESET', handleReset);
      return () => {
        sub1();
        sub2();
      };
    }
  }, [concept.pillar, concept.ref]);

  return (
    <motion.div
      key={`inner-${innerKey}`}
      initial={{ scale: 0.8 }}
      animate={{
        scaleX: [1, 1.04, 0.96, 1.04, 1],
        scaleY: [1, 0.96, 1.04, 0.96, 1],
        rotate: [0, 4, -4, 4, 0],
        boxShadow: isSelected
          ? '0 0 25px rgba(16, 185, 129, 0.85), inset 0 0 12px rgba(255, 255, 255, 0.3)'
          : (concept.theme === 'dark' ? 'none' : (
            isRarePositive ? [
              `0 0 0px rgba(251, 191, 36, 0), inset 0 0 10px rgba(255, 255, 255, 0.15), ${themeStyles.shadow}`,
              `0 0 35px rgba(251, 191, 36, 0.9), inset 0 0 18px rgba(255, 255, 255, 0.5), ${themeStyles.shadow}`,
              `0 0 0px rgba(251, 191, 36, 0), inset 0 0 10px rgba(255, 255, 255, 0.15), ${themeStyles.shadow}`
            ] : (isRareNegative ? [
              `0 0 0px rgba(239, 68, 68, 0), inset 0 0 10px rgba(255, 255, 255, 0.15), ${themeStyles.shadow}`,
              `0 0 35px rgba(239, 68, 68, 0.9), inset 0 0 18px rgba(255, 255, 255, 0.5), ${themeStyles.shadow}`,
              `0 0 0px rgba(239, 68, 68, 0), inset 0 0 10px rgba(255, 255, 255, 0.15), ${themeStyles.shadow}`
            ] : `inset 0 0 12px rgba(255, 255, 255, 0.15), 0 4px 20px rgba(0, 0, 0, 0.05)`)
          ))
      }}
      exit={{
        scale: [1, 1.25, 0],
        opacity: 0,
        filter: 'blur(5px)',
        transition: { duration: 0.45, ease: 'easeOut' }
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={cn(
        "w-full h-full rounded-full flex items-center justify-center select-none relative overflow-hidden will-change-[transform,opacity]",
        concept.theme === 'glass' ? "backdrop-blur-[4.5px]" : "backdrop-blur-[5px]"
      )}
      style={{
        background: concept.id === 'trigger-onboarding-bubble'
          ? 'radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.85) 0%, rgba(4, 120, 87, 0.6) 70%, rgba(6, 78, 59, 0.5) 100%)'
          : (concept.theme === 'glass' ? themeStyles.bg : (
              gameMode === 'decor' ? 'rgba(255, 255, 255, 0.06)' : (
                concept.theme === 'dark' ? themeStyles.bg : (
                  isNegative 
                    ? 'radial-gradient(circle at 30% 30%, rgba(239, 68, 68, 0.45) 0%, rgba(185, 28, 28, 0.25) 70%, rgba(127, 29, 29, 0.15) 100%)' 
                    : 'radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.45) 0%, rgba(21, 128, 61, 0.25) 70%, rgba(20, 83, 45, 0.15) 100%)'
                )
              )
            )),
        border: isSelected
          ? '3px solid #10b981'
          : (concept.id === 'trigger-onboarding-bubble'
              ? '2.5px solid rgba(52, 211, 153, 0.95)'
              : (concept.theme === 'glass' 
                ? `1.5px solid ${themeStyles.border}` 
                : (
                  gameMode === 'decor' 
                    ? '1px solid rgba(255, 255, 255, 0.15)' 
                    : (isNegative ? '2px solid rgba(239, 68, 68, 0.65)' : '2px solid rgba(34, 197, 94, 0.65)')
                )
              )),
        boxShadow: isSelected
          ? '0 0 25px rgba(16, 185, 129, 0.85), inset 0 0 12px rgba(255, 255, 255, 0.3)'
          : (concept.id === 'trigger-onboarding-bubble'
              ? '0 0 25px rgba(16, 185, 129, 0.75), inset 0 0 12px rgba(255, 255, 255, 0.45)'
              : (concept.theme === 'glass' ? themeStyles.shadow : (
                gameMode === 'decor' ? 'inset 0 0 12px rgba(255, 255, 255, 0.15), 0 4px 20px rgba(0, 0, 0, 0.02)' : (
                  concept.theme === 'dark' ? 'none' : (
                    isNegative 
                      ? `inset 0 0 10px rgba(255, 255, 255, 0.25), 0 0 15px rgba(239, 68, 68, 0.35)` 
                      : `inset 0 0 10px rgba(255, 255, 255, 0.25), 0 0 15px rgba(34, 197, 94, 0.35)`
                  )
                )
              )))
      }}
    >
      {concept.theme !== 'dark' && (
        <div className="absolute top-[8%] left-[8%] w-[32%] h-[32%] rounded-full bg-gradient-to-br from-white/20 to-transparent blur-[1px] pointer-events-none" />
      )}

      {gameMode === 'decor' && (() => {
        if (concept.id === 'trigger-onboarding-bubble') {
          return (
            <motion.span
              animate={{
                y: [0, 3, -3, 0],
                x: [0, -1, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="font-extrabold tracking-normal text-center select-none pointer-events-none z-2 px-3 break-words leading-tight"
              style={{
                color: '#ffffff',
                fontSize: `${size * 0.11}px`,
                fontFamily: 'Outfit, sans-serif',
                textShadow: '0 2px 5px rgba(0,0,0,0.5)'
              }}
            >
              {concept.word}
            </motion.span>
          );
        }
        const IconComponent = getDecorIcon(concept.word, concept.pillar);
        if (IconComponent) {
          return (
            <motion.div
              animate={{
                y: [0, 2, -2, 0],
                x: [0, -0.5, 0.5, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="flex items-center justify-center pointer-events-none z-2 text-gray-400/48"
            >
              <IconComponent size={size * 0.36} />
            </motion.div>
          );
        }
        return null;
      })()}

      {gameMode !== 'decor' && concept.theme !== 'dark' && (() => {
        // Para bolhas do jogo, mostramos sempre a palavra de ação correspondente (ex: "Fast-food", "Meditação")
        // Garantindo que o usuário consiga identificar e ler instantaneamente no game com ajuste de fonte dinâmico
        const wordLen = concept.word.length;
        let fontFactor = 0.18;
        if (wordLen > 15) fontFactor = 0.115;
        else if (wordLen > 10) fontFactor = 0.135;
        else if (wordLen > 7) fontFactor = 0.155;

        return (
          <motion.span
            animate={{
              y: [0, 3, -3, 0],
              x: [0, -1, 1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="font-black tracking-normal text-center select-none pointer-events-none z-2 w-[90%] px-1 break-words leading-tight"
            style={{
              color: '#ffffff',
              fontSize: `${size * fontFactor}px`,
              fontFamily: 'Outfit, sans-serif',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            {concept.word}
          </motion.span>
        );
      })()}
    </motion.div>
  );
}
