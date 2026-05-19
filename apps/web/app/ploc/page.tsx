'use client';

/**
 * ============================================================================
 * Central do Ploc e Guarda-Roupa - page.tsx
 * ============================================================================
 * Descrição: Central gamer hiper-compacta de customização e status do Ploc.
 * Permite equipar cabelos, chapéus, roupas, auras, sapatos e cores de corpo,
 * com persistência local e visualização no pedestal holográfico, além de
 * explicar e detalhar os estados de humor e fúria em tempo real.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Eye, Smile, Scissors, Shirt, Flame, RotateCcw, 
  Heart, Award, Sparkle, CircleDot, Palette, Footprints,
  Clock, Gamepad2, TrendingUp, X, HelpCircle, Info
} from 'lucide-react';
import { PlocAppearance, DEFAULT_PLOC_APPEARANCE, PlocEyeType, PlocMouthType, PlocHairType, PlocClothesType, PlocHatType, PlocAuraType, PlocShoesType } from '@/components/mascot/types';
import { PlocAvatarClient } from '@/components/mascot/PlocAvatarClient';
import { attributeEngine } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';
import { triggerAchievementUnlock, ACHIEVEMENTS_LIST } from '@/components/mascot/achievements';

// Síntese de som procedural retro chique ao vestir roupas/acessórios usando Web Audio API
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
    osc.frequency.setValueAtTime(587.33, now); // Ré5
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.12); // Ré6

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.start(now);
    osc.stop(now + 0.24);
  } catch (e) {}
};

// Dados ricos sobre os humores do Ploc (Histórias de Personagem para Gamificação)
interface MoodInfo {
  title: string;
  emoji: string;
  desc: string;
  duration: string;
  cure: string;
  color: string;
}

const MOODS_DATA: Record<string, MoodInfo> = {
  calm: {
    title: 'Calmo',
    emoji: '😌',
    desc: 'O Ploc está em equilíbrio perfeito. Você tem cuidado muito bem das suas obrigações e evitou perturbar o sono dele.',
    duration: 'Permanente (até o estresse acumular)',
    cure: 'Já está no melhor estado possível! Continue focado.',
    color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20'
  },
  happy: {
    title: 'Feliz',
    emoji: '😊',
    desc: 'Você concluiu tarefas recentes com louvor! Ele está extremamente orgulhoso e sua vibração positiva o contagiou.',
    duration: 'Duração: 1 hora de bônus de energia',
    cure: 'Excelente estado! Continue realizando rotinas para manter o Ploc feliz.',
    color: 'border-pink-500/30 text-pink-400 bg-pink-950/20'
  },
  stressed: {
    title: 'Estressado',
    emoji: '😰',
    desc: 'Você acumulou tarefas atrasadas ou clicou no Ploc repetidamente. Ele está começando a perder a paciência gelatinosa!',
    duration: 'Duração: 30 minutos',
    cure: 'Conclua qualquer rotina pendente no Dashboard para restabelecer o foco dele imediatamente!',
    color: 'border-amber-500/30 text-amber-400 bg-amber-950/20'
  },
  pissed: {
    title: 'Zangado',
    emoji: '😡',
    desc: 'Você perturbou demais a paz dele com muitos cliques seguidos! Ele se recusa a cooperar e está com fúria ativa.',
    duration: 'Duração: 45 minutos',
    cure: 'Equilibre todos os 5 atributos fake no nível 5 estourando as bolhas de atributos na Landing Page para provar seu equilíbrio e reconquistar a confiança dele!',
    color: 'border-rose-500/30 text-rose-400 bg-rose-950/20'
  },
  sleeping: {
    title: 'Dormindo',
    emoji: '😴',
    desc: 'O Ploc trabalhou duro ajudando você a se concentrar e entrou no modo de repouso para repor a energia de gel.',
    duration: 'Duração: 1 hora de sono reparador',
    cure: 'Você pode acordá-lo concluindo uma rotina importante ou dando um clique amigável na tela inicial.',
    color: 'border-indigo-500/30 text-indigo-400 bg-indigo-950/20'
  },
  dizzy: {
    title: 'Tonto',
    emoji: '😵',
    desc: 'Você arrastou o Ploc de um lado para o outro muito rápido na tela! Ele perdeu o senso de direção e está confuso.',
    duration: 'Duração: 5 minutos',
    cure: 'Deixe-o quieto no pedestal por alguns instantes ou conclua uma tarefa rápida para ele recuperar a postura.',
    color: 'border-violet-500/30 text-violet-400 bg-violet-950/20'
  }
};

export default function PlocCentralPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [appearance, setAppearance] = useState<PlocAppearance>(DEFAULT_PLOC_APPEARANCE);
  const [selectedEmotion, setSelectedEmotion] = useState<'calm' | 'happy' | 'stressed' | 'pissed' | 'sleeping' | 'dizzy'>('calm');
  const [activeTab, setActiveTab] = useState<'eyes' | 'mouth' | 'hair' | 'clothes' | 'hat' | 'aura' | 'shoes' | 'bodyColor'>('eyes');
  
  // Estado para o Modal Explicativo de Humores
  const [selectedMoodExplain, setSelectedMoodExplain] = useState<string | null>(null);

  // Estado para o painel de conquistas
  const [showAchievements, setShowAchievements] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Array<{ id: string; date: string }>>([]);

  // Blackboard user attributes
  const [attributes, setAttributes] = useState({
    corpo: 0,
    mente: 0,
    vida: 0,
    liberdade: 0,
    proposito: 0
  });
  const [plocStats, setPlocStats] = useState({ level: 1, clicks: 0, needed: 15 });

  useEffect(() => {
    setIsMounted(true);

    // Carrega customização atual
    const saved = localStorage.getItem('ploc_appearance');
    if (saved) {
      try {
        setAppearance(JSON.parse(saved));
      } catch (e) {}
    }

    // Carrega conquistas iniciais
    const savedAch = localStorage.getItem('ploc_achievements') || '[]';
    try {
      setUnlockedAchievements(JSON.parse(savedAch));
    } catch (e) {}

    // Escuta evento de conquistas destravadas em tempo real
    const handleAchUnlocked = () => {
      const updatedAch = localStorage.getItem('ploc_achievements') || '[]';
      try {
        setUnlockedAchievements(JSON.parse(updatedAch));
      } catch (e) {}
    };
    window.addEventListener('ploc_achievement_unlocked', handleAchUnlocked);

    // Carrega atributos e estatísticas físicas
    const attrs = attributeEngine.getAttributes();
    setAttributes({
      corpo: attrs.corpo,
      mente: attrs.mente,
      vida: attrs.vida,
      liberdade: attrs.liberdade,
      proposito: attrs.proposito
    });

    const savedLevel = parseInt(localStorage.getItem('ploc_anger_level') || '1');
    const savedClicks = parseInt(localStorage.getItem('ploc_anger_clicks') || '0');
    const needed = Math.floor(Math.pow(savedLevel, 3) * 15);
    setPlocStats({
      level: savedLevel,
      clicks: savedClicks,
      needed
    });

    return () => {
      window.removeEventListener('ploc_achievement_unlocked', handleAchUnlocked);
    };
  }, []);

  if (!isMounted) return null;

  // Atualiza um item de customização e salva no localstorage
  const handleEquipItem = (category: keyof PlocAppearance, value: string) => {
    const updated = {
      ...appearance,
      [category]: value
    };
    setAppearance(updated);
    localStorage.setItem('ploc_appearance', JSON.stringify(updated));
    
    // Força disparar storage event local para sincronizar abas do navegador
    window.dispatchEvent(new Event('storage'));

    playEquipSound();

    // Desbloqueia Astronauta do Caos se equipou qualquer Aura que não seja 'none'
    if (category === 'aura' && value !== 'none') {
      triggerAchievementUnlock('astronauta_caos');
    }

    // Desbloqueia Estilista Gelatinoso se todos os slots de vestuário/aura estão equipados
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

  // Itens do Guarda Roupa
  const eyesOptions = [
    { id: 'bored', label: 'Entediado', desc: 'Olhar padrão focado.', icon: '👁️' },
    { id: 'cute', label: 'Fofinho', desc: 'Olhos grandes com brilhos.', icon: '🥺' },
    { id: 'anime', label: 'Anime', desc: 'Olhar brilhante e reluzente.', icon: '✨' },
    { id: 'nerd', label: 'Intelectual', desc: 'Óculos clássicos de aro.', icon: '👓' },
    { id: 'sparkle', label: 'Estrela', desc: 'Olhos mágicos dourados.', icon: '⭐' },
    { id: 'spiral', label: 'Confuso', desc: 'Espiral hipnotizante.', icon: '🌀' },
  ];

  const mouthOptions = [
    { id: 'straight', label: 'Reta', desc: 'Expressão neutra clássica.', icon: '😐' },
    { id: 'smile', label: 'Sorriso', desc: 'Simpatia amigável.', icon: '👄' },
    { id: 'sad', label: 'Preocupado', desc: 'Expressão reflexiva.', icon: '😟' },
    { id: 'shock', label: 'Espanto', desc: 'Surpresa total.', icon: '😮' },
    { id: 'wavy', label: 'Divertida', desc: 'Boca ondulada de humor.', icon: '〰️' },
    { id: 'masculine', label: 'Voz Masc.', desc: 'Mouth sync masculino.', icon: '👨' },
    { id: 'feminine', label: 'Voz Fem.', desc: 'Mouth sync feminino.', icon: '👩' },
    { id: 'none', label: 'Sem Boca', desc: 'Visual gel clássico.', icon: '❌' },
  ];

  const hairOptions = [
    { id: 'none', label: 'Nenhum', desc: 'Sem cabelo.', icon: '🥚' },
    { id: 'pompadour', label: 'Topete Retrô', desc: 'Volume de topete retrô.', icon: '💇' },
    { id: 'spiky', label: 'Espetado', desc: 'Cabelo de herói de batalha.', icon: '💥' },
    { id: 'afro', label: 'Black Power', desc: 'Cabelo estiloso redondo.', icon: '✊' },
    { id: 'curls', label: 'Cachos', desc: 'Cachos laterais fofos.', icon: '🌀' },
    { id: 'bangs', label: 'Franja Roxa', desc: 'Cyberpunk moderno.', icon: '💜' },
  ];

  const clothesOptions = [
    { id: 'none', label: 'Nenhuma', desc: 'Gelatina nua.', icon: '❌' },
    { id: 'hoodie', label: 'Moletom', desc: 'Moletom casual ciano.', icon: '👕' },
    { id: 'suit', label: 'Terno', desc: 'Gravata borboleta chique.', icon: '👔' },
    { id: 'cape', label: 'Capa', desc: 'Capa esvoaçante de herói.', icon: '🧣' },
    { id: 'armor', label: 'Armadura', desc: 'Cota metálica brilhante.', icon: '🛡️' },
  ];

  const hatOptions = [
    { id: 'none', label: 'Nenhum', desc: 'Sem chapéu.', icon: '🥚' },
    { id: 'cap', label: 'Boné', desc: 'Boné esportivo de lado.', icon: '🧢' },
    { id: 'tophat', label: 'Cartola', desc: 'Cartola com fita vermelha.', icon: '🎩' },
    { id: 'crown', label: 'Coroa', desc: 'Coroa Imperial com rubis.', icon: '👑' },
    { id: 'beanie', label: 'Gorro', desc: 'Gorro aconchegante de lã.', icon: '🧶' },
    { id: 'horns', label: 'Chifres', desc: 'Chifrinhos de fogo.', icon: '😈' },
  ];

  const auraOptions = [
    { id: 'none', label: 'Nenhuma', desc: 'Sem aura ativa.', icon: '❌' },
    { id: 'success', label: 'Sucesso', desc: 'Glow solar dourado.', icon: '☀️' },
    { id: 'disaster', label: 'Caos', desc: 'Névoa roxa de desastre.', icon: '🔮' },
    { id: 'fire', label: 'Chamas', desc: 'Fogo flamejante místico.', icon: '🔥' },
    { id: 'star', label: 'Estrelas', desc: 'Partículas cintilantes.', icon: '⭐' },
  ];

  const shoesOptions = [
    { id: 'none', label: 'Nenhum', desc: 'Pés descalços.', icon: '👣' },
    { id: 'sneakers', label: 'Tênis', desc: 'Sapatilhas vermelhas.', icon: '👟' },
    { id: 'boots', label: 'Botas', desc: 'Botas aventureiras de couro.', icon: '🥾' },
    { id: 'slippers', label: 'Pantuflas', desc: 'Pantuflas fofas de coelho.', icon: '🐰' },
  ];

  const bodyColorOptions = [
    { id: 'classic', label: 'Ciano', desc: 'Cor gelatina padrão.', icon: '🔵', hex: 'bg-cyan-400' },
    { id: 'rose', label: 'Rosa Doce', desc: 'Tom fofinho de morango.', icon: '🌸', hex: 'bg-rose-400' },
    { id: 'gold', label: 'Dourado', desc: 'Glow metálico de vitória.', icon: '👑', hex: 'bg-amber-400' },
    { id: 'emerald', label: 'Esmeralda', desc: 'Equilíbrio e cura total.', icon: '❇️', hex: 'bg-emerald-400' },
    { id: 'purple', label: 'Místico', desc: 'Roxo cósmico estrelado.', icon: '🔮', hex: 'bg-violet-400' },
    { id: 'lava', label: 'Lava', desc: 'Vermelho vulcânico vivo.', icon: '🔥', hex: 'bg-red-500' }
  ];

  // Identifica a lista ativa baseado no activeTab
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
      default: return { options: eyesOptions, category: 'eyes' as const };
    }
  };

  const { options: currentOptions, category: currentCategory } = getActiveOptions();

  return (
    <AppShell>
      <div className="w-full h-full bg-[#020617] text-white flex flex-col items-center justify-start overflow-hidden px-4 py-3 relative">
        
        {/* TOP BAR / CABEÇALHO HIPER COMPACTO */}
        <div className="w-full max-w-5xl flex items-center justify-between gap-4 mb-2 shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="text-rose-500 fill-rose-500 animate-pulse" size={16} />
            <h1 className="text-sm font-black uppercase tracking-widest bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              Ploc Central
            </h1>
            <span className="text-[10px] text-slate-500 font-bold hidden sm:inline">| Camarim de Customização</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAchievements(true)}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full hover:bg-amber-500/20 transition-all text-[9px] font-black text-amber-300 active:scale-95 hover:text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.05)]"
            >
              <Award size={10} className="text-amber-400" /> Conquistas ({unlockedAchievements.length}/5)
            </button>
            <button
              onClick={handleResetAppearance}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-900/80 border border-white/5 rounded-full hover:bg-slate-800 transition-all text-[9px] font-black text-slate-400 active:scale-95 hover:text-slate-200"
            >
              <RotateCcw size={10} /> Restaurar Padrão
            </button>
          </div>
        </div>

        {/* 1. STATUS GRID (Div de Status no Topo - Bento Reduzido) */}
        <div className="w-full max-w-5xl bg-slate-950/40 border border-white/5 rounded-2xl p-2.5 grid grid-cols-5 gap-2 shrink-0 shadow-lg relative overflow-hidden mb-2">
          {/* Atributo Corpo */}
          <div className="flex flex-col gap-0.5 justify-center">
            <span className="text-[8px] font-black text-rose-500 uppercase tracking-wider flex items-center gap-0.5">
              <Flame size={8} /> CORPO
            </span>
            <div className="text-xs font-black text-white">{attributes.corpo} XP</div>
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full" style={{ width: `${Math.min(100, (attributes.corpo / 250) * 100)}%` }} />
            </div>
          </div>

          {/* Atributo Mente */}
          <div className="flex flex-col gap-0.5 justify-center">
            <span className="text-[8px] font-black text-sky-500 uppercase tracking-wider flex items-center gap-0.5">
              <Sparkles size={8} /> MENTE
            </span>
            <div className="text-xs font-black text-white">{attributes.mente} XP</div>
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full" style={{ width: `${Math.min(100, (attributes.mente / 250) * 100)}%` }} />
            </div>
          </div>

          {/* Atributo Vida */}
          <div className="flex flex-col gap-0.5 justify-center">
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-wider flex items-center gap-0.5">
              <Heart size={8} /> VIDA
            </span>
            <div className="text-xs font-black text-white">{attributes.vida} XP</div>
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" style={{ width: `${Math.min(100, (attributes.vida / 250) * 100)}%` }} />
            </div>
          </div>

          {/* Atributo Liberdade */}
          <div className="flex flex-col gap-0.5 justify-center">
            <span className="text-[8px] font-black text-amber-500 uppercase tracking-wider flex items-center gap-0.5">
              <CircleDot size={8} /> LIBERDADE
            </span>
            <div className="text-xs font-black text-white">{attributes.liberdade} XP</div>
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" style={{ width: `${Math.min(100, (attributes.liberdade / 250) * 100)}%` }} />
            </div>
          </div>

          {/* Atributo Propósito */}
          <div className="flex flex-col gap-0.5 justify-center">
            <span className="text-[8px] font-black text-violet-500 uppercase tracking-wider flex items-center gap-0.5">
              <Sparkle size={8} /> PROPÓSITO
            </span>
            <div className="text-xs font-black text-white">{attributes.proposito} XP</div>
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full" style={{ width: `${Math.min(100, (attributes.proposito / 250) * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* 2. GRID DE BOTÕES DE CATEGORIAS (Apenas Ícones de Personalização) */}
        <div className="w-full max-w-5xl grid grid-cols-8 gap-2 shrink-0 mb-2">
          {[
            { id: 'eyes' as const, icon: <Eye size={16} />, label: 'Olhos' },
            { id: 'mouth' as const, icon: <Smile size={16} />, label: 'Boca' },
            { id: 'hair' as const, icon: <Scissors size={16} />, label: 'Cabelo' },
            { id: 'clothes' as const, icon: <Shirt size={16} />, label: 'Roupas' },
            { id: 'hat' as const, icon: <Award size={16} />, label: 'Chapéu' },
            { id: 'aura' as const, icon: <Sparkles size={16} />, label: 'Aura' },
            { id: 'shoes' as const, icon: <Footprints size={16} />, label: 'Sapatos' },
            { id: 'bodyColor' as const, icon: <Palette size={16} />, label: 'Cor' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all relative ${
                activeTab === tab.id
                  ? 'bg-rose-500/10 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.15)] font-bold'
                  : 'bg-slate-950/40 border-white/5 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
              }`}
              title={tab.label}
            >
              {tab.icon}
              <span className="text-[7.5px] font-black uppercase tracking-wider hidden md:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 3. SHELF DE OPÇÕES (Carrossel Horizontal com Pequenos Cards logo abaixo das Categorias) */}
        <div className="w-full max-w-5xl shrink-0 mb-3 bg-slate-950/40 border border-white/5 rounded-2xl p-2 relative shadow-inner overflow-hidden">
          <div className="flex items-center gap-1.5 px-1 mb-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
            <Info size={10} className="text-slate-500 shrink-0" />
            <span>Opções Disponíveis para Equipar</span>
          </div>

          <div className="flex overflow-x-auto gap-2.5 pb-1 pt-0.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {currentOptions.map((opt) => {
              const isEquipped = (appearance as any)[currentCategory] === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleEquipItem(currentCategory, opt.id)}
                  className={`flex-shrink-0 w-24 rounded-xl border p-1.5 flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 justify-between relative ${
                    isEquipped
                      ? 'bg-rose-500/10 border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                      : 'bg-slate-900/30 border-white/5 hover:bg-slate-900/60 hover:border-white/10'
                  }`}
                >
                  {/* Visual Preview / Ícone ou Badge Redonda */}
                  <div className="w-9 h-9 rounded-full bg-slate-950/80 border border-white/5 flex items-center justify-center text-base mb-1 shadow-inner relative overflow-hidden">
                    {(opt as any).hex ? (
                      <span className={`w-5 h-5 rounded-full ${(opt as any).hex} shadow-md`} />
                    ) : (
                      opt.icon
                    )}
                    {isEquipped && (
                      <span className="absolute inset-0 bg-rose-500/5 animate-pulse" />
                    )}
                  </div>

                  {/* Nome do Item */}
                  <div className="text-[10px] font-black text-slate-100 truncate w-full leading-tight">
                    {opt.label}
                  </div>

                  {/* Descrição Curta */}
                  <div className="text-[8px] text-slate-400 line-clamp-1 w-full mt-0.5 select-none leading-none">
                    {opt.desc}
                  </div>

                  {/* Equipado Badge */}
                  {isEquipped && (
                    <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500 border border-white/20 animate-ping" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. PEDESTAL DE VISUALIZAÇÃO DO PLOC (Centralizado e Compacto) */}
        <div className="w-full max-w-5xl h-[210px] sm:h-[240px] bg-slate-950/40 border border-white/5 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-4 mb-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] shrink-0">
          {/* Linha Radial do Holograma e Grade */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:16px_16px] opacity-15" />
          <div className="absolute bottom-[22%] w-[130px] h-[25px] bg-rose-500/5 rounded-full blur-[8px] transform scale-y-[0.35] border border-rose-500/20" />
          
          {/* Pedestal de Luz */}
          <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-rose-950/10 via-transparent to-transparent pointer-events-none" />

          {/* O Ploc flutuando gigante */}
          <div className="w-[150px] h-[150px] flex items-center justify-center z-10 relative">
            <PlocAvatarClient emotion={selectedEmotion} />
          </div>

          {/* Legendinha de Teste */}
          <div className="absolute top-3 left-3 px-2 py-1 bg-slate-900/80 border border-white/5 rounded-lg text-[9px] font-black text-rose-400 flex items-center gap-1 backdrop-blur-[4px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Showcase Ativo
          </div>
        </div>

        {/* 5. ESTADOS DE HUMOR (Read-only com Modal Explicativo Interativo) */}
        <div className="w-full max-w-5xl shrink-0 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1">
              <Clock size={11} className="text-rose-500" />
              Estados de Humor do Ploc <span className="text-slate-600 font-bold">(Exibições Clínicas)</span>
            </span>
            <span className="text-[8px] text-slate-500">Clique para aprender a curar</span>
          </div>

          <div className="grid grid-cols-6 gap-2 w-full">
            {[
              { id: 'calm', label: 'Calmo 😌' },
              { id: 'happy', label: 'Feliz 😊' },
              { id: 'stressed', label: 'Estressado 😰' },
              { id: 'pissed', label: 'Zangado 😡' },
              { id: 'sleeping', label: 'Dormindo 😴' },
              { id: 'dizzy', label: 'Tonto 😵' }
            ].map((emo) => {
              const isActive = selectedEmotion === emo.id;
              return (
                <button
                  key={emo.id}
                  onClick={() => {
                    setSelectedEmotion(emo.id as any);
                    setSelectedMoodExplain(emo.id);
                  }}
                  className={`py-1.5 px-1 rounded-xl border text-[9px] font-black transition-all text-center flex flex-col items-center justify-center gap-0.5 active:scale-95 ${
                    isActive
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                      : 'bg-slate-950/40 border-white/5 text-slate-400 hover:bg-slate-900/30 hover:text-slate-300'
                  }`}
                >
                  <span className="truncate w-full">{emo.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. MODAL EXPLICATIVO INTERATIVO DE HUMORES (Popup com Framer Motion) */}
        <AnimatePresence>
          {selectedMoodExplain && MOODS_DATA[selectedMoodExplain] && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[8px] flex items-center justify-center z-[99999] p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={`w-full max-w-md bg-[#090d1f] border rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative flex flex-col gap-4 overflow-hidden ${MOODS_DATA[selectedMoodExplain].color}`}
              >
                {/* Linha brilhante interna decorativa */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500" />
                
                {/* Botão Fechar */}
                <button
                  onClick={() => setSelectedMoodExplain(null)}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-90"
                >
                  <X size={14} />
                </button>

                {/* Cabeçalho do Humor */}
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{MOODS_DATA[selectedMoodExplain].emoji}</div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-rose-500">EXPLICATIVO DE HUMOR</span>
                    <h2 className="text-lg font-black text-white leading-tight">Estado: {MOODS_DATA[selectedMoodExplain].title}</h2>
                  </div>
                </div>

                {/* Por que ele está assim? */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <HelpCircle size={10} className="text-rose-400" /> Por que ele está assim?
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                    {MOODS_DATA[selectedMoodExplain].desc}
                  </p>
                </div>

                {/* Tempo Restante */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock size={10} className="text-sky-400" /> Tempo de Permanência
                  </span>
                  <p className="text-[11px] text-sky-300 font-black">
                    {MOODS_DATA[selectedMoodExplain].duration}
                  </p>
                </div>

                {/* Como curar sem esperar o timer */}
                <div className="flex flex-col gap-1.5 bg-slate-950/60 rounded-2xl p-3 border border-white/5">
                  <span className="text-[9px] font-black text-rose-400 uppercase tracking-wider flex items-center gap-1">
                    <Gamepad2 size={11} /> Como acalmar ou reverter imediatamente?
                  </span>
                  <p className="text-[10.5px] text-slate-300 leading-relaxed font-medium">
                    {MOODS_DATA[selectedMoodExplain].cure}
                  </p>
                </div>

                {/* Botão Entendido */}
                <button
                  onClick={() => setSelectedMoodExplain(null)}
                  className="w-full py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl font-bold text-xs active:scale-95 transition-all text-white shadow-lg"
                >
                  Entendido, entendi o Ploc!
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal de Conquistas Gamificadas */}
        <AnimatePresence>
          {showAchievements && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[4px] z-[999999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-md bg-[#090d1f] border border-amber-500/30 rounded-3xl p-5 shadow-[0_20px_50px_rgba(245,158,11,0.2)] relative flex flex-col gap-4 overflow-hidden"
              >
                {/* Linha brilhante interna decorativa dourada */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
                
                {/* Botão Fechar */}
                <button
                  onClick={() => setShowAchievements(false)}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-90"
                >
                  <X size={14} />
                </button>

                {/* Cabeçalho */}
                <div className="flex items-center gap-3">
                  <div className="text-4xl">🏆</div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">SISTEMA DE GAMIFICAÇÃO</span>
                    <h2 className="text-lg font-black text-white leading-tight">Conquistas do Ploc</h2>
                  </div>
                </div>

                {/* Barra de Progresso Geral */}
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
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Lista de Conquistas */}
                <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto pr-1 ploc-custom-scrollbar">
                  {ACHIEVEMENTS_LIST.map((ach) => {
                    const unlockInfo = unlockedAchievements.find(item => item.id === ach.id);
                    const isUnlocked = !!unlockInfo;

                    return (
                      <div 
                        key={ach.id}
                        className={`flex gap-3 items-center p-2.5 rounded-2xl border transition-all duration-200 ${
                          isUnlocked 
                            ? 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10' 
                            : 'bg-slate-950/40 border-white/5 opacity-55'
                        }`}
                      >
                        {/* Ícone */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                          isUnlocked ? 'bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.25)]' : 'bg-slate-900'
                        }`}>
                          {isUnlocked ? ach.icon : '🔒'}
                        </div>

                        {/* Detalhes */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-1">
                            <h3 className={`text-xs font-black truncate leading-tight ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                              {ach.title}
                            </h3>
                            {isUnlocked ? (
                              <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0">
                                Libera
                              </span>
                            ) : (
                              <span className="text-[8px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0">
                                Trancado
                              </span>
                            )}
                          </div>
                          <p className="text-[9.5px] text-slate-400 leading-tight mt-0.5 font-semibold">
                            {isUnlocked ? ach.desc : ach.hint}
                          </p>
                          {isUnlocked && unlockInfo.date && (
                            <span className="text-[7.5px] text-slate-600 block mt-0.5">
                              Conquistado em: {unlockInfo.date}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Botão Entendido */}
                <button
                  onClick={() => setShowAchievements(false)}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 rounded-xl font-bold text-xs active:scale-95 transition-all text-slate-950 shadow-lg mt-1"
                >
                  Fechar Camarim de Conquistas
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </AppShell>
  );
}
