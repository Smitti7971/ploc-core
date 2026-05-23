'use client';

/**
 * @module BlackboardPage
 * @description O quadro principal de interação do Ploc. Um canvas de panning/zoom infinito
 * que gerencia o estado da câmera, orquestra as bolhas de tarefas, anotações (post-its) e
 * a interação com o mascote virtual.
 */

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { PlocAvatarClient } from '@/components/mascot/PlocAvatarClient';
import {
  Settings,
  LogOut,
  Maximize2,
  Minimize2,
  Grid3X3,
  Plus,
  Target,
  Clock,
  Brain,
  Activity as ActivityIcon,
  Sparkles,
  HelpCircle,
  ChevronRight,
  Map,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useMotionValueEvent, animate } from 'framer-motion';
import { DockMenu } from '@/components/layout/DockMenu';

import { AttributeMonitor } from './AttributeMonitor';
import { bubbleEngine } from '../engine/bubble-engine/BubbleEngine';
import { BlackboardBubble } from '../types/bubbles';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '../events/eventBus';
import { ViceBubble } from '../../libertesse/components/ViceBubble';
import { routineEngine } from '../engine/routine-engine/RoutineEngine';
import { TutorialOcean } from './TutorialOcean';
import { attributeEngine } from '../engine/attribute-engine/AttributeEngine';
import { plocEngine } from '../engine/ploc-engine/PlocEngine';

// Components extraídos
import { BlackboardStickyNote } from './BlackboardStickyNote';
import { BlackboardBubbleItem } from './BlackboardBubbleItem';

import { AmbientGlowBackground } from '../../landing/particles/AmbientGlowBackground';
import { Vignette } from '../../landing/particles/Vignette';
import { SodaWave } from '../../landing/particles/SodaWave';
import { useViceStore } from '../../libertesse/store/viceStore';

interface StickyNote {
  id: number;
  content: string;
  x: number;
  y: number;
  colorClass: string;
}

const NOTE_COLORS = ['', 'note-blue', 'note-green', 'note-pink', 'note-purple'] as const;

const BUBBLE_COLORS: Record<string, string> = {
  task: '#ef4444',       // Corpo
  knowledge: '#38bdf8',  // Mente
  insight: '#facc15',    // Vida
  routine: '#2dd4bf',    // Liberdade
  bright_idea: '#c084fc', // Propósito
  work: '#3b82f6',
  study: '#a855f7',
  health: '#10b981',
  personal: '#f59e0b',
  outward: '#ef4444'     // Hábito/Cigarro
};

