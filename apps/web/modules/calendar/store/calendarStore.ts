import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '@/services/api';

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
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<CalendarTask, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<CalendarTask>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTaskToDate: (id: string, newDateStr: string) => Promise<void>;
}

// Converte do formato TrackerItem para o formato do Frontend
const mapToFrontend = (b: any): CalendarTask => {
  let status: 'pending' | 'completed' | 'active' = 'pending';
  const config = b.config || {};
  
  if (b.status === 'COMPLETED' || config.completed) status = 'completed';
  else if (b.status === 'ACTIVE') status = 'active';

  return {
    id: String(b.id),
    title: b.name,
    description: config.description || undefined,
    dateStr: config.scheduledDate ? new Date(config.scheduledDate).toISOString().split('T')[0] : (b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : ''),
    timeStr: config.scheduledTime || undefined,
    color: config.color || undefined,
    isDraggable: config.isDraggable !== false,
    status,
    category: config.category || 'Geral'
  };
};

// Converte do formato do Frontend para o formato TrackerItem
const mapToBackend = (f: Partial<CalendarTask>): any => {
  const b: any = { type: 'task', config: {} };
  if (f.title !== undefined) b.name = f.title;
  if (f.description !== undefined) b.config.description = f.description;
  if (f.dateStr !== undefined) b.config.scheduledDate = f.dateStr;
  if (f.timeStr !== undefined) b.config.scheduledTime = f.timeStr;
  if (f.color !== undefined) b.config.color = f.color;
  if (f.isDraggable !== undefined) b.config.isDraggable = f.isDraggable;
  if (f.category !== undefined) b.config.category = f.category;
  
  if (f.status !== undefined) {
    if (f.status === 'completed') {
      b.status = 'COMPLETED';
      b.config.completed = true;
    } else if (f.status === 'active') {
      b.status = 'ACTIVE';
      b.config.completed = false;
    } else {
      b.status = 'ACTIVE'; // Tracker item typically ACTIVE
      b.config.completed = false;
    }
  }
  return b;
};

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      fetchTasks: async () => {
        try {
          if (typeof window !== 'undefined') {
            const hasDirectToken = !!localStorage.getItem('ploc_token');
            const hasStoreToken = !!localStorage.getItem('ploc-auth');
            if (!hasDirectToken && !hasStoreToken) return;
          }
          const backendTasks = await apiService.get<any[]>('/tracker/items?type=task');
          if (backendTasks && Array.isArray(backendTasks)) {
            set({ tasks: backendTasks.map(mapToFrontend) });
          }
        } catch (e) {
          console.error('Erro ao buscar tarefas:', e);
        }
      },

      addTask: async (task) => {
        // Atualização otimista
        const tempId = 'temp-' + Math.random().toString(36).substring(2, 9);
        const newTask: CalendarTask = { ...task, id: tempId };
        set((state) => ({ tasks: [...state.tasks, newTask] }));

        try {
          const payload = mapToBackend(task);
          const created = await apiService.post<any>('/tracker/items', payload);
          // Substitui o tempId pelo ID real do banco
          set((state) => ({
            tasks: state.tasks.map(t => t.id === tempId ? mapToFrontend(created) : t)
          }));
        } catch (e) {
          console.error('Erro ao criar tarefa no backend:', e);
          // Reverte em caso de erro
          set((state) => ({ tasks: state.tasks.filter(t => t.id !== tempId) }));
        }
      },
      
      updateTask: async (id, updates) => {
        // Atualização otimista
        set((state) => ({
          tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
        }));

        if (!id.startsWith('temp-')) {
          try {
            const payload = mapToBackend(updates);
            await apiService.put(`/tracker/items/${id}`, payload);
          } catch (e) {
            console.error('Erro ao atualizar tarefa:', e);
          }
        }
      },
      
      deleteTask: async (id) => {
        set((state) => ({
          tasks: state.tasks.filter(t => t.id !== id)
        }));

        if (!id.startsWith('temp-')) {
          try {
            await apiService.delete(`/tracker/items/${id}`);
          } catch (e) {
            console.error('Erro ao deletar tarefa:', e);
          }
        }
      },
      
      moveTaskToDate: async (id, newDateStr) => {
        set((state) => ({
          tasks: state.tasks.map(t => {
            if (t.id === id && t.isDraggable) {
              return { ...t, dateStr: newDateStr };
            }
            return t;
          })
        }));

        if (!id.startsWith('temp-')) {
          try {
            await apiService.put(`/tracker/items/${id}`, { config: { scheduledDate: newDateStr } });
          } catch (e) {
            console.error('Erro ao mover tarefa:', e);
          }
        }
      }
    }),
    {
      name: 'ploc-calendar-storage',
    }
  )
);
