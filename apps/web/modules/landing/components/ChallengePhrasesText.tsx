'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHALLENGE_PHRASES } from '@/modules/landing/constants/phrases';

interface ChallengePhrasesTextProps {
  phraseIndex: number;
}

const GRADIENT_MAP = {
  blue: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
  emerald: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
  gold: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
  violet: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)'
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
        className="m-0 font-black text-[rgba(255,255,255,0.9)] tracking-[-2px] leading-none uppercase max-w-[850px] px-6 inline-block"
        style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(2.2rem, 6.5vw, 4.2rem)',
          textShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}
      >
        {parts.length > 1 ? (
          <>
            <span>{parts[0]}</span>
            <span
              className="inline-block"
              style={{
                background: GRADIENT_MAP[phrase.color as keyof typeof GRADIENT_MAP] || GRADIENT_MAP.blue,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
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
