'use client';

import { useState, useEffect } from 'react';
import { CHALLENGE_PHRASES } from '@/modules/landing/constants/phrases';
import { BubbleConcept } from '../components/bubbles/types';
import { DECOR_CONCEPTS, PHASE1_BUBBLES, PHASE2_BUBBLES } from '../components/bubbles/bubble-pools';
import { useBlackboardSync } from './useBlackboardSync';
import { useGameModeSync } from './useGameModeSync';
import { useChatInteractions } from './useChatInteractions';
import { attributeEngine } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';
import { blackboardEventBus } from '@/modules/blackboard/events/eventBus';

const PRIORITY_CONCEPTS: BubbleConcept[] = [
  { id: 'prio-corpo', word: 'Corpo', pillar: 'corpo', ref: 'prio_corpo', label: 'Corpo', value: 'positive', points: 0, isGameActive: true, left: '15%', size: 85, duration: 42, delay: 0, theme: 'glass', maxOpacity: 0.8, zIndex: 20 },
  { id: 'prio-mente', word: 'Mente', pillar: 'mente', ref: 'prio_mente', label: 'Mente', value: 'positive', points: 0, isGameActive: true, left: '32%', size: 85, duration: 42, delay: 0, theme: 'glass', maxOpacity: 0.8, zIndex: 20 },
  { id: 'prio-vida', word: 'Vida', pillar: 'vida', ref: 'prio_vida', label: 'Vida', value: 'positive', points: 0, isGameActive: true, left: '50%', size: 85, duration: 42, delay: 0, theme: 'glass', maxOpacity: 0.8, zIndex: 20 },
  { id: 'prio-liberdade', word: 'Liberdade', pillar: 'liberdade', ref: 'prio_liberdade', label: 'Liberdade', value: 'positive', points: 0, isGameActive: true, left: '68%', size: 85, duration: 42, delay: 0, theme: 'glass', maxOpacity: 0.8, zIndex: 20 },
  { id: 'prio-proposito', word: 'Propósito', pillar: 'proposito', ref: 'prio_proposito', label: 'Propósito', value: 'positive', points: 0, isGameActive: true, left: '85%', size: 85, duration: 42, delay: 0, theme: 'glass', maxOpacity: 0.8, zIndex: 20 },
];

