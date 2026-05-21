/**
 * ============================================================================
 * Efeito Máquina de Escrever - TypewriterText.tsx
 * ============================================================================
 * Descrição: Componente visual de texto que simula o efeito de máquina de
 * escrever em tempo real para as mensagens faladas pelo mascote Ploc.
 * 
 * Principais responsabilidades:
 * - Renderiza o texto letra por letra com velocidade configurável (padrão: 25ms).
 * - Controla de forma segura a montagem, desmontagem e limpeza de timers as síncronos
 *   (intervalos) para prevenir vazamento de memória.
 * ============================================================================
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePlocSpeech } from './usePlocSpeech';

// 1. Componente dos três pontinhos pulsantes [ ... ] (Pensamento)
export function ThinkingDots() {
  return (
    <div className="flex justify-center gap-1.5 items-center h-[27px]">
      <motion.span
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
      />
      <motion.span
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
      />
      <motion.span
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
        className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
      />
    </div>
  );
}

// 2. Componente de Máquina de Escrever clássico (Texto digitado)
interface TypewriterTextProps {
  text: string;
  speed?: number;
}

export function TypewriterText({ text, speed: propSpeed }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const { isSpeakingMouth } = usePlocSpeech();
  const [speed, setSpeed] = useState(propSpeed || 25);

  // Mantém uma ref do estado da boca para pausar a digitação em silêncios sem reiniciar o efeito
  const isSpeakingMouthRef = useRef(isSpeakingMouth);
  useEffect(() => {
    isSpeakingMouthRef.current = isSpeakingMouth;
  }, [isSpeakingMouth]);

  // Calcula a velocidade de digitação em tempo real baseada na duração do áudio fornecida pelo evento
  useEffect(() => {
    if (!text) {
      setSpeed(propSpeed || 25);
      return;
    }

    const handleStarted = (e: Event) => {
      const customEvent = e as CustomEvent;
      const duration = customEvent.detail?.duration;
      if (duration && typeof duration === 'number' && duration > 0) {
        // Reservamos 500ms de buffer no final para garantir que o texto termine um pouco antes do áudio
        const calculatedSpeed = Math.max(10, Math.min(80, (duration - 500) / text.length));
        setSpeed(calculatedSpeed);
      }
    };

    window.addEventListener('ploc_speech_started', handleStarted);
    return () => {
      window.removeEventListener('ploc_speech_started', handleStarted);
    };
  }, [text, propSpeed]);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      return;
    }

    const chars = Array.from(text);
    let index = 0;
    setDisplayedText('');

    const interval = setInterval(() => {
      // Pausa a digitação se Ploc estiver em silêncio (boca fechada no áudio)
      // Permitimos digitar o primeiro e último caractere como salvaguarda
      if (!isSpeakingMouthRef.current && index > 0 && index < chars.length - 1) {
        return;
      }

      if (index < chars.length) {
        const char = chars[index];
        setDisplayedText((prev) => prev + char);
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className="inline-block text-center whitespace-pre-wrap">
      {displayedText}
    </span>
  );
}
