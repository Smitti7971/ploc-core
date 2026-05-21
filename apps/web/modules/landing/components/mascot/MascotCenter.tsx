'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import PlocAvatar from '@/components/mascot/PlocAvatar';
import { blackboardEventBus } from '@/modules/blackboard/events/eventBus';
import { TitleBubble } from '../bubbles';

export function MascotCenter() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [entryFinished, setEntryFinished] = useState(false);
  const [poppedLetters, setPoppedLetters] = useState<number[]>([]);

  const popTimeoutsRef = React.useRef<NodeJS.Timeout[]>([]);
  const isManualPopRef = React.useRef(false);

  // Gera uma ordem aleatória de surgimento estável para as 4 letras [0, 1, 2, 3] no mount
  // Garante que o index do primeiro a nascer (spawnOrder[0]) seja sempre maior que o do último (spawnOrder[3])
  const spawnOrder = useMemo(() => {
    let order = [0, 1, 2, 3];
    while (true) {
      order.sort(() => Math.random() - 0.5);
      if (order[0] > order[3]) {
        break;
      }
    }
    return order;
  }, []);

  const popBubble = (i: number, isManual = false) => {
    if (isManual) {
      isManualPopRef.current = true;
      popTimeoutsRef.current.forEach(clearTimeout);
      popTimeoutsRef.current = [];
    }
    setPoppedLetters(prev => prev.includes(i) ? prev : [...prev, i]);
  };

  useEffect(() => {
    if (poppedLetters.length === 4 && isManualPopRef.current) {
      blackboardEventBus.emit('TITLE_BUBBLES_POPPED');
    }
  }, [poppedLetters]);

  useEffect(() => {
    const unsub = blackboardEventBus.subscribe('OPEN_LANDING_CHAT', (open: boolean) => {
      setIsChatOpen(open);
    });

    const shuffled = [0, 1, 2, 3].sort(() => Math.random() - 0.5);

    // Cinematic Timing Sequence:
    // - Ploc rises slowly for 5.0s.
    // - Ploc wakes up gracefully at 1.25s (1/4 of rising duration) while still rising!
    const wakeTimeout = setTimeout(() => {
      setIsEntering(false); // Triggers waking up mid-rise!
    }, 1250);

    // Auto-pop sequence starts much later at 8.5s, giving user time to play/pop manually!
    // Explodes the remaining bubbles in a rapid, satisfying chain sequence (400ms interval)
    const popTimeouts = [
      setTimeout(() => popBubble(shuffled[0]), 8500),
      setTimeout(() => popBubble(shuffled[1]), 8900),
      setTimeout(() => popBubble(shuffled[2]), 9300),
      setTimeout(() => popBubble(shuffled[3]), 9700),
    ];
    popTimeoutsRef.current = popTimeouts;

    return () => {
      unsub();
      clearTimeout(wakeTimeout);
      popTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const titleLetters = ['P', 'L', 'O', 'C'];

  return (
    <>
      {/* 1. Contêiner do mascote centralizado na tela */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-[350px] h-[350px] pointer-events-none z-20"
      >

        {/* As Bolhas com o Nome "P-L-O-C" flutuando acima da cabeça (Sway & overlap) - Static position */}
        <div className="absolute -top-[30px] left-1/2 -translate-x-1/2 flex -space-x-6 pointer-events-none z-20">
          {titleLetters.map((letter, i) => (
            <TitleBubble
              key={i}
              letter={letter}
              index={i}
              seqIndex={spawnOrder.indexOf(i)}
              isPopped={poppedLetters.includes(i)}
              onClick={() => popBubble(i, true)}
            />
          ))}
        </div>

        {/* O Ploc */}
        <motion.div
          className="pointer-events-auto relative"
          initial={{ scale: 0.8, opacity: 0, y: 600 }}
          animate={entryFinished ? {
            scale: 1,
            opacity: 1,
            y: 0,
            transform: 'none'
          } : {
            scale: 1,
            opacity: 1,
            y: 0
          }}
          onAnimationComplete={() => {
            setEntryFinished(true);
          }}
          transition={{
            scale: { duration: 5.0, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 5.0, ease: [0.16, 1, 0.3, 1] },
            y: { duration: 5.0, ease: [0.16, 1, 0.3, 1] }
          }}
        >
          <PlocAvatar emotion={isEntering ? 'sleeping' : 'calm'} />
        </motion.div>
      </div>
    </>
  );
}
