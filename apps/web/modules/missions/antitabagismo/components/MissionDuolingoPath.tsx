'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Check, Lock, Play, Sparkles, Star,
  Activity, Shield, Heart, Zap, Award, X
} from 'lucide-react';
import { useViceStore } from '@/modules/dashboard/components/libertesse/store/viceStore';
import { attributeEngine } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';
import { PlocAvatarClient } from '@/components/mascot/PlocAvatarClient';

export interface MissionStage {
  id: number;
  dayText: string;
  title: string;
  desc: string;
  challenge: string;
  rewardText: string;
  rewardStats: { body?: number; mind?: number; xp?: number };
}

export const STAGES: MissionStage[] = [
  {
    id: 0,
    dayText: "ESTÁGIO 1",
    title: "A Grande Decisão",
    desc: "A jornada de mil milhas começa com o primeiro passo.",
    challenge: "Jogue fora todos os cinzeiros, isqueiros e maços de cigarro de sua casa e escritório. Crie um ambiente 100% purificado.",
    rewardText: "+15 Corpo, +10 Foco",
    rewardStats: { body: 15, xp: 10 }
  },
  {
    id: 1,
    dayText: "ESTÁGIO 2",
    title: "Primeiras 24 Horas",
    desc: "O monóxido de carbono e a nicotina começam a deixar seu corpo.",
    challenge: "Fique 24 horas inteiras sem fumar nenhum cigarro. Quando sentir fissura, beba um copo de água extremamente gelada imediatamente.",
    rewardText: "+20 Mente, +15 Foco",
    rewardStats: { mind: 20, xp: 15 }
  },
  {
    id: 2,
    dayText: "ESTÁGIO 3",
    title: "Pico de Limpeza",
    desc: "Seus pulmões começam a relaxar e a capacidade respiratória aumenta.",
    challenge: "Realize 3 sessões de respiração controlada (4s inspira, 4s segura, 4s expira) hoje para acalmar a ansiedade física.",
    rewardText: "+15 Corpo, +15 Mente",
    rewardStats: { body: 15, mind: 15 }
  },
  {
    id: 3,
    dayText: "ESTÁGIO 4",
    title: "Olfato Restaurado",
    desc: "Suas terminações nervosas olfativas e gustativas voltam a crescer.",
    challenge: "Saboreie uma refeição de forma extremamente lenta hoje, listando mentalmente 3 sabores/temperos novos que você não sentia antes.",
    rewardText: "+20 Corpo, +20 Foco",
    rewardStats: { body: 20, xp: 20 }
  },
  {
    id: 4,
    dayText: "ESTÁGIO 5",
    title: "Uma Semana Limpa",
    desc: "Primeiro grande marco de oxigenação corporal completa!",
    challenge: "Escreva em um papel (ou nota mental) seus 3 maiores motivos de vitória pessoal e leia-os em voz alta ao acordar.",
    rewardText: "+25 Mente, +30 Foco",
    rewardStats: { mind: 25, xp: 30 }
  },
  {
    id: 5,
    dayText: "ESTÁGIO 6",
    title: "Vencendo Gatilhos",
    desc: "O cérebro reconfigura a rotina de hábitos sem nicotina.",
    challenge: "Se houver gatilho para acender um cigarro (ex: após o almoço ou estresse), faça uma caminhada rápida de 5 min ou tome um chá gelado.",
    rewardText: "+15 Mente, +15 Foco",
    rewardStats: { mind: 15, xp: 15 }
  },
  {
    id: 6,
    dayText: "ESTÁGIO 7",
    title: "Regeneração Física",
    desc: "A circulação sanguínea periférica e a fadiga caem drasticamente.",
    challenge: "Pratique 20 minutos de exercícios físicos moderados (corrida, agachamentos, alongamento) para comemorar seu fôlego novo.",
    rewardText: "+30 Corpo, +20 Foco",
    rewardStats: { body: 30, xp: 20 }
  },
  {
    id: 7,
    dayText: "ESTÁGIO 8",
    title: "Pulmões Livres",
    desc: "Seus cílios bronquiais limpam as vias aéreas de resíduos antigos.",
    challenge: "Consuma pelo menos 2.5 litros de água hoje para expulsar toxinas residuais e manter sua garganta hidratada.",
    rewardText: "+20 Corpo, +10 Mente",
    rewardStats: { body: 20, mind: 10 }
  },
  {
    id: 8,
    dayText: "ESTÁGIO 9",
    title: "Nova Plasticidade",
    desc: "O cérebro se acostuma à dopamina natural livre de vícios.",
    challenge: "Compartilhe sua jornada de quase um mês com alguém próximo ou tire 10 minutos para meditar em silêncio profundo.",
    rewardText: "+25 Mente, +25 Foco",
    rewardStats: { mind: 25, xp: 25 }
  },
  {
    id: 9,
    dayText: "ESTÁGIO 10",
    title: "Liberdade Absoluta!",
    desc: "O grande troféu de ouro da reconquista da sua vida saudável.",
    challenge: "Comemore 30 dias sem cigarro! Dê um presente a si mesmo usando o dinheiro economizado no período. Você é livre!",
    rewardText: "+50 Corpo, +50 Mente, +100 Foco",
    rewardStats: { body: 50, mind: 50, xp: 100 }
  }
];

