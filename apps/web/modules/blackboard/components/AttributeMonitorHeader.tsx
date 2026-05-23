/**
 * @module AttributeMonitorHeader
 * @description Componente visual que exibe as abas de navegação (Atributos vs Histórico) 
 * e o botão de sincronização manual com o servidor.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AttributeMonitorHeaderProps {
  activeTab: 'pillars' | 'history';
  setActiveTab: (tab: 'pillars' | 'history') => void;
  onManualSync: () => void;
}

export function AttributeMonitorHeader({ activeTab, setActiveTab, onManualSync }: AttributeMonitorHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
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

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onManualSync}
        title="Sincronizar com Servidor"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(56, 189, 248, 0.15)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          color: '#38bdf8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          pointerEvents: 'all'
        }}
      >
        <Sparkles size={14} />
      </motion.button>
    </div>
  );
}
