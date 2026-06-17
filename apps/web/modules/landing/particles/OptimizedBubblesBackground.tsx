'use client';

import React, { useMemo, useState, useEffect } from 'react';

/**
 * ============================================================================
 * Bolhas Otimizadas - OptimizedBubblesBackground.tsx
 * ============================================================================
 * Efeito de bolhas super leve usando apenas CSS animations puras e poucas
 * divs, focando em performance (60 FPS fluidos) e removendo o Framer Motion
 * para as bolhas e retirando o backdrop-blur caro.
 * ============================================================================
 */
export function OptimizedBubblesBackground() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoriza o array de bolhas para não recriar no React render cycle
  const bubbles = useMemo(() => {
    // Reduzimos para apenas 12 bolhas espalhadas para manter a tela limpa e super rápida
    return Array.from({ length: 12 }).map((_, i) => {
      const size = Math.random() * 40 + 20; // Entre 20px e 60px
      const left = Math.random() * 100; // Posição X
      const duration = Math.random() * 10 + 15; // Duração muito longa e suave (15s a 25s)
      const delay = Math.random() * 10; // Delay inicial espalhado

      return (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${left}%`,
            bottom: '-100px', // Começa abaixo da tela
            width: `${size}px`,
            height: `${size}px`,
            // Visual de vidro simplificado (sem backdrop blur que pesa no FPS)
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 60%, rgba(255, 255, 255, 0) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.05)',
            // Animação CSS pura usando GPU (translate3d)
            animation: `optimized-bubble-float ${duration}s linear ${delay}s infinite`,
            willChange: 'transform, opacity'
          }}
        >
          {/* Brilhozinho interno (reflexo especular simplificado) */}
          <div className="absolute top-[15%] left-[20%] w-[20%] h-[20%] rounded-full bg-white opacity-20" />
        </div>
      );
    });
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-base">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes optimized-bubble-float {
            0% {
              transform: translate3d(0, 0, 0) scale(0.8);
              opacity: 0;
            }
            10% {
              opacity: 0.6;
            }
            80% {
              transform: translate3d(20px, -80vh, 0) scale(1.1);
              opacity: 0.6;
            }
            90% {
              transform: translate3d(25px, -90vh, 0) scale(1.5);
              opacity: 0;
            }
            100% {
              transform: translate3d(25px, -100vh, 0) scale(1.5);
              opacity: 0;
            }
          }
        `
      }} />
      {bubbles}
    </div>
  );
}
