import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Sparkles, MessageSquare, Send, Mic } from 'lucide-react';

import { PlocAvatarProps } from './types';
import { usePlocState } from './usePlocState';
import { usePlocSpeech } from './usePlocSpeech';
import { PlocFace } from './PlocFace';
import { PlocBubbles } from './PlocBubbles';
import { PlocLimbs } from './PlocLimbs';
import { chatService } from '@/modules/chat/services/chatService';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '@/modules/blackboard/events/eventBus';

import { PILLARS_DATA, IMPACT_ICONS } from '@/modules/routines/data/routinesData';
import { attributeEngine, UserAttributes } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';

function TypewriterText({ text, speed = 25 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayedText('');

    if (!text || text === '...') {
      setDisplayedText(text || '');
      return;
    }

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayedText}</span>;
}

export default function PlocAvatar({
  draggable = true,
  emotion
}: PlocAvatarProps = {}) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const isHidden = pathname === '/settings';

  const { speak } = usePlocSpeech();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    x.set(0);
    y.set(0);
  }, [pathname, x, y]);

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

  // Chat / Dialogue System with Ploc (OpenAI Integration)
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ploc', text: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [hasSpokenIntro, setHasSpokenIntro] = useState(false);
  const [visiblePlocText, setVisiblePlocText] = useState('');

  // States for the mini-game
  const [chatStage, setChatStage] = useState(0);
  const [planejeScore, setPlanejeScore] = useState(0);

  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastMsg = chatMessages.filter(m => m.sender === 'ploc').slice(-1)[0];
    if (lastMsg && isChatOpen) {
      setVisiblePlocText(lastMsg.text);
      const timer = setTimeout(() => {
        setVisiblePlocText('');
      }, 6000); // Esconde a legenda rápido para combinar com a fala curta
      return () => clearTimeout(timer);
    }
  }, [chatMessages, isChatOpen]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages.length, isPending]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setInputValue('');
    setIsPending(true);

    // Hardcoded script for the first two messages
    if (chatStage === 0) {
      setTimeout(() => {
        const reply = "Não quero nem te ouvir, eu sei que você não cuida nem de você, por que acha que vai cuidar de mim?";
        setChatMessages(prev => [...prev, { sender: 'ploc', text: reply }]);
        setIsPending(false);
        setChatStage(1);
        speak(reply, 8000);
      }, 4000);
      return;
    }

    if (chatStage === 1) {
      setTimeout(() => {
        const reply = "Já estou farto disso, muita fala, pouca ação, Se você me ajudar, aí sim eu acredito em você.";
        setChatMessages(prev => [...prev, { sender: 'ploc', text: reply }]);
        setIsPending(false);
        setChatStage(2);
        speak(reply, 8000);
      }, 4000);
      return;
    }

    if (chatStage === 2) {
      setTimeout(() => {
        const reply = "Estoure as bolhas de 'planeje'! Aja, não fale!";
        setChatMessages(prev => [...prev, { sender: 'ploc', text: reply }]);
        setIsPending(false);
        speak(reply, 4000);
      }, 4000);
      return;
    }

    try {
      const res = await chatService.sendMessage(text);
      const reply = res.message || "Não entendi muito bem, mestre. Pode repetir?";

      setChatMessages(prev => [...prev, { sender: 'ploc', text: reply }]);
      speak(reply, Math.min(8000, reply.length * 80 + 2000));
    } catch (e) {
      console.error(e);
      setChatMessages(prev => [...prev, { sender: 'ploc', text: "Tive um curto-circuito na conexão. Vamos tentar de novo?" }]);
    } finally {
      setIsPending(false);
    }
  };

  // Escuta colisões de bolha apenas se estiver no estágio 2 (modo jogo)
  useEffect(() => {
    if (chatStage === 2) {
      const unsubscribe = blackboardEventBus.subscribe(
        BLACKBOARD_EVENTS.BUBBLE_EXPLODED,
        (data: any) => {
          if (data && (data.poppedByUser || data.collided)) {
            const word = data.word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            setPlanejeScore(prev => {
              let newScore = prev;
              if (word === 'planeje' || word === 'planejar' || word === 'planejamento') {
                newScore = prev + 1;
              } else {
                newScore = Math.max(0, prev - 1);
              }

              if (newScore >= 10 && prev < 10) {
                // Vitória
                setChatStage(3);
                const winMsg = "Parabéns, agora confio em você, topa me ajudar?";
                setChatMessages(msgs => [...msgs, { sender: 'ploc', text: winMsg }]);
                speak(winMsg, 6000);
              }

              return newScore;
            });
          }
        }
      );
      return () => unsubscribe();
    }
  }, [chatStage, speak]);

  const attributes = attributeEngine.getAttributes();
  const SIZE = isLanding ? 120 : 80;

  // Cor base do corpo — fica amarelo fraco ao apanhar de bolha e vermelho ao estressar (Cálculos Memoizados para 120FPS)
  const { bodyColor, limbColor, limbShadow } = useMemo(() => {
    const needed = Math.floor(Math.pow(plocState.angerLevel, 3) * 15);
    const progress = plocState.angerClicks / needed;
    const r = Math.floor(56 + (isStressing ? progress * 183 : 0));
    const g = Math.floor(189 - (isStressing ? progress * 121 : 0));
    const b = Math.floor(248 - (isStressing ? progress * 180 : 0));

    const bodyColor = (isPissed || plocState.isHurt)
      ? 'rgba(244, 63, 94, 0.45)'
      : plocState.isHit
        ? 'rgba(251, 191, 36, 0.35)' // Amarelo fraco
        : isStressing
          ? `rgba(${r}, ${g}, ${b}, 0.6)`
          : `rgba(${r}, ${g}, ${b}, 0.35)`;

    const limbColor = isSleeping
      ? '#0f172a'
      : (isPissed || plocState.isHurt ? 'rgba(244, 63, 94, 0.5)' : plocState.isHit ? 'rgba(251, 191, 36, 0.4)' : 'rgba(56, 189, 248, 0.4)');

    const limbShadow = isSleeping
      ? 'none'
      : `0 0 3px ${isPissed || plocState.isHurt ? 'rgba(244, 63, 94, 0.3)' : plocState.isHit ? 'rgba(251, 191, 36, 0.2)' : 'rgba(56, 189, 248, 0.2)'}`;

    return { bodyColor, limbColor, limbShadow };
  }, [plocState.angerClicks, plocState.angerLevel, plocState.isHurt, plocState.isHit, isStressing, isPissed, isSleeping]);

  if (isHidden) return null;
  if (!isMounted) return null;

  return (
    <>
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
          opacity: 0,
          scale: 0.5
        }}
        animate={{
          opacity: isSleeping ? 0.6 : 1,
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
          x,
          y,
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

        {/* Ações Superiores (Microfone e Chat) */}
        {!isSleeping && (
          <div style={{
            position: 'absolute',
            top: '-55px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
          }}>
            <motion.div
              animate={{ y: [3, -3, 3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                display: 'flex',
                gap: '12px',
              }}
            >
              {/* Bolha de Microfone */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(56, 189, 248, 0.2)',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(4px)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Mic size={14} />
              </button>

              {/* Bolha de Texto (...) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isChatOpen && !hasSpokenIntro) {
                    setHasSpokenIntro(true);
                    setIsPending(true); // Liga os "..."
                    setTimeout(() => {
                      const introMsg = 'Veio aqui me dar desculpinhas né?';
                      setChatMessages([{ sender: 'ploc', text: introMsg }]);
                      setIsPending(false);
                      // The gesture from the click allows AudioContext to start!
                      if (speak) speak(introMsg, 3000);
                    }, 4000); // Latência de 4s antes de soltar a patada
                  }
                  setIsChatOpen(!isChatOpen);
                  setShowSimulation(false); // fecha simulação de rotina se aberta
                }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isChatOpen ? '#38bdf8' : 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: isChatOpen ? '#0f172a' : '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(56, 189, 248, 0.2)',
                  transition: 'all 0.2s ease',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  backdropFilter: 'blur(4px)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                ...
              </button>
            </motion.div>
          </div>
        )}

        {/* Camada Interna para Flutuar e Respirar (Separada do Drag) */}
        <motion.div
          animate={{ y: [6, -6, 6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          {/* Mini-game Score Counter */}
          <AnimatePresence>
            {chatStage >= 2 && chatStage < 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: -10, x: '-50%' }}
                animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, scale: 0.5, x: '-50%' }}
                style={{
                  position: 'absolute',
                  bottom: '-35px',
                  left: '50%',
                  background: planejeScore >= 10 ? '#22c55e' : 'rgba(34, 197, 94, 0.3)',
                  border: '2px solid #22c55e',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  zIndex: 1000,
                  boxShadow: planejeScore >= 10 ? '0 0 20px rgba(34,197,94,0.8)' : '0 0 10px rgba(34,197,94,0.3)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>🎯</span> {planejeScore}/10
              </motion.div>
            )}
          </AnimatePresence>
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
              boxShadow: (isPissed || plocState.isHurt)
                ? '0 0 25px rgba(244, 63, 94, 0.45), inset 0 0 12px rgba(255, 255, 255, 0.2)'
                : '0 10px 40px rgba(56, 189, 248, 0.3), inset 0 0 15px rgba(255, 255, 255, 0.2)',
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

      {/* standalone React Portal with its own AnimatePresence for the decoupled chat interface */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isChatOpen && (
            <>
              {/* Texto do Ploc fixado na tela (Top) */}
              <div
                style={{
                  position: 'fixed',
                  top: '15vh',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '90%',
                  maxWidth: '650px',
                  zIndex: 999999,
                  pointerEvents: 'none',
                }}
              >
                <AnimatePresence mode="wait">
                  {(visiblePlocText || isPending) && (
                    <motion.div
                      key={isPending ? 'pending' : visiblePlocText}
                      initial={{ opacity: 0, y: -15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{
                        textAlign: 'center',
                        color: '#ffffff',
                        fontSize: '18px', // Fonte menor
                        fontWeight: 400,
                        lineHeight: '1.5',
                        fontFamily: 'var(--font-sans), Roboto, sans-serif', // Roboto moderno e limpo
                        letterSpacing: '0.5px',
                        padding: '16px 24px',
                        textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.5)', // Adds readability since we removed background
                      }}
                    >
                      {isPending ? (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', alignItems: 'center', height: '27px' }}>
                          <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }} />
                          <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }} />
                          <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }} />
                        </div>
                      ) : (
                        <TypewriterText text={visiblePlocText} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input de texto abaixo do Ploc (Space Evenly look) */}
              <div
                style={{
                  position: 'fixed',
                  bottom: '31vh',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '90%',
                  maxWidth: '460px',
                  zIndex: 999999,
                  pointerEvents: 'auto',
                }}
              >
                <motion.form
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    background: 'rgba(15, 23, 42, 0.45)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.55), inset 0 0 20px rgba(255,255,255,0.02)',
                    borderRadius: '99px',
                    padding: '6px 8px 6px 20px',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Escreva algo para o Ploc..."
                    disabled={isPending}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                      padding: '6px 0',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isPending || !inputValue.trim()}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      cursor: 'pointer',
                      opacity: inputValue.trim() ? 1 : 0.4,
                      transition: 'all 0.2s',
                    }}
                  >
                    <Send size={14} />
                  </button>
                </motion.form>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
