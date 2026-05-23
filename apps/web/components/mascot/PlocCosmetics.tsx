/**
 * @module PlocCosmetics
 * @description Componentes visuais de customização do Ploc: roupas, chapéus, cabelos e auras.
 */

import { motion } from 'framer-motion';

export function PlocAura({ aura }: { aura: string }) {
  if (aura === 'none') return null;

  switch (aura) {
    case 'success':
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="absolute w-[200px] h-[200px] rounded-full bg-amber-400/20 blur-2xl mix-blend-screen"
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-[220px] h-[220px] rounded-full border border-amber-400/30 blur-sm mix-blend-screen"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      );
    case 'disaster':
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="absolute w-[200px] h-[200px] rounded-full bg-fuchsia-900/30 blur-2xl mix-blend-screen"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-[180px] h-[180px] rounded-full border-2 border-dashed border-fuchsia-600/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      );
    case 'fire':
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="absolute w-[210px] h-[210px] rounded-full bg-rose-500/20 blur-3xl mix-blend-screen"
            animate={{ y: [0, -12, 0], scaleX: [1, 1.1, 1], scaleY: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      );
    case 'rage':
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
          {/* Intense Crimson Core Glow */}
          <motion.div
            className="absolute w-[220px] h-[220px] rounded-full bg-red-800/40 blur-3xl mix-blend-screen"
            animate={{ scale: [1, 1.3, 0.95, 1.2, 1], opacity: [0.6, 0.9, 0.5, 0.85, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Outer Fiery Wave */}
          <motion.div
            className="absolute w-[240px] h-[240px] rounded-full bg-rose-600/25 blur-2xl mix-blend-screen"
            animate={{ y: [2, -10, 2], scaleX: [1, 1.15, 0.95, 1.1, 1], scaleY: [1, 1.25, 0.9, 1.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Angry Sparks/Embers shooting out */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => (
            <motion.div
              key={`rage-particle-${idx}`}
              className="absolute w-2 h-2.5 bg-red-500 rounded-full blur-[0.5px]"
              style={{ boxShadow: '0 0 8px #dc2626' }}
              animate={{
                x: [0, Math.cos(angle * Math.PI / 180) * 130],
                y: [0, Math.sin(angle * Math.PI / 180) * 130 - 25],
                opacity: [1, 0.8, 0],
                scale: [0.8, 1.6, 0]
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: idx * 0.1,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>
      );
    case 'star':
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <motion.div
              key={`star-particle-${idx}`}
              className="absolute w-2 h-2 bg-sky-300 rounded-full blur-[1px]"
              animate={{
                x: [0, Math.cos(angle * Math.PI / 180) * 110],
                y: [0, Math.sin(angle * Math.PI / 180) * 110],
                opacity: [1, 0],
                scale: [0.8, 1.4, 0]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: idx * 0.2,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>
      );
    default:
      return null;
  }
}

export function PlocHair({ hair }: { hair: string }) {
  if (hair === 'none') return null;
  switch (hair) {
    case 'pompadour':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 60" fill="none" className="overflow-visible">
          <path
            d="M 12 50 C 4 35, 18 10, 50 15 C 72 18, 86 28, 88 50 C 88 50, 68 40, 50 48 C 32 56, 18 52, 12 50 Z"
            fill="#1e1b4b"
            stroke="#312e81"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'spiky':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 50" fill="none" className="overflow-visible">
          <path
            d="M 8 46 L 24 16 L 36 34 L 50 8 L 64 34 L 76 16 L 92 46 Z"
            fill="#090d16"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'afro':
      return (
        <svg width="105%" height="105%" viewBox="0 0 100 70" fill="none" className="overflow-visible">
          <ellipse cx="50" cy="40" rx="36" ry="26" fill="#180c05" />
          <ellipse cx="26" cy="46" rx="22" ry="18" fill="#180c05" />
          <ellipse cx="74" cy="46" rx="22" ry="18" fill="#180c05" />
          <ellipse cx="50" cy="22" rx="26" ry="20" fill="#180c05" />
        </svg>
      );
    case 'curls':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 50" fill="none" className="overflow-visible">
          <circle cx="25" cy="30" r="12" fill="#d97706" />
          <circle cx="40" cy="20" r="13" fill="#d97706" />
          <circle cx="60" cy="20" r="13" fill="#d97706" />
          <circle cx="75" cy="30" r="12" fill="#d97706" />
        </svg>
      );
    case 'bangs':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 45" fill="none" className="overflow-visible">
          <path
            d="M 12 40 Q 50 12 88 40 Q 72 26 50 40 Q 28 26 12 40 Z"
            fill="#a21caf"
            stroke="#701a75"
            strokeWidth="2.5"
          />
        </svg>
      );
    default:
      return null;
  }
}

export function PlocHat({ hat }: { hat: string }) {
  if (hat === 'none') return null;
  switch (hat) {
    case 'cap':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 50" fill="none" className="overflow-visible">
          <path d="M 22 42 C 22 18, 78 18, 78 42 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="2.5" />
          {/* Visor */}
          <path d="M 16 38 Q 4 48 30 46" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
          <circle cx="50" cy="24" r="4.5" fill="#ffffff" />
        </svg>
      );
    case 'tophat':
      return (
        <svg width="90%" height="90%" viewBox="0 0 90 70" fill="none" className="overflow-visible">
          {/* Crown */}
          <path d="M 22 50 L 26 10 L 64 10 L 68 50 Z" fill="#111827" stroke="#1f2937" strokeWidth="2" />
          {/* Band */}
          <rect x="23.5" y="42" width="43" height="8" fill="#e11d48" />
          {/* Brim */}
          <ellipse cx="45" cy="52" rx="36" ry="6" fill="#030712" />
        </svg>
      );
    case 'crown':
      return (
        <svg width="80%" height="80%" viewBox="0 0 80 50" fill="none" className="overflow-visible">
          <path
            d="M 8 42 L 12 10 L 28 26 L 40 5 L 52 26 L 68 10 L 72 42 Z"
            fill="#f59e0b"
            stroke="#b45309"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Jewels */}
          <circle cx="40" cy="5" r="4" fill="#ef4444" />
          <circle cx="12" cy="10" r="3" fill="#3b82f6" />
          <circle cx="68" cy="10" r="3" fill="#3b82f6" />
          <rect x="25" y="32" width="6" height="6" fill="#10b981" transform="rotate(45 28 35)" />
          <rect x="49" y="32" width="6" height="6" fill="#10b981" transform="rotate(45 52 35)" />
        </svg>
      );
    case 'beanie':
      return (
        <svg width="90%" height="90%" viewBox="0 0 90 45" fill="none" className="overflow-visible">
          <path d="M 12 40 C 12 15, 78 15, 78 40 Z" fill="#10b981" />
          <rect x="10" y="34" width="70" height="8" rx="4" fill="#047857" />
          {/* Pom pom */}
          <circle cx="45" cy="15" r="7" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1.5" />
        </svg>
      );
    case 'horns':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 50" fill="none" className="overflow-visible">
          <path d="M 22 36 Q 10 24 6 8 Q 18 20 28 32 Z" fill="#ef4444" />
          <path d="M 78 36 Q 90 24 94 8 Q 82 20 72 32 Z" fill="#ef4444" />
        </svg>
      );
    default:
      return null;
  }
}

export function PlocClothes({ clothes }: { clothes: string }) {
  if (clothes === 'none') return null;
  switch (clothes) {
    case 'hoodie':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 55" fill="none" className="overflow-visible">
          <path
            d="M 10 50 C 10 20, 90 20, 90 50 Z"
            fill="#06b6d4"
            stroke="#0891b2"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Strings */}
          <path d="M 44 26 L 40 42 M 56 26 L 60 42" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'suit':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 55" fill="none" className="overflow-visible">
          {/* Jacket */}
          <path d="M 10 50 C 10 20, 90 20, 90 50 Z" fill="#0f172a" />
          {/* White shirt triangle */}
          <path d="M 38 18 L 50 38 L 62 18 Z" fill="#ffffff" />
          {/* Bowtie */}
          <path d="M 42 22 L 58 28 L 58 22 M 58 22 L 42 28 L 42 22 Z" fill="#ef4444" />
        </svg>
      );
    case 'cape':
      return (
        <svg width="120%" height="120%" viewBox="0 0 120 70" fill="none" className="overflow-visible opacity-90 mix-blend-screen">
          <path
            d="M 10 60 C 20 20, 100 20, 110 60 C 120 65, 80 50, 60 62 C 40 50, 0 65, 10 60 Z"
            fill="#e11d48"
            stroke="#be123c"
            strokeWidth="2.5"
          />
        </svg>
      );
    case 'armor':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 55" fill="none" className="overflow-visible">
          <path
            d="M 10 50 C 10 20, 90 20, 90 50 Z"
            fill="#94a3b8"
            stroke="#475569"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <rect x="36" y="24" width="28" height="22" rx="4" fill="#334155" />
          <circle cx="50" cy="35" r="4.5" fill="#f59e0b" />
        </svg>
      );
    default:
      return null;
  }
}
