/**
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

import { useEffect, useMemo, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Mic, Send, Activity, Brain, Heart, Bird, Flag } from 'lucide-react';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '@/modules/blackboard/events/eventBus';

const PILLAR_ICONS: Record<string, any> = {
  corpo: Activity,
  mente: Brain,
  vida: Heart,
  liberdade: Bird,
  proposito: Flag
};

const PILLAR_COLORS: Record<string, string> = {
  corpo: '#ef4444',
  mente: '#38bdf8',
  vida: '#facc15',
  liberdade: '#2dd4bf',
  proposito: '#c084fc'
};

import { PlocAvatarProps, PlocAppearance, DEFAULT_PLOC_APPEARANCE } from './types';
import { usePlocState } from './usePlocState';
import { usePlocSpeech } from './usePlocSpeech';
import { usePlocChat } from './usePlocChat';
import { PlocFace } from './PlocFace';
import { PlocBubbles } from './PlocBubbles';
import { PlocLimbs } from './PlocLimbs';
import { TypewriterText, ThinkingDots } from './TypewriterText';
import { PlocSimulationCard } from './PlocSimulationCard';

import { PILLARS_DATA } from '@/modules/routines/data/routinesData';
import { attributeEngine } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';

export default function PlocAvatar({
  draggable = true,
  emotion,
  appearance: propAppearance
}: PlocAvatarProps = {}) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const isHidden = pathname === '/settings';

  const hasDraggedRef = useRef(false); // Ref para evitar clique convencional ao soltar drag!

  const { speak, isSpeaking, isTTSLoading, isSpeakingMouth } = usePlocSpeech();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Observa e carrega a customização ativa do Ploc do localStorage (ou prop)
  const [localAppearance, setLocalAppearance] = useState<PlocAppearance>(DEFAULT_PLOC_APPEARANCE);

  useEffect(() => {
    if (propAppearance) {
      setLocalAppearance(propAppearance);
      return;
    }
    const handleLoadAppearance = () => {
      const saved = localStorage.getItem('ploc_appearance');
      if (saved) {
        try {
          setLocalAppearance(JSON.parse(saved));
        } catch (e) {}
      }
    };
    handleLoadAppearance();
    window.addEventListener('storage', handleLoadAppearance);
    return () => window.removeEventListener('storage', handleLoadAppearance);
  }, [propAppearance]);

  const appearance = propAppearance || localAppearance;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileSize = window.innerWidth < 768;
      setIsMobile(isMobileSize);

      // Trazer o Ploc de volta para a tela se o redimensionamento o jogou para fora
      const currentX = x.get();
      const currentY = y.get();
      const sizeVal = isMobileSize ? (isLanding ? 90 : 60) : (isLanding ? 120 : 80);

      let minX, maxX, minY, maxY;

      if (isLanding) {
        // Começa no centro absoluto. O deslocamento máximo permitido a partir do centro
        // é a metade da largura/altura da janela menos a metade do tamanho do Ploc
        const paddingX = sizeVal / 2;
        const paddingY = sizeVal / 2;
        minX = -window.innerWidth / 2 + paddingX;
        maxX = window.innerWidth / 2 - paddingX;
        minY = -window.innerHeight / 2 + paddingY;
        maxY = window.innerHeight / 2 - paddingY;
      } else {
        // Limites fora da landing page (canto inferior direito)
        minX = -window.innerWidth + 100;
        maxX = 30;
        minY = -window.innerHeight + 150;
        maxY = 30;
      }

      // Clamp (limitar) as coordenadas atuais para garantir que o Ploc esteja visível
      const clampedX = Math.max(minX, Math.min(maxX, currentX));
      const clampedY = Math.max(minY, Math.min(maxY, currentY));

      if (currentX !== clampedX) x.set(clampedX);
      if (currentY !== clampedY) y.set(clampedY);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [x, y, isLanding]);

  const [indicators, setIndicators] = useState<any[]>([]);


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
    ANGER_LEVELS,
  } = usePlocState({ emotion, speak });

  const [areActionsVisible, setAreActionsVisible] = useState(false);
  const [achievementToast, setAchievementToast] = useState<{ title: string; message: string } | null>(null);

  // Partículas de sono flutuantes (Zzz...)
  const [sleepingZs, setSleepingZs] = useState<{ id: string; x: number; scale: number; text: string }[]>([]);

  useEffect(() => {
    if (!isSleeping) {
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
    chatMessages,
    inputValue,
    setInputValue,
    isPending,
    chatStage,
    planejeScore,
    visiblePlocText,
    chatScrollRef,
    handleSendMessage,
    handleOpenIntro,
    hasSpokenIntro,
    gameMode,
    showChoiceButtons,
    handleContinuePlaying,
    handleRegisterChoice,
    onboardingStage,
    handleAdvanceOnboardingStage,
    handleStartPhase2,
    showStartGameButton,
    handleStartOnboardingGame,
    handleMascotClick,
    tempSelectedPillar,
    showPriorityConfirmButtons,
    handleConfirmPriorityPillar,
    handleResetPriorityPillar,
    phase1PopCount,
  } = usePlocChat();

  useEffect(() => {
    const isPhase1 = gameMode === 'onboarding_game' && ['corpo', 'mente', 'vida', 'liberdade', 'proposito'].includes(onboardingStage);

    const unsub = blackboardEventBus.subscribe(
      BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED,
      (change: any) => {
        if (isPhase1) return;

        if (!change || !change.pillar || change.diff === 0) return;
        if (change.pillar === 'foco') return;

        const id = Math.random().toString();
        setIndicators(prev => {
          let xOffset = 0;
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            if (last.xOffset === 0) {
              xOffset = change.diff > 0 ? 25 : -25;
            } else {
              xOffset = -last.xOffset;
            }
          }
          return [...prev, {
            id,
            pillar: change.pillar,
            diff: change.diff,
            xOffset
          }];
        });

        setTimeout(() => {
          setIndicators(prev => prev.filter(ind => ind.id !== id));
        }, 1500);
      }
    );

    return () => unsub();
  }, [gameMode, onboardingStage]);

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
  const SIZE = isMobile ? (isLanding ? 90 : 60) : (isLanding ? 120 : 80);

  // Cor base do corpo e membros reativos ao estado de irritação
  const { bodyColor, limbColor, limbShadow, baseR, baseG, baseB } = useMemo(() => {
    // Cores base do corpo baseadas na customização escolhida (Azul Cobalto Frio Premium)
    let baseR = 14;
    let baseG = 144;
    let baseB = 255;

    const chosenColor = appearance?.bodyColor || 'classic';
    if (chosenColor === 'rose') {
      baseR = 244; baseG = 63; baseB = 94;
    } else if (chosenColor === 'gold') {
      baseR = 245; baseG = 158; baseB = 11;
    } else if (chosenColor === 'emerald') {
      baseR = 16; baseG = 185; baseB = 129;
    } else if (chosenColor === 'purple') {
      baseR = 139; baseG = 92; baseB = 246;
    } else if (chosenColor === 'lava') {
      baseR = 239; baseG = 68; baseB = 68;
    }

    let bodyColor = `rgba(${baseR}, ${baseG}, ${baseB}, 0.35)`;

    if (plocState.isHurt) {
      bodyColor = 'rgba(244, 63, 94, 0.45)';
    } else if (plocState.isPositiveHit) {
      bodyColor = 'rgba(16, 185, 129, 0.45)'; // Verde Esmeralda Lindo e Vibrante para positivo!
    } else if (plocState.isHit) {
      bodyColor = 'rgba(251, 191, 36, 0.38)'; // Amarelo fraco temporário
    } else if (plocState.angerLevel === 1) {
      bodyColor = 'rgba(254, 240, 138, 0.42)'; // Level 1: Amarelo Claro
    } else if (plocState.angerLevel === 2) {
      bodyColor = 'rgba(251, 191, 36, 0.48)'; // Level 2: Âmbar / Laranja-Amarelo
    } else if (plocState.angerLevel === 3) {
      bodyColor = 'rgba(249, 115, 22, 0.55)'; // Level 3: Laranja Vivo
    } else if (plocState.angerLevel === 4) {
      bodyColor = 'rgba(239, 68, 68, 0.68)'; // Level 4: Vermelho Vivo
    } else if (plocState.angerLevel === 5) {
      bodyColor = 'rgba(153, 27, 27, 0.85)'; // Level 5: Vermelho Carmesim Escuro (Enfurecido)
    }

    let limbColor = `rgba(${baseR}, ${baseG}, ${baseB}, 0.65)`;
    let limbShadow = `0 0 3px rgba(${baseR}, ${baseG}, ${baseB}, 0.3)`;

    if (isSleeping) {
      limbColor = '#0f172a';
      limbShadow = 'none';
    } else {
      if (plocState.isHurt) {
        limbColor = 'rgba(244, 63, 94, 0.65)';
        limbShadow = '0 0 3px rgba(244, 63, 94, 0.3)';
      } else if (plocState.isPositiveHit) {
        limbColor = 'rgba(16, 185, 129, 0.65)';
        limbShadow = '0 0 3px rgba(16, 185, 129, 0.3)';
      } else if (plocState.isHit) {
        limbColor = 'rgba(251, 191, 36, 0.55)';
        limbShadow = '0 0 3px rgba(251, 191, 36, 0.25)';
      } else if (plocState.angerLevel === 1) {
        limbColor = 'rgba(254, 240, 138, 0.65)';
        limbShadow = '0 0 3px rgba(254, 240, 138, 0.3)';
      } else if (plocState.angerLevel === 2) {
        limbColor = 'rgba(251, 191, 36, 0.65)';
        limbShadow = '0 0 3px rgba(251, 191, 36, 0.3)';
      } else if (plocState.angerLevel === 3) {
        limbColor = 'rgba(249, 115, 22, 0.7)';
        limbShadow = '0 0 3px rgba(249, 115, 22, 0.4)';
      } else if (plocState.angerLevel === 4) {
        limbColor = 'rgba(239, 68, 68, 0.7)';
        limbShadow = '0 0 3px rgba(239, 68, 68, 0.4)';
      } else if (plocState.angerLevel === 5) {
        limbColor = 'rgba(153, 27, 27, 0.8)';
        limbShadow = '0 0 5px rgba(153, 27, 27, 0.5)';
      }
    }

    return { bodyColor, limbColor, limbShadow, baseR, baseG, baseB };
  }, [plocState.angerLevel, plocState.isHurt, plocState.isHit, isSleeping, appearance?.bodyColor]);

  if (isHidden) return null;
  if (!isMounted) return null;

  const shouldShake = plocState.angerLevel >= 4 || plocState.isHurt || plocState.isHit;

  // Dynamic breathing/wobble keyframes based on states for gelatinous effect
  const breatheScaleX = isDragging 
    ? [1, 1, 1] 
    : (isSleeping 
        ? [1.08, 1.04, 1.08] 
        : (plocState.isHurt 
            ? [1.08, 1.00, 1.08] 
            : [1.07, 1.03, 1.07]
          )
      );

  const breatheScaleY = isDragging 
    ? [1, 1, 1] 
    : (isSleeping 
        ? [0.92, 0.96, 0.92] 
        : (plocState.isHurt 
            ? [0.92, 1.00, 0.92] 
            : [0.93, 0.97, 0.93]
          )
      );

  const breatheDuration = isSleeping ? 5 : (plocState.isHurt ? 1.5 : 3.5);

  const breatheRotate = shouldShake 
    ? [0, -2, 2, -2, 2, 0] 
    : 0;

  const breatheX = shouldShake 
    ? [0, -3, 3, -3, 3, 0] 
    : 0;

  const amoebaBorderRadius = isDragging 
    ? "50%"
    : (isSleeping
        ? [
            "52% 48% 54% 46% / 44% 42% 58% 56%",
            "48% 52% 46% 54% / 42% 44% 56% 58%",
            "52% 48% 54% 46% / 44% 42% 58% 56%"
          ]
        : [
            "50% 50% 48% 48% / 48% 48% 52% 52%",
            "46% 54% 44% 56% / 53% 47% 53% 47%",
            "54% 46% 56% 44% / 47% 53% 47% 53%",
            "50% 50% 48% 48% / 48% 48% 52% 52%"
          ]
      );

  return (
    <>
      {/* Floating Achievement Toast */}
      <AnimatePresence>
        {achievementToast && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: -90, scale: 1 }}
            exit={{ opacity: 0, y: -120, scale: 0.8 }}
            className="absolute left-1/2 -translate-x-1/2 w-[220px] bg-slate-950/95 border border-amber-500/50 rounded-2xl p-2.5 shadow-[0_8px_32px_rgba(245,158,11,0.25)] flex flex-col gap-1 items-center text-center z-[9999999] backdrop-blur-[6px]"
          >
            <div className="absolute inset-0 bg-amber-500/5 rounded-2xl animate-pulse pointer-events-none" />
            <div className="text-xl animate-bounce">🏆</div>
            <div className="text-[9.5px] font-black uppercase tracking-wider text-amber-400">Conquista Desbloqueada!</div>
            <div className="text-[11px] font-black text-white leading-tight">{achievementToast.title}</div>
            <div className="text-[9px] text-slate-300 leading-tight font-medium mt-0.5">{achievementToast.message}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={containerRef}
        id="ploc-singleton-mount"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scaleX: 1.15, scaleY: 0.82 }}
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
          // Limpa o estado de arrasto logo após um pequeno delay para evitar que o clique convencional dispare!
          setTimeout(() => {
            hasDraggedRef.current = false;
          }, 150);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{
          opacity: 0,
          scale: 0.5
        }}
        animate={{
          opacity: isSleeping ? 0.6 : 1,
          scale: 1,
        }}
        transition={{
          opacity: { duration: isSleeping ? 0.5 : 2.6, ease: "easeInOut" },
          scale: { duration: 0.5 }
        }}
        className="relative cursor-grab select-none touch-none"
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
          
          handleClick(e);
          setAreActionsVisible(true);

          if (gameMode === 'decor') {
            handleMascotClick();
            return;
          }

          if (isLanding) {
            // Emite evento para abrir o input da landing page
            blackboardEventBus.emit('OPEN_LANDING_CHAT', true);
            // E também abre o chat visual do Ploc para mostrar as falas dele!
            setIsChatOpen(true);
            if (!hasSpokenIntro) {
              handleOpenIntro();
            }
            return;
          }

          // Abre o input de chat ao clicar no Ploc
          if (!isSleeping && plocState.angerLevel < 5) {
            setIsChatInputVisible(true);
            setIsChatOpen(true);
            if (!hasSpokenIntro) {
              handleOpenIntro();
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

        {/* Ações Superiores (Microfone e Chat) */}
        {!isSleeping && areActionsVisible && (
          <div className="absolute top-[-55px] left-1/2 -translate-x-1/2 z-[99999]">
            <motion.div
              animate={{ y: [3, -3, 3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex gap-3"
            >
              {/* Bolha de Microfone */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="w-7 h-7 rounded-full bg-slate-900/85 border border-sky-500/40 text-sky-400 flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(56,189,248,0.2)] transition-all duration-200 backdrop-blur-[4px] hover:scale-110"
              >
                <Mic size={14} />
              </button>

              {/* Bolha de Texto (...) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenIntro();
                  setIsChatInputVisible(!isChatInputVisible);
                  setShowSimulation(false); // fecha simulação de rotina se aberta
                }}
                className={`w-7 h-7 rounded-full border border-sky-500/40 flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(56,189,248,0.2)] transition-all duration-200 backdrop-blur-[4px] hover:scale-110 ${
                  isChatInputVisible ? 'bg-sky-400 text-slate-900' : 'bg-slate-900/85 text-sky-400'
                }`}
              >
                ...
              </button>
            </motion.div>
          </div>
        )}

        {/* Camada Interna para Flutuar e Respirar (Separada do Drag) */}
        <motion.div
          animate={{
            y: [6, -6, 6],
            x: breatheX,
            rotate: breatheRotate,
            scaleX: breatheScaleX,
            scaleY: breatheScaleY,
            scale: plocState.isHurt ? 1.08 : (isHovered ? 1.05 : 1),
            borderRadius: amoebaBorderRadius,
          }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            x: shouldShake ? { duration: 0.35, repeat: Infinity, ease: "linear" } : { type: "spring", stiffness: 200, damping: 15 },
            rotate: shouldShake ? { duration: 0.35, repeat: Infinity, ease: "linear" } : { type: "spring", stiffness: 200, damping: 15 },
            scaleX: { duration: breatheDuration, repeat: Infinity, ease: "easeInOut" },
            scaleY: { duration: breatheDuration, repeat: Infinity, ease: "easeInOut" },
            scale: { type: "spring", stiffness: 240, damping: 9 },
            borderRadius: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-full h-full relative border-[1.5px] border-white/20"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            background: `radial-gradient(circle at 30% 30%, rgba(${baseR}, ${baseG}, ${baseB}, 0.35) 0%, rgba(${baseR}, ${baseG}, ${baseB}, 0.20) 60%, rgba(${baseR}, ${baseG}, ${baseB}, 0.08) 100%)`,
            boxShadow: shouldShake
              ? `0 0 25px rgba(244, 63, 94, 0.5), inset 0 4px 12px rgba(255, 255, 255, 0.45), inset 0 -8px 24px rgba(0, 0, 0, 0.2), inset 0 0 12px rgba(255, 255, 255, 0.18)`
              : `0 15px 45px rgba(${baseR}, ${baseG}, ${baseB}, 0.15), inset 0 4px 12px rgba(255, 255, 255, 0.45), inset 0 -8px 24px rgba(0, 0, 0, 0.2), inset 0 0 12px rgba(255, 255, 255, 0.18)`,
            transition: 'background 0.4s ease, box-shadow 0.4s ease'
          }}
        >
          {/* Indicadores Flutuantes Dinâmicos (+1 / -1) */}
          <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none z-[999999]">
            <AnimatePresence>
              {indicators.map(ind => {
                const Icon = PILLAR_ICONS[ind.pillar];
                const color = PILLAR_COLORS[ind.pillar] || '#fff';
                return (
                  <motion.div
                    key={ind.id}
                    initial={{ opacity: 0, y: 15, scale: 0.6, x: `calc(-50% + ${ind.xOffset}px)` }}
                    animate={{ opacity: 1, y: -45, scale: 1, x: `calc(-50% + ${ind.xOffset}px)` }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ type: 'spring', stiffness: 120, damping: 10, duration: 1.2 }}
                    className="absolute flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border shadow-lg backdrop-blur-[2px] font-black text-[11px]"
                    style={{
                      borderColor: `${color}60`,
                      background: 'rgba(15, 23, 42, 0.85)',
                      color: ind.diff > 0 ? '#4ade80' : '#f87171',
                      boxShadow: `0 4px 12px ${color}30`
                    }}
                  >
                    {Icon && <Icon size={9} style={{ color }} />}
                    <span>{ind.diff > 0 ? `+${ind.diff}` : ind.diff}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Aura Traseira */}
          {(appearance.aura !== 'none' || plocState.angerLevel >= 4) && (
            <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
              {plocState.angerLevel >= 4 ? renderAura('rage') : renderAura(appearance.aura)}
            </div>
          )}

          {/* Cabelo (Sticks out above head) */}
          {appearance.hair !== 'none' && (
            <div className="absolute top-[-22%] left-1/2 -translate-x-1/2 w-full h-[40%] z-20 pointer-events-none flex items-end justify-center">
              {renderHair(appearance.hair)}
            </div>
          )}

          {/* Chapéu (Sticks out above head/hair) */}
          {appearance.hat !== 'none' && (
            <div className="absolute top-[-38%] left-1/2 -translate-x-1/2 w-full h-[45%] z-30 pointer-events-none flex items-end justify-center">
              {renderHat(appearance.hat)}
            </div>
          )}

          {/* Partículas de Sono (Zzz...) */}
          {isSleeping && (
            <div className="absolute inset-0 pointer-events-none z-[1000] overflow-visible">
              <AnimatePresence>
                {sleepingZs.map((z) => (
                  <motion.span
                    key={z.id}
                    initial={{ opacity: 0, y: 10, scale: 0.4, x: `${z.x}%` }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      y: -95,
                      x: [`${z.x}%`, `${z.x + 14}%`, `${z.x + 8}%`],
                      scale: z.scale,
                      color: ['#7dd3fc', '#ffffff', '#7dd3fc', '#ffffff', '#7dd3fc']
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.8, ease: 'easeOut' }}
                    className="absolute font-black select-none"
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 10px rgba(255,255,255,0.4)',
                      fontSize: '26px'
                    }}
                  >
                    {z.text}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}



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
                {renderClothes(appearance.clothes)}
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
              isHit={plocState.isHit}
              isPositiveHit={plocState.isPositiveHit}
            />
          </div>

          {/* Membros Stick (Perninhas e Braços) */}
          <PlocLimbs
            limbColor={limbColor}
            limbShadow={limbShadow}
            appearance={appearance}
          />

          {/* Barrinha de Irritação (Cabo de Guerra) */}
          {!isSleeping && (plocState.angerLevel > 0 || plocState.angerClicks > 0) && (
            <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 w-[76px] flex flex-col items-center gap-0.5 z-[999999] pointer-events-none">
              {/* Progresso visual */}
              <div className="w-full h-1.5 bg-slate-950/85 border border-white/10 rounded-full overflow-hidden p-[0.5px] shadow-lg flex items-center">
                <motion.div
                  className={`h-full rounded-full transition-all duration-150 ${
                    plocState.angerLevel === 5
                      ? 'bg-gradient-to-r from-red-600 via-rose-500 to-red-600 animate-pulse'
                      : plocState.angerLevel === 4
                        ? 'bg-gradient-to-r from-red-500 to-orange-500'
                        : plocState.angerLevel === 3
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                          : plocState.angerLevel === 2
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                            : 'bg-gradient-to-r from-yellow-400 to-emerald-400'
                  }`}
                  style={{
                    width: `${
                      plocState.angerLevel === 5
                        ? (plocState.angerTimer ? (plocState.angerTimer / 300) * 100 : 100)
                        : (plocState.angerClicks / ANGER_LEVELS[plocState.angerLevel].clicksNeeded) * 100
                    }%`
                  }}
                />
              </div>
              {/* Badge indicadora do Nível/Timer */}
              <span className="text-[7px] font-bold text-white tracking-wider uppercase font-mono px-1 py-0.2 rounded bg-slate-950/70 border border-white/5 backdrop-blur-[2px] leading-none whitespace-nowrap">
                {plocState.angerLevel === 5
                  ? `FÚRIA: ${plocState.angerTimer}s`
                  : `LVL ${plocState.angerLevel} (${Math.round((plocState.angerClicks / ANGER_LEVELS[plocState.angerLevel].clicksNeeded) * 100)}%)`}
              </span>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* standalone React Portal with its own AnimatePresence for the decoupled chat interface */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {(isChatOpen || isChatInputVisible) && (
            <>
              {/* Texto do Ploc fixado na tela (Top) */}
              <div className="fixed top-[6vh] sm:top-[12vh] left-1/2 -translate-x-1/2 w-[88%] sm:w-[68%] max-w-[340px] z-[999999] pointer-events-none flex flex-col items-center gap-4 sm:gap-6">
                <AnimatePresence mode="wait">
                  {isChatOpen && (currentSpokenText || isPending || isTTSLoading) && (
                    <div
                      className="bg-slate-950/40 py-3 px-4 shadow-lg w-full pointer-events-none text-center"
                      style={{ borderRadius: '0px', border: 'none' }}
                    >
                      <motion.div
                        key={isPending || isTTSLoading ? 'pending' : currentSpokenText}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="text-white text-[15.5px] font-medium leading-relaxed tracking-wide [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                      >
                        {isPending || isTTSLoading ? (
                          <ThinkingDots />
                        ) : (
                          <TypewriterText text={currentSpokenText} />
                        )}
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                {/* Botões de Escolha do Equilíbrio Mínimo */}
                {isChatOpen && showChoiceButtons && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex gap-4 pointer-events-auto mt-2"
                  >
                    <button
                      onClick={handleRegisterChoice}
                      className="px-6 py-2.5 rounded-full font-bold text-sm tracking-wide text-white bg-emerald-500/25 border border-emerald-400/50 backdrop-blur-[8px] hover:bg-emerald-500/40 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)]"
                    >
                      Cadastrar-se
                    </button>
                    <button
                      onClick={handleContinuePlaying}
                      className="px-6 py-2.5 rounded-full font-bold text-sm tracking-wide text-white/90 bg-white/5 border border-white/20 backdrop-blur-[8px] hover:bg-white/10 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                    >
                      Continuar Jogando
                    </button>
                  </motion.div>
                )}

                {/* Indicador de Progresso de Hábitos (Fase 1) */}
                {isChatOpen && gameMode === 'onboarding_game' && ['corpo', 'mente', 'vida', 'liberdade', 'proposito'].includes(onboardingStage) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="flex flex-col items-center gap-2 mt-2 select-none"
                  >
                    <span className="text-[10px] text-emerald-400 font-extrabold tracking-widest uppercase font-mono bg-slate-900/80 px-4 py-1.5 rounded-full border border-emerald-500/30 backdrop-blur-[6px] shadow-[0_4px_15px_rgba(16,185,129,0.2)]">
                      {onboardingStage.toUpperCase()} • {phase1PopCount}/5
                    </span>
                  </motion.div>
                )}

                {/* Botão de Transição para Fase 2 (Resultados) */}
                {isChatOpen && gameMode === 'onboarding_game' && onboardingStage === 'results' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="pointer-events-auto mt-2"
                  >
                    <button
                      onClick={handleStartPhase2}
                      className="px-8 py-3.5 rounded-full font-bold text-sm tracking-wide text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border border-amber-400/30 backdrop-blur-[8px] hover:scale-105 active:scale-95 transition-all shadow-[0_4px_25px_rgba(245,158,11,0.45)] whitespace-nowrap uppercase font-mono"
                    >
                      Iniciar Fase 2: Desafio de Equilíbrio ⚖️
                    </button>
                  </motion.div>
                )}

                {/* Botões de Confirmação da Prioridade Inicial (Fase 1: Priority) */}
                {isChatOpen && gameMode === 'onboarding_game' && onboardingStage === 'priority' && showPriorityConfirmButtons && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex justify-center pointer-events-auto mt-2"
                  >
                    <button
                      onClick={handleConfirmPriorityPillar}
                      className="px-8 py-2.5 rounded-full font-bold text-sm tracking-wide text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border border-emerald-400/30 backdrop-blur-[8px] hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(16,185,129,0.35)]"
                    >
                      Confirmar
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Input de texto abaixo do Ploc (Space Evenly look) */}
              {isChatInputVisible && !isLanding && gameMode !== 'onboarding_game' && (
                <div className="fixed bottom-[31vh] left-1/2 -translate-x-1/2 w-[90%] max-w-[460px] z-[999999] pointer-events-auto">
                  <motion.form
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage(inputValue);
                    }}
                    className="flex gap-3 bg-slate-900/45 border border-white/12 shadow-[0_8px_32px_rgba(0,0,0,0.55),_inset_0_0_20px_rgba(255,255,255,0.02)] rounded-full py-1.5 pr-2 pl-5 backdrop-blur-[16px]"
                  >
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Escreva algo para o Ploc..."
                      disabled={isPending}
                      className="flex-1 bg-transparent border-none text-white text-sm outline-none py-1.5"
                    />
                    <button
                      type="submit"
                      disabled={isPending || !inputValue.trim()}
                      className={`bg-white/10 border border-white/20 rounded-full w-8 h-8 flex items-center justify-center text-white cursor-pointer transition-all duration-200 ${
                        inputValue.trim() ? 'opacity-100' : 'opacity-40'
                      }`}
                    >
                      <Send size={14} />
                    </button>
                  </motion.form>
                </div>
              )}
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

function renderAura(aura: string) {
  switch (aura) {
    case 'success':
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="absolute w-[200px] h-[200px] rounded-full bg-amber-400/20 blur-2xl mix-blend-screen"
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-[220px] h-[220px] rounded-full border border-amber-400/30 blur-sm mix-blend-screen"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      );
    case 'disaster':
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="absolute w-[200px] h-[200px] rounded-full bg-fuchsia-900/30 blur-2xl mix-blend-screen"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-[180px] h-[180px] rounded-full border-2 border-dashed border-fuchsia-600/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      );
    case 'fire':
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="absolute w-[210px] h-[210px] rounded-full bg-rose-500/20 blur-3xl mix-blend-screen"
            animate={{ y: [0, -12, 0], scaleX: [1, 1.1, 1], scaleY: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      );
    case 'rage':
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
          {/* Intense Crimson Core Glow */}
          <motion.div
            className="absolute w-[220px] h-[220px] rounded-full bg-red-800/40 blur-3xl mix-blend-screen"
            animate={{ scale: [1, 1.3, 0.95, 1.2, 1], opacity: [0.6, 0.9, 0.5, 0.85, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Outer Fiery Wave */}
          <motion.div
            className="absolute w-[240px] h-[240px] rounded-full bg-rose-600/25 blur-2xl mix-blend-screen"
            animate={{ y: [2, -10, 2], scaleX: [1, 1.15, 0.95, 1.1, 1], scaleY: [1, 1.25, 0.9, 1.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Angry Sparks/Embers shooting out */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => (
            <motion.div
              key={`rage-particle-${idx}`}
              className="absolute w-2 h-2.5 bg-red-500 rounded-full blur-[0.5px]"
              style={{ boxShadow: '0 0 8px #dc2626' }}
              animate={{
                x: [0, Math.cos(angle * Math.PI / 180) * 130],
                y: [0, Math.sin(angle * Math.PI / 180) * 130 - 25],
                opacity: [1, 0.8, 0],
                scale: [0.8, 1.6, 0]
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: idx * 0.1,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>
      );
    case 'star':
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <motion.div
              key={`star-particle-${idx}`}
              className="absolute w-2 h-2 bg-sky-300 rounded-full blur-[1px]"
              animate={{
                x: [0, Math.cos(angle * Math.PI / 180) * 110],
                y: [0, Math.sin(angle * Math.PI / 180) * 110],
                opacity: [1, 0],
                scale: [0.8, 1.4, 0]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: idx * 0.2,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>
      );
    default:
      return null;
  }
}

function renderHair(hair: string) {
  switch (hair) {
    case 'pompadour':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 60" fill="none" className="overflow-visible">
          <path
            d="M 12 50 C 4 35, 18 10, 50 15 C 72 18, 86 28, 88 50 C 88 50, 68 40, 50 48 C 32 56, 18 52, 12 50 Z"
            fill="#1e1b4b"
            stroke="#312e81"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'spiky':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 50" fill="none" className="overflow-visible">
          <path
            d="M 8 46 L 24 16 L 36 34 L 50 8 L 64 34 L 76 16 L 92 46 Z"
            fill="#090d16"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'afro':
      return (
        <svg width="105%" height="105%" viewBox="0 0 100 70" fill="none" className="overflow-visible">
          <ellipse cx="50" cy="40" rx="36" ry="26" fill="#180c05" />
          <ellipse cx="26" cy="46" rx="22" ry="18" fill="#180c05" />
          <ellipse cx="74" cy="46" rx="22" ry="18" fill="#180c05" />
          <ellipse cx="50" cy="22" rx="26" ry="20" fill="#180c05" />
        </svg>
      );
    case 'curls':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 50" fill="none" className="overflow-visible">
          <circle cx="25" cy="30" r="12" fill="#d97706" />
          <circle cx="40" cy="20" r="13" fill="#d97706" />
          <circle cx="60" cy="20" r="13" fill="#d97706" />
          <circle cx="75" cy="30" r="12" fill="#d97706" />
        </svg>
      );
    case 'bangs':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 45" fill="none" className="overflow-visible">
          <path
            d="M 12 40 Q 50 12 88 40 Q 72 26 50 40 Q 28 26 12 40 Z"
            fill="#a21caf"
            stroke="#701a75"
            strokeWidth="2.5"
          />
        </svg>
      );
    default:
      return null;
  }
}

function renderHat(hat: string) {
  switch (hat) {
    case 'cap':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 50" fill="none" className="overflow-visible">
          <path d="M 22 42 C 22 18, 78 18, 78 42 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="2.5" />
          {/* Visor */}
          <path d="M 16 38 Q 4 48 30 46" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
          <circle cx="50" cy="24" r="4.5" fill="#ffffff" />
        </svg>
      );
    case 'tophat':
      return (
        <svg width="90%" height="90%" viewBox="0 0 90 70" fill="none" className="overflow-visible">
          {/* Crown */}
          <path d="M 22 50 L 26 10 L 64 10 L 68 50 Z" fill="#111827" stroke="#1f2937" strokeWidth="2" />
          {/* Band */}
          <rect x="23.5" y="42" width="43" height="8" fill="#e11d48" />
          {/* Brim */}
          <ellipse cx="45" cy="52" rx="36" ry="6" fill="#030712" />
        </svg>
      );
    case 'crown':
      return (
        <svg width="80%" height="80%" viewBox="0 0 80 50" fill="none" className="overflow-visible">
          <path
            d="M 8 42 L 12 10 L 28 26 L 40 5 L 52 26 L 68 10 L 72 42 Z"
            fill="#f59e0b"
            stroke="#b45309"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Jewels */}
          <circle cx="40" cy="5" r="4" fill="#ef4444" />
          <circle cx="12" cy="10" r="3" fill="#3b82f6" />
          <circle cx="68" cy="10" r="3" fill="#3b82f6" />
          <rect x="25" y="32" width="6" height="6" fill="#10b981" transform="rotate(45 28 35)" />
          <rect x="49" y="32" width="6" height="6" fill="#10b981" transform="rotate(45 52 35)" />
        </svg>
      );
    case 'beanie':
      return (
        <svg width="90%" height="90%" viewBox="0 0 90 45" fill="none" className="overflow-visible">
          <path d="M 12 40 C 12 15, 78 15, 78 40 Z" fill="#10b981" />
          <rect x="10" y="34" width="70" height="8" rx="4" fill="#047857" />
          {/* Pom pom */}
          <circle cx="45" cy="15" r="7" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1.5" />
        </svg>
      );
    case 'horns':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 50" fill="none" className="overflow-visible">
          <path d="M 22 36 Q 10 24 6 8 Q 18 20 28 32 Z" fill="#ef4444" />
          <path d="M 78 36 Q 90 24 94 8 Q 82 20 72 32 Z" fill="#ef4444" />
        </svg>
      );
    default:
      return null;
  }
}

function renderClothes(clothes: string) {
  switch (clothes) {
    case 'hoodie':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 55" fill="none" className="overflow-visible">
          <path
            d="M 10 50 C 10 20, 90 20, 90 50 Z"
            fill="#06b6d4"
            stroke="#0891b2"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Strings */}
          <path d="M 44 26 L 40 42 M 56 26 L 60 42" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'suit':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 55" fill="none" className="overflow-visible">
          {/* Jacket */}
          <path d="M 10 50 C 10 20, 90 20, 90 50 Z" fill="#0f172a" />
          {/* White shirt triangle */}
          <path d="M 38 18 L 50 38 L 62 18 Z" fill="#ffffff" />
          {/* Bowtie */}
          <path d="M 42 22 L 58 28 L 58 22 M 58 22 L 42 28 L 42 22 Z" fill="#ef4444" />
        </svg>
      );
    case 'cape':
      return (
        <svg width="120%" height="120%" viewBox="0 0 120 70" fill="none" className="overflow-visible opacity-90 mix-blend-screen">
          <path
            d="M 10 60 C 20 20, 100 20, 110 60 C 120 65, 80 50, 60 62 C 40 50, 0 65, 10 60 Z"
            fill="#e11d48"
            stroke="#be123c"
            strokeWidth="2.5"
          />
        </svg>
      );
    case 'armor':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 55" fill="none" className="overflow-visible">
          <path
            d="M 10 50 C 10 20, 90 20, 90 50 Z"
            fill="#94a3b8"
            stroke="#475569"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <rect x="36" y="24" width="28" height="22" rx="4" fill="#334155" />
          <circle cx="50" cy="35" r="4.5" fill="#f59e0b" />
        </svg>
      );
    default:
      return null;
  }
}
