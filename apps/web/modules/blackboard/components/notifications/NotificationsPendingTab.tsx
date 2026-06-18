import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Shield, Activity, Target } from 'lucide-react';
import { getAssetUrl } from '@/lib/config';
import { isFutureForToday } from '../../../dashboard/components/tracker/utils/scheduling';

import { useTrackerStore } from '../../../dashboard/components/tracker/store/trackerStore';

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
  const store = useTrackerStore();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [correlationPrompt, setCorrelationPrompt] = React.useState<{
    mainItemId: string;
    mainItemName: string;
    correlationItems: any[];
    mainLogType: 'milestone' | 'consumption';
    mainItemType: string;
  } | null>(null);

  const handleRegisterClick = (e: React.MouseEvent, item: any, logType: 'milestone' | 'consumption') => {
    e.stopPropagation();

    let correlatedIds: string[] = [];
    if (item.correlations?.dependsOn && Array.isArray(item.correlations.dependsOn)) {
      correlatedIds = item.correlations.dependsOn;
    } else {
      correlatedIds = Object.keys(item.correlations || {}).filter(k => k !== 'triggers' && k !== 'dependsOn');
    }

    const correlations = correlatedIds.map(id => store.items[id]).filter(i => i && i.status === 'ACTIVE');

    if (correlations.length > 0) {
      setCorrelationPrompt({
        mainItemId: item.id,
        mainItemName: item.name,
        correlationItems: correlations,
        mainLogType: logType,
        mainItemType: item.type
      });
      if (confirmingTracker === item.id) setConfirmingTracker(null);
      if (confirmingTask === item.id) setConfirmingTask(null);
    } else {
      addLog({ trackerItemId: item.id, type: logType, timestamp: Date.now(), info: 'Feito registro rápido' });
      if (item.type === 'vice' || item.type === 'acompanhe') {
        setItem({ ...item, startDate: Date.now() });
      }
      if (confirmingTracker === item.id) setConfirmingTracker(null);
      if (confirmingTask === item.id) setConfirmingTask(null);
    }
  };

  const getActiveExpectedTime = (item: any) => {
    if (item.config?.loopTimes && Array.isArray(item.config.loopTimes) && item.config.loopTimes.length > 0) {
      const logsToday = trackerLogs?.filter(l =>
        l.trackerItemId === item.id &&
        l.timestamp >= todayTimestamp &&
        (l.type === 'consumption' || l.type === 'milestone')
      ) || [];
      const index = logsToday.length;
      if (index < item.config.loopTimes.length) {
        return item.config.loopTimes[index];
      }
      return item.config.loopTimes[item.config.loopTimes.length - 1];
    }
    return item.config?.expectedTime;
  };

  const checkIsFuture = (item: any, activeTime: string) => {
    if (!activeTime) return false;
    const targetDateObj = new Date(now);
    const [expectedHours, expectedMinutes] = activeTime.split(':').map(Number);
    if (isNaN(expectedHours) || isNaN(expectedMinutes)) return false;
    const expectedTimeMs = new Date(
      targetDateObj.getFullYear(),
      targetDateObj.getMonth(),
      targetDateObj.getDate(),
      expectedHours,
      expectedMinutes
    ).getTime();
    return targetDateObj.getTime() < expectedTimeMs;
  };

  const getBaseSortTime = (item: any) => {
    const activeTime = getActiveExpectedTime(item);
    if (activeTime) {
      const [h, m] = activeTime.split(':').map(Number);
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
      const activeTime = getActiveExpectedTime(item);
      // Se tiver horário específico
      if (activeTime) {
        const isFuture = checkIsFuture(item, activeTime);
        if (isOverdue) {
          // Atrasados: Tem horário e ele já passou (!isFuture)
          return !isFuture;
        } else {
          // Pendentes: Tem horário, mas não mostramos aqui se ele já passou ou é futuro.
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

          const completedToday = (trackerLogs?.filter(l => l.trackerItemId === tracker.id && l.timestamp >= todayTimestamp && (l.type === 'consumption' || l.type === 'milestone')) || []).length;
          const currentLoopIndex = completedToday + 1;
          const isMultiPerDay = typeof tracker.config?.dailyLoops === 'number' && tracker.config.dailyLoops > 1;

          const colorClasses = [
            "bg-blue-500/20 border-blue-500/30 text-white",
            "bg-purple-500/20 border-purple-500/30 text-white",
            "bg-emerald-500/20 border-emerald-500/30 text-white",
            "bg-amber-500/20 border-amber-500/30 text-white",
            "bg-rose-500/20 border-rose-500/30 text-white",
            "bg-cyan-500/20 border-cyan-500/30 text-white",
          ];

          let badgeColor = colorClasses[0];
          if (isMultiPerDay) {
            const dayOffset = Math.floor((todayTimestamp - (tracker.startDate || 0)) / 86400000);
            badgeColor = colorClasses[Math.max(0, dayOffset) % colorClasses.length];
          } else {
            badgeColor = colorClasses[new Date().getMonth() % colorClasses.length];
          }

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
                {showCoverPhoto ? (
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center border border-white/10 shadow-sm overflow-hidden bg-white/5" style={{ color: cardColor }}>
                      {tracker.coverPhoto ? (
                        <img src={getAssetUrl(tracker.coverPhoto)} alt="Capa" className="w-full h-full object-cover" />
                      ) : (
                        <Target size={24} />
                      )}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border text-[11px] font-black shadow-lg shadow-black/50 ${badgeColor}`}>
                      {currentLoopIndex}
                    </div>
                  </div>
                ) : (
                  <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center border text-[18px] font-black ${badgeColor}`}>
                    {currentLoopIndex}
                  </div>
                )}
                <div className="flex flex-col flex-1 justify-center min-w-0">
                  <span className="text-sm font-bold truncate" style={{ color: cardColor }}>{tracker.name}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="opacity-70 text-[10px] uppercase tracking-wider font-medium" style={{ color: cardColor }}>{days} dias ativos</span>
                    <span className="w-1 h-1 rounded-full opacity-50" style={{ backgroundColor: cardColor }}></span>
                    <span className="opacity-70 text-[10px] font-medium" style={{ color: cardColor }}>
                      {tracker.config?.dailyLoops && typeof tracker.config.dailyLoops === 'number' && tracker.config.dailyLoops > 1
                        ? `Hoje: ${(trackerLogs?.filter(l => l.trackerItemId === tracker.id && l.timestamp >= todayTimestamp && (l.type === 'consumption' || l.type === 'milestone')) || []).length}/${tracker.config.dailyLoops} | Total: ${logCount}`
                        : tracker.config?.dailyLoops === 'infinite'
                          ? `Hoje: ${(trackerLogs?.filter(l => l.trackerItemId === tracker.id && l.timestamp >= todayTimestamp && (l.type === 'consumption' || l.type === 'milestone')) || []).length} | Total: ${logCount}`
                          : `${logCount} registros`}
                    </span>
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
                        onClick={(e) => handleRegisterClick(e, tracker, 'milestone')}
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
          const limit = t.config?.timerLimitSeconds || t.defaultTimer || 0;
          const isCountUp = limit > 0 ? elapsedSeconds >= limit : true;
          const isAcompanhe = t.config?.mode === 'acompanhe' || t.type === 'acompanhe';
          const isResistaPhase = (!isAcompanhe) && !isCountUp;

          const displayedSeconds = limit > 0
            ? (isCountUp ? elapsedSeconds - limit : limit - elapsedSeconds)
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

      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {confirmingTask && (() => {
            const t = combinedItems.find(i => i.id === confirmingTask);
            if (!t || t.type !== 'vice') return null;

            const elapsedSeconds = Math.floor((now - t.startDate) / 1000);
            const limit = t.config?.timerLimitSeconds || t.defaultTimer || 0;
            const isCountUp = limit > 0 ? elapsedSeconds >= limit : true;
            const isAcompanhe = t.config?.mode === 'acompanhe' || t.type === 'acompanhe';
            const isResistaPhase = (!isAcompanhe) && !isCountUp;

            const displayedSeconds = limit > 0
              ? (isCountUp ? elapsedSeconds - limit : limit - elapsedSeconds)
              : elapsedSeconds;

            const timeString = formatTime(displayedSeconds);

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm z-[9999]"
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
                      onClick={(e) => handleRegisterClick(e, t, 'consumption')}
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
        </AnimatePresence>,
        document.body
      )}

      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {correlationPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center p-4 correlation-portal-modal"
              style={{ zIndex: 1000 }}
            >
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setCorrelationPrompt(null)} />
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-6"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
                    <Target size={32} />
                  </div>
                  <h2 className="text-lg font-black text-white">Registro com pendências</h2>
                  <p className="text-md tracking-widest text-yellow-400/100 leading-relaxed">
                    O Registro de <strong>{correlationPrompt.mainItemName}</strong>, Pede confirmação de:
                  </p>
                </div>
                  <div className="flex flex-col gap-2">
                    {correlationPrompt.correlationItems.map(c => (
                      <div key={c.id} className="p-3 rounded-xl bg-white/5 border border-white/5 text-center text-sm font-bold text-white/90">
                        {c.name}
                      </div>
                    ))}
                  </div>

                  <p className="text-[20px] text-center font-medium text-white mt-2 uppercase tracking-widest">
                    Você realizou estas tarefas?
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        addLog({ trackerItemId: correlationPrompt.mainItemId, type: correlationPrompt.mainLogType, timestamp: Date.now(), info: 'Feito registro rápido' });
                        if (correlationPrompt.mainItemType === 'vice' || correlationPrompt.mainItemType === 'acompanhe') {
                          const itemToUpdate = combinedItems.find(i => i.id === correlationPrompt.mainItemId);
                          if (itemToUpdate) setItem({ ...itemToUpdate, startDate: Date.now() });
                        }
                        setConfirmingTracker(null);
                        setConfirmingTask(null);
                        setCorrelationPrompt(null);
                      }}
                      className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Não
                    </button>
                    <button
                      onClick={() => {
                        const ts = Date.now();
                        addLog({ trackerItemId: correlationPrompt.mainItemId, type: correlationPrompt.mainLogType, timestamp: ts, info: 'Feito registro rápido' });
                        if (correlationPrompt.mainItemType === 'vice' || correlationPrompt.mainItemType === 'acompanhe') {
                          const itemToUpdate = combinedItems.find(i => i.id === correlationPrompt.mainItemId);
                          if (itemToUpdate) setItem({ ...itemToUpdate, startDate: ts });
                        }

                        const daysAgo = Math.floor((ts - todayTimestamp) / 86400000);
                        const daysText = daysAgo > 0 ? `a ${daysAgo} dias atrás` : 'hoje';
                        const infoText = `Confirmação a partir de "${correlationPrompt.mainItemName}" (${daysText})`;

                        correlationPrompt.correlationItems.forEach(c => {
                          addLog({ trackerItemId: c.id, type: 'milestone', timestamp: ts, info: infoText });
                        });

                        setConfirmingTracker(null);
                        setConfirmingTask(null);
                        setCorrelationPrompt(null);
                      }}
                      className="flex-1 py-3.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-500/20"
                    >
                      Sim
                    </button>
                  </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        , document.body)}
    </div>
  );
}
