'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Brain, Heart, Bird, Flag, 
  Plus, ArrowRight, Zap, Info, Sparkles 
} from 'lucide-react';
import { attributeEngine, UserAttributes } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';
import { bubbleEngine } from '@/modules/blackboard/engine/bubble-engine/BubbleEngine';

import { PILLARS_DATA, IMPACT_ICONS, RoutineOption } from '../data/routinesData';

export function PillarPage({ pillarId }: { pillarId: string }) {
  const config = PILLARS_DATA[pillarId];
  if (!config) return null;

  const [isMounted, setIsMounted] = React.useState(false);
  const [attributes, setAttributes] = useState(attributeEngine.getAttributes());

  React.useEffect(() => {
    setIsMounted(true);
    // Sincroniza com o estado atual do engine (que já leu o localStorage)
    setAttributes(attributeEngine.getAttributes());
  }, []);

  if (!isMounted) return null;


  const currentLevel = attributes[config.id];
  const Icon = config.icon;

  // Lógica de Cores de Estado
  const getStatusInfo = (val: number, pilarColor?: string) => {
    const baseColor = pilarColor || config.color;
    if (val >= 70) return { color: '#22c55e', label: 'EXCELENTE' };
    if (val >= 40) return { color: baseColor, label: 'ESTÁVEL' };
    return { color: '#ef4444', label: 'CRÍTICO' };
  };

  const status = getStatusInfo(currentLevel);

  // Lógica de Simulação
  const getSimulatedAttributes = (routine: RoutineOption) => {
    const next = { ...attributes };
    routine.impacts.forEach(imp => {
      next[imp.pilar] = Math.min(100, Math.max(0, next[imp.pilar] + imp.val));
    });
    return next;
  };

  return (
    <div style={{
      flex: '0 0 100vw',
      height: '100dvh',
      scrollSnapAlign: 'start',
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      background: '#0a0c0a',
      overflowY: 'auto',
      overflowX: 'hidden',
      position: 'relative'
    }}>

      {/* Background Decor */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-10%',
        width: '300px',
        height: '300px',
        background: status.color,
        filter: 'blur(150px)',
        opacity: 0.08,
        transition: 'background 0.5s ease',
        zIndex: 0
      }} />

      {/* Header: Resumo do Atributo com Gauge */}
      <div style={{ zIndex: 1 }}>
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

      {/* Seção: Rotinas Ativas */}
      <div style={{ zIndex: 1 }}>
        <h3 style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '1rem', opacity: 0.5 }}>
          ROTINAS ATIVAS NO OCEANO
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(255,255,255,0.01)', 
            border: '1px dashed rgba(255,255,255,0.1)', 
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#475569', fontSize: '0.75rem', fontStyle: 'italic', margin: 0 }}>
              Nenhuma rotina ativa para este pilar agora.
            </p>
          </div>
        </div>
      </div>

      {/* Seção: Catálogo de Rotinas */}
      <div style={{ zIndex: 1, paddingBottom: '10rem' }}>
        <h3 style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '1rem', opacity: 0.5 }}>
          CATÁLOGO DE EVOLUÇÃO
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {config.options.map(opt => (
            <motion.div
              key={opt.id}
              whileHover={{ scale: 1.01 }}
              data-routine-id={opt.id}
              data-pillar-id={pillarId}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '24px',
                cursor: 'pointer',
                display: 'flex',
                overflow: 'hidden',
                minHeight: '120px'
              }}
            >
              {/* Thumbnail Banner */}
              <div style={{ 
                width: '40%', 
                position: 'relative',
                background: '#1a1d1a'
              }}>
                <img 
                  src={opt.image} 
                  alt={opt.title}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    opacity: 0.7
                  }} 
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(90deg, transparent 50%, rgba(10,12,10,0.8) 100%)`
                }} />
              </div>

              {/* Content Side */}
              <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, margin: '0 0 2px' }}>{opt.title}</h4>
                <p style={{ color: '#64748b', fontSize: '0.7rem', margin: '0 0 10px', lineHeight: '1.4' }}>{opt.desc}</p>
                
                {/* Indicadores Minimalistas */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {opt.impacts.map((imp, idx) => {
                    const ImpIcon = IMPACT_ICONS[imp.pilar];
                    const isPositive = imp.val > 0;
                    const impColor = isPositive ? '#22c55e' : '#ef4444';
                    
                    return (
                      <div key={idx} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        color: impColor,
                        fontSize: '0.6rem',
                        fontWeight: 900
                      }}>
                        <ImpIcon size={10} />
                        <span>{isPositive ? `+${imp.val}` : imp.val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
