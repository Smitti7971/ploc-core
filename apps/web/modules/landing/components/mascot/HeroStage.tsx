'use client';

import React from 'react';

interface HeroStageProps {
  children: React.ReactNode;
}

/**
 * ============================================================================
 * Palco Principal - HeroStage.tsx
 * ============================================================================
 * Descrição: Container wrapper (palco) da Landing Page.
 * Centraliza o mascote e as mensagens com z-index seguro acima da atmosfera.
 * ============================================================================
 */
export const HeroStage: React.FC<HeroStageProps> = ({ children }) => {
  return (
    <section 
      className="relative w-full max-w-(--breakpoint-xl) px-5 flex flex-col items-center text-center z-20 pointer-events-none"
    >
      {children}
    </section>
  );
};
