import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, CigaretteOff } from 'lucide-react';
import { MissionPathMap } from './MissionPathMap';
import { useTrackerStore } from '@/modules/dashboard/components/tracker/store/trackerStore';

interface MissionAntitabagismoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MissionAntitabagismoModal({ isOpen, onClose }: MissionAntitabagismoModalProps) {
  const { items } = useTrackerStore();
  const currentVice = Object.values(items || {}).find(t => t.config?.viceId === 'tabagismo' && t.type === 'vice' && t.status === 'ACTIVE');
  const currentLevel = currentVice?.config?.antitabagismoLevel ?? 0;
  const progressPercent = Math.min(100, Math.round((currentLevel / 10) * 100));

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-modal w-screen h-screen bg-zinc-950 flex flex-col overflow-hidden select-none"
      onClick={(e) => e.stopPropagation()}
    >

      {/* Header Flutuante Premium estilo Glassmorphism */}
      <div className="w-full absolute top-0 left-0 right-0 z-40 bg-zinc-950/65 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/25 text-yellow-500 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.15)] animate-pulse">
            <CigaretteOff size={20} />
          </div>
          <div>
            <h2 className="text-white text-sm md:text-base font-black tracking-widest uppercase flex items-center gap-2">
              Missão Antitabagismo
              <span className="text-[10px] bg-yellow-400/15 border border-yellow-400/30 px-2 py-0.5 rounded-full text-yellow-400 font-extrabold uppercase">
                Tabuleiro
              </span>
            </h2>

            {/* Barra de Progresso sutil */}
            <div className="flex items-center gap-3 mt-1">
              <div className="w-24 md:w-36 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-yellow-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[9px] text-slate-400 font-black tracking-widest uppercase">
                {progressPercent}% CONCLUÍDO
              </span>
            </div>
          </div>
        </div>

        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors shadow-lg"
          title="Fechar Tabuleiro"
        >
          <X size={18} />
        </button>
      </div>

      {/* Mapa do Tabuleiro ocupando todo o Viewport */}
      <div className="flex-1 w-full h-full pt-16">
        <MissionPathMap />
      </div>

    </div>,
    document.body
  );
}
