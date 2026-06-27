import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFitnessProfileStore, ExerciseDefinition } from '../store/useFitnessProfileStore';
import { useTrackerStore } from '../store/trackerStore';
import { Link, Dumbbell, MoreHorizontal, Plus, Trash2, Edit3, Shield, Layers, Activity, Target, Zap, Flame, CheckCircle2 } from 'lucide-react';
import { CreateWorkoutModal } from './CreateWorkoutModal';
import { generateWorkoutPlan } from '../utils/workoutGenerator';
import { ExerciseLogModal } from './ExerciseLogModal';


interface WorkoutTimelineProps {
  itemId?: string;
}

export function WorkoutTimeline({ itemId }: WorkoutTimelineProps) {
  const currentWorkoutPlan = useFitnessProfileStore(state => state.currentWorkoutPlan);
  const exerciseLogs = useFitnessProfileStore(state => state.exerciseLogs);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeExercise, setActiveExercise] = useState<ExerciseDefinition | null>(null);

  const setCurrentWorkoutPlan = useFitnessProfileStore(state => state.setCurrentWorkoutPlan);
  const updatePreferences = useFitnessProfileStore(state => state.updatePreferences);
  const saveExerciseLog = useFitnessProfileStore(state => state.saveExerciseLog);
  const incrementWorkout = useFitnessProfileStore(state => state.incrementWorkout);
  const { addLog } = useTrackerStore();

  const getMuscleIcon = (muscles: string[], defaultColor: string) => {
    if (muscles.includes('chest')) return <Shield size={16} className={defaultColor} />;
    if (muscles.includes('back')) return <Layers size={16} className={defaultColor} />;
    if (muscles.includes('shoulders')) return <Target size={16} className={defaultColor} />;
    if (muscles.includes('biceps') || muscles.includes('triceps')) return <Zap size={16} className={defaultColor} />;
    if (muscles.includes('abs') || muscles.includes('lombar')) return <Flame size={16} className={defaultColor} />;
    if (muscles.includes('quadriceps') || muscles.includes('glutes') || muscles.includes('hamstrings') || muscles.includes('calves')) return <Activity size={16} className={defaultColor} />;
    return <Dumbbell size={16} className={defaultColor} />;
  };

  const getGroupColorClasses = (splitGroup?: 'A' | 'B' | 'C' | 'Full') => {
    switch(splitGroup) {
      case 'A': return { border: 'border-blue-500/50', bg: 'bg-blue-500/10', text: 'text-blue-500' };
      case 'B': return { border: 'border-green-500/50', bg: 'bg-green-500/10', text: 'text-green-500' };
      case 'C': return { border: 'border-orange-500/50', bg: 'bg-orange-500/10', text: 'text-orange-500' };
      case 'Full': return { border: 'border-purple-500/50', bg: 'bg-purple-500/10', text: 'text-purple-500' };
      default: return { border: 'border-zinc-700', bg: 'bg-zinc-900', text: 'text-zinc-300' };
    }
  };

  const getRelativeTimeLabel = (timestamp?: number) => {
    if (!timestamp) return 'AGENDA';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const target = new Date(timestamp);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'HOJE';
    if (diffDays === 1) return 'AMANHÃ';
    if (diffDays <= 7) return 'ESSA SEMANA';
    if (diffDays <= 14) return 'PRÓXIMA SEMANA';
    return 'PRÓXIMO MÊS';
  };

  const handleCreateComplete = (data: any) => {
    console.log("Workout creation data:", data);
    
    // Salvar as escolhas do usuário na store
    updatePreferences({
      desiredWeeklyFrequency: data.activeDays.length,
      trainingLocation: data.location as any,
      availableEquipment: data.equipment,
    });

    // Simulação de geração de treino pela IA
    const isDiscover = data.intensityLevel === 'descobrir';
    const levelMap: Record<string, string> = {
      leve: 'INICIANTE',
      moderado: 'INTERMEDIÁRIO',
      avancado: 'AVANÇADO',
      descobrir: 'AVALIAÇÃO'
    };
    const levelStr = levelMap[data.intensityLevel] || 'INICIANTE';
    const locs = Array.isArray(data.location) ? data.location : [data.location];
    const locStr = locs.map((loc: string) => loc === 'ar_livre' ? 'AO AR LIVRE' : `EM ${loc.toUpperCase()}`).join(' E ');
    
    const planName = isDiscover 
      ? `AVALIAÇÃO DE ${data.modality.toUpperCase()} ${locStr}` 
      : `${data.modality.toUpperCase()} ${locStr} PARA ${levelStr}`;
    
    // Cria a agenda (um grupo/dia na timeline para cada dia selecionado)
    const timelineExercises = generateWorkoutPlan(
      data.activeDays,
      data.equipment,
      data.intensityLevel,
      data.modality,
      data.exercises,
      data.splitType
    );

    const generatedPlan = {
      id: `workout-${Date.now()}`,
      name: planName,
      exercises: timelineExercises
    };

    setCurrentWorkoutPlan(generatedPlan);
    setShowCreateModal(false);
  };

  if (!currentWorkoutPlan || currentWorkoutPlan.exercises.length === 0) {
    return (
      <>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Dumbbell size={48} className="text-zinc-700 mb-4" />
          <h3 className="text-zinc-400 font-medium">Nenhum treino planejado para hoje</h3>
          <p className="text-zinc-600 text-sm mt-2 mb-6">Monte sua rotina ou inicie uma sessão rápida.</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 text-red-500 hover:text-red-400 font-bold px-6 py-3 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors"
          >
            <Plus size={18} />
            Criar Treino
          </button>
        </div>

        <AnimatePresence>
          {showCreateModal && (
            <CreateWorkoutModal 
              onClose={() => setShowCreateModal(false)}
              onComplete={handleCreateComplete}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
        <div className="flex items-center justify-between mb-8 mt-2">
          <h2 className="text-xl font-bold text-white uppercase pr-4">{currentWorkoutPlan.name}</h2>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <MoreHorizontal size={18} />
            </button>

            <AnimatePresence>
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-[#121214] border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50 flex flex-col"
                  >
                    <button 
                      onClick={() => {
                        setShowMenu(false);
                        setShowCreateModal(true);
                      }}
                      className="w-full text-left px-4 py-4 text-sm font-bold text-zinc-300 hover:bg-white/5 hover:text-white flex items-center gap-3 border-b border-white/5 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500">
                        <Edit3 size={16} />
                      </div>
                      Refazer Questionário
                    </button>
                    <button 
                      onClick={() => {
                        setShowMenu(false);
                        setCurrentWorkoutPlan(null);
                      }}
                      className="w-full text-left px-4 py-4 text-sm font-bold text-zinc-300 hover:bg-white/5 hover:text-red-400 flex items-center gap-3 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-white/5 text-zinc-500">
                        <Trash2 size={16} />
                      </div>
                      Excluir Plano Atual
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {showCreateModal && (
            <CreateWorkoutModal 
              onClose={() => setShowCreateModal(false)}
              onComplete={handleCreateComplete}
            />
          )}
        </AnimatePresence>

        {/* The 'Adicionar um exercício' button was removed here since editing should be done via the (...) menu next to the plan name */}

      <div className="relative pl-4 space-y-12">
        {/* The main vertical timeline line */}
        <div className="absolute left-[1.125rem] top-2 bottom-4 w-0.5 bg-zinc-800" />

        {currentWorkoutPlan.exercises.map((group, groupIdx) => (
          <div key={groupIdx} className="relative">
            {group.type !== 'single' && (
              <div className="flex items-start gap-4 mb-6">
                <div className="w-6 h-6 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center relative z-10 shrink-0 -ml-1">
                  <Link size={12} className="text-zinc-400" />
                </div>
                <div className="flex-1 flex justify-between items-center -mt-0.5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-white tracking-wide">{group.name}</h3>
                    <span className="text-[10px] font-bold text-blue-500 uppercase px-2 py-0.5 bg-blue-500/10 rounded-full">
                      {getRelativeTimeLabel(group.timestamp)}
                    </span>
                  </div>
                  <button className="text-zinc-600 hover:text-zinc-400"><MoreHorizontal size={16} /></button>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {group.items.map((ex, exIdx) => {
                const colors = getGroupColorClasses(group.splitGroup);
                const hasLog = !!exerciseLogs[ex.id];
                const isAllChecked = hasLog && exerciseLogs[ex.id].sets.every(s => s.completed);
                
                return (
                  <div 
                    key={ex.id} 
                    className="flex items-center gap-4 group cursor-pointer"
                    onClick={() => setActiveExercise(ex)}
                  >
                    {/* Activity Ring representation for the specific exercise */}
                    <div className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center z-10 shrink-0 -ml-[13px] transition-colors ${colors.bg} ${hasLog ? 'border-[#22c55e]/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : colors.border}`}>
                      {hasLog ? <CheckCircle2 size={16} className="text-[#22c55e]" /> : getMuscleIcon(ex.muscleGroups, colors.text)}
                      
                      {/* Split Group Badge */}
                      {group.splitGroup && group.splitGroup !== 'Full' && (
                        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#121214] border-2 flex items-center justify-center text-[9px] font-bold ${colors.text} ${colors.border}`}>
                          {group.splitGroup}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`text-base font-medium transition-colors ${hasLog ? 'text-[#22c55e]' : 'text-white group-hover:text-red-400'}`}>
                        {ex.name}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1">
                        {ex.muscleGroups.map(m => {
                          const mg = [
                            { id: 'chest', label: 'Peito' },
                            { id: 'back', label: 'Costas' },
                            { id: 'shoulders', label: 'Ombros' },
                            { id: 'abs', label: 'Abdômen' },
                            { id: 'lombar', label: 'Lombar' },
                            { id: 'biceps', label: 'Bíceps' },
                            { id: 'triceps', label: 'Tríceps' },
                            { id: 'quadriceps', label: 'Quadríceps' },
                            { id: 'hamstrings', label: 'Posteriores' },
                            { id: 'calves', label: 'Panturrilha' },
                            { id: 'glutes', label: 'Glúteos' },
                          ].find(g => g.id === m);
                          return mg ? mg.label : m;
                        }).join(', ')} • {ex.sets} SÉRIES | {ex.reps}{ex.weight ? ` | CARGA: ${ex.weight}` : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {/* End of timeline indicator */}
        <div className="flex items-center gap-4">
           <div className="w-6 h-6 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center relative z-10 shrink-0 -ml-1">
             <Link size={12} className="text-zinc-600" />
           </div>
        </div>
      </div>
      
      {/* Space for the floating button */}
      <div className="h-28"></div>
      
      <div className="absolute bottom-6 left-6 right-6 z-20">
        <button 
          onClick={() => {
            if (itemId) {
              addLog({
                trackerItemId: itemId,
                type: 'consumption',
                info: 'Treino concluído'
              });
            }
            incrementWorkout();
            alert("Treino finalizado com sucesso! Mais um dia na sua ofensiva!");
          }}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-black text-lg py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <CheckCircle2 size={24} strokeWidth={3} />
          FINALIZAR TREINO
        </button>
      </div>
    </div>

    <AnimatePresence>
      {showCreateModal && (
        <CreateWorkoutModal 
          onClose={() => setShowCreateModal(false)}
          onComplete={handleCreateComplete}
        />
      )}
    </AnimatePresence>

    <ExerciseLogModal 
      exercise={activeExercise}
      isOpen={!!activeExercise}
      onClose={() => setActiveExercise(null)}
      onSave={(logs) => {
        console.log("Saved logs:", logs);
        if (activeExercise) {
          saveExerciseLog(activeExercise.id, {
            sets: logs.sets,
            comment: logs.comment
          });
        }
      }}
    />
  </>
  );
}
