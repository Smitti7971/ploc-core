import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '@/services/api';

export type ViceMode = 'acompanhe' | 'diminua' | 'missao-antitabagismo' | null;

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
  isMission?: boolean;
  isHidden?: boolean;
  isVulnerability?: boolean;
  antitabagismoLevel?: number;
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

interface ViceResponse {
  id: string;
  viceId: string;
  customName?: string;
  mode: ViceMode;
  startTime: number;
  expectedFrequency?: string;
  timerLimitSeconds?: number;
  reductionTarget?: number;
  isConsuming: boolean;
  consumptionStartTime?: number;
  defaultConsumptionSeconds: number;
  costPerUse?: number;
  currentMotivator?: string;
  isMission?: boolean;
  isHidden?: boolean;
  isVulnerability?: boolean;
  logs: ViceLogResponse[];
}

interface ViceLogResponse {
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
  activeVices: Record<string, ActiveVice>;
  logs: ViceLog[];
  
  fetchVices: () => Promise<void>;
  
  setActiveVice: (vice: ActiveVice) => void;
  removeActiveVice: (viceId: string) => void;
  resetTimer: (viceId: string) => void;
  
  startConsumption: (viceId: string, motivator?: string) => void;
  endConsumption: (viceId: string, actualSecondsUsed: number, motivator?: string) => void;
  cancelConsumption: (viceId: string) => void;
  addFastingTime: (viceId: string, additionalSeconds: number) => void;
  setDefaultConsumptionSeconds: (viceId: string, seconds: number) => void;
  setCostPerUse: (viceId: string, cost: number) => void;
  
  addLog: (log: Omit<ViceLog, 'id' | 'timestamp'>) => void;
  clearLogs: (viceId: string) => void;
  toggleVisibility: (viceId: string) => void;
  toggleVulnerability: (viceId: string) => void;
  advanceAntitabagismoLevel: (viceId: string) => void;
}

const hasAuthToken = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('ploc_token') || !!localStorage.getItem('ploc-auth');
};

const syncViceToBackend = async (vice: ActiveVice | null): Promise<boolean> => {
  if (vice && hasAuthToken()) {
    try {
      await apiService.post('/vices', vice);
      return true;
    } catch (e) {
      console.error('Erro ao sincronizar vício:', e);
      return false;
    }
  }
  return false;
};

const syncLogToBackend = async (log: ViceLog) => {
  if (!hasAuthToken()) return;
  try {
    await apiService.post('/vices/log', log);
  } catch (e) {
    console.error('Erro ao sincronizar log de vício:', e);
  }
};

