/**
 * ============================================================================
 * Hook de Física e Estado Físico - usePlocState.ts
 * ============================================================================
 * Descrição: Centraliza toda a física de arraste (drag & drop), humor/irritabilidade
 * física por cliques, efeitos sonoros sintetizados e regras de sono do Ploc.
 * 
 * Principais responsabilidades:
 * - Controla o estado de humor (sleeping, active, stressing, pissed) persistindo no localStorage.
 * - Sintetiza áudio procedural fofo (gemidos, suspiros, irritação) usando Web Audio API (AudioContext).
 * - Monitora a colisão de arraste do cursor/dedo sobre pilares e rotinas da tela.
 * - Gerencia o sono automático se o usuário estiver utilizando a plataforma de madrugada.
 * ============================================================================
 */

import { useState, useEffect, useRef } from 'react';
import { PlocState, PlocMode } from './types';
import { RoutineOption, PILLARS_DATA } from '@/modules/routines/data/routinesData';
import { attributeEngine } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '@/modules/blackboard/events/eventBus';
import { getHasUserInteracted } from './usePlocSpeech';
import { triggerAchievementUnlock } from './achievements';
import { MASCOT_COLLISION_PHRASES } from './plocPhrases';

interface UsePlocStateOptions {
  emotion?: string;
  speak?: (text: string, duration?: number) => void;
  isSpeaking?: boolean;
}

// Cache global para o AudioContext das vozes do Ploc para evitar vazamento de memória e reinstanciação
let sharedMascotAudioCtx: AudioContext | null = null;

if (typeof window !== 'undefined') {
  const initMascotAudioCtx = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass && !sharedMascotAudioCtx) {
        sharedMascotAudioCtx = new AudioContextClass();
      }
      if (sharedMascotAudioCtx && sharedMascotAudioCtx.state === 'suspended') {
        sharedMascotAudioCtx.resume().catch(() => { });
      }
    } catch (e) {
      console.warn('Failed to pre-initialize sharedMascotAudioCtx:', e);
    }
  };
  window.addEventListener('pointerdown', initMascotAudioCtx, true);
  window.addEventListener('keydown', initMascotAudioCtx, true);
}

// Função ultra-fofa de síntese de voz de desenho animado ("uhm", "ai", "poxa/sigh") via Web Audio API
const playCuteVocalSound = (type: 'annoyed' | 'hurt' | 'sigh' | 'success') => {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!sharedMascotAudioCtx) {
      sharedMascotAudioCtx = new AudioContextClass();
    }
    const ctx = sharedMascotAudioCtx;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => { });
    }

    // Se o AudioContext continuar suspenso (ainda sem interação real),
    // saímos pacificamente para evitar exceções do navegador.
    if (ctx.state !== 'running') {
      return;
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
    } else if (type === 'success') {
      // Som alegre de "Oba!" - Glissando ascendente curto e brilhante com dois osciladores senoidais
      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(basePitch * 1.2, now);
      osc1.frequency.exponentialRampToValueAtTime(basePitch * 1.9, now + 0.15);

      osc2.frequency.setValueAtTime(basePitch * 1.8, now);
      osc2.frequency.exponentialRampToValueAtTime(basePitch * 2.85, now + 0.15);

      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(3200, now + 0.15);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.17);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.18);
      osc2.stop(now + 0.18);
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

