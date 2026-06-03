import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Droplet, Pill, Box, Backpack, X, Snowflake, Smile, Coffee, Dices, Pizza, GlassWater } from 'lucide-react';
import { usePlocStateStore } from '@/modules/mascot/store/plocStateStore';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InventoryModal({ isOpen, onClose }: InventoryModalProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const inventory = usePlocStateStore(state => state.inventory);
  const eat = usePlocStateStore(state => state.eat);
  const hunger = usePlocStateStore(state => state.hunger);
  const thirst = usePlocStateStore(state => state.thirst);
  const fatigue = usePlocStateStore(state => state.fatigue);
  const cold = usePlocStateStore(state => state.cold);
  const humor = usePlocStateStore(state => state.humor);
  const spoiledEatenCount = usePlocStateStore(state => state.spoiledEatenCount);

  // Helper para saber se um item apodreceu
  const SPOIL_TIME = 24 * 60 * 60 * 1000;
  const isSpoiled = (createdAt: number) => (Date.now() - createdAt) > SPOIL_TIME;

  const handleConsume = (item: any) => {
    console.log("[Ploc] Consuming item:", item);
    if (item.type === 'medicine') {
      usePlocStateStore.getState().useMedicine(item.id);
    } else if (item.type === 'toy') {
      usePlocStateStore.getState().useToy(item.id);
    } else {
      const state = isSpoiled(item.createdAt) ? 'spoiled' : 'fresh';
      eat({ ...item, state }, 'stored');
    }
    console.log("[Ploc] Post-consume inventory:", usePlocStateStore.getState().inventory);
  };
  
  useEffect(() => {
    if (isOpen) {
      console.log("🎒 [InventoryModal] Opened! Current inventory inside component:", inventory);
    }
  }, [isOpen, inventory]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'food': return <Apple size={16} className="text-red-400" />;
      case 'immunity_food': return <Pizza size={16} className="text-amber-400" />;
      case 'water': return <Droplet size={16} className="text-blue-400" />;
      case 'immunity_water': return <GlassWater size={16} className="text-sky-400" />;
      case 'warm_drink': return <Coffee size={16} className="text-amber-500" />;
      case 'medicine': return <Pill size={16} className="text-green-400" />;
      case 'toy': return <Dices size={16} className="text-rose-400" />;
      default: return <Box size={16} className="text-purple-400" />;
    }
  };

  const getItemDetails = (type: string, itemName: string) => {
    switch (type) {
      case 'food': return { label: itemName, color: '#f87171' }; // red-400
      case 'immunity_food': return { label: itemName, color: '#fbbf24' }; // amber-400
      case 'water': return { label: itemName, color: '#60a5fa' }; // blue-400
      case 'immunity_water': return { label: itemName, color: '#38bdf8' }; // sky-400
      case 'warm_drink': return { label: itemName, color: '#d97706' }; // amber-500
      case 'medicine': return { label: itemName, color: '#4ade80' }; // green-400
      case 'toy': return { label: itemName, color: '#f43f5e' }; // rose-400
      case 'mission_item': return { label: itemName, color: '#c084fc' }; // purple-400
      default: return { label: itemName, color: '#94a3b8' }; // slate-400
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
            className="fixed inset-0 bg-transparent z-[99999]"
          />

          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full max-h-[85vh] pb-12 bg-[#0B0F19]/95 backdrop-blur-2xl border-t border-slate-700/50 rounded-t-[40px] shadow-[0_-20px_60px_rgba(0,0,0,0.6)] z-[100000] flex flex-col animate-none"
            onPointerDown={(e) => e.stopPropagation()}
          >
          {/* Minimal Header with Circular Gauges */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800/40">
            <div className="flex items-center gap-6">
              {/* Fome (Apple Icon) */}
              <div className="relative flex items-center justify-center group" style={{ width: 44, height: 44 }}>
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="22" cy="22" r="16" className="stroke-slate-800/70" strokeWidth="3" fill="transparent" />
                  <circle 
                    cx="22" 
                    cy="22" 
                    r="16" 
                    className="stroke-red-500" 
                    strokeWidth="3" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 16}
                    strokeDashoffset={(2 * Math.PI * 16) - (Math.max(0, Math.min(100, hunger)) / 100) * (2 * Math.PI * 16)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                  />
                </svg>
                <div className="absolute flex items-center justify-center">
                  <Apple size={14} className="text-red-400 drop-shadow" />
                </div>
                <span className="absolute -bottom-6 scale-0 group-hover:scale-100 transition-all origin-top text-[8px] font-black uppercase text-red-400 bg-slate-950/90 px-1.5 py-0.5 rounded border border-red-500/20">
                  {hunger}%
                </span>
              </div>

              {/* Sede (Droplet Icon) */}
              <div className="relative flex items-center justify-center group" style={{ width: 44, height: 44 }}>
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="22" cy="22" r="16" className="stroke-slate-800/70" strokeWidth="3" fill="transparent" />
                  <circle 
                    cx="22" 
                    cy="22" 
                    r="16" 
                    className="stroke-blue-500" 
                    strokeWidth="3" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 16}
                    strokeDashoffset={(2 * Math.PI * 16) - (Math.max(0, Math.min(100, thirst)) / 100) * (2 * Math.PI * 16)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                  />
                </svg>
                <div className="absolute flex items-center justify-center">
                  <Droplet size={14} className="text-blue-400 drop-shadow" />
                </div>
                <span className="absolute -bottom-6 scale-0 group-hover:scale-100 transition-all origin-top text-[8px] font-black uppercase text-blue-400 bg-slate-950/90 px-1.5 py-0.5 rounded border border-blue-500/20">
                  {thirst}%
                </span>
              </div>

              {/* Fadiga (Lightning/Box/Energy Icon) */}
              <div className="relative flex items-center justify-center group" style={{ width: 44, height: 44 }}>
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="22" cy="22" r="16" className="stroke-slate-800/70" strokeWidth="3" fill="transparent" />
                  <circle 
                    cx="22" 
                    cy="22" 
                    r="16" 
                    className="stroke-purple-500" 
                    strokeWidth="3" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 16}
                    strokeDashoffset={(2 * Math.PI * 16) - (Math.max(0, Math.min(100, fatigue)) / 100) * (2 * Math.PI * 16)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                  />
                </svg>
                <div className="absolute flex items-center justify-center">
                  <Box size={14} className="text-purple-400 drop-shadow" />
                </div>
                <span className="absolute -bottom-6 scale-0 group-hover:scale-100 transition-all origin-top text-[8px] font-black uppercase text-purple-400 bg-slate-950/90 px-1.5 py-0.5 rounded border border-purple-500/20">
                  {fatigue}%
                </span>
              </div>

              {/* Frio (Snowflake Icon) */}
              <div className="relative flex items-center justify-center group" style={{ width: 44, height: 44 }}>
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="22" cy="22" r="16" className="stroke-slate-800/70" strokeWidth="3" fill="transparent" />
                  <circle 
                    cx="22" 
                    cy="22" 
                    r="16" 
                    className="stroke-cyan-500" 
                    strokeWidth="3" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 16}
                    strokeDashoffset={(2 * Math.PI * 16) - (Math.max(0, Math.min(100, cold)) / 100) * (2 * Math.PI * 16)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                  />
                </svg>
                <div className="absolute flex items-center justify-center">
                  <Snowflake size={14} className="text-cyan-400 drop-shadow" />
                </div>
                <span className="absolute -bottom-6 scale-0 group-hover:scale-100 transition-all origin-top text-[8px] font-black uppercase text-cyan-400 bg-slate-950/90 px-1.5 py-0.5 rounded border border-cyan-500/20">
                  {cold}%
                </span>
              </div>

              {/* Humor (Smile Icon) */}
              <div className="relative flex items-center justify-center group" style={{ width: 44, height: 44 }}>
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="22" cy="22" r="16" className="stroke-slate-800/70" strokeWidth="3" fill="transparent" />
                  <circle 
                    cx="22" 
                    cy="22" 
                    r="16" 
                    className="stroke-rose-400" 
                    strokeWidth="3" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 16}
                    strokeDashoffset={(2 * Math.PI * 16) - (Math.max(0, Math.min(100, humor)) / 100) * (2 * Math.PI * 16)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                  />
                </svg>
                <div className="absolute flex items-center justify-center">
                  <Smile size={14} className="text-rose-400 drop-shadow" />
                </div>
                <span className="absolute -bottom-6 scale-0 group-hover:scale-100 transition-all origin-top text-[8px] font-black uppercase text-rose-400 bg-slate-950/90 px-1.5 py-0.5 rounded border border-rose-500/20">
                  {humor}%
                </span>
              </div>
              {/* Enjôo Indicator (Apenas se tiver enjôo ativo, super sutil) */}
              {spoiledEatenCount > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 animate-pulse text-[9px] font-black uppercase tracking-wider text-orange-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Enjoo: {spoiledEatenCount}/4
                </div>
              )}
            </div>

          </div>

          {/* Grid de Itens */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            <div className="grid grid-cols-5 gap-0">
              {(() => {
                // Agrupa itens por tipo e estado (fresco/estragado)
                const groups: Record<string, { type: string; isSpoiled: boolean; items: any[] }> = {};
                inventory.forEach(item => {
                  const spoiled = isSpoiled(item.createdAt);
                  const key = `${item.type}-${spoiled ? 'spoiled' : 'fresh'}`;
                  if (!groups[key]) {
                    groups[key] = { type: item.type, isSpoiled: spoiled, items: [] };
                  }
                  groups[key].items.push(item);
                });
                const groupedArray = Object.values(groups);

                // Garante que mostremos pelo menos 10 slots (2 linhas de 5)
                const totalSlots = Math.max(10, Math.ceil(groupedArray.length / 5) * 5);
                const slots = Array.from({ length: totalSlots }).map((_, index) => groupedArray[index] || null);

                return slots.map((group, index) => {
                  if (!group) {
                    return (
                      <div key={`empty-${index}`} className="relative aspect-square flex items-center justify-center border border-slate-700/20 bg-slate-800/10 opacity-50">
                        {/* Slot vazio */}
                      </div>
                    );
                  }

                  const { type, isSpoiled: spoiled, items } = group;
                  const count = items.length;
                  const firstItem = items[0];
                  const details = getItemDetails(type, firstItem.name);

                  return (
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      key={`group-${type}-${spoiled}`} 
                      onPointerDown={(e) => e.stopPropagation()}
                      onPointerUp={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseUp={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Consome o mais antigo do grupo
                        const oldestItem = items.sort((a, b) => a.createdAt - b.createdAt)[0];
                        if (oldestItem) handleConsume(oldestItem);
                      }}
                      className={`group relative aspect-square flex flex-col items-center justify-center cursor-pointer transition-all duration-300 rounded-xl overflow-hidden border ${spoiled ? 'opacity-60 grayscale border-slate-700/50' : 'border-transparent'}`}
                    >
                      {/* Fundo dinâmico com cor do item */}
                      <div 
                        className="absolute inset-0 transition-colors opacity-10 group-hover:opacity-20" 
                        style={{ backgroundColor: details.color }} 
                      />
                      
                      {/* Borda base e Borda no hover */}
                      <div 
                        className={`absolute inset-0 border transition-colors ${spoiled ? 'border-transparent' : 'border-slate-700/30 group-hover:border-slate-600/50'}`} 
                      />

                      {/* Pequena Label no Topo */}
                      <div className="absolute top-1.5 w-full px-1 text-center z-20">
                        <span className="text-[8px] font-black uppercase tracking-wider text-slate-300 drop-shadow-md truncate block w-full">
                          {details.label}
                        </span>
                      </div>
                      
                      <div className="relative z-10 drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] scale-125 mt-3">
                        {getIcon(type)}
                      </div>

                      {/* Contador de itens agrupados */}
                      {count > 1 && (
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] font-black bg-slate-900/80 rounded-md border border-white/10 text-white shadow-sm z-20">
                          x{count}
                        </div>
                      )}

                      {/* Overlays / Badges for Spoiled */}
                      {spoiled && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,1)] z-20" />
                      )}
                    </motion.div>
                  );
                });
              })()}
            </div>
          </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