export function useBubbleState() {
  const [isMounted, setIsMounted] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isFirstPageLoad, setIsFirstPageLoad] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [isWhirlwind, setIsWhirlwind] = useState(true);
  const [onboardingStage, setOnboardingStage] = useState<string>('priority');
  const [showStartGameBubble, setShowStartGameBubble] = useState(false);

  // Integrar sub-hooks modulares
  const { attributes } = useBlackboardSync();
  const { gameMode, rewardBoxVisible, density, setDensity } = useGameModeSync();
  const { isLandingChatOpen } = useChatInteractions();

  // Ciclo geral timeouts/intervalos
  useEffect(() => {
    setIsMounted(true);

    const whirlwindTimeout = setTimeout(() => {
      setIsWhirlwind(false);
    }, 3500);

    const timeout = setTimeout(() => {
      setIsFirstPageLoad(false);
    }, 12000);

    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % CHALLENGE_PHRASES.length);
    }, 60000);

    // Recupera estágio inicial do localStorage
    if (typeof window !== 'undefined') {
      const savedStage = localStorage.getItem('ploc_onboarding_stage') || 'priority';
      setOnboardingStage(savedStage);
    }

    const handleStageChange = (stage: any) => {
      if (typeof stage === 'string') {
        setOnboardingStage(stage);
      }
    };

    const handleShowStartGameBubble = (val: any) => {
      setShowStartGameBubble(!!val);
    };

    const unsubscribe = blackboardEventBus.subscribe('ONBOARDING_STAGE_CHANGED', handleStageChange);
    const unsubStartBubble = blackboardEventBus.subscribe('SHOW_START_GAME_BUBBLE', handleShowStartGameBubble);

    return () => {
      clearTimeout(whirlwindTimeout);
      clearTimeout(timeout);
      clearInterval(interval);
      unsubscribe();
      unsubStartBubble();
    };
  }, []);

  const toggleTooltip = (pillarKey: string) => {
    setActiveTooltip(prev => prev === pillarKey ? null : pillarKey);
  };

  const changeDensity = (newDensity: 'none' | 'low' | 'medium' | 'high') => {
    setDensity(newDensity);
  };

  // Estabilização do estado de activeConcepts usando useEffect
  const [activeConcepts, setActiveConcepts] = useState<BubbleConcept[]>([]);

  useEffect(() => {
    if (!isMounted) return;

    if (density === 'none') {
      setActiveConcepts([]);
      return;
    }

    const viewportHeight = window.innerHeight;
    const isPhase1 = ['corpo', 'mente', 'vida', 'liberdade', 'proposito'].includes(onboardingStage);
    const poolSize = isPhase1 ? 5 : Math.max(12, Math.floor(viewportHeight / 70));

    // ── MODO DECORATIVO ──
    if (gameMode === 'decor') {
      const mapped = DECOR_CONCEPTS.map((c, idx) => ({
        ...c,
        id: `decor-${idx}`,
        theme: 'glass' as any
      })) as BubbleConcept[];

      const repeated: BubbleConcept[] = [];
      for (let i = 0; i < poolSize; i++) {
        const item = mapped[i % mapped.length];
        repeated.push({
          ...item,
          id: `${item.id}-${i}`
        });
      }

      if (showStartGameBubble) {
        repeated.push({
          id: 'trigger-onboarding-bubble',
          word: 'Começar o Teste',
          pillar: 'corpo',
          ref: 'trigger_onboarding',
          label: 'Iniciar Autoconhecimento',
          value: 'positive',
          points: 0,
          isGameActive: false,
          left: '42%',
          size: 155,
          duration: 25,
          delay: 0.5,
          theme: 'emerald',
          maxOpacity: 0.95,
          zIndex: 22
        });
      }

      setActiveConcepts(repeated);
      return;
    }

    // ── MODO ONBOARDING ATIVO ──
    if (onboardingStage === 'priority') {
      setActiveConcepts(PRIORITY_CONCEPTS);
      return;
    }

    if (['corpo', 'mente', 'vida', 'liberdade', 'proposito'].includes(onboardingStage)) {
      // Filtra apenas as bolhas do pilar ativo na Fase 1
      const filtered = PHASE1_BUBBLES.filter(b => b.pillar === onboardingStage);
      
      // Baralha os hábitos filtrados para garantir que venham itens diferentes sem repetição idêntica
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      
      // Seleciona exatamente o número de bolhas configuradas (5)
      const selected = shuffled.slice(0, poolSize);

      // Posições horizontais e delays determinísticos perfeitamente distribuídos
      const horizontalPositions = ['16%', '50%', '84%', '33%', '67%'];
      const spawnDelays = [0, 3.0, 6.0, 9.0, 12.0];

      const phase1Concepts = selected.map((c, i) => ({
        ...c,
        id: `phase1-${onboardingStage}-${i}`,
        left: horizontalPositions[i % horizontalPositions.length],
        delay: spawnDelays[i % spawnDelays.length]
      })) as BubbleConcept[];

      setActiveConcepts(phase1Concepts);
      return;
    }

    if (onboardingStage === 'results') {
      setActiveConcepts([]);
      return;
    }

    // ── FASE 2: SPAWN INTELIGENTE BASEADO NO HISTÓRICO DE ATRIBUTOS (WEIGHTED SPAWN) ──
    const attrs = attributeEngine.getAttributes();
    const sortedPillars = (Object.keys(attrs) as Array<keyof typeof attrs>)
      .sort((a, b) => attrs[a] - attrs[b]);

    const lowestPillar = sortedPillars[0]; // Pilar mais deficitário
    const secondLowestPillar = sortedPillars[1]; // Segundo mais deficitário

    const base = PHASE2_BUBBLES.map((c, idx) => ({
      ...c,
      id: `phase2-${idx}`,
      theme: c.theme as any
    })) as BubbleConcept[];

    const repeated: BubbleConcept[] = [];
    for (let i = 0; i < poolSize; i++) {
      const item = base[i % base.length];
      
      // Aumenta a probabilidade de spawn de bolhas que alimentem positivamente os pilares fracos!
      const hasPositiveImpactOnWeakest = item.impacts && (
        (item.impacts[lowestPillar] || 0) > 0 || 
        (item.impacts[secondLowestPillar] || 0) > 0
      );

      if (hasPositiveImpactOnWeakest && i % 2 === 0) {
        // Injeta uma bolha útil adicional no pool
        repeated.push({
          ...item,
          id: `${item.id}-boost-${i}`,
          size: Math.min(95, item.size + 10) // Fica ligeiramente maior para chamar a atenção
        });
      } else {
        repeated.push({
          ...item,
          id: `${item.id}-${i}`
        });
      }
    }
    setActiveConcepts(repeated);
  }, [isMounted, gameMode, onboardingStage, density, showStartGameBubble]);

  return {
    isMounted,
    phraseIndex,
    density,
    isFirstPageLoad,
    attributes,
    activeTooltip,
    gameMode,
    rewardBoxVisible,
    isLandingChatOpen,
    isWhirlwind,
    activeConcepts,
    onboardingStage,
    toggleTooltip,
    changeDensity
  };
}
