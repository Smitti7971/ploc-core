import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const uuidv4 = () => Math.random().toString(36).substring(2) + Date.now().toString(36);
export type PlocMood = 'ILUMINADO' | 'FELIZ' | 'APÁTICO' | 'CHATEADO' | 'RAIVA';
export type ItemType = 'food' | 'water' | 'medicine' | 'special_cloth' | 'mission_item' | 'toy' | 'warm_drink' | 'immunity_food' | 'immunity_water';

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
  cold: number; // 0 a 100
  humor: number; // 0 a 100
  spoiledEatenCount: number;
  lastTickAt: number;
  hungerImmunityUntil?: number; // Timestamp until which hunger won't decay
  thirstImmunityUntil?: number; // Timestamp until which thirst won't decay
  
  // Derivados
  mood: PlocMood;
  
  // Bolsa
  inventory: PlocItem[];
  toastItem: { id: string, type: ItemType, name: string, action: 'gain' | 'use' } | null;

  // Game Loop Actions
  tick: (skipSync?: boolean) => void; // Chamado a cada X minutos para atualizar vitais
  
  // Interaction Actions
  eat: (item: PlocItem, source: 'direct' | 'stored') => void;
  store: (item: Omit<PlocItem, 'id' | 'createdAt' | 'state'>) => void;
  dropItem: (item: Omit<PlocItem, 'id' | 'createdAt' | 'state'>) => void;
  useMedicine: (itemId: string) => void;
  useToy: (itemId: string) => void;
  setToastItem: (toast: { id: string, type: ItemType, name: string, action: 'gain' | 'use' } | null) => void;
  
  // Util
  _calculateMood: (hunger: number, thirst: number, fatigue: number, cold: number, humor: number, spoiledEatenCount: number) => PlocMood;
  
  // Backend Sync
  syncWithBackend: () => Promise<void>;
  loadFromBackend: (data: any) => void;
}

const MAX_NEED = 100;
const VOMIT_THRESHOLD = 4;

