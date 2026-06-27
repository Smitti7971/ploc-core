import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useFitnessProfileStore } from '../store/useFitnessProfileStore';
import { Activity, CircleDashed } from 'lucide-react';

export function MuscleRecoveryCarousel() {
  const muscleRecovery = useFitnessProfileStore(state => state.muscleRecovery);
  const scrollRef = useRef<HTMLDivElement>(null);

  const muscles = Object.values(muscleRecovery);

  const muscleNamesBR: Record<string, string> = {
    abs: 'Abdômen', chest: 'Peito', back: 'Costas', biceps: 'Bíceps',
    quadriceps: 'Quadríceps', glutes: 'Glúteos', hamstrings: 'Posteriores',
    shoulders: 'Ombros', triceps: 'Tríceps'
  };

  return (
    <div className="w-full relative py-4 bg-zinc-900 border-b border-white/5">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 px-6 no-scrollbar pb-2 snap-x"
      >
        {muscles.map((muscle) => {
          const color = muscle.recoveryPercentage < 50 ? 'text-red-500' : muscle.recoveryPercentage < 80 ? 'text-orange-500' : 'text-zinc-300';
          const strokeColor = muscle.recoveryPercentage < 50 ? '#ef4444' : muscle.recoveryPercentage < 80 ? '#f97316' : '#d4d4d8';

          return (
            <motion.div 
              key={muscle.muscleId}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2 shrink-0 snap-center cursor-pointer group"
            >
              <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-black border border-white/5 transition-colors overflow-hidden">
                <svg className="absolute inset-0 w-full h-full -rotate-90 z-20 pointer-events-none" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="#27272a"
                    strokeWidth="4"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="4"
                    strokeDasharray={`${(muscle.recoveryPercentage / 100) * 289} 289`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Imagem do músculo gerada cobrindo todo o círculo */}
                <div className="absolute inset-0 rounded-full overflow-hidden z-10">
                  <img 
                    src={`/muscles/${muscle.muscleId}.png`} 
                    alt={muscleNamesBR[muscle.muscleId] || muscle.name} 
                    className="w-full h-full object-cover scale-125 opacity-80 group-hover:opacity-100 transition-all"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">{muscleNamesBR[muscle.muscleId] || muscle.name}</span>
                <span className={`text-xs font-bold ${color}`}>{muscle.recoveryPercentage}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