export function usePlocState({ emotion, speak, isSpeaking }: UsePlocStateOptions = {}) {
  const [isMounted, setIsMounted] = useState(false);
  const isSpeakingRef = useRef(isSpeaking);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  // Refs para rastrear a transição de estados e evitar duplicações
  const prevLevelRef = useRef<number>(0);
  const prevModeRef = useRef<string>('sleeping');
  const lastTriggeredTransitionRef = useRef<string>('');

  // Estado persistido do humor
  const [plocState, setPlocState] = useState<PlocState>({
    mode: 'sleeping',
    angerLevel: 0,
    angerClicks: 0,
    angerPercentage: 0,
    levelLockTimer: 0,
    levelUnlockClicks: 0,
    preLevelClickCount: 0,
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
  const lastRapidClickTimeRef = useRef<number>(0);
  const rapidClickCountRef = useRef<number>(0);
  const isWarningRef = useRef<boolean>(false);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Sincroniza persistência do nível de raiva e porcentagem
  useEffect(() => {
    if (!isMounted) return;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ploc_anger_level', plocState.angerLevel.toString());
      localStorage.setItem('ploc_anger_pct', plocState.angerPercentage.toString());
    }
  }, [plocState.angerLevel, plocState.angerPercentage, isMounted]);

  // 2. Hook de transição de estado unificado para efeitos sonoros/fala exatamente UMA vez
  useEffect(() => {
    if (!isMounted) {
      prevLevelRef.current = plocState.angerLevel;
      prevModeRef.current = plocState.mode;
      return;
    }

    const prevLevel = prevLevelRef.current;
    const currentLevel = plocState.angerLevel;
    prevLevelRef.current = currentLevel;

    const prevMode = prevModeRef.current;
    const currentMode = plocState.mode;
    prevModeRef.current = currentMode;

    // Se houve transição real de nível de raiva
    if (currentLevel !== prevLevel) {
      const transitionKey = `${prevLevel}->${currentLevel}`;
      if (lastTriggeredTransitionRef.current === transitionKey) {
        return;
      }
      lastTriggeredTransitionRef.current = transitionKey;

      // 1. Se acalmou (de > 0 para 0)
      if (currentLevel === 0 && prevLevel > 0) {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('ploc_anger_denied_level');
        }

        if (currentMode !== 'sleeping' && speak) {
          const calmPhrases = [
            'Me acalmei, não me irrite novamente... ',
            'Você gosta de me irritar né ?',
            'Não faça mais isso!',
            'Hmm...'
          ];
          const chosenPhrase = calmPhrases[Math.floor(Math.random() * calmPhrases.length)];
          speak(chosenPhrase, 4000);
        }
      }

      // 2. Subiu de nível (ficou irritado)
      if (currentLevel > prevLevel) {
        playCuteVocalSound('annoyed');
        if (speak) {
          if (currentLevel === 1) {
            speak('Não tem nada pra fazer não é!? ', 4000);
          } else if (currentLevel === 2) {
            speak('Gosta de me irritar né!? ', 4000);
          } else if (currentLevel === 3) {
            speak('Que implicancia é essa velho!? ', 4000);
          } else if (currentLevel === 4) {
            speak('Sua sorte é que eu sou só uma bolha!! ', 4000);
          } else if (currentLevel === 5) {
            speak('Cara... vou pedir demissão de você!! ', 5000);
            triggerAchievementUnlock('tornado_vermelho');
          }
        }
      }
    }
  }, [plocState.angerLevel, plocState.mode, isMounted, speak]);

  // Gatilho de dor (quando arremessado rápido) - equivale a 5 cliques de raiva
  const triggerHurt = () => {
    if (plocState.mode === 'sleeping') return;
    const nowTime = Date.now();
    if (nowTime - lastReactionTimeRef.current < 1800) return;
    lastReactionTimeRef.current = nowTime;

    setPlocState(prev => ({ ...prev, isHurt: true }));
    playCuteVocalSound('hurt');
    if (speak) {
      speak('Por que não joga sua bunda nessa parede?', 1500);
    }
    setTimeout(() => {
      setPlocState(prev => ({ ...prev, isHurt: false }));
    }, 1500);

    // Arremessar = 5 cliques de raiva no novo sistema
    // Usamos um pequeno delay para nao conflitar com o setState de isHurt
    setTimeout(() => {
      lastClickTimeRef.current = Date.now();
      for (let i = 0; i < 5; i++) {
        handleAngerIncrement(1);
      }
    }, 50);
  };

  // Gatilho de incomodado/irritado por bolha que colidiu
  const triggerBubbleCollided = (word: string) => {
    const activeMode = typeof window !== 'undefined' ? localStorage.getItem('ploc_game_mode') || 'decor' : 'decor';
    if (activeMode === 'decor' || activeMode === 'onboarding_game') {
      return; // Silencia totalmente frases legadas em decor e onboarding_game!
    }

    const wordUpper = word.toUpperCase().trim();
    let num = -1;
    let isPositive = false;
    let isNeg = false;

    if (wordUpper.startsWith('S')) {
      num = parseInt(wordUpper.substring(1));
      if (!isNaN(num)) {
        isPositive = num <= 5;
        isNeg = num >= 6;
      }
    } else if (wordUpper.startsWith('N')) {
      num = parseInt(wordUpper.substring(1));
      if (!isNaN(num)) {
        isPositive = num <= 10;
        isNeg = num >= 11;
      }
    }

    const nowTime = Date.now();
    if (nowTime - lastReactionTimeRef.current < 1800) return;
    lastReactionTimeRef.current = nowTime;

    if (isNeg) {
      bubbleCollisionCountRef.current += 1;
      const isThresholdReached = bubbleCollisionCountRef.current >= 5;
      if (isThresholdReached) {
        bubbleCollisionCountRef.current = 0; // reset
      }

      setPlocState(prev => ({
        ...prev,
        isHurt: isThresholdReached,
        isHit: !isThresholdReached,
        isPositiveHit: false
      }));

      // Garante o reset da cor vermelha/amarela após 1 segundo
      setTimeout(() => {
        setPlocState(p => ({ ...p, isHurt: false, isHit: false }));
      }, 1000);

      if (isThresholdReached) {
        playCuteVocalSound('annoyed');
        if (speak) {
          const arr = MASCOT_COLLISION_PHRASES.annoyed;
          speak(arr[Math.floor(Math.random() * arr.length)], 5000);
        }
      } else {
        playCuteVocalSound('sigh');
        if (speak) {
          const arr = MASCOT_COLLISION_PHRASES.negativeHit;
          speak(arr[Math.floor(Math.random() * arr.length)], 4000);
        }
      }
    } else if (isPositive) {
      // Efeito positivo!
      // Vamos verificar se causará "Cabo de Guerra" (atributo alvo >= 5)
      let pillarIndex = -1;
      if (wordUpper.startsWith('S')) {
        pillarIndex = (num - 1) % 5;
      } else if (wordUpper.startsWith('N')) {
        pillarIndex = ((num - 1) % 10) % 5;
      }

      const pillars: Array<'corpo' | 'mente' | 'vida' | 'liberdade' | 'proposito'> = ['corpo', 'mente', 'vida', 'liberdade', 'proposito'];
      const targetPillar = pillarIndex >= 0 && pillarIndex < pillars.length ? pillars[pillarIndex] : null;
      const currentVal = targetPillar ? attributeEngine.getAttributes()[targetPillar] : 0;
      const isCaboDeGuerra = currentVal >= 5;

      setPlocState(prev => ({
        ...prev,
        isHurt: false,
        isHit: false,
        isPositiveHit: true
      }));

      // Garante o reset da cor verde após 1 segundo!
      setTimeout(() => {
        setPlocState(p => ({ ...p, isPositiveHit: false }));
      }, 1000);

      playCuteVocalSound('success');
      if (speak) {
        if (isCaboDeGuerra) {
          const arr = MASCOT_COLLISION_PHRASES.caboDeGuerra;
          speak(arr[Math.floor(Math.random() * arr.length)], 5000);
        } else {
          const arr = MASCOT_COLLISION_PHRASES.positiveSuccess;
          speak(arr[Math.floor(Math.random() * arr.length)], 2000);
        }
      }
    }
  };

  // Escuta colisões de bolhas para reagir
  useEffect(() => {
    const unsubscribe = blackboardEventBus.subscribe(
      BLACKBOARD_EVENTS.BUBBLE_EXPLODED,
      (data) => {
        if (data && data.collided) {
          // DESATIVADO: Ploc não se irrita nem reage fisicamente com colisões automáticas das bolhas
          // triggerBubbleCollided(data.word);
        }
      }
    );
    return () => unsubscribe();
  }, [speak]);

  // Configuracao dos Niveis de Irritacao - novo sistema por percentual
  // label: nome exibido na UI
  // lockDuration: segundos obrigatorios ao entrar no nivel (0 = sem lock)
  // unlockClicksNeeded: quantos cliques para liberar o contador durante o lock
  // percentPerClick: quanto cada clique adiciona ao percentual (0-100)
  // decayRate: decaimento por tick de 100ms quando nivel=0 e usuario parou de clicar (3s timeout)
  const ANGER_LEVELS = [
    { label: 'NEUTRO', lockDuration: 0, unlockClicksNeeded: 5, percentPerClick: 10, ignoredClicks: 5 },  // Level 0
    { label: 'CHATEADO', lockDuration: 30, unlockClicksNeeded: 5, percentPerClick: 9, ignoredClicks: 0 },  // Level 1 - unico com 5 cliques de desbloqueio
    { label: 'FRUSTRADO', lockDuration: 45, unlockClicksNeeded: 0, percentPerClick: 8, ignoredClicks: 0 },  // Level 2 - apenas timer
    { label: 'IRRITADO', lockDuration: 60, unlockClicksNeeded: 0, percentPerClick: 7, ignoredClicks: 0 },  // Level 3 - apenas timer
    { label: 'DESCONTROLADO', lockDuration: 75, unlockClicksNeeded: 0, percentPerClick: 6, ignoredClicks: 0 },  // Level 4 - apenas timer
    { label: 'FURIOSO', lockDuration: 90, unlockClicksNeeded: 0, percentPerClick: 0, ignoredClicks: 0 },  // Level 5 - imune
  ];

  const lastClickTimeRef = useRef<number>(Date.now());
  const tickCounterRef = useRef<number>(0);




  // Registrar escuta do EventBus para o incremento de raiva (mantido para compatibilidade)
  useEffect(() => {
    const unsubAnger = blackboardEventBus.subscribe('PLOC_ANGER_INCREASE', (data) => {
      if (data && typeof data.amount === 'number') {
        // Converte amount (cliques antigos) para equivalente em % do novo sistema
        handleAngerIncrement(data.amount);
      }
    });
    return () => unsubAnger();
  }, [plocState.angerLevel]);

  // Loop principal de tempo: Ticks de 100ms para decaimento e timer de niveis
  useEffect(() => {
    if (!isMounted) return;

    const interval = setInterval(() => {
      if (isSpeakingRef.current) {
        return;
      }
      tickCounterRef.current += 1;
      const isOneSecond = tickCounterRef.current % 10 === 0;

      setPlocState(prev => {
        const isSleeping = prev.mode === 'sleeping';

        let nextLevel = prev.angerLevel;
        let nextPct = prev.angerPercentage;
        let nextLockTimer = prev.levelLockTimer;
        let nextUnlockClicks = prev.levelUnlockClicks;
        let nextPreCount = prev.preLevelClickCount;
        let nextMode = prev.mode;

        // 1. Countdown do lock timer do estado ativo (qualquer nível > 0)
        if (nextLevel > 0 && nextLockTimer > 0 && isOneSecond) {
          const decreaseAmount = isSleeping ? 2 : 1;
          nextLockTimer = Math.max(0, nextLockTimer - decreaseAmount);
        }

        // 2. Se o timer do estado expirar (chegar a 0), ele volta para o modo neutro (Lvl 0)
        if (nextLevel > 0 && nextLockTimer <= 0) {
          return {
            ...prev,
            angerLevel: 0,
            angerClicks: 0,
            angerPercentage: 0,
            levelLockTimer: 0,
            levelUnlockClicks: 0,
            preLevelClickCount: 0,
            mode: isSleeping ? 'sleeping' : 'active',
          };
        }

        // 3. Decaimento geral da barra de porcentagem de cliques para todos os níveis < 5
        if (nextLevel < 5 && nextPct > 0) {
          const timeSinceLastClick = Date.now() - lastClickTimeRef.current;
          if (timeSinceLastClick > 3000) {
            // Decai 2% a cada 100ms (~20% por segundo) no normal, ou 4% (2x mais rápido) no sono
            const decayAmount = isSleeping ? 4 : 2;
            nextPct = Math.max(0, nextPct - decayAmount);

            // Se a barra de porcentagem voltar a 0 no nível 0, redefinimos o contador de cliques de ativação
            if (nextLevel === 0 && nextPct === 0) {
              nextPreCount = 0;
            }
          }
        }

        // Modo baseado no nivel
        if (!isSleeping) {
          if (nextLevel === 5) {
            nextMode = 'pissed';
          } else if (nextLevel >= 3) {
            nextMode = 'stressing';
          } else {
            nextMode = 'active';
          }
        }

        return {
          ...prev,
          angerLevel: nextLevel,
          angerPercentage: parseFloat(nextPct.toFixed(2)),
          levelLockTimer: nextLockTimer,
          levelUnlockClicks: nextUnlockClicks,
          preLevelClickCount: nextPreCount,
          mode: nextMode,
        };
      });
    }, 100);

    return () => {
      clearInterval(interval);
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [isMounted]);

  // Le localStorage e inicializa humor/modo sono na montagem
  useEffect(() => {
    const savedLevel = parseInt(localStorage.getItem('ploc_anger_level') || '0');
    const savedPct = parseFloat(localStorage.getItem('ploc_anger_pct') || '0');

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

    const cfg = ANGER_LEVELS[Math.min(savedLevel, 5)];

    setPlocState({
      mode: isSleepTime ? 'sleeping' : savedLevel === 5 ? 'pissed' : savedLevel >= 3 ? 'stressing' : 'active',
      angerLevel: savedLevel,
      angerClicks: 0,
      angerPercentage: savedPct,
      levelLockTimer: savedLevel >= 1 && savedLevel <= 5 ? cfg.lockDuration : 0,
      levelUnlockClicks: 0,
      preLevelClickCount: 0,
      isHurt: false,
    });

    // Se estiver no horário de sono e entrar no app pela primeira vez na sessão
    if (isSleepTime && typeof window !== 'undefined' && !sessionStorage.getItem('ploc_sleep_warned')) {
      sessionStorage.setItem('ploc_sleep_warned', 'true');

      setTimeout(() => {
        attributeEngine.applySleepPenalty();

        blackboardEventBus.emit(BLACKBOARD_EVENTS.PLOC_REACTION, {
          type: 'STRESS',
          message: 'Cara! Você deveria estar dormindo agora! Perdeu pontos de Foco e Corpo por ficar acordado! Vá descansar!'
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

  // Função auxiliar interna para incrementar raiva pelo novo sistema (percentual)
  const handleAngerIncrement = (clickEquivalent: number) => {
    setPlocState(prev => {
      if (prev.mode === 'sleeping') return prev;
      if (prev.angerLevel === 5) return prev;

      const cfg = ANGER_LEVELS[prev.angerLevel];
      const addedPct = clickEquivalent * cfg.percentPerClick;
      const newPct = Math.min(100, prev.angerPercentage + addedPct);

      if (newPct >= 100) {
        // Sobe de nível
        const nextLevel = Math.min(prev.angerLevel + 1, 5);
        const nextCfg = ANGER_LEVELS[nextLevel];
        const isLvl5 = nextLevel === 5;

        return {
          ...prev,
          angerLevel: nextLevel,
          angerPercentage: 0,
          levelLockTimer: nextCfg.lockDuration,
          levelUnlockClicks: 0,
          mode: isLvl5 ? 'pissed' : nextLevel >= 3 ? 'stressing' : 'active',
        };
      }

      return { ...prev, angerPercentage: parseFloat(newPct.toFixed(2)) };
    });
  };

  // Handler de clique/taps no corpo do Ploc - NOVO SISTEMA
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Se clicar dormindo, ignora
    if (plocState.mode === 'sleeping') {
      return;
    }

    // Toggle simulacao se houver foco
    if (focusedRoutine) {
      setShowSimulation(!showSimulation);
    }

    // Nivel 5 - FURIOSO - imune a cliques e silencioso
    if (plocState.angerLevel === 5) {
      return;
    }

    lastClickTimeRef.current = Date.now();

    // Calcula se este clique vai fazer subir de nível ou ativar o aviso do nível 0
    let willLevelUp = false;
    let isWarningClick = false;
    if (plocState.angerLevel < 5) {
      const cfg = ANGER_LEVELS[plocState.angerLevel];
      if (plocState.angerLevel === 0) {
        const nextPreCount = plocState.preLevelClickCount + 1;
        if (nextPreCount > cfg.ignoredClicks) {
          const nextPct = Math.min(100, plocState.angerPercentage + cfg.percentPerClick);
          if (nextPct >= 100) {
            willLevelUp = true;
          }
          if (plocState.preLevelClickCount === cfg.ignoredClicks) {
            isWarningClick = true;
          }
        }
      } else {
        const nextPct = Math.min(100, plocState.angerPercentage + cfg.percentPerClick);
        if (nextPct >= 100) {
          willLevelUp = true;
        }
      }
    }

    if (isWarningClick && speak) {
      speak('Ei! Para que, fazê isso??', 3500);
    }

    // Tocar som de suspiro/clique se o clique for válido e NÃO for causar uma transição de nível
    if (plocState.angerLevel < 5 && !willLevelUp) {
      if (isWarningClick) {
        playCuteVocalSound('annoyed');
      } else if (plocState.angerLevel > 0 || plocState.preLevelClickCount >= 5) {
        playCuteVocalSound('sigh');
      }
    }

    setPlocState(prev => {
      const cfg = ANGER_LEVELS[prev.angerLevel];

      // === NIVEL 0: Logica especial ===
      if (prev.angerLevel === 0) {
        const newPreCount = prev.preLevelClickCount + 1;

        // Primeiros 5 cliques: silencio total, sem raiva
        if (newPreCount <= cfg.ignoredClicks) {
          return { ...prev, preLevelClickCount: newPreCount };
        }

        // A partir do 6o clique: adiciona 10% por clique
        const newPct = Math.min(100, prev.angerPercentage + cfg.percentPerClick);

        if (newPct >= 100) {
          // Entra no Nivel 1 - CHATEADO
          const nextCfg = ANGER_LEVELS[1];
          return {
            ...prev,
            angerLevel: 1,
            angerPercentage: 0,
            levelLockTimer: nextCfg.lockDuration,
            levelUnlockClicks: 0,
            preLevelClickCount: newPreCount,
            mode: 'active',
          };
        }

        return {
          ...prev,
          angerPercentage: parseFloat(newPct.toFixed(2)),
          preLevelClickCount: newPreCount,
        };
      }

      // === NIVEIS 1-4: Cada clique adiciona % diretamente (sem qualquer bloqueio de timer) ===
      const newPct = Math.min(100, prev.angerPercentage + cfg.percentPerClick);

      if (newPct >= 100) {
        const nextLevel = Math.min(prev.angerLevel + 1, 5);
        const nextCfg = ANGER_LEVELS[nextLevel];
        const isLvl5 = nextLevel === 5;

        return {
          ...prev,
          angerLevel: nextLevel,
          angerPercentage: 0,
          levelLockTimer: nextCfg.lockDuration,
          levelUnlockClicks: 0,
          mode: isLvl5 ? 'pissed' : nextLevel >= 3 ? 'stressing' : 'active',
        };
      }

      return {
        ...prev,
        angerPercentage: parseFloat(newPct.toFixed(2)),
      };
    });
  };

  // Incremento de raiva mantido para compatibilidade com EventBus
  const increaseAnger = (amount: number) => {
    handleAngerIncrement(amount);
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
    increaseAnger,
    isSleeping,
    isPissed,
    isStressing,
    ANGER_LEVELS,
  };
}


