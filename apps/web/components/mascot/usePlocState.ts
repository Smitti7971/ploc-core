import { useState, useEffect, useRef } from 'react';
import { PlocState, PlocMode } from './types';
import { RoutineOption, PILLARS_DATA } from '@/modules/routines/data/routinesData';
import { attributeEngine } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '@/modules/blackboard/events/eventBus';
import { getHasUserInteracted } from './usePlocSpeech';

interface UsePlocStateOptions {
  emotion?: string;
  speak?: (text: string, duration?: number) => void;
}

// Cache global para o AudioContext das vozes do Ploc para evitar vazamento de memória e reinstanciação
let sharedMascotAudioCtx: AudioContext | null = null;

// Função ultra-fofa de síntese de voz de desenho animado ("uhm", "ai", "poxa/sigh") via Web Audio API
const playCuteVocalSound = (type: 'annoyed' | 'hurt' | 'sigh') => {
  if (typeof window === 'undefined') return;
  if (!getHasUserInteracted()) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!sharedMascotAudioCtx) {
      sharedMascotAudioCtx = new AudioContextClass();
    }
    const ctx = sharedMascotAudioCtx;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Filtros e osciladores harmônicos para modelar sonoridades vocais fofas (formantes)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    filter.type = 'bandpass';
    filter.Q.setValueAtTime(4.5, now);

    const basePitch = 250 + Math.random() * 30; // Pitch agudo, fofo e caricato

    if (type === 'hurt') {
      // Som caricato de "Aii!" - Sweep exponencial ascendente muito fofo e ágil
      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(basePitch, now);
      osc1.frequency.exponentialRampToValueAtTime(basePitch * 2.3, now + 0.08);

      osc2.frequency.setValueAtTime(basePitch * 1.5, now);
      osc2.frequency.exponentialRampToValueAtTime(basePitch * 3.45, now + 0.08);

      filter.frequency.setValueAtTime(750, now);
      filter.frequency.exponentialRampToValueAtTime(2300, now + 0.08);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.12, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.17);
      osc2.stop(now + 0.17);
    } else if (type === 'annoyed') {
      // Som caricato de "Umm..." - Glissando descendente resmungado com osciladores senoidais combinados
      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(basePitch * 1.15, now);
      osc1.frequency.linearRampToValueAtTime(basePitch * 0.9, now + 0.22);

      osc2.frequency.setValueAtTime(basePitch * 1.7, now);
      osc2.frequency.linearRampToValueAtTime(basePitch * 1.35, now + 0.22);

      filter.frequency.setValueAtTime(950, now);
      filter.frequency.linearRampToValueAtTime(580, now + 0.22);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.04);
      gainNode.gain.linearRampToValueAtTime(0.07, now + 0.16);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
    } else {
      // Som caricato de "Poxa..." (Sigh) - Exalação e queda de pitch super suave e melancólica
      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(basePitch * 1.05, now);
      osc1.frequency.exponentialRampToValueAtTime(basePitch * 0.72, now + 0.3);

      filter.frequency.setValueAtTime(680, now);
      filter.frequency.linearRampToValueAtTime(420, now + 0.3);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.09, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

      osc1.start(now);
      osc1.stop(now + 0.33);
    }

    setTimeout(() => {
      osc1.disconnect();
      osc2.disconnect();
      filter.disconnect();
      gainNode.disconnect();
    }, 400);
  } catch (e) {
    // Falha silenciosa
  }
};

