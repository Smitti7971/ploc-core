import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, Zap, LineChart } from 'lucide-react';
import { useViceStore } from '../../dashboard/components/libertesse/store/viceStore';
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
  const { activeVices, toggleVisibility, startConsumption } = useViceStore();
  const { items: trackerItems, toggleCoverPhoto, addLog, fetchItems } = useTrackerStore();
  const [activeTab, setActiveTab] = useState<TabType>('tarefas');
  const [showAntitabagismo, setShowAntitabagismo] = useState(false);
  const [unlockedVault, setUnlockedVault] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [confirmingTask, setConfirmingTask] = useState<string | null>(null);
  const [confirmingTracker, setConfirmingTracker] = useState<string | null>(null);
  const [detailedTrackerId, setDetailedTrackerId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  const vices = Object.values(activeVices);
  
  const isMission = (v: any) => v.isMission || v.mode === 'missao-antitabagismo';
  
  const tarefas = vices.filter(v => !isMission(v) && !v.isVulnerability);
  const activeTrackers = Object.values(trackerItems || {}).filter(t => t.status === 'ACTIVE');
  const missoes = vices.filter(v => isMission(v) && !v.isVulnerability);
  const vulnerabilidades = vices.filter(v => v.isVulnerability);

  const formatDays = (startTime: number) => {
    return Math.floor((Date.now() - startTime) / 86400000);
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
          <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar relative z-10">
            {activeTab === 'tarefas' && (
              <div className="flex flex-col gap-3">
                {tarefas.length === 0 && activeTrackers.length === 0 && <p className="text-white/40 text-xs text-center py-4">Nenhuma tarefa ativa.</p>}
                
                {/* Acompanhe (Trackers) */}
                {activeTrackers.map(tracker => {
                  const days = Math.floor((Date.now() - tracker.startDate) / 86400000);
                  const showCoverPhoto = tracker.config?.showCoverPhoto !== false;
                  return (
                    <div key={tracker.id} className="flex flex-col gap-1">
                      <div 
                        onClick={() => {
                          setDetailedTrackerId(tracker.id);
                        }}
                        className="bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 rounded-xl p-3 flex flex-col gap-2 cursor-pointer transition-colors relative"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <LineChart size={12} className="text-amber-400" />
                              <span className="text-amber-400 text-sm font-bold">{tracker.name}</span>
                            </div>
                            <span className="text-amber-400 opacity-50 text-[10px] uppercase tracking-wider">{days} dias ativos</span>
                          </div>
                          <div className="flex items-center gap-2">
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
                      </div>
                      {/* Popup removido a pedido, o card agora abre o TrackerOverlay direto */}
                    </div>
                  );
                })}

                {/* Tarefas Padrão (Libertesse) */}
                {tarefas.map(t => {
                  const elapsedSeconds = Math.floor((Date.now() - t.startTime) / 1000);
                  const isCountUp = t.timerLimitSeconds ? elapsedSeconds >= t.timerLimitSeconds : true;
                  const isResistaPhase = t.mode === 'diminua' && !isCountUp;
                  const isAcompanhe = t.mode === 'acompanhe';
                  
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
                    <div key={t.viceId} className="flex flex-col gap-1">
                      <div 
                        onClick={() => {
                          // Se já está confirmando, clicar de novo pode cancelar ou não fazer nada. 
                          // Vamos deixar o card abrir a confirmação se não estiver aberto.
                          if (confirmingTask !== t.viceId) {
                            setConfirmingTask(t.viceId);
                          } else {
                            setConfirmingTask(null);
                          }
                        }}
                        className={`${bgClass} border rounded-xl p-3 flex flex-col gap-2 cursor-pointer transition-colors relative`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className={`${textClass} text-sm font-bold`}>{t.customName || t.viceId.toUpperCase()}</span>
                            <span className={`${textClass} opacity-50 text-[10px] uppercase tracking-wider`}>{formatDays(t.startTime)} dias ativos</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleVisibility(t.viceId);
                              }}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${t.isHidden ? 'bg-white/10 text-white/40 hover:text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                              title={t.isHidden ? "Mostrar no mapa" : "Ocultar do mapa"}
                            >
                              {t.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>
                        {t.mode === 'diminua' && (
                          <div className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${isResistaPhase ? 'text-red-500' : 'text-emerald-500'}`}>
                            {isResistaPhase ? '⚠️ Não pode ceder ao impulso' : '✅ Impulso Liberado'}
                          </div>
                        )}
                      </div>
                      
                      {/* Popup de confirmação inline */}
                      <AnimatePresence>
                        {confirmingTask === t.viceId && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-2 overflow-hidden"
                          >
                            <span className="text-white/80 text-xs text-center font-medium">Registrar uso para {t.customName || t.viceId}?</span>
                            <div className="flex gap-2 w-full mt-1">
                              <button 
                                onClick={() => setConfirmingTask(null)}
                                className="flex-1 bg-white/10 text-white/70 py-2 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors"
                              >
                                CANCELAR
                              </button>
                              <button 
                                onClick={() => {
                                  startConsumption(t.viceId, "");
                                  setConfirmingTask(null);
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
                    key={m.viceId} 
                    onClick={() => m.mode === 'missao-antitabagismo' ? setShowAntitabagismo(true) : null}
                    className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-3 flex flex-col gap-2 cursor-pointer hover:bg-yellow-400/10 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-400 text-sm font-bold">{m.customName || m.viceId.toUpperCase()}</span>
                      <span className="text-yellow-400/50 text-[10px] uppercase tracking-wider">{formatDays(m.startTime)} dias</span>
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
                      <div key={v.viceId} className="bg-purple-900/20 border border-purple-400/20 rounded-xl p-3 flex items-center justify-between group hover:bg-purple-900/40 transition-colors">
                        <div className="flex flex-col">
                          <span className="text-purple-400 text-sm font-bold">{v.customName || v.viceId.toUpperCase()}</span>
                          <span className="text-purple-400/50 text-[10px] uppercase tracking-wider">{formatDays(v.startTime)} dias protegidos</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <button 
                            onClick={() => startConsumption(v.viceId, "")}
                            className="w-8 h-8 rounded-full bg-purple-400/10 text-purple-400 flex items-center justify-center hover:bg-purple-400/30 transition-colors"
                            title="Registro Rápido"
                          >
                            <Zap size={14} />
                          </button>
                          <button 
                            onClick={() => toggleVisibility(v.viceId)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${v.isHidden ? 'bg-white/10 text-white/40 hover:text-white' : 'bg-purple-400/20 text-purple-400 hover:bg-purple-400/40'}`}
                            title={v.isHidden ? "Mostrar no mapa" : "Ocultar do mapa"}
                          >
                            {v.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button 
                            onClick={() => {
                              const store = useViceStore.getState();
                              if(store.toggleVulnerability) store.toggleVulnerability(v.viceId);
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
                          <div key={t.viceId} className="bg-white/5 rounded-lg p-2 flex items-center justify-between group hover:bg-white/10 transition-colors">
                            <span className="text-white/70 text-xs">{t.customName || t.viceId.toUpperCase()}</span>
                            <button 
                              onClick={() => {
                                const store = useViceStore.getState();
                                if(store.toggleVulnerability) store.toggleVulnerability(t.viceId);
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
          {detailedTrackerId && (
            <TrackerOverlay itemId={detailedTrackerId} onClose={() => setDetailedTrackerId(null)} />
          )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
