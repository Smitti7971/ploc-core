import React, { useState, useEffect, useRef } from 'react';
import { Backpack, Store, Coins } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { blackboardEventBus } from '@/modules/blackboard/events/eventBus';
import { InventoryModal } from '@/modules/inventory/components/InventoryModal';
import { StoreModal } from '@/modules/store/components/StoreModal';

export function BlackboardBottomHUD() {
  const { user } = useAuthStore();
  const [storePop, setStorePop] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  const focoCoins = user?.stats?.focoCoins || 0;
  const [focoCoinsPop, setFocoCoinsPop] = useState(false);
  const prevFocoCoins = useRef(focoCoins);
  const [addedCoins, setAddedCoins] = useState(0);

  useEffect(() => {
    const handleStore = () => {
      setStorePop(true);
      setTimeout(() => setStorePop(false), 1000);
    };

    const unsubStore = blackboardEventBus.subscribe('PLOC_STORE_ITEM', handleStore);

    return () => {
      unsubStore();
    };
  }, []);

  useEffect(() => {
    if (focoCoins > prevFocoCoins.current) {
      const diff = focoCoins - prevFocoCoins.current;
      setAddedCoins(diff);
      setFocoCoinsPop(true);
      const timer = setTimeout(() => setFocoCoinsPop(false), 1200);
      prevFocoCoins.current = focoCoins;
      return () => clearTimeout(timer);
    }
    prevFocoCoins.current = focoCoins;
  }, [focoCoins]);

  return (
    <>
      <div className="fixed bottom-[90px] left-0 w-full px-[25px] z-hud pointer-events-none flex justify-between items-end">
        <div className="flex flex-col gap-3 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsBagOpen(!isBagOpen);
            }}
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 backdrop-blur-md group relative ${storePop
              ? 'bg-emerald-500/80 border-emerald-400 text-white scale-110'
              : 'bg-black/40 border-white/10 hover:scale-110 hover:bg-white/10 text-orange-400'
              }`}
            title="Inventário (Mochila)"
          >
            <Backpack size={22} className="group-hover:scale-110 transition-transform" />
            {storePop && (
              <div className="absolute text-emerald-300 font-black text-[13px] drop-shadow-md">
                +1
              </div>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-3 pointer-events-auto items-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsStoreOpen(!isStoreOpen);
            }}
            className="w-12 h-12 rounded-2xl border flex items-center justify-center cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 backdrop-blur-md group relative bg-black/40 border-white/10 hover:scale-110 hover:bg-white/10 text-emerald-400"
            title="Lojinha"
          >
            <Store size={22} className="group-hover:scale-110 transition-transform" />
          </button>

          {/* Foco Coins Display */}
          <div
            className="flex items-center justify-center gap-1.5 px-3 h-12 rounded-2xl border shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 backdrop-blur-md relative bg-black/40 border-yellow-500/30 text-yellow-400 font-bold"
            title="Foco Coins"
          >
            <Coins size={20} />
            <span className="text-sm">{focoCoins}</span>
            {focoCoinsPop && (
              <div className="absolute left-1/2 -translate-x-1/2 text-yellow-300 font-black text-[14px] drop-shadow-md pointer-events-none">
                +{addedCoins}
              </div>
            )}
          </div>
        </div>
      </div>

      <InventoryModal isOpen={isBagOpen} onClose={() => setIsBagOpen(false)} />
      <StoreModal isOpen={isStoreOpen} onClose={() => setIsStoreOpen(false)} />
    </>
  );
}
