import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cigarette, Wine, EyeOff, Smartphone, Pill, Cookie, Gamepad2, ShoppingBag, Zap, Wand2, PlusCircle, X, ChevronRight } from 'lucide-react';
import { useTrackerStore, TrackerItem } from '../../tracker/store/trackerStore';
import { TrackerOverlay } from '../../tracker/components/TrackerOverlay';

import { TrackerStatusCard } from '../../tracker/components/TrackerStatusCard';

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
  const [selectedTrackerId, setSelectedTrackerId] = useState<string | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);
  const { items, setItem, fetchItems } = useTrackerStore();
  const [now, setNow] = useState<number | null>(null);

  React.useEffect(() => {
    fetchItems();

    const handleOpenTracker = (e: any) => {
      setSelectedTrackerId(e.detail);
    };
    window.addEventListener('openTracker', handleOpenTracker);
    
    const initialTimeout = setTimeout(() => setNow(Date.now()), 0);
    const interval = setInterval(() => setNow(Date.now()), 60000);
    
    return () => {
      window.removeEventListener('openTracker', handleOpenTracker);
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [fetchItems]);

  const activeVices = Object.values(items).filter(t => t.type === 'vice' && t.status === 'ACTIVE');

  const getTimeActiveText = (item: TrackerItem) => {
    if (!now || !item.startDate) return null;
    const diffSeconds = Math.floor((now - item.startDate) / 1000);
    if (diffSeconds < 0) return '0m';
    
    const d = Math.floor(diffSeconds / 86400);
    const h = Math.floor((diffSeconds % 86400) / 3600);
    const m = Math.floor((diffSeconds % 3600) / 60);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const handleCreateNewVice = (viceDef: typeof VICES[0]) => {
    // If it's standard, default to mission if tabagismo, else acompanhe
    const newId = `tracker_${Date.now()}`;
    const newItem: TrackerItem = {
      id: newId,
      type: 'vice',
      name: viceDef.label,
      status: 'ACTIVE',
      startDate: Date.now(),
      isConsuming: false,
      defaultTimer: 0,
      correlations: {},
      config: {
        viceId: viceDef.id,
        mode: viceDef.id === 'tabagismo' ? 'missao-antitabagismo' : 'acompanhe',
        activeMarkers: ['elapsed', 'remaining']
      }
    };
    setItem(newItem);
    setShowCatalog(false);
    setSelectedTrackerId(newId);
  };

  return (
    <div className="w-full px-4 pb-24 h-full overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Botão Adicionar Novo (Primeira Opção) */}
        <motion.div
          onClick={() => setShowCatalog(true)}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full h-20 rounded-3xl overflow-hidden cursor-pointer bg-white/5 border border-white/10 flex flex-row items-center justify-center gap-3 group hover:bg-white/10 transition-colors md:col-span-2 md:h-16"
        >
          <div className="flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlusCircle size={22} className="text-sky-400" />
          </div>
          <span className="text-white/50 text-[11px] font-black uppercase tracking-widest group-hover:text-sky-400 transition-colors">
            Adicionar Novo
          </span>
        </motion.div>

        {/* Active Vices Cards */}
        {activeVices.map((activeVice, idx) => (
          <motion.div
            key={activeVice.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (idx + 1) * 0.05 }}
          >
            <TrackerStatusCard 
              item={activeVice} 
              onClick={() => setSelectedTrackerId(activeVice.id)} 
            />
          </motion.div>
        ))}
      </div>

      {/* Catalog Modal */}
      <AnimatePresence>
        {showCatalog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCatalog(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0f1115] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="p-5 flex justify-between items-center border-b border-white/5 bg-[#16181c]">
                <h3 className="text-white font-extrabold tracking-widest text-sm uppercase flex items-center gap-2">
                  <Wand2 size={16} className="text-sky-400" />
                  Escolha o que libertar
                </h3>
                <button 
                  onClick={() => setShowCatalog(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-5 overflow-y-auto flex flex-col gap-3">
                {VICES.map((vice) => {
                  const Icon = vice.icon;
                  const isActive = activeVices.some(v => v.config?.viceId === vice.id);
                  
                  return (
                    <motion.button
                      key={vice.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCreateNewVice(vice)}
                      className={`w-full border rounded-2xl p-4 flex items-center gap-4 text-left transition-all ${
                        isActive ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer'
                      }`}
                    >
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${vice.color}20`, border: `1px solid ${vice.color}40` }}
                      >
                        <Icon size={20} color={vice.color} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-extrabold text-sm mb-1 flex items-center gap-2">
                          {vice.label}
                          {isActive && (
                            <span className="text-[0.6rem] px-2 py-0.5 rounded-full border font-black uppercase bg-white/20 text-emerald-400 border-emerald-500/30">
                              ATIVO
                            </span>
                          )}
                        </h4>
                        <p className="text-slate-400 text-[0.7rem] leading-tight">{vice.desc}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50">
                        <ChevronRight size={16} />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTrackerId && (
          <TrackerOverlay 
            itemId={selectedTrackerId} 
            onClose={() => setSelectedTrackerId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}


