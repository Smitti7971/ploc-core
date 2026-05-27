'use client';

import React, { useState, useEffect } from 'react';
import { MascotCenter } from './mascot';

// Componente central da Landing Page. Apenas renderiza o Mascote (e o chat se for necessário no futuro)
export default function LandingStageOrchestrator() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none w-full h-full overflow-hidden flex flex-col items-center justify-center"
    >
      {/* ── O Mascote Ploc Centralizado ── */}
      <MascotCenter />
    </div>
  );
}
