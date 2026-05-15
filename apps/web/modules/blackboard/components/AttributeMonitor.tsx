'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Activity, Heart, Bird, Flag, Sparkles } from 'lucide-react';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '../events/eventBus';
import { attributeEngine, UserAttributes, AttributeChange } from '../engine/attribute-engine/AttributeEngine';
import { bubbleEngine } from '../engine/bubble-engine/BubbleEngine';

const PILLARS_CONFIG = {
  corpo: { 
    label: 'CORPO', 
    color: '#ef4444', 
    icon: Activity,
    desc: 'Saúde, sono e energia física. Afetado por exercícios, hidratação e descanso.',
    states: 'Fortalecendo, Recuperando, Esgotado, Instável',
    habits: ['smoking', 'exercise']
  },
  mente: { 
    label: 'MENTE', 
    color: '#38bdf8', 
    icon: Brain,
    desc: 'Foco, clareza e aprendizado. Afetado por estudos, reflexão e journaling.',
    states: 'Clareza crescente, Fragmentada, Sobrecarregada, Expandindo',
    habits: ['smoking', 'meditation']
  },
  vida: { 
    label: 'VIDA', 
    color: '#facc15', 
    icon: Heart,
    desc: 'Equilíbrio, lazer e relações. Afetado por hobbies, família e novas experiências.',
    states: 'Equilibrada, Vazia, Conectada, Monótona',
    habits: ['exercise']
  },
  liberdade: { 
    label: 'LIBERDADE', 
    color: '#2dd4bf', 
    icon: Bird,
    desc: 'Autonomia e finanças. Afetado por economia, reserva e redução de dependências.',
    states: 'Em construção, Pressionada, Estável, Limitada',
    habits: ['smoking']
  },
  proposito: { 
    label: 'PROPÓSITO', 
    color: '#c084fc', 
    icon: Flag,
    desc: 'Direção e progresso existencial. Afetado por projetos pessoais e metas reais.',
    states: 'Alinhado, Perdido, Despertando, Sem direção',
    habits: ['meditation']
  }
};

interface AttributeMonitorProps {
  onClose: () => void;
}

