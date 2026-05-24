import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCalendarData } from '../../hooks/useCalendarData';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDateStr: string;
}

const CATEGORIES = ['Academia', 'Dieta', 'Leitura', 'Trabalho', 'Outro'];

export function TaskModal({ isOpen, onClose, defaultDateStr }: TaskModalProps) {
  const { addTask } = useCalendarData();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('12:00');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isDraggable, setIsDraggable] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      description,
      timeStr: time,
      dateStr: defaultDateStr,
      category,
      isDraggable,
      status: 'pending'
    });

    // Reset and close
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-[#1a1c23] w-full max-w-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
        >
          <div className="flex justify-between items-center p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Nova Tarefa</h2>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Título</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                autoFocus
                required
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-sky-500 transition-colors"
                placeholder="Ex: Treino de Pernas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Categoria</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      category === c ? 'bg-sky-500 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-white/60 mb-2">Horário</label>
                <input 
                  type="time" 
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={isDraggable}
                      onChange={e => setIsDraggable(e.target.checked)}
                    />
                    <div className={`w-10 h-6 rounded-full transition-colors ${isDraggable ? 'bg-sky-500' : 'bg-white/10'}`}></div>
                    <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${isDraggable ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="text-sm font-medium text-white/80">Editável (DnD)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Descrição (Opcional)</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-sky-500 transition-colors resize-none h-24"
                placeholder="Detalhes da tarefa..."
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-4 rounded-xl mt-2 transition-colors"
            >
              Criar Tarefa
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
