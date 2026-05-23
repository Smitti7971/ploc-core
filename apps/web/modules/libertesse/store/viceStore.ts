import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '@/services/api';

export type ViceMode = 'acompanhe' | 'diminua' | 'pare' | null;

export interface ActiveVice {
  viceId: string;
  customName?: string;
  mode: ViceMode;
  startTime: number; 
  expectedFrequency?: string; 
  timerLimitSeconds?: number; 
  reductionTarget?: number; 
  
  isConsuming?: boolean;
  consumptionStartTime?: number;
  defaultConsumptionSeconds?: number; 
  costPerUse?: number; 
  currentMotivator?: string; 
}

export interface ViceLog {
  id: string;
  viceId: string;
  type: 'consumption' | 'expense' | 'start' | 'end';
  timestamp: number;
  durationSeconds?: number;
  fastingSeconds?: number;
  cost?: number;
  motivator?: string;
}

interface ViceStore {
  activeVice: ActiveVice | null;
  logs: ViceLog[];
  
  fetchVices: () => Promise<void>;
  
  setActiveVice: (vice: ActiveVice | null) => void;
  resetTimer: () => void;
  
  startConsumption: (motivator?: string) => void;
  endConsumption: (actualSecondsUsed: number, motivator?: string) => void;
  cancelConsumption: () => void;
  addFastingTime: (additionalSeconds: number) => void;
  setDefaultConsumptionSeconds: (seconds: number) => void;
  setCostPerUse: (cost: number) => void;
  
  addLog: (log: Omit<ViceLog, 'id' | 'timestamp'>) => void;
  clearLogs: (viceId: string) => void;
}

const syncViceToBackend = async (vice: ActiveVice | null) => {
  if (vice) {
    try {
      await apiService.post('/vices', vice);
    } catch (e) {
      console.error(e);
    }
  }
};

const syncLogToBackend = async (log: ViceLog) => {
  try {
    await apiService.post('/vices/log', log);
  } catch (e) {
    console.error(e);
  }
};

