import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, X, PlusCircle, Cigarette, Wine, EyeOff, Smartphone, Pill, Cookie, Gamepad2, ShoppingBag, Zap, Activity } from 'lucide-react';
import { useTrackerStore, TrackerItem } from '@/modules/dashboard/components/tracker/store/trackerStore';
import { useAuthStore } from '@/store/authStore';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORE_ITEMS = [
  { id: 'acompanhe', label: 'RASTREADOR DE HÁBITO', type: 'acompanhe', icon: Activity, color: '#f59e0b', desc: 'Acompanhe um novo hábito ou rotina', cost: 0 },
  { id: 'tabagismo', label: 'CIGARRO / VAPE', type: 'vice', icon: Cigarette, color: '#f59e0b', desc: 'Missão de redução passo a passo', cost: 0 },
  { id: 'alcool', label: 'ÁLCOOL', type: 'vice', icon: Wine, color: '#ef4444', desc: 'Controle sua frequência de consumo', cost: 0 },
  { id: 'pornografia', label: 'PORNOGRAFIA', type: 'vice', icon: EyeOff, color: '#ec4899', desc: 'Aumente seus intervalos de jejum', cost: 0 },
  { id: 'redes-sociais', label: 'REDES SOCIAIS', type: 'vice', icon: Smartphone, color: '#3b82f6', desc: 'Recupere seu tempo e atenção', cost: 0 },
  { id: 'drogas', label: 'DROGAS', type: 'vice', icon: Pill, color: '#a855f7', desc: 'Conheça e controle seu processo', cost: 0 },
  { id: 'doces', label: 'DOCES / AÇÚCAR', type: 'vice', icon: Cookie, color: '#f97316', desc: 'Reduza o consumo de açúcar', cost: 0 },
  { id: 'jogos', label: 'JOGOS / APOSTAS', type: 'vice', icon: Gamepad2, color: '#10b981', desc: 'Controle o vício em dopamina', cost: 0 },
  { id: 'compras', label: 'COMPRAS', type: 'vice', icon: ShoppingBag, color: '#06b6d4', desc: 'Evite compras por impulso', cost: 0 },
  { id: 'personalizado', label: 'OUTRO (PERSONALIZADO)', type: 'vice', icon: Zap, color: '#64748b', desc: 'Crie seu próprio acompanhamento de vício', cost: 0 }
];

export function StoreModal({ isOpen, onClose }: StoreModalProps) {
  const { setItem } = useTrackerStore();
  const { user } = useAuthStore();
  const focoCoins = user?.stats?.focoCoins || 0;

  const handleBuy = (itemDef: typeof STORE_ITEMS[0]) => {
    // Para simplificar: ao comprar, já instancia o TrackerItem e adiciona ao Dashboard.
    const newId = `tracker_${Date.now()}`;
    
    if (itemDef.type === 'acompanhe') {
      const newItem: TrackerItem = {
        id: newId,
        type: 'acompanhe',
        name: '',
        status: 'ACTIVE',
        config: { showCoverPhoto: true },
        startDate: Date.now(),
        correlations: {},
        isConsuming: false,
        defaultTimer: 300,
      };
      setItem(newItem);
    } else {
      const newItem: TrackerItem = {
        id: newId,
        type: 'vice',
        name: itemDef.label,
        status: 'ACTIVE',
        startDate: Date.now(),
        isConsuming: false,
        defaultTimer: 0,
        correlations: {},
        config: {
          viceId: itemDef.id,
          mode: itemDef.id === 'tabagismo' ? 'missao-antitabagismo' : 'acompanhe',
          activeMarkers: ['elapsed', 'remaining']
        }
      };
      setItem(newItem);
    }

    // Em uma versão real, também chamaria a API para debitar os Foco Coins

    onClose();
    
    // Dispara evento para o dashboard abrir o tracker overlay do novo item
    setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openTracker', { detail: newId }));
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0f1115] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
          >
            {/* Header da Loja */}
            <div className="p-5 flex justify-between items-center border-b border-white/5 bg-[#16181c]">
              <div className="flex items-center gap-3">
                <Store size={20} className="text-emerald-400" />
                <h3 className="text-white font-extrabold tracking-widest text-sm uppercase">
                  Lojinha
                </h3>
              </div>
              <div className="flex items-center gap-4">
                {/* Saldo de Foco Coins */}
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                        <span className="text-[10px] text-white font-black">F</span>
                    </div>
                    <span className="text-emerald-400 font-bold text-xs">{focoCoins}</span>
                </div>
                
                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Itens à Venda */}
            <div className="p-5 overflow-y-auto flex flex-col gap-3">
              {STORE_ITEMS.map((item) => {
                const Icon = item.icon;
                
                return (
                  <motion.div
                    key={item.id}
                    className="w-full border rounded-2xl p-4 flex items-center gap-4 text-left transition-all bg-white/5 border-white/10"
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}40` }}
                    >
                      <Icon size={20} color={item.color} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-extrabold text-sm mb-1">{item.label}</h4>
                      <p className="text-slate-400 text-[0.7rem] leading-tight">{item.desc}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-emerald-400 text-xs font-black">{item.cost} FC</span>
                        <button 
                            onClick={() => handleBuy(item)}
                            className="h-8 px-4 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-colors flex items-center justify-center font-bold text-xs"
                        >
                            Comprar
                        </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
