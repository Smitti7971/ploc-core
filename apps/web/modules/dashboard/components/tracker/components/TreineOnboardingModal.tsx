import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BicepsFlexed, ArrowRight, Target, Dumbbell, Activity, Flame } from 'lucide-react';

interface TreineOnboardingModalProps {
  onComplete: (data: any) => void;
  onClose: () => void;
}

export function TreineOnboardingModal({ onComplete, onClose }: TreineOnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    objective: '',
    level: '',
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-zinc-900 border border-red-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-red-900/20 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-red-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
              <BicepsFlexed size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Configurar Treino</h2>
              <p className="text-xs text-red-400">Passo {step} de 3</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 min-h-[300px]">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-lg font-bold text-white mb-2">Perfil Biométrico</h3>
                <p className="text-sm text-zinc-400">Precisamos de alguns dados base para montar suas estatísticas de evolução.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Peso (kg)</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="Ex: 75"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Altura (cm)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="Ex: 178"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 transition-colors"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-lg font-bold text-white mb-2">Qual seu Objetivo?</h3>
                <p className="text-sm text-zinc-400">Isso molda a forma como vamos acompanhar seu progresso.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'emagrecer', label: 'Emagrecimento / Secar', icon: Flame },
                  { id: 'hipertrofia', label: 'Ganho de Massa', icon: Dumbbell },
                  { id: 'saude', label: 'Condicionamento / Saúde', icon: Activity },
                  { id: 'forca', label: 'Ganho de Força', icon: Target },
                ].map((obj) => (
                  <button
                    key={obj.id}
                    onClick={() => setFormData({ ...formData, objective: obj.id })}
                    className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                      formData.objective === obj.id
                        ? 'bg-red-500/20 border-red-500/50 text-white'
                        : 'bg-black/50 border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white hover:border-white/10'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${formData.objective === obj.id ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-zinc-500'}`}>
                      <obj.icon size={20} />
                    </div>
                    <span className="font-bold">{obj.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-lg font-bold text-white mb-2">Qual seu Nível?</h3>
                <p className="text-sm text-zinc-400">Para ajustarmos a curva de dificuldade.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'iniciante', label: 'Iniciante', desc: 'Começando agora ou retornando' },
                  { id: 'intermediario', label: 'Intermediário', desc: 'Treino constante há alguns meses' },
                  { id: 'avancado', label: 'Avançado', desc: 'Experiente, busco otimização' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setFormData({ ...formData, level: lvl.id })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      formData.level === lvl.id
                        ? 'bg-red-500/20 border-red-500/50 text-white'
                        : 'bg-black/50 border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white hover:border-white/10'
                    }`}
                  >
                    <div className="font-bold mb-1">{lvl.label}</div>
                    <div className="text-xs opacity-70">{lvl.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-black/20 flex justify-between items-center">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            className={`text-sm font-bold text-zinc-500 hover:text-white transition-colors px-4 py-2 ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            Voltar
          </button>
          
          <button
            onClick={handleNext}
            disabled={
              (step === 1 && (!formData.weight || !formData.height)) ||
              (step === 2 && !formData.objective) ||
              (step === 3 && !formData.level)
            }
            className="bg-red-500 hover:bg-red-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white px-6 py-3 rounded-full font-black text-sm flex items-center gap-2 transition-all"
          >
            {step === 3 ? 'Finalizar Configuração' : 'Avançar'}
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
