/**
 * ============================================================================
 * Hook de Fala e Áudio - usePlocSpeech.ts
 * ============================================================================
 * Descrição: Provê a voz do mascote Ploc com suporte a Fila de Fala (Speech Queue)
 * global e reprodução sequencial sem interrupção de explicações.
 * ============================================================================
 */

import { useState, useRef, useEffect } from 'react';
import { config } from '@/lib/config';

let persistentAudio: HTMLAudioElement | null = null;
let hasUserInteracted = false;

if (typeof window !== 'undefined') {
  persistentAudio = new Audio();
  
  const handleInteraction = () => {
    hasUserInteracted = true;
    if (persistentAudio) {
      persistentAudio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
      persistentAudio.play().catch(() => {});
    }
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

// ── SISTEMA DE FILA E ESTADO GLOBAL DE REPRODUÇÃO DE FALA ──
interface QueueItem {
  text: string;
  duration: number;
  silent?: boolean;
}

const speechQueue: QueueItem[] = [];
let isQueueProcessing = false;
let activeAudio: HTMLAudioElement | null = null;
let currentSpeechTimeout: NodeJS.Timeout | null = null;
let globalIsSpeaking = false;
let globalSpeechText = '';
let globalIsSpeakingMouth = false;
let activeMouthTimeout: NodeJS.Timeout | null = null;

const stopActiveSpeech = () => {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.onplaying = null;
      activeAudio.onended = null;
      activeAudio.onerror = null;
    } catch (e) {}
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
  if (currentSpeechTimeout) {
    clearTimeout(currentSpeechTimeout);
    currentSpeechTimeout = null;
  }
  if (activeMouthTimeout) {
    clearTimeout(activeMouthTimeout);
    activeMouthTimeout = null;
  }
  globalIsSpeaking = false;
  globalIsSpeakingMouth = false;
  globalSpeechText = '';
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ploc_speech_finished'));
    window.dispatchEvent(new CustomEvent('ploc_speech_mouth_finished'));
  }
};

const playSpeechItem = (text: string, duration: number, onFinished: () => void, silent?: boolean) => {
  stopActiveSpeech();

  const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim();

  let fallbackTriggered = false;
  let playedOpenAI = false;

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ploc_speech_loading'));
  }

  const startVisualSpeech = (customDuration?: number) => {
    const finalDuration = customDuration || duration;
    globalSpeechText = cleanText;
    globalIsSpeaking = true;
    globalIsSpeakingMouth = true;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ploc_speech_started', { 
        detail: { text: cleanText, duration: finalDuration } 
      }));
      
      if (activeMouthTimeout) {
        clearTimeout(activeMouthTimeout);
      }
      const mouthDuration = Math.max(0, finalDuration - 200);
      activeMouthTimeout = setTimeout(() => {
        globalIsSpeakingMouth = false;
        window.dispatchEvent(new CustomEvent('ploc_speech_mouth_finished'));
      }, mouthDuration);
    }
    if (currentSpeechTimeout) {
      clearTimeout(currentSpeechTimeout);
    }
    currentSpeechTimeout = setTimeout(() => {
      onFinished();
    }, finalDuration);
  };

  const triggerFallback = () => {
    if (playedOpenAI || fallbackTriggered) return;
    fallbackTriggered = true;
 
    if (activeAudio) {
      try {
        activeAudio.pause();
      } catch (e) {}
      activeAudio = null;
    }
 
    startVisualSpeech();
  };

  if (cleanText && !silent) {
    try {
      const ttsUrl = `${config.api.baseUrl}/ai/tts?text=${encodeURIComponent(cleanText)}`;
      let audio: HTMLAudioElement;
      if (persistentAudio) {
        audio = persistentAudio;
        try {
          audio.pause();
        } catch (e) {}
        audio.src = ttsUrl;
        audio.load();
      } else {
        audio = new Audio(ttsUrl);
      }
      activeAudio = audio;
 
      const loadingTimeout = setTimeout(() => {
        if (!playedOpenAI && !fallbackTriggered) {
          console.warn('TTS OpenAI demorou muito para responder. Usando fallback silencioso.');
          triggerFallback();
        }
      }, 8000);
 
      audio.onplaying = () => {
        clearTimeout(loadingTimeout);
        if (fallbackTriggered) {
          try {
            audio.pause();
          } catch (e) {}
          return;
        }
        playedOpenAI = true;
        
        let audioDur = audio.duration;
        if (!audioDur || isNaN(audioDur) || !isFinite(audioDur)) {
          audioDur = duration / 1000;
        }
        startVisualSpeech(audioDur * 1000);
      };

      audio.onended = () => {
        audio.onplaying = null;
        audio.onended = null;
        audio.onerror = null;
        onFinished();
      };

      audio.onerror = () => {
        clearTimeout(loadingTimeout);
        audio.onplaying = null;
        audio.onended = null;
        audio.onerror = null;
        triggerFallback();
      };

      audio.play().catch((e) => {
        if (e.name === 'NotAllowedError') {
          clearTimeout(loadingTimeout);
          triggerFallback();
        }
      });
    } catch (err) {
      triggerFallback();
    }
  } else {
    startVisualSpeech();
  }
};

