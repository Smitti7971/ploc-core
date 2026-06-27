import { ExerciseDefinition, useFitnessProfileStore } from '../store/useFitnessProfileStore';
import { useExerciseDatabaseStore } from '../store/useExerciseDatabaseStore';

// Exercise Database
interface ExerciseDBItem {
  id: string;
  name: string;
  muscleGroups: string[]; // e.g. 'chest', 'back'
  requiredEquipment: string[]; // e.g. 'Halteres', 'Barra'. Empty means bodyweight.
  levels: { level: string; defaultSets: number; defaultReps: string; defaultWeight?: string }[];
  image?: string;
  imageType?: 'url' | 'icon' | 'none';
  modalities?: string[];
  locations?: string[];
}

export const exerciseDatabase: ExerciseDBItem[] = [
  // Chest
  { id: 'chest-1', name: 'Supino Inclinado com Halteres', muscleGroups: ['chest', 'shoulders'], requiredEquipment: ['Halteres', 'Banco inclinado'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '10-12' }
  ], modalities: ['musculacao', 'crossfit'], locations: ['academia', 'casa'] },
  { id: 'chest-2', name: 'Supino Reto com Barra', muscleGroups: ['chest', 'triceps'], requiredEquipment: ['Barra olímpica', 'Banco reto'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '8-10' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '8-10' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '8-10' }
  ], modalities: ['musculacao', 'crossfit'], locations: ['academia'] },
  { id: 'chest-3', name: 'Push ups (Flexão de braços)', muscleGroups: ['chest', 'triceps'], requiredEquipment: [], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: 'Até a falha' },
    { level: 'Moderado', defaultSets: 3, defaultReps: 'Até a falha' },
    { level: 'Avançado', defaultSets: 3, defaultReps: 'Até a falha' }
  ], modalities: ['calistenia', 'musculacao', 'crossfit', 'cardio'], locations: ['academia', 'casa', 'ar_livre'] },
  { id: 'chest-4', name: 'Peck Deck (Voador)', muscleGroups: ['chest'], requiredEquipment: ['Peck Deck'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '12-15' }
  ], modalities: ['musculacao'], locations: ['academia'] },
  { id: 'chest-5', name: 'Crossover Polia Alta', muscleGroups: ['chest'], requiredEquipment: ['Crossover'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '12-15' }
  ], modalities: ['musculacao', 'crossfit'], locations: ['academia'] },
  { id: 'chest-6', name: 'Supino Máquina', muscleGroups: ['chest'], requiredEquipment: ['Chest Press'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '10-12' }
  ], modalities: ['musculacao'], locations: ['academia'] },

  // Back
  { id: 'back-1', name: 'Remada Curvada com Halteres', muscleGroups: ['back', 'biceps'], requiredEquipment: ['Halteres'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '10-12' }
  ], modalities: ['musculacao', 'crossfit'], locations: ['academia', 'casa'] },
  { id: 'back-2', name: 'Puxador Frontal', muscleGroups: ['back', 'biceps'], requiredEquipment: ['Puxador Frontal'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '10-12' }
  ], modalities: ['musculacao'], locations: ['academia'] },
  { id: 'back-3', name: 'Barra Fixa (Pull up)', muscleGroups: ['back', 'biceps'], requiredEquipment: ['Barra fixa'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: 'Até a falha' },
    { level: 'Moderado', defaultSets: 3, defaultReps: 'Até a falha' },
    { level: 'Avançado', defaultSets: 3, defaultReps: 'Até a falha' }
  ], modalities: ['calistenia', 'musculacao', 'crossfit'], locations: ['academia', 'casa', 'ar_livre'] },
  { id: 'back-4', name: 'Remada Baixa', muscleGroups: ['back'], requiredEquipment: ['Remada Baixa'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '12-15' }
  ], modalities: ['musculacao'], locations: ['academia'] },
  { id: 'back-5', name: 'Remada Serrote', muscleGroups: ['back', 'biceps'], requiredEquipment: ['Halteres', 'Banco reto'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '10-12' }
  ], modalities: ['musculacao', 'crossfit'], locations: ['academia', 'casa'] },

  // Shoulders
  { id: 'sh-1', name: 'Desenvolvimento com Halteres', muscleGroups: ['shoulders', 'triceps'], requiredEquipment: ['Halteres'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '10-12' }
  ], modalities: ['musculacao', 'crossfit'], locations: ['academia', 'casa'] },
  { id: 'sh-2', name: 'Elevação Lateral com Halteres', muscleGroups: ['shoulders'], requiredEquipment: ['Halteres'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '12-15' }
  ], modalities: ['musculacao', 'crossfit'], locations: ['academia', 'casa'] },
  { id: 'sh-3', name: 'Desenvolvimento Articulado', muscleGroups: ['shoulders', 'triceps'], requiredEquipment: ['Desenvolvimento Articulado'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '10-12' }
  ], modalities: ['musculacao'], locations: ['academia'] },
  { id: 'sh-4', name: 'Reverse Fly com Halteres', muscleGroups: ['shoulders', 'back'], requiredEquipment: ['Halteres'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '12-15' }
  ], modalities: ['musculacao'], locations: ['academia', 'casa'] },
  { id: 'sh-5', name: 'Flexão Pike', muscleGroups: ['shoulders', 'triceps'], requiredEquipment: [], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: 'Até a falha' },
    { level: 'Moderado', defaultSets: 3, defaultReps: 'Até a falha' },
    { level: 'Avançado', defaultSets: 3, defaultReps: 'Até a falha' }
  ], modalities: ['calistenia', 'musculacao', 'crossfit'], locations: ['academia', 'casa', 'ar_livre'] },

  // Biceps
  { id: 'bi-1', name: 'Rosca Direta com Barra', muscleGroups: ['biceps'], requiredEquipment: ['Barra reta'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '10-12' }
  ], modalities: ['musculacao', 'crossfit'], locations: ['academia', 'casa'] },
  { id: 'bi-2', name: 'Rosca Alternada com Halteres', muscleGroups: ['biceps'], requiredEquipment: ['Halteres'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '10-12' }
  ], modalities: ['musculacao'], locations: ['academia', 'casa'] },
  { id: 'bi-3', name: 'Rosca Scott', muscleGroups: ['biceps'], requiredEquipment: ['Rosca Scott Máquina'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '10-12' }
  ], modalities: ['musculacao'], locations: ['academia'] },
  { id: 'bi-4', name: 'Rosca Martelo', muscleGroups: ['biceps'], requiredEquipment: ['Halteres'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '12-15' }
  ], modalities: ['musculacao', 'crossfit'], locations: ['academia', 'casa'] },

  // Triceps
  { id: 'tri-1', name: 'Tríceps Polia Alta', muscleGroups: ['triceps'], requiredEquipment: ['Polia Alta'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '12-15' }
  ], modalities: ['musculacao'], locations: ['academia'] },
  { id: 'tri-2', name: 'Tríceps Testa com Halteres', muscleGroups: ['triceps'], requiredEquipment: ['Halteres', 'Banco reto'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '10-12' }
  ], modalities: ['musculacao'], locations: ['academia', 'casa'] },
  { id: 'tri-3', name: 'Tríceps Mergulho (Dips)', muscleGroups: ['triceps', 'chest'], requiredEquipment: ['Paralelas'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: 'Até a falha' },
    { level: 'Moderado', defaultSets: 3, defaultReps: 'Até a falha' },
    { level: 'Avançado', defaultSets: 3, defaultReps: 'Até a falha' }
  ], modalities: ['calistenia', 'musculacao', 'crossfit'], locations: ['academia', 'ar_livre'] },
  { id: 'tri-4', name: 'Tríceps Banco', muscleGroups: ['triceps'], requiredEquipment: ['Banco reto'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '12-15' }
  ], modalities: ['calistenia', 'musculacao'], locations: ['academia', 'casa', 'ar_livre'] },

  // Legs (Quadriceps, Hamstrings, Glutes, Calves)
  { id: 'leg-1', name: 'Agachamento Livre', muscleGroups: ['quadriceps', 'glutes'], requiredEquipment: ['Barra olímpica'], levels: [
    { level: 'Leve', defaultSets: 4, defaultReps: '8-10' },
    { level: 'Moderado', defaultSets: 4, defaultReps: '8-10' },
    { level: 'Avançado', defaultSets: 4, defaultReps: '8-10' }
  ], modalities: ['musculacao', 'crossfit'], locations: ['academia'] },
  { id: 'leg-2', name: 'Agachamento com Halteres (Cálice)', muscleGroups: ['quadriceps', 'glutes'], requiredEquipment: ['Halteres'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '10-12' }
  ], modalities: ['musculacao', 'crossfit'], locations: ['academia', 'casa'] },
  { id: 'leg-3', name: 'Agachamento Corporal', muscleGroups: ['quadriceps', 'glutes'], requiredEquipment: [], levels: [
    { level: 'Leve', defaultSets: 4, defaultReps: '15-20' },
    { level: 'Moderado', defaultSets: 4, defaultReps: '15-20' },
    { level: 'Avançado', defaultSets: 4, defaultReps: '15-20' }
  ], modalities: ['calistenia', 'musculacao', 'crossfit', 'cardio'], locations: ['academia', 'casa', 'ar_livre'] },
  { id: 'leg-4', name: 'Leg Press 45', muscleGroups: ['quadriceps', 'glutes'], requiredEquipment: ['Leg Press'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '10-12' }
  ], modalities: ['musculacao'], locations: ['academia'] },
  { id: 'leg-5', name: 'Cadeira Extensora', muscleGroups: ['quadriceps'], requiredEquipment: ['Cadeira Extensora'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '12-15' }
  ], modalities: ['musculacao'], locations: ['academia'] },
  { id: 'leg-6', name: 'Mesa Flexora', muscleGroups: ['hamstrings'], requiredEquipment: ['Mesa Flexora'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '10-12' }
  ], modalities: ['musculacao'], locations: ['academia'] },
  { id: 'leg-7', name: 'Cadeira Flexora', muscleGroups: ['hamstrings'], requiredEquipment: ['Cadeira Flexora'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '10-12' }
  ], modalities: ['musculacao'], locations: ['academia'] },
  { id: 'leg-8', name: 'Stiff com Halteres', muscleGroups: ['hamstrings', 'glutes'], requiredEquipment: ['Halteres'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '10-12' }
  ], modalities: ['musculacao', 'crossfit'], locations: ['academia', 'casa'] },
  { id: 'leg-9', name: 'Elevação Pélvica', muscleGroups: ['glutes'], requiredEquipment: ['Barra', 'Banco reto'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-12' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '10-12' }
  ], modalities: ['musculacao'], locations: ['academia'] },
  { id: 'leg-10', name: 'Panturrilha em Pé', muscleGroups: ['calves'], requiredEquipment: ['Panturrilha em Pé'], levels: [
    { level: 'Leve', defaultSets: 4, defaultReps: '15-20' },
    { level: 'Moderado', defaultSets: 4, defaultReps: '15-20' },
    { level: 'Avançado', defaultSets: 4, defaultReps: '15-20' }
  ], modalities: ['musculacao'], locations: ['academia'] },
  { id: 'leg-11', name: 'Panturrilha Livre Degrau', muscleGroups: ['calves'], requiredEquipment: [], levels: [
    { level: 'Leve', defaultSets: 4, defaultReps: '15-20' },
    { level: 'Moderado', defaultSets: 4, defaultReps: '15-20' },
    { level: 'Avançado', defaultSets: 4, defaultReps: '15-20' }
  ], modalities: ['calistenia', 'musculacao', 'crossfit'], locations: ['academia', 'casa', 'ar_livre'] },

  // Core
  { id: 'core-1', name: 'Crunch Abdominal', muscleGroups: ['abs'], requiredEquipment: ['Colchonete'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '15-20' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '15-20' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '15-20' }
  ], modalities: ['calistenia', 'musculacao', 'crossfit'], locations: ['academia', 'casa', 'ar_livre'] },
  { id: 'core-2', name: 'Máquina Abdominal', muscleGroups: ['abs'], requiredEquipment: ['Máquina Abdominal'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '12-15' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '12-15' }
  ], modalities: ['musculacao'], locations: ['academia'] },
  { id: 'core-3', name: 'Prancha Isométrica', muscleGroups: ['abs'], requiredEquipment: ['Colchonete'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '45-60 seg' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '45-60 seg' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '45-60 seg' }
  ], modalities: ['calistenia', 'musculacao', 'crossfit'], locations: ['academia', 'casa', 'ar_livre'] },
  { id: 'core-4', name: 'Elevação de Pernas', muscleGroups: ['abs'], requiredEquipment: ['Barra fixa'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '10-15' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-15' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '10-15' }
  ], modalities: ['calistenia', 'musculacao', 'crossfit'], locations: ['academia', 'ar_livre'] },
  { id: 'core-5', name: 'Extensão Lombar (Superman)', muscleGroups: ['lombar'], requiredEquipment: ['Colchonete'], levels: [
    { level: 'Leve', defaultSets: 3, defaultReps: '15-20' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '15-20' },
    { level: 'Avançado', defaultSets: 3, defaultReps: '15-20' }
  ], modalities: ['calistenia', 'musculacao'], locations: ['academia', 'casa', 'ar_livre'] },
];

