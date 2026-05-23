import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViceMode = 'acompanhe' | 'diminua' | 'pare' | null;

export interface ActiveVice {
  viceId: string;
  customName?: string;
  mode: ViceMode;
  startTime: number; // timestamp de início do ciclo atual
  expectedFrequency?: string; // Para modo acompanhe
  timerLimitSeconds?: number; // Para modo diminua (jejum)
  reductionTarget?: number; // Para modo diminua
  
  // GAP Phase (Active Consumption)
  isConsuming?: boolean;
  consumptionStartTime?: number;
  defaultConsumptionSeconds?: number; // Padrão 5 min = 300s
  costPerUse?: number; // Gasto atual
  currentMotivator?: string; // Salva o motivador para quando o tempo acabar
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
  setActiveVice: (vice: ActiveVice | null) => void;
  resetTimer: () => void;
  
  // GAP Phase functions
  startConsumption: (motivator?: string) => void;
  endConsumption: (actualSecondsUsed: number, motivator?: string) => void;
  cancelConsumption: () => void;
  addFastingTime: (additionalSeconds: number) => void;
  setDefaultConsumptionSeconds: (seconds: number) => void;
  setCostPerUse: (cost: number) => void;
  
  // History logs
  logs: ViceLog[];
  addLog: (log: Omit<ViceLog, 'id' | 'timestamp'>) => void;
  clearLogs: (viceId: string) => void;
}

export const useViceStore = create<ViceStore>()(
  persist(
    (set) => ({
      activeVice: null,
      setActiveVice: (vice) => set((state) => {
        const now = Date.now();
        let newLogs = [...state.logs];

        // Se estiver encerrando a estratégia
        if (vice === null && state.activeVice) {
          newLogs.unshift({
            id: Math.random().toString(36).substring(2, 9),
            viceId: state.activeVice.viceId,
            type: 'end',
            timestamp: now
          });
        }
        // Se estiver iniciando uma estratégia (ou trocando)
        else if (vice !== null && (!state.activeVice || state.activeVice.viceId !== vice.viceId)) {
          newLogs.unshift({
            id: Math.random().toString(36).substring(2, 9),
            viceId: vice.viceId,
            type: 'start',
            timestamp: now
          });
        }

        return { activeVice: vice, logs: newLogs };
      }),
      resetTimer: () => set((state) => ({
        activeVice: state.activeVice 
          ? { ...state.activeVice, startTime: Date.now(), isConsuming: false, consumptionStartTime: undefined } 
          : null
      })),
      
      startConsumption: (motivator) => set((state) => ({
        activeVice: state.activeVice
          ? { 
              ...state.activeVice, 
              isConsuming: true, 
              consumptionStartTime: Date.now(),
              defaultConsumptionSeconds: state.activeVice.defaultConsumptionSeconds || 300, // default 5 min
              currentMotivator: motivator
            }
          : null
      })),

      cancelConsumption: () => set((state) => ({
        activeVice: state.activeVice
          ? {
              ...state.activeVice,
              isConsuming: false,
              consumptionStartTime: undefined,
              currentMotivator: undefined
            }
          : null
      })),

      endConsumption: (actualSecondsUsed, motivator) => set((state) => {
        if (!state.activeVice) return state;

        const now = Date.now();
        const fastingSeconds = Math.floor((now - state.activeVice.startTime) / 1000) - actualSecondsUsed;
        const finalMotivator = motivator || state.activeVice.currentMotivator;

        const newLog: ViceLog = {
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
            defaultConsumptionSeconds: actualSecondsUsed, // adapta o padrão
            startTime: now, // reinicia jejum
            currentMotivator: undefined
          },
          logs: [newLog, ...state.logs]
        };
      }),

      addFastingTime: (additionalSeconds) => set((state) => {
        if (!state.activeVice) return state;
        const currentElapsed = Math.floor((Date.now() - state.activeVice.startTime) / 1000);
        const currentLimit = state.activeVice.timerLimitSeconds || 0;
        
        let newStartTime = state.activeVice.startTime;
        let newLimit = currentLimit;

        if (currentElapsed >= currentLimit) {
          // Já estava no Meta Atingida, e resolveu resistir mais X min.
          // O timer atual vira um novo ciclo de Resista com limite = X min
          newStartTime = Date.now();
          newLimit = additionalSeconds;
        } else {
          // Estava no Resista e resolveu somar mais tempo?
          newLimit = currentLimit + additionalSeconds;
        }

        return {
          activeVice: {
            ...state.activeVice,
            startTime: newStartTime,
            timerLimitSeconds: newLimit
          }
        };
      }),

      setDefaultConsumptionSeconds: (seconds) => set((state) => ({
        activeVice: state.activeVice
          ? { ...state.activeVice, defaultConsumptionSeconds: seconds }
          : null
      })),

      setCostPerUse: (cost) => set((state) => ({
        activeVice: state.activeVice
          ? { ...state.activeVice, costPerUse: cost }
          : null
      })),

      logs: [],
      addLog: (log) => set((state) => ({
        logs: [
          {
            ...log,
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now()
          },
          ...state.logs
        ]
      })),
      
      clearLogs: (viceId) => set((state) => ({
        logs: state.logs.filter(l => l.viceId !== viceId)
      }))
    }),
    {
      name: 'ploc-vice-storage',
    }
  )
);
