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
  const emotionRef = useRef(emotion);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    emotionRef.current = emotion;
  }, [emotion]);


  // Refs para rastrear a transição de estados e evitar duplicações
  // Refs para rastrear a transição de estados e evitar duplicações
  const prevModeRef = useRef<string>('active');
  const lastTriggeredTransitionRef = useRef<string>('');

  // Estado persistido do humor
  const [plocState, setPlocState] = useState<PlocState>({
    mode: 'active',
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

  // (Removido: Sincroniza persistência do nível de raiva e porcentagem)

  // 2. Hook de transição de estado unificado para efeitos sonoros/fala exatamente UMA vez
  useEffect(() => {
    if (!isMounted) {
      prevModeRef.current = plocState.mode;
      return;
    }

    const prevMode = prevModeRef.current;
    const currentMode = plocState.mode;
    prevModeRef.current = currentMode;

    // 1. Transições de Modo e Estado Emocional Geral (Sleeping -> Active / Dizzy)
    if (prevMode === 'sleeping' && currentMode !== 'sleeping') {
      if (speak) speak('Bom dia! O que temos para hoje?', 3000);
    }
  }, [plocState.mode, isMounted, speak]);

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
    isSleeping,
    isPissed,
    isStressing,
  };
}