export function hasConsecutiveDays(activeDays: string[]) {
  if (activeDays.length === 0) return false;

  const weekDayMap: Record<string, number> = { dom: 0, seg: 1, ter: 2, qua: 3, qui: 4, sex: 5, sab: 6 };
  const sortedDays = activeDays.map(d => weekDayMap[d]).sort((a, b) => a - b);
  
  for (let i = 0; i < sortedDays.length; i++) {
    const current = sortedDays[i];
    const next = sortedDays[(i + 1) % sortedDays.length];
    if (next === current + 1 || (current === 6 && next === 0)) {
      return true;
    }
  }
  return false;
}

export function determineRecommendedSplit(activeDays: string[]) {
  const numDays = activeDays.length;
  if (numDays === 0) return 'FullBody';

  const hasConsecutive = hasConsecutiveDays(activeDays);

  // Se NÃO tem dias consecutivos, o descanso de 48h é garantido na semana. FullBody é o Rei.
  if (!hasConsecutive) {
    if (numDays >= 4) return 'AB'; // Pra 4 dias FullBody fica mt longo, AB é melhor
    return 'FullBody';
  }

  // Se tem dias consecutivos, precisamos dividir para o músculo descansar
  if (numDays <= 2) return 'AB';
  if (numDays === 3) return 'ABC'; // Proteção contra 3 dias seguidos (ex: Sex, Sab, Dom)
  if (numDays === 4) return 'ABCD';
  return 'ABCDE'; // 5+ dias
}

