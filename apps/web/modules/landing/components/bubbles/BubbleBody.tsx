'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BubbleConcept } from './types';
import { THEME_STYLES } from './constants';
import { getBubbleIcon, getBubbleWordColor, getDecorIcon } from './helpers';
import { blackboardEventBus } from '@/modules/blackboard/events/eventBus';

const THEME_CLASSES = {
  blue: {
    bg: 'bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.12)_0%,rgba(56,189,248,0.03)_60%,rgba(56,189,248,0.01)_100%)]',
    border: 'border-sky-400/25',
    shadow: 'shadow-[inset_2px_2px_5px_rgba(56,189,248,0.25),inset_-2px_-2px_5px_rgba(0,0,0,0.08),0_8px_24px_rgba(56,189,248,0.15)]'
  },
  emerald: {
    bg: 'bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.12)_0%,rgba(16,185,129,0.03)_60%,rgba(16,185,129,0.01)_100%)]',
    border: 'border-emerald-400/25',
    shadow: 'shadow-[inset_2px_2px_5px_rgba(16,185,129,0.25),inset_-2px_-2px_5px_rgba(0,0,0,0.08),0_8px_24px_rgba(16,185,129,0.15)]'
  },
  gold: {
    bg: 'bg-[radial-gradient(circle_at_30%_30%,rgba(251,191,36,0.12)_0%,rgba(251,191,36,0.03)_60%,rgba(251,191,36,0.01)_100%)]',
    border: 'border-amber-400/25',
    shadow: 'shadow-[inset_2px_2px_5px_rgba(251,191,36,0.25),inset_-2px_-2px_5px_rgba(0,0,0,0.08),0_8px_24px_rgba(251,191,36,0.15)]'
  },
  violet: {
    bg: 'bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.12)_0%,rgba(139,92,246,0.03)_60%,rgba(139,92,246,0.01)_100%)]',
    border: 'border-purple-400/25',
    shadow: 'shadow-[inset_2px_2px_5px_rgba(139,92,246,0.25),inset_-2px_-2px_5px_rgba(0,0,0,0.08),0_8px_24px_rgba(139,92,246,0.15)]'
  },
  rose: {
    bg: 'bg-[radial-gradient(circle_at_30%_30%,rgba(239,68,68,0.12)_0%,rgba(239,68,68,0.03)_60%,rgba(239,68,68,0.01)_100%)]',
    border: 'border-red-400/25',
    shadow: 'shadow-[inset_2px_2px_5px_rgba(239,68,68,0.25),inset_-2px_-2px_5px_rgba(0,0,0,0.08),0_8px_24px_rgba(239,68,68,0.15)]'
  },
  dark: {
    bg: 'bg-slate-900',
    border: 'border-white/10',
    shadow: 'shadow-none'
  },
  glass: {
    bg: 'bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_60%,rgba(255,255,255,0.01)_100%)]',
    border: 'border-white/25',
    shadow: 'shadow-[inset_2px_2px_5px_rgba(255,255,255,0.25),inset_-2px_-2px_5px_rgba(0,0,0,0.08),0_8px_24px_rgba(255,255,255,0.15)]'
  }
} as const;

