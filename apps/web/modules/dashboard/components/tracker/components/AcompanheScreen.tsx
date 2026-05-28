import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, LineChart } from 'lucide-react';
import { useTrackerStore } from '../store/trackerStore';
import { TrackerStatusCard } from './TrackerStatusCard';
import { TrackerOverlay } from './TrackerOverlay';

export function AcompanheScreen() {
  const { items, fetchItems, setItem } = useTrackerStore();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const trackedItems = Object.values(items).filter(item => item.type === 'medicine' || item.type === 'habit' || item.type === 'vice');

  const handleCreateNew = () => {
    const newItemId = crypto.randomUUID();
    setItem({
      id: newItemId,
      type: 'medicine',
      name: '',
      status: 'ACTIVE',
      config: { showCoverPhoto: true },
      startDate: Date.now(),
      correlations: {},
      isConsuming: false,
      defaultTimer: 300,
    });
    setSelectedItemId(newItemId);
  };

  return (
    <div className="w-full flex flex-col px-4 pb-24 h-full overflow-y-auto">
      {/* Header Acompanhe */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-3 relative my-6"
      >
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center relative overflow-hidden text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
          <div className="absolute inset-0 bg-amber-400/5 animate-pulse" />
          <LineChart size={28} />
        </div>
        <h3 className="text-white font-black text-2xl tracking-widest uppercase mt-1">
          Acompanhe
        </h3>
        <p className="text-slate-400 text-center text-[0.8rem] font-medium leading-relaxed max-w-[280px]">
          Monitore métricas, hábitos complexos e uso de medicamentos.
        </p>
      </motion.div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trackedItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <TrackerStatusCard 
              item={item} 
              onClick={() => setSelectedItemId(item.id)} 
            />
          </motion.div>
        ))}

        {/* Botão Criar Novo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: trackedItems.length * 0.05 }}
          onClick={handleCreateNew}
          className="w-full h-32 rounded-3xl overflow-hidden cursor-pointer bg-white/5 border border-white/10 flex flex-col items-center justify-center group hover:bg-white/10 transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <PlusCircle size={24} className="text-amber-400" />
          </div>
          <span className="text-white/50 text-[10px] font-black uppercase tracking-widest group-hover:text-amber-400 transition-colors">
            Adicionar Novo
          </span>
        </motion.div>
      </div>

      {/* Overlay Modal */}
      {selectedItemId && (
        <TrackerOverlay 
          itemId={selectedItemId} 
          onClose={() => setSelectedItemId(null)} 
        />
      )}
    </div>
  );
}
