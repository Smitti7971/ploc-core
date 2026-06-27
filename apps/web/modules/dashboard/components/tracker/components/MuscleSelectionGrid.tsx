import React from 'react';
import { motion } from 'framer-motion';
import { useFitnessProfileStore } from '../store/useFitnessProfileStore';
import { Activity } from 'lucide-react';

export function MuscleSelectionGrid() {
  const muscleRecovery = useFitnessProfileStore(state => state.muscleRecovery);
  const muscles = Object.values(muscleRecovery);

  const muscleNamesBR: Record<string, string> = {
    abs: 'Abdômen', chest: 'Peito', back: 'Costas', biceps: 'Bíceps',
    quadriceps: 'Quadríceps', glutes: 'Glúteos', hamstrings: 'Posteriores',
    shoulders: 'Ombros', triceps: 'Tríceps'
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar pb-32">
      <div className="mb-8">
        <h2 className="text-xl font-medium text-white">Selecione os grupos musculares que deseja treinar:</h2>
      </div>

      <div className="grid grid-cols-3 gap-x-4 gap-y-8">
        {muscles.map((muscle, idx) => {
          const color = muscle.recoveryPercentage < 50 ? 'text-red-500' : muscle.recoveryPercentage < 80 ? 'text-orange-500' : 'text-zinc-300';
          const isSelected = idx === 0 || idx === 6 || idx === 8; // Mocking selection state based on image
          const ringColor = isSelected ? '#ef4444' : '#27272a';
          
          return (
            <motion.div 
              key={muscle.muscleId}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              {/* Large Anatomical Placeholder */}
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-black transition-colors overflow-hidden">
                <svg className="absolute inset-0 w-full h-full -rotate-90 z-20 pointer-events-none" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="2"
                    className="transition-colors duration-300"
                  />
                </svg>
                {/* Imagem do músculo gerada cobrindo todo o círculo */}
                <div className="absolute inset-0 rounded-full overflow-hidden z-10">
                  <img 
                    src={`/muscles/${muscle.muscleId}.png`} 
                    alt={muscleNamesBR[muscle.muscleId] || muscle.name} 
                    className={`w-full h-full object-cover scale-125 transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-80'}`}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className={`text-sm font-medium ${isSelected ? 'text-red-500' : 'text-zinc-300'}`}>{muscleNamesBR[muscle.muscleId] || muscle.name}</span>
                <span className={`text-xs font-bold ${color}`}>{muscle.recoveryPercentage}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
