//  Lida com todos os botões do onboarding (cadastrar-se, continuar jogando, avançar de fase e escolha do pilar), evitando bagunçar o código de layout.

/**
 * @module PlocOnboardingControls
 * @description Componente que exibe botões de controle ("Avançar", "Entendi") durante a etapa de Onboarding,
 * permitindo que o usuário avance de fase na introdução do app.
 */

import { motion } from 'framer-motion';

interface PlocOnboardingControlsProps {
  isChatOpen: boolean;
  gameMode: string | null;
  showChoiceButtons: boolean;
  onboardingStage: string;
  phase1PopCount: number;
  showPriorityConfirmButtons: boolean;
  handleRegisterChoice: () => void;
  handleContinuePlaying: () => void;
  handleStartPhase2: () => void;
  handleConfirmPriorityPillar: () => void;
}

export function PlocOnboardingControls({
  isChatOpen,
  gameMode,
  showChoiceButtons,
  onboardingStage,
  phase1PopCount,
  showPriorityConfirmButtons,
  handleRegisterChoice,
  handleContinuePlaying,
  handleStartPhase2,
  handleConfirmPriorityPillar
}: PlocOnboardingControlsProps) {
  if (!isChatOpen) return null;

  return (
    <>
      {/* Botões de Escolha do Equilíbrio Mínimo */}
      {showChoiceButtons && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex gap-4 pointer-events-auto mt-2"
        >
          <button
            onClick={handleRegisterChoice}
            className="px-6 py-2.5 rounded-full font-bold text-sm tracking-wide text-white bg-emerald-500/25 border border-emerald-400/50 backdrop-blur-[8px] hover:bg-emerald-500/40 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)]"
          >
            Cadastrar-se
          </button>
          <button
            onClick={handleContinuePlaying}
            className="px-6 py-2.5 rounded-full font-bold text-sm tracking-wide text-white/90 bg-white/5 border border-white/20 backdrop-blur-[8px] hover:bg-white/10 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          >
            Continuar Jogando
          </button>
        </motion.div>
      )}

      {/* Indicador de Progresso de Hábitos (Fase 1) */}
      {gameMode === 'onboarding_game' && ['corpo', 'mente', 'vida', 'liberdade', 'proposito'].includes(onboardingStage) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex flex-col items-center gap-2 mt-2 select-none"
        >
          <span className="text-[10px] text-emerald-400 font-extrabold tracking-widest uppercase font-mono bg-slate-900/80 px-4 py-1.5 rounded-full border border-emerald-500/30 backdrop-blur-[6px] shadow-[0_4px_15px_rgba(16,185,129,0.2)]">
            {onboardingStage.toUpperCase()} • {phase1PopCount}/5
          </span>
        </motion.div>
      )}

      {/* Botão de Transição para Fase 2 (Resultados) */}
      {gameMode === 'onboarding_game' && onboardingStage === 'results' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="pointer-events-auto mt-2"
        >
          <button
            onClick={handleStartPhase2}
            className="px-8 py-3.5 rounded-full font-bold text-sm tracking-wide text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border border-amber-400/30 backdrop-blur-[8px] hover:scale-105 active:scale-95 transition-all shadow-[0_4px_25px_rgba(245,158,11,0.45)] whitespace-nowrap uppercase font-mono"
          >
            Iniciar Fase 2: Desafio de Equilíbrio ⚖️
          </button>
        </motion.div>
      )}

      {/* Botões de Confirmação da Prioridade Inicial (Fase 1: Priority) */}
      {gameMode === 'onboarding_game' && onboardingStage === 'priority' && showPriorityConfirmButtons && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center pointer-events-auto mt-2"
        >
          <button
            onClick={handleConfirmPriorityPillar}
            className="px-8 py-2.5 rounded-full font-bold text-sm tracking-wide text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border border-emerald-400/30 backdrop-blur-[8px] hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(16,185,129,0.35)]"
          >
            Confirmar
          </button>
        </motion.div>
      )}
    </>
  );
}