export const useViceStore = create<ViceStore>()(
  persist(
    (set, get) => ({
      activeVices: {},
      logs: [],

      fetchVices: async () => {
        try {
          // Previne chamadas caso o usuário não esteja logado (evitando erros de console durante o redirecionamento)
          if (typeof window !== 'undefined') {
            const hasDirectToken = !!localStorage.getItem('ploc_token');
            const hasStoreToken = !!localStorage.getItem('ploc-auth');
            if (!hasDirectToken && !hasStoreToken) return;
          }
          
          const vices = await apiService.get<ViceResponse[]>('/vices');
          if (vices && vices.length > 0) {
            const newActiveVices: Record<string, ActiveVice> = {};
            const autoEndedLogs: ViceLog[] = [];
            
            vices.forEach(v => {
              let isConsuming = v.isConsuming;
              let startTime = Number(v.startTime);
              let consumptionStartTime = v.consumptionStartTime ? Number(v.consumptionStartTime) : undefined;
              
              // Verifica se a bolha foi deixada aberta (consumo) por mais tempo que o default (ex: 5 min)
              if (isConsuming && consumptionStartTime) {
                const elapsedSeconds = (Date.now() - consumptionStartTime) / 1000;
                const limit = v.defaultConsumptionSeconds || 300;
                if (elapsedSeconds > limit) {
                  isConsuming = false;
                  startTime = Date.now();
                  
                  // Gera o log de finalização automatica
                  const actualSecondsUsed = limit;
                  const fastingSeconds = Math.floor((Date.now() - startTime) / 1000) - actualSecondsUsed;
                  autoEndedLogs.push({
                    id: crypto.randomUUID(),
                    viceId: v.viceId,
                    type: 'consumption',
                    timestamp: Date.now(),
                    durationSeconds: actualSecondsUsed,
                    fastingSeconds: Math.max(0, fastingSeconds),
                    motivator: v.currentMotivator || 'Auto-encerrado'
                  });
                  consumptionStartTime = undefined;
                }
              }

              newActiveVices[v.viceId] = {
                viceId: v.viceId,
                customName: v.customName,
                mode: v.mode,
                startTime,
                expectedFrequency: v.expectedFrequency,
                timerLimitSeconds: v.timerLimitSeconds,
                reductionTarget: v.reductionTarget,
                isConsuming,
                consumptionStartTime,
                defaultConsumptionSeconds: v.defaultConsumptionSeconds,
                costPerUse: v.costPerUse,
                currentMotivator: v.currentMotivator,
                isMission: v.isMission,
                isHidden: v.isHidden,
                isVulnerability: v.isVulnerability
              };
            });

            set({
              activeVices: newActiveVices,
              logs: [
                ...vices.flatMap(v => 
                  (v.logs || []).map((l: ViceLogResponse) => ({
                    ...l,
                    viceId: v.viceId,
                    timestamp: Number(l.timestamp)
                  }))
                ),
                ...autoEndedLogs
              ]
            });
            
            // Sync any auto-ended logs
            autoEndedLogs.forEach(log => {
               syncLogToBackend(log).catch(console.error);
            });
          }
        } catch (error) {
          console.error("Erro ao buscar vícios no backend:", error);
        }
      },

      setActiveVice: (vice) => {
        let createdLog: ViceLog | null = null;

        set((state) => {
          const now = Date.now();
          const newLogs = [...state.logs];
          const isNew = !state.activeVices[vice.viceId];

          if (isNew) {
            createdLog = {
              id: crypto.randomUUID(),
              viceId: vice.viceId,
              type: 'start',
              timestamp: now
            };
            newLogs.unshift(createdLog);
          }

          return { 
            activeVices: { ...state.activeVices, [vice.viceId]: vice }, 
            logs: newLogs 
          };
        });

        (async () => {
          const success = await syncViceToBackend(vice);
          if (success && createdLog) await syncLogToBackend(createdLog);
        })();
      },

      removeActiveVice: (viceId) => {
        let createdLog: ViceLog | null = null;

        set((state) => {
          const now = Date.now();
          const newLogs = [...state.logs];
          
          if (state.activeVices[viceId]) {
            createdLog = {
              id: crypto.randomUUID(),
              viceId,
              type: 'end',
              timestamp: now
            };
            newLogs.unshift(createdLog);
          }

          const newVices = { ...state.activeVices };
          delete newVices[viceId];

          return { activeVices: newVices, logs: newLogs };
        });

        (async () => {
          if (createdLog) await syncLogToBackend(createdLog).catch(console.error);
          await apiService.delete(`/vices/${viceId}`).catch(console.error);
        })();
      },

      resetTimer: (viceId) => {
        set((state) => {
          const vice = state.activeVices[viceId];
          if (!vice) return state;

          const updatedVice = { 
            ...vice, 
            startTime: Date.now(), 
            isConsuming: false, 
            consumptionStartTime: undefined 
          };

          return {
            activeVices: { ...state.activeVices, [viceId]: updatedVice }
          };
        });
        syncViceToBackend(get().activeVices[viceId]);
      },
      
      startConsumption: (viceId, motivator) => {
        set((state) => {
          const vice = state.activeVices[viceId];
          if (!vice) return state;

          const updatedVice = { 
            ...vice, 
            isConsuming: true, 
            consumptionStartTime: Date.now(),
            defaultConsumptionSeconds: vice.defaultConsumptionSeconds || 300,
            currentMotivator: motivator
          };

          return {
            activeVices: { ...state.activeVices, [viceId]: updatedVice }
          };
        });
        syncViceToBackend(get().activeVices[viceId]);
      },

      cancelConsumption: (viceId) => {
        set((state) => {
          const vice = state.activeVices[viceId];
          if (!vice) return state;

          const updatedVice = {
            ...vice,
            isConsuming: false,
            consumptionStartTime: undefined,
            currentMotivator: undefined
          };

          return {
            activeVices: { ...state.activeVices, [viceId]: updatedVice }
          };
        });
        syncViceToBackend(get().activeVices[viceId]);
      },

      endConsumption: (viceId, actualSecondsUsed, motivator) => {
        let createdLog: ViceLog | null = null;
        set((state) => {
          const vice = state.activeVices[viceId];
          if (!vice) return state;

          const now = Date.now();
          const fastingSeconds = Math.floor((now - vice.startTime) / 1000) - actualSecondsUsed;
          const finalMotivator = motivator || vice.currentMotivator;

          createdLog = {
            id: crypto.randomUUID(),
            viceId: vice.viceId,
            type: 'consumption',
            timestamp: now,
            durationSeconds: actualSecondsUsed,
            fastingSeconds: fastingSeconds > 0 ? fastingSeconds : 0,
            cost: vice.costPerUse,
            motivator: finalMotivator?.trim() || undefined
          };

          const updatedVice = {
            ...vice,
            isConsuming: false,
            consumptionStartTime: undefined,
            defaultConsumptionSeconds: actualSecondsUsed, 
            startTime: now, 
            currentMotivator: undefined
          };

          return {
            activeVices: { ...state.activeVices, [viceId]: updatedVice },
            logs: [createdLog, ...state.logs]
          };
        });
        (async () => {
          const success = await syncViceToBackend(get().activeVices[viceId]);
          if (success && createdLog) await syncLogToBackend(createdLog);
        })();
      },

      addFastingTime: (viceId, additionalSeconds) => {
        set((state) => {
          const vice = state.activeVices[viceId];
          if (!vice) return state;

          const currentElapsed = Math.floor((Date.now() - vice.startTime) / 1000);
          const currentLimit = vice.timerLimitSeconds || 0;
          
          let newStartTime = vice.startTime;
          let newLimit = currentLimit;

          if (currentElapsed >= currentLimit) {
            newStartTime = Date.now();
            newLimit = additionalSeconds;
          } else {
            newLimit = currentLimit + additionalSeconds;
          }

          const updatedVice = {
            ...vice,
            startTime: newStartTime,
            timerLimitSeconds: newLimit
          };

          return {
            activeVices: { ...state.activeVices, [viceId]: updatedVice }
          };
        });
        syncViceToBackend(get().activeVices[viceId]);
      },

      setDefaultConsumptionSeconds: (viceId, seconds) => {
        set((state) => {
          const vice = state.activeVices[viceId];
          if (!vice) return state;

          return {
            activeVices: { 
              ...state.activeVices, 
              [viceId]: { ...vice, defaultConsumptionSeconds: seconds } 
            }
          };
        });
        syncViceToBackend(get().activeVices[viceId]);
      },

      setCostPerUse: (viceId, cost) => {
        set((state) => {
          const vice = state.activeVices[viceId];
          if (!vice) return state;

          return {
            activeVices: { 
              ...state.activeVices, 
              [viceId]: { ...vice, costPerUse: cost } 
            }
          };
        });
        syncViceToBackend(get().activeVices[viceId]);
      },

      addLog: (log) => {
        let createdLog: ViceLog | null = null;
        set((state) => {
          createdLog = {
            ...log,
            id: crypto.randomUUID(),
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
      },

      toggleVisibility: (viceId) => {
        set((state) => {
          const vice = state.activeVices[viceId];
          if (!vice) return state;

          const updatedVice = {
            ...vice,
            isHidden: !vice.isHidden
          };

          return {
            activeVices: { ...state.activeVices, [viceId]: updatedVice }
          };
        });
        syncViceToBackend(get().activeVices[viceId]);
      },

      toggleVulnerability: (viceId) => {
        set((state) => {
          const vice = state.activeVices[viceId];
          if (!vice) return state;

          const updatedVice = {
            ...vice,
            isVulnerability: !vice.isVulnerability
          };

          return {
            activeVices: { ...state.activeVices, [viceId]: updatedVice }
          };
        });
        syncViceToBackend(get().activeVices[viceId]);
      },

      advanceAntitabagismoLevel: (viceId) => {
        set((state) => {
          const vice = state.activeVices[viceId];
          if (!vice) return state;

          const currentLevel = vice.antitabagismoLevel ?? 0;
          const nextLevel = Math.min(10, currentLevel + 1);

          const updatedVice = {
            ...vice,
            antitabagismoLevel: nextLevel
          };

          return {
            activeVices: { ...state.activeVices, [viceId]: updatedVice }
          };
        });
        syncViceToBackend(get().activeVices[viceId]);
      }
    }),
    {
      name: 'ploc-vice-storage',
    }
  )
);
