'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Eye, Smile, Scissors, Shirt, Flame, RotateCcw, 
  Heart, Award, Sparkle, CircleDot, Palette, Footprints,
  Clock, Gamepad2, X, Info, Shield, Wind, Glasses, Star, Dna,
  Meh, Frown, MessageCircle, Mic, Zap, Cloud, Cpu, Briefcase,
  Crown, GraduationCap, HardHat, Sun, Ghost, CloudLightning,
  Rocket, Anchor, Feather, BarChart3, Fingerprint, Activity
} from 'lucide-react';
import { PlocAppearance, DEFAULT_PLOC_APPEARANCE } from '@/components/mascot/types';
import { PlocAvatarClient } from '@/components/mascot/PlocAvatarClient';
import { attributeEngine } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';
import { triggerAchievementUnlock, ACHIEVEMENTS_LIST } from '@/components/mascot/achievements';

const playEquipSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.12);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    osc.start(now);
    osc.stop(now + 0.24);
  } catch (e) {}
};

export default function PlocCentralPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [appearance, setAppearance] = useState<PlocAppearance>(DEFAULT_PLOC_APPEARANCE);
  const [activeTab, setActiveTab] = useState<'eyes' | 'mouth' | 'hair' | 'clothes' | 'hat' | 'aura' | 'shoes' | 'bodyColor' | null>(null);
  
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Array<{ id: string; date: string }>>([]);

  const [attributes, setAttributes] = useState({
    corpo: 0, mente: 0, vida: 0, liberdade: 0, proposito: 0
  });

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('ploc_appearance');
    if (saved) {
      try { setAppearance(JSON.parse(saved)); } catch (e) {}
    }

    const savedAch = localStorage.getItem('ploc_achievements') || '[]';
    try { setUnlockedAchievements(JSON.parse(savedAch)); } catch (e) {}

    const handleAchUnlocked = () => {
      const updatedAch = localStorage.getItem('ploc_achievements') || '[]';
      try { setUnlockedAchievements(JSON.parse(updatedAch)); } catch (e) {}
    };
    window.addEventListener('ploc_achievement_unlocked', handleAchUnlocked);

    const attrs = attributeEngine.getAttributes();
    setAttributes({
      corpo: attrs.corpo, mente: attrs.mente, vida: attrs.vida, liberdade: attrs.liberdade, proposito: attrs.proposito
    });

    return () => window.removeEventListener('ploc_achievement_unlocked', handleAchUnlocked);
  }, []);

  if (!isMounted) return null;

  const handleEquipItem = (category: keyof PlocAppearance, value: string) => {
    const updated = { ...appearance, [category]: value };
    setAppearance(updated);
    localStorage.setItem('ploc_appearance', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    playEquipSound();

    if (category === 'aura' && value !== 'none') triggerAchievementUnlock('astronauta_caos');
    if (
      (category === 'hair' ? value !== 'none' : updated.hair !== 'none') &&
      (category === 'clothes' ? value !== 'none' : updated.clothes !== 'none') &&
      (category === 'hat' ? value !== 'none' : updated.hat !== 'none') &&
      (category === 'shoes' ? value !== 'none' : updated.shoes !== 'none') &&
      (category === 'aura' ? value !== 'none' : updated.aura !== 'none')
    ) {
      triggerAchievementUnlock('estilista_gel');
    }
  };

  const handleResetAppearance = () => {
    setAppearance(DEFAULT_PLOC_APPEARANCE);
    localStorage.setItem('ploc_appearance', JSON.stringify(DEFAULT_PLOC_APPEARANCE));
    window.dispatchEvent(new Event('storage'));
    playEquipSound();
  };

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

  return (
    <AppShell>
      <div className="w-full h-full bg-gradient-to-br from-[#0f1115] to-[#0a0b0e] text-white flex flex-col relative overflow-hidden font-sans">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 blur-[120px] rounded-full z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full z-0 pointer-events-none" />

        <div className="relative z-10 flex-1 flex flex-col px-4 sm:px-6 pb-24 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <div className="w-full max-w-6xl mx-auto pt-16 sm:pt-20 flex-1 flex flex-col">

            {/* TOP BAR */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                  <Fingerprint className="text-sky-400" size={28} /> Ploc Central
                </h1>
                <p className="text-sm font-medium text-white/40">Customização e Identidade</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowStats(true)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-colors"
                >
                  <BarChart3 size={18} className="text-white/60" />
                </button>
                <button
                  onClick={() => setShowAchievements(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full hover:bg-amber-500/20 transition-all text-xs font-bold text-amber-400"
                >
                  <Award size={16} /> 
                  <span className="hidden sm:inline">Conquistas</span>
                </button>
                <button
                  onClick={handleResetAppearance}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-colors text-white/60"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>

            {/* MAIN STAGE (PEDESTAL) */}
            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[400px]">
              
              {/* O Ploc flutuando */}
              <div className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] flex items-center justify-center z-10 relative mb-8">
                <PlocAvatarClient emotion={'calm'} />
              </div>

              {/* Pedestal Ground */}
              <div className="absolute top-[60%] w-[250px] h-[60px] bg-sky-500/5 rounded-full blur-[10px] transform border border-sky-500/20" />
              
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
            </div>

            {/* OPÇÕES DA CATEGORIA ATIVA */}
            <AnimatePresence>
              {activeTab && currentCategory && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="w-full max-w-2xl mx-auto mb-8"
                >
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-4 flex gap-3 overflow-x-auto scrollbar-hide">
                    {currentOptions.map((opt) => {
                      const isEquipped = (appearance as any)[currentCategory] === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleEquipItem(currentCategory, opt.id)}
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

            {/* IDENTIDADE DO PLOC CARD */}
            <div className="w-full max-w-2xl mx-auto mt-auto">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-white/20 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-[50px] rounded-full group-hover:bg-sky-500/20 transition-colors" />
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400 border border-sky-500/30">
                    <Fingerprint size={24} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-1">Identidade do Ploc</h2>
                    <p className="text-sm text-white/50">Randomização de persona e bolha nativa em desenvolvimento.</p>
                  </div>
                  <button disabled className="px-4 py-2 rounded-xl bg-white/5 text-white/40 border border-white/5 font-bold text-sm cursor-not-allowed">
                    Em breve
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* MODAL DE STATUS (XP) */}
        <AnimatePresence>
          {showStats && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[4px] z-[999999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-sm bg-[#0a0b0e] border border-white/10 rounded-3xl p-6 shadow-2xl relative"
              >
                <button
                  onClick={() => setShowStats(false)}
                  className="absolute top-4 right-4 text-white/40 hover:text-white"
                >
                  <X size={20} />
                </button>
                
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <BarChart3 className="text-sky-400" /> Status do PLOC
                </h2>

                <div className="flex flex-col gap-4">
                  {[
                    { label: 'Corpo', value: attributes.corpo, color: 'text-rose-400', bg: 'bg-rose-500', max: 250 },
                    { label: 'Mente', value: attributes.mente, color: 'text-sky-400', bg: 'bg-sky-500', max: 250 },
                    { label: 'Vida', value: attributes.vida, color: 'text-emerald-400', bg: 'bg-emerald-500', max: 250 },
                    { label: 'Liberdade', value: attributes.liberdade, color: 'text-amber-400', bg: 'bg-amber-500', max: 250 },
                    { label: 'Propósito', value: attributes.proposito, color: 'text-violet-400', bg: 'bg-violet-500', max: 250 }
                  ].map(attr => (
                    <div key={attr.label}>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className={attr.color}>{attr.label}</span>
                        <span className="text-white/60">{attr.value} XP</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div className={`h-full ${attr.bg} rounded-full`} style={{ width: `${Math.min(100, (attr.value / attr.max) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL DE CONQUISTAS */}
        <AnimatePresence>
          {showAchievements && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[4px] z-[999999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-md bg-[#090d1f] border border-amber-500/30 rounded-3xl p-5 shadow-[0_20px_50px_rgba(245,158,11,0.2)] relative flex flex-col gap-4"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
                
                <button
                  onClick={() => setShowAchievements(false)}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X size={14} />
                </button>

                <div className="flex items-center gap-3">
                  <div className="text-4xl">🏆</div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">SISTEMA DE GAMIFICAÇÃO</span>
                    <h2 className="text-lg font-black text-white leading-tight">Conquistas do Ploc</h2>
                  </div>
                </div>

                <div className="flex flex-col gap-1 bg-slate-950/60 rounded-2xl p-3 border border-white/5">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <span>Progresso de Desbloqueio</span>
                    <span className="text-amber-400">{unlockedAchievements.length} / 5</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 mt-1 relative">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${(unlockedAchievements.length / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto pr-1 scrollbar-hide">
                  {ACHIEVEMENTS_LIST.map((ach) => {
                    const unlockInfo = unlockedAchievements.find(item => item.id === ach.id);
                    const isUnlocked = !!unlockInfo;

                    return (
                      <div 
                        key={ach.id}
                        className={`flex gap-3 items-center p-2.5 rounded-2xl border transition-all ${
                          isUnlocked 
                            ? 'bg-amber-500/5 border-amber-500/20' 
                            : 'bg-slate-950/40 border-white/5 opacity-55'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                          isUnlocked ? 'bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.25)]' : 'bg-slate-900'
                        }`}>
                          {isUnlocked ? ach.icon : '🔒'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-1">
                            <h3 className={`text-xs font-black truncate leading-tight ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                              {ach.title}
                            </h3>
                            {isUnlocked ? (
                              <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0">Libera</span>
                            ) : (
                              <span className="text-[8px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0">Trancado</span>
                            )}
                          </div>
                          <p className="text-[9.5px] text-slate-400 leading-tight mt-0.5 font-semibold">
                            {isUnlocked ? ach.desc : ach.hint}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </AppShell>
  );
}
