import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomEquipment {
  id: string;
  name: string;
  image: string;
  description?: string;
  showAffiliateLink?: boolean;
  deletedAt?: number;
  preSelected?: boolean;
}

export interface CustomExercise {
  id: string;
  name: string;
  muscleGroups: string[];
  requiredEquipment: string[]; // typically just one, but kept as array for compatibility
  levels: { level: string; defaultSets: number; defaultReps: string; defaultWeight?: string }[];
  image?: string;
  imageType?: 'url' | 'icon' | 'none';
  modalities?: string[];
  locations?: string[];
  deletedAt?: number;
}

interface ExerciseDatabaseState {
  customEquipments: CustomEquipment[];
  customExercises: CustomExercise[];
  deletedStaticEquipments: Record<string, number>;
  deletedStaticExercises: Record<string, number>;
  preSelectedStaticEquipments: Record<string, boolean>;
  exerciseImageOverrides: Record<string, string>;
  exerciseModalityOverrides: Record<string, string[]>;
  exerciseLocationOverrides: Record<string, string[]>;
  equipmentImageOverrides: Record<string, string>;
  equipmentNameOverrides: Record<string, string>;
  equipmentDescriptionOverrides: Record<string, string>;
  equipmentAffiliateLinkOverrides: Record<string, boolean>;

  addCustomEquipment: (equipment: CustomEquipment) => void;
  removeCustomEquipment: (id: string) => void;
  restoreCustomEquipment: (id: string) => void;
  updateCustomEquipment: (id: string, updates: Partial<CustomEquipment>) => void;

  addCustomExercise: (exercise: CustomExercise) => void;
  removeCustomExercise: (id: string) => void;
  restoreCustomExercise: (id: string) => void;
  updateCustomExercise: (id: string, updates: Partial<CustomExercise>) => void;

  hideStaticEquipment: (id: string) => void;
  restoreStaticEquipment: (id: string) => void;
  hideStaticExercise: (id: string) => void;
  restoreStaticExercise: (id: string) => void;

  cleanupRecycleBin: () => void;
  
  setExerciseImage: (id: string, image: string) => void;
  setExerciseModalities: (id: string, modalities: string[]) => void;
  setExerciseLocations: (id: string, locations: string[]) => void;
  setEquipmentImage: (id: string, image: string) => void;
  setEquipmentName: (id: string, name: string) => void;
  setEquipmentDescription: (id: string, description: string) => void;
  setEquipmentAffiliateLink: (id: string, show: boolean) => void;
  setStaticEquipmentPreSelected: (id: string, preSelected: boolean) => void;
}

