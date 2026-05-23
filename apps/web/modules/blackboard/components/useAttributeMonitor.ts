/**
 * @module useAttributeMonitor
 * @description Hook responsável por gerenciar o estado central do AttributeMonitor. 
 * Cuida das inscrições de eventos (blackboardEventBus), sincronização de atributos com o backend,
 * carregamento do histórico do localStorage e o temporizador do modo demonstração.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '../events/eventBus';
import { attributeEngine, UserAttributes, AttributeChange } from '../engine/attribute-engine/AttributeEngine';
import { useAuth } from '@/modules/auth/hooks/useAuth';

export function useAttributeMonitor(onClose: () => void) {
  const [attributes, setAttributes] = useState<UserAttributes>(attributeEngine.getAttributes());
  const [lastChanges, setLastChanges] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<{
    timestamp: number;
    bubbleId: string;
    content: string;
    type: string;
    status: 'success' | 'failed' | 'resisted' | 'gave_up';
    reward: number;
    impacts: Record<string, number>;
    note: string;
  }[]>([]);
  const [activeTab, setActiveTab] = useState<'pillars' | 'history'>('pillars');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const { refreshProfile } = useAuth();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const refreshHistory = useCallback(() => {
    if (activeTab === 'history') {
      try {
        const saved = JSON.parse(localStorage.getItem('ploc_interaction_history') || '[]');
        setHistory(Array.isArray(saved) ? [...saved].reverse() : []);
      } catch {
        setHistory([]);
      }
    }
  }, [activeTab]);

  const handleManualSync = useCallback(async () => {
    console.log('🔄 [Manual Sync] Ativando sincronização forçada...');
    const updatedUser = await refreshProfile();
    
    if (updatedUser?.stats) {
      console.log('📊 Dados recebidos do Servidor:', updatedUser.stats);
      attributeEngine.syncWithBackend(updatedUser.stats);
    } else {
      console.warn('⚠️ [Manual Sync] Servidor não retornou estatísticas.');
    }
  }, [refreshProfile]);

  // Gestão de Histórico e Eventos
  useEffect(() => {
    setTimeout(() => refreshHistory(), 0);

    const unsubHistoryExplode = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, refreshHistory);
    const unsubHistoryTimeout = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_TIMEOUT, refreshHistory);

    return () => {
      unsubHistoryExplode();
      unsubHistoryTimeout();
    };
  }, [activeTab, refreshHistory]);

  // Gestão de Atributos
  useEffect(() => {
    const unsub = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, (change: AttributeChange) => {
      console.log(`📈 [AttributeMonitor] Atributo ${change.pillar} mudou para ${change.value}`);
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

  // Fechar Tooltips ou Painel ao clicar fora
  useEffect(() => {
    const isDemo = attributeEngine.getIsDemoMode();
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.attribute-bubble') && !(e.target as HTMLElement).closest('.monitor-panel')) {
        setActiveTooltip(null);
        if (!isDemo) {
          onClose();
        }
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const resetTimer = useCallback(() => {
    if (!attributeEngine.getIsDemoMode()) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      onClose();
    }, 5000);
  }, [onClose]);

  useEffect(() => {
    if (!attributeEngine.getIsDemoMode()) return;

    resetTimer();

    const unsubExplode = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, resetTimer);
    const unsubTimeout = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_TIMEOUT, resetTimer);

    return () => {
      unsubExplode();
      unsubTimeout();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resetTimer]);

  const handleUserActivity = () => {
    resetTimer();
  };

  return {
    attributes,
    lastChanges,
    history,
    activeTab,
    setActiveTab,
    activeTooltip,
    setActiveTooltip,
    handleManualSync,
    handleUserActivity
  };
}
