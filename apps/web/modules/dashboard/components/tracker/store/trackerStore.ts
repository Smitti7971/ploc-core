import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '@/services/api';

export type TrackerType = 'medicine' | 'vice' | 'habit' | 'savings' | string;

export interface TrackerLog {
  id: string;
  trackerItemId: string;
  type: 'consumption' | 'expense' | 'start' | 'end' | 'milestone';
  timestamp: number;
  photoUrl?: string;
  info?: string;
  durationSeconds?: number;
  value?: number;
  metadata?: Record<string, any>;
}

export interface TrackerItem {
  id: string;
  type: TrackerType;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  coverPhoto?: string;
  config: {
    conditions?: string[];
    expectedFrequency?: string;
    target?: number;
    showCoverPhoto?: boolean;
    stages?: {
      id: string;
      name: string;
      startDate: number;
      endDate?: number;
    }[];
    activeMarkers?: string[];
    [key: string]: any;
  };
  startDate: number;
  endDate?: number;
  correlations: {
    dependsOn?: string[];
    triggers?: string[];
    [key: string]: any;
  };
  isConsuming: boolean;
  consumptionStart?: number;
  defaultTimer: number;
}

interface TrackerStore {
  items: Record<string, TrackerItem>;
  logs: TrackerLog[];
  
  fetchItems: () => Promise<void>;
  
  setItem: (item: TrackerItem) => void;
  removeItem: (itemId: string) => void;
  
  startConsumption: (itemId: string) => void;
  endConsumption: (itemId: string, actualSecondsUsed: number, info?: string, photoUrl?: string) => void;
  cancelConsumption: (itemId: string) => void;
  
  addLog: (log: Omit<TrackerLog, 'id' | 'timestamp'>) => void;
  updateLog: (logId: string, updates: Partial<TrackerLog>) => void;
  deleteLog: (logId: string) => void;
  toggleCoverPhoto: (itemId: string) => void;
}

const hasAuthToken = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('ploc_token') || !!localStorage.getItem('ploc-auth');
};

const syncItemToBackend = async (item: TrackerItem | null): Promise<boolean> => {
  if (item && hasAuthToken()) {
    try {
      await apiService.post('/tracker/items', item);
      return true;
    } catch (e) {
      console.error('Erro ao sincronizar item:', e);
      return false;
    }
  }
  return false;
};

const syncLogToBackend = async (log: TrackerLog) => {
  if (!hasAuthToken()) return;
  try {
    await apiService.post('/tracker/logs', log);
  } catch (e) {
    console.error('Erro ao sincronizar log:', e);
  }
};

export const useTrackerStore = create<TrackerStore>()(
  persist(
    (set, get) => ({
      items: {},
      logs: [],

      fetchItems: async () => {
        if (!hasAuthToken()) return;
        try {
          // Busca os itens e logs do servidor
          const [itemsData, logsData] = await Promise.all([
            apiService.get('/tracker/items').catch(() => []),
            apiService.get('/tracker/logs').catch(() => [])
          ]);
          
          if (Array.isArray(itemsData)) {
            const itemsRecord: Record<string, TrackerItem> = {};
            itemsData.forEach((item: any) => {
              itemsRecord[item.id] = {
                ...item,
                startDate: new Date(item.startDate).getTime(),
                endDate: item.endDate ? new Date(item.endDate).getTime() : undefined,
                consumptionStart: item.consumptionStart ? Number(item.consumptionStart) : undefined,
              };
            });
            set({ items: itemsRecord });
          }

          if (Array.isArray(logsData)) {
            const formattedLogs = logsData.map((log: any) => ({
              ...log,
              timestamp: Number(log.timestamp)
            }));
            set({ logs: formattedLogs });
          }

        } catch (error) {
          console.error("Erro ao buscar dados do tracker no backend:", error);
        }
      },

      setItem: (item) => {
        set((state) => ({ 
          items: { ...state.items, [item.id]: item } 
        }));
        syncItemToBackend(item);
      },

      removeItem: (itemId) => {
        set((state) => {
          const newItems = { ...state.items };
          delete newItems[itemId];
          return { items: newItems };
        });
        if (hasAuthToken()) {
          apiService.delete(`/tracker/items/${itemId}`).catch(console.error);
        }
      },

      startConsumption: (itemId) => {
        set((state) => {
          const item = state.items[itemId];
          if (!item) return state;
          
          return {
            items: { 
              ...state.items, 
              [itemId]: { ...item, isConsuming: true, consumptionStart: Date.now() } 
            }
          };
        });
        syncItemToBackend(get().items[itemId]);
      },

      cancelConsumption: (itemId) => {
        set((state) => {
          const item = state.items[itemId];
          if (!item) return state;
          return {
            items: { 
              ...state.items, 
              [itemId]: { ...item, isConsuming: false, consumptionStart: undefined } 
            }
          };
        });
        syncItemToBackend(get().items[itemId]);
      },

      endConsumption: (itemId, actualSecondsUsed, info, photoUrl) => {
        let createdLog: TrackerLog | null = null;
        set((state) => {
          const item = state.items[itemId];
          if (!item) return state;

          const now = Date.now();
          createdLog = {
            id: crypto.randomUUID(),
            trackerItemId: itemId,
            type: 'consumption',
            timestamp: now,
            durationSeconds: actualSecondsUsed,
            info,
            photoUrl
          };

          const updatedItem = {
            ...item,
            isConsuming: false,
            consumptionStart: undefined,
            defaultTimer: actualSecondsUsed
          };

          return {
            items: { ...state.items, [itemId]: updatedItem },
            logs: [createdLog, ...state.logs]
          };
        });
        
        const currentItem = get().items[itemId];
        if (currentItem) syncItemToBackend(currentItem);
        if (createdLog) syncLogToBackend(createdLog);
      },

      addLog: (logData) => {
        let createdLog: TrackerLog | null = null;
        set((state) => {
          createdLog = {
            ...logData,
            id: crypto.randomUUID(),
            timestamp: Date.now()
          };
          return {
            logs: [createdLog, ...state.logs]
          };
        });
        if (createdLog) syncLogToBackend(createdLog);
      },

      updateLog: (logId, updates) => {
        let updatedLog: TrackerLog | null = null;
        set((state) => {
          const newLogs = state.logs.map(log => {
            if (log.id === logId) {
              updatedLog = { ...log, ...updates };
              return updatedLog;
            }
            return log;
          });
          return { logs: newLogs };
        });
        if (updatedLog) syncLogToBackend(updatedLog);
      },

      deleteLog: (logId) => {
        set((state) => ({
          logs: state.logs.filter(log => log.id !== logId)
        }));
        if (hasAuthToken()) {
          apiService.delete(`/tracker/logs/${logId}`).catch(console.error);
        }
      },

      toggleCoverPhoto: (itemId) => {
        set((state) => {
          const item = state.items[itemId];
          if (!item) return state;
          
          const currentConfig = item.config || {};
          const newConfig = { ...currentConfig, showCoverPhoto: !(currentConfig.showCoverPhoto !== false) };

          return {
            items: { ...state.items, [itemId]: { ...item, config: newConfig } }
          };
        });
        syncItemToBackend(get().items[itemId]);
      }
    }),
    {
      name: 'ploc-tracker-storage',
    }
  )
);
