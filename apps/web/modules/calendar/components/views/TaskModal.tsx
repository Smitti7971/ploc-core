import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCalendarData } from '../../hooks/useCalendarData';
import { CalendarTask } from '../../store/calendarStore';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDateStr: string;
  editTask?: CalendarTask | null;
}

const CATEGORIES = ['Academia', 'Dieta', 'Leitura', 'Trabalho', 'Outro'];
const COLORS = [
  { value: '', label: 'Padrão (Categoria)', bg: 'bg-white/10' },
  { value: 'text-sky-400', label: 'Azul', bg: 'bg-sky-400' },
  { value: 'text-emerald-400', label: 'Verde', bg: 'bg-emerald-400' },
  { value: 'text-rose-400', label: 'Vermelho', bg: 'bg-rose-400' },
  { value: 'text-amber-400', label: 'Laranja', bg: 'bg-amber-400' },
  { value: 'text-violet-400', label: 'Roxo', bg: 'bg-violet-400' },
];

export function TaskModal({ isOpen, onClose, defaultDateStr, editTask }: TaskModalProps) {
  const { addTask, updateTask } = useCalendarData();

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevTask, setPrevTask] = useState(editTask);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateStr, setDateStr] = useState(defaultDateStr);
  const [time, setTime] = useState('');
  const [isAllDay, setIsAllDay] = useState(true);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isDraggable, setIsDraggable] = useState(true);
  const [color, setColor] = useState('');

  // Sincroniza o estado durante a renderização (Padrão recomendado no React 18+ para evitar "cascading renders")
  if (isOpen !== prevIsOpen || editTask !== prevTask) {
    setPrevIsOpen(isOpen);
    setPrevTask(editTask);

    if (isOpen) {
      if (editTask) {
        setTitle(editTask.title);
        setDescription(editTask.description || '');
        setDateStr(editTask.dateStr);
        setTime(editTask.timeStr || '');
        setIsAllDay(!editTask.timeStr);
        setCategory(editTask.category || CATEGORIES[0]);
        setIsDraggable(editTask.isDraggable);
        setColor(editTask.color || '');
      } else {
        setTitle('');
        setDescription('');
        setDateStr(defaultDateStr);
        setTime('');
        setIsAllDay(true);
        setCategory(CATEGORIES[0]);
        setIsDraggable(true);
        setColor('');
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editTask) {
      updateTask(editTask.id, {
        title,
        description,
        timeStr: isAllDay ? undefined : time,
        dateStr: dateStr,
        category,
        isDraggable,
        color: color || undefined,
      });
    } else {
      addTask({
        title,
        description,
        timeStr: isAllDay ? undefined : time,
        dateStr: dateStr,
        category,
        isDraggable,
        color: color || undefined,
        status: 'pending'
      });
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto py-10"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-[#1a1c23] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl my-auto flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
              <h2 className="text-xl font-bold text-white">{editTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
              <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
              <div>
                <label htmlFor="task-title" className="block text-sm font-medium text-white/60 mb-2">Título</label>
                <input
                  id="task-title"
                  name="title"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  autoFocus
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-sky-500 transition-colors"
                  placeholder="Ex: Treino de Pernas"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="task-category" className="block text-sm font-medium text-white/60 mb-2">Categoria</label>
                  <select
                    id="task-category"
                    name="category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors appearance-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c} className="bg-[#1a1c23]">{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label htmlFor="task-color" className="block text-sm font-medium text-white/60 mb-2">Cor (Opcional)</label>
                  <select
                    id="task-color"
                    name="color"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors appearance-none"
                  >
                    {COLORS.map(c => (
                      <option key={c.label} value={c.value} className={`bg-[#1a1c23]`}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label htmlFor="task-date" className="block text-sm font-medium text-white/60 mb-2">Data</label>
                  <input
                    id="task-date"
                    name="date"
                    type="date"
                    value={dateStr}
                    onChange={e => setDateStr(e.target.value)}
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="task-time" className="block text-sm font-medium text-white/60 mb-2">Horário</label>
                  <div className="flex items-center bg-black/20 border border-white/10 rounded-xl px-2 focus-within:border-sky-500 transition-colors">
                    <input
                      id="task-time"
                      name="time"
                      type="time"
                      value={time}
                      onChange={e => {
                        setTime(e.target.value);
                        if (e.target.value) setIsAllDay(false);
                      }}
                      disabled={isAllDay}
                      className="flex-1 bg-transparent py-3 px-2 text-white focus:outline-none disabled:opacity-30"
                    />
                    <label htmlFor="task-allday" className="flex items-center gap-2 cursor-pointer pr-2 border-l border-white/10 pl-3">
                      <input
                        id="task-allday"
                        name="allday"
                        type="checkbox"
                        className="w-4 h-4 rounded border-white/20 bg-black/20 text-sky-500 focus:ring-sky-500 focus:ring-offset-0"
                        checked={isAllDay}
                        onChange={e => setIsAllDay(e.target.checked)}
                      />
                      <span className="text-xs font-medium text-white/60 whitespace-nowrap">Dia Inteiro</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="task-desc" className="block text-sm font-medium text-white/60 mb-2">Descrição (Opcional)</label>
                <textarea
                  id="task-desc"
                  name="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-sky-500 transition-colors resize-none h-24"
                  placeholder="Detalhes da tarefa..."
                />
              </div>

              <button
                type="submit"
                className="w-full shrink-0 bg-sky-500 hover:bg-sky-400 text-white font-bold py-4 rounded-xl mt-2 transition-colors"
              >
                {editTask ? 'Salvar Alterações' : 'Criar Tarefa'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
