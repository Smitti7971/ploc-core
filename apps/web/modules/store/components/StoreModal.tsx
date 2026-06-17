import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, X, Apple, Droplet, Pill, Box, Coffee, Dices, Pizza, GlassWater } from 'lucide-react';
import { usePlocStateStore, ItemType } from '@/modules/mascot/store/plocStateStore';
import { useAuthStore } from '@/store/authStore';
import { playPlocSound } from '@/modules/landing/components/bubbles/bubble-pop-sfx';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// STORE_ITEMS foi removido para usar apenas dbItems

export function StoreModal({ isOpen, onClose }: StoreModalProps) {
  const [mounted, setMounted] = useState(false);
  const [dbItems, setDbItems] = useState<any[]>([]);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Fetch dynamic items from DB when modal opens
      import('@/services/api').then(({ apiService }) => {
        apiService.get('/inventory/items')
          .then((data: any) => {
            if (Array.isArray(data)) {
              const mapped = data.filter(item => item.isAvailableInShop).map(item => ({
                id: item.slug,
                label: item.name,
                type: item.type === 'CONSUMABLE' ? 'food' : 'mission_item', // Default mapping
                icon: item.imageUrl, // Pass the string directly to be handled by DynamicIcon
                color: '#8b5cf6', // A purple color for custom items
                cost: item.priceFoco || 10,
                isDbItem: true,
                originalType: item.type
              }));
              setDbItems(mapped);
            }
          })
          .catch(console.error);
      });
    }
  }, [isOpen]);

  const { user, updateUser } = useAuthStore();
  const focoCoins = user?.stats?.focoCoins || 0;
  
  // Pegamos o inventário para contar os itens que já possuímos
  const inventory = usePlocStateStore(state => state.inventory);
  const getOwnedCount = (type: string, label: string) => {
    return inventory.filter(item => item.type === type && item.name === label).length;
  };

  const handleBuy = (itemDef: any) => {
    if (focoCoins >= itemDef.cost) {
        // Add item to inventory
        usePlocStateStore.getState().store({
            type: itemDef.type,
            name: itemDef.label
        });
        
        // Deduct coins locally
        const newStats = { ...user?.stats, focoCoins: focoCoins - itemDef.cost } as any;
        updateUser({ stats: newStats });
        
        // Inform backend
        import('@/services/api').then(({ apiService }) => {
           // We use the debug endpoint to subtract coins for now as a mock
           apiService.post('/users/debug/foco-coins', { amount: -itemDef.cost }).catch(e => console.error(e));
        });
        
        console.log(`[Store] Bought ${itemDef.label} for ${itemDef.cost} Foco Coins`);
        playPlocSound();
    } else {
        alert("Foco Coins insuficientes!");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'food': return <Apple size={18} className="text-red-400" />;
      case 'immunity_food': return <Pizza size={18} className="text-amber-400" />;
      case 'water': return <Droplet size={18} className="text-blue-400" />;
      case 'immunity_water': return <GlassWater size={18} className="text-sky-400" />;
      case 'warm_drink': return <Coffee size={18} className="text-amber-500" />;
      case 'medicine': return <Pill size={18} className="text-green-400" />;
      case 'toy': return <Dices size={18} className="text-rose-400" />;
      default: return <Box size={18} className="text-purple-400" />;
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay to close when clicking outside */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="fixed inset-0 bg-transparent z-hud"
          />

          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full max-h-[85vh] pb-12 bg-[#0B0F19]/95 backdrop-blur-2xl border-t border-slate-700/50 rounded-t-[40px] shadow-[0_-20px_60px_rgba(0,0,0,0.6)] z-modal flex flex-col"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {/* Header da Loja */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800/40">
              <div className="flex items-center gap-3">
                <Store size={20} className="text-emerald-400" />
                <h3 className="text-white font-extrabold tracking-widest text-sm uppercase">
                  Lojinha
                </h3>
              </div>
              <div className="flex items-center gap-4">
                {/* Saldo de Foco Coins */}
                <div className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700/50">
                    <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.4)]">
                        <span className="text-[10px] text-white font-black">F</span>
                    </div>
                    <span className="text-amber-400 font-bold text-xs">{focoCoins}</span>
                </div>
              </div>
            </div>

            {/* Grid de Produtos (Similar ao InventoryModal) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                {dbItems.map((item) => (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={`store-item-${item.id}`} 
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuy(item);
                    }}
                    className="group relative aspect-square flex flex-col items-center justify-center cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden"
                  >
                    {/* Fundo dinâmico com cor do item */}
                    <div 
                      className="absolute inset-0 transition-colors opacity-20 group-hover:opacity-30" 
                      style={{ backgroundColor: item.color }} 
                    />
                    
                    {/* Borda base e Borda no hover */}
                    <div 
                      className="absolute inset-0 border border-slate-700/30 group-hover:border-slate-600/50 transition-colors" 
                    />

                    {/* Pequena Label no Topo */}
                    <div className="absolute top-2 w-full px-1 text-center z-20">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-300 drop-shadow-md truncate block w-full">
                        {item.label}
                      </span>
                    </div>
                    
                    {/* Ícone */}
                    <div className="relative z-10 drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] scale-125 mb-2 mt-4 flex items-center justify-center">
                      {item.isDbItem ? (
                        <DynamicIcon name={item.icon as string} size={18} color={item.color} />
                      ) : (
                        getIcon(item.type)
                      )}
                      {getOwnedCount(item.type, item.label) > 0 && (
                        <div className="absolute -top-3 -right-3 bg-indigo-500/90 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-indigo-300/30">
                          {getOwnedCount(item.type, item.label)}
                        </div>
                      )}
                    </div>

                    {/* Preço (Foco Coins) */}
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] font-black bg-slate-900/80 rounded-md border border-amber-500/30 text-amber-400 shadow-sm z-20">
                      {item.cost}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 text-center text-slate-500 text-xs font-bold uppercase tracking-widest opacity-50">
                Toque em um item para comprar
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

