import React from 'react';
import { motion } from 'framer-motion';
import { X, BarChart3 } from 'lucide-react';

interface PlocStatsModalProps {
  attributes: {
    corpo: number;
    mente: number;
    vida: number;
    liberdade: number;
    proposito: number;
  };
  onClose: () => void;
}

export function PlocStatsModal({ attributes, onClose }: PlocStatsModalProps) {
  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[4px] z-modal flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-sm bg-[#0a0b0e] border border-white/10 rounded-3xl p-6 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="text-sky-400" /> Status do PLOC
        </h2>

        <div className="flex flex-col gap-4">
          {[
            { label: 'Corpo', value: attributes.corpo, color: 'text-rose-400', bg: 'bg-rose-500', max: 250 },
            { label: 'Mente', value: attributes.mente, color: 'text-sky-400', bg: 'bg-sky-500', max: 250 },
            { label: 'Vida', value: attributes.vida, color: 'text-emerald-400', bg: 'bg-emerald-500', max: 250 },
            { label: 'Liberdade', value: attributes.liberdade, color: 'text-amber-400', bg: 'bg-amber-500', max: 250 },
            { label: 'Propósito', value: attributes.proposito, color: 'text-violet-400', bg: 'bg-violet-500', max: 250 }
          ].map(attr => (
            <div key={attr.label}>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className={attr.color}>{attr.label}</span>
                <span className="text-white/60">{attr.value} XP</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full ${attr.bg} rounded-full`} style={{ width: `${Math.min(100, (attr.value / attr.max) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
