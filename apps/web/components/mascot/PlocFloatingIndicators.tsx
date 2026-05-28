/**
 * @module PlocFloatingIndicators
 * @description Componente visual que escuta as mudanças de atributos no Blackboard Event Bus e exibe
 * pequenos indicadores numéricos (+1 / -1) flutuando sobre a cabeça do mascote Ploc para demonstrar a mudança de stats.
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Brain, Heart, Bird, Flag, Apple, Droplet, LucideIcon } from 'lucide-react';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '@/modules/blackboard/events/eventBus';

const PILLAR_ICONS: Record<string, LucideIcon> = {
  corpo: Activity,
  mente: Brain,
  vida: Heart,
  liberdade: Bird,
  proposito: Flag,
  food: Apple,
  water: Droplet
};

const PILLAR_COLORS: Record<string, string> = {
  corpo: '#ef4444',
  mente: '#38bdf8',
  vida: '#facc15',
  liberdade: '#2dd4bf',
  proposito: '#c084fc',
  food: '#ef4444',
  water: '#3b82f6'
};

interface Indicator {
  id: string;
  pillar: string;
  diff: number;
  xOffset: number;
  label?: string;
}

interface PlocFloatingIndicatorsProps {
  gameMode: string | null;
  onboardingStage: string;
}

export function PlocFloatingIndicators({ gameMode, onboardingStage }: PlocFloatingIndicatorsProps) {
  const [indicators, setIndicators] = useState<Indicator[]>([]);

  useEffect(() => {
    const isPhase1 = gameMode === 'onboarding_game' && ['corpo', 'mente', 'vida', 'liberdade', 'proposito'].includes(onboardingStage);

    const unsubAttr = blackboardEventBus.subscribe(
      BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED,
      (change: { pillar: string; diff: number }) => {
        if (isPhase1) return;
        if (!change || !change.pillar || change.diff === 0) return;
        if (change.pillar === 'foco') return;

        const id = Math.random().toString();
        setIndicators(prev => {
          let xOffset = 0;
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            if (last.xOffset === 0) {
              xOffset = change.diff > 0 ? 25 : -25;
            } else {
              xOffset = -last.xOffset;
            }
          }
          return [...prev, {
            id,
            pillar: change.pillar,
            diff: change.diff,
            xOffset
          }];
        });

        setTimeout(() => {
          setIndicators(prev => prev.filter(ind => ind.id !== id));
        }, 1500);
      }
    );

    const unsubEat = blackboardEventBus.subscribe('PLOC_EAT', (payload: any) => {
      const type = payload?.type || 'food';
      const id = Math.random().toString();
      
      setIndicators(prev => {
        const xOffset = (Math.random() - 0.5) * 40; // Aleatoriza a posição pra não encavalar
        return [...prev, {
          id,
          pillar: type === 'water' ? 'water' : 'food',
          diff: type === 'water' ? 15 : 20, // Valores de exemplo para hidratação e saciedade
          xOffset,
          label: type === 'water' ? 'Hidratação' : 'Saciedade'
        }];
      });

      setTimeout(() => {
        setIndicators(prev => prev.filter(ind => ind.id !== id));
      }, 2000);
    });

    return () => {
      unsubAttr();
      unsubEat();
    };
  }, [gameMode, onboardingStage]);

  if (indicators.length === 0) return null;

  return (
    <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none z-[999999]">
      <AnimatePresence>
        {indicators.map(ind => {
          const Icon = PILLAR_ICONS[ind.pillar];
          const color = PILLAR_COLORS[ind.pillar] || '#fff';
          return (
            <motion.div
              key={ind.id}
              initial={{ opacity: 0, y: 15, scale: 0.6, x: `calc(-50% + ${ind.xOffset}px)` }}
              animate={{ opacity: 1, y: -55, scale: 1, x: `calc(-50% + ${ind.xOffset}px)` }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 120, damping: 10, duration: 1.2 }}
              className="absolute flex items-center gap-1 px-2 py-0.5 rounded-full border shadow-lg backdrop-blur-[2px] font-black text-[11px]"
              style={{
                borderColor: `${color}60`,
                background: 'rgba(15, 23, 42, 0.85)',
                color: ind.diff > 0 ? '#4ade80' : '#f87171',
                boxShadow: `0 4px 12px ${color}30`
              }}
            >
              {Icon && <Icon size={10} style={{ color }} />}
              <span>{ind.diff > 0 ? `+${ind.diff}` : ind.diff}</span>
              {ind.label && <span className="ml-0.5 text-white/80 font-semibold tracking-wide text-[9px] uppercase">{ind.label}</span>}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
