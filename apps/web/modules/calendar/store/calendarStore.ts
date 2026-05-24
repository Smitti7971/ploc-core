import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CalendarTask {
  id: string;
  title: string;
  description?: string;
  dateStr: string; // ISO format date string (e.g. "2026-05-24")
  timeStr?: string; // HH:mm
  color?: string; // Tailwind text/bg color class
  isDraggable: boolean;
  status: 'pending' | 'completed' | 'active';
  category: string; // e.g. "Academia", "Dieta", "Leitura"
}

interface CalendarStore {
  tasks: CalendarTask[];
  addTask: (task: Omit<CalendarTask, 'id'>) => void;
  updateTask: (id: string, updates: Partial<CalendarTask>) => void;
  deleteTask: (id: string) => void;
  moveTaskToDate: (id: string, newDateStr: string) => void;
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set) => ({
      tasks: [],
      
      addTask: (task) => set((state) => ({
        tasks: [
          ...state.tasks, 
          { ...task, id: Math.random().toString(36).substring(2, 9) }
        ]
      })),
      
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),
      
      moveTaskToDate: (id, newDateStr) => set((state) => ({
        tasks: state.tasks.map(t => {
          if (t.id === id && t.isDraggable) {
            return { ...t, dateStr: newDateStr };
          }
          return t;
        })
      }))
    }),
    {
      name: 'ploc-calendar-storage',
    }
  )
);
