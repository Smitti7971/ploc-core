import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, Zap, LineChart, Lock } from 'lucide-react';

import { useTrackerStore } from '../../dashboard/components/tracker/store/trackerStore';
import { MissionAntitabagismoModal } from '@/modules/missions';
import { TrackerOverlay } from '../../dashboard/components/tracker/components/TrackerOverlay';
import { isFutureForToday } from '../../dashboard/components/tracker/utils/scheduling';
import { AmbientGlowBackground } from '../../landing/particles/AmbientGlowBackground';
import dynamic from 'next/dynamic';
import { getAssetUrl } from '@/lib/config';

const NotificationsPendingTab = dynamic(
  () => import('./notifications/NotificationsPendingTab').then((mod) => mod.NotificationsPendingTab),
  { ssr: false }
);

const NotificationsFutureTab = dynamic(
  () => import('./notifications/NotificationsFutureTab').then((mod) => mod.NotificationsFutureTab),
  { ssr: false }
);

const NotificationsCompletedTab = dynamic(
  () => import('./notifications/NotificationsCompletedTab').then((mod) => mod.NotificationsCompletedTab),
  { ssr: false }
);

const NotificationsMissionsTab = dynamic(
  () => import('./notifications/NotificationsMissionsTab').then((mod) => mod.NotificationsMissionsTab),
  { ssr: false }
);

const NotificationsVaultTab = dynamic(
  () => import('./notifications/NotificationsVaultTab').then((mod) => mod.NotificationsVaultTab),
  { ssr: false }
);

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  inline?: boolean;
}

type TabType = 'tarefas' | 'missoes' | 'cofre';

export function NotificationsModal({ isOpen, onClose, inline = false }: NotificationsModalProps) {
  const { items: trackerItems, logs: trackerLogs, toggleCoverPhoto, addLog, fetchItems, setItem, startConsumption } = useTrackerStore();
  const [activeTab, setActiveTab] = useState<TabType>('tarefas');
  const [tarefaFilter, setTarefaFilter] = useState<'pendentes' | 'atrasados' | 'concluidas' | 'futuras'>('pendentes');
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

    const pad = (num: number) => num.toString().padStart(2, '0');

    if (d > 0) return `${d}d ${pad(h)}:${pad(m)}:${pad(s)}`;
    if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
    return `${pad(m)}:${pad(s)}`;
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
                  {/* Filtros Internos de Tarefas */}
                  <div className="flex gap-2 p-1 bg-black/40 rounded-xl mb-1">
                    {['pendentes', 'atrasados', 'futuras', 'concluidas'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setTarefaFilter(filter as any)}
                        className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors ${tarefaFilter === filter ? 'bg-sky-400/20 text-sky-400' : 'text-white/40 hover:bg-white/5 hover:text-white/80'}`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {tarefaFilter === 'pendentes' && (
                    <NotificationsPendingTab
                      trackersToUpdate={trackersToUpdate}
                      tarefas={tarefas}
                      trackerLogs={trackerLogs}
                      now={now}
                      todayTimestamp={todayTimestamp}
                      confirmingTracker={confirmingTracker}
                      setConfirmingTracker={setConfirmingTracker}
                      confirmingTask={confirmingTask}
                      setConfirmingTask={setConfirmingTask}
                      setDetailedTrackerId={setDetailedTrackerId}
                      addLog={addLog}
                      setItem={setItem}
                      toggleCoverPhoto={toggleCoverPhoto}
                      formatTime={formatTime}
                      isOverdue={false}
                    />
                  )}

                  {tarefaFilter === 'atrasados' && (
                    <NotificationsPendingTab
                      trackersToUpdate={trackersToUpdate}
                      tarefas={tarefas}
                      trackerLogs={trackerLogs}
                      now={now}
                      todayTimestamp={todayTimestamp}
                      confirmingTracker={confirmingTracker}
                      setConfirmingTracker={setConfirmingTracker}
                      confirmingTask={confirmingTask}
                      setConfirmingTask={setConfirmingTask}
                      setDetailedTrackerId={setDetailedTrackerId}
                      addLog={addLog}
                      setItem={setItem}
                      toggleCoverPhoto={toggleCoverPhoto}
                      formatTime={formatTime}
                      isOverdue={true}
                    />
                  )}

                  {tarefaFilter === 'futuras' && (
                      <NotificationsFutureTab
                        trackersToUpdate={trackersToUpdate}
                        tarefas={tarefas}
                        now={now}
                        confirmingTracker={confirmingTracker}
                        setConfirmingTracker={setConfirmingTracker}
                        confirmingTask={confirmingTask}
                        setConfirmingTask={setConfirmingTask}
                        setDetailedTrackerId={setDetailedTrackerId}
                        addLog={addLog}
                      />
                  )}

                  {tarefaFilter === 'concluidas' && (
                      <NotificationsCompletedTab
                        activeTrackers={activeTrackers}
                        trackersToUpdate={trackersToUpdate}
                        tarefas={tarefas}
                        trackerLogs={trackerLogs}
                        todayTimestamp={todayTimestamp}
                        confirmingTracker={confirmingTracker}
                        setConfirmingTracker={setConfirmingTracker}
                        confirmingTask={confirmingTask}
                        setConfirmingTask={setConfirmingTask}
                        setDetailedTrackerId={setDetailedTrackerId}
                        addLog={addLog}
                      />
                  )}
                </div>
              )}

              {activeTab === 'missoes' && (
                <NotificationsMissionsTab
                  missoes={missoes}
                  setShowAntitabagismo={setShowAntitabagismo}
                  formatDays={formatDays}
                />
              )}

              {activeTab === 'cofre' && (
                <NotificationsVaultTab
                  unlockedVault={unlockedVault}
                  setUnlockedVault={setUnlockedVault}
                  pinInput={pinInput}
                  setPinInput={setPinInput}
                  handleVaultUnlock={handleVaultUnlock}
                  vulnerabilidades={vulnerabilidades}
                  tarefas={tarefas}
                  missoes={missoes}
                  formatDays={formatDays}
                  startConsumption={startConsumption}
                  setItem={setItem}
                />
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
