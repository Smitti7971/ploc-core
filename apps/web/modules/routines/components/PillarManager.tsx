'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PillarPage } from './PillarPage';
import { BicepsFlexed, Brain, Heart, Bird, Flag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const PILLARS = ['corpo', 'mente', 'vida', 'liberdade', 'proposito'];

const PILLAR_ICONS = {
  corpo: BicepsFlexed,
  mente: Brain,
  vida: Heart,
  liberdade: Bird,
  proposito: Flag
};

const PILLAR_COLORS = {
  corpo: '#ef4444',
  mente: '#38bdf8',
  vida: '#facc15',
  liberdade: '#2dd4bf',
  proposito: '#c084fc'
};

export function PillarManager() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePillar, setActivePillar] = useState('corpo');

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollLeft = containerRef.current.scrollLeft;
    const width = containerRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setActivePillar(PILLARS[index]);
  };

  const scrollTo = (index: number) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      left: index * containerRef.current.offsetWidth,
      behavior: 'smooth'
    });
  };

  return (
    <div style={{ height: '100dvh', background: '#000', overflow: 'hidden', position: 'relative' }}>
      {/* Top Nav: Seletor de Atributos */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '70px',
        background: 'rgba(10,12,10,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        justifyContent: 'space-between'
      }}>
        <Link href="/dashboard" style={{ color: '#fff', opacity: 0.5, textDecoration: 'none' }}>
          <ArrowLeft size={20} />
        </Link>

        <div style={{ display: 'flex', gap: '15px' }}>
          {PILLARS.map((p, i) => {
            const Icon = PILLAR_ICONS[p as keyof typeof PILLAR_ICONS];
            const isActive = activePillar === p;
            const color = PILLAR_COLORS[p as keyof typeof PILLAR_COLORS];
            
            return (
              <motion.button
                key={p}
                onClick={() => scrollTo(i)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? color : '#334155',
                  padding: '10px',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <Icon size={20} />
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    style={{
                      position: 'absolute',
                      bottom: '-5px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: color,
                      boxShadow: `0 0 10px ${color}`
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <div style={{ width: '20px' }} /> {/* Spacer */}
      </div>

      {/* Container de Slides */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          height: '100%',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {PILLARS.map(p => (
          <PillarPage key={p} pillarId={p} />
        ))}
      </div>
    </div>
  );
}
