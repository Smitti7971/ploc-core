import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ACHIEVEMENTS_LIST } from '@/components/mascot/achievements';

interface PlocAchievementsModalProps {
  unlockedAchievements: Array<{ id: string; date: string }>;
  onClose: () => void;
}

export function PlocAchievementsModal({ unlockedAchievements, onClose }: PlocAchievementsModalProps) {
  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[4px] z-[999999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-md bg-[#090d1f] border border-amber-500/30 rounded-3xl p-5 shadow-[0_20px_50px_rgba(245,158,11,0.2)] relative flex flex-col gap-4"
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white"
        >
          <X size={14} />
        </button>

        <div className="flex items-center gap-3">
          <div className="text-4xl">🏆</div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">SISTEMA DE GAMIFICAÇÃO</span>
            <h2 className="text-lg font-black text-white leading-tight">Conquistas do Ploc</h2>
          </div>
        </div>

        <div className="flex flex-col gap-1 bg-slate-950/60 rounded-2xl p-3 border border-white/5">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
            <span>Progresso de Desbloqueio</span>
            <span className="text-amber-400">{unlockedAchievements.length} / {ACHIEVEMENTS_LIST.length}</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 mt-1 relative">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS_LIST.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto pr-1 scrollbar-hide">
          {ACHIEVEMENTS_LIST.map((ach) => {
            const unlockInfo = unlockedAchievements.find(item => item.id === ach.id);
            const isUnlocked = !!unlockInfo;

            return (
              <div 
                key={ach.id}
                className={`flex gap-3 items-center p-2.5 rounded-2xl border transition-all ${
                  isUnlocked 
                    ? 'bg-amber-500/5 border-amber-500/20' 
                    : 'bg-slate-950/40 border-white/5 opacity-55'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  isUnlocked ? 'bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.25)]' : 'bg-slate-900'
                }`}>
                  {isUnlocked ? ach.icon : '🔒'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <h3 className={`text-xs font-black truncate leading-tight ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                      {ach.title}
                    </h3>
                    {isUnlocked ? (
                      <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0">Libera</span>
                    ) : (
                      <span className="text-[8px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0">Trancado</span>
                    )}
                  </div>
                  <p className="text-[9.5px] text-slate-400 leading-tight mt-0.5 font-semibold">
                    {isUnlocked ? ach.desc : ach.hint}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
