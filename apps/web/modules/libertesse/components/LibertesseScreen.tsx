import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Wine, Pill, Eye, ChevronRight, XCircle, PlusCircle } from 'lucide-react';
import { ViceOptionsModal } from './ViceOptionsModal';
import { useViceStore } from '../store/viceStore';

export const VICES = [
  { id: 'tabagismo', label: 'TABAGISMO', icon: Flame, color: '#ef4444', desc: 'Controle o vício em nicotina' },
  { id: 'alcoolismo', label: 'ALCOOLISMO', icon: Wine, color: '#f59e0b', desc: 'Reduza ou pare de beber' },
  { id: 'drogas', label: 'DROGAS', icon: Pill, color: '#a855f7', desc: 'Acompanhe seu processo' },
  { id: 'pornografia', label: 'PORNOGRAFIA', icon: Eye, color: '#3b82f6', desc: 'Quebre o ciclo' },
  { id: 'personalizado', label: 'PERSONALIZADO', icon: PlusCircle, color: '#10b981', desc: 'Crie seu próprio acompanhamento' },
];

export function LibertesseScreen() {
  const [selectedViceId, setSelectedViceId] = useState<string | null>(null);
  const { activeVice, setActiveVice, logs } = useViceStore();
  const [tick, setTick] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectVice = (viceId: string) => {
    setSelectedViceId(viceId);
  };

  const handleStop = () => {
    setActiveVice(null);
  };

  const getTimeActiveText = (viceId: string) => {
    if (!activeVice || activeVice.viceId !== viceId) return null;
    const startLog = [...logs].reverse().find(l => l.viceId === viceId && l.type === 'start');
    if (!startLog) return null;
    const diffSeconds = Math.floor((Date.now() - startLog.timestamp) / 1000);
    const d = Math.floor(diffSeconds / 86400);
    const h = Math.floor((diffSeconds % 86400) / 3600);
    const m = Math.floor((diffSeconds % 3600) / 60);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div className="flex-1 min-h-0 w-full px-4 overflow-y-auto pb-10 scrollbar-hide">
      <div className="mb-6 mt-2">
        <h2 className="text-xl font-black text-white mb-2 tracking-widest">LIBERTESSE</h2>
        <p className="text-slate-400 text-sm font-medium">Acompanhe, diminua ou pare com vícios que limitam sua liberdade.</p>
      </div>



      <div className="flex flex-col gap-4">
        {VICES.map((vice) => {
          const Icon = vice.icon;
          const isActive = activeVice?.viceId === vice.id;

          return (
            <motion.div
              key={vice.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectVice(vice.id)}
              className={`w-full border rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-colors shadow-lg ${
                isActive 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-[#0f1115] border-white/5 hover:bg-white/5'
              }`}
            >
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                style={{ backgroundColor: `${vice.color}20`, border: `1px solid ${vice.color}40` }}
              >
                <Icon size={24} color={vice.color} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-white text-sm font-extrabold tracking-widest mb-1">
                  {vice.label}
                  {isActive && <span className="ml-2 text-[0.6rem] bg-white/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">ATIVO</span>}
                </h3>
                {isActive ? (
                  <p className="text-emerald-400 text-xs font-bold tracking-widest">
                    Tempo: <span className="text-white">{getTimeActiveText(vice.id) || 'iniciando...'}</span>
                  </p>
                ) : (
                  <p className="text-slate-400 text-xs">{vice.desc}</p>
                )}
              </div>

              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50">
                <ChevronRight size={16} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <ViceOptionsModal 
        isOpen={!!selectedViceId}
        onClose={() => setSelectedViceId(null)}
        viceId={selectedViceId}
      />
    </div>
  );
}


