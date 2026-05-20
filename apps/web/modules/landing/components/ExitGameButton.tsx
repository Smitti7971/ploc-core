'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useGameModeSync } from '../hooks/useGameModeSync';
import { blackboardEventBus } from '@/modules/blackboard/events/eventBus';
import { playPlocSound } from './bubbles/FloatingBubble';

export default function ExitGameButton() {
  const { gameMode } = useGameModeSync();

  const handleExitClick = () => {
    playPlocSound();
    blackboardEventBus.emit('EXIT_ONBOARDING_GAME');
  };

  return (
    <AnimatePresence>
      {gameMode === 'onboarding_game' && (
        <motion.div
          initial={{ opacity: 0, x: -20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.9 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-[25px] left-[25px] z-[9999] pointer-events-auto"
        >
          <motion.button
            whileHover={{ scale: 1.05, border: '1px solid rgba(239, 68, 68, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExitClick}
            className="flex items-center gap-2 bg-gradient-to-r from-red-950/40 to-slate-950/60 backdrop-blur-xl px-4 py-2 rounded-full border border-red-500/20 cursor-pointer shadow-lg shadow-red-950/10 hover:shadow-red-950/30 transition-all duration-300 min-h-[36px]"
          >
            {/* Ícone X vermelho brilhante */}
            <X size={14} className="text-red-400 drop-shadow-[0_0_4px_rgba(239,68,68,0.5)]" />
            <span 
              className="text-red-200 text-[10px] font-black tracking-[1.5px] font-display uppercase font-outfit"
            >
              Sair do Diagnóstico
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
