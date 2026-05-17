import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';

import { PlocAvatarProps } from './types';
import { usePlocState } from './usePlocState';
import { usePlocSpeech } from './usePlocSpeech';
import { PlocFace } from './PlocFace';
import { PlocBubbles } from './PlocBubbles';
import { PlocLimbs } from './PlocLimbs';

import { PILLARS_DATA, IMPACT_ICONS } from '@/modules/routines/data/routinesData';
import { attributeEngine, UserAttributes } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';

export default function PlocAvatar({ 
  draggable = true,
  emotion 
}: PlocAvatarProps = {}) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const isHidden = pathname === '/settings';

  const { speak } = usePlocSpeech();
  
  const {
    isMounted,
    plocState,
    focusedRoutine,
    focusedPillar,
    showSimulation,
    setFocusedRoutine,
    setFocusedPillar,
    setShowSimulation,
    isHovered,
    setIsHovered,
    isTapped,
    setIsTapped,
    isDragging,
    setIsDragging,
    containerRef,
    triggerHurt,
    handleClick,
    isSleeping,
    isPissed,
    isStressing,
  } = usePlocState({ emotion, speak });

  const attributes = attributeEngine.getAttributes();
  const SIZE = isLanding ? 120 : 80;

  // Cor base do corpo — fica vermelho ao estressar (Cálculos Memoizados para 120FPS)
  const { bodyColor, limbColor, limbShadow } = useMemo(() => {
    const needed = Math.floor(Math.pow(plocState.angerLevel, 3) * 15);
    const progress = plocState.angerClicks / needed;
    const r = Math.floor(56  + (isStressing ? progress * 183 : 0));
    const g = Math.floor(189 - (isStressing ? progress * 121 : 0));
    const b = Math.floor(248 - (isStressing ? progress * 180 : 0));
    
    const bodyColor = (isPissed || plocState.isHurt)
      ? 'rgba(239, 68, 68, 0.7)' 
      : isStressing
        ? `rgba(${r}, ${g}, ${b}, 0.6)`
        : `rgba(${r}, ${g}, ${b}, 0.35)`;

    const limbColor = isSleeping 
      ? '#0f172a' 
      : (isPissed || plocState.isHurt ? 'rgba(239, 68, 68, 0.5)' : 'rgba(56, 189, 248, 0.4)');
      
    const limbShadow = isSleeping 
      ? 'none' 
      : `0 0 3px ${isPissed || plocState.isHurt ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.2)'}`; 

    return { bodyColor, limbColor, limbShadow };
  }, [plocState.angerClicks, plocState.angerLevel, plocState.isHurt, isStressing, isPissed, isSleeping]);

  if (isHidden) return null;
  if (!isMounted) return null;

  return (
    <motion.div
      ref={containerRef}
      id="ploc-singleton-mount"
      drag={draggable}
      dragConstraints={typeof window !== 'undefined' ? (
        isLanding ? {
          left: -window.innerWidth / 2 + ((pathname as string) === '/dashboard' ? 60 : 90),
          right: window.innerWidth / 2 - ((pathname as string) === '/dashboard' ? 60 : 90),
          top: -window.innerHeight / 2 + ((pathname as string) === '/dashboard' ? 60 : 90),
          bottom: window.innerHeight / 2 - ((pathname as string) === '/dashboard' ? 60 : 90),
        } : {
          left: -window.innerWidth + 100,
          right: 30,
          top: -window.innerHeight + 150,
          bottom: 30,
        }
      ) : false}
      dragElastic={0.2}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      onDragStart={() => {
        setIsDragging(true);
        setIsTapped(false);
      }}
      onDrag={(e, info) => {
        // Detecção de card sob o Ploc
        const el = document.elementFromPoint(info.point.x, info.point.y);
        const card = el?.closest('[data-routine-id]');
        if (card) {
          const rId = card.getAttribute('data-routine-id');
          const pId = card.getAttribute('data-pillar-id');
          if (rId && pId && PILLARS_DATA[pId]) {
            const routine = PILLARS_DATA[pId].options.find(o => o.id === rId);
            if (routine && routine.id !== focusedRoutine?.id) {
              setFocusedRoutine(routine);
              setFocusedPillar(pId);
            }
          }
        } else if (focusedRoutine) {
          setFocusedRoutine(null);
          setFocusedPillar(null);
          setShowSimulation(false);
        }
      }}
      onDragEnd={(e, info) => {
        setIsDragging(false);
        setIsTapped(false);
        setIsHovered(false);
        const threshold = 600;
        if (Math.abs(info.velocity.x) > threshold || Math.abs(info.velocity.y) > threshold) {
          setTimeout(() => { triggerHurt(); }, 150); 
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsTapped(false);
      }}
      onMouseDown={() => setIsTapped(true)}
      onMouseUp={() => setIsTapped(false)}
      onTouchStart={() => setIsTapped(true)}
      onTouchEnd={() => setIsTapped(false)}
      initial={{ 
        x: 0, 
        y: 0, 
        opacity: 0,
        scale: 0.5 
      }}
      animate={{ 
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 }
      }}
      style={{
        position: 'relative',
        width: SIZE,
        height: SIZE,
        zIndex: isLanding ? 20 : 999999,
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none',
        opacity: isSleeping ? 0.6 : 1,
      }}
      onClick={handleClick}
    >
      {/* Balão de Simulação de Rotina */}
      <AnimatePresence>
        {showSimulation && focusedRoutine && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            style={{
              position: 'absolute',
              bottom: '125%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '260px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 15px rgba(56,189,248,0.1)',
              borderRadius: '16px',
              padding: '16px',
              zIndex: 99999,
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}>
                {focusedPillar && (IMPACT_ICONS as any)[focusedPillar] ? (
                  (() => {
                    const IconComp = (IMPACT_ICONS as any)[focusedPillar];
                    return <IconComp size={16} />;
                  })()
                ) : (
                  <Sparkles size={16} />
                )}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {focusedPillar === 'corpo' ? 'Corpo' : focusedPillar === 'mente' ? 'Mente' : focusedPillar === 'vida' ? 'Vida' : focusedPillar === 'liberdade' ? 'Liberdade' : 'Propósito'}
                </span>
                <span style={{ fontSize: '12px', color: '#f8fafc', fontWeight: 600 }}>
                  {focusedRoutine.title}
                </span>
              </div>
            </div>

            {/* Descrição */}
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
              {focusedRoutine.desc}
            </p>

            {/* Impacto Previsto */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '8px',
              padding: '8px 10px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <span style={{ fontSize: '9px', color: '#64748b', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                Impacto Previsto (Se Realizado):
              </span>
              <div style={{ display: 'flex', gap: '12px' }}>
                {focusedRoutine.impacts.map((impact) => {
                  const key = impact.pilar;
                  const val = impact.val;
                  const currentVal = attributes[key] || 0;
                  const targetVal = Math.min(100, Math.max(0, currentVal + val));
                  const isPositive = val >= 0;
                  
                  return (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '10px', color: '#e2e8f0', textTransform: 'capitalize' }}>
                        {key === 'corpo' ? 'Corpo' : key === 'mente' ? 'Mente' : key === 'vida' ? 'Vida' : key === 'liberdade' ? 'Liberdade' : 'Propósito'}:
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: isPositive ? '#10b981' : '#ef4444' }}>
                        {currentVal}% → {targetVal}% ({isPositive ? '+' : ''}{val}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camada Interna para Flutuar e Respirar (Separada do Drag) */}
      <motion.div
        animate={{ y: [6, -6, 6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        {/* Corpo Gelatinoso do Ploc */}
        <motion.div
          className={(isPissed || plocState.isHurt)
            ? 'ploc-body-shake ploc-gelatin-pissed-anim' 
            : 'ploc-gelatin-breathe-anim'
          }
          animate={{
            backgroundColor: bodyColor,
            scale: isDragging ? 1 : (isTapped ? 0.90 : (isHovered ? 1.06 : 1)),
            scaleX: isDragging ? 1 : (isTapped ? 1.20 : (isHovered ? 1.03 : (isSleeping ? 1.04 : 1))),
            scaleY: isDragging ? 1 : (isTapped ? 0.80 : (isHovered ? 0.97 : (isSleeping ? 0.96 : 1))),
            rotate: isDragging ? 0 : (isTapped ? [0, -3, 3, 0] : 0),
          }}
          transition={{ 
            backgroundColor: { duration: 0.4 },
            scaleX: { type: "spring", stiffness: 180, damping: 9, mass: 0.4 },
            scaleY: { type: "spring", stiffness: 180, damping: 9, mass: 0.4 },
            scale: { type: "spring", stiffness: 200, damping: 12 },
            rotate: { type: "tween", duration: 0.35, ease: "easeInOut" }
          }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.4)',
            overflow: 'hidden',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            filter: isSleeping ? 'brightness(0.5) saturate(0.8)' : 'none',
            boxShadow: isPissed
              ? '0 0 40px rgba(239,68,68,0.8), inset 0 0 20px rgba(255,255,255,0.3)'
              : '0 10px 40px rgba(56,189,248,0.3), inset 0 0 15px rgba(255,255,255,0.2)',
          }}
        >
          {/* Bolhas 3D Internas */}
          <PlocBubbles />

          {/* Olhos e Expressões Faciais */}
          <PlocFace 
            isSleeping={isSleeping} 
            isPissed={isPissed} 
            isHurt={plocState.isHurt} 
          />
        </motion.div>

        {/* Membros Stick (Perninhas e Braços) */}
        <PlocLimbs 
          limbColor={limbColor} 
          limbShadow={limbShadow} 
        />
      </motion.div>
    </motion.div>
  );
}
