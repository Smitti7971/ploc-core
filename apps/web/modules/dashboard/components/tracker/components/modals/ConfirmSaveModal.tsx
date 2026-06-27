import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertTriangle, X } from 'lucide-react';

interface ConfirmSaveModalProps {
  isOpen: boolean;
  onClose: () => void; // Cancela e volta pra tela de edição
  onDiscard: () => void; // Descarta e fecha o overlay
  onSave: () => void; // Salva e fecha o overlay
}

export function ConfirmSaveModal({
  isOpen,
  onClose,
  onDiscard,
  onSave
}: ConfirmSaveModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // z-[800] para garantir que fique por cima do Overlay (z-[700])
          className="fixed inset-0 z-[800] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-amber-500/20 rounded-2xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl shadow-amber-900/10"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-amber-500/5">
              <h3 className="text-sm font-bold text-amber-500 flex items-center gap-2">
                <AlertTriangle size={16} />
                Alterações Não Salvas
              </h3>
              <button onClick={onClose} className="p-1 rounded-full text-white/50 hover:bg-white/10 transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-6">
              <p className="text-sm text-white/70 text-center leading-relaxed">
                Você fez alterações nesta rotina. O que deseja fazer com as informações inseridas?
              </p>
              
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => {
                    onSave();
                  }}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black text-sm font-black rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Registrar Alterações
                </button>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => {
                      onDiscard();
                    }}
                    className="flex-1 py-3 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-sm font-bold rounded-xl transition-colors"
                  >
                    Descartar
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 text-sm font-bold rounded-xl transition-colors"
                  >
                    Voltar a Editar
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
