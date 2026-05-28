import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cigarette, Wine, EyeOff, Smartphone, Pill, Cookie, Gamepad2, ShoppingBag, Zap, ChevronRight, Wand2 } from 'lucide-react';
import { ViceOptionsModal } from './ViceOptionsModal';
import { useViceStore } from '../store/viceStore';

export const VICES = [
  { id: 'tabagismo', label: 'CIGARRO / VAPE', icon: Cigarette, color: '#f59e0b', desc: 'Missão de redução passo a passo' },
  { id: 'alcool', label: 'ÁLCOOL', icon: Wine, color: '#ef4444', desc: 'Controle sua frequência de consumo' },
  { id: 'pornografia', label: 'PORNOGRAFIA', icon: EyeOff, color: '#ec4899', desc: 'Aumente seus intervalos de jejum' },
  { id: 'redes-sociais', label: 'REDES SOCIAIS', icon: Smartphone, color: '#3b82f6', desc: 'Recupere seu tempo e atenção' },
  { id: 'drogas', label: 'DROGAS', icon: Pill, color: '#a855f7', desc: 'Conheça e controle seu processo' },
  { id: 'doces', label: 'DOCES / AÇÚCAR', icon: Cookie, color: '#f97316', desc: 'Reduza o consumo de açúcar' },
  { id: 'jogos', label: 'JOGOS / APOSTAS', icon: Gamepad2, color: '#10b981', desc: 'Controle o vício em dopamina' },
  { id: 'compras', label: 'COMPRAS', icon: ShoppingBag, color: '#06b6d4', desc: 'Evite compras por impulso' },
  { id: 'personalizado', label: 'OUTRO (PERSONALIZADO)', icon: Zap, color: '#64748b', desc: 'Crie seu próprio acompanhamento' }
];

export function LibertesseScreen() {
  const [selectedViceId, setSelectedViceId] = useState<string | null>(null);
  const { activeVices, setActiveVice, removeActiveVice, logs } = useViceStore();
  const [now, setNow] = useState<number | null>(null);

  React.useEffect(() => {
    const initialTimeout = setTimeout(() => setNow(Date.now()), 0);
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const handleSelectVice = (viceId: string) => {
    setSelectedViceId(viceId);
  };

  const getTimeActiveText = (viceId: string) => {
    if (!now) return null;
    const activeVice = activeVices[viceId];
    if (!activeVice || !activeVice.startTime) return null;
    
    const diffSeconds = Math.floor((now - activeVice.startTime) / 1000);
    if (diffSeconds < 0) return '0m';
    
    const d = Math.floor(diffSeconds / 86400);
    const h = Math.floor((diffSeconds % 86400) / 3600);
    const m = Math.floor((diffSeconds % 3600) / 60);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div className="w-full px-4 pb-6">
      <div className="mb-6 mt-2">
        <h2 className="text-white font-black tracking-widest text-lg uppercase flex items-center gap-2">
          <Wand2 size={20} className="text-sky-400" />
          LIBERTESSE
        </h2>
        <p className="text-slate-400 text-sm font-medium">Se conheça, diminua ou pare com vícios que limitam sua liberdade.</p>
      </div>

      <div className="flex flex-col gap-4">
        {VICES.map((vice) => {
          const Icon = vice.icon;
          const activeVice = activeVices[vice.id];
          const isActive = !!activeVice;
          const isMission = activeVice?.mode === 'missao-antitabagismo';

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
                <h3 className="text-white text-sm font-extrabold tracking-widest mb-1 flex items-center gap-1.5 flex-wrap">
                  {vice.label}
                  {isActive && (
                    <span className={`text-[0.6rem] px-2 py-0.5 rounded-full border font-black uppercase ${
                      isMission 
                        ? 'bg-yellow-400/10 text-yellow-400 border-yellow-500/20' 
                        : 'bg-white/20 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {isMission ? 'MISSÃO' : 'ATIVO'}
                    </span>
                  )}
                </h3>
                {isActive ? (
                  isMission ? (
                    <p className="text-yellow-400/80 text-xs font-bold tracking-widest uppercase">
                      Progresso: <span className="text-white font-black">Estágio {Math.min(10, (activeVice.antitabagismoLevel ?? 0) + 1)}/10</span>
                    </p>
                  ) : (
                    <p className="text-emerald-400 text-xs font-bold tracking-widest">
                      Tempo: <span className="text-white">{getTimeActiveText(vice.id) || 'iniciando...'}</span>
                    </p>
                  )
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