export const getCombinedExercises = () => {
  const { customExercises, deletedStaticExercises, exerciseImageOverrides, exerciseModalityOverrides, exerciseLocationOverrides } = useExerciseDatabaseStore.getState();
  const customExs = customExercises
    .filter(ex => !ex.deletedAt)
    .map(ex => ({
    id: ex.id,
    name: ex.name,
    muscleGroups: ex.muscleGroups,
    requiredEquipment: ex.requiredEquipment,
    levels: ex.levels,
    image: ex.image,
    imageType: ex.imageType || 'url',
    modalities: ex.modalities || ['musculacao'],
    locations: ex.locations || ['academia']
  }));
  
  // Filter out deleted static exercises and apply overrides
  const activeStatic = exerciseDatabase
    .filter(ex => {
      const oldArr = Array.isArray(deletedStaticExercises) ? deletedStaticExercises : [];
      const isDeletedObj = !Array.isArray(deletedStaticExercises) && !!(deletedStaticExercises as Record<string, number>)[ex.id];
      return !oldArr.includes(ex.id as never) && !isDeletedObj;
    })
    .map(ex => ({
      ...ex,
      image: exerciseImageOverrides[ex.id] || ex.image,
      imageType: ex.imageType || 'url',
      modalities: exerciseModalityOverrides[ex.id] || ex.modalities || ['musculacao'],
      locations: exerciseLocationOverrides[ex.id] || ex.locations || ['academia']
    }));
  
  return [...activeStatic, ...customExs];
};

