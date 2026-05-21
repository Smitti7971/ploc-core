'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { playPlocSound } from '../bubbles';

interface RewardGiftBoxProps {
  visible: boolean;
}

export default function RewardGiftBox({ visible }: RewardGiftBoxProps) {
  if (!visible) return null;

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-14 flex flex-col items-center justify-center gap-2">
      <motion.div
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        onClick={() => {
          // Trigger Ploc's sassy warning
          const warn = "Ei! Essa caixa está trancada a sete chaves aqui fora. Crie sua conta e entre no app para abrir o seu presentinho!";
          const speechEvent = new CustomEvent('ploc_speech_started', {
            detail: { text: warn }
          });
          window.dispatchEvent(speechEvent);
          playPlocSound();
        }}
        className="w-20 h-20 rounded-[24px] backdrop-blur-md flex items-center justify-center cursor-pointer relative bg-[radial-gradient(circle_at_30%_30%,rgba(251,191,36,0.25)_0%,rgba(217,119,6,0.1)_60%,rgba(255,255,255,0.02)_100%)] border border-dashed border-amber-400/50 shadow-[0_12px_36px_rgba(251,191,36,0.25),inset_0_0_15px_rgba(255,255,255,0.05)]"
      >
        {/* Brilho Especular */}
        <div className="absolute top-[8%] left-[8%] w-[32%] h-[32%] rounded-full bg-gradient-to-br from-white/30 to-transparent blur-[1px] pointer-events-none" />
        {/* Ícone de Presente */}
        <span className="text-[2.2rem] drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]">🎁</span>
      </motion.div>
      <span
        className="text-amber-400/95 text-[0.75rem] font-extrabold tracking-wider uppercase pointer-events-none font-outfit drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
      >
        RECOMPENSA DESTRAVADA!
      </span>
    </div>
  );
}
