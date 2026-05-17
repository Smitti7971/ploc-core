import { useState, useRef, useEffect } from 'react';
import { config } from '@/lib/config';

let hasUserInteracted = false;
if (typeof window !== 'undefined') {
  const handleInteraction = () => {
    hasUserInteracted = true;
    window.removeEventListener('pointerdown', handleInteraction, true);
    window.removeEventListener('keydown', handleInteraction, true);
  };
  window.addEventListener('pointerdown', handleInteraction, true);
  window.addEventListener('keydown', handleInteraction, true);
}

export function getHasUserInteracted() {
  if (typeof window === 'undefined') return false;
  if (hasUserInteracted) return true;
  if (typeof navigator !== 'undefined' && (navigator as any).userActivation) {
    return (navigator as any).userActivation.hasBeenActive;
  }
  return false;
}

export function usePlocSpeech() {
  const [speechText, setSpeechText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Fallback robusto usando a API nativa de SpeechSynthesis do navegador
  const fallbackSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && getHasUserInteracted()) {
      try {
        const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.15; // Velocidade ligeiramente maior para ficar fofo e ágil
        
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('SpeechSynthesis fallback error:', e);
      }
    }
  };

  const speak = (text: string, duration: number = 4000) => {
    // Para qualquer áudio ativo para evitar sobreposição
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      } catch (e) {}
    }

    // Limpa emojis e símbolos não verbais
    const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim();

    if (cleanText && getHasUserInteracted()) {
      try {
        // Tenta reproduzir o áudio ultra-realista da OpenAI via rota de streaming do backend
        const ttsUrl = `${config.api.baseUrl}/ai/tts?text=${encodeURIComponent(cleanText)}`;
        const audio = new Audio(ttsUrl);
        currentAudioRef.current = audio;
        
        audio.play().catch((e) => {
          console.warn('Erro de reprodução de áudio OpenAI, aplicando fallback de fala nativa:', e);
          fallbackSpeak(text);
        });
      } catch (err) {
        fallbackSpeak(text);
      }
    }

    setSpeechText(text);
    setIsSpeaking(true);

    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }

    speechTimeoutRef.current = setTimeout(() => {
      setIsSpeaking(false);
      setSpeechText('');
    }, duration);
  };

  useEffect(() => {
    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      if (currentAudioRef.current) {
        try {
          currentAudioRef.current.pause();
        } catch (e) {}
      }
    };
  }, []);

  return {
    speak,
    speechText,
    isSpeaking,
  };
}
