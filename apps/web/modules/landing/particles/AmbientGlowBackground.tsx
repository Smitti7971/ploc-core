'use client';

/**
 * ============================================================================
 * Fundo com Brilho Ambiente - AmbientGlowBackground.tsx
 * ============================================================================
 * Descrição: Efeito de luz ambiente de fundo (Glow) usando gradients radiais.
 * Anima lentamente para dar um aspecto vivo à atmosfera da Landing Page.
 * ============================================================================
 */import React from 'react';
import { motion } from 'framer-motion';
// Renderiza as esferas de luz que se movem sutilmente ao fundo
export const AmbientGlowBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-[10] pointer-events-none">
      {/* Bolha Superior Esquerda */}
      <motion.div
        animate={{
          x: [0, 150, -50, 0],
          y: [0, 80, 120, 0],
          scale: [1, 1.4, 0.8, 1],
          rotate: [0, 20, -20, 0]
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-[45%] blur-[100px] bg-[radial-gradient(circle,_rgba(56,189,248,0.07)_0%,_transparent_75%)] will-change-transform [transform:translateZ(0)]"
      />
      {/* Bolha Inferior Direita */}
      <motion.div
        animate={{
          x: [0, -120, 40, 0],
          y: [0, 150, -30, 0],
          scale: [1.3, 0.9, 1.5, 1.3],
          rotate: [0, -25, 25, 0]
        }}
        transition={{ duration: 50, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-25%] right-[-20%] w-[90%] h-[90%] rounded-[40%] blur-[120px] bg-[radial-gradient(circle,_rgba(3,105,161,0.1)_0%,_transparent_75%)] will-change-transform [transform:translateZ(0)]"
      />
    </div>
  );
};
