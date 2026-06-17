import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface StageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  tempStageName: string;
  setTempStageName: (val: string) => void;
  tempStageStartDateStr: string;
  setTempStageStartDateStr: (val: string) => void;
  tempStageEndDateStr: string;
  setTempStageEndDateStr: (val: string) => void;
  handleSaveStage: (name: string, start: string, end: string) => void;
}

export function StageEditModal({
  isOpen,
  onClose,
  itemId,
  tempStageName,
  setTempStageName,
  tempStageStartDateStr,
  setTempStageStartDateStr,
  tempStageEndDateStr,
  setTempStageEndDateStr,
  handleSaveStage
}: StageEditModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-zinc-900 border border-white/10 rounded-3xl p-5 w-full max-w-sm flex flex-col gap-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-[12px] font-bold text-emerald-400 uppercase tracking-widest">
                Detalhes da Etapa
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${itemId}-temp-stage-name`} className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Nome da Etapa</label>
                <input
                  id={`${itemId}-temp-stage-name`} autoComplete="off"
                  name="tempStageName"
                  type="text"
                  value={tempStageName}
                  onChange={(e) => setTempStageName(e.target.value)}
                  placeholder="Nome da etapa..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-[13px] text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${itemId}-temp-stage-start`} className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Data de Início da Etapa</label>
                <input
                  id={`${itemId}-temp-stage-start`}
                  name="tempStageStart"
                  type="date"
                  value={tempStageStartDateStr}
                  onChange={(e) => setTempStageStartDateStr(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-[13px] text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${itemId}-temp-stage-end`} className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Data de Fim da Etapa</label>
                <input
                  id={`${itemId}-temp-stage-end`}
                  name="tempStageEnd"
                  type="date"
                  value={tempStageEndDateStr}
                  onChange={(e) => setTempStageEndDateStr(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-[13px] text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <button
              onClick={() => {
                handleSaveStage(tempStageName, tempStageStartDateStr, tempStageEndDateStr);
                onClose();
              }}
              className="w-full py-3 mt-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 font-bold text-[11px] uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            >
              Salvar Etapa
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
