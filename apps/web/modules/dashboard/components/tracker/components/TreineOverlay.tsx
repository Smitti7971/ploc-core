import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, MoreHorizontal, Activity, RefreshCw } from 'lucide-react';
import { useTrackerStore, TrackerItem } from '../store/trackerStore';
import { useFitnessProfileStore } from '../store/useFitnessProfileStore';
import { TreineOnboardingModal } from './TreineOnboardingModal';
import { ConfirmSaveModal } from './modals/ConfirmSaveModal';
import { FitnessProfileSettingsModal } from './FitnessProfileSettingsModal';
import { MuscleRecoveryCarousel } from './MuscleRecoveryCarousel';
import { WorkoutTimeline } from './WorkoutTimeline';
import { MuscleSelectionGrid } from './MuscleSelectionGrid';
import { getCombinedExercises } from '../utils/workoutGenerator';
import { TrackerComparison } from './TrackerComparison';

interface TreineOverlayProps {
  itemId: string;
  onClose: () => void;
}

export function TreineOverlay({ itemId, onClose }: TreineOverlayProps) {
  const { items, logs, setItem: storeUpdateItem, removeItem: deleteItem } = useTrackerStore();
  const storeItem = items[itemId] || Object.values(items).find((i: any) => i.id === itemId);

  const [localItem, setLocalItem] = useState<TrackerItem>(
    storeItem || ({ id: itemId, type: 'treine', name: '', status: 'ACTIVE', startDate: Date.now() } as TrackerItem)
  );
  const item = localItem;

  const hasChanges = JSON.stringify(localItem) !== JSON.stringify(storeItem);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);

  const handleClose = () => {
    if (hasChanges) {
      setIsConfirmSaveOpen(true);
    } else {
      if (!item.name || item.name.trim() === '') {
        deleteItem(item.id);
      }
      onClose();
    }
  };

  const profileStore = useFitnessProfileStore();
  const { hasCompletedOnboarding, setHasCompletedOnboarding, updateBiometrics, updateGoals, updatePreferences } = profileStore;
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'workout' | 'recovery' | 'log'>('workout');

  const allExercises = getCombinedExercises();

  useEffect(() => {
    // Se o usuário já preencheu os dados básicos em algum momento, consideramos o onboarding concluído
    const hasBasicInfo = !!(profileStore.biometrics?.weight && profileStore.biometrics?.height);

    if (hasBasicInfo && !hasCompletedOnboarding) {
      setHasCompletedOnboarding(true);
      return;
    }

    if (!hasCompletedOnboarding && !hasBasicInfo) {
      setShowOnboarding(true);
    }
  }, [hasCompletedOnboarding, profileStore.biometrics]);

  // Atualiza o status automaticamente para PAUSADO se não houver treino, e ATIVO se houver.
  useEffect(() => {
    if (!item) return;
    const isPaused = !profileStore.currentWorkoutPlan || profileStore.currentWorkoutPlan.exercises.length === 0;
    const targetStatus = isPaused ? 'PAUSED' : 'ACTIVE';
    
    if (localItem.status !== targetStatus) {
      const updated = { ...localItem, status: targetStatus as 'ACTIVE' | 'PAUSED' };
      setLocalItem(updated);
      storeUpdateItem(updated);
    }
  }, [profileStore.currentWorkoutPlan, localItem.status, item]);

  if (!item) return null;

  const itemLogs = logs.filter(l => l.trackerItemId === item.id);

  const handleOnboardingComplete = (data: any) => {
    // Salva globalmente que o usuário completou
    setHasCompletedOnboarding(true);

    // Salva na Store Global de Fitness
    updateBiometrics({
      weight: parseFloat(data.weight),
      height: parseFloat(data.height),
    });

    updateGoals({
      primaryObjective: data.objective,
    });

    updatePreferences({
      experienceLevel: data.level,
    });

    setShowOnboarding(false);
  };

  return (
    <>
      {/* O Onboarding Modal abre por cima deste Overlay se necessário */}
      <AnimatePresence>
        {showOnboarding && (
          <TreineOnboardingModal
            onClose={() => {
              // Se fechar sem concluir, pode fechar o overlay todo para obrigar
              setShowOnboarding(false);
              onClose();
            }}
            onComplete={handleOnboardingComplete}
          />
        )}

        {showProfileSettings && (
          <FitnessProfileSettingsModal
            onClose={() => setShowProfileSettings(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          className="w-full h-full sm:w-[480px] sm:h-[85vh] bg-[#121214] sm:rounded-[40px] flex flex-col relative overflow-hidden shadow-2xl shadow-red-900/20 pt-20 sm:pt-0"
        >
          {/* HEADER */}
          <div className="px-6 py-6 flex items-center justify-between shrink-0">
            {hasChanges ? (
              <button 
                onClick={() => storeUpdateItem(localItem)} 
                className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs tracking-widest px-3 py-1.5 rounded-full transition-colors"
              >
                SALVAR
              </button>
            ) : (
              <div className="w-[60px]" />
            )}
            <div className="flex items-center gap-2 text-white font-bold text-sm bg-zinc-800/50 px-4 py-1.5 rounded-full hover:bg-zinc-800 focus-within:bg-zinc-800 transition-colors">
              <input
                type="text"
                value={localItem.name || ''}
                onChange={(e) => setLocalItem({ ...localItem, name: e.target.value })}
                onBlur={() => {
                  if (localItem.name !== storeItem?.name) {
                    storeUpdateItem(localItem);
                  }
                }}
                placeholder="NOME DO TREINO"
                className="bg-transparent outline-none placeholder:text-zinc-500 text-center"
                style={{ width: `${Math.max((localItem.name || 'NOME DO TREINO').length, 14)}ch` }}
              />
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowProfileSettings(true)} className="text-zinc-400 hover:text-white">
                <MoreHorizontal size={24} />
              </button>
              <button onClick={handleClose} className="text-zinc-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
          </div>

          {/* ACTIVE TAB CONTENT */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {activeTab === 'workout' && (
              <>
                <div className="px-6 pb-2 pt-2">
                  <TrackerComparison item={item} logs={itemLogs} />
                </div>
                <MuscleRecoveryCarousel />
                <WorkoutTimeline />
              </>
            )}

            {activeTab === 'recovery' && <MuscleSelectionGrid />}

            {activeTab === 'log' && (
              <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
                <div className="flex items-center justify-between mb-8 mt-2">
                  <h2 className="text-xl font-bold text-white uppercase pr-4">Histórico de Exercícios</h2>
                </div>
                {Object.values(profileStore.exerciseLogs).length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-400 mt-10">
                    <RefreshCw size={48} className="text-zinc-700 mb-4 opacity-50" />
                    <h3 className="font-medium text-zinc-300">Nenhum Registro</h3>
                    <p className="text-sm mt-2">Conclua exercícios para vê-los aqui.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.values(profileStore.exerciseLogs)
                      .sort((a, b) => b.timestamp - a.timestamp)
                      .map((log) => {
                        const dateObj = new Date(log.timestamp);
                        const exDef = allExercises.find(e => e.id === log.exerciseId);
                        const exName = exDef ? exDef.name : log.exerciseId;
                        
                        return (
                          <div key={`${log.exerciseId}-${log.timestamp}`} className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="text-white font-bold">{exName}</h4>
                                <span className="text-xs text-zinc-500">{dateObj.toLocaleDateString('pt-BR')} às {dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                            <div className="space-y-2 mt-3">
                              {log.sets.map((set, idx) => (
                                <div key={idx} className={`grid grid-cols-3 text-xs p-1.5 rounded-lg ${set.completed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-900 text-zinc-500'}`}>
                                  <div className="text-center font-bold">Série {idx + 1}</div>
                                  <div className="text-center">{set.weight ? `${set.weight}kg` : '-'}</div>
                                  <div className="text-center">{set.reps ? `${set.reps}` : '-'}</div>
                                </div>
                              ))}
                            </div>
                            {log.comment && (
                              <div className="mt-3 text-xs text-zinc-400 italic bg-zinc-900 p-2 rounded-lg">"{log.comment}"</div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BOTTOM NAV */}
          <div className="bg-[#121214] border-t border-white/5 pb-28 pt-4 px-8 shrink-0 flex items-center justify-between relative z-30">
            <button onClick={() => setActiveTab('workout')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'workout' ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <Dumbbell size={24} strokeWidth={activeTab === 'workout' ? 2.5 : 1.5} />
              <span className="text-[9px] font-bold tracking-widest">TREINO</span>
            </button>
            <button onClick={() => setActiveTab('recovery')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'recovery' ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <Activity size={24} strokeWidth={activeTab === 'recovery' ? 2.5 : 1.5} />
              <span className="text-[9px] font-bold tracking-widest">RECUPERAÇÃO</span>
            </button>
            <button onClick={() => setActiveTab('log')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'log' ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <RefreshCw size={24} strokeWidth={activeTab === 'log' ? 2.5 : 1.5} />
              <span className="text-[9px] font-bold tracking-widest">HISTÓRICO</span>
            </button>
          </div>
        </motion.div>
      </div>

      <ConfirmSaveModal
        isOpen={isConfirmSaveOpen}
        onClose={() => setIsConfirmSaveOpen(false)}
        onDiscard={() => {
          setIsConfirmSaveOpen(false);
          if (!storeItem || !storeItem.name || storeItem.name.trim() === '') {
            deleteItem(item.id);
          }
          onClose();
        }}
        onSave={() => {
          storeUpdateItem(localItem);
          setIsConfirmSaveOpen(false);
          onClose();
        }}
      />
    </>
  );
}
