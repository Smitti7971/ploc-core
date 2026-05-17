import { useState, useRef, useEffect } from 'react';

export function usePlocSpeech() {
  const [speechText, setSpeechText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const speak = (text: string, duration: number = 4000) => {
    // Integração futura/opcional de voz falada (SpeechSynthesis) em pt-BR
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        // Remove emojis antes de ler o texto
        const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.1; // Fala um pouquinho mais rápido para ser ágil
        
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('SpeechSynthesis error:', e);
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
    };
  }, []);

  return {
    speak,
    speechText,
    isSpeaking,
  };
}
