import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Hash, Flag, PlusCircle, Check } from 'lucide-react';
import { TrackerItem } from '../../store/trackerStore';

interface CardSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: TrackerItem;
  updateItem: (updates: any) => void;
  openDateModal: () => void;
  openStageModal: () => void;
}

export function CardSettingsModal({
  isOpen,
  onClose,
  item,
  updateItem,
  openDateModal,
  openStageModal
}: CardSettingsModalProps) {
  // Local state for toggles (we map these to item.config boolean flags)
  const hasStartDate = !!item.config?.showStartDate;
  const hasDaysTarget = !!item.config?.showDaysTarget;
  const hasStage = !!item.config?.showStage;
  const hasMarkers = !!item.config?.showMarkers;
  const hasStreak = item.config?.showStreak !== false;

  const toggleConfig = (key: string, currentValue: boolean) => {
    updateItem({
      ...item,
      config: {
        ...(item.config || {}),
        [key]: !currentValue
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-popover bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">Configurações do Card</h3>
              <button onClick={onClose} className="p-1 rounded-full text-white/50 hover:bg-white/10">
                <X size={16} />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              {/* Streak */}
              <div className="flex flex-col gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flag size={14} className="text-white/40" />
                    <span className="text-xs font-semibold text-white/80">Ofensiva e Estatísticas</span>
                  </div>
                  <button
                    onClick={() => toggleConfig('showStreak', hasStreak)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${hasStreak ? 'bg-emerald-500' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${hasStreak ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
              {/* Start Date */}
              <div className="flex flex-col gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-white/40" />
                    <span className="text-xs font-semibold text-white/80">Data de Início</span>
                  </div>
                  <button
                    onClick={() => toggleConfig('showStartDate', hasStartDate)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${hasStartDate ? 'bg-emerald-500' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${hasStartDate ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                {hasStartDate && (
                  <button 
                    onClick={openDateModal}
                    className="mt-2 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-colors"
                  >
                    Editar Data de Início
                  </button>
                )}
              </div>

              {/* Days Target */}
              <div className="flex flex-col gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-white/40" />
                    <span className="text-xs font-semibold text-white/80">Meta de Dias</span>
                  </div>
                  <button
                    onClick={() => toggleConfig('showDaysTarget', hasDaysTarget)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${hasDaysTarget ? 'bg-emerald-500' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${hasDaysTarget ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              {/* Stage */}
              <div className="flex flex-col gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flag size={14} className="text-white/40" />
                    <span className="text-xs font-semibold text-white/80">Etapa Atual</span>
                  </div>
                  <button
                    onClick={() => toggleConfig('showStage', hasStage)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${hasStage ? 'bg-emerald-500' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${hasStage ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                {hasStage && (
                  <button 
                    onClick={openStageModal}
                    className="mt-2 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-colors"
                  >
                    Editar Etapa
                  </button>
                )}
              </div>

              {/* Markers */}
              <div className="flex flex-col gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PlusCircle size={14} className="text-white/40" />
                    <span className="text-xs font-semibold text-white/80">Marcadores Adicionais</span>
                  </div>
                  <button
                    onClick={() => toggleConfig('showMarkers', hasMarkers)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${hasMarkers ? 'bg-emerald-500' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${hasMarkers ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
