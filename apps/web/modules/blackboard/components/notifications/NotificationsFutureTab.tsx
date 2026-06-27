import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isFutureForToday } from '../../../dashboard/components/tracker/utils/scheduling';

interface NotificationsFutureTabProps {
  activeTrackers?: any[];
  trackersToUpdate: any[];
  tarefas: any[];
  now: number;
  confirmingTracker: string | null;
  setConfirmingTracker: (id: string | null) => void;
  confirmingTask: string | null;
  setConfirmingTask: (id: string | null) => void;
  setDetailedTrackerId: (id: string | null) => void;
  addLog: (log: any) => void;
}

export function NotificationsFutureTab({
  activeTrackers = [],
  trackersToUpdate,
  tarefas,
  now,
  confirmingTracker,
  setConfirmingTracker,
  confirmingTask,
  setConfirmingTask,
  setDetailedTrackerId,
  addLog
}: NotificationsFutureTabProps) {

  const futureTrackers = trackersToUpdate.filter(t => isFutureForToday(t, now));
  const futureTarefas = tarefas.filter(t => isFutureForToday(t, now));

  const allItemsWithTodos = [...activeTrackers, ...tarefas];
  const allTodos = allItemsWithTodos.flatMap(t => 
    (t.config?.todos || []).map((todo: any) => ({ ...todo, trackerName: t.name, trackerId: t.id }))
  );
  
  const todayStr = new Date(now).toISOString().split('T')[0];
  const futureTodos = allTodos.filter(todo => !todo.completed && todo.date >= todayStr);

  return (
    <div className="flex flex-col gap-3">
      {futureTrackers.length === 0 && futureTarefas.length === 0 && futureTodos.length === 0 && (
        <p className="text-white/40 text-xs text-center py-4">Nenhuma tarefa futura agendada.</p>
      )}

      {futureTrackers.map(t => (
        <div 
          key={t.id} 
          onClick={() => {
            if (confirmingTracker === t.id) setConfirmingTracker(null);
            else setConfirmingTracker(t.id);
          }}
          className="border border-white/5 bg-white/5 rounded-xl p-3 flex gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer relative overflow-hidden"
        >
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-bold truncate text-sky-400" style={{ color: t.config?.color || '#38bdf8' }}>{t.name}</span>
            <span className="text-[10px] mt-1 uppercase font-bold tracking-wider" style={{ color: t.config?.color || '#38bdf8', opacity: 0.5 }}>
              Agendado para {t.config?.expectedTime}
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
      ))}
      
      {futureTarefas.map(t => (
        <div 
          key={t.id} 
          onClick={() => {
            if (confirmingTask === t.id) setConfirmingTask(null);
            else setConfirmingTask(t.id);
          }}
          className="border border-white/5 bg-white/5 rounded-xl p-3 flex gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer relative overflow-hidden"
        >
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-bold truncate text-sky-400">{t.config?.customName || t.name.toUpperCase()}</span>
            <span className="text-[10px] text-sky-400/50 mt-1 uppercase font-bold tracking-wider">
              Agendado para {t.config?.expectedTime}
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
        ))}

        {futureTodos.map(todo => (
          <div 
            key={todo.id} 
            onClick={() => {
              if (confirmingTask === todo.id) setConfirmingTask(null);
              else setConfirmingTask(todo.id);
            }}
            className="border border-white/5 bg-white/5 rounded-xl p-3 flex gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer relative overflow-hidden"
          >
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-bold truncate text-sky-400">{todo.text}</span>
              <span className="text-[10px] text-sky-400/50 mt-1 uppercase font-bold tracking-wider">
                {todo.trackerName} - {new Date(todo.date).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <AnimatePresence>
              {confirmingTask === todo.id && (
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
                      setDetailedTrackerId(todo.trackerId);
                      setConfirmingTask(null);
                    }}
                    className="bg-white/10 text-white border border-white/20 px-3 py-2 rounded-xl text-[10px] font-black tracking-widest flex-1 uppercase w-full"
                  >
                    Abrir {todo.trackerName}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
    </div>
  );
}
