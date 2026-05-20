'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { FloatingBubble } from './FloatingBubble';
import { BubbleConcept } from './types';

interface FloatingBubblesStageProps {
  activeConcepts: BubbleConcept[];
  isFirstPageLoad: boolean;
  gameMode: 'decor' | 'onboarding_game' | 'normal';
  isWhirlwind: boolean;
  density: 'none' | 'low' | 'medium' | 'high';
}

export default function FloatingBubblesStage({
  activeConcepts,
  isFirstPageLoad,
  gameMode,
  isWhirlwind,
  density
}: FloatingBubblesStageProps) {
  return (
    <AnimatePresence>
      {activeConcepts.map((concept) => (
        <FloatingBubble
          key={concept.id}
          concept={concept}
          isFirstPageLoad={isFirstPageLoad}
          gameMode={gameMode}
          isWhirlwind={isWhirlwind}
          density={density}
        />
      ))}
    </AnimatePresence>
  );
}