export function AttributeMonitor({ onClose }: AttributeMonitorProps) {
  const [attributes, setAttributes] = useState<UserAttributes>(attributeEngine.getAttributes());
  const [lastChanges, setLastChanges] = useState<Record<string, number>>({});
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pillars' | 'history'>('pillars');
  const [history, setHistory] = useState<any[]>([]);

  const refreshHistory = useCallback(() => {
    if (activeTab === 'history') {
      try {
        const saved = JSON.parse(localStorage.getItem('ploc_interaction_history') || '[]');
        setHistory(Array.isArray(saved) ? [...saved].reverse() : []);
      } catch (e) {
        setHistory([]);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    refreshHistory();

    const unsubHistoryExplode = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, refreshHistory);
    const unsubHistoryTimeout = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_TIMEOUT, refreshHistory);

    return () => {
      unsubHistoryExplode();
      unsubHistoryTimeout();
    };
  }, [activeTab, refreshHistory]);

  useEffect(() => {
    const unsub = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, (change: AttributeChange) => {
      setAttributes(prev => ({ ...prev, [change.pillar]: change.value }));
      
      setLastChanges(prev => ({ ...prev, [change.pillar]: change.diff }));
      setTimeout(() => {
        setLastChanges(prev => {
          const newChanges = { ...prev };
          delete newChanges[change.pillar];
          return newChanges;
        });
      }, 2000);
    });

    return unsub;
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.attribute-bubble') && !(e.target as HTMLElement).closest('.monitor-panel')) {
        setActiveTooltip(null);
        onClose();
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getNextTasks = (pillarKey: string) => {
    const activeBubbles = bubbleEngine.getActiveBubbles();
    const config = PILLARS_CONFIG[pillarKey as keyof typeof PILLARS_CONFIG];
    return activeBubbles.filter(b => config.habits.includes((b.metadata as any)?.habit));
  };

  return (
    <div className="monitor-panel" style={{
      position: 'fixed',
      top: '140px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      zIndex: 100,
    }}>
      {/* Tab Switcher */}
      <div style={{
        display: 'flex',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(10px)',
        padding: '4px',
        borderRadius: '50px',
        border: '1px solid rgba(255,255,255,0.1)',
        pointerEvents: 'all'
      }}>
        <button 
          onClick={() => setActiveTab('pillars')}
          style={{
            padding: '8px 20px',
            borderRadius: '50px',
            background: activeTab === 'pillars' ? 'rgba(255,255,255,0.1)' : 'transparent',
            border: 'none',
            color: activeTab === 'pillars' ? '#fff' : 'rgba(255,255,255,0.5)',
            fontSize: '0.7rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          ATRIBUTOS
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          style={{
            padding: '8px 20px',
            borderRadius: '50px',
            background: activeTab === 'history' ? 'rgba(255,255,255,0.1)' : 'transparent',
            border: 'none',
            color: activeTab === 'history' ? '#fff' : 'rgba(255,255,255,0.5)',
            fontSize: '0.7rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          HISTÓRICO
        </button>
      </div>

      {activeTab === 'pillars' ? (
        <div style={{ display: 'flex', gap: '20px' }}>
          {(Object.keys(PILLARS_CONFIG) as Array<keyof UserAttributes>).map((key, index) => {
            const config = PILLARS_CONFIG[key];
            const Icon = config.icon;
            const change = lastChanges[key];
            const isActive = activeTooltip === key;
            const value = attributes[key];

            const getStatusColor = (val: number) => {
              if (val >= 70) return '#22c55e';
              if (val >= 40) return config.color;
              return '#ef4444';
            };

            const statusColor = getStatusColor(value);
            
            return (
              <div key={key} className="attribute-bubble" style={{ position: 'relative' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1,
                    y: [0, -10, 0],
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveTooltip(isActive ? null : key)}
                  transition={{
                    y: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.4
                    }
                  }}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(15px)',
                    border: `1px solid ${isActive ? statusColor : statusColor + '40'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px ${statusColor}20`,
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'help',
                    pointerEvents: 'all'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '20%',
                    width: '30%',
                    height: '30%',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    filter: 'blur(4px)'
                  }} />

                  <Icon size={20} color={statusColor} style={{ opacity: 0.8, marginBottom: '2px' }} />
                  <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 900 }}>{value}</span>
                </motion.div>

                <AnimatePresence>
                  {change && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: -40 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        textAlign: 'center',
                        color: change > 0 ? '#22c55e' : '#ef4444',
                        fontWeight: 900,
                        fontSize: '0.8rem',
                        textShadow: '0 0 10px rgba(0,0,0,0.5)'
                      }}
                    >
                      {change > 0 ? `+${change}` : change}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tooltip Aninhado */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 20, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        x: '-50%',
                        width: '280px',
                        padding: '16px',
                        background: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${statusColor}40`,
                        borderRadius: '16px',
                        color: '#fff',
                        zIndex: 1000,
                        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                        pointerEvents: 'all'
                      }}
                    >
                      <h4 style={{ color: statusColor, margin: '0 0 4px', fontSize: '0.9rem', fontWeight: 900 }}>{config.label}</h4>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 12px' }}>{config.desc}</p>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#64748b', display: 'block', marginBottom: '6px' }}>TAREFAS ATIVAS</span>
                        {getNextTasks(key).length > 0 ? getNextTasks(key).map(b => (
                          <div key={b.id} style={{ fontSize: '0.7rem', color: '#fff', marginBottom: '4px' }}>• {b.content}</div>
                        )) : (
                          <span style={{ fontSize: '0.65rem', color: '#475569' }}>Nenhuma tarefa ativa.</span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : (
        /* Painel de Histórico */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            width: '400px',
            maxHeight: '400px',
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            pointerEvents: 'all'
          }}
        >
          <h3 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 900, margin: '0 0 10px' }}>HISTÓRICO</h3>
          {history.length > 0 ? history.map((log, i) => (
            <div key={i} style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: log.reward > 0 ? '#4ade80' : '#f87171' }}>{log.reward > 0 ? '+' : ''}{log.reward}</span>
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#fff' }}>{log.content}</div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '0.8rem' }}>Sem interações.</div>
          )}
        </motion.div>
      )}
    </div>
  );
}
