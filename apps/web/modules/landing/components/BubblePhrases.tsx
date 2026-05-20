'use client';

import React from 'react';
import { useBubbleState } from '../hooks/useBubbleState';
import FloatingBubblesStage from './bubbles/FloatingBubblesStage';
import ChallengePhrasesText from './ChallengePhrasesText';
import LandingPlocChat from './LandingPlocChat';
import PillarTooltipPanel from './PillarTooltipPanel';
import PillarsControlGroup from './PillarsControlGroup';
import RewardGiftBox from './RewardGiftBox';
import { MascotCenter } from './mascot/MascotCenter';

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
    onboardingStage,
    toggleTooltip,
    changeDensity
  } = useBubbleState();

  if (!isMounted) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none w-full h-full overflow-hidden"
    >
      {/* ── 0. O Mascote Ploc Centralizado (Participa da hierarquia global de z-index) ── */}
      <MascotCenter />

      {/* ── 1. Letreiro Central e Elementos Flutuantes Centrais ── */}
      <div
        className="absolute left-0 right-0 w-full text-center pointer-events-none flex flex-col items-center justify-center top-[calc(50%+75px)] z-15"
      >
        <ChallengePhrasesText phraseIndex={phraseIndex} />
        <LandingPlocChat isOpen={isLandingChatOpen} />
        <PillarTooltipPanel activeTooltip={activeTooltip} attributes={attributes} />
      </div>

      {/* ── 2. Bolhas Flutuantes (Motor de Colisão & Render) na mesma hierarquia de z-index ── */}
      <FloatingBubblesStage
        activeConcepts={activeConcepts}
        isFirstPageLoad={isFirstPageLoad}
        gameMode={gameMode}
        isWhirlwind={isWhirlwind}
        density={density}
      />

      {/* ── 3. Controle Lateral de Pilares e Densidade ── */}
      <PillarsControlGroup
        gameMode={gameMode}
        density={density}
        activeTooltip={activeTooltip}
        attributes={attributes}
        onToggleTooltip={toggleTooltip}
        onChangeDensity={changeDensity}
        onboardingStage={onboardingStage}
      />

      {/* ── 4. Recompensa ── */}
      <RewardGiftBox visible={rewardBoxVisible} />
    </div>
  );
}
