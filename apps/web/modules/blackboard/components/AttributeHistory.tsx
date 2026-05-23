/**
 * @module AttributeHistory
 * @description Componente visual que exibe o log (histórico) das interações recentes,
 * com pontuação (+/-) e horário de cada mudança nos atributos.
 */

import React from 'react';
import { motion } from 'framer-motion';

export interface AttributeHistoryEntry {
  reward: number;
  timestamp: string | number;
  content: string;
}

interface AttributeHistoryProps {
  history: AttributeHistoryEntry[];
}

export function AttributeHistory({ history }: AttributeHistoryProps) {
  return (
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
  );
}