const processNextSpeech = () => {
  if (isQueueProcessing) return;
  if (speechQueue.length === 0) {
    isQueueProcessing = false;
    return;
  }

  isQueueProcessing = true;
  const nextItem = speechQueue[0];

  const onSpeechFinished = () => {
    speechQueue.shift();
    isQueueProcessing = false;
    window.dispatchEvent(new CustomEvent('ploc_speech_finished'));
    setTimeout(() => {
      processNextSpeech();
    }, 300); // 300ms de respiro entre falas sequenciais
  };

  playSpeechItem(nextItem.text, nextItem.duration, onSpeechFinished, nextItem.silent);
};

export function usePlocSpeech() {
  const [speechText, setSpeechText] = useState<string>(globalSpeechText);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(globalIsSpeaking);
  const [isSpeakingMouth, setIsSpeakingMouth] = useState<boolean>(globalIsSpeakingMouth);
  const [isTTSLoading, setIsTTSLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleLoading = () => {
      setIsTTSLoading(true);
    };

    const handleStarted = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsTTSLoading(false);
      setIsSpeaking(true);
      setIsSpeakingMouth(true);
      setSpeechText(customEvent.detail.text);
    };

    const handleFinished = () => {
      setIsTTSLoading(false);
      setIsSpeaking(false);
      setIsSpeakingMouth(false);
      setSpeechText('');
    };

    const handleMouthFinished = () => {
      setIsSpeakingMouth(false);
    };

    const handleMouthStartedInstant = () => {
      setIsSpeakingMouth(true);
    };

    window.addEventListener('ploc_speech_loading', handleLoading);
    window.addEventListener('ploc_speech_started', handleStarted);
    window.addEventListener('ploc_speech_finished', handleFinished);
    window.addEventListener('ploc_speech_mouth_finished', handleMouthFinished);
    window.addEventListener('ploc_speech_mouth_started_instant', handleMouthStartedInstant);

    return () => {
      window.removeEventListener('ploc_speech_loading', handleLoading);
      window.removeEventListener('ploc_speech_started', handleStarted);
      window.removeEventListener('ploc_speech_finished', handleFinished);
      window.removeEventListener('ploc_speech_mouth_finished', handleMouthFinished);
      window.removeEventListener('ploc_speech_mouth_started_instant', handleMouthStartedInstant);
    };
  }, []);

  const speak = (text: string, duration: number = 4000, options?: { queue?: boolean; silent?: boolean }) => {
    if (options?.queue) {
      speechQueue.push({ text, duration, silent: options?.silent });
      processNextSpeech();
    } else {
      speechQueue.length = 0;
      isQueueProcessing = false;
      playSpeechItem(text, duration, () => {
        window.dispatchEvent(new CustomEvent('ploc_speech_finished'));
      }, options?.silent);
    }
  };

  return {
    speak,
    speechText,
    isSpeaking,
    isTTSLoading,
    isSpeakingMouth,
  };
}
