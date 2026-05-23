/**
 * @module PlocActionMenu
 * @description Menu de ações rápidas (ex: brincar, acariciar, etc) do mascote Ploc.
 */

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Moon } from 'lucide-react';

interface PlocActionMenuProps {
  isVisible: boolean;
  isSleeping: boolean;
  isListening: boolean;
  isChatInputVisible: boolean;
  onToggleListening: () => void;
  onToggleChat: () => void;
  onSleep: () => void;
}

export const PlocActionMenu = forwardRef<HTMLDivElement, PlocActionMenuProps>(
  ({ isVisible, isSleeping, isListening, isChatInputVisible, onToggleListening, onToggleChat, onSleep }, ref) => {
    if (!isVisible) return null;

    return (
      <div ref={ref} className="absolute top-[-55px] left-1/2 -translate-x-1/2 z-[99999]">
        <motion.div
          animate={{ y: [3, -3, 3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex gap-3 items-center"
        >
          {/* Bolha de Microfone (Apenas se acordado) */}
          {!isSleeping && (
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onToggleListening();
              }}
              className={`w-7 h-7 rounded-full relative flex items-center justify-center cursor-pointer transition-all duration-200 backdrop-blur-[4px] hover:scale-110 ${isListening
                ? 'bg-red-500 text-white border border-red-400/60 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                : 'bg-slate-900/85 text-sky-400 border border-sky-500/40 shadow-[0_4px_12px_rgba(56,189,248,0.2)]'
                }`}
              title={isListening ? "Parar de ouvir" : "Falar com o Ploc"}
            >
              {isListening && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-red-500/40"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <Mic size={14} className="relative z-10" />
            </button>
          )}

          {/* Bolha de Texto (...) (Apenas se acordado) */}
          {!isSleeping && (
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onToggleChat();
              }}
              className={`w-7 h-7 rounded-full border border-sky-500/40 flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(56,189,248,0.2)] transition-all duration-200 backdrop-blur-[4px] hover:scale-110 ${isChatInputVisible ? 'bg-sky-400 text-slate-900' : 'bg-slate-900/85 text-sky-400'
                }`}
              title="Digitar mensagem"
            >
              ...
            </button>
          )}

          {/* Bolha de Sono (Dormir) */}
          {!isSleeping && (
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onSleep();
              }}
              className="w-7 h-7 rounded-full border border-violet-500/40 flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(139,92,246,0.2)] transition-all duration-200 backdrop-blur-[4px] hover:scale-110 bg-slate-900/85 text-violet-400"
              title="Colocar Ploc para Dormir"
            >
              <Moon size={14} />
            </button>
          )}
        </motion.div>
      </div>
    );
  }
);

PlocActionMenu.displayName = 'PlocActionMenu';
