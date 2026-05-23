/**
 * @module PlocSpeechBubble
 * @description Componente visual responsável por renderizar o balão de fala do mascote Ploc.
 * Lida com o texto sendo digitado/falado gradualmente.
 */

// Este componente lida apenas com a exibição do texto digitado de forma fluída (balão de pensamento/fala), além da sombra e dos efeitos de digitação...")

import { motion, AnimatePresence } from 'framer-motion';
import { TypewriterText, ThinkingDots } from './TypewriterText';

interface PlocSpeechBubbleProps {
  currentSpokenText: string;
  isPending: boolean;
  isTTSLoading: boolean;
}

export function PlocSpeechBubble({
  currentSpokenText,
  isPending,
  isTTSLoading
}: PlocSpeechBubbleProps) {
  return (
    <AnimatePresence mode="wait">
      {(currentSpokenText || isPending || isTTSLoading) && (
        <div
          className="bg-slate-950/40 py-3 px-4 shadow-lg w-fit pointer-events-none text-center"
          style={{ borderRadius: '0px', border: 'none' }}
        >
          <motion.div
            key={isPending || isTTSLoading ? 'pending' : currentSpokenText}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="text-white text-[15.5px] font-medium leading-relaxed tracking-wide [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {isPending || isTTSLoading ? (
              <ThinkingDots />
            ) : (
              <TypewriterText text={currentSpokenText} />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
