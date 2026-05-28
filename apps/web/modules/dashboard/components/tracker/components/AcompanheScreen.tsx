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
      {/* O header grande foi removido conforme solicitação */}

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
