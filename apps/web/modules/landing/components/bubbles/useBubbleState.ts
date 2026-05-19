'use client';

import { useState, useEffect } from 'react';
import { CHALLENGE_PHRASES } from '@/modules/landing/constants/phrases';
import { BubbleConcept } from './types';
import { DECOR_CONCEPTS, BASE_CONCEPTS } from './bubble-pools';
import { useBlackboardSync } from './useBlackboardSync';
import { useGameModeSync } from './useGameModeSync';
import { useChatInteractions } from './useChatInteractions';

export function useBubbleState() {
  const [isMounted, setIsMounted] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isFirstPageLoad, setIsFirstPageLoad] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [isWhirlwind, setIsWhirlwind] = useState(true);

  // Integrar sub-hooks modulares
  const { attributes } = useBlackboardSync();
  const { gameMode, rewardBoxVisible, density, setDensity } = useGameModeSync();
  const { isLandingChatOpen } = useChatInteractions();

  // Ciclo geral timeouts/intervalos
  useEffect(() => {
    setIsMounted(true);

    const whirlwindTimeout = setTimeout(() => {
      setIsWhirlwind(false);
    }, 3500);

    const timeout = setTimeout(() => {
      setIsFirstPageLoad(false);
    }, 12000);

    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % CHALLENGE_PHRASES.length);
    }, 60000);

    return () => {
      clearTimeout(whirlwindTimeout);
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const toggleTooltip = (pillarKey: string) => {
    setActiveTooltip(prev => prev === pillarKey ? null : pillarKey);
  };

  const changeDensity = (newDensity: 'none' | 'low' | 'medium' | 'high') => {
    setDensity(newDensity);
  };

  // Lógica de cálculo de bolhas ativas para o render loop contínuo
  const getActiveConcepts = (): BubbleConcept[] => {
    if (density === 'none') {
      return [];
    }

    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const poolSize = Math.max(12, Math.floor(viewportHeight / 70));

    if (gameMode === 'decor') {
      const mapped = DECOR_CONCEPTS.map((c, idx) => ({
        ...c,
        id: `decor-${idx}`,
        theme: 'glass' as any
      })) as BubbleConcept[];

      const repeated: BubbleConcept[] = [];
      for (let i = 0; i < poolSize; i++) {
        const item = mapped[i % mapped.length];
        repeated.push({
          ...item,
          id: `${item.id}-${i}`
        });
      }
      return repeated;
    }

    const base = BASE_CONCEPTS.map((c, idx) => ({
      ...c,
      id: `base-${idx}`,
      theme: c.theme as any
    })) as BubbleConcept[];

    const repeated: BubbleConcept[] = [];
    for (let i = 0; i < poolSize; i++) {
      const item = base[i % base.length];
      repeated.push({
        ...item,
        id: `${item.id}-${i}`
      });
    }
    return repeated;
  };

  const activeConcepts = getActiveConcepts();

  return {
    isMounted,
    phraseIndex,
    density,
    isFirstPageLoad,
    attributes,
    activeTooltip,
    gameMode,
    rewardBoxVisible,
    isLandingChatOpen,
    isWhirlwind,
    activeConcepts,
    toggleTooltip,
    changeDensity
  };
}
