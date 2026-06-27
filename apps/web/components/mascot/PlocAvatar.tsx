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
 * - Encapsula e posiciona os subcomponentes (`PlocFace`, `TypewriterText`).
 * - Controla a física de arrastar e soltar (drag & drop) usando Framer Motion.
 * - Gerencia o portal de chat dark-glassmorphism e o balão de simulação (`PlocSimulationCard`).
 * ============================================================================
 */

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { blackboardEventBus } from '@/modules/blackboard/events/eventBus';

import { PlocAvatarProps, PlocAppearance, DEFAULT_PLOC_APPEARANCE } from './types';
import { usePlocState } from './usePlocState';
import { usePlocSpeech } from '@/modules/chat/hooks/usePlocSpeech';
import { usePlocChat } from '@/modules/chat/hooks/usePlocChat';
import { usePlocResponsive } from './usePlocResponsive';
import { usePlocSpeechRecognition } from '@/modules/chat/hooks/usePlocSpeechRecognition';


import { PlocFace } from './PlocFace';
import { PlocSimulationCard } from '@/modules/blackboard/components/PlocSimulationCard';
import { PlocChatOverlay } from '@/modules/chat/components/PlocChatOverlay';
import { usePlocStateStore } from '@/modules/mascot/store/plocStateStore';

import { PILLARS_DATA } from '@/modules/routines/data/routinesData';
import { attributeEngine } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';



// Componente Root Master do Mascote: controla movimento, vida, cores, voz e drag and drop.
export default function PlocAvatar({
  draggable = true, // Se pode ser arrastado com o mouse/dedo (padrão true)
  emotion, // Emoção injetada manualmente (se não houver, ele reage sozinho)
  appearance: propAppearance, // Aparência injetada manualmente (ex: central do ploc)
  renderCustomControls
}: PlocAvatarProps = {}) {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const isLanding = pathname === '/' && !isAuthenticated;
  const isHidden = pathname === '/settings';


  const { speak, isSpeaking, isTTSLoading, isSpeakingMouth } = usePlocSpeech();



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

  const { SIZE, bounds } = usePlocResponsive(isLanding);

  const {
    isMounted,
    setPlocState,
    focusedRoutine,
    focusedPillar,
    showSimulation,
    setShowSimulation,
    containerRef,
    isSleeping,
  } = usePlocState({ emotion, speak, isSpeaking });



  const [areActionsVisible, setAreActionsVisible] = useState(false);
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

  // Call hook before any early returns (return primitive to avoid infinite loop)
  const { hunger, thirst, fatigue } = usePlocStateStore();
  const vitalsAvg = (hunger + thirst + fatigue) / 3;

  const isSick = vitalsAvg < 30;

  let stateR = 255, stateG = 255, stateB = 255;
  if (isSick) {
    stateR = 100; stateG = 150; stateB = 200;
  } else {
    switch (appearance?.bodyColor) {
      case 'rose': stateR = 255; stateG = 180; stateB = 200; break;
      case 'gold': stateR = 255; stateG = 215; stateB = 0; break;
      case 'emerald': stateR = 80; stateG = 200; stateB = 120; break;
      case 'purple': stateR = 147; stateG = 112; stateB = 219; break;
      case 'lava': stateR = 255; stateG = 69; stateB = 0; break;
      case 'classic':
      default:
        stateR = 255; stateG = 255; stateB = 255; break;
    }
  }

  if (isHidden) return null;
  if (!isMounted) return null;



  // Bloco de Renderização Principal do Avatar do Ploc
  return (
    <>

      <div
        ref={containerRef}
        id="ploc-singleton-mount"
        style={{
          width: SIZE,
          height: SIZE,
          zIndex: isLanding ? 20 : 'var(--z-index-mascot)',
        }}
        onClick={(e) => {
          if (isSleeping) {
            setPlocState(prev => ({
              ...prev,
              mode: 'active'
            }));
            return;
          }

          const nextVisible = !isChatInputVisible;
          setIsChatInputVisible(nextVisible);
          setIsChatOpen(nextVisible);
          if (isLanding) {
            blackboardEventBus.emit('OPEN_LANDING_CHAT', nextVisible);
          }
          setShowSimulation(false);
        }}
      >
        {/* Balão de Simulação de Rotina */}
        {showSimulation && focusedRoutine && focusedPillar && (
          <PlocSimulationCard
            focusedRoutine={focusedRoutine}
            focusedPillar={focusedPillar}
            attributes={attributes}
          />
        )}



        {/* Shockwave Rings removed */}

        {/* Camada Interna para Flutuar e Respirar (Separada do Drag) */}
        <div


          className="w-full h-full relative"
          style={{ zIndex: 10 }}
        >
          {/* Corpo Sólido (Sem vidro ou transparência) */}
          <div
            className="absolute inset-0"
            style={{
              borderRadius: '50%',
              zIndex: 10,
              backgroundColor: `rgb(${stateR}, ${stateG}, ${stateB})`,
            }}
          />

          {/* 2. Elementos Faciais (Olhos, Expressões, Acessórios) */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <PlocFace />
          </div>

          {/* Limbs removed per user request */}
        </div>
      </div>

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
