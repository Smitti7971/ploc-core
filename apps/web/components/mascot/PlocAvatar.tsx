/**
 * @module PlocAvatar
 * @description Componente Singleton e orquestrador principal do Mascote Ploc.
 * Agrega todos os ganchos (hooks) lógicos, cosméticos (roupas, chapéus), partes do corpo e
 * interfaces de interação para renderizar o mascote na tela do usuário.
 */

/*
*
 * ============================================================================
 * Avatar Principal do Ploc - PlocAvatar.tsx
 * ============================================================================
 * Descrição: O orquestrador visual e interativo principal do mascote Ploc.
 * Une toda a lógica física, de simulação, diálogo e rendering gráfico em uma
 * experiência imersiva e unificada.
 * 
 * Principais responsabilidades:
 * - Coleta e distribui hooks de estados físicos (`usePlocState`), fala (`usePlocSpeech`) e chat (`usePlocChat`).
 * - Encapsula e posiciona os subcomponentes (`PlocFace`, `PlocLimbs`, `PlocBubbles`, `TypewriterText`).
 * - Controla a física de arrastar e soltar (drag & drop) usando Framer Motion.
 * - Gerencia o portal de chat dark-glassmorphism e o balão de simulação (`PlocSimulationCard`).
 * ============================================================================
 */

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { blackboardEventBus } from '@/modules/blackboard/events/eventBus';

import { PlocAvatarProps, PlocAppearance, DEFAULT_PLOC_APPEARANCE } from './types';
import { usePlocState } from './usePlocState';
import { usePlocSpeech } from './usePlocSpeech';
import { usePlocChat } from './usePlocChat';
import { usePlocResponsive } from './usePlocResponsive';
import { usePlocSpeechRecognition } from './usePlocSpeechRecognition';
import { usePlocColorState } from './usePlocColorState';

import { PlocFace } from './PlocFace';
import { PlocBubbles } from './PlocBubbles';
import { PlocLimbs } from './PlocLimbs';
import { PlocSimulationCard } from './PlocSimulationCard';
import { PlocAchievementToast } from './PlocAchievementToast';
import { PlocActionMenu } from './PlocActionMenu';
import { PlocHumorBar } from './PlocHumorBar';
import { PlocChatOverlay } from './PlocChatOverlay';
import { PlocSleepParticles } from './PlocSleepParticles';
import { PlocShockwaveRings } from './PlocShockwaveRings';
import { PlocAura, PlocHair, PlocHat, PlocClothes } from './PlocCosmetics';
import { PlocFloatingIndicators } from './PlocFloatingIndicators';

import { PILLARS_DATA } from '@/modules/routines/data/routinesData';
import { attributeEngine } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';

const containerVariants = {
  hover: (isSleeping: boolean) => ({
    scale: isSleeping ? 1.0 : 1.05,
    transition: { duration: 0.2 }
  }),
  tap: (isSleeping: boolean) => ({
    scaleX: isSleeping ? 1.0 : 0.95,
    scaleY: isSleeping ? 1.0 : 1.05,
    transition: { duration: 0.1 }
  })
};