export function usePlocState({ emotion, speak }: UsePlocStateOptions = {}) {
  const [isMounted, setIsMounted] = useState(false);

  // Estado persistido do humor
  const [plocState, setPlocState] = useState<PlocState>({
    mode: 'sleeping',
    angerLevel: 0,
    angerClicks: 0,
    isHurt: false,
  });

  // Estados de simulação/foco nos pilares de rotina
  const [focusedRoutine, setFocusedRoutine] = useState<RoutineOption | null>(null);
  const [focusedPillar, setFocusedPillar] = useState<string | null>(null);
  const [showSimulation, setShowSimulation] = useState(false);

  // Estados determinísticos de interação física (resolução de resets de escala)
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastReactionTimeRef = useRef<number>(0);
  const bubbleCollisionCountRef = useRef<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Gatilho de dor (quando arremessado rápido)
  const triggerHurt = () => {
    const nowTime = Date.now();
    if (nowTime - lastReactionTimeRef.current < 1800) return;
    lastReactionTimeRef.current = nowTime;

    setPlocState(prev => ({ ...prev, isHurt: true }));
    playCuteVocalSound('hurt'); // Foley complementar fofo
    if (speak) {
      speak("aiii! 🤕", 1500);
    }
    setTimeout(() => {
      setPlocState(prev => ({ ...prev, isHurt: false }));
    }, 1500);
  };

  // Gatilho de incomodado/irritado por bolha que colidiu
  const triggerBubbleCollided = (word: string) => {
    bubbleCollisionCountRef.current += 1;
    const isThresholdReached = bubbleCollisionCountRef.current >= 5;
    
    if (isThresholdReached) {
      bubbleCollisionCountRef.current = 0; // reset
    }

    const nowTime = Date.now();
    if (nowTime - lastReactionTimeRef.current < 1800 && !isThresholdReached) return;
    lastReactionTimeRef.current = nowTime;

    setPlocState(prev => {
      if (prev.isHurt || prev.isHit) return prev;
      
      setTimeout(() => {
        setPlocState(p => ({ ...p, isHurt: false, isHit: false }));
      }, 1000);

      return {
        ...prev,
        isHurt: isThresholdReached,
        isHit: !isThresholdReached
      };
    });

    if (isThresholdReached) {
      playCuteVocalSound('annoyed');
      if (speak) {
        const phrases = [
          "CARA, tô meditando aqui, não consegue estourar essas bolhas pra mim?",
          "Ei! Assim você me desconcentra! Tira essas bolhas daqui!",
          "Socorro! Alguém me salva desse ataque de sabão!",
          "Não dá pra focar com essas bolhas batendo em mim! Me ajuda!"
        ];
        speak(phrases[Math.floor(Math.random() * phrases.length)], 5000);
      }
      return;
    }
  };

  // Escuta colisões de bolhas para reagir
  useEffect(() => {
    const unsubscribe = blackboardEventBus.subscribe(
      BLACKBOARD_EVENTS.BUBBLE_EXPLODED,
      (data) => {
        if (data && data.collided) {
          triggerBubbleCollided(data.word);
        }
      }
    );
    return () => unsubscribe();
  }, [speak]);

  // Fórmula de cliques necessários para irritação
  const getClicksNeeded = (lvl: number) => Math.floor(Math.pow(lvl, 3) * 15);

  // Lê localStorage e inicializa humor/modo sono na montagem
  useEffect(() => {
    const savedLevel = parseInt(localStorage.getItem('ploc_anger_level') || '1');
    const savedClicks = parseInt(localStorage.getItem('ploc_anger_clicks') || '0');

    const now = new Date();
    const hour = now.getHours();

    const sleepStart = parseInt(localStorage.getItem('ploc_sleep_start') || '0');
    const sleepEnd = parseInt(localStorage.getItem('ploc_sleep_end') || '6');

    let isSleepTime = false;
    if (sleepStart < sleepEnd) {
      isSleepTime = hour >= sleepStart && hour < sleepEnd;
    } else {
      isSleepTime = hour >= sleepStart || hour < sleepEnd;
    }

    setPlocState({
      mode: isSleepTime ? 'sleeping' : 'active',
      angerLevel: savedLevel,
      angerClicks: savedClicks,
      isHurt: false,
    });

    // Se estiver no horário de sono e entrar no app pela primeira vez na sessão (ou hoje)
    if (isSleepTime && typeof window !== 'undefined' && !sessionStorage.getItem('ploc_sleep_warned')) {
      sessionStorage.setItem('ploc_sleep_warned', 'true');
      
      // Aplica penalidade após 1.5 segundos para sincronização perfeita de áudio e UI
      setTimeout(() => {
        attributeEngine.applySleepPenalty();

        blackboardEventBus.emit(BLACKBOARD_EVENTS.PLOC_REACTION, {
          type: 'STRESS',
          message: 'HUMANO! Você deveria estar dormindo agora! 😴 Perdeu pontos de Foco e Corpo por ficar acordado! Vá descansar!'
        });
      }, 1500);
    }
  }, []);

  // Sincroniza emoção externa opcional com o modo do Ploc
  useEffect(() => {
    if (emotion) {
      const modeMap: Record<string, PlocMode> = {
        calm: 'active',
        happy: 'active',
        stressed: 'stressing',
        pissed: 'pissed',
        sleeping: 'sleeping',
        dizzy: 'stressing'
      };
      setPlocState(prev => ({ ...prev, mode: modeMap[emotion] || 'active' }));
    }
  }, [emotion]);

  // Clique fora: volta a dormir se clicar em qualquer lugar que não o Ploc ou inputs/forms
  useEffect(() => {
    const handleOutside = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.closest('.auth-modal') ||
        target.closest('form')
      ) {
        return;
      }

      if (containerRef.current && !containerRef.current.contains(target)) {
        setPlocState(prev => {
          if (prev.mode !== 'sleeping') {
            return { ...prev, mode: 'sleeping' };
          }
          return prev;
        });
      }
    };
    
    document.addEventListener('pointerdown', handleOutside, true);
    return () => document.removeEventListener('pointerdown', handleOutside, true);
  }, []);

  // Handler de clique/taps no corpo do Ploc
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Se clicar dormindo, acorda
    if (plocState.mode === 'sleeping') {
      const now = new Date();
      const hour = now.getHours();
      const sleepStart = parseInt(localStorage.getItem('ploc_sleep_start') || '0');
      const sleepEnd = parseInt(localStorage.getItem('ploc_sleep_end') || '6');
      
      let isSleepTime = false;
      if (sleepStart < sleepEnd) {
        isSleepTime = hour >= sleepStart && hour < sleepEnd;
      } else {
        isSleepTime = hour >= sleepStart || hour < sleepEnd;
      }

      if (isSleepTime) {
        setPlocState(prev => ({ ...prev, mode: 'stressing' }));
        blackboardEventBus.emit(BLACKBOARD_EVENTS.PLOC_REACTION, {
          type: 'STRESS',
          message: 'ZZZ... QUE susto! 😤 Não me acorde de madrugada, humano! Vá dormir!'
        });
      } else {
        setPlocState(prev => ({ ...prev, mode: 'active' }));
      }

      if (focusedRoutine) {
        setShowSimulation(true);
      }
      return;
    }

    // Se já estiver ativo, toggle simulação se houver foco
    if (focusedRoutine) {
      setShowSimulation(!showSimulation);
    }
    
    // Mini game de irritação
    setPlocState(prev => {
      const newClicks = prev.angerClicks + 1;
      const needed = getClicksNeeded(prev.angerLevel);

      localStorage.setItem('ploc_anger_clicks', newClicks.toString());

      if (newClicks >= needed) {
        const newLevel = Math.min(prev.angerLevel + 1, 10);
        localStorage.setItem('ploc_anger_level', newLevel.toString());
        localStorage.setItem('ploc_anger_clicks', '0');
        return { ...prev, mode: 'pissed', angerLevel: newLevel, angerClicks: 0 };
      }

      const progress = newClicks / needed;
      if (progress > 0.5) {
        return { ...prev, mode: 'stressing', angerClicks: newClicks };
      }

      return { ...prev, mode: 'active', angerClicks: newClicks };
    });
  };

  const isSleeping = plocState.mode === 'sleeping';
  const isPissed = plocState.mode === 'pissed';
  const isStressing = plocState.mode === 'stressing';

  return {
    isMounted,
    plocState,
    setPlocState,
    focusedRoutine,
    setFocusedRoutine,
    focusedPillar,
    setFocusedPillar,
    showSimulation,
    setShowSimulation,
    isHovered,
    setIsHovered,
    isTapped,
    setIsTapped,
    isDragging,
    setIsDragging,
    containerRef,
    triggerHurt,
    handleClick,
    isSleeping,
    isPissed,
    isStressing,
  };
}
