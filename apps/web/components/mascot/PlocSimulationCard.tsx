/**
 * ============================================================================
 * Card de Simulação - PlocSimulationCard.tsx
 * ============================================================================
 * Descrição: Balão flutuante de simulação de hábitos que exibe o impacto projetado
 * nas estatísticas de bem-estar (Corpo, Mente, Vida, Liberdade, Propósito) ao
 * arrastar o Ploc sobre uma rotina.
 * 
 * Principais responsabilidades:
 * - Apresenta o título, descrição e ícone temático do pilar do hábito focado.
 * - Calcula e exibe graficamente a progressão das estatísticas (ex: 50% → 55%).
 * - Totalmente estilizado com Tailwind CSS moderno e animações com Framer Motion.
 * ============================================================================
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { RoutineOption, IMPACT_ICONS } from '@/modules/routines/data/routinesData';
import { UserAttributes } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';

interface PlocSimulationCardProps {
  focusedRoutine: RoutineOption;
  focusedPillar: string;
  attributes: UserAttributes;
}

export function PlocSimulationCard({
  focusedRoutine,
  focusedPillar,
  attributes,
}: PlocSimulationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 15, scale: 0.9 }}
      className="absolute bottom-[125%] left-1/2 -translate-x-1/2 w-[260px] bg-slate-950/95 border border-sky-500/30 rounded-2xl p-4 z-[999] backdrop-blur-md flex flex-col gap-3 [box-shadow:0_20px_40px_rgba(0,0,0,0.5),_inset_0_0_15px_rgba(56,189,248,0.1)]"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
          {focusedPillar && IMPACT_ICONS[focusedPillar as keyof typeof IMPACT_ICONS] ? (
            (() => {
              const IconComp = IMPACT_ICONS[focusedPillar as keyof typeof IMPACT_ICONS];
              return <IconComp size={16} />;
            })()
          ) : (
            <Sparkles size={16} />
          )}
        </div>
        <div className="flex-1 flex flex-col">
          <span className="text-[10px] text-sky-400 font-semibold uppercase tracking-wider">
            {focusedPillar === 'corpo' ? 'Corpo' : focusedPillar === 'mente' ? 'Mente' : focusedPillar === 'vida' ? 'Vida' : focusedPillar === 'liberdade' ? 'Liberdade' : 'Propósito'}
          </span>
          <span className="text-xs text-slate-50 font-semibold">
            {focusedRoutine.title}
          </span>
        </div>
      </div>

      {/* Descrição */}
      <p className="text-[11px] text-slate-400 m-0 leading-relaxed">
        {focusedRoutine.desc}
      </p>

      {/* Impacto Previsto */}
      <div className="bg-white/[0.03] rounded-lg py-2 px-2.5 border border-white/[0.05]">
        <span className="text-[9px] text-slate-500 block mb-1 uppercase">
          Impacto Previsto (Se Realizado):
        </span>
        <div className="flex gap-3">
          {focusedRoutine.impacts.map((impact) => {
            const key = impact.pilar;
            const val = impact.val;
            const currentVal = attributes[key] || 0;
            const targetVal = Math.min(100, Math.max(0, currentVal + val));
            const isPositive = val >= 0;

            return (
              <div key={key} className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-200 capitalize">
                  {key === 'corpo' ? 'Corpo' : key === 'mente' ? 'Mente' : key === 'vida' ? 'Vida' : key === 'liberdade' ? 'Liberdade' : 'Propósito'}:
                </span>
                <span className={`text-[11px] font-semibold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                  {currentVal}% → {targetVal}% ({isPositive ? '+' : ''}{val}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
