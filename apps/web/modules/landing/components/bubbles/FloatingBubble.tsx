'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '@/modules/blackboard/events/eventBus';
import { cn } from '@/lib/utils';

// Import newly encapsulated modules
import { FloatingBubbleProps, Particle } from './types';
import { THEME_STYLES } from './constants';
import { playPlocSound } from './audio';
import PopParticles from './PopParticles';
import BubbleBody from './BubbleBody';

// Re-export utility elements for backwards compatibility
export { playPlocSound };
export { getBubbleWordColor, getBubbleIcon, getDecorIcon } from './helpers';
export type { BubbleConcept } from './types';

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

  const flightParams = useMemo(() => {
    const birthSpeedMultiplier = density === 'low' ? 1.0 : (density === 'medium' ? 2.0 : 3.0);
    const sizeJitter = concept.size * (0.85 + Math.random() * 0.3);
    const baseDuration = concept.duration * (0.8 + Math.random() * 0.4);
    const durationJitter = baseDuration / birthSpeedMultiplier;
    const leftJitter = `${Math.random() * 90 + 5}%`;
    const driftJitter = (Math.random() - 0.5) * 240;
    const initialYJitter = typeof window !== 'undefined' ? window.innerHeight + 120 : 1000;
    const delayJitter = isFirstRun ? (concept.delay * 0.3) : 0;

    return {
      size: sizeJitter,
      duration: durationJitter,
      left: leftJitter,
      drift: driftJitter,
      initialY: initialYJitter,
      delay: delayJitter,
      speedMultiplier: birthSpeedMultiplier
    };
  }, [key]);

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
    if (concept.zIndex !== 20 || concept.noCollision || isPopped) return;
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
            collided: true
          });
        }
      }
    }, 60);
    return () => clearInterval(interval);
  }, [key, isPopped, flightParams.size, concept.zIndex]);

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
      animate={{
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
        if (!hasRestarted.current && !isPopped) {
          hasRestarted.current = true;
          setIsFirstRun(false);
          const isRare = concept.word.toUpperCase().startsWith('S');
          const randomJitter = (Math.random() * 3000) / flightParams.speedMultiplier;
          const delayTime = isRare ? (15000 / flightParams.speedMultiplier) : randomJitter;

          respawnTimeoutRef.current = setTimeout(() => {
            if (typeof document !== 'undefined' && (!document.hasFocus() || document.hidden)) {
              const resumeSpawn = () => {
                setKey((prev) => prev + 1);
                window.removeEventListener('focus', resumeSpawn);
              };
              window.addEventListener('focus', resumeSpawn);
            } else {
              setKey((prev) => prev + 1);
            }
          }, delayTime);
        }
      }}
      transition={{
        y: { duration: flightParams.duration, ease: 'linear', delay: flightParams.delay },
        x: { duration: flightParams.duration, ease: 'easeInOut', delay: flightParams.delay }
      }}
      onTap={() => {
        if (!isPopped) {
          setIsPopped(true);
          playPlocSound();

          blackboardEventBus.emit(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, {
            word: concept.word,
            poppedByUser: true
          });
        }
      }}
      className={cn(
        "absolute cursor-pointer will-change-transform",
        isPopped ? "pointer-events-none" : "pointer-events-auto"
      )}
      style={{
        left: flightParams.left,
        width: `${flightParams.size}px`,
        height: `${flightParams.size}px`,
        zIndex: concept.zIndex
      }}
    >
      {/* Pop Particle Fragments */}
      {isPopped && (
        <PopParticles particles={particles} particleColor={particleColor} />
      )}

      {/* Bubble Main Body */}
      <AnimatePresence
        onExitComplete={() => {
          const isRare = concept.word.toUpperCase().startsWith('S');
          const isCollidingBubble = concept.zIndex === 20;
          const randomJitter = (Math.random() * 3000) / flightParams.speedMultiplier;
          const respawnDelay = isCollidingBubble ? (isRare ? (25000 / flightParams.speedMultiplier) : (10000 / flightParams.speedMultiplier)) : randomJitter;

          respawnTimeoutRef.current = setTimeout(() => {
            setIsPopped(false);
            setIsFirstRun(false);
            if (typeof document !== 'undefined' && (!document.hasFocus() || document.hidden)) {
              const resumeExitRespawn = () => {
                setKey((prev) => prev + 1);
                window.removeEventListener('focus', resumeExitRespawn);
              };
              window.addEventListener('focus', resumeExitRespawn);
            } else {
              setKey((prev) => prev + 1);
            }
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
