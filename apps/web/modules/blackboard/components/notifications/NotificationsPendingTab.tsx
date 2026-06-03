import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Shield, Activity, Target } from 'lucide-react';
import { getAssetUrl } from '@/lib/config';
import { isFutureForToday } from '../../../dashboard/components/tracker/utils/scheduling';

interface NotificationsPendingTabProps {
  trackersToUpdate: any[];
  tarefas: any[];
  trackerLogs: any[];
  now: number;
  todayTimestamp: number;
  confirmingTracker: string | null;
  setConfirmingTracker: (id: string | null) => void;
  confirmingTask: string | null;
  setConfirmingTask: (id: string | null) => void;
  setDetailedTrackerId: (id: string | null) => void;
  addLog: (log: any) => void;
  setItem: (item: any) => void;
  toggleCoverPhoto: (id: string) => void;
  formatTime: (seconds: number) => string;
  isOverdue?: boolean;
}

export function NotificationsPendingTab({
  trackersToUpdate,
  tarefas,
  trackerLogs,
  now,
  todayTimestamp,
  confirmingTracker,
  setConfirmingTracker,
  confirmingTask,
  setConfirmingTask,
  setDetailedTrackerId,
  addLog,
  setItem,
  toggleCoverPhoto,
  formatTime,
  isOverdue = false
}: NotificationsPendingTabProps) {

  const getBaseSortTime = (item: any) => {
    if (item.config?.expectedTime) {
      const [h, m] = item.config.expectedTime.split(':').map(Number);
      if (!isNaN(h) && !isNaN(m)) return h * 60 + m;
    }
    const d = new Date(item.startDate);
    return d.getHours() * 60 + d.getMinutes();
  };

  const getSortTime = (item: any) => {
    if (item.isConsuming) return -10000000;
    if (item.type === 'vice') return -1000000 + getBaseSortTime(item);
    return getBaseSortTime(item);
  };

  const combinedItems = [...trackersToUpdate, ...tarefas]
    .filter(item => {
      // Se tiver horário específico
      if (item.config?.expectedTime) {
        const isFuture = isFutureForToday(item, now);
        if (isOverdue) {
          // Atrasados: Tem horário e ele já passou (!isFuture)
          return !isFuture;
        } else {
          // Pendentes: Tem horário, mas não mostramos aqui se ele já passou ou é futuro.
          // Na verdade, se tem horário e é futuro, vai pra aba "futuras".
          // Se tem horário e passou, vai pra "atrasados".
          // Logo, NÃO aparece na aba "pendentes".
          return false;
        }
      } else {
        // Não tem horário específico (dura o dia todo)
        if (isOverdue) {
          // Nunca fica atrasado no meio do dia
          return false;
        } else {
          // Fica em pendentes
          return true;
        }
      }
    })
    .sort((a, b) => getSortTime(a) - getSortTime(b));

  return (
    <div className="flex flex-col gap-3">
      {combinedItems.length === 0 && <p className="text-white/40 text-xs text-center py-4">{isOverdue ? 'Nenhuma tarefa atrasada!' : 'Tudo atualizado por hoje!'}</p>}

      {combinedItems.map(item => {
        if (item.type !== 'vice') {
          // Acompanhe (Tracker)
          const tracker = item;
          const days = Math.floor((Date.now() - tracker.startDate) / 86400000);
          const showCoverPhoto = tracker.config?.showCoverPhoto !== false;
          const isActive = confirmingTracker === tracker.id;
          const cardColor = tracker.config?.color || '#38bdf8'; // sky-400 default

          const itemLogs = trackerLogs?.filter(l => l.trackerItemId === tracker.id) || [];
          const logCount = itemLogs.length;
          const lastLog = itemLogs.sort((a, b) => b.timestamp - a.timestamp)[0];

          const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '56, 189, 248';
          };
          const rgb = hexToRgb(cardColor);

          return (
            <div key={tracker.id} className="flex flex-col gap-1">
              <div
                onClick={() => {
                  if (confirmingTracker === tracker.id) {
                    setConfirmingTracker(null);
                  } else {
                    setConfirmingTracker(tracker.id);
                  }
                }}
                className={`border rounded-xl p-3 flex gap-3 cursor-pointer transition-colors overflow-hidden relative`}
                style={{
                  backgroundColor: `rgba(${rgb}, ${isActive ? 0.2 : 0.05})`,
                  borderColor: `rgba(${rgb}, ${isActive ? 0.4 : 0.15})`
                }}
              >
                {showCoverPhoto && (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-white/10 shadow-sm overflow-hidden bg-white/5" style={{ color: cardColor }}>
                    {tracker.coverPhoto ? (
                      <img src={getAssetUrl(tracker.coverPhoto)} alt="Capa" className="w-full h-full object-cover" />
                    ) : (
                      <Target size={24} />
                    )}
                  </div>
                )}
                <div className="flex flex-col flex-1 justify-center min-w-0">
                  <span className="text-sm font-bold truncate" style={{ color: cardColor }}>{tracker.name}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="opacity-70 text-[10px] uppercase tracking-wider font-medium" style={{ color: cardColor }}>{days} dias ativos</span>
                    <span className="w-1 h-1 rounded-full opacity-50" style={{ backgroundColor: cardColor }}></span>
                    <span className="opacity-70 text-[10px] font-medium" style={{ color: cardColor }}>{logCount} registros</span>
                  </div>

                  {lastLog && (
                    <div
                      className="text-[10px] opacity-60 truncate mt-1 hover:opacity-100 transition-opacity font-medium cursor-pointer"
                      style={{ color: cardColor }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailedTrackerId(tracker.id);
                      }}
                      title="Ver registro completo"
                    >
                      ↳ {new Date(lastLog.timestamp).toLocaleDateString('pt-BR')} {lastLog.info ? `- ${lastLog.info}` : ''}
                    </div>
                  )}
                </div>

                <div className="flex items-start shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCoverPhoto(tracker.id);
                    }}
                    className="text-white/20 hover:text-white/60 transition-colors p-1"
                    title={showCoverPhoto ? "Ocultar foto" : "Mostrar foto"}
                  >
                    {showCoverPhoto ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                <AnimatePresence>
                  {confirmingTracker === tracker.id && (
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
                          addLog({ trackerItemId: tracker.id, type: 'milestone', timestamp: Date.now() });
                          setConfirmingTracker(null);
                        }}
                        className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-2 rounded-xl text-[10px] font-black tracking-widest flex-1 uppercase"
                      >
                        Fazer Registro
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailedTrackerId(tracker.id);
                          setConfirmingTracker(null);
                        }}
                        className="bg-white/10 text-white border border-white/20 px-3 py-2 rounded-xl text-[10px] font-black tracking-widest flex-1 uppercase"
                      >
                        Abrir Tarefa
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmingTracker(null);
                        }}
                        className="absolute top-1 right-1 text-white/40 hover:text-white p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        } else {
          // Tarefas Padrão (Libertesse)
          const t = item;
          const elapsedSeconds = Math.floor((now - t.startDate) / 1000);
          const isCountUp = t.config?.timerLimitSeconds ? elapsedSeconds >= t.config.timerLimitSeconds : true;
          const isAcompanhe = t.config?.mode === 'acompanhe';
          const isResistaPhase = !isAcompanhe && !isCountUp;

          const displayedSeconds = t.config?.timerLimitSeconds
            ? (isCountUp ? elapsedSeconds - t.config.timerLimitSeconds : t.config.timerLimitSeconds - elapsedSeconds)
            : elapsedSeconds;

          const timeString = formatTime(displayedSeconds);

          const bgClass = isAcompanhe
            ? 'bg-white/5 border-white/5 hover:bg-white/10'
            : isResistaPhase
              ? 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20'
              : 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20';

          const textClass = isAcompanhe
            ? 'text-white'
            : isResistaPhase
              ? 'text-red-400'
              : 'text-emerald-400';

          return (
            <motion.div layout key={t.id} className="flex flex-col gap-1">
              <motion.div
                layout
                onClick={() => setConfirmingTask(t.id)}
                animate={{
                  boxShadow: isResistaPhase
                    ? ['0px 0px 0px rgba(239,68,68,0)', '0px 0px 20px rgba(239,68,68,0.8)', '0px 0px 0px rgba(239,68,68,0)']
                    : isAcompanhe
                      ? ['0px 0px 0px rgba(255,255,255,0)', '0px 0px 20px rgba(255,255,255,0.5)', '0px 0px 0px rgba(255,255,255,0)']
                      : ['0px 0px 0px rgba(52,211,153,0)', '0px 0px 20px rgba(52,211,153,0.8)', '0px 0px 0px rgba(52,211,153,0)'],
                  borderColor: isResistaPhase
                    ? ['rgba(239,68,68,0.2)', 'rgba(239,68,68,1)', 'rgba(239,68,68,0.2)']
                    : isAcompanhe
                      ? ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.2)']
                      : ['rgba(52,211,153,0.2)', 'rgba(52,211,153,1)', 'rgba(52,211,153,0.2)']
                }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className={`${bgClass} border rounded-xl p-3 flex flex-col gap-2 cursor-pointer transition-colors relative overflow-hidden`}
              >
                <motion.div layout className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-white/10 shadow-sm overflow-hidden bg-white/5 ${textClass}`}>
                      {t.coverPhoto ? (
                        <img src={getAssetUrl(t.coverPhoto)} alt="Capa" className="w-full h-full object-cover" />
                      ) : (
                        isAcompanhe ? <Activity size={24} /> : <Shield size={24} />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`${textClass} text-sm font-bold leading-none`}>{t.config?.customName || t.name.toUpperCase()}</span>
                      <span className="text-white text-xl font-mono tracking-wider font-black leading-none drop-shadow-md">
                        {timeString}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setItem({
                          ...t,
                          config: { ...t.config, isHidden: !t.config?.isHidden }
                        });
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${t.config?.isHidden ? 'bg-white/10 text-white/40 hover:text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                      title={t.config?.isHidden ? "Mostrar no mapa" : "Ocultar do mapa"}
                    >
                      {t.config?.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </motion.div>

                {t.config?.mode === 'diminua' && (
                  <motion.div layout className={`text-[15px] uppercase font-bold tracking-wider mt-1 ${isResistaPhase ? 'text-red-500' : 'text-emerald-500'}`}>
                    {isResistaPhase ? '⚠️ Não pode ceder ao impulso' : '✅ Impulso Liberado'}
                  </motion.div>
                )}

                {/* Display Timer if Consuming */}
                {t.isConsuming && t.consumptionStart && (
                  <motion.div layout className="text-xs font-bold text-red-500 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Tempo de Uso Ativo!
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          );
        }
      })}

      <AnimatePresence>
        {confirmingTask && (() => {
          const t = combinedItems.find(i => i.id === confirmingTask);
          if (!t || t.type !== 'vice') return null;

          const elapsedSeconds = Math.floor((now - t.startDate) / 1000);
          const isCountUp = t.config?.timerLimitSeconds ? elapsedSeconds >= t.config.timerLimitSeconds : true;
          const isResistaPhase = t.config?.mode === 'diminua' && !isCountUp;

          const displayedSeconds = t.config?.timerLimitSeconds
            ? (isCountUp ? elapsedSeconds - t.config.timerLimitSeconds : t.config.timerLimitSeconds - elapsedSeconds)
            : elapsedSeconds;

          const timeString = formatTime(displayedSeconds);

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmingTask(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className={`w-full max-w-sm rounded-[2rem] p-8 flex flex-col items-center text-center border shadow-2xl relative overflow-hidden ${isResistaPhase ? 'bg-[#150a0a] border-red-500/50 shadow-red-500/20' : 'bg-[#06120b] border-emerald-500/50 shadow-emerald-500/20'
                  }`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setConfirmingTask(null)}
                  className="absolute top-4 right-4 text-white/50 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <h2 className={`text-2xl font-black tracking-widest uppercase mb-8 leading-tight ${isResistaPhase ? 'text-red-400' : 'text-emerald-400'}`}>
                  {isResistaPhase ? (
                    <>
                      <span className="text-sm opacity-80 block mb-2">AINDA FALTA ESPERAR</span>
                      <span className="text-4xl text-white block mt-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{timeString}</span>
                    </>
                  ) : (
                    'PARABÉNS VOCÊ ESTÁ EM FOCO.'
                  )}
                </h2>

                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addLog({ trackerItemId: t.id, type: 'consumption', timestamp: Date.now() });
                      setItem({ ...t, startDate: Date.now() });
                      setConfirmingTask(null);
                    }}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${isResistaPhase
                      ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                      : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                      }`}
                  >
                    {isResistaPhase ? 'REGISTRAR MESMO ASSIM!' : 'REGISTRO RÁPIDO'}
                  </button>

                  <button
                    onClick={() => {
                      setDetailedTrackerId(t.id);
                      setConfirmingTask(null);
                    }}
                    className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 transition-colors mt-2"
                  >
                    Abrir Tarefa Completa
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
