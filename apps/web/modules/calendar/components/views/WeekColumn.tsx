import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { CalendarTask } from '../../store/calendarStore';
import { DraggableTaskCard } from './DraggableTaskCard';

interface WeekColumnProps {
  dateStr: string;
  dayName: string;
  dateNum: number;
  isToday: boolean;
  tasks: CalendarTask[];
  onAddClick: () => void;
  onTaskClick?: (task: CalendarTask) => void;
}

export function WeekColumn({ dateStr, dayName, dateNum, isToday, tasks, onAddClick, onTaskClick }: WeekColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: dateStr,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`min-w-[280px] w-[280px] max-w-[280px] snap-center flex flex-col bg-white/5 rounded-3xl overflow-hidden border transition-colors ${
        isOver ? 'border-sky-400 bg-sky-500/10' : (isToday ? 'border-white/20' : 'border-transparent')
      }`}
    >
      {/* Column Header */}
      <div className={`p-4 border-b ${isToday ? 'border-sky-500/30 bg-sky-500/10' : 'border-white/10 bg-black/20'}`}>
        <div className="flex justify-between items-center">
          <span className={`font-medium ${isToday ? 'text-sky-400' : 'text-white/60'}`}>{dayName}</span>
          <span className={`text-xl font-bold ${isToday ? 'text-sky-400' : 'text-white'}`}>{dateNum}</span>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[300px]">
        {tasks.map(task => (
          <DraggableTaskCard key={task.id} task={task} onClick={() => onTaskClick?.(task)} />
        ))}
        
        <button 
          onClick={onAddClick}
          className="w-full py-4 mt-2 border border-dashed border-white/20 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
