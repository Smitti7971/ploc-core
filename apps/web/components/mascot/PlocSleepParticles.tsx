/**
 * @module PlocSleepParticles
 * @description Efeito visual de partículas "Zzz" que sobem enquanto o mascote está dormindo.
 */

import { AnimatePresence, motion } from 'framer-motion';

export interface SleepParticle {
  id: string;
  x: number;
  scale: number;
  text: string;
}

interface PlocSleepParticlesProps {
  isSleeping: boolean;
  particles: SleepParticle[];
}

export function PlocSleepParticles({ isSleeping, particles }: PlocSleepParticlesProps) {
  if (!isSleeping) return null;

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
