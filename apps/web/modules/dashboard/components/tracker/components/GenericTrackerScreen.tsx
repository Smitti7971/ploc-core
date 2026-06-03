import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { useTrackerStore } from '../store/trackerStore';
import { TrackerStatusCard } from './TrackerStatusCard';
import { TrackerOverlay } from './TrackerOverlay';

interface GenericTrackerScreenProps {
  methodId: string;
}

export function GenericTrackerScreen({ methodId }: GenericTrackerScreenProps) {
  const { items, fetchItems, setItem } = useTrackerStore();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();

    const handleOpenTracker = (e: any) => {
      setSelectedItemId(e.detail);
    };
    window.addEventListener('openTracker', handleOpenTracker);
    return () => window.removeEventListener('openTracker', handleOpenTracker);
  }, [fetchItems]);

  const trackedItems = Object.values(items).filter(item => item.type === methodId);

  const handleCreateNew = () => {
    const newItemId = crypto.randomUUID();
    setItem({
      id: newItemId,
      type: methodId,
      name: '',
      status: 'ACTIVE',
      config: { showCoverPhoto: true },
      startDate: Date.now(),
      correlations: {},
      isConsuming: false,
      defaultTimer: 300,
    } as any);
    setSelectedItemId(newItemId);
  };

  // Cores dinâmicas para o botão de Adicionar baseado no método
  const getColorClasses = () => {
    switch (methodId) {
      case 'aprenda': return 'text-emerald-400 group-hover:text-emerald-400';
      case 'acompanhe': return 'text-amber-400 group-hover:text-amber-400';
      case 'viaje': return 'text-indigo-400 group-hover:text-indigo-400';
      case 'poupe': return 'text-green-400 group-hover:text-green-400';
      case 'planeje': return 'text-purple-400 group-hover:text-purple-400';
      case 'jejue': return 'text-orange-400 group-hover:text-orange-400';
      case 'hidrate-se': return 'text-cyan-400 group-hover:text-cyan-400';
      default: return 'text-sky-400 group-hover:text-sky-400';
    }
  };

  const colorClass = getColorClasses();

  return (
    <div className="w-full flex flex-col px-4 pb-24 h-full overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleCreateNew}
          className="w-full h-20 rounded-3xl overflow-hidden cursor-pointer bg-white/5 border border-white/10 flex flex-row items-center justify-center gap-3 group hover:bg-white/10 transition-colors md:col-span-2 md:h-16"
        >
          <div className="flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlusCircle size={22} className={colorClass.split(' ')[0]} />
          </div>
          <span className={`text-white/50 text-[11px] font-black uppercase tracking-widest transition-colors ${colorClass.split(' ')[1]}`}>
            Adicionar Novo
          </span>
        </motion.div>

        {trackedItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (idx + 1) * 0.05 }}
          >
            <TrackerStatusCard 
              item={item} 
              onClick={() => setSelectedItemId(item.id)} 
            />
          </motion.div>
        ))}
      </div>

      {selectedItemId && (
        <TrackerOverlay 
          itemId={selectedItemId} 
          onClose={() => setSelectedItemId(null)} 
        />
      )}
    </div>
  );
}
