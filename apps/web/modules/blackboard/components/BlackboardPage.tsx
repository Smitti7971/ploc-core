'use client';

/**
 * BlackboardPage.tsx — O novo espaço de trabalho imersivo do Ploc.
 * Design: Quadro negro (chalkboard) com notas adesivas e o Ploc flutuando.
 */

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useAuthStore } from '@/store/authStore';
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
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DockMenu } from '@/components/layout/DockMenu';
import { UserHeader } from '@/components/layout/UserHeader';
import { AttributeMonitor } from './AttributeMonitor';
import { bubbleEngine } from '../engine/bubble-engine/BubbleEngine';
import { BlackboardBubble } from '../types/bubbles';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '../events/eventBus';
import { routineEngine } from '../engine/routine-engine/RoutineEngine';
import { TutorialOcean } from './TutorialOcean';
import { attributeEngine } from '../engine/attribute-engine/AttributeEngine';
import { plocEngine } from '../engine/ploc-engine/PlocEngine';

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

export type SonarTheme = 'radio_wave' | 'submarine' | 'holographic' | 'clockwork';

export default function BlackboardPage() {
  const { user, logout } = useAuthStore();
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [capsuleOpen, setCapsuleOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showAttributes, setShowAttributes] = useState(false);
  const [scale, setScale] = useState(1);
  const [bubbles, setBubbles] = useState<BlackboardBubble[]>([]);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const [viewMode, setViewMode] = useState<'free' | '1h' | 'day' | 'week' | 'month'>('day');
  const [isCentered, setIsCentered] = useState(true);
  const [lastCompleted, setLastCompleted] = useState<string | null>(null);
  const [plocReaction, setPlocReaction] = useState<'idle' | 'happy' | 'stressed' | 'dizzy'>('idle');
  const [score, setScore] = useState(attributeEngine.getScore());
  const [showFocusInfo, setShowFocusInfo] = useState(false);
  const [selectedBubble, setSelectedBubble] = useState<BlackboardBubble | null>(null);
  const [interactionNote, setInteractionNote] = useState('');
  const [sonarTheme, setSonarTheme] = useState<SonarTheme>('clockwork');

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

  useEffect(() => {
    const unsub = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, (change: any) => {
      if (change.pillar === 'foco') {
        setScore(change.value);
      }
    });
    // Reações do Ploc a eventos das bolhas
    const unsubTimeout = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_TIMEOUT, (bubble: any) => {
      setPlocReaction('dizzy');
      if (bubble && typeof bubble.x === 'number') {
        addWave(bubble.x, bubble.y, '#ef4444'); // Vermelho para perda
      }
      setTimeout(() => setPlocReaction('idle'), 2000);
    });

    const unsubExplosion = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, (bubble: any) => {
      setPlocReaction('happy');
      if (bubble && typeof bubble.x === 'number') {
        addWave(bubble.x, bubble.y, '#00ff88'); // Verde Neon Ultra
      }
      setTimeout(() => setPlocReaction('idle'), 1500);
    });

    return () => {
      unsub();
      unsubTimeout();
      unsubExplosion();
    };
  }, [score]);

  const [showTutorial, setShowTutorial] = useState(false);
  const [plocState, setPlocState] = useState(plocEngine.getState());
  const [plocMessage, setPlocMessage] = useState<string | null>(null);
  const [scrollPos, setScrollPos] = useState({ x: 1000, y: 1000 });
  const [viewportSize, setViewportSize] = useState({ w: 1920, h: 1080 });
  const [activeWaves, setActiveWaves] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  const addWave = (x: number, y: number, color: string) => {
    const id = Date.now() + Math.random();
    setActiveWaves(prev => [...prev, { id, x, y, color }]);
    setTimeout(() => {
      setActiveWaves(prev => prev.filter(w => w.id !== id));
    }, 2000);
  };

  const centerOnOrigin = useCallback((behavior: any = 'smooth') => {
    const canvas = document.getElementById('blackboard-canvas');
    if (canvas) {
      const scrollX = 1000 - canvas.clientWidth / 2;
      const scrollY = 1000 - canvas.clientHeight / 2;
      
      // Garante que behavior seja uma string válida para o scrollTo
      const scrollBehavior = typeof behavior === 'string' ? behavior : 'smooth';
      canvas.scrollTo({ left: scrollX, top: scrollY, behavior: scrollBehavior as ScrollBehavior });
    }
  }, []);

  const centerOnPosition = useCallback((x: number, y: number, behavior: any = 'smooth') => {
    const canvas = document.getElementById('blackboard-canvas');
    if (canvas) {
      // Cálculo considerando que transform-origin está em center center (1000, 1000)
      const visualX = 1000 + (x - 1000) * scale;
      const visualY = 1000 + (y - 1000) * scale;
      const scrollX = visualX - canvas.clientWidth / 2;
      const scrollY = visualY - canvas.clientHeight / 2;
      
      const scrollBehavior = typeof behavior === 'string' ? behavior : 'smooth';
      canvas.scrollTo({ left: scrollX, top: scrollY, behavior: scrollBehavior as ScrollBehavior });
    }
  }, [scale]);

  useEffect(() => {
    centerOnOrigin('instant');
  }, []);

  // Efeito para centralizar e focar quando uma bolha é selecionada
  useEffect(() => {
    if (selectedBubble) {
      const isOutward = (selectedBubble as any).metadata?.direction === 'outward';
      const totalMins = (selectedBubble as any).metadata?.totalMinutes || 10;
      
      let visualDist = 0;
      if (isOutward) {
        const progress = 1 - ((selectedBubble.minutesRemaining || 0) / totalMins);
        visualDist = progress * 500;
      } else {
        visualDist = Math.max(120, ((selectedBubble.minutesRemaining || 0) / windowMinutes) * 500);
      }

      const visualX = 1000 + Math.cos(selectedBubble.angle || 0) * visualDist;
      const visualY = 1000 + Math.sin(selectedBubble.angle || 0) * visualDist;
      
      centerOnPosition(visualX, visualY);
    }
  }, [selectedBubble, centerOnPosition, windowMinutes]);

  // Efeito reativo para mudanças de visão
  useEffect(() => {
    centerOnOrigin('smooth');
  }, [viewMode]);

  // Monitor Scroll to show/hide Center button
  useEffect(() => {
    const canvas = document.getElementById('blackboard-canvas');
    if (!canvas) return;

    const handleScroll = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // O centro ideal é sempre 4000 (centro do canvas 8000x8000)
      const targetScrollX = 1000 - (w / 2);
      const targetScrollY = 1000 - (h / 2);

      const threshold = 150; // px de margem de erro
      const isNear = Math.abs(canvas.scrollLeft - targetScrollX) < threshold && 
                     Math.abs(canvas.scrollTop - targetScrollY) < threshold;
      
      setIsCentered(prev => {
        if (prev !== isNear) return isNear;
        return prev;
      });
    };

    canvas.addEventListener('scroll', handleScroll);
    return () => canvas.removeEventListener('scroll', handleScroll);
  }, []);

  // Load notes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ploc_blackboard_notes');
      if (saved) setNotes(JSON.parse(saved));
    } catch {
      setNotes([]);
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

  // --- State e Refs ---
  const scaleRef = useRef(scale);
  const lastZoomTime = useRef(0);
  
  useEffect(() => { 
    scaleRef.current = scale; 
  }, [scale]);

  const zoomDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Zoom Logic (Mouse-Anchored Zoom - Performance Ultra)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const canvas = document.getElementById('blackboard-canvas');
      const bg = canvas?.querySelector('.canvas-background') as HTMLElement;
      if (!canvas || !bg) return;

      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      const oldScale = scaleRef.current;
      // Escala entre 0.15 (15%) e 3 (300%) para evitar instabilidade no browser
      const newScale = Math.min(Math.max(oldScale + delta, 0.15), 3);
      
      if (oldScale === newScale) return;
      
      scaleRef.current = newScale;

      // ATUALIZAÇÃO VISUAL IMEDIATA (Pula o React para suavidade)
      // Usamos center center para manter o Ploc (4000, 4000) estável
      bg.style.transformOrigin = 'center center';
      bg.style.transform = `scale(${newScale})`;

      // Sincroniza o React de forma debounced
      if (zoomDebounceRef.current) clearTimeout(zoomDebounceRef.current);
      zoomDebounceRef.current = setTimeout(() => {
        setScale(newScale);
      }, 100);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (zoomDebounceRef.current) clearTimeout(zoomDebounceRef.current);
    };
  }, []);

  // Bubble Engine Subscription & Event Listeners
  useEffect(() => {
    const unsubscribe = bubbleEngine.subscribe(setBubbles);
    
    const onExplode = (bubble: any) => {
      setLastCompleted(bubble.content);
      setPlocReaction('happy');
      addWave(bubble.x, bubble.y, 'rgba(34, 197, 94, 0.6)'); // Onda Verde (Sucesso)
      setTimeout(() => {
        setLastCompleted(null);
        setPlocReaction('idle');
      }, 3000);
    };

    const onTimeout = (bubble: any) => {
      setPlocReaction('dizzy');
      addWave(4000, 4000, 'rgba(239, 68, 68, 0.6)'); // Onda Vermelha (Colisão no Centro)
      setTimeout(() => {
        setPlocReaction('idle');
      }, 3000);
    };

    blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, onExplode);
    blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_TIMEOUT, onTimeout);
    
    const unsubPloc = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, setPlocState);
    const unsubReaction = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.PLOC_REACTION, (reaction: any) => {
      setPlocReaction(reaction.type.toLowerCase() as any);
      if (reaction.message) {
        setPlocMessage(reaction.message);
        setTimeout(() => setPlocMessage(null), 4000);
      }
      setTimeout(() => setPlocReaction('idle'), 4000);
    });

    // Verificar se é o primeiro acesso para o tutorial
    const hasSeenTutorial = localStorage.getItem('ploc_tutorial_seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
    
    return () => {
      unsubscribe();
      unsubPloc();
      unsubReaction();
    };
  }, []);

  // Auto-center on mount
  useEffect(() => {
    centerOnOrigin('auto');
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
      // Zoom out automático para dar impressão de "abrir a visão"
      setScale(0.5);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullScreen(false);
      // Volta ao zoom padrão
      setScale(1.0);
    }
  };

  // Panning Handlers
  const handlePanStart = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id === 'blackboard-canvas' || target.classList.contains('canvas-background')) {
      const canvas = document.getElementById('blackboard-canvas');
      if (canvas) {
        setIsPanning(true);
        setPanStart({
          x: e.clientX,
          y: e.clientY,
          scrollLeft: canvas.scrollLeft,
          scrollTop: canvas.scrollTop
        });
      }
    }
  };

  const handlePanMove = useCallback((e: MouseEvent) => {
    if (!isPanning) return;
    
    const canvas = document.getElementById('blackboard-canvas');
    if (canvas) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      const newLeft = panStart.scrollLeft - dx;
      const newTop = panStart.scrollTop - dy;
      
      canvas.scrollLeft = newLeft;
      canvas.scrollTop = newTop;
      
      // Sincronizar estado para os marcadores (Imediato para evitar lag visual)
      setScrollPos({ x: newLeft, y: newTop });
    }
  }, [isPanning, panStart]);

  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  useEffect(() => {
    if (isPanning) {
      window.addEventListener('mousemove', handlePanMove);
      window.addEventListener('mouseup', handlePanEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handlePanMove);
      window.removeEventListener('mouseup', handlePanEnd);
    };
  }, [isPanning, handlePanMove, handlePanEnd]);

  useEffect(() => {
    const canvas = document.getElementById('blackboard-canvas');
    if (!canvas) return;

    const updateScroll = () => {
      setScrollPos({ x: canvas.scrollLeft, y: canvas.scrollTop });
      setViewportSize({ w: canvas.clientWidth, h: canvas.clientHeight });
    };

    canvas.addEventListener('scroll', updateScroll);
    window.addEventListener('resize', updateScroll);
    updateScroll();

    return () => {
      canvas.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
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
    bubbleEngine.spawnBubble(pick.type as any, pick.content, 10, { rewardAttribute: pick.attr });
  };

  return (
    <div 
      className="blackboard-page" 
      ref={containerRef}
      style={{ 
        width: '100vw', 
        height: '100vh', 
        background: '#0a0c0a', 
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'Inter', sans-serif",
        touchAction: 'none'
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("https://www.transparenttextures.com/patterns/black-linen.png")`,
        opacity: 0.2,
        pointerEvents: 'none',
        zIndex: 1
      }} />
      
      {/* Seletor de Tema do Radar (Floating) */}
      <div style={{
        position: 'fixed',
        top: '100px',
        left: '20px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        padding: '8px',
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {(['radio_wave', 'submarine', 'holographic', 'clockwork'] as SonarTheme[]).map((t) => (
          <button
            key={t}
            onClick={() => setSonarTheme(t)}
            style={{
              padding: '4px 10px',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              borderRadius: '6px',
              background: sonarTheme === t ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              color: sonarTheme === t ? '#38bdf8' : '#666',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div 
        id="blackboard-canvas"
        onMouseDown={handlePanStart}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          position: 'relative',
          padding: 0, 
          margin: 0,
          cursor: isPanning ? 'grabbing' : 'grab',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          background: '#0a0c0a'
        }}
      >
        <div style={{ 
          width: '2000px', 
          height: '2000px', 
          position: 'relative',
          flexShrink: 0
        }}>
          <div 
            className="canvas-background"
            style={{ 
              width: '2000px', 
              height: '2000px', 
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `scale(${scale})`,
              transformOrigin: 'center center', // Zoom perfeito pelo centro
              willChange: 'transform',
              background: '#0a0c0a',
              overflow: 'hidden'
            }}
          >

          <AnimatePresence>
            {showGrid && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `
                    linear-gradient(rgba(56, 189, 248, 0.05) 2px, transparent 2px),
                    linear-gradient(90deg, rgba(56, 189, 248, 0.05) 2px, transparent 2px),
                    linear-gradient(rgba(56, 189, 248, 0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(56, 189, 248, 0.02) 1px, transparent 1px)
                  `,
                  backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
                  pointerEvents: 'none',
                  zIndex: 0
                }}
              />
            )}
          </AnimatePresence>

          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
            {notes.map((note) => (
              <StickyNoteEl
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
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '0px',
              height: '0px',
              zIndex: 20
            }}
          >
            <motion.div 
              style={{ 
                position: 'absolute', 
                left: 0,
                top: 0,
                pointerEvents: 'all', 
              }}
              initial={{ x: "-50%", y: "-50%", scale: 0.7 }}
              animate={{
                x: plocReaction === 'dizzy' ? ["-50%", "-52%", "-48%", "-52%", "-48%", "-50%"] : "-50%",
                y: "-50%",
                // Escalonamento Óptico Inteligente: O elemento não encolhe além do tamanho real
                // mas pode crescer se o usuário der um zoom muito próximo para ver detalhes.
                scale: (plocReaction === 'happy' ? 0.8 : 0.7) * Math.max(1, 1 / scale),
              }}
              transition={{ 
                scale: { type: 'spring', stiffness: 300, damping: 20 },
                x: { duration: 0.4 }
              }}
            >
              <PlocAvatarClient 
                draggable={false} 
                emotion={plocState.emotion === 'calm' ? (plocReaction === 'idle' ? 'calm' : plocReaction as any) : plocState.emotion as any}
              />
            </motion.div>
            {/* Radar Temporal (Sonar) */}
            <SonarAuras 
              centerX={0} 
              centerY={0} 
              theme={sonarTheme}
            />
            
            {/* Balão de Fala do Ploc (Centralizado e Dinâmico) */}
            <AnimatePresence>
              {plocMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8, x: '-50%' }}
                  animate={{ opacity: 1, y: -110, scale: 1, x: '-50%' }}
                  exit={{ opacity: 0, scale: 0.8, x: '-50%' }}
                  style={{
                    position: 'absolute',
                    left: '0px',
                    width: 'max-content',
                    maxWidth: '280px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(20px)',
                    padding: '12px 20px',
                    borderRadius: '24px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    textAlign: 'center',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    zIndex: 300,
                    pointerEvents: 'none'
                  }}
                >
                  {plocMessage}
                  {/* Triângulo do Balão (Seta) */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '10px solid transparent',
                    borderRight: '10px solid transparent',
                    borderTop: '10px solid rgba(15, 23, 42, 0.9)'
                  }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 150 }}>
            <AnimatePresence mode="popLayout">
              {bubbles
                .filter(b => (b.minutesRemaining || 0) <= windowMinutes * 2)
                .map((bubble) => {
                const isOutward = (bubble as any).metadata?.direction === 'outward';
                const isGoalReached = isOutward && (bubble.minutesRemaining || 0) <= 0.08;
                
                let visualDist = 0;
                const totalMins = (bubble.metadata as any)?.totalMinutes || 10;
                if (isOutward) {
                  const progress = Math.min(1, 1 - ((bubble.minutesRemaining || 0) / totalMins));
                  visualDist = progress * 500;
                } else {
                  visualDist = Math.max(120, ((bubble.minutesRemaining || 0) / windowMinutes) * 500);
                }

                const visualX = 1000 + Math.cos(bubble.angle || 0) * visualDist;
                const visualY = 1000 + Math.sin(bubble.angle || 0) * visualDist;
                const isSelected = selectedBubble?.id === bubble.id;

                return (
                  <div key={bubble.id} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
                    <BubbleItem 
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
                          
                          <div style={{ 
                            background: isGoalReached ? 'rgba(16, 185, 129, 0.15)' : (isOutward ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)'),
                            padding: '8px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            color: isGoalReached ? '#10b981' : (isOutward ? '#fca5a5' : '#86efac'),
                            marginBottom: '12px'
                          }}>
                            {isGoalReached ? (
                              <>🏆 <b>META ALCANÇADA!</b><br/>Parabéns por resistir. Clique em <b>Concluir</b> para resetar o ciclo e ganhar <b>+15 Moedas</b>.</>
                            ) : isOutward ? (
                              <>⚠️ Desistir agora: <b>-10 Moedas</b><br/>Vencer: <b>+20 Moedas</b></>
                            ) : (
                              <>✨ Bônus de Foco: <b>+5 Moedas</b></>
                            )}
                          </div>

                          <textarea 
                            value={interactionNote}
                            onChange={(e) => setInteractionNote(e.target.value)}
                            placeholder="Notas da atividade..."
                            style={{
                              width: '100%',
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              padding: '8px',
                              color: '#fff',
                              fontSize: '0.8rem',
                              minHeight: '60px',
                              marginBottom: '12px',
                              resize: 'none',
                              outline: 'none'
                            }}
                          />

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={() => setSelectedBubble(null)}
                              style={{
                                flex: 1,
                                padding: '8px',
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.6)',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                              }}
                            >
                              Cancelar
                            </button>
                            <button 
                              onClick={() => {
                                bubbleEngine.explodeBubble(bubble.id, interactionNote);
                                setSelectedBubble(null);
                                setInteractionNote('');
                              }}
                              style={{
                                flex: 1,
                                padding: '8px',
                                background: isGoalReached ? '#10b981' : (isOutward ? '#ef4444' : '#38bdf8'),
                                border: 'none',
                                color: '#fff',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                              }}
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
                  style={{
                    position: 'absolute',
                    left: `${wave.x}px`,
                    top: `${wave.y}px`,
                    borderRadius: '50%',
                    border: `4px solid ${wave.color}`,
                    boxShadow: `0 0 50px ${wave.color}`,
                    pointerEvents: 'none',
                    zIndex: 200
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
      <motion.div
        style={{
          position: 'fixed',
          bottom: '120px',
          right: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 100
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={spawnRandomAttributeBubble}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(56, 189, 248, 0.2)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Sparkles size={24} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setShowAttributes(false);
            setShowFocusInfo(false);
            setSelectedBubble(null);
            setShowTutorial(true);
          }}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <HelpCircle size={24} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={addNote}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <Plus size={32} strokeWidth={1.5} />
        </motion.button>
      </motion.div>

      <div style={{ 
        position: 'fixed', 
        top: '90px', 
        left: '30px',
        zIndex: 100001,
      }}>
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
          style={{
            background: 'rgba(15, 15, 15, 0.9)',
            backdropFilter: 'blur(10px)',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            pointerEvents: 'all'
          }}
        >
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #f59e0b, #fbbf24)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 900,
            color: '#000',
            boxShadow: '0 0 10px rgba(251, 191, 36, 0.3)'
          }}>$</div>
          <span style={{ 
            fontSize: '1.1rem', 
            fontWeight: 700, 
            color: '#fbbf24', 
            fontFamily: 'monospace',
            letterSpacing: '1px'
          }}>
            {score.toLocaleString('pt-BR')}
          </span>
        </motion.div>
      </div>

      {/* Modal Explicativo das Moedas de Foco */}
      <AnimatePresence>
        {showFocusInfo && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 200000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }} onClick={() => setShowFocusInfo(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#1a1c1a',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                padding: '30px',
                borderRadius: '24px',
                maxWidth: '400px',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #f59e0b, #fbbf24)',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                boxShadow: '0 0 30px rgba(251, 191, 36, 0.4)'
              }}>🪙</div>
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

      <div style={{ 
        position: 'fixed', 
        top: '30px', 
        right: '30px', 
        display: 'flex', 
        alignItems: 'center',
        gap: '12px', 
        zIndex: 100001,
        pointerEvents: 'none'
      }}>
        {/* Ciclo de Visão Temporal */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            const modes: ('1h' | 'day' | 'week')[] = ['1h', 'day', 'week'];
            const nextMode = modes[(modes.indexOf(viewMode as any) + 1) % modes.length];
            setViewMode(nextMode);
            
            // Escala ideal para ver o radar completo (1000px de diâmetro)
            // Agora 1.0 (100%) é o nosso alvo panorâmico
            let nextScale = 1;
            
            setScale(nextScale);
            // O centerPloc será disparado pelo useEffect [viewMode]
          }}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#38bdf8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            pointerEvents: 'all',
            fontSize: '9px',
            fontWeight: 'bold'
          }}
        >
          <Clock size={16} />
          <span style={{ marginTop: '-2px' }}>{viewMode.toUpperCase()}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowGrid(!showGrid)}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50px',
            background: showGrid ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: showGrid ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255,255,255,0.1)',
            color: showGrid ? '#38bdf8' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            pointerEvents: 'all'
          }}
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
          className="attribute-bubble"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50px',
            background: showAttributes ? 'rgba(250, 204, 21, 0.2)' : 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: showAttributes ? '1px solid rgba(250, 204, 21, 0.4)' : '1px solid rgba(255,255,255,0.1)',
            color: showAttributes ? '#facc15' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            pointerEvents: 'all'
          }}
        >
          <ActivityIcon size={18} />
        </motion.button>

        {/* Indicador de Zoom */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '50px',
          padding: '0 16px',
          height: '44px',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          fontSize: '0.75rem',
          fontWeight: 900,
          pointerEvents: 'all'
        }}>
          {Math.round(scale * 100)}%
        </div>

        <ViewportMarkers 
          bubbles={bubbles} 
          scrollPos={scrollPos} 
          scale={scale} 
          onFocusTask={(task: any) => {
            setShowAttributes(false);
            setShowFocusInfo(false);
            setShowTutorial(false);
            setSelectedBubble(task);
            // O useEffect de selectedBubble cuidará do scrollIntoView
          }}
        />

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={toggleFullScreen}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50px',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            pointerEvents: 'all'
          }}
        >
          {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </motion.button>

        {/* Cápsula do Usuário integrada no mesmo flex para empurrar os botões ao expandir */}
        <UserHeader />
      </div>

      {/* ── Botão Centralizar Contextual (Só aparece se estiver longe do Ploc) ── */}
      <AnimatePresence>
        {!isCentered && (
          <motion.button
            key="center-ploc-btn"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={centerOnOrigin}
            style={{
              position: 'fixed',
              top: '90px',
              right: '30px',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.2)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 100000,
              boxShadow: '0 8px 32px rgba(56, 189, 248, 0.1)'
            }}
          >
            <Target size={20} />
          </motion.button>
        )}
      </AnimatePresence>

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
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              zIndex: 9000,
              pointerEvents: 'none' // Permite clicar no oceano através do wrapper
            }}
          >
            <div style={{ pointerEvents: 'all' }}>
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

const StickyNoteEl = memo(({ note, onDelete, onContentChange, onColorCycle, onPositionChange, onSave }: any) => {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.note-btn')) return;
    setDragging(true);
    setOffset({ x: e.clientX - note.x, y: e.clientY - note.y });
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return;
    onPositionChange(e.clientX - offset.x, e.clientY - offset.y);
  }, [dragging, offset, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    if (dragging) { setDragging(false); onSave(); }
  }, [dragging, onSave]);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  const colorMap: Record<string, string> = {
    '': '#fef3c7', // Amarelo clássico
    'note-blue': '#dbeafe',
    'note-green': '#dcfce7',
    'note-pink': '#fce7f3',
    'note-purple': '#f3e8ff',
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, rotate: (note.id % 4) - 2 }}
      style={{
        position: 'absolute',
        left: `${note.x}px`,
        top: `${note.y}px`,
        pointerEvents: 'all',
        zIndex: dragging ? 1000 : 1,
        background: colorMap[note.colorClass] || '#fef3c7',
        borderRadius: '2px', // Mais quadrado como post-it
        padding: '12px',
        minWidth: '220px',
        boxShadow: dragging ? '0 20px 40px rgba(0,0,0,0.5)' : '2px 5px 15px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.2s ease',
        transform: `rotate(${(note.id % 4) - 2}deg)`
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        style={{ cursor: 'grab', display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '8px' }}
      >
        <button className="note-btn" onClick={onColorCycle} style={{ background: 'none', border: 'none', cursor: 'pointer', filter: 'grayscale(1)' }}>🎨</button>
        <button className="note-btn" onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>✕</button>
      </div>
      <textarea
        defaultValue={note.content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Escreva algo..."
        style={{
          width: '100%',
          minHeight: '120px',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: '#1a1c1a',
          fontSize: '1rem',
          lineHeight: '1.4',
          resize: 'both',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500
        }}
      />
      {/* ── Detalhe de "Fita Adesiva" ────────────────── */}
      <div style={{
        position: 'absolute',
        top: '-15px',
        left: '50%',
        transform: 'translateX(-50%) rotate(-1deg)',
        width: '60px',
        height: '25px',
        background: 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(2px)',
        zIndex: -1
      }} />
    </motion.div>
  );
});



/** Item de Bolha (Task/Insight) */
const BubbleItem = memo(({ bubble, onExplode, windowMinutes = 10, canvasScale = 1 }: { 
  bubble: BlackboardBubble, 
  onExplode: () => void, 
  windowMinutes?: number,
  canvasScale?: number
}) => {
  const Icon = bubble.type === 'bright_idea' ? Sparkles : (bubble.type === 'knowledge' ? Brain : ActivityIcon);
  const themeColor = BUBBLE_COLORS[bubble.type] || '#38bdf8';
  const isOutward = (bubble as any).metadata?.direction === 'outward';
  
  const opticalScale = Math.max(1, 1 / canvasScale);
  const isPerformanceMode = canvasScale < 0.6;

  const isGoalReached = isOutward && (bubble.minutesRemaining || 0) <= 0;
  const mainColor = isGoalReached ? '#10b981' : (isOutward ? '#ef4444' : themeColor);
  
  return (
    <motion.div
      id={`bubble-${bubble.id}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        y: [0, -12, 0],
        x: [0, 8, 0, -8, 0],
        scale: opticalScale,
        opacity: 1
      }}
      exit={{ 
        scale: opticalScale * 4, 
        opacity: 0,
        filter: 'brightness(2) blur(10px)',
        transition: { duration: 0.4, ease: "easeOut" } 
      }}
      transition={{ 
        y: { duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" },
        x: { duration: 5 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" },
        scale: { type: 'spring', stiffness: 300, damping: 20 },
        opacity: { duration: 0.3 }
      }}
      style={{
        position: 'absolute',
        left: `${bubble.x - bubble.size/2}px`,
        top: `${bubble.y - bubble.size/2}px`,
        width: `${bubble.size}px`,
        height: `${bubble.size}px`,
        transformOrigin: 'center center',
        borderRadius: '50%',
        backgroundColor: isOutward ? 'transparent' : `${mainColor}20`,
        backgroundImage: isOutward 
          ? `radial-gradient(circle, ${mainColor}40 0%, ${mainColor}10 100%)`
          : 'none',
        backdropFilter: 'blur(12px)',
        border: `2px solid ${mainColor}99`,
        boxShadow: `0 0 20px ${mainColor}44`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        cursor: 'pointer',
        pointerEvents: 'all',
        zIndex: 100,
        transform: `translateZ(0)`
      }}
      whileHover={{ 
        scale: 1.2 * opticalScale, 
        backgroundColor: isOutward ? 'transparent' : `${mainColor}40`,
        backgroundImage: isOutward 
          ? `radial-gradient(circle, ${mainColor}60 0%, ${mainColor}20 100%)`
          : 'none'
      }}
      onClick={onExplode}
    >
      {/* Reflexo Especular (Efeito de Bolha) */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '15%',
        width: '30%',
        height: '30%',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 80%)',
        borderRadius: '50%',
        filter: 'blur(1px)',
        zIndex: 3
      }} />

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '4px',
        position: 'relative', 
        zIndex: 2 
      }}>
        {isOutward ? (
          <div style={{ fontSize: bubble.size * 0.4 }}>🚭</div>
        ) : (
          <Icon size={bubble.size * 0.35} color={themeColor} />
        )}
        <span style={{ 
          fontSize: '10px', 
          fontWeight: '900', 
          fontFamily: 'monospace',
          color: isGoalReached ? '#dcfce7' : (isOutward ? '#fca5a5' : '#fff'),
          textShadow: `0 0 5px ${mainColor}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          lineHeight: 1
        }}>
          {isOutward && (
            <span style={{ fontSize: '7px', marginBottom: '2px' }}>
              {isGoalReached ? 'META ALCANÇADA' : 'RESISTIR'}
            </span>
          )}
          {(() => {
            const absMins = Math.abs(bubble.minutesRemaining || 0);
            const totalSecs = Math.floor(absMins * 60);
            const m = Math.floor(totalSecs / 60);
            const s = totalSecs % 60;
            return `${isGoalReached ? '+' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
          })()}
        </span>
      </div>

      {bubble.energy > 0 && (
        <svg 
          viewBox={`0 0 ${bubble.size} ${bubble.size}`}
          width={bubble.size} 
          height={bubble.size} 
          style={{ 
            position: 'absolute', 
            top: 0,
            left: 0,
            transform: 'rotate(-90deg)',
            transformOrigin: 'center',
            pointerEvents: 'none',
            zIndex: 3
          }}
        >
          <circle 
            cx={bubble.size/2} 
            cy={bubble.size/2} 
            r={bubble.size/2 - 3}
            fill="none" 
            stroke={mainColor} 
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * (bubble.size/2 - 3)}
            strokeDashoffset={isGoalReached ? 0 : (2 * Math.PI * (bubble.size/2 - 3) * (1 - (bubble.minutesRemaining || 0) / (bubble.metadata?.totalMinutes || 10)))}
            style={{ 
              filter: `drop-shadow(0 0 5px ${mainColor})`,
              transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease'
            }}
          />
        </svg>
      )}
    </motion.div>
  );
});


