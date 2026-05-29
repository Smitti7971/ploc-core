import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, Zap, LineChart } from 'lucide-react';

import { useTrackerStore } from '../../dashboard/components/tracker/store/trackerStore';
import { MissionAntitabagismoModal } from '@/modules/missions';
import { TrackerOverlay } from '../../dashboard/components/tracker/components/TrackerOverlay';
import { AmbientGlowBackground } from '../../landing/particles/AmbientGlowBackground';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  inline?: boolean;
}

type TabType = 'tarefas' | 'missoes' | 'cofre';

export function NotificationsModal({ isOpen, onClose, inline = false }: NotificationsModalProps) {
  const { items: trackerItems, logs: trackerLogs, toggleCoverPhoto, addLog, fetchItems, setItem, startConsumption } = useTrackerStore();
  const [activeTab, setActiveTab] = useState<TabType>('tarefas');
  const [showAntitabagismo, setShowAntitabagismo] = useState(false);
  const [unlockedVault, setUnlockedVault] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [confirmingTask, setConfirmingTask] = useState<string | null>(null);
  const [confirmingTracker, setConfirmingTracker] = useState<string | null>(null);
  const [detailedTrackerId, setDetailedTrackerId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchItems();
    }
  }, [isOpen, fetchItems]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showAntitabagismo) return; // Não fecha se o modal sobreposto estiver aberto

      // Ignora se o clique for no botão de sino (que tem um ID ou classe específica, mas vamos usar o ref)
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Usamos um pequeno delay para evitar que o clique no botão de abrir dispare o fechamento imediatamente
    if (isOpen && !inline) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 50);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, showAntitabagismo, onClose, inline]);

  const vices = Object.values(trackerItems || {}).filter(t => t.type === 'vice' && t.status === 'ACTIVE');

  const isMission = (v: any) => v.config?.isMission || v.config?.mode === 'missao-antitabagismo';

  const tarefas = vices.filter(v => !isMission(v) && !v.config?.isVulnerability);
  const activeTrackers = Object.values(trackerItems || {}).filter(t => t.status === 'ACTIVE' && t.type !== 'vice');
  
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayTimestamp = todayStart.getTime();

  const trackersToUpdate = activeTrackers.filter(t => {
    const logsToday = trackerLogs?.filter(l => 
       l.trackerItemId === t.id && 
       l.timestamp >= todayTimestamp && 
       (l.type === 'consumption' || l.type === 'milestone')
    ) || [];
    return logsToday.length === 0;
  });

  const missoes = vices.filter(v => isMission(v) && !v.config?.isVulnerability);
  const vulnerabilidades = vices.filter(v => v.config?.isVulnerability);

  const formatDays = (startTime: number) => {
    return Math.floor((now - startTime) / 86400000);
  };

  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (d > 0) return `${d}d ${h}h ${m}m`;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  const handleVaultUnlock = () => {
    if (pinInput === '1234') { // placeholder pin
      setUnlockedVault(true);
    } else {
      alert('Senha incorreta (use 1234 para testes)');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={inline ? "w-full pointer-events-auto" : "fixed inset-0 z-[100002] flex items-start justify-center pt-[180px] pointer-events-none px-4"}>
          <motion.div
            ref={modalRef}
            initial={inline ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={inline ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`w-full ${inline ? 'max-w-none' : 'max-w-[340px]'} bg-black/80 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col pointer-events-auto relative`}
          >
            {/* Fundo Glow Estilizado */}
            <div className="absolute inset-0 z-0 opacity-50 pointer-events-none mix-blend-screen">
              <AmbientGlowBackground />
            </div>

            {/* Header & Tabs */}
            <div className="flex bg-white/5 border-b border-white/10 p-1 relative z-10">
              <button
                onClick={() => setActiveTab('tarefas')}
                className={`flex-1 py-2 text-[11px] font-bold tracking-wider rounded-lg transition-colors ${activeTab === 'tarefas' ? 'bg-sky-400/20 text-sky-400' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}
              >
                TAREFAS
              </button>
              <button
                onClick={() => setActiveTab('missoes')}
                className={`flex-1 py-2 text-[11px] font-bold tracking-wider rounded-lg transition-colors ${activeTab === 'missoes' ? 'bg-yellow-400/20 text-yellow-400' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}
              >
                MISSÕES
              </button>
              <button
                onClick={() => setActiveTab('cofre')}
                className={`flex-1 py-2 text-[11px] font-bold tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1 ${activeTab === 'cofre' ? 'bg-purple-400/20 text-purple-400' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}
              >
                <Shield size={12} /> COFRE
              </button>
            </div>

            {/* Content */}
            <div 
              className="p-1 max-h-[400px] overflow-y-auto custom-scrollbar relative z-10"
              onWheel={(e) => e.stopPropagation()}
            >
              {activeTab === 'tarefas' && (
                <div className="flex flex-col gap-3">
                  {tarefas.length === 0 && trackersToUpdate.length === 0 && <p className="text-white/40 text-xs text-center py-4">Tudo atualizado por hoje!</p>}

                  {/* Acompanhe (Trackers) */}
                  {trackersToUpdate.map(tracker => {
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
                            if (!isActive) {
                              setConfirmingTracker(tracker.id);
                            } else {
                              setDetailedTrackerId(tracker.id);
                              setConfirmingTracker(null);
                            }
                          }}
                          className={`border rounded-xl p-3 flex gap-3 cursor-pointer transition-colors overflow-hidden relative`}
                          style={{
                             backgroundColor: `rgba(${rgb}, ${isActive ? 0.2 : 0.05})`,
                             borderColor: `rgba(${rgb}, ${isActive ? 0.4 : 0.15})`
                          }}
                        >
                          {showCoverPhoto && tracker.coverPhoto && (
                            <img src={tracker.coverPhoto} alt="Capa" className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/10 shadow-sm" />
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
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${!showCoverPhoto ? 'bg-white/10 text-white/40 hover:text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                                title={!showCoverPhoto ? "Mostrar no mapa" : "Ocultar do mapa"}
                              >
                                {!showCoverPhoto ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                          </div>
                        </div>

                        {/* Menu de Ação Rápida */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="border rounded-xl p-3 flex flex-col gap-2 overflow-hidden mt-1"
                              style={{
                                backgroundColor: `rgba(${rgb}, 0.1)`,
                                borderColor: `rgba(${rgb}, 0.2)`
                              }}
                            >
                              <div className="flex gap-2 w-full">
                                <input
                                  type="text"
                                  placeholder="Registrar valor (opcional)..."
                                  className="flex-1 min-w-0 bg-black/40 border rounded-lg px-2 text-xs text-white outline-none transition-colors"
                                  style={{ borderColor: `rgba(${rgb}, 0.3)` }}
                                  id={`quick-tracker-${tracker.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const valStr = (document.getElementById(`quick-tracker-${tracker.id}`) as HTMLInputElement)?.value;
                                    const store = useTrackerStore.getState();
                                    const valNum = Number(valStr);
                                    store.addLog({
                                      trackerItemId: tracker.id,
                                      type: 'consumption',
                                      info: valStr || 'Registro Rápido via pop-up',
                                      value: (!isNaN(valNum) && valStr) ? valNum : 1
                                    });
                                    setConfirmingTracker(null);
                                  }}
                                  className="py-2 px-3 rounded-lg text-xs font-bold transition-colors shrink-0"
                                  style={{ backgroundColor: `rgba(${rgb}, 0.2)`, color: cardColor }}
                                >
                                  SALVAR
                                </button>
                              </div>
                              
                              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-white/50">Cor:</span>
                                {['#38bdf8', '#fbbf24', '#f43f5e', '#a855f7', '#10b981', '#64748b', '#ec4899', '#f97316'].map(c => (
                                  <button
                                    key={c}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const store = useTrackerStore.getState();
                                      store.setItem({
                                        ...tracker,
                                        config: {
                                          ...tracker.config,
                                          color: c
                                        }
                                      });
                                    }}
                                    className="w-4 h-4 rounded-full border hover:scale-125 transition-transform"
                                    style={{ backgroundColor: c, borderColor: 'rgba(255,255,255,0.2)', opacity: cardColor === c ? 1 : 0.4 }}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}

                  {/* Tarefas Padrão (Libertesse) */}
                  {tarefas.map(t => {
                    const elapsedSeconds = Math.floor((now - t.startDate) / 1000);
                    const isCountUp = t.config?.timerLimitSeconds ? elapsedSeconds >= t.config.timerLimitSeconds : true;
                    const isResistaPhase = t.config?.mode === 'diminua' && !isCountUp;
                    const isAcompanhe = t.config?.mode === 'acompanhe';

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

                    const btnClass = isAcompanhe
                      ? 'bg-sky-400/10 text-sky-400 hover:bg-sky-400/30'
                      : isResistaPhase
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40';

                    return (
                      <div key={t.id} className="flex flex-col gap-1">
                        <div
                          onClick={() => {
                            if (confirmingTask !== t.id) {
                              setConfirmingTask(t.id);
                            } else {
                              setConfirmingTask(null);
                            }
                          }}
                          className={`${bgClass} border rounded-xl p-3 flex flex-col gap-2 cursor-pointer transition-colors relative`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className={`${textClass} text-sm font-bold`}>{t.config?.customName || t.name.toUpperCase()}</span>
                              <span className={`${textClass} opacity-80 text-[11px] font-mono mt-0.5 tracking-wider font-black`}>
                                ⏱ {timeString}
                              </span>
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
                          </div>
                          {t.config?.mode === 'diminua' && (
                            <div className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${isResistaPhase ? 'text-red-500' : 'text-emerald-500'}`}>
                              {isResistaPhase ? '⚠️ Não pode ceder ao impulso' : '✅ Impulso Liberado'}
                            </div>
                          )}
                          {/* Display Timer if Consuming */}
                          {t.isConsuming && t.consumptionStart && (
                            <div className="text-xs font-bold text-red-500 mt-1 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                              Tempo de Uso Ativo!
                            </div>
                          )}
                          {/* Ultimo Registro */}
                          {trackerLogs?.filter(l => l.trackerItemId === t.id && l.type === 'consumption').length > 0 && (
                            <div className="text-[9px] text-white/40 mt-1">
                              Último registro: {new Date(trackerLogs.filter(l => l.trackerItemId === t.id && l.type === 'consumption').sort((a, b) => b.timestamp - a.timestamp)[0].timestamp).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                        </div>

                        {/* Popup de confirmação inline */}
                        <AnimatePresence>
                          {confirmingTask === t.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-2 overflow-hidden"
                            >
                              <span className="text-white/80 text-xs text-center font-medium">Registrar uso para {t.config?.customName || t.name}?</span>
                              <div className="flex gap-2 w-full mt-1">
                                <button
                                  onClick={() => setConfirmingTask(null)}
                                  className="flex-1 bg-white/10 text-white/70 py-2 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors"
                                >
                                  CANCELAR
                                </button>
                                <button
                                  onClick={() => {
                                    startConsumption(t.id);
                                    setConfirmingTask(null);
                                    onClose(); // Close modal when clicking 'Ceder'
                                  }}
                                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${btnClass}`}
                                >
                                  CONFIRMAR
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'missoes' && (
                <div className="flex flex-col gap-3">
                  {missoes.length === 0 && <p className="text-white/40 text-xs text-center py-4">Nenhuma missão ativa.</p>}
                  {missoes.map(m => (
                    <div
                      key={m.id}
                      onClick={() => m.config?.mode === 'missao-antitabagismo' ? setShowAntitabagismo(true) : null}
                      className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-3 flex flex-col gap-2 cursor-pointer hover:bg-yellow-400/10 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-400 text-sm font-bold">{m.config?.customName || m.name.toUpperCase()}</span>
                        <span className="text-yellow-400/50 text-[10px] uppercase tracking-wider">{formatDays(m.startDate)} dias</span>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-yellow-400 h-full w-[0%] rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'cofre' && (
                <div className="flex flex-col gap-3">
                  {!unlockedVault ? (
                    <div className="flex flex-col items-center gap-4 py-8">
                      <Shield size={40} className="text-purple-400/50" />
                      <p className="text-white/60 text-xs text-center px-4 leading-relaxed">
                        Esta área protege tarefas sensíveis de olhares de terceiros (ex: Pornografia, Drogas). Digite o PIN para acessar.
                      </p>
                      <div className="flex gap-2 w-full px-6">
                        <input
                          type="password"
                          value={pinInput}
                          onChange={e => setPinInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleVaultUnlock()}
                          className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-center flex-1 outline-none focus:border-purple-400/50 transition-colors"
                          placeholder="PIN (1234)"
                        />
                        <button onClick={handleVaultUnlock} className="bg-purple-400/20 text-purple-400 px-4 py-2 rounded-xl font-bold text-xs hover:bg-purple-400/40 transition-colors">
                          ABRIR
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-purple-400 text-xs font-bold tracking-wider">VULNERABILIDADES</span>
                        <button onClick={() => { setUnlockedVault(false); setPinInput(''); }} className="text-white/30 text-[10px] hover:text-white uppercase">Bloquear</button>
                      </div>
                      {vulnerabilidades.length === 0 && <p className="text-white/40 text-xs text-center py-4">O cofre está vazio.</p>}
                      {vulnerabilidades.map(v => (
                        <div key={v.id} className="bg-purple-900/20 border border-purple-400/20 rounded-xl p-3 flex items-center justify-between group hover:bg-purple-900/40 transition-colors">
                          <div className="flex flex-col">
                            <span className="text-purple-400 text-sm font-bold">{v.config?.customName || v.name.toUpperCase()}</span>
                            <span className="text-purple-400/50 text-[10px] uppercase tracking-wider">{formatDays(v.startDate)} dias protegidos</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startConsumption(v.id)}
                              className="w-8 h-8 rounded-full bg-purple-400/10 text-purple-400 flex items-center justify-center hover:bg-purple-400/30 transition-colors"
                              title="Registro Rápido"
                            >
                              <Zap size={14} />
                            </button>
                            <button
                              onClick={() => setItem({ ...v, config: { ...v.config, isHidden: !v.config?.isHidden } })}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${v.config?.isHidden ? 'bg-white/10 text-white/40 hover:text-white' : 'bg-purple-400/20 text-purple-400 hover:bg-purple-400/40'}`}
                              title={v.config?.isHidden ? "Mostrar no mapa" : "Ocultar do mapa"}
                            >
                              {v.config?.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button
                              onClick={() => {
                                setItem({ ...v, config: { ...v.config, isVulnerability: false } });
                              }}
                              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-purple-400/20 text-purple-400 hover:bg-purple-400/40"
                              title="Remover do Cofre"
                            >
                              <Shield size={14} />
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="mt-4 border-t border-white/10 pt-4">
                        <span className="text-white/30 text-[10px] font-bold tracking-wider mb-2 block">ADICIONAR AO COFRE</span>
                        <div className="flex flex-col gap-2">
                          {tarefas.length === 0 && missoes.length === 0 && <p className="text-white/20 text-[10px] text-center py-2">Nenhuma tarefa disponível para proteger.</p>}
                          {[...tarefas, ...missoes].map(t => (
                            <div key={t.id} className="bg-white/5 rounded-lg p-2 flex items-center justify-between group hover:bg-white/10 transition-colors">
                              <span className="text-white/70 text-xs">{t.config?.customName || t.name.toUpperCase()}</span>
                              <button
                                onClick={() => {
                                  setItem({ ...t, config: { ...t.config, isVulnerability: true } });
                                }}
                                className="w-6 h-6 rounded flex items-center justify-center bg-white/5 text-white/30 hover:text-purple-400 hover:bg-purple-400/10 transition-colors"
                                title="Proteger no Cofre"
                              >
                                <Shield size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <MissionAntitabagismoModal isOpen={showAntitabagismo} onClose={() => setShowAntitabagismo(false)} />
          </motion.div>
          {detailedTrackerId && (
            <TrackerOverlay itemId={detailedTrackerId} onClose={() => setDetailedTrackerId(null)} />
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
