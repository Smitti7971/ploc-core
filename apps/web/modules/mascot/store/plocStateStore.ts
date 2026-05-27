import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const uuidv4 = () => Math.random().toString(36).substring(2) + Date.now().toString(36);
export type PlocMood = 'ILUMINADO' | 'FELIZ' | 'APÁTICO' | 'CHATEADO' | 'RAIVA';
export type ItemType = 'food' | 'water' | 'medicine' | 'special_cloth' | 'mission_item';

export interface PlocItem {
  id: string;
  type: ItemType;
  name: string;
  createdAt: number;
  spoilsAt?: number; // Tempo em que estraga (apenas para comidas que estragam)
  state: 'fresh' | 'spoiled';
}

interface PlocStateStore {
  // Vitais
  hunger: number; // 0 a 100
  thirst: number; // 0 a 100
  fatigue: number; // 0 a 100
  spoiledEatenCount: number;
  
  // Derivados
  mood: PlocMood;
  
  // Bolsa
  inventory: PlocItem[];

  // Game Loop Actions
  tick: () => void; // Chamado a cada X minutos para atualizar vitais
  
  // Interaction Actions
  eat: (item: PlocItem, source: 'direct' | 'stored') => void;
  store: (item: Omit<PlocItem, 'id' | 'createdAt' | 'state'>) => void;
  dropItem: (item: Omit<PlocItem, 'id' | 'createdAt' | 'state'>) => void;
  useMedicine: (itemId: string) => void;
  
  // Util
  _calculateMood: (hunger: number, thirst: number, fatigue: number, spoiledEatenCount: number) => PlocMood;
}

const MAX_NEED = 100;
const VOMIT_THRESHOLD = 4;

export const usePlocStateStore = create<PlocStateStore>()(
  persist(
    (set, get) => ({
      hunger: 100, // 100% = Saciado/Saudável
      thirst: 100, // 100% = Hidratado/Saudável
      fatigue: 100, // 100% = Cheio de energia
      spoiledEatenCount: 0,
      mood: 'FELIZ',
      inventory: [],

      _calculateMood: (hunger, thirst, fatigue, spoiledEatenCount) => {
        if (spoiledEatenCount >= VOMIT_THRESHOLD || hunger <= 20 || thirst <= 20 || fatigue <= 20) {
          return 'RAIVA';
        }
        if (hunger <= 40 || thirst <= 40 || fatigue <= 40) {
          return 'CHATEADO';
        }
        if (hunger <= 60 || thirst <= 60 || fatigue <= 60) {
          return 'APÁTICO';
        }
        if (hunger === 100 && thirst === 100 && fatigue === 100) {
          return 'ILUMINADO';
        }
        return 'FELIZ';
      },

      tick: () => {
        const now = Date.now();
        set(state => {
          // Diminuir Fome, Sede e Energia em 1% a cada tick (1 minuto)
          const newHunger = Math.max(0, state.hunger - 1); // -1 por tick
          const newThirst = Math.max(0, state.thirst - 1); // -1 por tick
          const newFatigue = Math.max(0, state.fatigue - 1); // -1 por tick
          
          // Checar validade dos itens
          const updatedInventory = state.inventory.map(item => {
            if (item.type === 'food' && item.state === 'fresh' && item.spoilsAt && now > item.spoilsAt) {
              return { ...item, state: 'spoiled' as const };
            }
            return item;
          });

          return {
            hunger: newHunger,
            thirst: newThirst,
            fatigue: newFatigue,
            inventory: updatedInventory,
            mood: get()._calculateMood(newHunger, newThirst, newFatigue, state.spoiledEatenCount)
          };
        });
      },

      eat: (item: PlocItem, source: 'direct' | 'stored') => {
        set(state => {
          let needChange = 0;
          let newSpoiledEatenCount = state.spoiledEatenCount;
          let vomitTriggered = false;

          if (source === 'direct') {
            needChange = 5; // Cada alimento melhora exatamente 5 por cento do status
          } else {
            // Consumo do inventário (bolsa)
            if (item.state === 'fresh') {
              needChange = 5; // Cada alimento melhora exatamente 5 por cento do status
            } else {
              // Estrapolado / estragado
              needChange = 2; // Comida estragada melhora quase nada
              newSpoiledEatenCount += 1;
              if (newSpoiledEatenCount >= VOMIT_THRESHOLD) {
                // VOMITA: Passa muito mal, a fome e a sede despencam!
                vomitTriggered = true;
                newSpoiledEatenCount = 0;
              }
            }
          }

          let newHunger = state.hunger;
          let newThirst = state.thirst;

          if (item.type === 'food') {
            newHunger = vomitTriggered 
              ? Math.max(0, state.hunger - 40) // Vômito esvazia o estômago
              : Math.max(0, Math.min(MAX_NEED, state.hunger + needChange));
            
            if (vomitTriggered) {
              newThirst = Math.max(0, state.thirst - 30); // Vômito desidrata
            }
          } else if (item.type === 'water') {
            newThirst = vomitTriggered 
              ? Math.max(0, state.thirst - 40) // Vômito desidrata drasticamente
              : Math.max(0, Math.min(MAX_NEED, state.thirst + needChange));

            if (vomitTriggered) {
              newHunger = Math.max(0, state.hunger - 30); // Vômito esvazia
            }
          }

          // Se veio do inventário, removemos o item consumido
          const updatedInventory = source === 'stored' 
            ? state.inventory.filter(i => i.id !== item.id)
            : state.inventory;

          return {
            hunger: newHunger,
            thirst: newThirst,
            spoiledEatenCount: newSpoiledEatenCount,
            inventory: updatedInventory,
            mood: get()._calculateMood(newHunger, newThirst, state.fatigue, newSpoiledEatenCount)
          };
        });
      },

      store: (itemData) => {
        set(state => ({
          inventory: [
            ...state.inventory,
            {
              ...itemData,
              id: uuidv4(),
              createdAt: Date.now(),
              state: 'fresh'
            }
          ]
        }));
      },

      dropItem: (itemData) => {
        get().store(itemData);
      },

      useMedicine: (itemId: string) => {
        set(state => {
          const item = state.inventory.find(i => i.id === itemId);
          if (!item || item.type !== 'medicine') return state;

          // Cura enjôos e melhora energia (fadiga)
          const newFatigue = Math.min(MAX_NEED, state.fatigue + 15);
          
          return {
            spoiledEatenCount: 0,
            fatigue: newFatigue,
            inventory: state.inventory.filter(i => i.id !== itemId),
            mood: get()._calculateMood(state.hunger, state.thirst, newFatigue, 0)
          };
        });
      }
    }),
    {
      name: 'ploc-state-store'
    }
  )
);

// Inicia o Game Loop Global (Apenas no Client)
if (typeof window !== 'undefined') {
  setInterval(() => {
    usePlocStateStore.getState().tick();
  }, 60000); // 1 minuto (60.000 ms)
}
