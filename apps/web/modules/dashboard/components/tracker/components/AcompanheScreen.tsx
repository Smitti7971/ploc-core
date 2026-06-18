import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, LineChart } from 'lucide-react';
import { useTrackerStore } from '../store/trackerStore';
import { TrackerStatusCard } from './TrackerStatusCard';
import { TrackerOverlay } from './TrackerOverlay';
import { useDroppable } from '@dnd-kit/core';

export function AcompanheScreen() {
  const { items, fetchItems, setItem, reparentItem } = useTrackerStore();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const { setNodeRef, isOver: isDragOver } = useDroppable({
    id: 'root-dropzone-acompanhe',
  });

  useEffect(() => {
    fetchItems();

    const handleOpenTracker = (e: any) => {
      setSelectedItemId(e.detail);
    };
    window.addEventListener('openTracker', handleOpenTracker);
    return () => window.removeEventListener('openTracker', handleOpenTracker);
  }, [fetchItems]);

  // Unifica todas as rotinas/tarefas que não sejam do tipo 'vice' (que vão para o Libertesse)
  // E também remove os que são correlações (filhos) de outras tarefas
  const allCorrelations = new Set<string>();
  Object.values(items).forEach(i => {
    if (i.status !== 'COMPLETED') {
      Object.keys(i.correlations || {}).forEach(cId => allCorrelations.add(cId));
    }
  });
  
  const sortActiveTop = (a: any, b: any) => {
    if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1;
    if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1;
    if (a.status === 'COMPLETED' && b.status === 'COMPLETED') return (b.updatedAt || 0) - (a.updatedAt || 0);
    return (b.createdAt || 0) - (a.createdAt || 0);
  };

  const trackedItems = Object.values(items)
    .filter(item => item.type !== 'vice' && !allCorrelations.has(item.id))
    .sort(sortActiveTop);

  const handleCreateNew = () => {
    const newItemId = crypto.randomUUID();
    setItem({
      id: newItemId,
      type: 'acompanhe',
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

  return (
    <div 
      ref={setNodeRef}
      className={`w-full flex flex-col px-4 pb-24 h-full overflow-y-auto transition-colors ${isDragOver ? 'bg-amber-500/5' : ''}`}
    >
      {/* O header grande foi removido conforme solicitação */}

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Botão Criar Novo (Primeiro) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleCreateNew}
          className="w-full h-20 rounded-2xl overflow-hidden cursor-pointer bg-white/5 border border-white/10 flex flex-row items-center justify-center gap-3 group hover:bg-white/10 transition-colors md:col-span-2 md:h-16"
        >
          <div className="flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlusCircle size={22} className="text-amber-400" />
          </div>
          <span className="text-white/50 text-[11px] font-black uppercase tracking-widest group-hover:text-amber-400 transition-colors">
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
