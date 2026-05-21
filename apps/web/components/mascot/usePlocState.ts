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
  const lastRapidClickTimeRef = useRef<number>(0);
  const rapidClickCountRef = useRef<number>(0);
  const isWarningRef = useRef<boolean>(false);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      speak("pare de me jogar de um lado para o outro! ", 1500);
    }
    setTimeout(() => {
      setPlocState(prev => ({ ...prev, isHurt: false }));
    }, 1500);
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

  // Configuração dos Níveis de Irritação (Cabo de Guerra)
  const ANGER_LEVELS = [
    { label: 'Normal', clicksNeeded: 15, duration: 0 },            // Level 0
    { label: 'Indiferente', clicksNeeded: 30, duration: 60 },       // Level 1
    { label: 'Se Irritando', clicksNeeded: 45, duration: 90 },      // Level 2
    { label: 'Irritado', clicksNeeded: 60, duration: 120 },         // Level 3
    { label: 'Se Enfurecendo', clicksNeeded: 90, duration: 180 },   // Level 4
    { label: 'Enfurecido (Imune)', clicksNeeded: 0, duration: 300 } // Level 5
  ];

  const lastClickTimeRef = useRef<number>(Date.now());
  const tickCounterRef = useRef<number>(0);

  // Escuta incremento externo de irritação (ex: bolhas ou erros de rotina)
  const increaseAnger = (amount: number) => {
    setPlocState(prev => {
      if (prev.mode === 'sleeping') return prev;
      if (prev.angerLevel === 5) return prev; // Imune!

      let newLevel = prev.angerLevel;
      let newClicks = prev.angerClicks + amount;
      let currentMax = ANGER_LEVELS[newLevel].clicksNeeded;

      while (newLevel < 5 && newClicks >= currentMax) {
        newLevel += 1;
        if (newLevel < 5) {
          currentMax = ANGER_LEVELS[newLevel].clicksNeeded;
          newClicks = currentMax * 0.5; // Inicia em 50% do novo nível!
        } else {
          newClicks = 0;
        }
      }

      const isLvl5 = newLevel === 5;
      if (isLvl5) {
        newClicks = 0;
        playCuteVocalSound('annoyed');
        if (speak) {
          speak("AI! Essa doeu! Fiquei enfurecido agora! 😡 Não vou cooperar por 5 minutos!", 5000);
        }
        triggerAchievementUnlock('tornado_vermelho');
      } else {
        playCuteVocalSound('annoyed');
      }

      localStorage.setItem('ploc_anger_level', newLevel.toString());
      localStorage.setItem('ploc_anger_clicks', newClicks.toFixed(3));

      return {
        ...prev,
        angerLevel: newLevel,
        angerClicks: parseFloat(newClicks.toFixed(3)),
        angerTimer: ANGER_LEVELS[newLevel].duration,
        mode: isLvl5 ? 'pissed' : newLevel >= 2 ? 'stressing' : 'active'
      };
    });
  };

  // Registrar escuta do EventBus para o incremento de raiva
  useEffect(() => {
    const unsubAnger = blackboardEventBus.subscribe('PLOC_ANGER_INCREASE', (data) => {
      if (data && typeof data.amount === 'number') {
        increaseAnger(data.amount);
      }
    });
    return () => unsubAnger();
  }, [plocState.angerLevel]);

  // Loop principal de tempo: Ticks de 100ms para decaimento e timer de níveis
  useEffect(() => {
    if (!isMounted) return;

    const interval = setInterval(() => {
      tickCounterRef.current += 1;
      const isOneSecond = tickCounterRef.current % 10 === 0;

      setPlocState(prev => {
        if (prev.mode === 'sleeping') return prev;

        let nextLevel = prev.angerLevel;
        let nextClicks = prev.angerClicks;
        let nextTimer = prev.angerTimer || 0;
        let nextMode = prev.mode;

        // 1. Contador de segundos para expiração de estados (Apenas Lvl 5 Imune)
        if (nextLevel === 5 && isOneSecond) {
          nextTimer = Math.max(0, nextTimer - 1);
          if (nextTimer <= 0) {
            // Expira e volta ao normal
            localStorage.setItem('ploc_anger_level', '0');
            localStorage.setItem('ploc_anger_clicks', '0');
            if (speak) {
              speak("Ufa... me acalmei. Por favor, não me perturbe! 😌", 4000);
            }
            return {
              ...prev,
              angerLevel: 0,
              angerClicks: 0,
              angerTimer: 0,
              mode: 'active'
            };
          }
        }

        // 2. Cabo de Guerra - Decaimento de Cliques (Apenas se não for Lvl 5 Imune)
        if (nextLevel >= 0 && nextLevel < 5) {
          const timeSinceLastClick = Date.now() - lastClickTimeRef.current;
          if (timeSinceLastClick > 1000) {
            // Decai muito mais rápido no Nível 0 (em 5 segundos: 0.3 cliques por tick)!
            const decayRate = nextLevel === 0 ? 0.3 : 0.025;
            nextClicks = Math.max(0, nextClicks - decayRate);

            if (nextClicks <= 0) {
              // Quando os cliques chegam a 0, volta diretamente ao normal (Level 0)
              nextLevel = 0;
              nextClicks = 0;
              nextTimer = 0;
              nextMode = 'active';
            }

            localStorage.setItem('ploc_anger_level', nextLevel.toString());
            localStorage.setItem('ploc_anger_clicks', nextClicks.toFixed(3));
          }
        }

        return {
          ...prev,
          angerLevel: nextLevel,
          angerClicks: parseFloat(nextClicks.toFixed(3)),
          angerTimer: nextTimer,
          mode: nextLevel === 5 ? 'pissed' : nextLevel >= 2 ? 'stressing' : nextMode
        };
      });
    }, 100);

    return () => {
      clearInterval(interval);
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [isMounted, speak]);

  // Lê localStorage e inicializa humor/modo sono na montagem
  useEffect(() => {
    const savedLevel = parseInt(localStorage.getItem('ploc_anger_level') || '0');
    const savedClicks = parseFloat(localStorage.getItem('ploc_anger_clicks') || '0');

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
      mode: isSleepTime ? 'sleeping' : savedLevel === 5 ? 'pissed' : savedLevel >= 2 ? 'stressing' : 'active',
      angerLevel: savedLevel,
      angerClicks: savedClicks,
      angerTimer: ANGER_LEVELS[savedLevel].duration,
      isHurt: false,
    });

    // Se estiver no horário de sono e entrar no app pela primeira vez na sessão
    if (isSleepTime && typeof window !== 'undefined' && !sessionStorage.getItem('ploc_sleep_warned')) {
      sessionStorage.setItem('ploc_sleep_warned', 'true');

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

    // Mini game de irritação (Cabo de Guerra Click Event)
    if (plocState.angerLevel === 5) {
      // Imune a cliques! Fala fúria
      playCuteVocalSound('annoyed');
      if (speak) {
        speak(`Tô enfurecido! Não me toque por mais ${plocState.angerTimer || 0}s! 😡`, 3000);
      }
      return;
    }

    lastClickTimeRef.current = Date.now();

    // Se estiver no Nível 0, verifica cliques e aviso de raiva
    if (plocState.angerLevel === 0) {
      const nextClicks = plocState.angerClicks + 1;

      // Se atingir ou passar de 14 cliques, entra na lógica de aviso/confirmação
      if (nextClicks >= 5) {
        if (!isWarningRef.current) {
          isWarningRef.current = true;
          playCuteVocalSound('annoyed');
          if (speak) {
            speak("Mania besta de ficar tocando nos outros! Pare com isso!", 3500);
          }

          setPlocState(prev => {
            localStorage.setItem('ploc_anger_clicks', '14');
            return {
              ...prev,
              angerClicks: 14,
              mode: 'stressing'
            };
          });

          if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);

          warningTimeoutRef.current = setTimeout(() => {
            isWarningRef.current = false;
            warningTimeoutRef.current = null;
            setPlocState(prev => ({ ...prev, mode: 'active' }));
            if (speak) {
              speak("Ufa, ainda bem que você parou! 😌", 2500);
            }
          }, 3500);

          return;
        } else {
          // Clique de confirmação durante o aviso! Vai para o level 1
          if (warningTimeoutRef.current) {
            clearTimeout(warningTimeoutRef.current);
            warningTimeoutRef.current = null;
          }
          isWarningRef.current = false;

          playCuteVocalSound('annoyed');
          if (speak) {
            speak("Essa sua mania de ficar cutucando as coisas, nào te levam a lugar algum, já pensou em ser menos irritante? ! ", 3000);
          }
          triggerAchievementUnlock('paciencia_jo');

          setPlocState(prev => {
            const initClicks = ANGER_LEVELS[1].clicksNeeded * 0.5; // Inicia em 50% de 30 = 15!
            localStorage.setItem('ploc_anger_level', '1');
            localStorage.setItem('ploc_anger_clicks', initClicks.toString());
            return {
              ...prev,
              angerLevel: 1,
              angerClicks: initClicks,
              angerTimer: ANGER_LEVELS[1].duration,
              mode: 'active'
            };
          });
          return;
        }
      }

      // Se for cliques menores que 14, aumenta os cliques normalmente e exibe reação normal
      playCuteVocalSound('sigh');
      setPlocState(prev => {
        localStorage.setItem('ploc_anger_clicks', nextClicks.toString());
        return {
          ...prev,
          angerClicks: nextClicks,
          mode: 'active'
        };
      });
      return;
    }

    setPlocState(prev => {
      const nextClicks = prev.angerClicks + 1;
      const currentConfig = ANGER_LEVELS[prev.angerLevel];

      localStorage.setItem('ploc_anger_clicks', nextClicks.toString());

      if (nextClicks >= currentConfig.clicksNeeded) {
        const nextLevel = Math.min(prev.angerLevel + 1, 5);
        localStorage.setItem('ploc_anger_level', nextLevel.toString());

        const isLvl5 = nextLevel === 5;
        const nextLevelClicks = isLvl5 ? 0 : ANGER_LEVELS[nextLevel].clicksNeeded * 0.5; // Inicia em 50%
        localStorage.setItem('ploc_anger_clicks', nextLevelClicks.toString());

        if (isLvl5) {
          playCuteVocalSound('annoyed');
          if (speak) {
            speak("CHEGA! Você passou de todos os limites! Não falo com você por 5 minutos! 😡", 5000);
          }
          triggerAchievementUnlock('tornado_vermelho');
        } else {
          playCuteVocalSound('annoyed');
        }

        return {
          ...prev,
          mode: isLvl5 ? 'pissed' : nextLevel >= 2 ? 'stressing' : 'active',
          angerLevel: nextLevel,
          angerClicks: nextLevelClicks,
          angerTimer: ANGER_LEVELS[nextLevel].duration
        };
      }

      return {
        ...prev,
        angerClicks: nextClicks,
        angerTimer: currentConfig.duration, // Restabelece timer ao ser clicado
        mode: prev.angerLevel >= 2 ? 'stressing' : 'active'
      };
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
    increaseAnger,
    isSleeping,
    isPissed,
    isStressing,
    ANGER_LEVELS,
  };
}


