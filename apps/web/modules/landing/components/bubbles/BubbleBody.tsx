'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BubbleConcept } from './types';
import { THEME_STYLES } from './constants';
import { getBubbleIcon, getBubbleWordColor, getDecorIcon } from './helpers';

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

  const wordUpper = concept.word.toUpperCase();
  const isRarePositive = wordUpper.startsWith('S') && parseInt(wordUpper.substring(1)) <= 5;
  const isRareNegative = wordUpper.startsWith('S') && parseInt(wordUpper.substring(1)) > 5;
  const isNegative = isRareNegative || (wordUpper.startsWith('N') && parseInt(wordUpper.substring(1)) > 10);

  return (
    <motion.div
      key={`inner-${innerKey}`}
      initial={{ scale: 0.8 }}
      animate={{
        scaleX: [1, 1.04, 0.96, 1.04, 1],
        scaleY: [1, 0.96, 1.04, 0.96, 1],
        rotate: [0, 4, -4, 4, 0],
        boxShadow: concept.theme === 'dark' ? 'none' : (
          isRarePositive ? [
            `0 0 0px rgba(251, 191, 36, 0), inset 0 0 10px rgba(255, 255, 255, 0.15), ${themeStyles.shadow}`,
            `0 0 35px rgba(251, 191, 36, 0.9), inset 0 0 18px rgba(255, 255, 255, 0.5), ${themeStyles.shadow}`,
            `0 0 0px rgba(251, 191, 36, 0), inset 0 0 10px rgba(255, 255, 255, 0.15), ${themeStyles.shadow}`
          ] : (isRareNegative ? [
            `0 0 0px rgba(239, 68, 68, 0), inset 0 0 10px rgba(255, 255, 255, 0.15), ${themeStyles.shadow}`,
            `0 0 35px rgba(239, 68, 68, 0.9), inset 0 0 18px rgba(255, 255, 255, 0.5), ${themeStyles.shadow}`,
            `0 0 0px rgba(239, 68, 68, 0), inset 0 0 10px rgba(255, 255, 255, 0.15), ${themeStyles.shadow}`
          ] : `inset 0 0 12px rgba(255, 255, 255, 0.15), 0 4px 20px rgba(0, 0, 0, 0.05)`)
        )
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
        concept.theme === 'dark' ? "" : (concept.theme === 'glass' ? "backdrop-blur-[4.5px]" : "backdrop-blur-[5px]")
      )}
      style={{
        background: concept.theme === 'glass' ? themeStyles.bg : (
          gameMode === 'decor' ? 'rgba(255, 255, 255, 0.06)' : (
            concept.theme === 'dark' ? themeStyles.bg : (
              isNegative ? 'rgba(239, 68, 68, 0.18)' : 'rgba(34, 197, 94, 0.18)'
            )
          )
        ),
        border: concept.theme === 'glass' ? `1.5px solid ${themeStyles.border}` : 'none',
        boxShadow: concept.theme === 'glass' ? themeStyles.shadow : (
          gameMode === 'decor' ? 'inset 0 0 12px rgba(255, 255, 255, 0.15), 0 4px 20px rgba(0, 0, 0, 0.02)' : (
            concept.theme === 'dark' ? 'none' : (
              isRarePositive ? `
                0 0 15px rgba(251, 191, 36, 0.4),
                inset 0 0 10px rgba(255, 255, 255, 0.3),
                ${themeStyles.shadow}
              ` : (isRareNegative ? `
                0 0 15px rgba(239, 68, 68, 0.4),
                inset 0 0 10px rgba(255, 255, 255, 0.3),
                ${themeStyles.shadow}
              ` : `
                inset 0 0 12px rgba(255, 255, 255, 0.15),
                0 4px 20px rgba(0, 0, 0, 0.05)
              `)
            )
          )
        )
      }}
    >
      {concept.theme !== 'dark' && (
        <div className="absolute top-[8%] left-[8%] w-[32%] h-[32%] rounded-full bg-gradient-to-br from-white/15 to-transparent blur-[1px] pointer-events-none" />
      )}

      {gameMode === 'decor' && (() => {
        const IconComponent = getDecorIcon(concept.word);
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
        const IconComponent = getBubbleIcon(concept.word);
        if (IconComponent) {
          const color = getBubbleWordColor(concept.word);
          return (
            <motion.div
              animate={{
                y: [0, 3, -3, 0],
                x: [0, -1, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="flex items-center justify-center pointer-events-none z-2"
              style={{ color }}
            >
              <IconComponent size={size * 0.38} />
            </motion.div>
          );
        }

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
            className="font-black tracking-wider text-center select-none pointer-events-none z-2"
            style={{
              color: getBubbleWordColor(concept.word),
              fontSize: `${size * 0.35}px`,
              fontFamily: 'Outfit, sans-serif',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            {concept.word}
          </motion.span>
        );
      })()}
    </motion.div>
  );
}
