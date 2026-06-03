import React from 'react';
import { User as UserIcon, Coins, Plus, Minus, Store, ShoppingBag } from 'lucide-react';

interface LabStatsPanelProps {
  focoCoins: number;
  stats: any;
  onFarmCoins: () => void;
  onDecreaseStat: (attribute: string) => void;
  onOpenStore: () => void;
  onOpenBag: () => void;
}

export function LabStatsPanel({ focoCoins, stats, onFarmCoins, onDecreaseStat, onOpenStore, onOpenBag }: LabStatsPanelProps) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-[50px] rounded-full pointer-events-none" />
      
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-sky-400">
        <UserIcon size={18} /> Stats do PLOC
      </h2>
      
      {/* Economia */}
      <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-300 font-medium">Foco Coins</span>
          <span className="text-xl font-black text-amber-400 flex items-center gap-1">
            <Coins size={18} /> {focoCoins}
          </span>
        </div>
        <button 
          onClick={onFarmCoins}
          className="w-full py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 text-amber-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Farmar 100 FC
        </button>
      </div>

      {/* Atributos */}
      <div className="space-y-3">
        {['body', 'mind', 'life', 'freedom', 'purpose'].map((attr) => (
          <div key={attr} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
            <span className="capitalize text-sm font-medium text-slate-300">{attr}</span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">{stats?.[attr] || 0}</span>
              <button 
                onClick={() => onDecreaseStat(attr)}
                className="w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20 active:scale-95 transition-all"
              >
                <Minus size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Atalhos Rápidos */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button onClick={onOpenStore} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all border border-white/5 text-sm font-medium">
          <Store size={16} className="text-emerald-400" /> Lojinha
        </button>
        <button onClick={onOpenBag} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all border border-white/5 text-sm font-medium">
          <ShoppingBag size={16} className="text-sky-400" /> Bolsa
        </button>
      </div>
    </div>
  );
}