/** Marcadores Direcionais para Bolhas Fora da Tela */
const ViewportMarkers = ({ bubbles, scrollPos, scale, onFocusTask }: any) => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100002 }}>
      {bubbles.map((bubble: any) => {
        const el = document.getElementById(`bubble-${bubble.id}`);
        if (!el) return null;

        const rect = el.getBoundingClientRect();
        const bubbleScreenX = rect.left + rect.width / 2;
        const bubbleScreenY = rect.top + rect.height / 2;
        
        // Verifica se qualquer parte da bolha está visível na tela
        const isVisible = (
          rect.top < h &&
          rect.bottom > 0 &&
          rect.left < w &&
          rect.right > 0
        );
        
        if (isVisible) return null;
        
        // Calcular direção a partir do centro da tela para a bolha
        const dx = bubbleScreenX - (w / 2);
        const dy = bubbleScreenY - (h / 2);
        const angle = Math.atan2(dy, dx);
        
        const margin = 50;
        let edgeX, edgeY;
        
        const aspect = w / h;
        const tanAngle = Math.abs(Math.tan(angle));
        
        if (tanAngle < 1/aspect) {
          edgeX = dx > 0 ? w - margin : margin;
          edgeY = (h / 2) + (dx > 0 ? (w/2 - margin) * Math.tan(angle) : -(w/2 - margin) * Math.tan(angle));
        } else {
          edgeY = dy > 0 ? h - margin : margin;
          edgeX = (w / 2) + (dy > 0 ? (h/2 - margin) / Math.tan(angle) : -(h/2 - margin) / Math.tan(angle));
        }

        const themeColor = BUBBLE_COLORS[bubble.type] || '#38bdf8';
        const isOutward = (bubble as any).metadata?.direction === 'outward';

        return (
          <motion.div
            key={`marker-${bubble.id}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{
              position: 'absolute',
              left: edgeX,
              top: edgeY,
              width: '38px',
              height: '38px',
              x: '-50%',
              y: '-50%',
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(10px)',
              border: `2px solid ${themeColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 15px ${themeColor}60`,
              zIndex: 10000,
              pointerEvents: 'all',
              cursor: 'pointer'
            }}
            whileHover={{ scale: 1.2, boxShadow: `0 0 25px ${themeColor}` }}
            onClick={() => onFocusTask(bubble)}
          >
            {/* Seta Direcional */}
            <div style={{ 
              position: 'absolute',
              transform: `rotate(${angle}rad) translateX(24px)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ChevronRight size={16} color={themeColor} />
            </div>
            
            {/* Miniatura do Conteúdo */}
            <div style={{ fontSize: '14px', zIndex: 2 }}>
              {isOutward ? '🚭' : bubble.type === 'work' ? '💼' : bubble.type === 'study' ? '📚' : '✨'}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};



/** Componente de Radar/Sonar com Temas Selecionáveis */
const SonarAuras = memo(({ centerX, centerY, theme = 'clockwork' }: { 
  centerX: number, 
  centerY: number,
  theme?: SonarTheme
}) => {
  // 1. TEMA: RADIO WAVE (Ondas Cinematográficas)
  const RadioWaveTheme = () => (
    <div style={{ position: 'absolute', left: centerX, top: centerY, width: '1000px', height: '1000px', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
      {[0, 2, 4].map((delay) => (
        <motion.div
          key={delay}
          animate={{ scale: [0, 1.2], opacity: [0, 0.5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeOut", delay }}
          style={{ position: 'absolute', left: '50%', top: '50%', x: '-50%', y: '-50%', width: '1000px', height: '1000px', borderRadius: '50%', background: `radial-gradient(circle, transparent 40%, #ef444411 60%, #ef444466 80%, #ef4444 95%, transparent 100%)` }}
        />
      ))}
    </div>
  );

  // 2. TEMA: SUBMARINE (Varredura PPI)
  const SubmarineTheme = () => (
    <div style={{ position: 'absolute', left: centerX, top: centerY, width: '1000px', height: '1000px', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute', left: '50%', top: '50%', width: '1000px', height: '1000px', x: '-50%', y: '-50%', borderRadius: '50%', background: `conic-gradient(from 0deg, #ef4444 0deg, #ef444433 20deg, transparent 90deg)`, opacity: 0.6 }}
      />
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '1000px', height: '1000px', borderRadius: '50%', border: '2px solid rgba(239, 68, 68, 0.2)' }} />
    </div>
  );

  // 3. TEMA: HOLOGRAPHIC (HUD Moderno)
  const HolographicTheme = () => (
    <div style={{ position: 'absolute', left: centerX, top: centerY, width: '1000px', height: '1000px', transform: 'translate(-50%, -50%)', pointerEvents: 'none', maskImage: 'radial-gradient(circle, transparent 80px, black 120px)', WebkitMaskImage: 'radial-gradient(circle, transparent 80px, black 120px)' }}>
      {[900, 700, 400].map((size, i) => (
        <motion.div key={i} animate={{ rotate: i % 2 === 0 ? 360 : -360 }} transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', left: '50%', top: '50%', width: `${size}px`, height: `${size}px`, x: '-50%', y: '-50%', borderRadius: '50%', border: '1px dashed rgba(56, 189, 248, 0.3)' }}
        />
      ))}
    </div>
  );

  // 4. TEMA: CLOCKWORK (Engrenagens RPG)
  const ClockworkTheme = () => (
    <div style={{ position: 'absolute', left: centerX, top: centerY, width: '1000px', height: '1000px', transform: 'translate(-50%, -50%)', pointerEvents: 'none', maskImage: 'radial-gradient(circle, transparent 80px, black 120px)', WebkitMaskImage: 'radial-gradient(circle, transparent 80px, black 120px)' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute', left: '50%', top: '50%', width: '1000px', height: '1000px', x: '-50%', y: '-50%', borderRadius: '50%', backgroundImage: `repeating-conic-gradient(from 0deg, #f59e0b 0deg, #f59e0b 2deg, transparent 2deg, transparent 10deg)`, opacity: 0.4 }}
      />
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} animate={{ rotate: 360 }} transition={{ duration: 4 + i, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', width: '160px', height: '1px', background: `linear-gradient(90deg, transparent, #f59e0b, transparent)`, transformOrigin: 'center center', opacity: 0.3 }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {theme === 'radio_wave' && <RadioWaveTheme />}
      {theme === 'submarine' && <SubmarineTheme />}
      {theme === 'holographic' && <HolographicTheme />}
      {theme === 'clockwork' && <ClockworkTheme />}
    </>
  );
});

