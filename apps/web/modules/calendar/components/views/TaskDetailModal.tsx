import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Trash2, Calendar, Clock, Tag } from 'lucide-react';
import { CalendarTask } from '../../store/calendarStore';
import { useCalendarData } from '../../hooks/useCalendarData';
import { ConfirmActionModal } from '@/modules/dashboard/components/tracker/components/modals/ConfirmActionModal';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: CalendarTask | null;
  onEdit: (task: CalendarTask) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Academia': 'text-emerald-400 bg-emerald-500/10',
  'Dieta': 'text-lime-400 bg-lime-500/10',
  'Leitura': 'text-sky-400 bg-sky-500/10',
  'Trabalho': 'text-indigo-400 bg-indigo-500/10',
  'Libertesse': 'text-rose-400 bg-rose-500/10',
  'Outro': 'text-white bg-white/10'
};

export function TaskDetailModal({ isOpen, onClose, task, onEdit }: TaskDetailModalProps) {
  const { deleteTask } = useCalendarData();

  if (!isOpen || !task) return null;

  const colorClass = task.color || CATEGORY_COLORS[task.category] || 'text-white bg-white/10';

  const [showConfirmModal, setShowConfirmModal] = React.useState(false);

  const handleDelete = () => {
    setShowConfirmModal(true);
  };

  return (
    <AnimatePresence>
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
          className="bg-[#18181b] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl my-auto flex flex-col max-h-[90vh]"
        >
          <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
            <h2 className="text-xl font-bold text-white">Detalhes da Tarefa</h2>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 flex flex-col gap-6 overflow-y-auto">
            <div>
              <h3 className={`text-2xl font-bold ${colorClass.split(' ')[0]}`}>{task.title}</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${colorClass}`}>
                  {task.category}
                </span>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase bg-white/5 text-white/60`}>
                  {task.status === 'completed' ? 'Concluída' : task.status === 'active' ? 'Em andamento' : 'Pendente'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 p-4 bg-black/20 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3 text-white/70">
                <Calendar size={18} className="text-sky-400" />
                <span className="font-medium">{new Date(task.dateStr + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Clock size={18} className="text-sky-400" />
                <span className="font-medium">{task.timeStr ? task.timeStr : 'Dia Inteiro'}</span>
              </div>
            </div>

            {task.description && (
              <div>
                <h4 className="text-sm font-medium text-white/40 mb-2">Descrição</h4>
                <p className="text-white/80 leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/5">
                  {task.description}
                </p>
              </div>
            )}

            {!task.isDraggable && task.category !== 'Libertesse' && (
              <div className="text-sm text-amber-400/80 bg-amber-400/10 p-3 rounded-xl border border-amber-400/20">
                Esta tarefa é fixa e não pode ser movida para outros dias.
              </div>
            )}
            
            {task.category === 'Libertesse' && (
              <div className="text-sm text-rose-400/80 bg-rose-400/10 p-3 rounded-xl border border-rose-400/20">
                Este é um registro do Libertesse e não pode ser editado por aqui.
              </div>
            )}

            {task.category !== 'Libertesse' && (
              <div className="flex gap-3 mt-4 shrink-0">
                <button
                  onClick={() => onEdit(task)}
                  className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 size={18} />
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold py-3 rounded-xl transition-colors flex items-center justify-center"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
      <ConfirmActionModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          deleteTask(task.id);
          onClose();
        }}
        title="Excluir Tarefa"
        description="Tem certeza que deseja excluir esta tarefa?"
        actionStyle="danger"
        confirmText="Excluir"
      />
    </AnimatePresence>
  );
}