export const usePlocStateStore = create<PlocStateStore>()(
  persist(
    (set, get) => ({
      hunger: 100, // 100% = Saciado/Saudável
      thirst: 100, // 100% = Hidratado/Saudável
      fatigue: 100, // 100% = Cheio de energia
      cold: 100, // 100% = Aquecido
      humor: 100, // 100% = Satisfeito/Divertido
      spoiledEatenCount: 0,
      lastTickAt: Date.now(),
      mood: 'FELIZ',
      inventory: [],
      toastItem: null,

      _calculateMood: (hunger, thirst, fatigue, cold, humor, spoiledEatenCount) => {
        if (spoiledEatenCount >= VOMIT_THRESHOLD || hunger <= 20 || thirst <= 20 || fatigue <= 20 || cold <= 20 || humor <= 20) {
          return 'RAIVA';
        }
        if (hunger <= 40 || thirst <= 40 || fatigue <= 40 || cold <= 40 || humor <= 40) {
          return 'CHATEADO';
        }
        if (hunger <= 60 || thirst <= 60 || fatigue <= 60 || cold <= 60 || humor <= 60) {
          return 'APÁTICO';
        }
        if (hunger === 100 && thirst === 100 && fatigue === 100 && cold === 100 && humor === 100) {
          return 'ILUMINADO';
        }
        return 'FELIZ';
      },

      tick: (skipSync?: boolean) => {
        const now = Date.now();
        set(state => {
          const lastTick = state.lastTickAt || now;
          const minutesElapsed = Math.floor((now - lastTick) / 60000);
          
          // Se não passou 1 minuto ainda, não decai, mas atualiza validade. Se passou muito tempo, compensa.
          const decay = Math.max(1, minutesElapsed);

          const hungerDecay = state.hungerImmunityUntil && now < state.hungerImmunityUntil ? 0 : decay;
          const thirstDecay = state.thirstImmunityUntil && now < state.thirstImmunityUntil ? 0 : decay;

          // Diminuir Fome, Sede e Energia baseado no tempo passado
          const newHunger = Math.max(0, state.hunger - hungerDecay);
          const newThirst = Math.max(0, state.thirst - thirstDecay);
          const newFatigue = Math.max(0, state.fatigue - decay);
          const newCold = Math.max(0, state.cold - decay);
          const newHumor = Math.max(0, state.humor - decay);
          

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
            cold: newCold,
            humor: newHumor,
            inventory: updatedInventory,
            lastTickAt: now,
            mood: get()._calculateMood(newHunger, newThirst, newFatigue, newCold, newHumor, state.spoiledEatenCount)
          };
        });
        if (!skipSync) get().syncWithBackend();
      },

      eat: (item: PlocItem, source: 'direct' | 'stored') => {
        set({ toastItem: { id: uuidv4(), type: item.type, name: item.name || 'Item', action: 'use' } });

        // Remove o toast depois de 3 segundos
        setTimeout(() => {
          const currentToast = get().toastItem;
          if (currentToast?.type === item.type && currentToast?.action === 'use') {
            set({ toastItem: null });
          }
        }, 3000);

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
          let newCold = state.cold;
          let newHumor = state.humor;
          let newHungerImmunityUntil = state.hungerImmunityUntil;
          let newThirstImmunityUntil = state.thirstImmunityUntil;

          if (item.type === 'food') {
            newHunger = vomitTriggered 
              ? Math.max(0, state.hunger - 40) // Vômito esvazia o estômago
              : Math.max(0, Math.min(MAX_NEED, state.hunger + needChange));
            
            if (vomitTriggered) {
              newThirst = Math.max(0, state.thirst - 30); // Vômito desidrata
            }
          } else if (item.type === 'immunity_food') {
            newHunger = 70;
            newHungerImmunityUntil = Date.now() + 3 * 60 * 60 * 1000; // 3 horas de imunidade
          } else if (item.type === 'water') {
            newThirst = vomitTriggered 
              ? Math.max(0, state.thirst - 40) // Vômito desidrata drasticamente
              : Math.max(0, Math.min(MAX_NEED, state.thirst + needChange));

            if (vomitTriggered) {
              newHunger = Math.max(0, state.hunger - 30); // Vômito esvazia
            }
          } else if (item.type === 'immunity_water') {
            newThirst = 70;
            newThirstImmunityUntil = Date.now() + 2 * 60 * 60 * 1000; // 2 horas de imunidade
          } else if (item.type === 'warm_drink') {
            newCold = Math.max(0, Math.min(MAX_NEED, state.cold + 30));
            newThirst = Math.max(0, Math.min(MAX_NEED, state.thirst + needChange));
            newHumor = Math.max(0, Math.min(MAX_NEED, state.humor + 10)); // Também melhora humor um pouco
          }


          // Se veio do inventário, removemos o item consumido
          const updatedInventory = source === 'stored' 
            ? state.inventory.filter(i => i.id !== item.id)
            : state.inventory;

          return {
            hunger: newHunger,
            thirst: newThirst,
            cold: newCold,
            humor: newHumor,
            hungerImmunityUntil: newHungerImmunityUntil,
            thirstImmunityUntil: newThirstImmunityUntil,
            spoiledEatenCount: newSpoiledEatenCount,
            inventory: updatedInventory,
            mood: get()._calculateMood(newHunger, newThirst, state.fatigue, newCold, newHumor, newSpoiledEatenCount)
          };
        });
        
        // Se foi consumido do inventário, avisamos o backend diretamente para descontar
        if (source === 'stored') {
          let slug = 'apple';
          if (item.type === 'food' && item.name?.toLowerCase().includes('caf')) slug = 'coffee';
          else if (item.type === 'food') slug = 'apple';
          else if (item.type === 'immunity_food') slug = 'immunity_food';
          else if (item.type === 'water') slug = 'water';
          else if (item.type === 'immunity_water') slug = 'immunity_water';
          else if (item.type === 'warm_drink') slug = 'hot_chocolate';
          else if (item.type === 'medicine') slug = 'medicine';
          else if (item.type === 'toy') slug = 'dices';
          else if (item.type === 'mission_item') slug = 'toy';

          import('@/services/api').then(({ apiService }) => {
            apiService.delete(`/users/me/ploc/inventory/${slug}`).catch(err => {
              console.error("Erro ao consumir item no relacional:", err);
            });
          });
        }
        get().syncWithBackend();
      },

      store: (itemData) => {
        const id = uuidv4();
        const newItem = {
          ...itemData,
          id,
          createdAt: Date.now(),
          state: 'fresh' as const
        };

        set(state => ({
          inventory: [...state.inventory, newItem],
          toastItem: { id, type: itemData.type, name: itemData.name, action: 'gain' }
        }));
        
        // Remove o toast depois de 3 segundos
        setTimeout(() => {
          const currentToast = get().toastItem;
          if (currentToast?.id === id) {
            set({ toastItem: null });
          }
        }, 3000);
        
        // Rota Rápida de Inventário (Async background direct push)
        import('@/services/api').then(({ apiService }) => {
          apiService.post('/users/me/ploc/inventory', { item: newItem }).catch(err => {
            console.error("Erro na rota rápida de inventário, tentando sync completo...", err);
            get().syncWithBackend(); // Fallback
          });
        });
      },

      dropItem: (itemData) => {
        get().store(itemData);
      },

      useMedicine: (itemId: string) => {
        const state = get();
        const item = state.inventory.find(i => i.id === itemId);
        if (!item || item.type !== 'medicine') return;

        set({ toastItem: { id: uuidv4(), type: item.type, name: item.name, action: 'use' } });

        setTimeout(() => {
          const currentToast = get().toastItem;
          if (currentToast?.type === item.type && currentToast?.action === 'use') {
            set({ toastItem: null });
          }
        }, 3000);

        set(state => {
          // Cura enjôos e melhora energia (fadiga)
          const newFatigue = Math.min(MAX_NEED, state.fatigue + 15);
          
          return {
            spoiledEatenCount: 0,
            fatigue: newFatigue,
            inventory: state.inventory.filter(i => i.id !== itemId),
            mood: get()._calculateMood(state.hunger, state.thirst, newFatigue, state.cold, state.humor, 0)
          };
        });
        
        // Notifica o backend
        import('@/services/api').then(({ apiService }) => {
          apiService.delete(`/users/me/ploc/inventory/medicine`).catch(err => {
            console.error("Erro ao consumir medicina no relacional:", err);
          });
        });
        get().syncWithBackend();
      },

      useToy: (itemId: string) => {
        const state = get();
        const item = state.inventory.find(i => i.id === itemId);
        if (!item || item.type !== 'toy') return;

        set({ toastItem: { id: uuidv4(), type: item.type, name: item.name, action: 'use' } });

        set(state => {
          // Brincar melhora muito o humor e um pouco a fadiga
          const newHumor = Math.min(MAX_NEED, state.humor + 25);
          const newFatigue = Math.max(0, state.fatigue - 10);
          
          return {
            humor: newHumor,
            fatigue: newFatigue,
            inventory: state.inventory.filter(i => i.id !== itemId),
            mood: get()._calculateMood(state.hunger, state.thirst, newFatigue, state.cold, newHumor, state.spoiledEatenCount)
          };
        });
        
        // Notifica o backend
        import('@/services/api').then(({ apiService }) => {
          apiService.delete(`/users/me/ploc/inventory/dices`).catch(err => {
            console.error("Erro ao consumir brinquedo no relacional:", err);
          });
        });
        get().syncWithBackend();
      },

      setToastItem: (toast) => set({ toastItem: toast }),

      syncWithBackend: async () => {
        const { apiService } = await import('@/services/api');
        const state = get();
        console.log("💾 [syncWithBackend] Syncing current inventory:", state.inventory);
        try {
          await apiService.put('/users/me/ploc', {
            plocState: {
              hunger: state.hunger,
              thirst: state.thirst,
              fatigue: state.fatigue,
              cold: state.cold,
              humor: state.humor,
              spoiledEatenCount: state.spoiledEatenCount,
              mood: state.mood,
              inventory: state.inventory,
              lastTickAt: state.lastTickAt
            }
          });
        } catch (error) {
          console.error("Erro ao sincronizar Ploc com o backend", error);
        }
      },

      loadFromBackend: (data: any) => {
        if (!data) return;
        
        // Garante que, se vier como string do banco/Prisma, seja parseado pra objeto
        let parsedData = data;
        if (typeof data === 'string') {
          try {
            parsedData = JSON.parse(data);
          } catch (e) {
            console.error('Erro ao fazer parse do plocState:', e);
            return;
          }
        }
        
        console.log("🔥 [plocStateStore] loadFromBackend RECEBEU parsedData.inventory:", parsedData.inventory);

        set({
          hunger: parsedData.hunger ?? 100,
          thirst: parsedData.thirst ?? 100,
          fatigue: parsedData.fatigue ?? 100,
          cold: parsedData.cold ?? 100,
          humor: parsedData.humor ?? parsedData.smoke ?? 100,
          spoiledEatenCount: parsedData.spoiledEatenCount ?? 0,
          mood: parsedData.mood ?? 'FELIZ',
          inventory: parsedData.inventory ?? [],
          lastTickAt: parsedData.lastTickAt ?? Date.now(),
        });
        // Roda um tick inicial para calcular offline decay imediato, mas SEM sincronizar de volta pro backend
        get().tick(true);
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
