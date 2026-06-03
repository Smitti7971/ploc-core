import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlocAppearance } from '@/components/mascot/types';
import { 
  Eye, Smile, Scissors, Shirt, Award, Sparkles, Footprints, Palette,
  Sun, Star, Glasses, Dna, Frown, Meh, Activity, CloudLightning, X,
  Wind, Zap, Cloud, Cpu, Briefcase, Shield, HardHat, Crown, Ghost,
  Flame, Rocket, Anchor, Feather
} from 'lucide-react';

interface PlocCustomizationTabsProps {
  activeTab: 'eyes' | 'mouth' | 'hair' | 'clothes' | 'hat' | 'aura' | 'shoes' | 'bodyColor' | null;
  setActiveTab: (tab: 'eyes' | 'mouth' | 'hair' | 'clothes' | 'hat' | 'aura' | 'shoes' | 'bodyColor' | null) => void;
  appearance: PlocAppearance;
  onEquipItem: (category: keyof PlocAppearance, value: string) => void;
}

const CATEGORIES = [
  { id: 'eyes' as const, icon: <Eye size={20} />, label: 'Olhos' },
  { id: 'mouth' as const, icon: <Smile size={20} />, label: 'Boca' },
  { id: 'hair' as const, icon: <Scissors size={20} />, label: 'Cabelo' },
  { id: 'clothes' as const, icon: <Shirt size={20} />, label: 'Roupas' },
  { id: 'hat' as const, icon: <Award size={20} />, label: 'Chapéu' },
  { id: 'aura' as const, icon: <Sparkles size={20} />, label: 'Aura' },
  { id: 'shoes' as const, icon: <Footprints size={20} />, label: 'Sapatos' },
  { id: 'bodyColor' as const, icon: <Palette size={20} />, label: 'Cor' },
];

const eyesOptions = [
  { id: 'bored', label: 'Entediado', desc: 'Olhar focado', icon: <Eye size={18}/> },
  { id: 'cute', label: 'Fofinho', desc: 'Olhos brilhantes', icon: <Sparkles size={18}/> },
  { id: 'anime', label: 'Anime', desc: 'Olhar reluzente', icon: <Star size={18}/> },
  { id: 'nerd', label: 'Intelectual', desc: 'Óculos aro', icon: <Glasses size={18}/> },
  { id: 'sparkle', label: 'Estrela', desc: 'Olhos mágicos', icon: <Sun size={18}/> },
  { id: 'spiral', label: 'Confuso', desc: 'Espiral', icon: <Dna size={18}/> },
];

const mouthOptions = [
  { id: 'straight', label: 'Reta', desc: 'Neutra clássica', icon: <Meh size={18}/> },
  { id: 'smile', label: 'Sorriso', desc: 'Simpatia', icon: <Smile size={18}/> },
  { id: 'sad', label: 'Preocupado', desc: 'Reflexivo', icon: <Frown size={18}/> },
  { id: 'shock', label: 'Espanto', desc: 'Surpresa total', icon: <Activity size={18}/> },
  { id: 'wavy', label: 'Divertida', desc: 'Ondulada', icon: <CloudLightning size={18}/> },
  { id: 'none', label: 'Sem Boca', desc: 'Visual limpo', icon: <X size={18}/> },
];

const hairOptions = [
  { id: 'none', label: 'Nenhum', desc: 'Sem cabelo', icon: <X size={18}/> },
  { id: 'pompadour', label: 'Topete', desc: 'Volume retrô', icon: <Wind size={18}/> },
  { id: 'spiky', label: 'Espetado', desc: 'Herói', icon: <Zap size={18}/> },
  { id: 'afro', label: 'Black Power', desc: 'Redondo', icon: <Cloud size={18}/> },
  { id: 'curls', label: 'Cachos', desc: 'Fofos', icon: <Scissors size={18}/> },
  { id: 'bangs', label: 'Franja', desc: 'Cyberpunk', icon: <Cpu size={18}/> },
];

const clothesOptions = [
  { id: 'none', label: 'Nenhuma', desc: 'Nua', icon: <X size={18}/> },
  { id: 'hoodie', label: 'Moletom', desc: 'Ciano', icon: <Shirt size={18}/> },
  { id: 'suit', label: 'Terno', desc: 'Chique', icon: <Briefcase size={18}/> },
  { id: 'cape', label: 'Capa', desc: 'Herói', icon: <Wind size={18}/> },
  { id: 'armor', label: 'Armadura', desc: 'Brilhante', icon: <Shield size={18}/> },
];

