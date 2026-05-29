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

    const handleOpenTracker = (e: any) => {
      setSelectedItemId(e.detail);
    };
    window.addEventListener('openTracker', handleOpenTracker);
    return () => window.removeEventListener('openTracker', handleOpenTracker);
  }, [fetchItems]);

  const trackedItems = Object.values(items).filter(item => item.type !== 'vice');

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
