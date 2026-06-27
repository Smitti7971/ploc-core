import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ChevronRight, Check, Camera } from 'lucide-react';
import { ExerciseDefinition, useFitnessProfileStore } from '../store/useFitnessProfileStore';
import { getEquipmentImage, getExerciseImage } from '../utils/equipmentData';
import { exerciseDatabase } from '../utils/workoutGenerator';

interface ExerciseLogModalProps {
  exercise: ExerciseDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (logs: any) => void;
}

export function ExerciseLogModal({ exercise, isOpen, onClose, onSave }: ExerciseLogModalProps) {
  const existingLog = useFitnessProfileStore(state => 
    exercise ? state.exerciseLogs[exercise.id] : null
  );

  const [setsData, setSetsData] = useState<{ weight: string; reps: string; completed: boolean }[]>([]);
  const [comment, setComment] = useState('');
  const [showImage, setShowImage] = useState(false);

  // Inicializa o state baseado na quantidade de séries do exercício ou log existente
  React.useEffect(() => {
    if (exercise && isOpen) {
      if (existingLog) {
        setSetsData(existingLog.sets);
        setComment(existingLog.comment);
      } else {
        const initialSets = Array.from({ length: exercise.sets }).map(() => ({
          weight: '',
          reps: '',
          completed: false
        }));
        setSetsData(initialSets);
        setComment('');
      }
    }
  }, [exercise, isOpen, existingLog]);

  if (!isOpen || !exercise) return null;

  const handleSetChange = (index: number, field: 'weight' | 'reps', value: string) => {
    const newSets = [...setsData];
    newSets[index][field] = value;
    setSetsData(newSets);
  };

  const handleToggleComplete = (index: number) => {
    const newSets = [...setsData];
    newSets[index].completed = !newSets[index].completed;
    setSetsData(newSets);
  };

  const handleSave = () => {
    onSave({
      exerciseId: exercise.id,
      sets: setsData,
      comment
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-zinc-800 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-white mb-1 leading-tight">{exercise.name}</h2>
              <p className="text-sm text-zinc-400 uppercase tracking-wider font-semibold">
                Meta: {exercise.sets} séries | {exercise.reps}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            
            {/* Foto do Equipamento Toggle */}
            {(() => {
              const eqName = exercise.equipment || exerciseDatabase.find(e => exercise.name.includes(e.name))?.requiredEquipment[0] || 'Colchonete';
              return (
                <div className="mb-2">
                  <button 
                    onClick={() => setShowImage(!showImage)}
                    className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <Camera size={14} />
                    {showImage ? 'Ocultar Foto do Equipamento' : 'Ver Foto do Equipamento'}
                  </button>
                  
                  <AnimatePresence>
                    {showImage && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-3"
                      >
                        <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-zinc-800">
                          <img 
                            src={getExerciseImage(exercise.name, eqName)} 
                            alt={exercise.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent opacity-80"></div>
                          <div className="absolute bottom-3 left-3 flex items-center gap-2">
                            <span className="text-xs font-bold text-white px-2 py-1 bg-black/50 rounded-md backdrop-blur-md border border-white/10">
                              {eqName}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })()}

            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 mb-2 px-2">
                <div className="col-span-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Série</div>
                <div className="col-span-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Peso (kg)</div>
                <div className="col-span-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Reps</div>
                <div className="col-span-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Ok</div>
              </div>

              {setsData.map((set, idx) => (
                <div 
                  key={idx} 
                  className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl transition-colors ${
                    set.completed ? 'bg-[#22c55e]/10 border border-[#22c55e]/20' : 'bg-zinc-800/50'
                  }`}
                >
                  <div className="col-span-2 text-center text-sm font-bold text-zinc-300">
                    {idx + 1}
                  </div>
                  <div className="col-span-4">
                    <input
                      type="number"
                      placeholder="--"
                      value={set.weight}
                      onChange={(e) => handleSetChange(idx, 'weight', e.target.value)}
                      className={`w-full bg-zinc-900 border ${set.completed ? 'border-[#22c55e]/30 text-[#22c55e]' : 'border-zinc-700 text-white'} rounded-lg px-3 py-2 text-center text-lg font-bold focus:outline-none focus:border-[#22c55e] transition-colors`}
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="number"
                      placeholder="--"
                      value={set.reps}
                      onChange={(e) => handleSetChange(idx, 'reps', e.target.value)}
                      className={`w-full bg-zinc-900 border ${set.completed ? 'border-[#22c55e]/30 text-[#22c55e]' : 'border-zinc-700 text-white'} rounded-lg px-3 py-2 text-center text-lg font-bold focus:outline-none focus:border-[#22c55e] transition-colors`}
                    />
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <button
                      onClick={() => handleToggleComplete(idx)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        set.completed 
                          ? 'bg-[#22c55e] text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                          : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                      }`}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                Comentários / Observações
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Como foi a execução? Sentiu alguma dor?"
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#22c55e] transition-colors resize-none h-28"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
            <button
              onClick={handleSave}
              className="w-full bg-[#22c55e] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#16a34a] transition-colors shadow-[0_0_20px_rgba(34,197,94,0.2)]"
            >
              SALVAR REGISTRO
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
