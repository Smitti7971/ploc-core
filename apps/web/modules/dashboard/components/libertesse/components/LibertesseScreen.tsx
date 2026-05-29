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

  return (
    <div className="w-full px-4 pb-24 h-full overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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


