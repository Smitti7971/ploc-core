'use client';

import { useState, useEffect } from 'react';
import { blackboardEventBus } from '@/modules/blackboard/events/eventBus';

export function useGameModeSync() {
  const [gameMode, setGameMode] = useState<'decor' | 'onboarding_game' | 'normal'>('decor');
  const [rewardBoxVisible, setRewardBoxVisible] = useState(false);
  const [density, setDensity] = useState<'none' | 'low' | 'medium' | 'high'>('low');

  // Carrega e gerencia modos de jogo/recompensas do local storage e eventos
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mode = localStorage.getItem('ploc_game_mode') as 'decor' | 'onboarding_game' | 'normal' || 'decor';
      setGameMode(mode);
      if (mode === 'onboarding_game') {
        setDensity('high');
      }
      setRewardBoxVisible(localStorage.getItem('ploc_reward_unlocked') === 'true');
    }

    const handleModeChange = (mode: any) => {
      setGameMode(mode);
      if (mode === 'onboarding_game') {
        setDensity('high');
      }
    };

    const handleStorageChange = () => {
      const mode = localStorage.getItem('ploc_game_mode') as 'decor' | 'onboarding_game' | 'normal' || 'decor';
      setGameMode(mode);
      setRewardBoxVisible(localStorage.getItem('ploc_reward_unlocked') === 'true');
    };

    const unsubscribe = blackboardEventBus.subscribe('GAME_MODE_CHANGED', handleModeChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    gameMode,
    setGameMode,
    rewardBoxVisible,
    setRewardBoxVisible,
    density,
    setDensity
  };
}
