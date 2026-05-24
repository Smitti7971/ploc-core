import React from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { CalendarTask } from '../../store/calendarStore';
import { getWeekDays } from '../../utils/dateUtils';
import { WeekColumn } from './WeekColumn';

interface WeekViewProps {
  baseDate: Date;
  allEvents: CalendarTask[];
  onMoveTask: (taskId: string, newDateStr: string) => void;
  onOpenTaskModal: (dateStr: string) => void;
}

export function WeekView({ baseDate, allEvents, onMoveTask, onOpenTaskModal }: WeekViewProps) {
  const weekDays = getWeekDays(baseDate);

  // Sensores para DND que ignoram cliques normais (permite rolar no touch)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newDateStr = over.id as string; // O ID da drop zone será a string da data

    const task = allEvents.find(t => t.id === taskId);
    if (task && task.isDraggable && task.dateStr !== newDateStr) {
      onMoveTask(taskId, newDateStr);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-32 pt-4 px-2 snap-x snap-mandatory scrollbar-hide min-h-[60vh]">
        {weekDays.map(day => {
          const dayTasks = allEvents.filter(t => t.dateStr === day.dateStr);
          
          return (
            <WeekColumn 
              key={day.dateStr}
              dateStr={day.dateStr}
              dayName={day.dayName}
              dateNum={day.dateNum}
              isToday={day.isToday}
              tasks={dayTasks}
              onAddClick={() => onOpenTaskModal(day.dateStr)}
            />
          );
        })}
      </div>
    </DndContext>
  );
}
