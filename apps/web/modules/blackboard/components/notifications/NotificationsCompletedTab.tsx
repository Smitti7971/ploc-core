import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationsCompletedTabProps {
  activeTrackers: any[];
  trackersToUpdate: any[];
  tarefas: any[];
  trackerLogs: any[];
  todayTimestamp: number;
  confirmingTracker: string | null;
  setConfirmingTracker: (id: string | null) => void;
  confirmingTask: string | null;
  setConfirmingTask: (id: string | null) => void;
  setDetailedTrackerId: (id: string | null) => void;
  addLog: (log: any) => void;
}

export function NotificationsCompletedTab({
  activeTrackers,
  trackersToUpdate,
  tarefas,
  trackerLogs,
  todayTimestamp,
  confirmingTracker,
  setConfirmingTracker,
  confirmingTask,
  setConfirmingTask,
  setDetailedTrackerId,
  addLog
}: NotificationsCompletedTabProps) {

  const completedTrackers = activeTrackers.filter(t => !trackersToUpdate.includes(t));
  const completedTarefas = tarefas.filter(t => {
    const itemLogs = trackerLogs?.filter(l => l.trackerItemId === t.id && l.timestamp >= todayTimestamp) || [];
    return itemLogs.length > 0;
  });

  return (
    <div className="flex flex-col gap-3">
      {completedTrackers.length === 0 && completedTarefas.length === 0 && (
        <p className="text-white/40 text-xs text-center py-4">Nenhuma tarefa concluída hoje.</p>
      )}

      {/* Tarefas Concluídas (Acompanhe) */}
      {completedTrackers.map(t => {
        const itemLogs = trackerLogs?.filter(l => l.trackerItemId === t.id && l.timestamp >= todayTimestamp) || [];
        const lastLog = itemLogs.sort((a, b) => b.timestamp - a.timestamp)[0];
        
        return (
          <div 
            key={`completed-${t.id}`} 
            onClick={() => {
              if (confirmingTracker === t.id) setConfirmingTracker(null);
              else setConfirmingTracker(t.id);
            }}
            className="border border-white/5 bg-white/5 rounded-xl p-3 flex gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer relative overflow-hidden"
          >
             <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-bold truncate line-through text-white/50">{t.name}</span>
                <span className="text-[10px] text-white/40 mt-1">
                   ✓ Concluído às {new Date(lastLog?.timestamp || Date.now()).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                </span>
             </div>
             
             <AnimatePresence>
                {confirmingTracker === t.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md z-10 flex items-center justify-center gap-3 px-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addLog({ trackerItemId: t.id, type: 'milestone', timestamp: Date.now() });
                        setConfirmingTracker(null);
                      }}
                      className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-2 rounded-xl text-[10px] font-black tracking-widest flex-1 uppercase"
                    >
                      Fazer Registro
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailedTrackerId(t.id);
                        setConfirmingTracker(null);
                      }}
                      className="bg-white/10 text-white border border-white/20 px-3 py-2 rounded-xl text-[10px] font-black tracking-widest flex-1 uppercase"
                    >
                      Abrir Tarefa
                    </button>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        );
      })}

      {/* Tarefas Concluídas (Outros Vícios/Hábitos) */}
      {completedTarefas.map(t => {
        const itemLogs = trackerLogs?.filter(l => l.trackerItemId === t.id && l.timestamp >= todayTimestamp) || [];
        const lastLog = itemLogs.sort((a, b) => b.timestamp - a.timestamp)[0];
        
        return (
          <div 
            key={`completed-${t.id}`} 
            onClick={() => {
              if (confirmingTask === t.id) setConfirmingTask(null);
              else setConfirmingTask(t.id);
            }}
            className="border border-white/5 bg-white/5 rounded-xl p-3 flex gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer relative overflow-hidden"
          >
             <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-bold truncate line-through text-white/50">{t.config?.customName || t.name.toUpperCase()}</span>
                <span className="text-[10px] text-white/40 mt-1">
                   Concluído às {new Date(lastLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
             </div>
             
             <AnimatePresence>
                {confirmingTask === t.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md z-10 flex items-center justify-center gap-3 px-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addLog({ trackerItemId: t.id, type: 'milestone', timestamp: Date.now() });
                        setConfirmingTask(null);
                      }}
                      className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-2 rounded-xl text-[10px] font-black tracking-widest flex-1 uppercase"
                    >
                      Fazer Registro
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailedTrackerId(t.id);
                        setConfirmingTask(null);
                      }}
                      className="bg-white/10 text-white border border-white/20 px-3 py-2 rounded-xl text-[10px] font-black tracking-widest flex-1 uppercase"
                    >
                      Abrir Tarefa
                    </button>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
