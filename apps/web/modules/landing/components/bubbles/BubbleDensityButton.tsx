'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { playPlocSound } from './FloatingBubble';

interface BubbleDensityButtonProps {
  gameMode: 'decor' | 'onboarding_game' | 'normal';
  density: 'none' | 'low' | 'medium' | 'high';
  onChangeDensity: (newDensity: 'none' | 'low' | 'medium' | 'high') => void;
}

export default function BubbleDensityButton({
  gameMode,
  density,
  onChangeDensity
}: BubbleDensityButtonProps) {
  return (
    <motion.button
      whileHover={gameMode === 'onboarding_game' ? {} : { scale: 1.08 }}
      whileTap={gameMode === 'onboarding_game' ? {} : {
        scale: 0.92,
        borderRadius: '42% 58% 45% 55% / 55% 45% 58% 42%' // Deformação líquida sutil ao pressionar!
      }}
      onClick={() => {
        if (gameMode === 'onboarding_game') return;
        const nextDensity = (() => {
          if (density === 'none') return 'low';
          if (density === 'low') return 'medium';
          if (density === 'medium') return 'high';
          return 'none';
        })();
        onChangeDensity(nextDensity);
        playPlocSound(); // Som maroto de estouro como feedback!
      }}
      title={gameMode === 'onboarding_game' ? "Controle Bloqueado no Minijogo" : (
        density === 'none' ? "Ativar Bolhas (Desativado)" : (
          density === 'low' ? "Velocidade: x1 (Normal)" : (
            density === 'medium' ? "Velocidade: x2 (Rápida)" : "Velocidade: x3 (Turbilhão)"
          )
        )
      )}
      className={cn(
        "w-12 h-12 rounded-full mt-5 backdrop-blur-md flex items-center justify-center relative outline-none overflow-hidden p-0 transition-all duration-300",
        "bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_60%,rgba(255,255,255,0.01)_100%)]",
        "border border-white/25",
        "shadow-[inset_2px_2px_5px_rgba(255,255,255,0.25),inset_-2px_-2px_5px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.25)]",
        gameMode === 'onboarding_game' ? "opacity-45 cursor-not-allowed" : "opacity-100 cursor-pointer"
      )}
    >
      {/* Brilho Especular Curvo Interno (Garante a textura física de bolha de sabão) */}
      <div className="absolute top-[8%] left-[8%] w-[32%] h-[32%] rounded-full bg-gradient-to-br from-white/40 to-transparent blur-[1px] pointer-events-none" />

      {/* Ícones Vetoriais Monocromáticos com transição suave e deformação líquida contínua */}
      <AnimatePresence mode="wait">
        <motion.div
          key={density}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            // Deformação líquida senoidal contínua (respiração e wobbling orgânico!)
            scaleX: [1, 1.06, 0.94, 1.04, 0.96, 1],
            scaleY: [1, 0.94, 1.06, 0.96, 1.04, 1],
            rotate: [0, 4, -4, 3, -3, 0],
            x: [0, 1.5, -1.5, 1, -1, 0],
            y: [0, -1.5, 1.5, -1, 1, 0]
          }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{
            // Transição do surgimento (mount)
            duration: 0.25,
            ease: 'easeOut',
            // Loops contínuos assíncronos desregulados para oscilação natural eterna!
            scaleX: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
            scaleY: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
            x: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="flex items-center justify-center text-white/85 z-2 pointer-events-none"
        >
          {gameMode === 'onboarding_game' && (
            // Cadeado trancado no Minijogo
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          )}

          {gameMode !== 'onboarding_game' && density === 'none' && (
            // Bolha Cancelada (Remover totalmente bolhas)
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="8" strokeDasharray="3 3" />
              <line x1="6.4" y1="6.4" x2="17.6" y2="17.6" />
            </svg>
          )}

          {gameMode !== 'onboarding_game' && density === 'low' && (
            // 1 Bolha Minimalista
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="8" />
              <path d="M10 8c.5-.5 1-.8 1.8-.8" strokeWidth="2" opacity="0.6" />
            </svg>
          )}

          {gameMode !== 'onboarding_game' && density === 'medium' && (
            // 2 Bolhas Minimalistas Sobrepostas
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="14" r="6" />
              <circle cx="16" cy="10" r="6" />
              <path d="M6 11c.4-.4.8-.6 1.4-.6M14 7c.4-.4.8-.6 1.4-.6" strokeWidth="1.8" opacity="0.6" />
            </svg>
          )}

          {gameMode !== 'onboarding_game' && density === 'high' && (
            // 3 Bolhas Clusterizadas
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7" cy="15" r="5" />
              <circle cx="17" cy="15" r="5" />
              <circle cx="12" cy="8" r="5" />
              <path d="M5 12.5c.3-.3.6-.5 1-.5M15 12.5c.3-.3.6-.5 1-.5M10.5 5.5c.3-.3.6-.5 1-.5" strokeWidth="1.6" opacity="0.6" />
            </svg>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