export function generateWorkoutPlan(
  activeDays: string[],
  availableEquipment: string[],
  intensityLevel: string,
  modality: string,
  selectedExercises: string[] = [],
  splitType?: string
) {
  const isDiscover = intensityLevel === 'descobrir';

  // Helper to match equipment
  const hasEquipment = (reqEq: string[]) => {
    if (reqEq.length === 0) return true; // Bodyweight
    // If availableEquipment includes ALL of the required ones, or at least one main one?
    // Let's say it must have at least one of the required ones for simplicity.
    return reqEq.every(eq => availableEquipment.includes(eq));
  };

  const filterByMuscle = (muscles: string[]) => {
    return getCombinedExercises()
      .filter(ex => ex.muscleGroups.some(m => muscles.includes(m)))
      .filter(ex => hasEquipment(ex.requiredEquipment));
  };

  const { workoutGenerationQueues, setWorkoutGenerationQueues } = useFitnessProfileStore.getState();
  const persistedQueues = { ...workoutGenerationQueues };

  // Fila global de exercícios para manter o ciclo de 1 mês
  const globalMuscleQueues = new Map<string, any[]>();

  const getQueueForMuscle = (muscle: string) => {
    if (!globalMuscleQueues.has(muscle)) {
      // Se houver no store, hidratamos
      if (persistedQueues[muscle] && persistedQueues[muscle].length > 0) {
         // Converte IDs de volta para objetos
         const objs = persistedQueues[muscle]
            .map(id => getCombinedExercises().find(ex => ex.id === id))
            .filter(Boolean);
         // Caso todos os IDs fossem válidos e houvesse objetos, usamos a fila persistida
         if (objs.length > 0) {
            globalMuscleQueues.set(muscle, objs);
            return globalMuscleQueues.get(muscle)!;
         }
      }

      // Caso contrário, gera uma nova fila embaralhada
      const available = filterByMuscle([muscle]);
      const manualSelected = available.filter(ex => selectedExercises.includes(ex.id));
      const unselectedAvailable = available.filter(ex => !selectedExercises.includes(ex.id));
      const shuffled = [...unselectedAvailable].sort(() => 0.5 - Math.random());
      
      // A fila começa com os selecionados pelo usuário, seguidos pelos outros embaralhados
      globalMuscleQueues.set(muscle, [...manualSelected, ...shuffled]);
    }
    return globalMuscleQueues.get(muscle)!;
  };

  const pickExercises = (muscles: string[], countPerMuscle: number = 2) => {
    const picked: any[] = [];

    muscles.forEach(muscle => {
      const queue = getQueueForMuscle(muscle);
      let pickedForMuscle = 0;
      
      while (pickedForMuscle < countPerMuscle) {
        if (queue.length === 0) break; // Sem exercícios para este músculo
        
        const ex = queue.shift();
        if (ex) {
          // Volta o exercício para o final da fila para um ciclo infinito
          queue.push(ex);
          
          // Find the user's selected intensity level inside the exercise's levels
          const lvlObj = ex.levels?.find((l: any) => l.level.toLowerCase() === intensityLevel.toLowerCase()) || ex.levels?.[0];
          
          picked.push({
            id: `${ex.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: ex.name,
            sets: isDiscover ? 1 : (lvlObj?.defaultSets || 3),
            reps: isDiscover ? 'Até a falha' : (lvlObj?.defaultReps || '10-12'),
            weight: lvlObj?.defaultWeight || 'Moderada',
            muscleGroups: ex.muscleGroups,
            equipment: ex.requiredEquipment.length > 0 ? ex.requiredEquipment[0] : 'Colchonete',
            image: ex.image,
            imageType: ex.imageType
          });
          pickedForMuscle++;
        }
      }
      
      // Fallback para peso corporal caso a fila esteja vazia
      if (pickedForMuscle === 0) {
        const fallbackFb = getCombinedExercises()
          .filter(ex => ex.muscleGroups.includes(muscle) && ex.requiredEquipment.length === 0);
        
        if (fallbackFb.length > 0) {
          const ex = fallbackFb[0];
          const lvlObjFb = ex.levels?.find((l: any) => l.level.toLowerCase() === intensityLevel.toLowerCase()) || ex.levels?.[0];
          picked.push({
            id: `${ex.id}-fallback-${Date.now()}`,
            name: ex.name,
            sets: isDiscover ? 1 : (lvlObjFb?.defaultSets || 3),
            reps: isDiscover ? 'Até a falha' : (lvlObjFb?.defaultReps || '10-12'),
            weight: lvlObjFb?.defaultWeight || 'Moderada',
            muscleGroups: ex.muscleGroups,
            equipment: 'Colchonete',
            image: ex.image,
            imageType: ex.imageType
          });
        }
      }
    });

    return picked;
  };

  // Determine split strategy based on days count and consecutive days
  const numDays = activeDays.length;
  let chosenSplit = splitType;
  if (!chosenSplit) {
    chosenSplit = determineRecommendedSplit(activeDays);
  }

  let splitsMuscles: string[][] = [];
  let splitNames: ('A'|'B'|'C'|'D'|'E'|'Full')[] = [];

  if (chosenSplit === 'FullBody') {
    splitsMuscles = [['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quadriceps', 'glutes', 'hamstrings', 'calves', 'abs', 'lombar']];
    splitNames = ['Full'];
  } else if (chosenSplit === 'AB') {
    splitsMuscles = [
      ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
      ['quadriceps', 'glutes', 'hamstrings', 'calves', 'abs', 'lombar']
    ];
    splitNames = ['A', 'B'];
  } else if (chosenSplit === 'ABC') {
    splitsMuscles = [
      ['chest', 'shoulders', 'triceps'],
      ['back', 'biceps', 'abs', 'lombar'],
      ['quadriceps', 'glutes', 'hamstrings', 'calves']
    ];
    splitNames = ['A', 'B', 'C'];
  } else if (chosenSplit === 'ABCD') {
    splitsMuscles = [
      ['chest', 'triceps'],
      ['back', 'biceps'],
      ['quadriceps', 'glutes', 'hamstrings', 'calves'],
      ['shoulders', 'abs', 'lombar']
    ];
    splitNames = ['A', 'B', 'C', 'D'];
  } else if (chosenSplit === 'ABCDE') {
    splitsMuscles = [
      ['chest'],
      ['back', 'lombar'],
      ['quadriceps', 'glutes', 'hamstrings', 'calves'],
      ['shoulders', 'abs'],
      ['biceps', 'triceps']
    ];
    splitNames = ['A', 'B', 'C', 'D', 'E'];
  } else {
    // fallback
    splitsMuscles = [['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quadriceps', 'glutes', 'hamstrings', 'calves', 'abs', 'lombar']];
    splitNames = ['Full'];
  }

  // Identificar os índices reais dos dias da semana selecionados (0 a 6)
  const daysOfWeek = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const activeIndices = activeDays.map(d => daysOfWeek.indexOf(d.toLowerCase())).filter(i => i !== -1);
  if (activeIndices.length === 0) activeIndices.push(1, 3, 5); // fallback para seg, qua, sex
  activeIndices.sort((a, b) => a - b);

  const exercisesTimeline: any[] = [];
  
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Projeção de 1 mês (4 semanas)
  const totalSessions = numDays * 4;
  let sessionCount = 0;
  let splitIndex = 0;
  let safetyCounter = 0;

  // Gerar o calendário caminhando dia a dia a partir de hoje
  while (sessionCount < totalSessions && safetyCounter < 100) {
    const currentDayIndex = currentDate.getDay();
    
    // Se o dia atual for um dia de treino
    if (activeIndices.includes(currentDayIndex)) {
      const splitMuscles = splitsMuscles[splitIndex % splitsMuscles.length];
      const splitGroup = splitNames[splitIndex % splitNames.length];
      const dayNameStr = daysOfWeek[currentDayIndex].charAt(0).toUpperCase() + daysOfWeek[currentDayIndex].slice(1);
      
      // Conta dinâmica para manter ~5-6 exercícios totais por treino
      const countPerMuscle = Math.max(1, Math.round(6 / splitMuscles.length));
      
      let items = pickExercises(splitMuscles, countPerMuscle);

      // Fallback final
      if (items.length === 0) {
        items = [
          {
            id: `fallback-cardio-${sessionCount}`,
            name: `Caminhada / Corrida (Cardio)`,
            sets: 1,
            reps: '20-30 min',
            muscleGroups: ['cardio']
          }
        ];
      }

      exercisesTimeline.push({
        type: 'circuit' as const,
        name: `${dayNameStr} - ${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`,
        splitGroup: splitGroup,
        timestamp: currentDate.getTime(),
        rounds: 1,
        items: items
      });
      
      splitIndex++;
      sessionCount++;
    }
    
    // Avança 1 dia
    currentDate.setDate(currentDate.getDate() + 1);
    safetyCounter++;
  }

  // Persistir a nova ordem das filas no store
  const newQueues: Record<string, string[]> = { ...persistedQueues };
  globalMuscleQueues.forEach((queue, muscle) => {
     newQueues[muscle] = queue.map(ex => ex.id);
  });
  setWorkoutGenerationQueues(newQueues);

  return exercisesTimeline;
}
