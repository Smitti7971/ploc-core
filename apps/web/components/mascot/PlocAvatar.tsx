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
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Backpack } from 'lucide-react';
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
import { PlocChatOverlay } from './PlocChatOverlay';
import { PlocSleepParticles } from './PlocSleepParticles';
import { PlocShockwaveRings } from './PlocShockwaveRings';
import { PlocAura, PlocHair, PlocHat, PlocClothes } from './PlocCosmetics';
import { PlocFloatingIndicators } from './PlocFloatingIndicators';
import { InventoryModal } from './InventoryModal';

import { PILLARS_DATA } from '@/modules/routines/data/routinesData';
import { attributeEngine } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';
import { usePlocParallax } from './usePlocParallax';
import { usePlocDragSystem } from './usePlocDragSystem';

const containerVariants = {
  hover: (isSleeping: boolean) => ({
    scale: isSleeping ? 1.0 : 1.05,
    transition: { duration: 0.2 }
  }),
  tap: (isSleeping: boolean) => ({
    scale: isSleeping ? 1.0 : 0.98,
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


  const { speak, isSpeaking, isTTSLoading, isSpeakingMouth } = usePlocSpeech();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Parallax transforms for 2D turning effect
  const { facingTargetX, smoothFacingX, faceX, hatHairX, clothesX, bubblesX, shineX } = usePlocParallax();

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

  const { SIZE, bounds } = usePlocResponsive(x, y, isLanding);

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
    isSleeping,
    isPissed,
  } = usePlocState({ emotion, speak, isSpeaking });

  const { hasDraggedRef, onDragStart, onDrag, onDragEnd } = usePlocDragSystem({
    x, y, facingTargetX, SIZE, pathname, isAuthenticated, isSleeping,
    setIsDragging, setIsTapped, setIsHovered, triggerHurt: () => { },
    setFocusedRoutine, setFocusedPillar, setShowSimulation, focusedRoutine
  });

  // A transição de níveis de irritação (squash & stretch) é gerenciada internamente no PlocShockwaveRings
  // que nos repassa via callback.
  const [transitionEffect, setTransitionEffect] = useState<'up' | 'down' | null>(null);

  const [areActionsVisible, setAreActionsVisible] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
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
    isHurt: plocState.isHurt,
    isHit: plocState.isHit ?? false,
    isPositiveHit: plocState.isPositiveHit ?? false,
  });

  if (isHidden) return null;
  if (!isMounted) return null;

  const shouldShake = plocState.isHurt || plocState.isHit;

  // Dynamic breathing/wobble keyframes based on states for gelatinous effect
  const breatheScaleX = plocState.isHurt
    ? [1.08, 1.00, 1.08]
    : [1.07, 1.03, 1.07];

  const breatheScaleY = plocState.isHurt
    ? [0.92, 1.00, 0.92]
    : [0.93, 0.97, 0.93];

  const breatheDuration = plocState.isHurt ? 1.5 : 3.5;

  const breatheX = shouldShake
    ? [0, -3, 3, -3, 3, 0]
    : 0;

  // EscalaX e EscalaY dinâmicas reativas a transições de sono e hover
  const animateScaleX = plocState.isHurt ? [1, 0.9, 1.05, 0.95, 1] : (isSleeping ? [0.95, 0.95, 0.95] : breatheScaleX);
  const animateScaleY = plocState.isHurt ? [1, 1.1, 0.95, 1.05, 1] : (isSleeping ? [0.95, 0.95, 0.95] : breatheScaleY);

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

  const amoebaBorderRadius = "50%";

  // Bloco de Renderização Principal do Avatar do Ploc
  return (
    <>
      {/* Floating Achievement Toast */}
      <PlocAchievementToast toast={achievementToast} />

      {/* Inventory Bag Modal */}
      <InventoryModal isOpen={isBagOpen} onClose={() => setIsBagOpen(false)} />

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
          } : (
            (pathname === '/' && isAuthenticated) ? {
              left: -(250 - (SIZE / 2)),
              right: (250 - (SIZE / 2)),
              top: -(250 - (SIZE / 2)),
              bottom: (250 - (SIZE / 2)),
            } : {
              left: -window.innerWidth + 100,
              right: 30,
              top: -window.innerHeight + 150,
              bottom: 30,
            }
          )
        ) : false}
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
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
        <PlocShockwaveRings setTransitionEffect={setTransitionEffect} />

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
                : { duration: 0.6, ease: "easeInOut" }
          }}
          className="w-full h-full relative"
          style={{ zIndex: 10 }}
        >
          {/* Corpo (Fundo de Vidro) separado para permitir Z-Index das costas */}
          <div
            className="absolute inset-0 border-[1.5px] border-white/20"
            style={{
              borderRadius: 'inherit',
              background: `radial-gradient(circle at 30% 30%, rgba(${stateR}, ${stateG}, ${stateB}, ${stateAlpha}) 0%, rgba(${stateR}, ${stateG}, ${stateB}, ${stateAlpha * 0.57}) 60%, rgba(${stateR}, ${stateG}, ${stateB}, ${stateAlpha * 0.23}) 100%)`,
              boxShadow: shouldShake
                ? `0 0 25px rgba(${stateR}, ${stateG}, ${stateB}, 0.5), inset 0 0 16px rgba(255, 255, 255, 0.4)`
                : `0 15px 35px rgba(${stateR}, ${stateG}, ${stateB}, 0.15), inset 0 0 16px rgba(255, 255, 255, 0.4)`,
              transition: 'background 0.4s ease, box-shadow 0.4s ease',
              zIndex: 10
            }}
          />
          {/* Indicadores Flutuantes Dinâmicos (+1 / -1) */}
          <PlocFloatingIndicators gameMode={gameMode} onboardingStage={onboardingStage} />

          {/* Aura Traseira */}
          {(appearance.aura !== 'none') && (
            <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
              <PlocAura aura={appearance.aura} />
            </div>
          )}

          {/* Cabelo (Sticks out above head) */}
          {appearance.hair !== 'none' && (
            <div className="absolute top-[-22%] left-1/2 -translate-x-1/2 w-full h-[40%] z-20 pointer-events-none flex items-end justify-center">
              <motion.div style={{ x: hatHairX }} className="w-full h-full flex items-end justify-center">
                <PlocHair hair={appearance.hair} />
              </motion.div>
            </div>
          )}

          {/* Chapéu (Sticks out above head/hair) */}
          {appearance.hat !== 'none' && (
            <div className="absolute top-[-38%] left-1/2 -translate-x-1/2 w-full h-[45%] z-30 pointer-events-none flex items-end justify-center">
              <motion.div style={{ x: hatHairX }} className="w-full h-full flex items-end justify-center">
                <PlocHat hat={appearance.hat} />
              </motion.div>
            </div>
          )}

          {/* Partículas de Sono (Zzz...) */}
          <PlocSleepParticles isSleeping={isSleeping} />



          {/* 1. Máscara Circular para elementos internos que precisam de recorte (Brilhos, Roupas, Bolhas internas) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none z-10"
            style={{
              borderRadius: '50%',
              transform: 'translateZ(0)'
            }}
          >
            {/* Fundo do vidro (precisa da margem negativa para não criar listras nas bordas) */}
            <motion.div style={{ x: shineX }} className="absolute -inset-4 pointer-events-none z-[2]">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/35 pointer-events-none" />
            </motion.div>

            {/* Brilhos 3D Especulares (Testa e reflexo inferior) ancorados perfeitamente no corpo */}
            <motion.div style={{ x: shineX }} className="absolute inset-0 pointer-events-none z-[2]">
              <div className="absolute top-[8%] left-[12%] w-[22%] h-[12%] bg-white/70 rounded-full blur-[0.5px] transform -rotate-12 pointer-events-none" />
              <div className="absolute bottom-[6%] right-[16%] w-[15%] h-[8%] bg-white/25 rounded-full blur-[1.5px] transform rotate-45 pointer-events-none" />
            </motion.div>

            {/* Bolhas 3D Internas (Parallax inside gelatinous shell) */}
            <motion.div style={{ x: bubblesX }} className="absolute inset-0 pointer-events-none z-[3]">
              <PlocBubbles />
            </motion.div>

            {/* Roupas do Ploc (Inside gelatin body so it stretches & rotates together) */}
            {appearance.clothes !== 'none' && (
              <div className="absolute bottom-0 left-0 right-0 h-[40%] z-10 pointer-events-none flex items-center justify-center">
                <motion.div style={{ x: clothesX }} className="w-full h-full flex items-center justify-center">
                  <PlocClothes clothes={appearance.clothes} />
                </motion.div>
              </div>
            )}
          </div>

          {/* 2. Elementos Faciais (Olhos, Expressões, Acessórios) — Não recortados para evitar cortes de chapéus/cílios */}
          <motion.div style={{ x: faceX }} className="absolute inset-0 pointer-events-none z-20">
            <PlocFace
              isSleeping={isSleeping}
              isPissed={isPissed}
              isHurt={plocState.isHurt}
              isSpeaking={isSpeakingMouth}
              appearance={appearance}
              isHit={plocState.isHit}
              isPositiveHit={plocState.isPositiveHit}
              isDizzy={emotion === 'dizzy' || plocState.mode === 'dizzy'}
            />
          </motion.div>

          {/* Membros Stick (Perninhas e Braços) */}
          <PlocLimbs
            limbColor={limbColor}
            limbShadow={limbShadow}
            appearance={appearance}
            size={SIZE}
            dragX={smoothFacingX}
          />
        </motion.div>
      </motion.div>

      {/* Botão Fixo de Mochila (Inventário) no Canto Inferior Esquerdo (acima da Navbar) apenas no Blackboard */}
      {!isHidden && !isLanding && pathname === '/' && typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-[90px] left-[25px] z-[99999] pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsBagOpen(!isBagOpen);
            }}
            className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-200 backdrop-blur-md hover:scale-110 hover:bg-white/10 text-orange-400 group"
            title="Inventário (Mochila)"
          >
            <Backpack size={22} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>,
        document.body
      )}

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
