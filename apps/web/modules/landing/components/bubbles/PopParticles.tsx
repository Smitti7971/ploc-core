'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Particle } from './types';

interface PopParticlesProps {
  particles: Particle[];
  particleColor: string;
}

export default function PopParticles({ particles, particleColor }: PopParticlesProps) {
  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: 0.1
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: particleColor,
            boxShadow: `0 0 6px ${particleColor}`,
            zIndex: p.size + 10
          }}
        />
      ))}
    </>
  );
}
