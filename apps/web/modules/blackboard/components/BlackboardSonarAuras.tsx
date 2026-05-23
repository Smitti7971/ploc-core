/**
 * @module BlackboardSonarAuras
 * @description Componente visual que renderiza as animações de fundo do radar/sonar do Ploc.
 * Possui múltiplos temas (radio_wave, submarine, holographic, clockwork).
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';

export type SonarTheme = 'radio_wave' | 'submarine' | 'holographic' | 'clockwork';

export const BlackboardSonarAuras = memo(({ 
  centerX, 
  centerY, 
  theme = 'radio_wave' 
}: {
  centerX: number,
  centerY: number,
  theme?: SonarTheme
}) => {
  // 1. TEMA: RADIO WAVE (Ondas Cinematográficas)
  const RadioWaveTheme = () => (
    <div style={{ position: 'absolute', left: centerX, top: centerY, width: '1000px', height: '1000px', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
      {[0, 2, 4].map((delay) => (
        <motion.div
          key={delay}
          animate={{ scale: [0, 1.2], opacity: [0, 0.5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeOut", delay }}
          style={{ position: 'absolute', left: '50%', top: '50%', x: '-50%', y: '-50%', width: '1000px', height: '1000px', borderRadius: '50%', background: `radial-gradient(circle, transparent 40%, #ef444411 60%, #ef444466 80%, #ef4444 95%, transparent 100%)` }}
        />
      ))}
    </div>
  );

  // 2. TEMA: SUBMARINE (Varredura PPI)
  const SubmarineTheme = () => (
    <div style={{ position: 'absolute', left: centerX, top: centerY, width: '1000px', height: '1000px', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute', left: '50%', top: '50%', width: '1000px', height: '1000px', x: '-50%', y: '-50%', borderRadius: '50%', background: `conic-gradient(from 0deg, #ef4444 0deg, #ef444433 20deg, transparent 90deg)`, opacity: 0.6 }}
      />
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '1000px', height: '1000px', borderRadius: '50%', border: '2px solid rgba(239, 68, 68, 0.2)' }} />
    </div>
  );

  // 3. TEMA: HOLOGRAPHIC (HUD Moderno)
  const HolographicTheme = () => (
    <div style={{ position: 'absolute', left: centerX, top: centerY, width: '1000px', height: '1000px', transform: 'translate(-50%, -50%)', pointerEvents: 'none', maskImage: 'radial-gradient(circle, transparent 80px, black 120px)', WebkitMaskImage: 'radial-gradient(circle, transparent 80px, black 120px)' }}>
      {[900, 700, 400].map((size, i) => (
        <motion.div key={i} animate={{ rotate: i % 2 === 0 ? 360 : -360 }} transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', left: '50%', top: '50%', width: `${size}px`, height: `${size}px`, x: '-50%', y: '-50%', borderRadius: '50%', border: '1px dashed rgba(56, 189, 248, 0.3)' }}
        />
      ))}
    </div>
  );

  // 4. TEMA: CLOCKWORK (Engrenagens RPG)
  const ClockworkTheme = () => (
    <div style={{ position: 'absolute', left: centerX, top: centerY, width: '1000px', height: '1000px', transform: 'translate(-50%, -50%)', pointerEvents: 'none', maskImage: 'radial-gradient(circle, transparent 80px, black 120px)', WebkitMaskImage: 'radial-gradient(circle, transparent 80px, black 120px)' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute', left: '50%', top: '50%', width: '1000px', height: '1000px', x: '-50%', y: '-50%', borderRadius: '50%', backgroundImage: `repeating-conic-gradient(from 0deg, #f59e0b 0deg, #f59e0b 2deg, transparent 2deg, transparent 10deg)`, opacity: 0.4 }}
      />
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} animate={{ rotate: 360 }} transition={{ duration: 4 + i, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', width: '160px', height: '1px', background: `linear-gradient(90deg, transparent, #f59e0b, transparent)`, transformOrigin: 'center center', opacity: 0.3 }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {theme === 'radio_wave' && <RadioWaveTheme />}
      {theme === 'submarine' && <SubmarineTheme />}
      {theme === 'holographic' && <HolographicTheme />}
      {theme === 'clockwork' && <ClockworkTheme />}
    </>
  );
});

BlackboardSonarAuras.displayName = 'BlackboardSonarAuras';