const hatOptions = [
  { id: 'none', label: 'Nenhum', desc: 'Sem chapéu', icon: <X size={18}/> },
  { id: 'cap', label: 'Boné', desc: 'Esportivo', icon: <HardHat size={18}/> },
  { id: 'tophat', label: 'Cartola', desc: 'Vermelha', icon: <Crown size={18}/> },
  { id: 'crown', label: 'Coroa', desc: 'Com rubis', icon: <Award size={18}/> },
  { id: 'beanie', label: 'Gorro', desc: 'Lã', icon: <Ghost size={18}/> },
  { id: 'horns', label: 'Chifres', desc: 'Fogo', icon: <Flame size={18}/> },
];

const auraOptions = [
  { id: 'none', label: 'Nenhuma', desc: 'Sem aura', icon: <X size={18}/> },
  { id: 'success', label: 'Sucesso', desc: 'Glow dourado', icon: <Sun size={18}/> },
  { id: 'disaster', label: 'Caos', desc: 'Névoa roxa', icon: <CloudLightning size={18}/> },
  { id: 'fire', label: 'Chamas', desc: 'Fogo místico', icon: <Flame size={18}/> },
  { id: 'star', label: 'Estrelas', desc: 'Cintilantes', icon: <Sparkles size={18}/> },
];

const shoesOptions = [
  { id: 'none', label: 'Nenhum', desc: 'Descalços', icon: <X size={18}/> },
  { id: 'sneakers', label: 'Tênis', desc: 'Sapatilhas', icon: <Rocket size={18}/> },
  { id: 'boots', label: 'Botas', desc: 'Couro', icon: <Anchor size={18}/> },
  { id: 'slippers', label: 'Pantuflas', desc: 'Coelho', icon: <Feather size={18}/> },
];

const bodyColorOptions = [
  { id: 'classic', label: 'Ciano', desc: 'Padrão', icon: <Palette size={18}/>, hex: 'bg-cyan-400' },
  { id: 'rose', label: 'Rosa Doce', desc: 'Morango', icon: <Palette size={18}/>, hex: 'bg-rose-400' },
  { id: 'gold', label: 'Dourado', desc: 'Vitória', icon: <Palette size={18}/>, hex: 'bg-amber-400' },
  { id: 'emerald', label: 'Esmeralda', desc: 'Equilíbrio', icon: <Palette size={18}/>, hex: 'bg-emerald-400' },
  { id: 'purple', label: 'Místico', desc: 'Cósmico', icon: <Palette size={18}/>, hex: 'bg-violet-400' },
  { id: 'lava', label: 'Lava', desc: 'Vulcânico', icon: <Palette size={18}/>, hex: 'bg-red-500' }
];

export function PlocCustomizationTabs({ activeTab, setActiveTab, appearance, onEquipItem }: PlocCustomizationTabsProps) {
  
  const getActiveOptions = () => {
    switch (activeTab) {
      case 'eyes': return { options: eyesOptions, category: 'eyes' as const };
      case 'mouth': return { options: mouthOptions, category: 'mouth' as const };
      case 'hair': return { options: hairOptions, category: 'hair' as const };
      case 'clothes': return { options: clothesOptions, category: 'clothes' as const };
      case 'hat': return { options: hatOptions, category: 'hat' as const };
      case 'aura': return { options: auraOptions, category: 'aura' as const };
      case 'shoes': return { options: shoesOptions, category: 'shoes' as const };
      case 'bodyColor': return { options: bodyColorOptions, category: 'bodyColor' as const };
      default: return { options: [], category: null };
    }
  };

  const { options: currentOptions, category: currentCategory } = getActiveOptions();

  return (
    <>
      {/* CATEGORIAS COMO BOLHAS */}
      <div className="absolute top-[75%] left-1/2 -translate-x-1/2 flex items-center justify-start sm:justify-center gap-3 w-full max-w-sm sm:max-w-xl z-20 px-6 py-2 overflow-x-auto scrollbar-hide snap-x">
        {CATEGORIES.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(isActive ? null : tab.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`w-12 h-12 shrink-0 snap-center rounded-full border backdrop-blur-md flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-sky-500 text-white border-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.4)]'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
              title={tab.label}
            >
              {tab.icon}
            </motion.button>
          );
        })}
      </div>

      {/* OPÇÕES DA CATEGORIA ATIVA */}
      <AnimatePresence>
        {activeTab && currentCategory && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full max-w-2xl mx-auto mb-8 mt-24"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 flex gap-3 overflow-x-auto scrollbar-hide">
              {currentOptions.map((opt) => {
                const isEquipped = (appearance as any)[currentCategory] === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => onEquipItem(currentCategory, opt.id)}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      isEquipped
                        ? 'bg-sky-500/20 border border-sky-500 text-sky-400'
                        : 'bg-white/5 border border-transparent text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {(opt as any).hex ? (
                      <div className={`w-6 h-6 rounded-full ${(opt as any).hex} shadow-md`} />
                    ) : (
                      opt.icon
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{opt.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