export const useExerciseDatabaseStore = create<ExerciseDatabaseState>()(
  persist(
    (set) => ({
      customEquipments: [],
      customExercises: [],
      deletedStaticEquipments: {},
      deletedStaticExercises: {},
      preSelectedStaticEquipments: {},
      exerciseImageOverrides: {},
      exerciseModalityOverrides: {},
      exerciseLocationOverrides: {},
      equipmentImageOverrides: {},
      equipmentNameOverrides: {},
      equipmentDescriptionOverrides: {},
      equipmentAffiliateLinkOverrides: {},

      addCustomEquipment: (eq) => set((state) => ({ customEquipments: [...state.customEquipments, eq] })),
      removeCustomEquipment: (id) => set((state) => {
        const eq = state.customEquipments.find(e => e.id === id);
        const eqName = eq ? eq.name : null;
        return {
          customEquipments: state.customEquipments.map(e => e.id === id ? { ...e, deletedAt: Date.now() } : e),
          // cascata: deleta exercícios que dependem exclusivamente dele
          customExercises: state.customExercises.map(ex => (eqName && ex.requiredEquipment.includes(eqName)) ? { ...ex, deletedAt: Date.now() } : ex)
        };
      }),
      restoreCustomEquipment: (id) => set((state) => ({
        customEquipments: state.customEquipments.map(e => e.id === id ? { ...e, deletedAt: undefined } : e)
      })),
      updateCustomEquipment: (id, updates) => set((state) => ({
        customEquipments: state.customEquipments.map(e => e.id === id ? { ...e, ...updates } : e)
      })),

      addCustomExercise: (ex) => set((state) => ({ customExercises: [...state.customExercises, ex] })),
      removeCustomExercise: (id) => set((state) => ({
        customExercises: state.customExercises.map(ex => ex.id === id ? { ...ex, deletedAt: Date.now() } : ex)
      })),
      restoreCustomExercise: (id) => set((state) => ({
        customExercises: state.customExercises.map(ex => ex.id === id ? { ...ex, deletedAt: undefined } : ex)
      })),
      updateCustomExercise: (id, updates) => set((state) => ({
        customExercises: state.customExercises.map(ex => ex.id === id ? { ...ex, ...updates } : ex)
      })),

      hideStaticEquipment: (id) => set((state) => {
        const oldDeleted = Array.isArray(state.deletedStaticEquipments) ? {} : state.deletedStaticEquipments;
        return {
          deletedStaticEquipments: { ...oldDeleted, [id]: Date.now() }
        };
      }),
      restoreStaticEquipment: (id) => set((state) => {
        const oldDeleted = Array.isArray(state.deletedStaticEquipments) ? {} : state.deletedStaticEquipments;
        const newDeleted = { ...oldDeleted };
        delete newDeleted[id];
        return { deletedStaticEquipments: newDeleted };
      }),
      hideStaticExercise: (id) => set((state) => {
        const oldDeleted = Array.isArray(state.deletedStaticExercises) ? {} : state.deletedStaticExercises;
        return {
          deletedStaticExercises: { ...oldDeleted, [id]: Date.now() }
        };
      }),
      restoreStaticExercise: (id) => set((state) => {
        const oldDeleted = Array.isArray(state.deletedStaticExercises) ? {} : state.deletedStaticExercises;
        const newDeleted = { ...oldDeleted };
        delete newDeleted[id];
        return { deletedStaticExercises: newDeleted };
      }),

      cleanupRecycleBin: () => set((state) => {
        const threshold = Date.now() - 30 * 24 * 60 * 60 * 1000;
        
        const newDeletedStaticEquips = Array.isArray(state.deletedStaticEquipments) ? {} : { ...state.deletedStaticEquipments };
        Object.keys(newDeletedStaticEquips).forEach(k => {
          if (newDeletedStaticEquips[k] < threshold) delete newDeletedStaticEquips[k];
        });

        const newDeletedStaticExercises = Array.isArray(state.deletedStaticExercises) ? {} : { ...state.deletedStaticExercises };
        Object.keys(newDeletedStaticExercises).forEach(k => {
          if (newDeletedStaticExercises[k] < threshold) delete newDeletedStaticExercises[k];
        });

        return {
          customEquipments: state.customEquipments.filter(e => !e.deletedAt || e.deletedAt >= threshold),
          customExercises: state.customExercises.filter(ex => !ex.deletedAt || ex.deletedAt >= threshold),
          deletedStaticEquipments: newDeletedStaticEquips,
          deletedStaticExercises: newDeletedStaticExercises
        };
      }),

      setExerciseImage: (id, image) => set((state) => {
        if (state.customExercises.some(ex => ex.id === id)) {
          return { customExercises: state.customExercises.map(ex => ex.id === id ? { ...ex, image } : ex) };
        }
        return { exerciseImageOverrides: { ...state.exerciseImageOverrides, [id]: image } };
      }),

      setExerciseModalities: (id, modalities) => set((state) => {
        if (state.customExercises.some(ex => ex.id === id)) {
          return { customExercises: state.customExercises.map(ex => ex.id === id ? { ...ex, modalities } : ex) };
        }
        return { exerciseModalityOverrides: { ...state.exerciseModalityOverrides, [id]: modalities } };
      }),

      setExerciseLocations: (id, locations) => set((state) => {
        if (state.customExercises.some(ex => ex.id === id)) {
          return { customExercises: state.customExercises.map(ex => ex.id === id ? { ...ex, locations } : ex) };
        }
        return { exerciseLocationOverrides: { ...state.exerciseLocationOverrides, [id]: locations } };
      }),

      setEquipmentImage: (id, image) => set((state) => {
        if (state.customEquipments.some(eq => eq.id === id)) {
          return { customEquipments: state.customEquipments.map(eq => eq.id === id ? { ...eq, image } : eq) };
        }
        return { equipmentImageOverrides: { ...state.equipmentImageOverrides, [id]: image } };
      }),

      setEquipmentName: (id, name) => set((state) => {
        if (state.customEquipments.some(eq => eq.id === id)) {
          const oldEq = state.customEquipments.find(eq => eq.id === id);
          if (!oldEq) return state;
          const oldName = oldEq.name;
          
          return { 
            customEquipments: state.customEquipments.map(eq => eq.id === id ? { ...eq, name } : eq),
            customExercises: state.customExercises.map(ex => {
              if (ex.requiredEquipment.includes(oldName)) {
                return {
                  ...ex,
                  requiredEquipment: ex.requiredEquipment.map(r => r === oldName ? name : r)
                };
              }
              return ex;
            })
          };
        }
        return { equipmentNameOverrides: { ...state.equipmentNameOverrides, [id]: name } };
      }),

      setEquipmentDescription: (id, description) => set((state) => {
        if (state.customEquipments.some(eq => eq.id === id)) {
          return { customEquipments: state.customEquipments.map(eq => eq.id === id ? { ...eq, description } : eq) };
        }
        return { equipmentDescriptionOverrides: { ...state.equipmentDescriptionOverrides, [id]: description } };
      }),

      setEquipmentAffiliateLink: (id, show) => set((state) => {
        if (state.customEquipments.some(eq => eq.id === id)) {
          return { customEquipments: state.customEquipments.map(eq => eq.id === id ? { ...eq, showAffiliateLink: show } : eq) };
        }
        return { equipmentAffiliateLinkOverrides: { ...state.equipmentAffiliateLinkOverrides, [id]: show } };
      }),
      
      setStaticEquipmentPreSelected: (id, preSelected) => set((state) => ({
        preSelectedStaticEquipments: { ...state.preSelectedStaticEquipments, [id]: preSelected }
      })),
    }),
    {
      name: 'ploc-exercise-database-storage',
    }
  )
);
