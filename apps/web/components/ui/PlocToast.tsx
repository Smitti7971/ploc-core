import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePlocStateStore } from '@/modules/mascot/store/plocStateStore';
import { Apple, Droplet, Pill, Box, Coffee, Dices, Pizza, GlassWater } from 'lucide-react';

export function PlocToast() {
  const [mounted, setMounted] = useState(false);
  const toastItem = usePlocStateStore((state) => state.toastItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'food': return <Apple size={20} className="text-red-400" />;
      case 'immunity_food': return <Pizza size={20} className="text-amber-400" />;
      case 'water': return <Droplet size={20} className="text-blue-400" />;
      case 'immunity_water': return <GlassWater size={20} className="text-sky-400" />;
      case 'warm_drink': return <Coffee size={20} className="text-amber-500" />;
      case 'medicine': return <Pill size={20} className="text-green-400" />;
      case 'toy': return <Dices size={20} className="text-rose-400" />;
      default: return <Box size={20} className="text-purple-400" />;
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-toast pointer-events-none flex flex-col items-center justify-center">
      <>
        {toastItem && (
          <div
            key={toastItem.id}
            
            
            
            
            className="bg-[#0B0F19]/90 backdrop-blur-xl border border-slate-700/50 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-full px-5 py-3 flex items-center gap-3"
          >
            <div className="flex items-center justify-center p-2 bg-slate-800/50 rounded-full border border-slate-600/30">
              {getIcon(toastItem.type)}
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm leading-tight">{toastItem.name}</span>
              {toastItem.action === 'use' ? (
                <span className="text-amber-400 font-bold text-xs">removido da mochila</span>
              ) : (
                <span className="text-green-400 font-bold text-xs">Adicionado a mochila</span>
              )}
            </div>
          </div>
        )}
      </>
    </div>,
    document.body
  );
}
