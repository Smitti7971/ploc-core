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
import { usePlocSpeech } from '@/modules/chat/hooks/usePlocSpeech';
import './typewriter.css';

// 1. Componente dos três pontinhos pulsantes [ ... ] (Pensamento)
export function ThinkingDots() {
  return (
    <div className="flex justify-center gap-1.5 items-center h-[27px]">
      <span
        
        
        className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
      />
      <span
        
        
        className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
      />
      <span
        
        
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
  const [speed, setSpeed] = useState(propSpeed || 25);
  const speedRef = useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

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
        // Reservamos 400ms de buffer no final para garantir que o texto termine antes do áudio
        const calculatedSpeed = Math.max(10, Math.min(80, (duration - 400) / text.length));
        setSpeed(calculatedSpeed);
      }
    };

    window.addEventListener('ploc_speech_started', handleStarted);
    return () => {
      window.removeEventListener('ploc_speech_started', handleStarted);
    };
  }, [text, propSpeed]);

  useEffect(() => {
    let isCurrent = true;
    if (!text) {
      setDisplayedText('');
      return;
    }

    const chars = Array.from(text);
    let index = 0;
    setDisplayedText('');
    let timeoutId: NodeJS.Timeout;

    const typeNext = () => {
      if (!isCurrent) return;
      if (index < chars.length) {
        const char = chars[index];
        setDisplayedText((prev) => prev + char);
        index++;
        timeoutId = setTimeout(typeNext, speedRef.current);
      }
    };

    timeoutId = setTimeout(typeNext, speedRef.current);
    return () => {
      isCurrent = false;
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <span className="inline-block text-center whitespace-pre-wrap typewriter">
      {displayedText}
    </span>
  );
}
