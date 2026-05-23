/**
 * @module usePlocSpeechRecognition
 * @description Hook responsável por encapsular a lógica da Web Speech API para o mascote Ploc.
 * Permite que o usuário fale utilizando o microfone para interagir no chat.
 */

import { useState, useRef, useEffect } from 'react';

export function usePlocSpeechRecognition(handleSendMessage: (val: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const startListening = () => {
    if (typeof window === 'undefined') return;

    interface ISpeechRecognition {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      maxAlternatives: number;
      onstart: (() => void) | null;
      onresult: ((event: { results: { transcript: string }[][] }) => void) | null;
      onerror: ((event: { error: string }) => void) | null;
      onend: (() => void) | null;
      start: () => void;
      stop: () => void;
    }

    const win = window as unknown as Window & {
      SpeechRecognition?: new () => ISpeechRecognition;
      webkitSpeechRecognition?: new () => ISpeechRecognition;
    };

    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("O reconhecimento de voz não é suportado pelo seu navegador. Tente utilizar o Google Chrome!");
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = 'pt-BR';
      rec.continuous = false;
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onstart = () => setIsListening(true);
      rec.onresult = (event: { results: { transcript: string }[][] }) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) handleSendMessage(transcript);
      };
      rec.onerror = (event: { error: string }) => {
        console.error("Erro no reconhecimento de voz:", event.error);
        setIsListening(false);
      };
      rec.onend = () => setIsListening(false);

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { }
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) stopListening();
    else startListening();
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { }
      }
    };
  }, []);

  return { isListening, toggleListening, stopListening };
}