interface NodeConfig {
  id: number;
  x: number;
  y: number;
  isTrophy?: boolean;
}

// Zigue-Zague vertical com coordenadas 100% simétricas e centralizadas
const NODES_CONFIG: NodeConfig[] = [
  { id: 0, x: 50, y: 7 },
  { id: 1, x: 76, y: 16 },
  { id: 2, x: 50, y: 25 },
  { id: 3, x: 24, y: 34 },
  { id: 4, x: 50, y: 43 },
  { id: 5, x: 76, y: 52 },
  { id: 6, x: 50, y: 61 },
  { id: 7, x: 24, y: 70 },
  { id: 8, x: 50, y: 79 },
  { id: 9, x: 76, y: 88 },
  { id: 10, x: 50, y: 96, isTrophy: true }
];

export function MissionDuolingoPath() {
  const { activeVices, advanceAntitabagismoLevel } = useViceStore();
  const currentLevel = activeVices['tabagismo']?.antitabagismoLevel ?? 0;

  const [selectedStage, setSelectedStage] = useState<MissionStage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [celebrateEffect, setCelebrateEffect] = useState(false);

  useEffect(() => {
    const activeIndex = Math.min(STAGES.length - 1, currentLevel);
    setSelectedStage(STAGES[activeIndex]);
  }, [currentLevel]);

  const handleCompleteChallenge = (stage: MissionStage) => {
    const stats = stage.rewardStats;
    if (stats.body) {
      attributeEngine.applySleepPenalty();
      const engine = attributeEngine as any;
      if (engine.updateAttribute) {
        if (stats.body) engine.updateAttribute('corpo', stats.body);
        if (stats.mind) engine.updateAttribute('mente', stats.mind);
      } else {
        attributeEngine.applySleepPenalty();
      }
    }

    if (stats.xp && (attributeEngine as any).updateScore) {
      (attributeEngine as any).updateScore(stats.xp);
    }

    advanceAntitabagismoLevel('tabagismo');

    setCelebrateEffect(true);
    setTimeout(() => {
      setCelebrateEffect(false);
      setIsModalOpen(false);
      const nextIndex = Math.min(STAGES.length - 1, stage.id + 1);
      setSelectedStage(STAGES[nextIndex]);
    }, 2000);
  };

  const handleTileClick = (e: React.MouseEvent, stageId: number) => {
    e.stopPropagation();
    if (stageId === 10) return;

    const stage = STAGES.find(s => s.id === stageId);
    if (stage) {
      setSelectedStage(stage);
      setIsModalOpen(true);
    }
  };

  const activeIndex = Math.min(10, currentLevel);
  const activeNode = NODES_CONFIG.find(n => n.id === activeIndex) || NODES_CONFIG[0];

  return (
    <div className="w-full h-full relative overflow-y-auto overflow-x-hidden flex flex-col items-center bg-gradient-to-b from-[#080711] via-[#100720] to-[#041215] custom-scrollbar pt-28 pb-16">

      {/* Grid de Partículas / Poeira Cósmica no Fundo */}
      {/* <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1.5px,transparent_1.5px)] bg-[size:3rem_3rem] pointer-events-none" /> */}

      {/* Nebulosas Suaves de Fundo (Coloridas) */}
      {/* <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" /> */}
      {/* <div className="absolute bottom-[25%] right-[20%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[140px] pointer-events-none" /> */}
      <div className="absolute top-[50%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Prancha de Jogo com Caminho Físico Paved (Estrada) */}
      <div className="w-full max-w-[450px] h-[1600px] shrink-0 relative select-none">

        {/* Conexão SVG representando a Estrada / Trilha Real */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            {/* Gradiente da Trilha */}
            {/* <linearGradient id="road-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="45%" stopColor="#eab308" />
              <stop offset="90%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient> */}

            {/* Filtro Neon */}
            {/* <filter id="neon-glow-vert-heavy" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter> */}
          </defs>

          {/* 1. Base da Estrada (The Paved Track) - Cria a sensação física de caminho/estrada */}
          <path
          // d="M 50 7 L 76 16 L 50 25 L 24 34 L 50 43 L 76 52 L 50 61 L 24 70 L 50 79 L 76 88 L 50 96"
          // fill="none"
          // stroke="rgba(255, 255, 255, 0.05)"
          // strokeWidth="32"
          // strokeLinecap="round"
          // strokeLinejoin="round"
          />

          {/* Bordas Pontilhadas da Estrada */}
          <path
          // d="M 50 7 L 76 16 L 50 25 L 24 34 L 50 43 L 76 52 L 50 61 L 24 70 L 50 79 L 76 88 L 50 96"
          // fill="none"
          // stroke="rgba(255,255,255,0.08)"
          // strokeWidth="34"
          // strokeLinecap="round"
          // strokeLinejoin="round"
          // style={{ strokeDasharray: '4 12' }}
          />

          {/* 2. O núcleo de progresso luminoso central */}
          <path
            d="M 50 7 L 76 16 L 50 25 L 24 34 L 50 43 L 76 52 L 50 61 L 24 70 L 50 79 L 76 88 L 50 96"
            fill="none"
            stroke="url(#road-grad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neon-glow-vert-heavy)"
            style={{ strokeDasharray: '12 6', animation: 'flowDots 25s linear infinite' }}
          />
        </svg>

        <style>{`
          @keyframes flowDots {
            to {
              stroke-dashoffset: -1000;
            }
          }
        `}</style>

        {/* O MASCOTE PLOC MARCANDO A POSIÇÃO ATUAL */}
        <div
          style={{
            position: 'absolute',
            left: `${activeNode.x}%`,
            top: `${activeNode.y}%`,
            transform: 'translate(-50%, -108%)',
            zIndex: 100,
            pointerEvents: 'none'
          }}
          className="w-24 h-24 transition-all duration-1000 ease-out flex items-center justify-center filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.7)]"
        >
          {/* Sombra de pé gelatinosa brilhante abaixo do Ploc 100% CENTRALIZADA */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-yellow-400/30 blur-md rounded-full scale-y-50 animate-pulse" />

          <PlocAvatarClient
            draggable={false}
            emotion={currentLevel >= 10 ? 'happy' : celebrateEffect ? 'happy' : 'calm'}
          />
        </div>

        {/* Renderização das Casinhas (Bolhas de Vidro Orgânicas com Efeitos Leves) */}
        {NODES_CONFIG.map((node) => {
          const isCompleted = node.id < currentLevel;
          const isActive = node.id === currentLevel;
          const isLocked = node.id > currentLevel;

          let bubbleStyle = {};
          let glowClass = "";

          if (isCompleted) {
            bubbleStyle = {
              background: 'radial-gradient(circle at 35% 35%, rgba(16, 185, 129, 0.45) 0%, rgba(6, 95, 70, 0.25) 70%, rgba(4, 120, 87, 0.15) 100%)',
              border: '2px solid rgba(16, 185, 129, 0.55)',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35), inset 0 2px 10px rgba(255, 255, 255, 0.2), inset 0 -4px 12px rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)'
            };
            glowClass = "shadow-[0_0_15px_rgba(16,185,129,0.3)]";
          } else if (isActive) {
            bubbleStyle = {
              background: 'radial-gradient(circle at 35% 35%, rgba(253, 224, 71, 0.4) 0%, rgba(30, 27, 75, 0.3) 70%, rgba(234, 179, 8, 0.15) 100%)',
              border: '3px solid rgba(234, 179, 8, 0.75)',
              boxShadow: '0 12px 32px rgba(234, 179, 8, 0.5), inset 0 2px 8px rgba(255, 255, 255, 0.4), inset 0 -4px 12px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)'
            };
          } else if (isLocked) {
            bubbleStyle = {
              background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0.45) 75%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: 'inset 0 1px 4px rgba(255, 255, 255, 0.05), inset 0 -2px 6px rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              opacity: 0.45
            };
          }

          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 20,
                width: node.isTrophy ? '76px' : '58px',
                height: node.isTrophy ? '76px' : '58px',
              }}
              className="relative"
            >
              <motion.button
                whileHover={!node.isTrophy ? { scale: 1.15, y: -4 } : {}}
                whileTap={!node.isTrophy ? { scale: 0.92 } : {}}
                animate={isActive ? {
                  borderRadius: ["50%", "47% 53% 50% 50%", "52% 48% 51% 49%", "50%"],
                  y: [0, -3, 0]
                } : {
                  borderRadius: "50%"
                }}
                transition={isActive ? {
                  borderRadius: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                } : {}}
                onClick={(e) => handleTileClick(e, node.id)}
                style={{
                  width: '100%',
                  height: '100%',
                  ...bubbleStyle
                }}
                className={`relative flex items-center justify-center transition-all duration-300 ${glowClass}`}
              >
                {/* 1. BRILHO ESPECULAR (Brilho 3D de bolha de vidro) */}
                <div className="absolute top-1 left-2.5 w-4 h-2 bg-gradient-to-b from-white/35 to-transparent rounded-full transform -rotate-12 pointer-events-none" />

                {/* 2. Sombra e profundidade interna secundária */}
                <div className="absolute bottom-1 right-2 w-3 h-1.5 bg-black/25 rounded-full blur-[1px] pointer-events-none" />

                {/* Halo pulsante na bolha ativa */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 1, opacity: 0.3 }}
                    animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-[-4px] rounded-full border border-yellow-400/40 pointer-events-none"
                  />
                )}

                {/* Conteúdo interno */}
                {node.isTrophy ? (
                  <Trophy
                    size={32}
                    className={currentLevel >= 10 ? 'text-yellow-300 animate-bounce drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'text-white/10'}
                  />
                ) : isCompleted ? (
                  <Check size={20} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-black" />
                ) : isActive ? (
                  <Play size={18} className="text-yellow-300 fill-yellow-300 ml-0.5 drop-shadow-[0_2px_5px_rgba(0,0,0,0.4)]" />
                ) : (
                  <Lock size={15} className="text-white/20" />
                )}
              </motion.button>

              {/* Texto do Estágio posicionado ABSOLUTAMENTE abaixo da bolha, com alinhamento perfeito de centro */}
              <div className="absolute top-[100%] left-1/2 transform -translate-x-1/2 whitespace-nowrap mt-2 z-10 pointer-events-none">
                <span
                  className={`text-[8.5px] font-black tracking-widest uppercase ${isActive ? 'text-yellow-400 font-black drop-shadow-[0_0_5px_rgba(234,179,8,0.2)]' : isCompleted ? 'text-emerald-400 font-bold' : 'text-white/15'
                    }`}
                >
                  {node.isTrophy ? "VITÓRIA" : `ETAPA ${node.id + 1}`}
                </span>
              </div>
            </div>
          );
        })}

      </div>

      {/* MODAL DETALHADO DO DESAFIO */}
      <AnimatePresence>
        {isModalOpen && selectedStage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-zinc-950/95 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col gap-5 z-10 pointer-events-auto"
            >
              {celebrateEffect && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-emerald-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-4 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                  >
                    <Sparkles size={32} />
                  </motion.div>
                  <h3 className="text-white text-lg font-black uppercase tracking-wider">Estágio Superado!</h3>
                  <p className="text-emerald-300 text-xs mt-1 leading-relaxed">
                    Seu Ploc ganhou energia, fôlego expandido e novos atributos! 🌱
                  </p>
                </motion.div>
              )}

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-[10px] bg-white/5 border border-white/10 w-fit px-3 py-1 rounded-full text-slate-400 font-bold uppercase tracking-widest">
                  {selectedStage.dayText}
                </span>
                <h3 className="text-white text-lg font-black tracking-wide leading-tight mt-1">
                  {selectedStage.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {selectedStage.desc}
                </p>
              </div>

              <div className="bg-black/45 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                <span className="text-[9px] font-black text-yellow-400 uppercase tracking-widest">
                  DESAFIO DO DIA
                </span>
                <p className="text-white text-xs font-bold leading-relaxed">
                  {selectedStage.challenge}
                </p>
              </div>

              <div className="bg-white/2 flex items-center gap-3 border border-white/5 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block leading-none mb-1">
                    RECOMPENSA DO PLOC
                  </span>
                  <span className="text-white text-xs font-black tracking-wide">
                    {selectedStage.rewardText}
                  </span>
                </div>
              </div>

              <div className="mt-2">
                {selectedStage.id === currentLevel ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCompleteChallenge(selectedStage)}
                    className="w-full py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(234,179,8,0.25)]"
                  >
                    <Zap size={16} className="fill-black" />
                    CONCLUIR DESAFIO
                  </motion.button>
                ) : selectedStage.id < currentLevel ? (
                  <div className="w-full py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-bold text-xs tracking-widest uppercase">
                    Etapa Superada com Sucesso! 🌟
                  </div>
                ) : (
                  <div className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-white/20 text-center font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2">
                    <Lock size={14} className="text-white/30" />
                    Etapa Bloqueada no Tabuleiro
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
