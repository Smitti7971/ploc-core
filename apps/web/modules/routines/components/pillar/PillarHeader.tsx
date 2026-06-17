import React from 'react';
import { motion } from 'framer-motion';

interface PillarHeaderProps {
  status: { color: string; label: string };
  currentLevel: number;
  config: any;
  Icon: React.ElementType;
}

export function PillarHeader({ status, currentLevel, config, Icon }: PillarHeaderProps) {
  return (
    <div style={{ zIndex: 0 /* base */ /* base */ }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.5rem' }}>
        {/* Gauge Circular Simplificado */}
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          <svg width="80" height="80" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="45" fill="none"
              stroke={status.color}
              strokeWidth="8"
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * currentLevel) / 100 }}
              strokeLinecap="round"
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Icon size={24} style={{ color: status.color, opacity: 0.8 }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 900 }}>{currentLevel}</span>
          </div>
        </div>

        <div>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900, margin: 0, letterSpacing: '2px' }}>
            {config.label}
          </h2>
          <div style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '6px',
            background: `${status.color}20`,
            border: `1px solid ${status.color}40`,
            marginTop: '4px'
          }}>
            <span style={{ color: status.color, fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1px' }}>
              STATUS: {status.label}
            </span>
          </div>
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        padding: '1.2rem',
        borderRadius: '24px'
      }}>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
          {config.summary} Manter este pilar em alta garante estabilidade emocional e evolução para o seu PLOC.
        </p>
      </div>
    </div>
  );
}
