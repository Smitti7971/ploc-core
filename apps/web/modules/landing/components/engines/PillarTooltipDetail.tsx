'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Brain, Heart, Bird, Flag } from 'lucide-react';
import { PANEL_TRANSITION } from '../../constants';

export const PILLARS_CONFIG = {
  corpo: { label: 'CORPO', color: '#ef4444', icon: Activity, desc: 'Saúde, sono e energia física. Afetado por exercícios, hidratação e descanso.' },
  mente: { label: 'MENTE', color: '#38bdf8', icon: Brain, desc: 'Foco, clareza e aprendizado. Afetado por estudos, reflexão e journaling.' },
  vida: { label: 'VIDA', color: '#facc15', icon: Heart, desc: 'Equilíbrio, lazer e relações. Afetado por hobbies, família e novas experiências.' },
  liberdade: { label: 'LIBERDADE', color: '#2dd4bf', icon: Bird, desc: 'Autonomia e finanças. Afetado por economia, reserva e redução de dependências.' },
  proposito: { label: 'PROPÓSITO', color: '#c084fc', icon: Flag, desc: 'Direção e progresso existencial. Afetado por projetos pessoais e metas reais.' }
};

interface PillarTooltipPanelProps {
  activeTooltip: string | null;
  attributes: any;
}

export default function PillarTooltipPanel({ activeTooltip, attributes }: PillarTooltipPanelProps) {
  return (
    <AnimatePresence>
      {activeTooltip && (() => {
        const config = PILLARS_CONFIG[activeTooltip as keyof typeof PILLARS_CONFIG];
        if (!config) return null;
        const value = attributes[activeTooltip] ?? 3;

        const getStatusColor = (val: number) => {
          if (val >= 5) return '#22c55e';
          return config.color;
        };

        const statusColor = getStatusColor(value);

        return (
          <motion.div
            initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 20, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
            transition={PANEL_TRANSITION}
            className="inline-flex flex-col items-center bg-slate-900/45 backdrop-blur-md rounded-[20px] px-6 py-4 max-w-[540px] w-[90%] pointer-events-auto mt-[25px] z-20"
            style={{
              border: `1.5px solid ${statusColor}35`
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: statusColor,
                  boxShadow: `0 0 12px ${statusColor}`
                }}
              />
              <h4
                className="text-white m-0 text-base font-black tracking-[1.2px] uppercase font-outfit"
              >
                {config.label} <span style={{ color: statusColor }}>NÍVEL {value}/5</span>
              </h4>
            </div>
            <p
              className="text-[0.85rem] text-white/75 m-0 text-center leading-relaxed font-outfit"
            >
              {config.desc}
            </p>
          </motion.div>
        );
      })()}
    </AnimatePresence>
  );
}
