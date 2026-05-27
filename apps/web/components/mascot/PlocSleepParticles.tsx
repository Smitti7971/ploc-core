/**
 * @module PlocSleepParticles
 * @description Efeito visual de partículas "Zzz" que sobem enquanto o mascote está dormindo.
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface SleepParticle {
  id: string;
  x: number;
  scale: number;
  text: string;
}

interface PlocSleepParticlesProps {
  isSleeping: boolean;
}

export function PlocSleepParticles({ isSleeping }: PlocSleepParticlesProps) {
  const [particles, setParticles] = useState<SleepParticle[]>([]);

  useEffect(() => {
    if (!isSleeping) {
      setParticles([]);
      return;
    }

    const interval = setInterval(() => {
      const id = Math.random().toString();
      const texts = ['z', 'Z'];
      setParticles(prev => [
        ...prev,
        {
          id,
          x: 45 + Math.random() * 25,
          scale: 0.8 + Math.random() * 0.8,
          text: texts[Math.floor(Math.random() * texts.length)]
        }
      ]);

      setTimeout(() => {
        setParticles(prev => prev.filter(z => z.id !== id));
      }, 3000);
    }, 1200);

    return () => clearInterval(interval);
  }, [isSleeping]);

  if (!isSleeping && particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[1000] overflow-visible">
      <AnimatePresence>
        {particles.map((z) => (
          <motion.span
            key={z.id}
            initial={{ opacity: 0, y: 10, scale: 0.4, x: `${z.x}%` }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: -95,
              x: [`${z.x}%`, `${z.x + 14}%`, `${z.x + 8}%`],
              scale: z.scale,
              color: ['#7dd3fc', '#ffffff', '#7dd3fc', '#ffffff', '#7dd3fc']
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.8, ease: 'easeOut' }}
            className="absolute font-black select-none"
            style={{
              fontFamily: 'Outfit, sans-serif',
              textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 10px rgba(255,255,255,0.4)',
              fontSize: '26px'
            }}
          >
            {z.text}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
