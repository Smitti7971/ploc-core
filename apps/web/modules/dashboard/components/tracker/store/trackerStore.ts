import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '@/services/api';

export type TrackerType = 'medicine' | 'vice' | 'habit' | 'savings' | string;

export interface TrackerLog {
  id: string;
  trackerItemId: string;
  type: 'consumption' | 'expense' | 'start' | 'end' | 'milestone';
  timestamp: number;
  photoUrl?: string; // Mantido para compatibilidade legado
  photoUrls?: string[]; // Suporte a múltiplas fotos
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
    expectedTime?: string;
    target?: number;
    showCoverPhoto?: boolean;
    showStreak?: boolean;
    isMission?: boolean;
    missionTemplate?: string;
    stages?: {
      id: string;
      name: string;
      startDate: number;
      endDate?: number;
    }[];
    activeMarkers?: string[];
    todos?: {
      id: string;
      text: string;
      date: string;
      completed: boolean;
      recurrence?: string;
    }[];
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
  
  addLog: (log: Omit<TrackerLog, 'id' | 'timestamp'>) => string;
  updateLog: (logId: string, updates: Partial<TrackerLog>) => void;
  deleteLog: (logId: string) => void;

  reparentItem: (childId: string, newParentId: string | null) => void;
  cleanEmptyItems: () => void;
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

let lastFetchTime = 0;
const FETCH_COOLDOWN = 3000;

export const useTrackerStore = create<TrackerStore>()(
  persist(
    (set, get) => ({
      items: {},
      logs: [],

      fetchItems: async () => {
        if (!hasAuthToken()) return;
        const now = Date.now();
        if (now - lastFetchTime < FETCH_COOLDOWN) return;
        lastFetchTime = now;
        
        try {
          // Busca os itens e logs do servidor
          const [itemsData, logsData] = await Promise.all([
            apiService.get('/tracker/items').catch(() => []),
            apiService.get('/tracker/logs').catch(() => [])
          ]);
          
          if (Array.isArray(itemsData)) {
            const itemsRecord: Record<string, TrackerItem> = {};
            itemsData.forEach((item: any) => {
              let parsedConfig = item.config || {};
              if (typeof parsedConfig === 'string') {
                try { parsedConfig = JSON.parse(parsedConfig); } catch (e) {}
              }
              let parsedCorrelations = item.correlations || {};
              if (typeof parsedCorrelations === 'string') {
                try { parsedCorrelations = JSON.parse(parsedCorrelations); } catch (e) {}
              }

              itemsRecord[item.id] = {
                ...item,
                config: parsedConfig,
                correlations: parsedCorrelations,
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
              timestamp: Number(log.timestamp),
              photoUrls: log.photoUrls || log.metadata?.photoUrls || (log.photoUrl ? [log.photoUrl] : undefined)
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
        let itemToSync: TrackerItem | null = null;
        
        set((state) => {
          createdLog = {
            ...logData,
            id: crypto.randomUUID(),
            timestamp: Date.now()
          };
          
          let newItems = state.items;
          const item = state.items[logData.trackerItemId];
          
          // Reinicia o startDate (timer) para vícios (Libertesse) quando houver consumo
          if (item && item.type === 'vice' && item.config?.mode !== 'acompanhe' && logData.type === 'consumption') {
            const updatedItem = {
               ...item,
               startDate: createdLog.timestamp, // Reinicia o contador para o momento do log
               config: {
                 ...item.config,
                 regretStart: undefined // Caso estivesse em arrependimento, limpa
               }
            };
            newItems = {
               ...state.items,
               [item.id]: updatedItem
            };
            itemToSync = updatedItem;
          }

          return {
            logs: [createdLog, ...state.logs],
            items: newItems
          };
        });
        
        if (itemToSync) syncItemToBackend(itemToSync);
        if (createdLog) syncLogToBackend(createdLog);
        return createdLog!.id;
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


      reparentItem: (childId, newParentId) => {
        set((state) => {
          const childItem = state.items[childId];
          if (!childItem) return state;
          if (childId === newParentId) return state; // Can't be parent of itself

          // Check for cycles (prevent child from becoming parent of its own ancestor)
          if (newParentId) {
            let currentCheckId: string | null = newParentId;
            let cycleFound = false;
            // A simple way to check cycles in a small tree is to iterate up the parents
            // But correlations only point downwards. We have to see if newParentId is a descendant of childId.
            const isDescendant = (potentialDescendant: string, ancestor: string, visited = new Set<string>()): boolean => {
              if (visited.has(ancestor)) return false;
              visited.add(ancestor);
              if (potentialDescendant === ancestor) return true;
              const ancestorItem = state.items[ancestor];
              if (!ancestorItem?.correlations) return false;
              
              for (const corrId of Object.keys(ancestorItem.correlations)) {
                if (isDescendant(potentialDescendant, corrId, visited)) return true;
              }
              return false;
            };

            if (isDescendant(newParentId, childId)) {
              console.warn("DND Reparent Cycle Detected. Aborting reparent.");
              return state;
            }
          }

          const newItems = { ...state.items };
          const itemsToSync: TrackerItem[] = [];

          // 1. Remove childId from any existing parent's correlations
          Object.values(newItems).forEach(item => {
            if (item.correlations && item.correlations[childId]) {
              const newCorrelations = { ...item.correlations };
              delete newCorrelations[childId];
              newItems[item.id] = { ...item, correlations: newCorrelations };
              itemsToSync.push(newItems[item.id]);
            }
          });

          // 2. Add childId to newParentId's correlations
          if (newParentId && newItems[newParentId]) {
            const parent = newItems[newParentId];
            const newCorrelations = { ...parent.correlations, [childId]: true };
            newItems[newParentId] = { ...parent, correlations: newCorrelations };
            itemsToSync.push(newItems[newParentId]);
          }

          // Trigger syncs outside the set function using setTimeout or just relying on itemsToSync return
          setTimeout(() => itemsToSync.forEach(i => syncItemToBackend(i)), 0);

          return { items: newItems };
        });
      },

      cleanEmptyItems: () => {
        set((state) => {
          const newItems = { ...state.items };
          Object.keys(newItems).forEach(key => {
            const item = newItems[key];
            if (!item.name || item.name.trim() === '') {
              delete newItems[key];
            }
          });
          return { items: newItems };
        });
      }
    }),
    {
      name: 'ploc-tracker-storage',
    }
  )
);
