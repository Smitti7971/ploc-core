'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
}

// Robust procedural popping sound using a globally-unlocked Web Audio API Context
let sharedAudioCtx: AudioContext | null = null;

if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass && !sharedAudioCtx) {
        sharedAudioCtx = new AudioContextClass();
        sharedAudioCtx.resume().catch(() => { });
      }
    } catch (e) { }
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('click', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
}

export const playPopSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContextClass();
    }
    const ctx = sharedAudioCtx;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => { });
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    const jitter = 0.95 + Math.random() * 0.15; // organic pitch variation

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140 * jitter, now);
    osc.frequency.exponentialRampToValueAtTime(800 * jitter, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(15, now + 0.12);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.20, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.start(now);
    osc.stop(now + 0.14);
  } catch (e) { }
};

interface TitleBubbleProps {
  letter: string;
  index: number;
  seqIndex: number;
  isPopped: boolean;
  onClick: () => void;
}

export default function TitleBubble({
  letter,
  index,
  seqIndex,
  isPopped,
  onClick
}: TitleBubbleProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isPopped) {
      playPopSound();
      const count = 10;
      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (i * 2 * Math.PI) / count + (Math.random() - 0.5) * 0.4;
        const speed = 45 + Math.random() * 45;
        newParticles.push({
          id: i,
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
          size: 3 + Math.random() * 3.5
        });
      }
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isPopped]);

  // Unique organic sway path per letter (simulating idle bubble selector physics)
  const swayY = [0, index % 2 === 0 ? -10 : -6, 0];
  const swayX = [0, index % 2 === 0 ? 6 : -6, 0];

  return (
    <div
      onClick={isPopped ? undefined : onClick}
      className={`relative w-[90px] h-[90px] select-none ${
        isPopped ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'
      }`}
      style={{ zIndex: 10 + seqIndex }}
    >
      <AnimatePresence>
        {!isPopped && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              scale: {
                type: 'spring',
                stiffness: 150,
                damping: 14,
                delay: 0.35 + seqIndex * 0.7,
              },
              opacity: {
                duration: 0.01,
                delay: 0.35 + seqIndex * 0.7,
              }
            }}
            exit={{
              scale: 1.2,
              opacity: 0,
              transition: { duration: 0.15, ease: "easeOut" }
            }}
            className="w-full h-full relative"
          >
            <motion.div
              animate={{
                y: swayY,
                x: swayX,
              }}
              transition={{
                y: { duration: 3.5 + index * 0.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 },
                x: { duration: 4.0 + index * 0.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }
              }}
              className="w-full h-full relative flex items-center justify-center pointer-events-none rounded-full backdrop-blur-md"
            >
              {/* The actual gelatinous bubble shell (Animates scale but has NO text inside to avoid distorting letters) */}
              <motion.div
                animate={{
                  scaleX: [1, 1.05, 0.95, 1.05, 1],
                  scaleY: [1, 0.95, 1.05, 0.95, 1],
                }}
                transition={{
                  duration: 3.0 + index * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-full border-[1.5px] border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_0_12px_rgba(255,255,255,0.18)] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25)_0%,rgba(255,255,255,0.12)_60%,rgba(255,255,255,0.04)_100%)]"
              >
                {/* Glass Specular Highlight */}
                <div className="absolute top-[8%] left-[8%] w-[38%] h-[38%] rounded-full bg-gradient-to-br from-white/60 to-transparent blur-[1px]"></div>
              </motion.div>

              {/* Suspended Letter with micro-sway inside (3D gray block depth for pure white marble feel) */}
              <motion.span
                animate={{ y: [-3, 3, -3], rotate: [-3, 3, -3] }}
                transition={{ duration: 2.2 + index * 0.3, repeat: Infinity, ease: "easeInOut" }}
                className="text-white/95 text-5xl font-black select-none z-10 font-outfit"
                style={{
                  textShadow: '0 2px 0 #d4d4d8, 0 4px 0 #a1a1aa, 0 6px 10px rgba(0, 0, 0, 0.35)'
                }}
              >
                {letter}
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sparkling Pop Particles (Exploding cleanly from the exact center of sway coords) */}
      {isPopped && particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: 0.1
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 0 10px rgba(56, 189, 248, 0.8), 0 0 4px rgba(255, 255, 255, 1)',
            zIndex: 9999
          }}
        />
      ))}
    </div>
  );
}
