import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Clock, SkipForward, FileEdit, X } from 'lucide-react';
import { PendingCorrelation } from '../hooks/useCorrelationGating';

interface CorrelationGatingModalProps {
  isOpen: boolean;
  pendingItems: PendingCorrelation[];
  originalItemName?: string;
  onRegistrar: (itemId: string) => void;
  onLembrarMaisTarde: () => void;
  onIgnorar: () => void;
}

export function CorrelationGatingModal({ 
  isOpen, 
  pendingItems, 
  originalItemName,
  onRegistrar, 
  onLembrarMaisTarde, 
  onIgnorar 
}: CorrelationGatingModalProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleIgnorarClick = () => {
    // Se o usuário já marcou "não mostrar novamente" antes (armazenado no localStorage, por ex)
    const skipWarning = localStorage.getItem('ploc_skip_correlation_warning') === 'true';
    if (skipWarning) {
      onIgnorar();
    } else {
      setShowWarning(true);
    }
  };

  const handleConfirmIgnorar = () => {
    if (dontShowAgain) {
      localStorage.setItem('ploc_skip_correlation_warning', 'true');
    }
    setShowWarning(false);
    onIgnorar();
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-toast flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={onLembrarMaisTarde} 
          />
          
          <AnimatePresence mode="wait">
        {!showWarning ? (
          <motion.div
            key="gating-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-6"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-2">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-lg font-black text-white">Tarefas Pendentes</h2>
              <p className="text-sm text-white/60 leading-relaxed">
                Antes de concluir <strong>{originalItemName}</strong>, você possui as seguintes tarefas correlacionadas pendentes para hoje:
              </p>
            </div>

            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {pendingItems.map((p, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-sm font-bold text-white/90 flex-1">{p.item.name}</span>
                  <button 
                    onClick={() => onRegistrar(p.item.id)}
                    className="text-[10px] bg-sky-500/20 text-sky-400 px-3 py-1.5 rounded-lg hover:bg-sky-500/30 transition-colors uppercase font-bold tracking-wider flex items-center gap-1.5"
                  >
                    <FileEdit size={12} /> Registrar
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-center font-bold text-white/40 uppercase tracking-widest mt-2">
              Fazer registro?
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={onLembrarMaisTarde}
                className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors flex justify-center items-center gap-2"
              >
                <Clock size={16} /> Me Lembre Mais Tarde
              </button>
              
              <button
                onClick={handleIgnorarClick}
                className="w-full mt-2 text-center text-xs text-white/30 hover:text-white/50 underline underline-offset-2 transition-colors cursor-pointer"
              >
                tentar de outra forma
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="warning-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm bg-zinc-900 border border-red-500/30 rounded-3xl p-6 shadow-2xl flex flex-col gap-6"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                <AlertCircle size={24} />
              </div>
              <button onClick={() => setShowWarning(false)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-black text-red-400">Atenção!</h2>
              <p className="text-sm text-white/70 leading-relaxed">
                Esta ação vai atualizar a tarefa atual como executada, <strong>mas ainda será feito cobrança nos próximos registros</strong> da tarefa ignorada.
              </p>
            </div>

            <label htmlFor="dontShowAgain" className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <input 
                id="dontShowAgain"
                name="dontShowAgain"
                type="checkbox" 
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded accent-red-500" 
              />
              <span className="text-xs text-white/60 font-medium">Não mostrar essa mensagem novamente</span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWarning(false)}
                className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 hover:text-white text-xs font-bold uppercase tracking-wider"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmIgnorar}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 text-xs font-bold uppercase tracking-wider"
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
