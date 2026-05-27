/**
 * @module PlocShockwaveRings
 * @description Efeito visual de ondas de choque (anéis) emitidos pelo mascote em certas interações.
 */

import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface Shockwave {
  id: string;
  type: 'up' | 'down';
  color: string;
}

interface PlocShockwaveRingsProps {
  setTransitionEffect: (effect: 'up' | 'down' | null) => void;
}

export function PlocShockwaveRings({ setTransitionEffect }: PlocShockwaveRingsProps) {
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([]);

  const triggerShockwave = (type: 'up' | 'down', color: string) => {
    const id = Math.random().toString();
    setShockwaves(prevWaves => [...prevWaves, { id, type, color }]);

    setTimeout(() => {
      setShockwaves(prevWaves => prevWaves.filter(w => w.id !== id));
    }, 900);

    setTransitionEffect(type);
    setTimeout(() => {
      setTransitionEffect(null);
    }, 800);
  };

  return (
    <AnimatePresence>
      {shockwaves.map(wave => (
        <motion.div
          key={wave.id}
          initial={{ scale: 0.6, opacity: 0.95 }}
          animate={{
            scale: wave.type === 'up' ? 2.5 : 2.2,
            opacity: 0,
            borderWidth: ['3px', '1px']
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            borderStyle: 'solid',
            borderColor: wave.color,
            boxShadow: wave.type === 'up'
              ? `0 0 20px ${wave.color}, inset 0 0 10px ${wave.color}`
              : `0 0 15px ${wave.color}, inset 0 0 8px ${wave.color}`,
            zIndex: 0
          }}
        />
      ))}
    </AnimatePresence>
  );
}
