'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHALLENGE_PHRASES } from '@/modules/landing/constants/phrases';

interface ChallengePhrasesTextProps {
  phraseIndex: number;
}

const TAILWIND_GRADIENTS = {
  blue: 'bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent',
  emerald: 'bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent',
  gold: 'bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent',
  violet: 'bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent'
};

export default function ChallengePhrasesText({ phraseIndex }: ChallengePhrasesTextProps) {
  const phrase = CHALLENGE_PHRASES[phraseIndex];
  if (!phrase) return null;

  const parts = phrase.text.split(phrase.highlight);

  return (
    <AnimatePresence mode="wait">
      <motion.h1
        key={phraseIndex}
        initial={{ opacity: 0, y: 30, filter: 'blur(15px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -30, filter: 'blur(15px)' }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="m-0 font-black text-white/90 tracking-[-2px] leading-none uppercase max-w-[850px] px-6 inline-block font-outfit text-[clamp(2.2rem,6.5vw,4.2rem)] drop-shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
      >
        {parts.length > 1 ? (
          <>
            <span>{parts[0]}</span>
            <span
              className={`inline-block ${TAILWIND_GRADIENTS[phrase.color as keyof typeof TAILWIND_GRADIENTS] || TAILWIND_GRADIENTS.blue}`}
            >
              {phrase.highlight}
            </span>
            <span>{parts[1]}</span>
          </>
        ) : (
          <span>{phrase.text}</span>
        )}
      </motion.h1>
    </AnimatePresence>
  );
}
