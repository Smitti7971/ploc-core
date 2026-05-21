'use client';

import React, { useState, useEffect } from 'react';
import { AuthCapsule } from '@/modules/auth/components/AuthCapsule';
import {
  LandingStageOrchestrator,
  ExitGameButton,
  AmbientGlowBackground,
  Vignette,
  SodaWave
} from '@/modules/landing';

export default function LandingClient() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <main className="h-full w-full max-w-full bg-[var(--ploc-background)] flex flex-col items-center justify-center fixed inset-0 overflow-hidden">
      
      {/* Onda global de efervescência */}
      <SodaWave />

      {/* Botão de Saída do Onboarding Game superior-esquerda */}
      <ExitGameButton />

      {/* Cápsula de Entrada superior-direita */}
      <AuthCapsule />
      <AmbientGlowBackground />

      {/* ── Módulo Independente de Frases e Bolhas Flutuantes (com Mascote integrado) ── */}
      <LandingStageOrchestrator />

      <Vignette />
    </main>
  );
}
