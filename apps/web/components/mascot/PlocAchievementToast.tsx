/**
 * @module PlocAchievementToast
 * @description Componente para exibir notificações (toasts) de conquistas do Ploc.
 */

import { AnimatePresence, motion } from 'framer-motion';

interface PlocAchievementToastProps {
  toast: { title: string; message: string } | null;
}

export function PlocAchievementToast({ toast }: PlocAchievementToastProps) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.8 }}
          animate={{ opacity: 1, y: -90, scale: 1 }}
          exit={{ opacity: 0, y: -120, scale: 0.8 }}
          className="absolute left-1/2 -translate-x-1/2 w-[220px] bg-slate-950/95 border border-amber-500/50 rounded-2xl p-2.5 shadow-[0_8px_32px_rgba(245,158,11,0.25)] flex flex-col gap-1 items-center text-center z-[9999999] backdrop-blur-[6px]"
        >
          <div className="absolute inset-0 bg-amber-500/5 rounded-2xl animate-pulse pointer-events-none" />
          <div className="text-xl animate-bounce">🏆</div>
          <div className="text-[9.5px] font-black uppercase tracking-wider text-amber-400">Conquista Desbloqueada!</div>
          <div className="text-[11px] font-black text-white leading-tight">{toast.title}</div>
          <div className="text-[9px] text-slate-300 leading-tight font-medium mt-0.5">{toast.message}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
