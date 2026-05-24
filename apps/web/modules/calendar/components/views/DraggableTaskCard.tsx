import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { CalendarTask } from '../../store/calendarStore';
import { Loader2, Zap, Clock, Ban, GripVertical, CheckCircle2, Circle } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  'Academia': 'text-emerald-400',
  'Dieta': 'text-lime-400',
  'Leitura': 'text-sky-400',
  'Trabalho': 'text-indigo-400',
  'Libertesse': 'text-rose-400',
  'Outro': 'text-white'
};

export function DraggableTaskCard({ task }: { task: CalendarTask }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    disabled: !task.isDraggable,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  const isActive = task.status === 'active';
  const isCompleted = task.status === 'completed';
  const colorClass = task.color || CATEGORY_COLORS[task.category] || 'text-white';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-4 rounded-2xl transition-colors
        ${isActive ? 'bg-sky-500 shadow-[0_5px_20px_rgba(14,165,233,0.3)]' : 'bg-[#1a1c23] border border-white/5'}
        ${task.isDraggable ? 'cursor-grab active:cursor-grabbing hover:border-white/20' : 'opacity-80'}`}
      {...attributes}
      {...listeners}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isActive ? 'text-white' : colorClass}`}>
          {task.isDraggable && (
            <GripVertical size={12} className="opacity-30 flex-shrink-0" />
          )}
          {task.category !== 'Libertesse' && (
            <span className="opacity-50">
              {isCompleted ? <CheckCircle2 size={12} /> : <Circle size={12} />}
            </span>
          )}
          <span className="truncate">{task.title}</span>
        </h3>
      </div>
      
      {task.timeStr && (
        <span className={`text-xs font-medium block mb-2 ${isActive ? 'text-white/90' : 'text-white/40'}`}>
          {task.timeStr}
        </span>
      )}

      {task.description && (
        <p className={`text-xs leading-relaxed line-clamp-2 ${isActive ? 'text-white/90' : 'text-white/50'}`}>
          {task.description}
        </p>
      )}
      
      {!task.isDraggable && task.category !== 'Libertesse' && (
        <div className="mt-2 text-[9px] uppercase font-bold text-white/30 bg-white/5 inline-block px-1.5 py-0.5 rounded">
          Fixo
        </div>
      )}
    </div>
  );
}