const THEME_RGB = {
  blue: '56, 189, 248',
  emerald: '16, 185, 129',
  gold: '251, 191, 36',
  violet: '139, 92, 246',
  rose: '239, 68, 68',
  dark: '15, 23, 42',
  glass: '255, 255, 255'
} as const;

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
  const theme = concept.theme || 'glass';
  const rgb = THEME_RGB[theme] || '255, 255, 255';

  const isRarePositive = concept.value === 'positive' && Math.abs(concept.points) === 2;
  const isRareNegative = concept.value === 'negative' && Math.abs(concept.points) === 2;

  const [isSelected, setIsSelected] = useState(false);

  const animIndex = React.useMemo(() => {
    const wordHash = concept.word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (wordHash + Math.round(size) + innerKey) % 5;
  }, [concept.word, size, innerKey]);

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

  const isSpecialOnboarding = concept.id === 'trigger-onboarding-bubble';
  const themeClass = THEME_CLASSES[theme] || THEME_CLASSES.glass;

  const bubbleClasses = cn(
    "w-full h-full rounded-full flex items-center justify-center select-none relative overflow-hidden transition-colors border",
    isSelected
      ? "border-[3px] border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.85),inset_0_0_12px_rgba(255,255,255,0.3)] bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.12)_0%,rgba(16,185,129,0.03)_60%,rgba(16,185,129,0.01)_100%)]"
      : (isSpecialOnboarding
          ? "border-[2.5px] border-emerald-400/95 shadow-[0_0_25px_rgba(16,185,129,0.75),inset_0_0_12px_rgba(255,255,255,0.45)] bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.85)_0%,rgba(4,120,87,0.6)_70%,rgba(6,78,59,0.5)_100%)]"
          : cn(themeClass.bg, themeClass.border, themeClass.shadow)
        )
  );

  return (
    <motion.div
      key={`inner-${innerKey}`}
      initial={{ scale: 1 }}
      animate={{
        scaleX: [1, 1.05, 0.95, 1.05, 1],
        scaleY: [1, 0.95, 1.05, 0.95, 1],
        rotate: [0, 2, -2, 2, 0],
        boxShadow: isSelected
          ? '0 0 25px rgba(16, 185, 129, 0.85), inset 0 0 12px rgba(255, 255, 255, 0.3)'
          : (theme === 'dark' ? 'none' : (
              isRarePositive ? [
                `0 0 0px rgba(${rgb}, 0), inset 2px 2px 5px rgba(${rgb}, 0.25), inset -2px -2px 5px rgba(0, 0, 0, 0.08)`,
                `0 0 35px rgba(${rgb}, 0.9), inset 2px 2px 8px rgba(255, 255, 255, 0.4), inset -2px -2px 5px rgba(0, 0, 0, 0.08)`,
                `0 0 0px rgba(${rgb}, 0), inset 2px 2px 5px rgba(${rgb}, 0.25), inset -2px -2px 5px rgba(0, 0, 0, 0.08)`
              ] : (isRareNegative ? [
                `0 0 0px rgba(${rgb}, 0), inset 2px 2px 5px rgba(${rgb}, 0.25), inset -2px -2px 5px rgba(0, 0, 0, 0.08)`,
                `0 0 35px rgba(${rgb}, 0.9), inset 2px 2px 8px rgba(255, 255, 255, 0.4), inset -2px -2px 5px rgba(0, 0, 0, 0.08)`,
                `0 0 0px rgba(${rgb}, 0), inset 2px 2px 5px rgba(${rgb}, 0.25), inset -2px -2px 5px rgba(0, 0, 0, 0.08)`
              ] : `inset 2px 2px 5px rgba(${rgb}, 0.25), inset -2px -2px 5px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(${rgb}, 0.15)`)
            ))
      }}
      exit={{
        scale: [1, 1.05, 0],
        opacity: 0,
        filter: 'blur(5px)',
        transition: { duration: 0.45, ease: 'easeOut' }
      }}
      transition={{
        duration: 3.0 + animIndex * 0.4,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={bubbleClasses}
    >
      {theme !== 'dark' && (
        <div className="absolute top-[8%] left-[8%] w-[32%] h-[32%] rounded-full bg-gradient-to-br from-white/40 to-transparent blur-[1px] pointer-events-none" />
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
              className="font-extrabold tracking-normal text-center select-none pointer-events-none z-2 px-3 break-words leading-tight text-white font-outfit drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
              style={{
                fontSize: `${size * 0.11}px`
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
        const wordLen = concept.word.length;
        let fontFactor = 0.18;
        if (wordLen > 15) fontFactor = 0.115;
        else if (wordLen > 10) fontFactor = 0.135;
        else if (wordLen > 7) fontFactor = 0.155;

        const minFontSize = size < 50 ? 8.5 : 11;

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
            className="font-black tracking-normal text-center select-none pointer-events-none z-2 w-[90%] px-1 break-words leading-tight text-white font-outfit drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
            style={{
              fontSize: `${Math.max(minFontSize, size * fontFactor)}px`
            }}
          >
            {concept.word}
          </motion.span>
        );
      })()}
    </motion.div>
  );
}
