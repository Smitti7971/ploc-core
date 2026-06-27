import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BicepsFlexed, ArrowRight, Target, Dumbbell, Activity, Flame, Save, HeartPulse, Clock, CalendarDays, Plus, Trash2 } from 'lucide-react';
import { useFitnessProfileStore } from '../store/useFitnessProfileStore';

interface FitnessProfileSettingsModalProps {
  onClose: () => void;
}

export function FitnessProfileSettingsModal({ onClose }: FitnessProfileSettingsModalProps) {
  const profileStore = useFitnessProfileStore();

  const [activeTab, setActiveTab] = useState<'biometria' | 'medidas' | 'objetivos' | 'limitacoes'>('biometria');
  
  // Local state for editing to prevent immediate saves
  const [formData, setFormData] = useState({
    weight: profileStore.biometrics.weight || '',
    height: profileStore.biometrics.height || '',
    targetWeight: profileStore.biometrics.targetWeight || '',
    gender: profileStore.biometrics.sex || '',
    age: profileStore.biometrics.age || '',
    primaryObjective: profileStore.goals.primaryObjective || 'saude',
    experienceLevel: profileStore.preferences.experienceLevel || 'iniciante',
    trainingLocation: profileStore.preferences.trainingLocation || 'academia',
    desiredFrequency: profileStore.preferences.desiredWeeklyFrequency || 3,
    availableTime: profileStore.preferences.availableTimeMinutes || 60,
    newInjury: '',
    injuries: profileStore.limitations.injuries || [],
    chest: profileStore.biometrics.measurements?.chest || '',
    waist: profileStore.biometrics.measurements?.waist || '',
    hips: profileStore.biometrics.measurements?.hips || '',
    arms: profileStore.biometrics.measurements?.arms || '',
    thighs: profileStore.biometrics.measurements?.thighs || '',
    calves: profileStore.biometrics.measurements?.calves || ''
  });

  const handleSave = async () => {
    profileStore.updateBiometrics({
      weight: formData.weight ? parseFloat(formData.weight as string) : null,
      height: formData.height ? parseFloat(formData.height as string) : null,
      sex: formData.gender as any,
      targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight as string) : null,
      age: formData.age ? parseInt(formData.age as string) : null,
      measurements: {
        chest: formData.chest ? parseFloat(formData.chest as string) : null,
        waist: formData.waist ? parseFloat(formData.waist as string) : null,
        hips: formData.hips ? parseFloat(formData.hips as string) : null,
        arms: formData.arms ? parseFloat(formData.arms as string) : null,
        thighs: formData.thighs ? parseFloat(formData.thighs as string) : null,
        calves: formData.calves ? parseFloat(formData.calves as string) : null,
      }
    });

    profileStore.updateGoals({
      primaryObjective: formData.primaryObjective as any,
    });

    profileStore.updatePreferences({
      experienceLevel: formData.experienceLevel as any,
      trainingLocation: formData.trainingLocation as any,
      desiredWeeklyFrequency: typeof formData.desiredFrequency === 'number' ? formData.desiredFrequency : parseInt(formData.desiredFrequency as string),
      availableTimeMinutes: typeof formData.availableTime === 'number' ? formData.availableTime : parseInt(formData.availableTime as string),
    });

    profileStore.updateLimitations({
      injuries: formData.injuries,
    });

    profileStore.setHasCompletedOnboarding(true);
    await profileStore.saveToDatabase();

    onClose();
  };

  const addInjury = () => {
    if (formData.newInjury.trim()) {
      setFormData({
        ...formData,
        injuries: [...formData.injuries, formData.newInjury.trim()],
        newInjury: ''
      });
    }
  };

  const removeInjury = (index: number) => {
    const updated = [...formData.injuries];
    updated.splice(index, 1);
    setFormData({ ...formData, injuries: updated });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-md bg-zinc-900 border border-red-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-red-900/20 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between bg-red-500/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
              <HeartPulse size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Perfil Corporal</h2>
              <p className="text-xs text-red-400">Dados do Treinador IA</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 sm:px-6 pt-4 gap-2 shrink-0 border-b border-white/5 pb-2 overflow-x-auto scrollbar-hide">
          <button onClick={() => setActiveTab('biometria')} className={`pb-2 px-2 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${activeTab === 'biometria' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}`}>Biometria</button>
          <button onClick={() => setActiveTab('medidas')} className={`pb-2 px-2 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${activeTab === 'medidas' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}`}>Medidas</button>
          <button onClick={() => setActiveTab('objetivos')} className={`pb-2 px-2 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${activeTab === 'objetivos' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}`}>Objetivos</button>
          <button onClick={() => setActiveTab('limitacoes')} className={`pb-2 px-2 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${activeTab === 'limitacoes' ? 'border-red-500 text-white' : 'border-transparent text-zinc-500'}`}>Restrições</button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {activeTab === 'biometria' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Peso (kg)</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Altura (cm)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Idade</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Sexo Biológico</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50 transition-colors appearance-none"
                  >
                    <option value="">Selecione...</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medidas' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6">
              {[
                { id: 'chest', label: 'Peito', value: formData.chest, imageId: 'chest' },
                { id: 'waist', label: 'Cintura', value: formData.waist, imageId: 'abs' },
                { id: 'hips', label: 'Quadril', value: formData.hips, imageId: 'glutes' },
                { id: 'arms', label: 'Braços', value: formData.arms, imageId: 'biceps' },
                { id: 'thighs', label: 'Coxas', value: formData.thighs, imageId: 'quadriceps' },
                { id: 'calves', label: 'Panturrilhas', value: formData.calves, imageId: 'hamstrings' },
              ].map((measure) => (
                <div key={measure.id} className="flex flex-col items-center gap-3">
                  {/* Círculo com a Imagem */}
                  <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-black border border-white/5 transition-colors overflow-hidden group shadow-lg">
                    <div className="absolute inset-0 rounded-full overflow-hidden z-10">
                      <img 
                        src={`/muscles/${measure.imageId}.png`} 
                        alt={measure.label} 
                        className="w-full h-full object-cover scale-125 opacity-70 group-hover:opacity-100 transition-all duration-300 drop-shadow-[0_0_10px_rgba(239,68,68,0.2)] group-hover:drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]"
                      />
                    </div>
                  </div>
                  {/* Input de Medida */}
                  <div className="w-full text-center px-2">
                    <label className="block text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-wider">{measure.label}</label>
                    <div className="relative group">
                      <input
                        type="number"
                        value={measure.value}
                        onChange={(e) => setFormData({ ...formData, [measure.id]: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-2 text-center text-white font-medium focus:outline-none focus:border-red-500/50 hover:border-white/20 transition-all"
                        placeholder="---"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-600 pointer-events-none group-focus-within:text-red-500/50 transition-colors">
                        cm
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'objetivos' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider">Objetivo Principal</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'emagrecer', label: 'Secar' },
                    { id: 'hipertrofia', label: 'Massa' },
                    { id: 'saude', label: 'Saúde' },
                    { id: 'forca', label: 'Força' },
                  ].map((obj) => (
                    <button
                      key={obj.id}
                      onClick={() => setFormData({ ...formData, primaryObjective: obj.id as any })}
                      className={`p-3 rounded-xl border text-sm font-bold text-center transition-all ${
                        formData.primaryObjective === obj.id
                          ? 'bg-red-500/20 border-red-500/50 text-white'
                          : 'bg-black/50 border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {obj.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider">Nível de Experiência</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'iniciante', label: 'Iniciante' },
                    { id: 'intermediario', label: 'Intermed' },
                    { id: 'avancado', label: 'Avançado' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => setFormData({ ...formData, experienceLevel: lvl.id as any })}
                      className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${
                        formData.experienceLevel === lvl.id
                          ? 'bg-red-500/20 border-red-500/50 text-white'
                          : 'bg-black/50 border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Dias por semana</label>
                  <input
                    type="number"
                    value={formData.desiredFrequency}
                    onChange={(e) => setFormData({ ...formData, desiredFrequency: e.target.value as any })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Local Preferido</label>
                  <select
                    value={formData.trainingLocation}
                    onChange={(e) => setFormData({ ...formData, trainingLocation: e.target.value as any })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50 transition-colors appearance-none"
                  >
                    <option value="academia">Academia</option>
                    <option value="casa">Casa</option>
                    <option value="rua">Rua/Parque</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'limitacoes' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Lesões / Dores</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.newInjury}
                    onChange={(e) => setFormData({ ...formData, newInjury: e.target.value })}
                    placeholder="Ex: Dor na Lombar, Joelho..."
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                  />
                  <button onClick={addInjury} className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-colors">
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                {formData.injuries.length === 0 ? (
                  <p className="text-sm text-zinc-500 italic">Nenhuma lesão ou restrição registrada.</p>
                ) : (
                  formData.injuries.map((injury, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <span className="text-white text-sm font-medium">{injury}</span>
                      <button onClick={() => removeInjury(idx)} className="text-red-400 hover:text-red-300">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-white/5 bg-black/20 shrink-0">
          <button
            onClick={handleSave}
            className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/20"
          >
            <Save size={18} />
            Salvar Alterações
          </button>
        </div>
      </motion.div>
    </div>
  );
}
