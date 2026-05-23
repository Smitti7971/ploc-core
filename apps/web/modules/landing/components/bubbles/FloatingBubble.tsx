'use client';

/**
 * ============================================================================
 * Bolha Flutuante (Lógica) - FloatingBubble.tsx
 * ============================================================================
 * Descrição: O controlador físico de uma bolha. Lida com a trajetória (flightParams),
 * detecção de colisão manual (bounding box) com o PLOC, o estouro (pop) e o respawn.
 * ============================================================================
 */import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '@/modules/blackboard/events/eventBus';
import { cn } from '@/lib/utils';

// Import newly encapsulated modules
import { FloatingBubbleProps, Particle } from './types';
import { THEME_STYLES } from './constants';
import { playPlocSound } from './bubble-pop-sfx';
import PopParticles from './PopParticles';
import BubbleBody from './BubbleBody';
import { SPRING_PRESETS } from '../../constants';

// Re-export utility elements for backwards compatibility
export { playPlocSound };
export { getBubbleWordColor, getBubbleIcon, getDecorIcon } from './helpers';
export type { BubbleConcept } from './types';
// Componente lógico de movimento e colisão que engloba o corpo visual
export function FloatingBubble({
  concept,
  isFirstPageLoad = false,
  gameMode,
  isWhirlwind = false,
  density
}: FloatingBubbleProps) {
  const [isPopped, setIsPopped] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [key, setKey] = useState(0);
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [prioSelectedPillar, setPrioSelectedPillar] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isPriorityBubble = concept.ref.startsWith('prio_');

  const targetY = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight * 0.35;
    }
    return 300;
  }, []);

  const targetYOffset = useMemo(() => {
    if (!isPriorityBubble) return 0;
    if (isMobile) {
      // Arco / Zigue-zague senoidal lindo para dar fluxo vertical e evitar colisão
      const offsets: Record<string, number> = {
        'prio-corpo': -60,       // Sobe um pouco
        'prio-mente': 30,        // Desce um pouco
        'prio-vida': -70,        // Sobe um pouco mais (centro no topo)
        'prio-liberdade': 30,    // Desce um pouco
        'prio-proposito': -60     // Sobe um pouco
      };
      return offsets[concept.id || ''] || 0;
    }
    return 0;
  }, [concept.id, isPriorityBubble, isMobile]);

  useEffect(() => {
    if (!isPriorityBubble) return;

    const handleSelected = (pillar: any) => {
      if (typeof pillar === 'string') {
        setPrioSelectedPillar(pillar);
      }
    };
    const handleReset = () => {
      setPrioSelectedPillar(null);
    };
    const handleConfirmed = (confirmedPillar: any) => {
      setIsPopped(true);
      playPlocSound();
    };

    const sub1 = blackboardEventBus.subscribe('PRIORITY_PILLAR_SELECTED', handleSelected);
    const sub2 = blackboardEventBus.subscribe('PRIORITY_PILLAR_RESET', handleReset);
    const sub3 = blackboardEventBus.subscribe('PRIORITY_PILLAR_CONFIRMED', handleConfirmed);

    return () => {
      sub1();
      sub2();
      sub3();
    };
  }, [concept.pillar, isPriorityBubble]);

  const flightParams = useMemo(() => {
    const activeStage = typeof window !== 'undefined' ? localStorage.getItem('ploc_onboarding_stage') || 'priority' : 'priority';
    const isOnboardingPhase1 = gameMode === 'onboarding_game' && activeStage !== 'fase2';

    // Controle de velocidade desacelerada para onboarding Fase 1
    const birthSpeedMultiplier = isOnboardingPhase1 
      ? 1.2 
      : (density === 'low' ? 1.0 : (density === 'medium' ? 2.0 : 3.0));

    // Multiplicador de tamanho responsivo para o mobile
    const sizeMultiplier = isMobile ? 0.76 : 1.0;

    let sizeJitter;
    if (isPriorityBubble) {
      // Bolhas prioritárias (os 5 pilares) têm tamanho simétrico e sem jitter aleatório
      sizeJitter = concept.size * sizeMultiplier;
    } else {
      // Bolhas normais têm um leve jitter orgânico
      sizeJitter = concept.size * (0.85 + Math.random() * 0.3) * sizeMultiplier;
    }

    const baseDuration = concept.duration * (0.8 + Math.random() * 0.4);
    const durationJitter = baseDuration / birthSpeedMultiplier;

    // Padding seguro para as palavras não baterem nas laterais
    const leftJitter = isOnboardingPhase1
      ? `${Math.random() * 66 + 17}%` // margem de 17% a 83% para ficar muito seguro
      : `${Math.random() * 70 + 15}%`; // margem de 15% a 85% para o resto

    const driftJitter = (Math.random() - 0.5) * 240;
    const initialYJitter = typeof window !== 'undefined' ? window.innerHeight + 120 : 1000;
    const delayJitter = isFirstRun 
      ? (isOnboardingPhase1 ? concept.delay : concept.delay * 0.3) 
      : 0;

    return {
      size: sizeJitter,
      duration: durationJitter,
      left: leftJitter,
      drift: driftJitter,
      initialY: initialYJitter,
      delay: delayJitter,
      speedMultiplier: birthSpeedMultiplier
    };
  }, [key, density, gameMode, concept.size, concept.duration, concept.delay, isFirstRun, isMobile, isPriorityBubble]);

  const leftStyle = useMemo(() => {
    const activeStage = typeof window !== 'undefined' ? localStorage.getItem('ploc_onboarding_stage') || 'priority' : 'priority';
    const isOnboardingPhase1 = gameMode === 'onboarding_game' && activeStage !== 'fase2';

    // Para bolhas da Fase 1 que não sejam as prioritárias, usamos concept.left e centralizamos
    if (isOnboardingPhase1 && concept.left && !isPriorityBubble) {
      if (concept.left.endsWith('%')) {
        return `calc(${concept.left} - ${flightParams.size / 2}px)`;
      }
      return concept.left;
    }

    if (!isPriorityBubble) {
      // Para bolhas normais do jogo/decor, usamos a dispersão orgânica
      return flightParams.left;
    }
    
    // Posições baseadas no centro da tela para as prioritárias
    const basePositions: Record<string, number> = {
      'prio-corpo': 15,
      'prio-mente': 32.5,
      'prio-vida': 50,
      'prio-liberdade': 67.5,
      'prio-proposito': 85
    };
    
    const idKey = concept.id || '';
    let basePercent = basePositions[idKey] || 50;
    
    // Se for mobile, compactamos a dispersão horizontal para evitar que fiquem coladas nas bordas
    if (isMobile) {
      const mobilePositions: Record<string, number> = {
        'prio-corpo': 16,
        'prio-mente': 33,
        'prio-vida': 50,
        'prio-liberdade': 67,
        'prio-proposito': 84
      };
      basePercent = mobilePositions[idKey] || 50;
    }
    
    // Subtrai metade do tamanho da bolha para garantir centralização perfeita!
    return `calc(${basePercent}% - ${flightParams.size / 2}px)`;
  }, [concept.id, concept.left, flightParams.left, flightParams.size, isPriorityBubble, isMobile, gameMode]);

  const bubbleRef = useRef<HTMLDivElement>(null);
  const respawnTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (respawnTimeoutRef.current) {
        clearTimeout(respawnTimeoutRef.current);
      }
    };
  }, []);

  const hasRestarted = useRef(false);

  useEffect(() => {
    hasRestarted.current = false;
  }, [key]);

  // Real-time 2D collision engine in pixels (Pops instantly upon collision with Ploc mascot singleton)
  useEffect(() => {
    // Apenas bolhas de nível 4 (zIndex: 21 ou 22) podem colidir com o PLOC
    const isLvl4 = concept.zIndex === 21 || concept.zIndex === 22;
    if (!isLvl4 || concept.noCollision || isPopped || isPriorityBubble) return;
    
    // Desativa colisões na Fase 1 (onde as bolhas não devem bater no Ploc para pontuar)
    const activeStage = typeof window !== 'undefined' ? localStorage.getItem('ploc_onboarding_stage') || 'priority' : 'priority';
    if (gameMode === 'onboarding_game' && activeStage !== 'fase2') return;

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && (!document.hasFocus() || document.hidden)) {
        return;
      }

      const bubbleEl = bubbleRef.current;
      const plocEl = document.getElementById('ploc-singleton-mount');
      if (bubbleEl && plocEl) {
        const bubbleRect = bubbleEl.getBoundingClientRect();
        const plocRect = plocEl.getBoundingClientRect();
        const plocCenterX = plocRect.left + plocRect.width / 2;
        const plocCenterY = plocRect.top + plocRect.height / 2;
        const bCenterX = bubbleRect.left + bubbleRect.width / 2;
        const bCenterY = bubbleRect.top + bubbleRect.height / 2;
        const dx = bCenterX - plocCenterX;
        const dy = bCenterY - plocCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const collisionRadius = 56 + flightParams.size / 2;
        if (distance < collisionRadius) {
          setIsPopped(true);
          playPlocSound();

          blackboardEventBus.emit(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, {
            word: concept.word,
            pillar: concept.pillar,
            ref: concept.ref,
            label: concept.label,
            value: concept.value,
            points: concept.points,
            isGameActive: concept.isGameActive,
            collided: true
          });
        }
      }
    }, 60);
    return () => clearInterval(interval);
  }, [key, isPopped, flightParams.size, concept.zIndex, isPriorityBubble]);

  // Generate particle fragments upon bubble pop
  useEffect(() => {
    if (isPopped) {
      const count = 10;
      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (i * 2 * Math.PI) / count + (Math.random() - 0.5) * 0.3;
        const speed = 45 + Math.random() * 45;
        newParticles.push({
          id: i,
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
          size: 3 + Math.random() * 3
        });
      }
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isPopped]);

  const particleColor = THEME_STYLES[concept.theme].particle;

  return (
    <motion.div
      key={key}
      ref={bubbleRef}
      initial={{ y: flightParams.initialY, x: 0 }}
      animate={isPriorityBubble ? {
        y: targetY + targetYOffset,
        x: 0
      } : {
        y: -120,
        x: flightParams.drift
      }}
      exit={{
        opacity: 0,
        scale: 0.5,
        filter: 'blur(8px)',
        transition: { duration: 0.8, ease: 'easeInOut' }
      }}
      onAnimationComplete={() => {
        if (isPriorityBubble) return;
        if (!hasRestarted.current && !isPopped) {
          hasRestarted.current = true;
          setIsFirstRun(false);
          const isRare = concept.value === 'positive' && Math.abs(concept.points) === 2;
          const randomJitter = (Math.random() * 3000) / flightParams.speedMultiplier;
          const delayTime = isRare ? (15000 / flightParams.speedMultiplier) : randomJitter;

          respawnTimeoutRef.current = setTimeout(() => {
            setKey((prev) => prev + 1);
          }, delayTime);
        }
      }}
      transition={isPriorityBubble ? {
        y: { ...SPRING_PRESETS.soft, delay: concept.delay },
        x: { duration: 0.5 }
      } : {
        y: { duration: flightParams.duration, ease: 'linear', delay: flightParams.delay },
        x: { duration: flightParams.duration, ease: 'easeInOut', delay: flightParams.delay }
      }}
      onTap={() => {
        if (!isPopped) {
          if (isPriorityBubble) {
            blackboardEventBus.emit('PRIORITY_PILLAR_SELECTED', concept.pillar);
            return;
          }

          setIsPopped(true);
          playPlocSound();

          blackboardEventBus.emit(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, {
            word: concept.word,
            pillar: concept.pillar,
            ref: concept.ref,
            label: concept.label,
            value: concept.value,
            points: concept.points,
            isGameActive: concept.isGameActive,
            poppedByUser: true
          });
        }
      }}
      className={cn(
        "absolute cursor-pointer rounded-full",
        isPopped ? "pointer-events-none" : "pointer-events-auto backdrop-blur-[12px]",
        concept.zIndex === 5 && "blur-[1.8px]",
        concept.zIndex === 12 && "blur-[0.7px]"
      )}
      style={{
        left: leftStyle,
        top: 0,
        width: `${flightParams.size}px`,
        height: `${flightParams.size}px`,
        zIndex: concept.zIndex,
        opacity: isPriorityBubble && prioSelectedPillar !== null
          ? (concept.pillar === prioSelectedPillar ? 1 : 0.25)
          : (concept.maxOpacity || 1),
        pointerEvents: 'auto',
        borderRadius: '50%',
      }}
    >
      {/* Pop Particle Fragments */}
      {isPopped && (
        <PopParticles particles={particles} particleColor={particleColor} />
      )}

      {/* Bubble Main Body */}
      <AnimatePresence
        onExitComplete={() => {
          const isRare = concept.value === 'positive' && Math.abs(concept.points) === 2;
          // Apenas bolhas do nível 4 são consideradas passíveis de colisão no cálculo de respawn
          const isCollidingBubble = concept.zIndex === 21 || concept.zIndex === 22;
          const randomJitter = (Math.random() * 3000) / flightParams.speedMultiplier;
          const respawnDelay = isCollidingBubble ? (isRare ? (25000 / flightParams.speedMultiplier) : (10000 / flightParams.speedMultiplier)) : randomJitter;

          respawnTimeoutRef.current = setTimeout(() => {
            setIsPopped(false);
            setIsFirstRun(false);
            setKey((prev) => prev + 1);
          }, respawnDelay);
        }}
      >
        {!isPopped && (
          <BubbleBody
            concept={concept}
            gameMode={gameMode}
            size={flightParams.size}
            innerKey={key}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
