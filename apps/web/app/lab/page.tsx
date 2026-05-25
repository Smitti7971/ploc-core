'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FPSMeter } from '@/components/ui/FPSMeter';

export default function LabPage() {
  const router = useRouter();
  const [count, setCount] = useState(1);
  const [variant, setVariant] = useState(0);

  // Limpa qualquer resquício de overflow: auto deixado por hot reloads anteriores
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    return () => {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    };
  }, []);

  const variants = [
    { name: 'V1: Original', Component: BubbleOriginal },
    { name: 'V2: Estática', Component: BubbleGPU },
    { name: 'V3: SVG Gooey', Component: BubbleSVG }
  ];

  const CurrentComponent = variants[variant].Component;

  return (
    <div className="h-[100dvh] w-full bg-[#020617] text-white flex flex-col relative overflow-hidden">
      
      {/* HUD - Floating Controls - Respecting Auth Capsule (pt-20) */}
      <div className="absolute top-[80px] left-0 right-0 px-4 z-50 pointer-events-none flex justify-between items-center gap-2">
        
        {/* Left: Variant Picker */}
        <div className="flex items-center bg-[#020617]/80 backdrop-blur-md rounded-full border border-white/10 shadow-lg p-1 pointer-events-auto">
          <button onClick={() => setVariant((prev) => (prev - 1 + variants.length) % variants.length)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full active:scale-95 transition-all text-sm font-bold">←</button>
          <div className="text-center px-2 min-w-[90px]">
            <span className="font-bold text-xs text-emerald-400 whitespace-nowrap">{variants[variant].name}</span>
          </div>
          <button onClick={() => setVariant((prev) => (prev + 1) % variants.length)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full active:scale-95 transition-all text-sm font-bold">→</button>
        </div>

        {/* Center: Visor de FPS */}
        <FPSMeter />

        {/* Right: Counter */}
        <div className="flex items-center bg-[#020617]/80 backdrop-blur-md rounded-full border border-white/10 shadow-lg p-1 pointer-events-auto">
          <button onClick={() => setCount(c => Math.max(0, c - 1))} className="w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20 active:scale-95 transition-all">
            <Minus size={14} />
          </button>
          <div className="text-center min-w-[32px]">
            <span className="text-sm font-black">{count}</span>
          </div>
          <button onClick={() => setCount(c => c + 1)} className="w-8 h-8 flex items-center justify-center bg-emerald-500/10 text-emerald-400 rounded-full hover:bg-emerald-500/20 active:scale-95 transition-all">
            <Plus size={14} />
          </button>
        </div>

      </div>

      {/* ÁREA DE ROLAGEM INTERNA */}
      <div className="flex-1 mt-[140px] mb-6 overflow-y-auto touch-pan-y px-4 relative">
        {/* THE RING (Arena) */}
        <div className="relative min-h-[1000px] w-full border-2 border-dashed border-white/20 rounded-3xl bg-white/5 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="absolute top-4 left-4 text-white/10 font-black text-xl uppercase tracking-widest pointer-events-none">
            Ringue
          </div>
          
          {/* Bubbles Container */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            {Array.from({ length: count }).map((_, i) => (
              <CurrentComponent key={i} index={i} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Filtro SVG para Gooey Effect escondido no DOM */}
      <svg className="hidden">
        <defs>
          <filter id="gooey-lab">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="gooey" />
            <feBlend in="SourceGraphic" in2="gooey" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

const color = '#38bdf8'; // Azul

// Função auxiliar para gerar movimentos parecidos com o dashboard
function getRandomPath(index: number) {
  const startX = (index % 5) * 50 - 100;
  const startY = (index % 4) * 50 - 100;
  const x1 = startX + 150 + (index * 10 % 50);
  const x2 = startX - 100 - (index * 5 % 30);
  const y1 = startY - 150 - (index * 15 % 40);
  const y2 = startY + 120 + (index * 8 % 40);
  return { startX, startY, x1, x2, y1, y2 };
}

// Variante 1: Original pesada (borderRadius loop + backdrop-filter blur)
function BubbleOriginal({ index }: { index: number }) {
  const { startX, startY, x1, x2, y1, y2 } = getRandomPath(index);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: startX, y: startY }}
      animate={{
        opacity: 1,
        scale: 1,
        x: [startX, x1, x2, -x1, startX],
        y: [startY, y1, y2, -y2, startY]
      }}
      transition={{
        scale: { type: 'spring', stiffness: 300, damping: 20 },
        opacity: { duration: 0.3 },
        x: { duration: 15 + (index % 3) * 5, repeat: Infinity, ease: "linear" },
        y: { duration: 20 + (index % 4) * 4, repeat: Infinity, ease: "linear" },
      }}
      className="absolute"
    >
      <motion.div
        initial={{ borderRadius: "50% 50% 48% 48% / 48% 48% 52% 52%" }}
        animate={{
          y: [0, -12, 0],
          x: [0, 8, 0, -8, 0],
          scaleX: [1, 1.03, 0.97, 1],
          scaleY: [1, 0.97, 1.03, 1],
          borderRadius: [
            "50% 50% 48% 48% / 48% 48% 52% 52%",
            "46% 54% 44% 56% / 53% 47% 53% 47%",
            "54% 46% 56% 44% / 47% 53% 47% 53%",
            "50% 50% 48% 48% / 48% 48% 52% 52%"
          ]
        }}
        transition={{
          y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
          scaleX: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          scaleY: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          borderRadius: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="w-[60px] h-[60px] flex flex-col items-center justify-center relative cursor-pointer"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}60, ${color}10)`,
          border: `1px solid ${color}`,
          boxShadow: `0 0 30px ${color}40, inset 0 0 20px ${color}20`,
          backdropFilter: 'blur(12px)'
        }}
      />
    </motion.div>
  );
}

// Variante 2: GPU-only (sem animar borda, apenas CSS transform)
function BubbleGPU({ index }: { index: number }) {
  const { startX, startY, x1, x2, y1, y2 } = getRandomPath(index);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: startX, y: startY }}
      animate={{
        opacity: 1,
        scale: 1,
        x: [startX, x1, x2, -x1, startX],
        y: [startY, y1, y2, -y2, startY]
      }}
      transition={{
        scale: { type: 'spring', stiffness: 300, damping: 20 },
        opacity: { duration: 0.3 },
        x: { duration: 15 + (index % 3) * 5, repeat: Infinity, ease: "linear" },
        y: { duration: 20 + (index % 4) * 4, repeat: Infinity, ease: "linear" },
      }}
      className="absolute"
    >
      <motion.div
        animate={{
          y: [0, -12, 0],
          x: [0, 8, 0, -8, 0],
          scaleX: [1, 1.03, 0.97, 1],
          scaleY: [1, 0.97, 1.03, 1]
        }}
        transition={{
          y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
          scaleX: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          scaleY: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="w-[60px] h-[60px] flex flex-col items-center justify-center relative rounded-full cursor-pointer"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}60, ${color}10)`,
          border: `1px solid ${color}`,
          boxShadow: `0 0 30px ${color}40, inset 0 0 20px ${color}20`,
          backdropFilter: 'blur(12px)'
        }}
      />
    </motion.div>
  );
}

// Variante 3: Gooey Effect via SVG (Sem calcular borda frame a frame, apenas divs girando)
function BubbleSVG({ index }: { index: number }) {
  const { startX, startY, x1, x2, y1, y2 } = getRandomPath(index);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: startX, y: startY }}
      animate={{
        opacity: 1,
        scale: 1,
        x: [startX, x1, x2, -x1, startX],
        y: [startY, y1, y2, -y2, startY]
      }}
      transition={{
        scale: { type: 'spring', stiffness: 300, damping: 20 },
        opacity: { duration: 0.3 },
        x: { duration: 15 + (index % 3) * 5, repeat: Infinity, ease: "linear" },
        y: { duration: 20 + (index % 4) * 4, repeat: Infinity, ease: "linear" },
      }}
      className="absolute"
    >
      <motion.div
        animate={{
          y: [0, -12, 0],
          x: [0, 8, 0, -8, 0],
          scaleX: [1, 1.03, 0.97, 1],
          scaleY: [1, 0.97, 1.03, 1]
        }}
        transition={{
          y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
          scaleX: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          scaleY: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="w-[60px] h-[60px] relative cursor-pointer flex items-center justify-center"
      >
      {/* Container que mescla as formas orgânicas de dentro */}
      <div 
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none" 
        style={{ filter: 'url(#gooey-lab)' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute w-[50px] h-[55px] bg-[#38bdf8]/60 rounded-[40%_60%_70%_30%/40%_50%_60%_50%]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute w-[55px] h-[50px] bg-[#0ea5e9]/60 rounded-[60%_40%_30%_70%/60%_30%_70%_40%]"
        />
        <div className="absolute w-[56px] h-[56px] bg-[#0284c7]/80 rounded-full" />
      </div>

      {/* Camada superior para dar o brilho de vidro */}
      <div 
        className="absolute inset-0 rounded-full border border-sky-300/40 z-10"
        style={{
          boxShadow: `0 0 20px ${color}30, inset 0 4px 10px rgba(255,255,255,0.2), inset 0 -4px 10px rgba(0,0,0,0.1)`,
        }}
      />
      </motion.div>
    </motion.div>
  );
}
