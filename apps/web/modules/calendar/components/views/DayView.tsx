import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { CalendarTask } from '../../store/calendarStore';
import { Loader2, Zap, Clock, Ban, CheckCircle2, Circle } from 'lucide-react';

interface DayViewProps {
  selectedDate: Date;
  tasks: CalendarTask[];
  onOpenTaskModal: (dateStr: string) => void;
  onTaskClick?: (task: CalendarTask) => void;
  dateStr: string;
  onPrevDay?: () => void;
  onNextDay?: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Academia': 'text-emerald-400',
  'Dieta': 'text-lime-400',
  'Leitura': 'text-sky-400',
  'Trabalho': 'text-indigo-400',
  'Libertesse': 'text-rose-400',
  'Outro': 'text-white'
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export function DayView({ selectedDate, tasks, onOpenTaskModal, onTaskClick, dateStr, onPrevDay, onNextDay }: DayViewProps) {
  return (
    <motion.div 
      key={dateStr} // Força re-render para animação de troca
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, { offset, velocity }) => {
        const swipe = swipePower(offset.x, velocity.x);
        if (swipe < -swipeConfidenceThreshold) {
          onNextDay?.();
        } else if (swipe > swipeConfidenceThreshold) {
          onPrevDay?.();
        }
      }}
      className="relative ml-4 mt-8 pb-32 touch-pan-y"
    >
      {/* Linha vertical da Timeline */}
      <div className="absolute left-0 top-3 bottom-8 w-[2px] bg-sky-500/20 rounded-full" />

      <div className="flex flex-col gap-6">
        {/* Botão Adicionar (Empty State ou Topo da lista) */}
        <div className="pl-10">
          <button 
            onClick={() => onOpenTaskModal(dateStr)}
            className="w-full py-6 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex flex-col items-center justify-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60">
              <span className="text-xl">+</span>
            </div>
            <p className="text-white/60 font-medium">Adicionar Tarefa</p>
          </button>
        </div>

        {tasks.map((task) => {
          const isActive = task.status === 'active';
          const isCompleted = task.status === 'completed';
          const colorClass = task.color || CATEGORY_COLORS[task.category] || 'text-white';

          return (
            <div key={task.id} className="relative pl-10">
              {/* Bolinha da Timeline */}
              <div className={`absolute left-[-6px] top-4 w-3.5 h-3.5 rounded-full border-2 bg-[#0f1115] z-10 transition-colors
                ${isActive ? 'border-sky-400 w-4 h-4 left-[-7px] top-[14px]' : 'border-sky-500/40'}`}>
                {isActive && <div className="absolute inset-0.5 bg-sky-400 rounded-full animate-pulse" />}
              </div>

              {/* Card da Tarefa */}
              <div 
                onClick={() => onTaskClick?.(task)}
                className={`p-5 rounded-3xl backdrop-blur-md transition-colors cursor-pointer
                  ${isActive
                    ? 'bg-sky-500 shadow-[0_10px_40px_rgba(14,165,233,0.3)] hover:brightness-110'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-lg font-bold flex items-center gap-2 ${isActive ? 'text-white' : colorClass}`}>
                    {task.category !== 'Libertesse' && (
                      <span className="opacity-50">
                        {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </span>
                    )}
                    {task.title}
                  </h3>
                  <span className={`text-sm font-medium ${isActive ? 'text-white/90' : 'text-white/40'}`}>
                    {task.timeStr}
                  </span>
                </div>

                <p className={`text-sm leading-relaxed ${isActive ? 'text-white/90' : 'text-white/50'}`}>
                  {task.description}
                </p>

                {isActive && (
                  <div className="mt-5 flex justify-end items-center">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sky-500 shadow-lg">
                      <Loader2 size={20} className="animate-spin" />
                    </div>
                  </div>
                )}
                
                {/* Badge Drag/Categoria */}
                <div className="mt-4 flex gap-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'}`}>
                    {task.category}
                  </span>
                  {!task.isDraggable && task.category !== 'Libertesse' && (
                    <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-md bg-rose-500/10 text-rose-400">
                      Fixa
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </motion.div>
  );
}
