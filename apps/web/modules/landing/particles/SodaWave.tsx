'use client';

/**
 * ============================================================================
 * Onda de Bolhas (Efeito Soda) - SodaWave.tsx
 * ============================================================================
 * Descrição: Efeito de efervescência inicial. Bolhas transparentes de "refrigerante"
 * que sobem rapidamente quando a Landing Page é carregada.
 * ============================================================================
 */import React, { useEffect, useState, useMemo } from 'react';
// Componente que orquestra a animação de bolhas subindo do rodapé
export function SodaWave() {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // The wave lasts 8.5 seconds to cover the slow rising of bubbles
    const timer = setTimeout(() => {
      setIsActive(false);
    }, 8500);
    return () => clearTimeout(timer);
  }, []);

  const bubbles = useMemo(() => {
    if (!isActive) return null;

    return Array.from({ length: 35 }).map((_, i) => {
      const size = Math.random() * 45 + 10; // 10px to 55px (organic mixed sizes)
      const left = Math.random() * 100; // full horizontal distribution
      const delay = Math.random() * 1.2; // staggered delay timing
      const duration = Math.random() * 2.5 + 1.5; // smooth rise (1.5s to 4s)

      return (
        <div
          key={i}
          className="absolute -bottom-[100px] rounded-full pointer-events-none opacity-0"
          style={{
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0) 100%)',
            border: '1.2px solid rgba(255, 255, 255, 0.22)',
            boxShadow: 'inset 0 0 12px rgba(255, 255, 255, 0.15), 0 0 8px rgba(255, 255, 255, 0.08)',
            animation: `soda-rise ${duration}s ease-in ${delay}s forwards`
          }}
        >
          {/* Organic specular gloss reflection in pure Tailwind */}
          <div className="absolute top-[15%] left-[15%] w-1/4 h-1/4 rounded-full bg-gradient-to-br from-white/75 to-transparent blur-[0.8px]" />
        </div>
      );
    });
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[30]">
      {/* Local keyframe injection to prevent Next.js caching issues */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes soda-rise {
            0% { 
              transform: translate3d(0, 0, 0) scale(0.6); 
              opacity: 0; 
            }
            15% { 
              opacity: 0.8; 
            }
            90% { 
              opacity: 0.8; 
            }
            100% { 
              transform: translate3d(0, -135vh, 0) scale(1.3); 
              opacity: 0; 
            }
          }
        `
      }} />
      {bubbles}
    </div>
  );
}
