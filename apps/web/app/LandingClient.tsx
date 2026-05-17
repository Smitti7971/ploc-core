'use client';

import React, { useState, useEffect } from 'react';
import { AuthCapsule } from '@/modules/auth/components/AuthCapsule';
import BubblePhrases from '@/modules/landing/components/BubblePhrases';

import { Atmosphere } from '@/modules/landing/components/Atmosphere';
import { HeroStage } from '@/modules/landing/components/HeroStage';
import { MascotCenter } from '@/modules/landing/components/MascotCenter';
import { Vignette } from '@/modules/landing/components/Vignette';

export default function LandingClient() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <main className="h-screen w-screen bg-[var(--ploc-background)] flex flex-col items-center justify-center fixed inset-0 overflow-hidden">
      
      {/* Cápsula de Entrada superior-direita */}
      <AuthCapsule />

      <Atmosphere />

      <HeroStage>
        <MascotCenter />
      </HeroStage>

      {/* ── Módulo Independente de Frases e Bolhas Flutuantes ── */}
      <BubblePhrases />

      <Vignette />
    </main>
  );
}
