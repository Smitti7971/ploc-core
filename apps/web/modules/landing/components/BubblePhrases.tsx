'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useBubbleState } from './bubbles/useBubbleState';
import { FloatingBubble } from './bubbles/FloatingBubble';
import ChallengePhrasesText from './ChallengePhrasesText';
import LandingPlocChat from './LandingPlocChat';
import PillarTooltipPanel from './PillarTooltipPanel';
import PillarsControlGroup from './PillarsControlGroup';
import RewardGiftBox from './RewardGiftBox';

export default function BubblePhrases() {
  const {
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
  } = useBubbleState();

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none w-screen h-screen overflow-hidden">
      {/* ── 1. Letreiro Central e Elementos Flutuantes Centrais ── */}
      <div
        className="absolute left-0 right-0 w-full text-center pointer-events-none z-15 flex flex-col items-center justify-center"
        style={{
          top: 'calc(50% + 75px)'
        }}
      >
        <ChallengePhrasesText phraseIndex={phraseIndex} />
        <LandingPlocChat isOpen={isLandingChatOpen} />
        <PillarTooltipPanel activeTooltip={activeTooltip} attributes={attributes} />
      </div>

      {/* ── 2. Bolhas Flutuantes (Motor de Colisão & Render) ── */}
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

      {/* ── 3. Controle Lateral de Pilares e Densidade ── */}
      <PillarsControlGroup
        gameMode={gameMode}
        density={density}
        activeTooltip={activeTooltip}
        attributes={attributes}
        onToggleTooltip={toggleTooltip}
        onChangeDensity={changeDensity}
      />

      {/* ── 4. Recompensa ── */}
      <RewardGiftBox visible={rewardBoxVisible} />
    </div>
  );
}
