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

// Converte do formato do Prisma para o formato do Frontend
const mapToFrontend = (b: any): CalendarTask => {
  let status: 'pending' | 'completed' | 'active' = 'pending';
  if (b.status === 'CONCLUIDA' || b.completed) status = 'completed';
  else if (b.status === 'EM_ANDAMENTO') status = 'active';

  return {
    id: String(b.id),
    title: b.name,
    description: b.description || undefined,
    dateStr: b.scheduledDate ? new Date(b.scheduledDate).toISOString().split('T')[0] : '',
    timeStr: b.scheduledTime || undefined,
    color: b.color || undefined,
    isDraggable: b.isDraggable !== false,
    status,
    category: b.category || 'Geral'
  };
};

// Converte do formato do Frontend para o formato do Prisma
const mapToBackend = (f: Partial<CalendarTask>): any => {
  const b: any = {};
  if (f.title !== undefined) b.name = f.title;
  if (f.description !== undefined) b.description = f.description;
  if (f.dateStr !== undefined) b.scheduledDate = f.dateStr;
  if (f.timeStr !== undefined) b.scheduledTime = f.timeStr;
  if (f.color !== undefined) b.color = f.color;
  if (f.isDraggable !== undefined) b.isDraggable = f.isDraggable;
  if (f.category !== undefined) b.category = f.category;
  
  if (f.status !== undefined) {
    if (f.status === 'completed') {
      b.status = 'CONCLUIDA';
      b.completed = true;
    } else if (f.status === 'active') {
      b.status = 'EM_ANDAMENTO';
      b.completed = false;
    } else {
      b.status = 'PENDENTE';
      b.completed = false;
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
          const backendTasks = await apiService.get<any[]>('/tasks');
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
          const created = await apiService.post<any>('/tasks', payload);
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
            await apiService.put(`/tasks/${id}`, payload);
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
            await apiService.delete(`/tasks/${id}`);
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
            await apiService.put(`/tasks/${id}`, { scheduledDate: newDateStr });
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
