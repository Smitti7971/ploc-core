/**
 * @module AttributePillars
 * @description Componente visual que exibe a lista dos 5 pilares (Corpo, Mente, Vida, Liberdade, Propósito)
 * em formato de bolhas flutuantes, incluindo animações de aumento/diminuição de pontos e tooltips explicativos.
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Dumbbell, UsersRound, Wallet, Flag, X } from 'lucide-react';
import { UserAttributes } from '../engine/attribute-engine/AttributeEngine';
import { bubbleEngine } from '../engine/bubble-engine/BubbleEngine';
import { PillarPage } from '@/modules/routines/components/PillarPage';
import { useViceStore } from '@/modules/dashboard/components/libertesse/store/viceStore';

export const PILLARS_CONFIG = {
  corpo: { 
    label: 'CORPO', 
    color: '#ef4444', 
    icon: Dumbbell,
    desc: 'Saúde, sono e energia física. Afetado por exercícios, hidratação e descanso.',
    states: 'Fortalecendo, Recuperando, Esgotado, Instável',
    habits: ['smoking', 'exercise']
  },
  mente: { 
    label: 'MENTE', 
    color: '#38bdf8', 
    icon: Brain,
    desc: 'Foco, clareza e aprendizado. Afetado por estudos, reflexão e journaling.',
    states: 'Clareza crescente, Fragmentada, Sobrecarregada, Expandindo',
    habits: ['smoking', 'meditation']
  },
  vida: { 
    label: 'VIDA', 
    color: '#facc15', 
    icon: UsersRound,
    desc: 'Equilíbrio, lazer e relações. Afetado por hobbies, família e novas experiências.',
    states: 'Equilibrada, Vazia, Conectada, Monótona',
    habits: ['exercise']
  },
  liberdade: { 
    label: 'LIBERDADE', 
    color: '#2dd4bf', 
    icon: Wallet,
    desc: 'Autonomia e finanças. Afetado por economia, reserva e redução de dependências.',
    states: 'Em construção, Pressionada, Estável, Limitada',
    habits: ['smoking']
  },
  proposito: { 
    label: 'PROPÓSITO', 
    color: '#c084fc', 
    icon: Flag,
    desc: 'Direção e progresso existencial. Afetado por projetos pessoais e metas reais.',
    states: 'Alinhado, Perdido, Despertando, Sem direção',
    habits: ['meditation']
  }
};

export const PILLAR_PROFILE_KEYS = {
  corpo: ['peso', 'altura', 'horasSono', 'treinoFreq', 'aguaLiters', 'medidas'],
  mente: ['estresse', 'meditacao', 'horasTela', 'focoPrincipal'],
  vida: ['alimentacao', 'lazerHoras', 'relacionamentos'],
  liberdade: ['horasLivres', 'viciosAtivos', 'autonomia'],
  proposito: ['metaAno', 'alinhamentoCarreira', 'sentidoDirecao']
};

export const isPillarProfileFilled = (pillarKey: string) => {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem('ploc_pillar_profiles');
    if (!saved) return false;
    const profile = JSON.parse(saved);
    const keys = PILLAR_PROFILE_KEYS[pillarKey as keyof typeof PILLAR_PROFILE_KEYS];
    if (!keys || keys.length === 0) return false;
    return keys.every(key => profile[key] && profile[key].trim() !== '');
  } catch(e) {
    return false;
  }
};

interface AttributePillarsProps {
  attributes: UserAttributes;
  lastChanges: Record<string, number>;
  activeTooltip: string | null;
  setActiveTooltip: (tooltip: string | null) => void;
}

export function AttributePillars({ 
  attributes, 
  lastChanges, 
  activeTooltip, 
  setActiveTooltip 
}: AttributePillarsProps) {

  const [activePillarOverlay, setActivePillarOverlay] = useState<string | null>(null);
  const activeVices = useViceStore(state => state.activeVices);
  const activeVicesList = Object.values(activeVices || {});

  const getNextTasks = (pillarKey: string) => {
    const activeBubbles = bubbleEngine.getActiveBubbles();
    const config = PILLARS_CONFIG[pillarKey as keyof typeof PILLARS_CONFIG];
    return activeBubbles.filter(b => config.habits.includes((b.metadata as { habit?: string })?.habit || ''));
  };

  const activeConfig = activeTooltip ? PILLARS_CONFIG[activeTooltip as keyof typeof PILLARS_CONFIG] : null;

  const getStatusColor = (val: number, color: string) => {
    if (val >= 70) return '#22c55e';
    return color;
  };

  return (
    <div className="relative flex flex-col items-center gap-4 max-w-[100vw] w-full">
      <div className="flex justify-center items-center gap-1.5 sm:gap-5 px-1 sm:px-2 w-full max-w-full">
        {(Object.keys(PILLARS_CONFIG) as Array<keyof UserAttributes>).map((key, index) => {
          const config = PILLARS_CONFIG[key];
          const Icon = config.icon;
          const change = lastChanges[key];
          const isActive = activeTooltip === key;
          const value = attributes[key];
          const statusColor = getStatusColor(value, config.color);
          const hasActiveTasks = getNextTasks(key).length > 0 || (key === 'liberdade' && activeVicesList.length > 0);
          const hasProfileInfo = isPillarProfileFilled(key);
          const showBadge = value === 0 && !hasActiveTasks && !hasProfileInfo;
          
          return (
            <div key={key} className="attribute-bubble" style={{ position: 'relative' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  y: [0, -10, 0],
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTooltip(isActive ? null : key)}
                transition={{
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.4
                  }
                }}
                className="w-[50px] h-[50px] min-w-[50px] sm:w-[60px] sm:h-[60px] rounded-full flex flex-col items-center justify-center relative cursor-help pointer-events-auto shrink-0"
                style={{
                  background: 'rgba(20,25,30,0.85)',
                  border: `1px solid ${isActive ? statusColor : statusColor + '40'}`,
                  boxShadow: `0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px ${statusColor}20`,
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '10%',
                  left: '20%',
                  width: '30%',
                  height: '30%',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                }} />

                <Icon className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] opacity-80 mb-0.5" color={statusColor} />
                <span className="text-[0.7rem] sm:text-[0.8rem] text-white font-black">{value}</span>

                {/* Badge de atenção para pilar não preenchido */}
                {showBadge && (
                  <span className="absolute top-0 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full border-[1.5px] border-black/80 flex items-center justify-center shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-pulse z-[60]">
                    <span className="text-black text-[10px] font-black leading-none mt-[1px]">!</span>
                  </span>
                )}
              </motion.div>

              <AnimatePresence>
                {change && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: -40 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      textAlign: 'center',
                      color: change > 0 ? '#22c55e' : '#ef4444',
                      fontWeight: 900,
                      fontSize: '0.8rem',
                      textShadow: '0 0 10px rgba(0,0,0,0.5)'
                    }}
                  >
                    {change > 0 ? `+${change}` : change}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Tooltip Centralizado abaixo dos Atributos */}
      <AnimatePresence>
        {activeTooltip && activeConfig && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-[80px] left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-32px)] sm:w-[360px] p-4 bg-slate-900/95 backdrop-blur-xl border rounded-2xl text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)] pointer-events-auto cursor-pointer hover:bg-slate-800/95 transition-colors"
            style={{
              borderColor: `${getStatusColor(attributes[activeTooltip as keyof UserAttributes], activeConfig.color)}40`
            }}
            onClick={() => {
              setActivePillarOverlay(activeTooltip);
              setActiveTooltip(null);
            }}
          >
            <h4 
              style={{ color: getStatusColor(attributes[activeTooltip as keyof UserAttributes], activeConfig.color) }} 
              className="m-0 mb-1 text-[0.9rem] font-black"
            >
              {activeConfig.label}
            </h4>
            <p className="text-[0.75rem] text-slate-400 m-0 mb-3">{activeConfig.desc}</p>
            <div className="border-t border-white/10 pt-2.5">
              <span className="text-[0.6rem] font-black text-slate-500 block mb-1.5">TAREFAS ATIVAS</span>
              {getNextTasks(activeTooltip).length > 0 || (activeTooltip === 'liberdade' && activeVicesList.length > 0) ? (
                <>
                  {getNextTasks(activeTooltip).map(b => (
                    <div key={b.id} className="text-[0.7rem] text-white mb-1">• {b.content}</div>
                  ))}
                  {activeTooltip === 'liberdade' && activeVicesList.map(v => (
                    <div key={v.viceId} className="text-[0.7rem] text-white mb-1">
                      • {v.viceId === 'tabagismo' ? 'TABAGISMO' : v.viceId.toUpperCase()} <span className="text-[0.6rem] text-slate-500">({v.mode === 'missao-antitabagismo' ? 'MISSÃO' : 'ATIVO'})</span>
                    </div>
                  ))}
                </>
              ) : (
                <span className="text-[0.65rem] text-slate-600">Nenhuma tarefa ativa.</span>
              )}
            </div>

            {/* Banner de Ação Necessária */}
            {!isPillarProfileFilled(activeTooltip) && (
              <div className="mt-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-2.5 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(250,204,21,0.4)] animate-pulse">
                  <span className="text-black text-[12px] font-black leading-none mt-[1px]">!</span>
                </span>
                <div>
                  <span className="text-[0.65rem] font-black text-yellow-400 block mb-0.5 uppercase">Ação Necessária</span>
                  <span className="text-[0.65rem] text-yellow-100/70 block leading-tight">
                    Clique aqui para preencher as informações base deste pilar.
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERLAY: PILLAR PAGE */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activePillarOverlay && (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[100005] bg-[#0a0c0a] flex flex-col pointer-events-auto"
            >
              <div className="absolute top-6 right-6 z-[60]">
                <button
                  onClick={() => setActivePillarOverlay(null)}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-xl"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <PillarPage pillarId={activePillarOverlay} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