// Componente Root Master do Mascote: controla movimento, vida, cores, voz e drag and drop.
export default function PlocAvatar({
  draggable = true, // Se pode ser arrastado com o mouse/dedo (padrão true)
  emotion, // Emoção injetada manualmente (se não houver, ele reage sozinho)
  appearance: propAppearance, // Aparência injetada manualmente (ex: central do ploc)
  renderCustomControls
}: PlocAvatarProps = {}) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const isLanding = pathname === '/' && !isAuthenticated;
  const isHidden = pathname === '/settings';

  const hasDraggedRef = useRef(false); // Ref para evitar clique convencional ao soltar drag!

  const { speak, isSpeaking, isTTSLoading, isSpeakingMouth } = usePlocSpeech();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Observa e carrega a customização ativa do Ploc do localStorage (ou prop)
  const [localAppearance, setLocalAppearance] = useState<PlocAppearance>(DEFAULT_PLOC_APPEARANCE);

  // Bloco useEffect: Observa e carrega a customização ativa do Ploc do localStorage (ou prop) ao carregar
  useEffect(() => {
    if (propAppearance) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalAppearance(propAppearance); // Usa o que veio por prop
      return;
    }
    const handleLoadAppearance = () => {
      const saved = localStorage.getItem('ploc_appearance'); // Puxa visual salvo
      if (saved) {
        try {
          setLocalAppearance(JSON.parse(saved)); // Joga pro state
        } catch { }
      }
    };
    handleLoadAppearance();
    window.addEventListener('storage', handleLoadAppearance); // Sincroniza abas
    return () => window.removeEventListener('storage', handleLoadAppearance);
  }, [propAppearance]);

  const appearance = propAppearance || localAppearance;

  const { isMobile, SIZE } = usePlocResponsive(x, y, isLanding);

  useEffect(() => {
    x.set(0);
    y.set(0);
  }, [pathname, x, y]);

  const {
    isMounted,
    plocState,
    setPlocState,
    focusedRoutine,
    focusedPillar,
    showSimulation,
    setFocusedRoutine,
    setFocusedPillar,
    setShowSimulation,
    isHovered,
    setIsHovered,
    setIsTapped,
    isDragging,
    setIsDragging,
    containerRef,
    triggerHurt,
    handleClick,
    isSleeping,
    isPissed,
    ANGER_LEVELS,
  } = usePlocState({ emotion, speak, isSpeaking });

  // Estados e detecção de transição de níveis de irritação (squash & stretch / shockwave HSL-reativo)
  const [transitionEffect, setTransitionEffect] = useState<'up' | 'down' | null>(null);
  const [shockwaves, setShockwaves] = useState<{ id: string; type: 'up' | 'down'; color: string }[]>([]);
  const prevAngerLevelRef = useRef(plocState.angerLevel);



  useEffect(() => {
    const prev = prevAngerLevelRef.current;
    const current = plocState.angerLevel;
    if (prev !== current) {
      const type = current > prev ? 'up' : 'down';

      // Cor de onda de choque HSL-reativa combinada com o nível alvo
      let waveColor = 'rgba(14, 165, 233, 0.7)'; // Classic blue
      if (type === 'up') {
        waveColor = current === 5 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(249, 115, 22, 0.7)';
      } else {
        waveColor = current === 0 ? 'rgba(45, 212, 191, 0.8)' : 'rgba(14, 165, 233, 0.75)';
      }

      const id = Math.random().toString();
      setShockwaves(prevWaves => [...prevWaves, { id, type, color: waveColor }]);

      setTimeout(() => {
        setShockwaves(prevWaves => prevWaves.filter(w => w.id !== id));
      }, 900);

      setTransitionEffect(type);
      prevAngerLevelRef.current = current;

      const t = setTimeout(() => {
        setTransitionEffect(null);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [plocState.angerLevel]);

  const [areActionsVisible, setAreActionsVisible] = useState(false);
  const [achievementToast, setAchievementToast] = useState<{ title: string; message: string } | null>(null);

  const actionsOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = actionsOverlayRef.current;
    if (!el) return;

    const stopPropagation = (e: Event) => {
      e.stopPropagation();
    };

    el.addEventListener('pointerdown', stopPropagation);
    el.addEventListener('mousedown', stopPropagation);
    el.addEventListener('touchstart', stopPropagation);

    return () => {
      el.removeEventListener('pointerdown', stopPropagation);
      el.removeEventListener('mousedown', stopPropagation);
      el.removeEventListener('touchstart', stopPropagation);
    };
  }, [areActionsVisible]);

  // Partículas de sono flutuantes (Zzz...)
  const [sleepingZs, setSleepingZs] = useState<{ id: string; x: number; scale: number; text: string }[]>([]);

  useEffect(() => {
    if (!isSleeping) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSleepingZs([]);
      return;
    }

    const interval = setInterval(() => {
      const id = Math.random().toString();
      const texts = ['z', 'Z'];
      setSleepingZs(prev => [
        ...prev,
        {
          id,
          x: 45 + Math.random() * 25, // Do meio para a direita perto da cabeça do Ploc
          scale: 0.8 + Math.random() * 0.8,
          text: texts[Math.floor(Math.random() * texts.length)]
        }
      ]);

      setTimeout(() => {
        setSleepingZs(prev => prev.filter(z => z.id !== id));
      }, 3000);
    }, 1200);

    return () => clearInterval(interval);
  }, [isSleeping]);

  // Escuta conquistas destravadas globalmente em tempo real
  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setAchievementToast({
          title: customEvent.detail.title,
          message: customEvent.detail.message
        });
        setTimeout(() => {
          setAchievementToast(null);
        }, 4500);
      }
    };
    window.addEventListener('ploc_toast_notification', handleToast);
    return () => window.removeEventListener('ploc_toast_notification', handleToast);
  }, []);

  // Chat & Minigame centralizado no custom hook usePlocChat
  const {
    isChatOpen,
    setIsChatOpen,
    inputValue,
    setInputValue,
    isPending,
    handleSendMessage,
    gameMode,
    showChoiceButtons,
    handleContinuePlaying,
    handleRegisterChoice,
    onboardingStage,
    handleStartPhase2,
    showPriorityConfirmButtons,
    handleConfirmPriorityPillar,
    phase1PopCount,
  } = usePlocChat({ isSleeping });



  const { isListening, toggleListening } = usePlocSpeechRecognition(handleSendMessage);

  const [currentSpokenText, setCurrentSpokenText] = useState('');
  const [isChatInputVisible, setIsChatInputVisible] = useState(false);

  // Escuta cliques fora para colocar o Ploc no estado "acordado - sem ação" e fechar o input de chat
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (containerRef.current && !containerRef.current.contains(target)) {
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('form') ||
          target.closest('.auth-modal')
        ) {
          return;
        }

        // Se estiver falando, não fechamos abruptamente o chat ou as legendas
        if (isSpeaking) {
          return;
        }

        setAreActionsVisible(false);
        setIsChatInputVisible(false); // Fecha o input de texto ao clicar fora!
        if (isLanding) {
          // Não fechamos o balão de fala do Ploc no clique fora para evitar sumiço precoce das legendas!
          // setIsChatOpen(false); 
          blackboardEventBus.emit('OPEN_LANDING_CHAT', false); // Sincroniza com a página
        }
      }
    };
    document.addEventListener('pointerdown', handleOutsideClick, true);
    return () => document.removeEventListener('pointerdown', handleOutsideClick, true);
  }, [containerRef, isLanding, setIsChatOpen, isSpeaking]);

  useEffect(() => {
    if (isPending || isTTSLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentSpokenText(''); // Limpa o texto anterior enquanto pensa ou carrega a voz
    }
  }, [isPending, isTTSLoading]);

  useEffect(() => {
    let clearTimer: NodeJS.Timeout | null = null;

    const handleSpeechLoading = () => {
      if (clearTimer) clearTimeout(clearTimer);
      setCurrentSpokenText(''); // Limpa o texto quando inicia o carregamento da voz
    };

    const handleSpeechStart = (e: Event) => {
      if (clearTimer) clearTimeout(clearTimer);
      const customEvent = e as CustomEvent;
      setCurrentSpokenText(customEvent.detail.text); // Define o texto exatamente ao ouvir a voz!
    };

    const handleSpeechFinished = () => {
      if (clearTimer) clearTimeout(clearTimer);
      // Mantém a última frase na tela por 2 segundos antes de sumir com fade-out
      clearTimer = setTimeout(() => {
        setCurrentSpokenText('');
      }, 2000);
    };

    window.addEventListener('ploc_speech_loading', handleSpeechLoading);
    window.addEventListener('ploc_speech_started', handleSpeechStart);
    window.addEventListener('ploc_speech_finished', handleSpeechFinished);
    return () => {
      window.removeEventListener('ploc_speech_loading', handleSpeechLoading);
      window.removeEventListener('ploc_speech_started', handleSpeechStart);
      window.removeEventListener('ploc_speech_finished', handleSpeechFinished);
      if (clearTimer) clearTimeout(clearTimer);
    };
  }, []);

  const attributes = attributeEngine.getAttributes();

  const { limbColor, limbShadow, stateR, stateG, stateB, stateAlpha } = usePlocColorState({
    appearance,
    isSleeping,
    angerLevel: plocState.angerLevel,
    isHurt: plocState.isHurt,
    isHit: plocState.isHit ?? false,
    isPositiveHit: plocState.isPositiveHit ?? false,
  });

  if (isHidden) return null;
  if (!isMounted) return null;

  const shouldShake = plocState.angerLevel >= 4 || plocState.isHurt || plocState.isHit;

  // Dynamic breathing/wobble keyframes based on states for gelatinous effect
  const breatheScaleX = isDragging
    ? [1, 1, 1]
    : (plocState.isHurt
      ? [1.08, 1.00, 1.08]
      : [1.07, 1.03, 1.07]
    );

  const breatheScaleY = isDragging
    ? [1, 1, 1]
    : (plocState.isHurt
      ? [0.92, 1.00, 0.92]
      : [0.93, 0.97, 0.93]
    );

  const breatheDuration = plocState.isHurt ? 1.5 : 3.5;

  const breatheX = shouldShake
    ? [0, -3, 3, -3, 3, 0]
    : 0;

  // EscalaX e EscalaY dinâmicas reativas a transições de sono
  const animateScaleX = plocState.isHurt ? [1, 0.9, 1.05, 0.95, 1] : (isHovered ? 1.00 : (isSleeping ? 0.95 : breatheScaleX));
  const animateScaleY = breatheScaleY;

  // Escala dinâmica reativa a transições (squash & stretch) e respiração/dor
  let animateScale: number | number[] = plocState.isHurt ? 1.08 : (isHovered ? 1.05 : (isSleeping ? 0.95 : 1));
  if (transitionEffect === 'up') {
    animateScale = [1, 1.32, 0.85, 1.06, 1];
  } else if (transitionEffect === 'down') {
    animateScale = [1, 0.78, 1.12, 0.95, 1];
  }

  // Rotação dinâmica reativa a transições e raiva/dor (shake)
  let animateRotate: number | number[] = shouldShake ? [0, -2, 2, -2, 2, 0] : 0;
  if (transitionEffect === 'up') {
    animateRotate = [0, -12, 10, -5, 3, 0];
  } else if (transitionEffect === 'down') {
    animateRotate = [0, 8, -6, 3, -1, 0];
  }

  const amoebaBorderRadius = isDragging
    ? "50%"
    : (isSleeping
      ? [
        "52% 48% 54% 46% / 44% 42% 58% 56%",
        "48% 52% 46% 54% / 42% 44% 56% 58%",
        "52% 48% 54% 46% / 44% 42% 58% 56%",
        "52% 48% 54% 46% / 44% 42% 58% 56%"
      ]
      : [
        "50% 50% 48% 48% / 48% 48% 52% 52%",
        "46% 54% 44% 56% / 53% 47% 53% 47%",
        "54% 46% 56% 44% / 47% 53% 47% 53%",
        "50% 50% 48% 48% / 48% 48% 52% 52%"
      ]
    );

  // Bloco de Renderização Principal do Avatar do Ploc
  return (
    <>
      {/* Floating Achievement Toast */}
      <PlocAchievementToast toast={achievementToast} />

      <motion.div
        ref={containerRef}
        id="ploc-singleton-mount"
        custom={isSleeping}
        variants={containerVariants}
        whileHover={isSleeping ? undefined : "hover"}
        whileTap={isSleeping ? undefined : "tap"}
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
          hasDraggedRef.current = true; // Marca que está sendo arrastado!
        }}
        onDrag={(e, info) => {
          if (isSleeping) return;
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
          if (isSleeping) {
            setIsDragging(false);
            setIsTapped(false);
            setIsHovered(false);
            setTimeout(() => {
              hasDraggedRef.current = false;
            }, 150);
            return;
          }
          setIsDragging(false);
          setIsTapped(false);
          setIsHovered(false);
          const threshold = 600;
          if (Math.abs(info.velocity.x) > threshold || Math.abs(info.velocity.y) > threshold) {
            setTimeout(() => { triggerHurt(); }, 150);
          }
          // Limpa o estado de arrasto logo após um pequeno delay para evitar que o clique convencional dispare!
          setTimeout(() => {
            hasDraggedRef.current = false;
          }, 150);
        }}
        onMouseEnter={() => !isSleeping && setIsHovered(true)}
        onMouseLeave={() => !isSleeping && setIsHovered(false)}
        initial={{
          opacity: 0,
          scale: 0.85
        }}
        animate={{
          opacity: isSleeping ? 0.6 : 1,
          scale: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 15,
          opacity: { duration: 2.2, ease: "easeInOut" },
          scale: { duration: 2.2, ease: "easeInOut" }
        }}
        className={`relative select-none touch-none ${isSleeping ? 'cursor-default' : 'cursor-grab'}`}
        style={{
          width: SIZE,
          height: SIZE,
          zIndex: isLanding ? 20 : 999999,
          x,
          y,
        }}
        onClick={(e) => {
          if (hasDraggedRef.current) return; // BLOQUEIA clique se acabou de arrastar!

          // Reseta estados físicos na hora para prevenir qualquer efeito residual "gordo" ou "circular"
          setIsTapped(false);
          setIsHovered(false);

          if (isSleeping) {
            setPlocState(prev => ({
              ...prev,
              mode: 'active'
            }));
            return;
          }

          handleClick(e);

          // Alterna a visibilidade das ações acima da cabeça
          const nextActionsVisible = !areActionsVisible;
          setAreActionsVisible(nextActionsVisible);

          // Se ocultar as ações, esconde também a caixa de digitação
          if (!nextActionsVisible) {
            setIsChatInputVisible(false);
            if (isLanding) {
              blackboardEventBus.emit('OPEN_LANDING_CHAT', false);
            }
          }
        }}
      >
        {/* Balão de Simulação de Rotina */}
        <AnimatePresence>
          {showSimulation && focusedRoutine && focusedPillar && (
            <PlocSimulationCard
              focusedRoutine={focusedRoutine}
              focusedPillar={focusedPillar}
              attributes={attributes}
            />
          )}
        </AnimatePresence>

        {/* Ações Superiores (Microfone, Chat, Sono) */}
        <PlocActionMenu
          ref={actionsOverlayRef}
          isVisible={areActionsVisible}
          isSleeping={isSleeping}
          isListening={isListening}
          isChatInputVisible={isChatInputVisible}
          onToggleListening={toggleListening}
          onToggleChat={() => {
            const nextVisible = !isChatInputVisible;
            setIsChatInputVisible(nextVisible);
            setIsChatOpen(nextVisible);
            if (isLanding) {
              blackboardEventBus.emit('OPEN_LANDING_CHAT', nextVisible);
            }
            setShowSimulation(false);
          }}
          onSleep={() => {
            setPlocState(prev => ({ ...prev, mode: 'sleeping' }));
            setAreActionsVisible(false);
          }}
        />

        {/* Shockwave Rings (Onda de choque HSL-reativa de transição) */}
        <PlocShockwaveRings shockwaves={shockwaves} />

        {/* Camada Interna para Flutuar e Respirar (Separada do Drag) */}
        <motion.div
          animate={{
            y: [6, -6, 6],
            x: breatheX,
            rotate: animateRotate,
            scaleX: animateScaleX,
            scaleY: animateScaleY,
            scale: animateScale,
            borderRadius: amoebaBorderRadius,
          }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            x: shouldShake ? { duration: 0.35, repeat: Infinity, ease: "linear" } : { type: "spring", stiffness: 200, damping: 15 },
            rotate: transitionEffect
              ? { duration: 0.8, ease: "easeInOut" }
              : (shouldShake ? { duration: 0.35, repeat: Infinity, ease: "linear" } : { type: "spring", stiffness: 200, damping: 15 }),
            scaleX: { duration: breatheDuration, repeat: Infinity, ease: "easeInOut" },
            scaleY: { duration: breatheDuration, repeat: Infinity, ease: "easeInOut" },
            scale: transitionEffect
              ? { duration: 0.8, ease: "easeOut" }
              : plocState.isHurt
                ? { type: "spring", stiffness: 240, damping: 9 }
                : { duration: 0.6, ease: "easeInOut" },
            borderRadius: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-full h-full relative border-[1.5px] border-white/20"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            background: `radial-gradient(circle at 30% 30%, rgba(${stateR}, ${stateG}, ${stateB}, ${stateAlpha}) 0%, rgba(${stateR}, ${stateG}, ${stateB}, ${stateAlpha * 0.57}) 60%, rgba(${stateR}, ${stateG}, ${stateB}, ${stateAlpha * 0.23}) 100%)`,
            boxShadow: shouldShake
              ? `0 0 25px rgba(${stateR}, ${stateG}, ${stateB}, 0.5), inset 0 4px 12px rgba(255, 255, 255, 0.45), inset 0 -8px 24px rgba(0, 0, 0, 0.2), inset 0 0 12px rgba(255, 255, 255, 0.18)`
              : `0 15px 45px rgba(${stateR}, ${stateG}, ${stateB}, 0.15), inset 0 4px 12px rgba(255, 255, 255, 0.45), inset 0 -8px 24px rgba(0, 0, 0, 0.2), inset 0 0 12px rgba(255, 255, 255, 0.18)`,
            transition: 'background 0.4s ease, box-shadow 0.4s ease'
          }}
        >
          {/* Indicadores Flutuantes Dinâmicos (+1 / -1) */}
          <PlocFloatingIndicators gameMode={gameMode} onboardingStage={onboardingStage} />

          {/* Aura Traseira */}
          {(appearance.aura !== 'none' || plocState.angerLevel >= 4) && (
            <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
              <PlocAura aura={plocState.angerLevel >= 4 ? 'rage' : appearance.aura} />
            </div>
          )}

          {/* Cabelo (Sticks out above head) */}
          {appearance.hair !== 'none' && (
            <div className="absolute top-[-22%] left-1/2 -translate-x-1/2 w-full h-[40%] z-20 pointer-events-none flex items-end justify-center">
              <PlocHair hair={appearance.hair} />
            </div>
          )}

          {/* Chapéu (Sticks out above head/hair) */}
          {appearance.hat !== 'none' && (
            <div className="absolute top-[-38%] left-1/2 -translate-x-1/2 w-full h-[45%] z-30 pointer-events-none flex items-end justify-center">
              <PlocHat hat={appearance.hat} />
            </div>
          )}

          {/* Partículas de Sono (Zzz...) */}
          <PlocSleepParticles isSleeping={isSleeping} particles={sleepingZs} />



          {/* 1. Máscara Circular para elementos internos que precisam de recorte (Brilhos, Roupas, Bolhas internas) */}
          <motion.div
            animate={{ borderRadius: amoebaBorderRadius }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 overflow-hidden pointer-events-none z-10"
          >
            {/* Brilhos 3D Especulares para Efeito de Vidro e Formism */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/35 pointer-events-none z-[1]" />
            <div className="absolute top-[8%] left-[12%] w-[22%] h-[12%] bg-white/70 rounded-full blur-[0.5px] transform -rotate-12 pointer-events-none z-[2]" />
            <div className="absolute bottom-[6%] right-[16%] w-[15%] h-[8%] bg-white/25 rounded-full blur-[1.5px] transform rotate-45 pointer-events-none z-[2]" />

            {/* Bolhas 3D Internas */}
            <PlocBubbles />

            {/* Roupas do Ploc (Inside gelatin body so it stretches & rotates together) */}
            {appearance.clothes !== 'none' && (
              <div className="absolute bottom-0 left-0 right-0 h-[40%] z-10 pointer-events-none flex items-center justify-center">
                <PlocClothes clothes={appearance.clothes} />
              </div>
            )}
          </motion.div>

          {/* 2. Elementos Faciais (Olhos, Expressões, Acessórios) — Não recortados para evitar cortes de chapéus/cílios */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <PlocFace
              isSleeping={isSleeping}
              isPissed={isPissed}
              isHurt={plocState.isHurt}
              isSpeaking={isSpeakingMouth}
              appearance={appearance}
              angerLevel={plocState.angerLevel}
              angerPercentage={plocState.angerPercentage}
              isHit={plocState.isHit}
              isPositiveHit={plocState.isPositiveHit}
              isDizzy={emotion === 'dizzy' || plocState.mode === 'dizzy'}
            />
          </div>

          {/* Membros Stick (Perninhas e Braços) */}
          <PlocLimbs
            limbColor={limbColor}
            limbShadow={limbShadow}
            appearance={appearance}
            size={SIZE}
          />

          {/* Barra de Humor - Novo Sistema */}
          <PlocHumorBar
            isSleeping={isSleeping}
            angerLevel={plocState.angerLevel}
            angerPercentage={plocState.angerPercentage}
            isPositiveHit={plocState.isPositiveHit ?? false}
            levelLockTimer={plocState.levelLockTimer}
            ANGER_LEVELS={ANGER_LEVELS}
          />


        </motion.div>
      </motion.div>

      {/* Portal React independente com AnimatePresence próprio para a interface de chat desacoplada. */}
      <PlocChatOverlay
        isChatOpen={isChatOpen}
        isChatInputVisible={isChatInputVisible}
        currentSpokenText={currentSpokenText}
        isPending={isPending}
        isTTSLoading={isTTSLoading}
        gameMode={gameMode}
        inputValue={inputValue}
        isLanding={isLanding}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
        customControls={renderCustomControls ? renderCustomControls({
          isChatOpen,
          gameMode,
          showChoiceButtons,
          onboardingStage,
          phase1PopCount,
          showPriorityConfirmButtons,
          handleRegisterChoice,
          handleContinuePlaying,
          handleStartPhase2,
          handleConfirmPriorityPillar
        }) : null}
      />
    </>
  );
}
