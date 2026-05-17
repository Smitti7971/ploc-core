'use client';

import React from 'react';

interface HeroStageProps {
  children: React.ReactNode;
}

/**
 * HeroStage — O palco principal da Landing Page.
 * Centraliza o mascote e as mensagens com z-index seguro acima da atmosfera.
 */
export const HeroStage: React.FC<HeroStageProps> = ({ children }) => {
  return (
    <section 
      className="relative w-full max-w-(--breakpoint-xl) px-5 flex flex-col items-center text-center"
      style={{ zIndex: 20, pointerEvents: 'none' }} // Ploc Mascot retorna soberano ao zIndex: 20 (À frente do texto central 3 e bolhas de fundo/médias 5/15, mas atrás das bolhas gigantes 25)
    >
      {children}
    </section>
  );
};