export const useViceStore = create<ViceStore>()(
  persist(
    (set, get) => ({
      activeVice: null,
      logs: [],

      fetchVices: async () => {
        try {
          const vices = await apiService.get<any[]>('/vices');
          if (vices && vices.length > 0) {
            const active = vices[0];
            set({
              activeVice: {
                viceId: active.viceId,
                customName: active.customName,
                mode: active.mode,
                startTime: Number(active.startTime),
                expectedFrequency: active.expectedFrequency,
                timerLimitSeconds: active.timerLimitSeconds,
                reductionTarget: active.reductionTarget,
                isConsuming: active.isConsuming,
                consumptionStartTime: active.consumptionStartTime ? Number(active.consumptionStartTime) : undefined,
                defaultConsumptionSeconds: active.defaultConsumptionSeconds,
                costPerUse: active.costPerUse,
                currentMotivator: active.currentMotivator
              },
              logs: active.logs.map((l: any) => ({
                ...l,
                timestamp: Number(l.timestamp)
              })) || []
            });
          }
        } catch (error) {
          console.error("Erro ao buscar vícios no backend:", error);
        }
      },

      setActiveVice: (vice) => {
        let createdLog: ViceLog | null = null;
        let viceIdToDelete: string | null = null;

        set((state) => {
          const now = Date.now();
          let newLogs = [...state.logs];

          if (vice === null && state.activeVice) {
            viceIdToDelete = state.activeVice.viceId;
            createdLog = {
              id: Math.random().toString(36).substring(2, 9),
              viceId: state.activeVice.viceId,
              type: 'end',
              timestamp: now
            };
            newLogs.unshift(createdLog);
          } else if (vice !== null && (!state.activeVice || state.activeVice.viceId !== vice.viceId)) {
            createdLog = {
              id: Math.random().toString(36).substring(2, 9),
              viceId: vice.viceId,
              type: 'start',
              timestamp: now
            };
            newLogs.unshift(createdLog);
          }

          return { activeVice: vice, logs: newLogs };
        });
        // To prevent race conditions, we can't use async in set(), but we can do the API calls here
        (async () => {
          await syncViceToBackend(vice);
          if (viceIdToDelete) {
            await apiService.delete(`/vices/${viceIdToDelete}`).catch(console.error);
          }
          if (createdLog) await syncLogToBackend(createdLog);
        })();
      },

      resetTimer: () => {
        set((state) => ({
          activeVice: state.activeVice 
            ? { ...state.activeVice, startTime: Date.now(), isConsuming: false, consumptionStartTime: undefined } 
            : null
        }));
        syncViceToBackend(get().activeVice);
      },
      
      startConsumption: (motivator) => {
        set((state) => ({
          activeVice: state.activeVice
            ? { 
                ...state.activeVice, 
                isConsuming: true, 
                consumptionStartTime: Date.now(),
                defaultConsumptionSeconds: state.activeVice.defaultConsumptionSeconds || 300,
                currentMotivator: motivator
              }
            : null
        }));
        syncViceToBackend(get().activeVice);
      },

      cancelConsumption: () => {
        set((state) => ({
          activeVice: state.activeVice
            ? {
                ...state.activeVice,
                isConsuming: false,
                consumptionStartTime: undefined,
                currentMotivator: undefined
              }
            : null
        }));
        syncViceToBackend(get().activeVice);
      },

      endConsumption: (actualSecondsUsed, motivator) => {
        let createdLog: ViceLog | null = null;
        set((state) => {
          if (!state.activeVice) return state;

          const now = Date.now();
          const fastingSeconds = Math.floor((now - state.activeVice.startTime) / 1000) - actualSecondsUsed;
          const finalMotivator = motivator || state.activeVice.currentMotivator;

          createdLog = {
            id: Math.random().toString(36).substring(2, 9),
            viceId: state.activeVice.viceId,
            type: 'consumption',
            timestamp: now,
            durationSeconds: actualSecondsUsed,
            fastingSeconds: fastingSeconds > 0 ? fastingSeconds : 0,
            cost: state.activeVice.costPerUse,
            motivator: finalMotivator?.trim() || undefined
          };

          return {
            activeVice: {
              ...state.activeVice,
              isConsuming: false,
              consumptionStartTime: undefined,
              defaultConsumptionSeconds: actualSecondsUsed, 
              startTime: now, 
              currentMotivator: undefined
            },
            logs: [createdLog, ...state.logs]
          };
        });
        (async () => {
          await syncViceToBackend(get().activeVice);
          if (createdLog) await syncLogToBackend(createdLog);
        })();
      },

      addFastingTime: (additionalSeconds) => {
        set((state) => {
          if (!state.activeVice) return state;
          const currentElapsed = Math.floor((Date.now() - state.activeVice.startTime) / 1000);
          const currentLimit = state.activeVice.timerLimitSeconds || 0;
          
          let newStartTime = state.activeVice.startTime;
          let newLimit = currentLimit;

          if (currentElapsed >= currentLimit) {
            newStartTime = Date.now();
            newLimit = additionalSeconds;
          } else {
            newLimit = currentLimit + additionalSeconds;
          }

          return {
            activeVice: {
              ...state.activeVice,
              startTime: newStartTime,
              timerLimitSeconds: newLimit
            }
          };
        });
        syncViceToBackend(get().activeVice);
      },

      setDefaultConsumptionSeconds: (seconds) => {
        set((state) => ({
          activeVice: state.activeVice
            ? { ...state.activeVice, defaultConsumptionSeconds: seconds }
            : null
        }));
        syncViceToBackend(get().activeVice);
      },

      setCostPerUse: (cost) => {
        set((state) => ({
          activeVice: state.activeVice
            ? { ...state.activeVice, costPerUse: cost }
            : null
        }));
        syncViceToBackend(get().activeVice);
      },

      addLog: (log) => {
        let createdLog: ViceLog | null = null;
        set((state) => {
          createdLog = {
            ...log,
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now()
          };
          return {
            logs: [createdLog, ...state.logs]
          };
        });
        if (createdLog) syncLogToBackend(createdLog);
      },
      
      clearLogs: (viceId) => {
        set((state) => ({
          logs: state.logs.filter(l => l.viceId !== viceId)
        }));
        // Note: not syncing log deletion yet to keep it simple, typically you wouldn't clear logs in DB this easily.
      }
    }),
    {
      name: 'ploc-vice-storage',
    }
  )
);
