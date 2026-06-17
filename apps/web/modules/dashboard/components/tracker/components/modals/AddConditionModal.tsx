import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AddConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  item: any;
  updateItem: (item: any) => void;
  newConditionTitle: string;
  setNewConditionTitle: (val: string) => void;
  editingConditionIndex: number | null;
  setEditingConditionIndex: (val: number | null) => void;
  conditions: string[];
}

export function AddConditionModal({
  isOpen,
  onClose,
  itemId,
  item,
  updateItem,
  newConditionTitle,
  setNewConditionTitle,
  editingConditionIndex,
  setEditingConditionIndex,
  conditions
}: AddConditionModalProps) {
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
                {editingConditionIndex !== null ? 'Editar Condição' : 'Adicionar Condição'}
              </span>
              <button
                onClick={() => {
                  onClose();
                  setNewConditionTitle('');
                  setEditingConditionIndex(null);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <label htmlFor={`${itemId}-new-condition-title`} className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>Título da Condição</label>
            <input
              id={`${itemId}-new-condition-title`} autoComplete="off"
              name="newConditionTitle"
              value={newConditionTitle}
              onChange={(e) => setNewConditionTitle(e.target.value)}
              placeholder="Título da Condição..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-[13px] text-white focus:outline-none focus:border-emerald-500/50"
              autoFocus
            />

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  if (!newConditionTitle.trim()) return;
                  const newConditions = [...conditions];
                  if (editingConditionIndex !== null) {
                    newConditions[editingConditionIndex] = newConditionTitle.trim();
                  } else {
                    newConditions.push(newConditionTitle.trim());
                  }
                  updateItem({ ...item, config: { ...item.config, conditions: newConditions } });
                  onClose();
                  setNewConditionTitle('');
                  setEditingConditionIndex(null);
                }}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-[11px] uppercase tracking-wider transition-colors"
              >
                {editingConditionIndex !== null ? 'Salvar Edição' : 'Adicionar Condição Simples'}
              </button>
              <button
                onClick={() => {
                  if (!newConditionTitle.trim()) return;
                  const newItemId = crypto.randomUUID();
                  updateItem({
                    id: newItemId,
                    type: 'acompanhe',
                    name: newConditionTitle.trim(),
                    status: 'ACTIVE',
                    config: { showCoverPhoto: true },
                    startDate: Date.now(),
                    correlations: {},
                    isConsuming: false,
                    defaultTimer: 300,
                    userId: item.userId || 'test-user',
                    createdAt: new Date(),
                    updatedAt: new Date()
                  });

                  const newConditions = [...conditions];
                  if (editingConditionIndex !== null) {
                    newConditions.splice(editingConditionIndex, 1);
                  }

                  updateItem({
                    ...item,
                    config: { ...item.config, conditions: newConditions },
                    correlations: { ...item.correlations, [newItemId]: 'linked' }
                  });

                  onClose();
                  setNewConditionTitle('');
                  setEditingConditionIndex(null);
                }}
                className="w-full py-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                Tornar Condição em Tarefa
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
