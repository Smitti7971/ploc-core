'use client';

import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const refreshHistory = () => {
      if (activeTab === 'history') {
        const saved = JSON.parse(localStorage.getItem('ploc_interaction_history') || '[]');
        setHistory(saved.reverse());
      }
    };

    refreshHistory();

    const unsubHistoryExplode = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, refreshHistory);
    const unsubHistoryTimeout = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_TIMEOUT, refreshHistory);

    return () => {
      unsubHistoryExplode();
      unsubHistoryTimeout();
    };
  }, [activeTab]);

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
      // Se clicar fora das bolhas de atributo ou do painel, fecha TUDO
      if (!(e.target as HTMLElement).closest('.attribute-bubble') && !(e.target as HTMLElement).closest('.monitor-panel')) {
        setActiveTooltip(null);
        onClose();
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, activeTab]);

  const getNextTasks = (pillarKey: string) => {
    const activeBubbles = bubbleEngine.getActiveBubbles();
    const config = PILLARS_CONFIG[pillarKey as keyof typeof PILLARS_CONFIG];
    return activeBubbles.filter(b => config.habits.includes(b.metadata?.habit));
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
        <>
          {/* Container das Bolhas */}
          <div style={{ display: 'flex', gap: '20px' }}>
        {(Object.keys(PILLARS_CONFIG) as Array<keyof UserAttributes>).map((key, index) => {
          const config = PILLARS_CONFIG[key];
          const Icon = config.icon;
          const change = lastChanges[key];
          const isActive = activeTooltip === key;
          const value = attributes[key];

          // Lógica de Cores de Estado
          const getStatusColor = (val: number) => {
            if (val >= 70) return '#22c55e'; // Excelente
            if (val >= 40) return config.color; // Estável (Tema)
            return '#ef4444'; // Crítico
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
            </div>
          );
        })}
      </div>

      {/* Tooltip Centralizado */}
      <AnimatePresence>
        {activeTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            style={{
              width: '320px',
              padding: '20px',
              background: 'rgba(10,12,10,0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${PILLARS_CONFIG[activeTooltip as keyof typeof PILLARS_CONFIG].color}40`,
              borderRadius: '24px',
              color: '#fff',
              zIndex: 1000,
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              position: 'relative'
            }}
          >
            <h4 style={{ 
              color: PILLARS_CONFIG[activeTooltip as keyof typeof PILLARS_CONFIG].color, 
              margin: '0 0 8px',
              fontSize: '1rem',
              fontWeight: 900,
              letterSpacing: '2px'
            }}>
              {PILLARS_CONFIG[activeTooltip as keyof typeof PILLARS_CONFIG].label}
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5', margin: '0 0 16px' }}>
              {PILLARS_CONFIG[activeTooltip as keyof typeof PILLARS_CONFIG].desc}
            </p>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748b', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
                SENSAÇÃO
              </span>
              <span style={{ fontSize: '0.75rem', color: PILLARS_CONFIG[activeTooltip as keyof typeof PILLARS_CONFIG].color, fontWeight: 700 }}>
                {PILLARS_CONFIG[activeTooltip as keyof typeof PILLARS_CONFIG].states}
              </span>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748b', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>
                PRÓXIMAS TAREFAS
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {getNextTasks(activeTooltip).length > 0 ? getNextTasks(activeTooltip).map(b => (
                  <div key={b.id} style={{ 
                    padding: '8px 12px', 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{b.content}</span>
                    <span style={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: 800 }}>+EVOLUÇÃO</span>
                  </div>
                )) : (
                  <span style={{ fontSize: '0.7rem', color: '#475569', fontStyle: 'italic' }}>Nenhuma bolha ativa para este pilar.</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </>
    ) : (
        /* Painel de Histórico */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="monitor-panel"
          style={{
            width: '400px',
            maxHeight: '500px',
            background: 'rgba(10,12,10,0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            pointerEvents: 'all',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 900, margin: 0 }}>HISTÓRICO DE FOCO</h3>
            <span style={{ fontSize: '0.6rem', color: '#64748b' }}>ÚLTIMAS 100 AÇÕES</span>
          </div>

          {history.length > 0 ? history.map((log, i) => (
            <div key={i} style={{
              padding: '12px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    fontSize: '0.65rem', 
                    padding: '2px 8px', 
                    borderRadius: '50px',
                    background: log.reward > 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: log.reward > 0 ? '#4ade80' : '#f87171',
                    fontWeight: 800
                  }}>
                    {log.reward > 0 ? `+${log.reward}` : log.reward} COINS
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>{log.content}</span>
                </div>
                <span style={{ fontSize: '0.6rem', color: '#475569' }}>
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {/* Impacto de Atributos */}
              {log.impacts && Object.keys(log.impacts).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                  {Object.entries(log.impacts).map(([attr, val]: [string, any]) => {
                    const pillar = PILLARS_CONFIG[attr.toLowerCase() as keyof typeof PILLARS_CONFIG];
                    return (
                      <span key={attr} style={{
                        fontSize: '0.65rem',
                        padding: '3px 10px',
                        borderRadius: '8px',
                        background: val > 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: pillar?.color || '#fff',
                        border: `1px solid ${pillar?.color || '#fff'}60`,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: `0 2px 10px ${pillar?.color || '#000'}20`
                      }}>
                        {val > 0 ? '▲' : '▼'} {Math.abs(val)} {attr}
                      </span>
                    );
                  })}
                </div>
              )}
              
              {log.note && (
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#94a3b8', 
                  fontStyle: 'italic',
                  paddingLeft: '12px',
                  borderLeft: '2px solid rgba(255,255,255,0.1)',
                  margin: '4px 0'
                }}>
                  "{log.note}"
                </div>
              )}
              
              <div style={{ fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {log.status === 'resisted' ? '🛡️ RESISTÊNCIA' : 
                 log.status === 'gave_up' ? '❌ CEDEU' : 
                 log.status === 'failed' ? '⚠️ FALHOU' : '✅ CONCLUÍDO'}
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#475569', fontSize: '0.8rem' }}>
              Nenhuma interação registrada ainda.
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
