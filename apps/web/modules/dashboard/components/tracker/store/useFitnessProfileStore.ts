import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '@/services/api';

export interface Biometrics {
  sex?: 'masculino' | 'feminino' | 'outro';
  age?: number | null;
  height?: number | null; // cm
  weight?: number | null; // kg
  targetWeight?: number | null; // kg
  bodyFatPercentage?: number | null;
  muscleMass?: number | null;
  leanMass?: number | null;
  measurements?: {
    chest?: number | null;
    waist?: number | null;
    hips?: number | null;
    arms?: number | null;
    thighs?: number | null;
    calves?: number | null;
  };
}

export interface FitnessGoals {
  primaryObjective?: 'emagrecer' | 'hipertrofia' | 'saude' | 'forca';
  secondaryObjectives?: string[];
  numericTargets?: Record<string, number>;
  targetDate?: number; // Timestamp
}

export interface TrainingPreferences {
  experienceLevel?: 'iniciante' | 'intermediario' | 'avancado';
  desiredWeeklyFrequency?: number;
  availableTimeMinutes?: number;
  trainingLocation?: 'academia' | 'casa' | 'rua' | 'outro';
  availableEquipment?: string[];
}

export interface PhysicalLimitations {
  injuries?: string[];
  physicalLimitations?: string[];
  forbiddenExercises?: string[];
  medicalRestrictions?: string[];
}

export interface DailyState {
  timestamp: number; // Quando o check-in foi feito
  energy: number; // 1-5
  sleepQuality: number; // 1-5
  mood: number; // 1-5
  stressLevel: number; // 1-5
  musclePain: number; // 1-5
  readinessToTrain: number; // 1-5
}

export interface WorkoutHistorySummary {
  totalWorkoutsCompleted: number;
  lastWorkoutTimestamp?: number;
  consecutiveDaysWithoutTraining: number;
}

export interface MuscleRecovery {
  muscleId: string; // ex: 'abs', 'chest', 'back', 'biceps', 'quadriceps', 'glutes'
  name: string;
  recoveryPercentage: number; // 0 a 100
  lastWorkedTimestamp?: number;
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  sets: number;
  reps: string; // ex: "10 REPS" ou "8-12 REPS"
  weight?: string; // ex: "Leve", "Moderada", "Pesada" ou "20kg"
  muscleGroups: string[];
  equipment?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  exercises: {
    type: 'single' | 'circuit' | 'superset';
    name?: string; // para circuitos
    splitGroup?: 'A' | 'B' | 'C' | 'Full'; // Para colorir a timeline
    timestamp?: number; // Para mostrar Hoje, Amanha, etc
    rounds?: number;
    items: ExerciseDefinition[];
  }[];
}

export interface ExerciseSetLog {
  weight: string;
  reps: string;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  timestamp: number;
  sets: ExerciseSetLog[];
  comment: string;
}

export interface FitnessProfileState {
  hasCompletedOnboarding: boolean;
  biometrics: Biometrics;
  goals: FitnessGoals;
  preferences: TrainingPreferences;
  limitations: PhysicalLimitations;
  dailyStates: DailyState[];
  workoutHistory: WorkoutHistorySummary;
  muscleRecovery: Record<string, MuscleRecovery>;
  currentWorkoutPlan: WorkoutPlan | null;
  exerciseLogs: Record<string, ExerciseLog>; // key is exerciseId
  workoutGenerationQueues: Record<string, string[]>;

  // Actions
  setHasCompletedOnboarding: (val: boolean) => void;
  updateBiometrics: (data: Partial<Biometrics>) => void;
  updateGoals: (data: Partial<FitnessGoals>) => void;
  updatePreferences: (data: Partial<TrainingPreferences>) => void;
  updateLimitations: (data: Partial<PhysicalLimitations>) => void;
  logDailyState: (state: Omit<DailyState, 'timestamp'>) => void;
  incrementWorkout: () => void;
  updateMuscleRecovery: (muscles: MuscleRecovery[]) => void;
  setCurrentWorkoutPlan: (plan: WorkoutPlan | null) => void;
  saveExerciseLog: (exerciseId: string, log: Omit<ExerciseLog, 'exerciseId' | 'timestamp'>) => void;
  setWorkoutGenerationQueues: (queues: Record<string, string[]>) => void;
  
  syncWithDatabase: () => Promise<void>;
  saveToDatabase: () => Promise<void>;
}