export default function BlackboardPage() {
  const { user, token, logout } = useAuthStore();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  // Espera a hidratação do Zustand (carregar do localStorage)
  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    if (useAuthStore.persist.hasHydrated()) {
      setTimeout(() => setIsHydrated(true), 0);
    }

    return () => unsub();
  }, []);

  // Redireciona se não houver usuário (sessão perdida) - APÓS HIDRATAÇÃO
  useEffect(() => {
    if (isHydrated && !user && typeof window !== 'undefined') {
      router.push('/');
    }
  }, [isHydrated, user, router]);

  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [capsuleOpen, setCapsuleOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showMinimap, setShowMinimap] = useState(false);
  const [showAttributes, setShowAttributes] = useState(false);
  const scale = 1; // Constante mantida para compatibilidade visual dos filhos
  const [bubbles, setBubbles] = useState<BlackboardBubble[]>([]);
  const [viewMode, setViewMode] = useState<'free' | '1h' | 'day' | 'week' | 'month'>('day');
  const [lastCompleted, setLastCompleted] = useState<string | null>(null);
  const [plocReaction, setPlocReaction] = useState<'idle' | 'happy' | 'stressed' | 'dizzy'>('idle');
  const [score, setScore] = useState(attributeEngine.getScore());
  const [showFocusInfo, setShowFocusInfo] = useState(false);
  const [selectedBubble, setSelectedBubble] = useState<BlackboardBubble | null>(null);
  const [interactionNote, setInteractionNote] = useState('');
  const [sodaWaveKey, setSodaWaveKey] = useState(0);

  // Janela de tempo baseada no modo de visualização
  const getWindowMinutes = useCallback(() => {
    switch (viewMode) {
      case '1h': return 60;
      case 'day': return 1440;
      case 'week': return 10080;
      case 'month': return 43200;
      default: return 60;
    }
  }, [viewMode]);

  const windowMinutes = getWindowMinutes();

  const containerRef = useRef<HTMLDivElement>(null);

  const [showTutorial, setShowTutorial] = useState(false);
  const [plocState, setPlocState] = useState(plocEngine.getState());
  const [plocMessage, setPlocMessage] = useState<string | null>(null);

  const [activeWaves, setActiveWaves] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  const mapX = useMotionValue(0);
  const mapY = useMotionValue(0);
  const mapScale = useMotionValue(1);

  // === LÓGICA DE CONSUMO ATIVO (LIBERTESSE) ===
  const { activeVice, endConsumption } = useViceStore();
  const [consumptionElapsed, setConsumptionElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeVice?.isConsuming && activeVice.consumptionStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - activeVice.consumptionStartTime!) / 1000);
        setConsumptionElapsed(elapsed);

        // Auto-encerra quando zera o cronômetro
        const limit = activeVice.defaultConsumptionSeconds || 300;
        if (elapsed >= limit) {
          endConsumption(elapsed);
        }
      }, 1000);
    } else {
      setConsumptionElapsed(0);
    }
    return () => clearInterval(interval);
  }, [activeVice?.isConsuming, activeVice?.consumptionStartTime, activeVice?.defaultConsumptionSeconds, endConsumption]);

  const formatConsumingTime = (seconds: number) => {
    const absSeconds = Math.abs(seconds);
    const m = Math.floor(absSeconds / 60);
    const s = absSeconds % 60;
    return `${seconds < 0 ? '+' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  const activeSecondsRemaining = (activeVice?.defaultConsumptionSeconds || 300) - consumptionElapsed;
  // ============================================
  const [minScale, setMinScale] = useState(0.25);

  const userClosedMinimap = useRef(false);
  const autoOpenedMinimap = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight;
      setMinScale(Math.max(0.1, vh / 3000));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useMotionValueEvent(mapX, "change", (latestX) => {
    const latestY = mapY.get();
    const distance = Math.sqrt(latestX * latestX + latestY * latestY);

    // Auto-abre quando afasta muito do centro
    if (distance > 500 && !showMinimap && !userClosedMinimap.current) {
      setShowMinimap(true);
      autoOpenedMinimap.current = true;
    } else if (distance <= 500 && showMinimap && autoOpenedMinimap.current && !userClosedMinimap.current) {
      setShowMinimap(false);
      autoOpenedMinimap.current = false;
    }

    // Auto-fecha quando volta pro centro
    if (distance < 50) {
      if (showMinimap) {
        setShowMinimap(false);
      }
      userClosedMinimap.current = false;
      autoOpenedMinimap.current = false;
    }
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault(); // Apenas previne rolagem se for pinch ou ctrl+wheel
      }

      // Fator de zoom sutil para roda do mouse e pinch
      const zoomFactor = 0.001;
      const currentScale = mapScale.get();
      let newScale = currentScale - e.deltaY * zoomFactor;

      newScale = Math.max(minScale, Math.min(newScale, 1.5));
      mapScale.set(newScale);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [minScale, mapScale]);

  const recenterMap = () => {
    animate(mapX, 0, { type: 'spring', stiffness: 300, damping: 30 });
    animate(mapY, 0, { type: 'spring', stiffness: 300, damping: 30 });
    animate(mapScale, 1, { type: 'spring', stiffness: 300, damping: 30 });
  };

  const zoomIn = () => {
    const target = Math.min(mapScale.get() + 0.2, 1.5);
    animate(mapScale, target, { duration: 0.2 });
  };
  const zoomOut = () => {
    const target = Math.max(mapScale.get() - 0.2, minScale);
    animate(mapScale, target, { duration: 0.2 });
  };

  const miniDotX = useTransform(mapX, [-1500, 1500], [-50, 50]);
  const miniDotY = useTransform(mapY, [-1500, 1500], [-50, 50]);
  // O viewport no minimapa diminui quando damos zoom out (segundo expectativa do usuário)
  // Então scale 1.5 = w-24 h-24, scale minScale = w-8 h-8
  const miniViewportSize = useTransform(mapScale, [1.5, minScale], [24, 8]);

  const addWave = (x: number, y: number, color: string) => {
    const id = Date.now() + Math.random();
    setActiveWaves(prev => [...prev, { id, x, y, color }]);
    setTimeout(() => {
      setActiveWaves(prev => prev.filter(w => w.id !== id));
    }, 2000);
  };

  useEffect(() => {
    const unsubscribe = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, (change: { pillar: string; value: number }) => {
      if (change.pillar === 'foco') {
        setScore(change.value);
      }
    });
    // Reações do Ploc a eventos das bolhas
    const unsubscribeTimeout = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_TIMEOUT, (bubble: BlackboardBubble) => {
      setPlocReaction('dizzy');
      if (bubble && typeof bubble.x === 'number') {
        addWave(bubble.x, bubble.y, '#ef4444'); // Vermelho para perda
      }
      setTimeout(() => setPlocReaction('idle'), 2000);
    });

    const unsubscribeExplosion = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, (bubble: BlackboardBubble & { collided?: boolean; value?: string }) => {
      if (bubble?.collided) return;
      const isNegative = bubble && bubble.value === 'negative';
      setPlocReaction(isNegative ? 'dizzy' : 'happy');
      if (bubble && typeof bubble.x === 'number') {
        const color = isNegative ? '#ef4444' : '#00ff88'; // Vermelho para negativas, verde neon para positivas
        addWave(bubble.x, bubble.y, color);
      }
      setTimeout(() => setPlocReaction('idle'), 1500);
    });

    return () => {
      unsubscribe();
      unsubscribeTimeout();
      unsubscribeExplosion();
    };
  }, [score]);

  // Sincroniza atributos reais do backend com o motor visual (AttributeEngine)
  useEffect(() => {
    if (user?.stats) {
      attributeEngine.syncWithBackend(user.stats);
    }
  }, [user]);



  // Load notes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ploc_blackboard_notes');
      if (saved) {
        setTimeout(() => setNotes(JSON.parse(saved)), 0);
      }
    } catch {
      setTimeout(() => setNotes([]), 0);
    }
  }, []);

  const saveNotes = useCallback((updated: StickyNote[]) => {
    setNotes(updated);
    localStorage.setItem('ploc_blackboard_notes', JSON.stringify(updated));
  }, []);


  const addNote = () => {
    const newNote: StickyNote = {
      id: Date.now(),
      content: '',
      // Nascimento no Marco Zero (com um pequeno offset aleatório para não sobrepor)
      x: 1000 + (Math.random() * 100 - 50),
      y: 1000 + (Math.random() * 100 - 50),
      colorClass: '',
    };
    saveNotes([...notes, newNote]);
  };

  const deleteNote = (id: number) => saveNotes(notes.filter((n) => n.id !== id));

  const updateNoteContent = (id: number, content: string) =>
    saveNotes(notes.map((n) => (n.id === id ? { ...n, content } : n)));

  const cycleNoteColor = (id: number) =>
    saveNotes(
      notes.map((n) => {
        if (n.id !== id) return n;
        const idx = NOTE_COLORS.indexOf(n.colorClass as typeof NOTE_COLORS[number]);
        return { ...n, colorClass: NOTE_COLORS[(idx + 1) % NOTE_COLORS.length] };
      })
    );

  const updateNotePosition = (id: number, x: number, y: number) =>
    saveNotes(notes.map((n) => (n.id === id ? { ...n, x, y } : n)));

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => { });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      }
      setIsFullScreen(false);
    }
  };

  // Bubble Engine Subscription & Event Listeners
  useEffect(() => {
    const unsubscribe = bubbleEngine.subscribe(setBubbles);

    const onExplode = (bubble: BlackboardBubble & { collided?: boolean; value?: string }) => {
      if (bubble?.collided) return;
      setLastCompleted(bubble.content);
      setPlocReaction('happy');
      addWave(bubble.x, bubble.y, 'rgba(34, 197, 94, 0.6)'); // Onda Verde (Sucesso)
      setTimeout(() => {
        setLastCompleted(null);
        setPlocReaction('idle');
      }, 3000);
    };

    const onTimeout = (bubble: BlackboardBubble) => {
      setPlocReaction('dizzy');
      addWave(4000, 4000, 'rgba(239, 68, 68, 0.6)'); // Onda Vermelha (Colisão no Centro)
      setTimeout(() => {
        setPlocReaction('idle');
      }, 3000);
    };

    blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, onExplode);
    blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_TIMEOUT, onTimeout);

    const unsubPloc = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, setPlocState);
    const unsubReaction = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.PLOC_REACTION, (reaction: { type: string; message?: string }) => {
      setPlocReaction(reaction.type.toLowerCase() as 'idle' | 'happy' | 'stressed' | 'dizzy');
      if (reaction.message) {
        setPlocMessage(reaction.message);
        setTimeout(() => setPlocMessage(null), 4000);
      }
      setTimeout(() => setPlocReaction('idle'), 4000);
    });

    // Verificar se é o primeiro acesso para o tutorial
    const hasSeenTutorial = localStorage.getItem('ploc_tutorial_seen');
    if (!hasSeenTutorial) {
      setTimeout(() => setShowTutorial(true), 0);
    }

    return () => {
      unsubscribe();
      unsubPloc();
      unsubReaction();
    };
  }, []);



  const spawnRandomAttributeBubble = () => {
    const types = [
      { attr: 'corpo', content: 'Treino Intenso 🏋️‍♂️', type: 'routine' },
      { attr: 'vida', content: 'Tempo em Família 🏠', type: 'routine' },
      { attr: 'liberdade', content: 'Momento Offline 🌲', type: 'routine' },
      { attr: 'proposito', content: 'Trabalho com Significado 🎯', type: 'work' },
      { attr: 'mente', content: 'Estudo Profundo 📚', type: 'study' }
    ];
    const pick = types[Math.floor(Math.random() * types.length)];
    bubbleEngine.spawnBubble(pick.type as BlackboardBubble['type'], pick.content, 10, { rewardAttribute: pick.attr });
  };

  return (
    <div
      className="blackboard-page w-screen h-screen bg-[#0a0c0a] overflow-hidden relative font-sans touch-none"
      ref={containerRef}
    >
      <AmbientGlowBackground />
      <Vignette />
      <SodaWave key={sodaWaveKey} />

      <div
        id="blackboard-canvas"
        className="w-full h-full relative p-0 m-0 bg-transparent overflow-hidden"
      >
        <motion.div
          drag
          dragConstraints={{ left: -1500, right: 1500, top: -1500, bottom: 1500 }}
          dragElastic={0}
          dragMomentum={true}
          style={{ x: mapX, y: mapY }}
          whileTap={{ cursor: "grabbing" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10000px] h-[10000px] cursor-grab active:cursor-grabbing touch-none z-[2]"
        >
          <motion.div
            style={{ scale: mapScale }}
            className="w-full h-full relative origin-center"
          >
            <div
              className="canvas-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50000px] h-[50000px] bg-transparent overflow-visible pointer-events-none"
              style={{
                backgroundImage: showGrid
                  ? `linear-gradient(rgba(56, 189, 248, 0.05) 2px, transparent 2px),
                   linear-gradient(90deg, rgba(56, 189, 248, 0.05) 2px, transparent 2px),
                   linear-gradient(rgba(56, 189, 248, 0.02) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(56, 189, 248, 0.02) 1px, transparent 1px)`
                  : `radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
                backgroundSize: showGrid
                  ? '100px 100px, 100px 100px, 20px 20px, 20px 20px'
                  : '40px 40px'
              }}
            >

              {/* Minimapa / HUD Renderizado por Fora, mas Grid aplicada aqui para senso de direção */}

              <div className="absolute inset-0 pointer-events-none z-[5]">
                {notes.map((note) => (
                  <BlackboardStickyNote
                    key={note.id}
                    note={note}
                    onDelete={() => deleteNote(note.id)}
                    onContentChange={(c: string) => updateNoteContent(note.id, c)}
                    onColorCycle={() => cycleNoteColor(note.id)}
                    onPositionChange={(x: number, y: number) => updateNotePosition(note.id, x, y)}
                    onSave={() => localStorage.setItem('ploc_blackboard_notes', JSON.stringify(notes))}
                  />
                ))}
              </div>

              <div
                id="ploc-anchor"
                className="absolute left-1/2 top-1/2 w-0 h-0 z-20"
              >
                <motion.div
                  className="absolute left-0 top-0 pointer-events-none flex items-center justify-center"
                  initial={{ x: "-50%", y: "-50%", scale: 1.0 }}
                  animate={{
                    x: plocReaction === 'dizzy' ? ["-50%", "-52%", "-48%", "-52%", "-48%", "-50%"] : "-50%",
                    y: "-50%",
                    // Escalonamento Fixo: O elemento cancela o zoom do mapa perfeitamente,
                    // garantindo que fique sempre no tamanho base (100px).
                    scale: (plocReaction === 'happy' ? 1.1 : 1.0) * (1 / scale),
                  }}
                  transition={{
                    scale: { type: 'spring', stiffness: 300, damping: 20 },
                    x: { duration: 0.4 }
                  }}
                >
                  {/* A BOLHA DO PLOC (SONAR DE 500px) */}
                  <motion.div
                    animate={!activeVice?.isConsuming ? {
                      scaleX: [1, 1.03, 0.97, 1],
                      scaleY: [1, 0.97, 1.03, 1],
                      borderRadius: [
                        "50% 50% 48% 48% / 48% 48% 52% 52%",
                        "46% 54% 44% 56% / 53% 47% 53% 47%",
                        "54% 46% 56% 44% / 47% 53% 47% 53%",
                        "50% 50% 48% 48% / 48% 48% 52% 52%"
                      ]
                    } : { borderRadius: '50%' }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute w-[500px] h-[500px] border border-sky-400/20 bg-sky-400/5 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
                    style={{
                      boxShadow: 'inset 0 0 40px rgba(56, 189, 248, 0.1), 0 0 20px rgba(56, 189, 248, 0.05)'
                    }}
                  >
                    {/* EFEITO SONAR NORMAL */}
                    {!activeVice?.isConsuming && (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                          className="w-full h-full rounded-full border border-sky-400/30"
                        />
                        <motion.div
                          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.1, 0.3, 0.1] }}
                          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                          className="absolute w-3/4 h-3/4 rounded-full border border-sky-400/20"
                        />
                      </>
                    )}
                  </motion.div>

                  {/* PLOC AVATAR */}
                  <div className="pointer-events-auto z-10">
                    <PlocAvatarClient
                      draggable={false}
                      emotion={activeVice?.isConsuming ? 'dizzy' : (plocState.emotion === 'calm' ? (plocReaction === 'idle' ? 'calm' : plocReaction as 'calm' | 'happy' | 'stressed' | 'pissed' | 'sleeping' | 'dizzy') : plocState.emotion as 'calm' | 'happy' | 'stressed' | 'pissed' | 'sleeping' | 'dizzy')}
                    />
                  </div>

                  {/* FUMAÇA E UI DO CONSUMO ATIVO */}
                  <AnimatePresence>
                    {activeVice?.isConsuming && (
                      <motion.div
                        className="absolute inset-0 z-20 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
                      >
                        {/* FUMAÇA (z-index maior que o Ploc) */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={`smoke-${i}`}
                              className="absolute w-[300px] h-[300px] bg-slate-800/60 rounded-full mix-blend-overlay"
                              style={{ filter: 'blur(25px)' }}
                              animate={{
                                scale: [1, 1.3, 1],
                                x: [0, (i % 2 === 0 ? 30 : -30), 0],
                                y: [0, (i % 3 === 0 ? -30 : 30), 0],
                                opacity: [0.3, 0.8, 0.3],
                                rotate: [0, 90, 0]
                              }}
                              transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
                            />
                          ))}
                        </div>

                        {/* UI DO CONSUMO ATIVO (BOTÃO PARAR E TIMER) */}
                        <div className="absolute -top-[160px] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto z-[400] scale-90">
                          <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-md px-4 py-1.5 rounded-2xl mb-2 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)] min-w-[140px]">
                            <span className="text-[0.5rem] font-bold text-red-400 uppercase tracking-[0.15em] mb-0.5 text-center ml-[0.15em]">Tempo real de uso</span>
                            <span className={`font-mono font-black text-lg leading-none text-center ${activeSecondsRemaining < 0 ? 'text-red-500' : 'text-white'}`}>
                              {formatConsumingTime(activeSecondsRemaining)}
                            </span>
                          </div>
                          <button
                            onClick={() => endConsumption(consumptionElapsed)}
                            className="bg-red-500 hover:bg-red-600 text-white font-black px-5 py-2.5 rounded-xl text-[0.6rem] tracking-widest transition-colors shadow-lg whitespace-nowrap"
                          >
                            FINALIZAR
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                {/* Radar Temporal (Sonar) Removido */}

                {/* Balão de Fala do Ploc (Centralizado e Dinâmico) */}
                <AnimatePresence>
                  {plocMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.8, x: '-50%' }}
                      animate={{ opacity: 1, y: -110, scale: 1, x: '-50%' }}
                      exit={{ opacity: 0, scale: 0.8, x: '-50%' }}
                      className="absolute left-0 w-max max-w-[280px] bg-slate-900/90 backdrop-blur-xl px-5 py-3 rounded-3xl text-white text-[0.85rem] font-extrabold text-center shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-sky-400/30 z-[300] pointer-events-none"
                    >
                      {plocMessage}
                      {/* Triângulo do Balão (Seta) */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-slate-900/90" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bolha de Pensamento do Libertesse (Controle de Vícios) */}
                <ViceBubble canvasScale={scale} />


              </div>

              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 150 }}>
                <AnimatePresence mode="popLayout">
                  {bubbles
                    .filter(b => (b.minutesRemaining || 0) <= windowMinutes * 2)
                    .map((bubble) => {
                      const metadata = bubble.metadata as { direction?: string, totalMinutes?: number } | undefined;
                      const isOutward = metadata?.direction === 'outward';
                      const isGoalReached = isOutward && (bubble.minutesRemaining || 0) <= 0.08;

                      let visualDist = 0;
                      const totalMins = metadata?.totalMinutes || 10;
                      const maxDist = typeof window !== 'undefined' ? Math.min(window.innerWidth, window.innerHeight) / 2 - 80 : 500;
                      if (isOutward) {
                        const progress = Math.min(1, 1 - ((bubble.minutesRemaining || 0) / totalMins));
                        visualDist = progress * maxDist;
                      } else {
                        visualDist = Math.max(120, Math.min(maxDist, ((bubble.minutesRemaining || 0) / windowMinutes) * maxDist));
                      }

                      const visualX = 1000 + Math.cos(bubble.angle || 0) * visualDist;
                      const visualY = 1000 + Math.sin(bubble.angle || 0) * visualDist;
                      const isSelected = selectedBubble?.id === bubble.id;

                      return (
                        <div key={bubble.id} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
                          <BlackboardBubbleItem
                            bubble={{ ...bubble, x: visualX, y: visualY }}
                            windowMinutes={isOutward ? totalMins : windowMinutes}
                            canvasScale={scale}
                            onExplode={() => {
                              setShowAttributes(false);
                              setShowFocusInfo(false);
                              setShowTutorial(false);
                              setSelectedBubble(bubble);
                              setInteractionNote('');
                            }}
                          />

                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8, x: visualX - 120, y: visualY - 260 }}
                                animate={{ opacity: 1, scale: 1, x: visualX - 120, y: visualY - 280 }}
                                exit={{ opacity: 0, scale: 0.8, x: visualX - 120, y: visualY - 260 }}
                                style={{
                                  position: 'absolute',
                                  width: '240px',
                                  background: 'rgba(15, 23, 42, 0.95)',
                                  backdropFilter: 'blur(16px)',
                                  border: `1px solid ${isGoalReached ? 'rgba(16, 185, 129, 0.4)' : (isOutward ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.4)')}`,
                                  borderRadius: '16px',
                                  padding: '16px',
                                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                  zIndex: 200,
                                  pointerEvents: 'all'
                                }}
                              >
                                <div style={{
                                  position: 'absolute',
                                  bottom: '-8px',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  width: '0',
                                  height: '0',
                                  borderLeft: '10px solid transparent',
                                  borderRight: '10px solid transparent',
                                  borderTop: `10px solid ${isGoalReached ? 'rgba(16, 185, 129, 0.95)' : (isOutward ? 'rgba(239, 68, 68, 0.95)' : 'rgba(15, 23, 42, 0.95)')}`,
                                }} />
                                <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>
                                  {bubble.content}
                                </div>

                                <div className={`p-2 rounded-lg text-xs mb-3 ${isGoalReached ? 'bg-emerald-500/15 text-emerald-500' : (isOutward ? 'bg-red-500/10 text-red-300' : 'bg-green-500/10 text-green-300')
                                  }`}>
                                  {isGoalReached ? (
                                    <>🏆 <b>META ALCANÇADA!</b><br />Parabéns por resistir. Clique em <b>Concluir</b> para resetar o ciclo e ganhar <b>+15 Moedas</b>.</>
                                  ) : isOutward ? (
                                    <>⚠️ Desistir agora: <b>-10 Moedas</b><br />Vencer: <b>+20 Moedas</b></>
                                  ) : (
                                    <>✨ Bônus de Foco: <b>+5 Moedas</b></>
                                  )}
                                </div>

                                <textarea
                                  value={interactionNote}
                                  onChange={(e) => setInteractionNote(e.target.value)}
                                  placeholder="Notas da atividade..."
                                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-[0.8rem] min-h-[60px] mb-3 resize-none outline-none"
                                />

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setSelectedBubble(null)}
                                    className="flex-1 p-2 bg-transparent border border-white/10 text-white/60 rounded-lg text-xs cursor-pointer"
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    onClick={() => {
                                      bubbleEngine.explodeBubble(bubble.id, interactionNote);
                                      setSelectedBubble(null);
                                      setInteractionNote('');
                                    }}
                                    className={`flex-1 p-2 border-none text-white rounded-lg text-xs font-bold cursor-pointer ${isGoalReached ? 'bg-emerald-500' : (isOutward ? 'bg-red-500' : 'bg-sky-400')
                                      }`}
                                  >
                                    {isGoalReached ? 'Resetar Ciclo' : (isOutward ? 'Ceder' : 'Concluir')}
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                </AnimatePresence>

                <AnimatePresence>
                  {activeWaves.map(wave => (
                    <motion.div
                      key={wave.id}
                      initial={{ width: 0, height: 0, opacity: 1, x: '-50%', y: '-50%' }}
                      animate={{
                        width: 1500,
                        height: 1500,
                        opacity: 0,
                        borderWidth: [4, 20, 0]
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: "circOut" }}
                      className="absolute rounded-full pointer-events-none z-[200]"
                      style={{
                        left: `${wave.x}px`,
                        top: `${wave.y}px`,
                        border: `4px solid ${wave.color}`,
                        boxShadow: `0 0 50px ${wave.color}`
                      }}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Interface / HUD (Fixo) */}
      </div>
      <motion.div
        className="fixed bottom-[120px] right-[40px] flex flex-col gap-3 z-[100]"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={addNote}
          className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center justify-center text-white cursor-pointer"
        >
          <Plus size={32} strokeWidth={1.5} />
        </motion.button>
      </motion.div>

      <div className="fixed top-[90px] left-[30px] z-[100001]">
        {/* PlocCoins Wallet - MOEDAS DE FOCO */}
        <motion.div
          key={score}
          onClick={() => {
            setShowAttributes(false);
            setShowTutorial(false);
            setSelectedBubble(null);
            setShowFocusInfo(true);
          }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#0f0f0f]/90 backdrop-blur-md px-3.5 py-1.5 rounded-[20px] border border-amber-400/40 flex items-center gap-2.5 cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.5)] pointer-events-auto"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-xs font-black text-black shadow-[0_0_10px_rgba(251,191,36,0.3)]">$</div>
          <span className="text-[1.1rem] font-bold text-amber-400 font-mono tracking-[1px]">
            {score.toLocaleString('pt-BR')}
          </span>
        </motion.div>
      </div>

      {/* Modal Explicativo das Moedas de Foco */}
      <AnimatePresence>
        {showFocusInfo && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200000] flex items-center justify-center p-5" onClick={() => setShowFocusInfo(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1c1a] border border-amber-400/30 p-[30px] rounded-[24px] max-w-[400px] text-center shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            >
              <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 mx-auto mb-5 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(251,191,36,0.4)]">🪙</div>
              <h2 style={{ color: '#fbbf24', marginBottom: '15px', fontWeight: 900 }}>MOEDAS DE FOCO</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '20px' }}>
                Estas moedas representam a sua **Energia de Produtividade**. Elas são o combustível para o crescimento do Ploc!
              </p>
              <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px' }}>Como ganhar?</h4>
                <ul style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', paddingLeft: '15px' }}>
                  <li style={{ marginBottom: '8px' }}>Estoure bolhas de tarefas clicando nelas.</li>
                  <li style={{ marginBottom: '8px' }}>Mantenha o Radar limpo e seguro.</li>
                  <li>Evite que as bolhas colidam com o Ploc!</li>
                </ul>
              </div>
              <button
                onClick={() => setShowFocusInfo(false)}
                style={{
                  marginTop: '25px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#fbbf24',
                  color: '#000',
                  border: 'none',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                ENTENDI!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed top-[90px] right-[30px] flex flex-col items-end gap-3 z-[100001] pointer-events-none">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              userClosedMinimap.current = showMinimap; // Registra se o usuário fechou manualmente
              setShowMinimap(!showMinimap);
            }}
            className={`w-11 h-11 rounded-[50px] backdrop-blur-xl flex items-center justify-center cursor-pointer pointer-events-auto ${showMinimap ? 'bg-sky-400/20 border border-sky-400/40 text-sky-400' : 'bg-white/5 border border-white/10 text-white'
              }`}
          >
            <Map size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setShowGrid(!showGrid)}
            className={`w-11 h-11 rounded-[50px] backdrop-blur-xl flex items-center justify-center cursor-pointer pointer-events-auto ${showGrid ? 'bg-sky-400/20 border border-sky-400/40 text-sky-400' : 'bg-white/5 border border-white/10 text-white'
              }`}
          >
            <Grid3X3 size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              const newState = !showAttributes;
              if (newState) {
                setShowFocusInfo(false);
                setShowTutorial(false);
                setSelectedBubble(null);
              }
              setShowAttributes(newState);
            }}
            className={`attribute-bubble w-11 h-11 rounded-[50px] backdrop-blur-xl flex items-center justify-center cursor-pointer pointer-events-auto ${showAttributes ? 'bg-yellow-400/20 border border-yellow-400/40 text-yellow-400' : 'bg-white/5 border border-white/10 text-white'
              }`}
          >
            <ActivityIcon size={18} />
          </motion.button>

        </div>

        {/* Modal/Dropdown do Minimapa */}
        <AnimatePresence>
          {showMinimap && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="flex flex-col gap-2"
            >
              {/* Controles de Câmera */}
              <div className="flex items-center justify-between w-[100px] bg-black/40 border border-white/10 backdrop-blur-md rounded-xl p-1 pointer-events-auto shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                <button onClick={zoomOut} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                  <ZoomOut size={16} />
                </button>
                <button onClick={recenterMap} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-sky-400 transition-colors" title="Centralizar no Ploc">
                  <Target size={16} />
                </button>
                <button onClick={zoomIn} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                  <ZoomIn size={16} />
                </button>
              </div>

              {/* Minimapa */}
              <div className="w-[100px] h-[100px] rounded-xl bg-black/60 border border-white/10 backdrop-blur-md overflow-hidden pointer-events-none shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative flex items-center justify-center">
                {/* Grade Interna do Minimapa */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `radial-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px)`,
                  backgroundSize: '10px 10px'
                }}></div>

                {/* Indicador de Viewport (Câmera) com tamanho responsivo ao zoom */}
                <motion.div
                  className="absolute top-1/2 left-1/2 rounded-full border border-sky-400/80 bg-sky-400/20 shadow-[0_0_8px_rgba(56,189,248,0.5)] transform -translate-x-1/2 -translate-y-1/2 origin-center"
                  style={{ x: miniDotX, y: miniDotY, width: miniViewportSize, height: miniViewportSize }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>



      {/* ── Menu de Navegação Global (Dock) ────────────────── */}
      <DockMenu />


      <AnimatePresence>
        {showAttributes && (
          <motion.div
            key="attr-monitor-wrapper"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 w-full z-[100005] pointer-events-none" // Permite clicar no oceano através do wrapper
          >
            <div className="pointer-events-auto">
              <AttributeMonitor onClose={() => setShowAttributes(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showTutorial && (
          <TutorialOcean onComplete={() => {
            setShowTutorial(false);
            localStorage.setItem('ploc_tutorial_seen', 'true');
          }} />
        )}
      </AnimatePresence>
    </div>
  );
}

