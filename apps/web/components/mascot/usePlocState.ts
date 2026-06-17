/**
 * ============================================================================
 * Hook de Física e Estado Físico - usePlocState.ts
 * ============================================================================
 * Descrição: Centraliza o estado base do mascote (humor, sono) e as interações.
 * Limpo de antigas físicas de colisão, Web Audio e arraste.
 * ============================================================================
 */

import { useState, useEffect, useRef } from 'react';
import { PlocState } from './types';
import { RoutineOption } from '@/modules/routines/data/routinesData';

interface UsePlocStateOptions {
  emotion?: string;
  speak?: (text: string, duration?: number) => void;
  isSpeaking?: boolean;
}

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

  const prevModeRef = useRef<string>('active');

  const [plocState, setPlocState] = useState<PlocState>({
    mode: 'active',
  });

  const [focusedRoutine, setFocusedRoutine] = useState<RoutineOption | null>(null);
  const [focusedPillar, setFocusedPillar] = useState<string | null>(null);
  const [showSimulation, setShowSimulation] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      prevModeRef.current = plocState.mode;
      return;
    }

    const prevMode = prevModeRef.current;
    const currentMode = plocState.mode;
    prevModeRef.current = currentMode;

    if (prevMode === 'sleeping' && currentMode !== 'sleeping') {
      if (speak) speak('Bom dia! O que temos para hoje?', 3000);
    }
  }, [plocState.mode, isMounted, speak]);

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
    containerRef,
    isSleeping,
    isPissed,
    isStressing,
  };
}
