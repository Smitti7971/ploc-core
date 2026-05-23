'use client';

/**
 * ============================================================================
 * Página de Pilar Único - PillarPage.tsx
 * ============================================================================
 * Descrição: Página que renderiza as informações detalhadas de um pilar específico.
 * Mostra o status atual (gauge), descrição, rotinas ativas e um catálogo de 
 * novas rotinas que podem ser adotadas.
 * ============================================================================
 */import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Brain, Heart, Bird, Flag, 
  Plus, ArrowRight, Zap, Info, Sparkles 
} from 'lucide-react';
import { attributeEngine, UserAttributes } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';
import { bubbleEngine } from '@/modules/blackboard/engine/bubble-engine/BubbleEngine';

import { PILLARS_DATA, IMPACT_ICONS, RoutineOption } from '../data/routinesData';
// Componente de página individual para renderização de um pilar
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
      <div style={{ zIndex: 1, paddingBottom: '2rem' }}>
        <h3 style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '1rem', opacity: 0.5 }}>
          ROTINAS ATIVAS
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
    </div>
  );
}