export const useFitnessProfileStore = create<FitnessProfileState>()(
  persist(
    (set, get) => ({
      hasCompletedOnboarding: false,
      biometrics: {},
      goals: {},
      preferences: {},
      limitations: {},
      dailyStates: [],
      workoutHistory: {
        totalWorkoutsCompleted: 0,
        consecutiveDaysWithoutTraining: 0,
      },
      muscleRecovery: {
        abs: { muscleId: 'abs', name: 'Abdômen', recoveryPercentage: 0, lastWorkedOut: Date.now() - 86400000 * 2 },
        chest: { muscleId: 'chest', name: 'Peito', recoveryPercentage: 0, lastWorkedOut: Date.now() - 86400000 * 3 },
        back: { muscleId: 'back', name: 'Costas', recoveryPercentage: 0, lastWorkedOut: Date.now() - 86400000 },
        biceps: { muscleId: 'biceps', name: 'Bíceps', recoveryPercentage: 0, lastWorkedOut: Date.now() - 86400000 * 4 },
        quadriceps: { muscleId: 'quadriceps', name: 'Quadríceps', recoveryPercentage: 0, lastWorkedOut: Date.now() - 86400000 * 5 },
        glutes: { muscleId: 'glutes', name: 'Glúteos', recoveryPercentage: 0, lastWorkedOut: Date.now() - 86400000 * 5 },
        hamstrings: { muscleId: 'hamstrings', name: 'Posteriores', recoveryPercentage: 0, lastWorkedOut: Date.now() - 86400000 * 5 },
        shoulders: { muscleId: 'shoulders', name: 'Ombros', recoveryPercentage: 0, lastWorkedOut: Date.now() - 86400000 * 2 },
        triceps: { muscleId: 'triceps', name: 'Tríceps', recoveryPercentage: 0, lastWorkedOut: Date.now() - 86400000 * 3 },
      },
      currentWorkoutPlan: null,
      exerciseLogs: {},
      workoutGenerationQueues: {},

      setHasCompletedOnboarding: (val) => set({ hasCompletedOnboarding: val }),

      updateBiometrics: (data) => set((state) => ({ 
        biometrics: { ...state.biometrics, ...data } 
      })),

      updateGoals: (data) => set((state) => ({ 
        goals: { ...state.goals, ...data } 
      })),

      updatePreferences: (data) => set((state) => ({ 
        preferences: { ...state.preferences, ...data } 
      })),

      updateLimitations: (data) => set((state) => ({ 
        limitations: { ...state.limitations, ...data } 
      })),

      logDailyState: (data) => set((state) => {
        const newState: DailyState = { ...data, timestamp: Date.now() };
        return {
          // Mantém um histórico limitado dos últimos 30 dias (exemplo simples: retém 30 itens se logar 1 por dia)
          dailyStates: [...state.dailyStates, newState].slice(-30)
        };
      }),

      incrementWorkout: () => set((state) => ({
        workoutHistory: {
          ...state.workoutHistory,
          totalWorkoutsCompleted: state.workoutHistory.totalWorkoutsCompleted + 1,
          lastWorkoutTimestamp: Date.now(),
          consecutiveDaysWithoutTraining: 0,
        }
      })),

      saveExerciseLog: (exerciseId, log) => {
        set((state) => ({
          exerciseLogs: {
            ...state.exerciseLogs,
            [exerciseId]: {
              exerciseId,
              timestamp: Date.now(),
              ...log
            }
          }
        }));
      },

      updateMuscleRecovery: (muscles) => {set((state) => {
        const newMap = { ...state.muscleRecovery };
        muscles.forEach(m => {
          newMap[m.muscleId] = { ...newMap[m.muscleId], ...m };
        });
        return { muscleRecovery: newMap };
      })},

      setCurrentWorkoutPlan: (plan) => set({ currentWorkoutPlan: plan }),

      setWorkoutGenerationQueues: (queues) => set({ workoutGenerationQueues: queues }),

      syncWithDatabase: async () => {
        try {
          const res = await apiService.get<{ success: boolean; profile: any }>('/fitness-profile');
          if (res.success && res.profile) {
            const p = res.profile;
            set({
              hasCompletedOnboarding: p.hasCompletedOnboarding || false,
              biometrics: {
                sex: p.gender,
                age: p.age,
                height: p.height,
                weight: p.weight,
                targetWeight: p.targetWeight,
                bodyFatPercentage: p.bodyFatPercentage,
                muscleMass: p.muscleMass,
                leanMass: p.leanMass,
                measurements: p.measurements || {}
              },
              goals: {
                primaryObjective: p.primaryObjective,
                secondaryObjectives: p.secondaryObjectives || [],
                numericTargets: p.numericTargets || {}
              },
              preferences: {
                experienceLevel: p.experienceLevel,
                desiredWeeklyFrequency: p.desiredFrequency,
                availableTimeMinutes: p.availableTime,
                trainingLocation: p.trainingLocation,
                availableEquipment: p.availableEquipment || []
              },
              limitations: {
                injuries: p.injuries || [],
                physicalLimitations: p.physicalLimitations || [],
                forbiddenExercises: p.forbiddenExercises || [],
                medicalRestrictions: p.medicalRestrictions || []
              }
            });
          }
        } catch (error) {
          console.error('Falha ao sincronizar fitness profile do banco:', error);
        }
      },

      saveToDatabase: async () => {
        try {
          const state = get();
          await apiService.put('/fitness-profile', {
            biometrics: state.biometrics,
            goals: state.goals,
            preferences: state.preferences,
            limitations: state.limitations,
            hasCompletedOnboarding: state.hasCompletedOnboarding
          });
        } catch (error) {
          console.error('Falha ao salvar fitness profile no banco:', error);
        }
      }
    }),
    {
      name: 'ploc-fitness-profile-storage',
    }
  )
);
