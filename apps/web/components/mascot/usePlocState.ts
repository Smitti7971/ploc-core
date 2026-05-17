import { useState, useEffect, useRef } from 'react';
import { PlocState, PlocMode } from './types';
import { RoutineOption, PILLARS_DATA } from '@/modules/routines/data/routinesData';
import { attributeEngine } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '@/modules/blackboard/events/eventBus';

interface UsePlocStateOptions {
  emotion?: string;
  speak?: (text: string, duration?: number) => void;
}

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Gatilho de dor (quando arremessado rápido)
  const triggerHurt = () => {
    setPlocState(prev => ({ ...prev, isHurt: true }));
    if (speak) {
      speak("AII! Essa doeu! 🤕", 2000);
    }
    setTimeout(() => {
      setPlocState(prev => ({ ...prev, isHurt: false }));
    }, 1500);
  };

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
