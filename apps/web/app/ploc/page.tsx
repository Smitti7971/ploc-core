'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, Award, Fingerprint, BarChart3
} from 'lucide-react';
import { PlocAppearance, DEFAULT_PLOC_APPEARANCE } from '@/components/mascot/types';
import { PlocAvatarClient } from '@/components/mascot/PlocAvatarClient';
import { attributeEngine } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';
import { PlocStatsModal } from '@/modules/ploc/components/PlocStatsModal';


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
  const [activeTab, setActiveTab] = useState<'bodyColor' | null>(null);
  
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
    const updated = { ...appearance, [category]: value } as PlocAppearance;
    setAppearance(updated);
    localStorage.setItem('ploc_appearance', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    playEquipSound();
  };

  const handleResetAppearance = () => {
    setAppearance(DEFAULT_PLOC_APPEARANCE);
    localStorage.setItem('ploc_appearance', JSON.stringify(DEFAULT_PLOC_APPEARANCE));
    window.dispatchEvent(new Event('storage'));
    playEquipSound();
  };

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
              

            </div>

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

        <AnimatePresence>
          {showStats && <PlocStatsModal attributes={attributes} onClose={() => setShowStats(false)} />}
        </AnimatePresence>



      </div>
    </AppShell>
  );
}
