/**
 * ============================================================================
 * Hook de Chat e Diálogo - usePlocChat.ts
 * ============================================================================
 * Descrição: Máquina de estados, lógica de diálogo scriptado e regras de
 * onboarding gamificado (modo pegadinha, equilíbrio mínimo, equilíbrio supremo).
 * ============================================================================
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { chatService } from '@/modules/chat/services/chatService';
import { usePlocSpeech } from '@/modules/chat/hooks/usePlocSpeech';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '@/modules/blackboard/events/eventBus';

import { attributeEngine } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';
import { useAuthStore } from '@/store/authStore';
import {
  PILLAR_EXPLANATIONS,
  PASSIVE_AGGRESSIVE_QUOTES,
  ONBOARDING_DIALOGUES
} from '../constants/plocPhrases';

export function usePlocChat({ isSleeping }: { isSleeping: boolean } = { isSleeping: false }) {
  const { speak, isSpeaking } = usePlocSpeech();
  const { setAuthModalOpen, isAuthenticated } = useAuthStore();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ploc', text: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [hasSpokenIntro, setHasSpokenIntro] = useState(false);
  const [visiblePlocText, setVisiblePlocText] = useState('');

  // Estados do Jogo Gamificado
  const [gameMode, setGameMode] = useState<'decor' | 'onboarding_game' | 'normal'>('decor');
  const [onboardingStage, setOnboardingStage] = useState<string>('priority'); // priority, corpo, mente, vida, liberdade, proposito, results, fase2
  const [chatStage, setChatStage] = useState(0);
  const [planejeScore, setPlanejeScore] = useState(0);

  const [phase1PopCount, setPhase1PopCount] = useState(0);
  const [tempSelectedPillar, setTempSelectedPillar] = useState<string | null>(null);
  const [showPriorityConfirmButtons, setShowPriorityConfirmButtons] = useState(false);

  const [isGamePaused, setIsGamePaused] = useState(false);
  const [showChoiceButtons, setShowChoiceButtons] = useState(false);
  const [rewardBoxVisible, setRewardBoxVisible] = useState(false);

  const [firstPillarTo5, setFirstPillarTo5] = useState<string | null>(null);
  const [firstPillarTo10, setFirstPillarTo10] = useState<string | null>(null);
  const [hasReachedLvl5, setHasReachedLvl5] = useState(false);
  const [hasReachedLvl10, setHasReachedLvl10] = useState(false);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const lastPassiveSpeechRef = useRef<number>(0);

  // Estados e Refs para Gatilhos do Onboarding
  const [showStartGameButton, setShowStartGameButton] = useState(false);
  const speechEndTimestampRef = useRef<number>(0);
  const startGameButtonTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const speakAndTrack = useCallback((text: string, duration: number, showTriggerButton: boolean = false) => {
    if (startGameButtonTimeoutRef.current) {
      clearTimeout(startGameButtonTimeoutRef.current);
      startGameButtonTimeoutRef.current = null;
    }

    speechEndTimestampRef.current = Date.now() + duration;
    speak(text, duration);

    if (showTriggerButton) {
      setShowStartGameButton(true);
      startGameButtonTimeoutRef.current = setTimeout(() => {
        setShowStartGameButton(false);
      }, 24000);
    } else {
      setShowStartGameButton(false);
    }
  }, [speak]);

  useEffect(() => {
    blackboardEventBus.emit('SHOW_START_GAME_BUBBLE', showStartGameButton);
  }, [showStartGameButton]);

  // Inicialização e Sincronização de Estados com o LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        const completed = localStorage.getItem('ploc_onboarding_completed') === 'true';
        const mode = localStorage.getItem('ploc_game_mode') as 'decor' | 'onboarding_game' | 'normal' || 'decor';
        const savedStage = localStorage.getItem('ploc_onboarding_stage') || 'priority';
        const savedPopCount = parseInt(localStorage.getItem('ploc_phase1_pop_count') || '0', 10);

        if (isAuthenticated || completed) {
          setGameMode('normal');
          localStorage.setItem('ploc_game_mode', 'normal');
          setOnboardingStage('normal');
          setChatStage(3);
          setPhase1PopCount(0);
        } else {
          setGameMode(mode);
          setOnboardingStage(savedStage);
          setPhase1PopCount(savedPopCount);
          if (mode === 'onboarding_game') {
            setChatStage(2);
            attributeEngine.setDemoMode(true);
          } else {
            // Garante que o jogo decorativo comece com as chaves limpas
            localStorage.setItem('ploc_pop_count', '0');
            localStorage.setItem('ploc_pop_cycle_level', '0');
          }
        }

        if (localStorage.getItem('ploc_reward_unlocked') === 'true') {
          setRewardBoxVisible(true);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Sincroniza gameMode e onboardingStage com o localStorage e o EventBus
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ploc_game_mode', gameMode);
      localStorage.setItem('ploc_onboarding_stage', onboardingStage);
      blackboardEventBus.emit('GAME_MODE_CHANGED', gameMode);
      blackboardEventBus.emit('ONBOARDING_STAGE_CHANGED', onboardingStage);
    }
  }, [gameMode, onboardingStage]);

  // Sincroniza phase1PopCount com o localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ploc_phase1_pop_count', phase1PopCount.toString());
    }
  }, [phase1PopCount]);

  // Limpa as chaves temporárias caso o usuário abandone o onboarding
  const cleanupGameStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ploc_pop_count');
      localStorage.removeItem('ploc_pop_cycle_level');
      localStorage.removeItem('ploc_onboarding_stage');
      localStorage.removeItem('ploc_priority_pillar');
      localStorage.removeItem('ploc_pop_sequence');
      localStorage.removeItem('ploc_total_pops');
      localStorage.removeItem('ploc_phase1_pop_count');
      // Restaura os atributos do demo para o valor padrão de diagnóstico
      attributeEngine.syncWithBackend({
        body: 5,
        mind: 5,
        life: 5,
        freedom: 5,
        purpose: 5,
        focoCoins: 0,
        premiumCoins: 0,
        level: 1,
        xp: 0,
        streakDays: 0
      });
    }
  }, []);

  // Falas ricas e diversificadas por pilar para colisão passiva (modo decorativo)
  const PILLAR_QUOTES: Record<'corpo' | 'mente' | 'vida' | 'liberdade' | 'proposito', string[]> = {
    corpo: [
      "Ah, cuidar do templo físico! Dormir bem e se mover é o primeiro passo para ter energia.",
      "Cuidar do templo físico... A maioria só lembra que tem um corpo quando ele começa a dar defeito.",
      "Isso! Movimento é vida. O corpo não foi feito para ficar parado em uma cadeira o dia todo."
    ],
    mente: [
      "Foco total. Silenciar o ruído moderno é o maior superpoder da nossa geração.",
      "Excelente. Menos tempo de tela e mais presença mental deixa tudo mais nítido.",
      "Silenciar o ruído mental... Pensar com clareza na era da distração virou artigo de luxo."
    ],
    vida: [
      "Lazer e risadas! É isso que dá sabor e textura de verdade para os nossos dias.",
      "Tempo de qualidade com quem importa. A vida real acontece fora do trabalho e das planilhas.",
      "Divertir-se com equilíbrio recarrega a alma. Não deixe o trabalho engolir sua existência!"
    ],
    liberdade: [
      "A liberdade de escolha! O maior luxo da vida moderna é poder dizer NÃO.",
      "Organização financeira traz autonomia. Ser dono do seu tempo é a verdadeira riqueza.",
      "A liberdade de dizer não. O escravo moderno tem boletos e excesso de sim na agenda."
    ],
    proposito: [
      "Clareza de direção! Quando você sabe o porquê de estar caminhando, as tempestades não te derrubam.",
      "Missão e sonhos. Alimentar o propósito é o que nos faz pular da cama com brilho nos olhos.",
      "Ter um norte. Sem rumo, qualquer vento forte te arrasta para o colapso."
    ]
  };

  // Obtém a sequência circular de pilares começando pela prioridade escolhida
  const getPhase1Sequence = useCallback(() => {
    const priority = typeof window !== 'undefined' ? localStorage.getItem('ploc_priority_pillar') || 'corpo' : 'corpo';
    const all = ['corpo', 'mente', 'vida', 'liberdade', 'proposito'];
    const idx = all.indexOf(priority);
    if (idx === -1) return all;
    return [...all.slice(idx), ...all.slice(0, idx)];
  }, []);

  // Avança pelos estágios da Fase 1 (Diagnóstico)
  const handleAdvanceOnboardingStage = useCallback(() => {
    const sequence = getPhase1Sequence();
    const currentIdx = sequence.indexOf(onboardingStage);

    if (currentIdx !== -1 && currentIdx < sequence.length - 1) {
      const nextPillar = sequence[currentIdx + 1];
      setOnboardingStage(nextPillar);

      // Mapeamento de diálogos correspondentes ao próximo pilar
      const DIALOG_MAP: Record<string, string[]> = {
        corpo: ONBOARDING_DIALOGUES.phase1Corpo || [],
        mente: ONBOARDING_DIALOGUES.phase1Mente || [],
        vida: ONBOARDING_DIALOGUES.phase1Vida || [],
        liberdade: ONBOARDING_DIALOGUES.phase1Liberdade || [],
        proposito: ONBOARDING_DIALOGUES.phase1Proposito || []
      };

      const nextDialog = DIALOG_MAP[nextPillar];
      const text = (nextDialog[0] || '') + " " + (nextDialog[1] || `Agora vamos analisar os seus hábitos do pilar ${nextPillar.toUpperCase()}.`);
      setChatMessages(prev => [...prev, { sender: 'ploc', text }]);
      speak(text, 8000);
    } else {
      setOnboardingStage('results');

      const attrs = attributeEngine.getAttributes();
      const sorted = (Object.keys(attrs) as Array<keyof typeof attrs>)
        .sort((a, b) => attrs[a] - attrs[b]);
      const minP = sorted[0].toUpperCase();
      const maxP = sorted[sorted.length - 1].toUpperCase();

      const resultsMsg = `Diagnóstico Concluído! 📊 Seu raio-X atual dos pilares:
      💪 Corpo: ${attrs.corpo}/10
      🧠 Mente: ${attrs.mente}/10
      ❤️ Vida: ${attrs.vida}/10
      💸 Liberdade: ${attrs.liberdade}/10
      🎯 Propósito: ${attrs.proposito}/10

      Sua maior força atual é o pilar de ${maxP}! E sua maior vulnerabilidade é o pilar de ${minP}, que precisa de atenção urgente.
      Pronto para iniciar a Fase 2: O Desafio de Equilíbrio Supremo? ⚖️`;

      setChatMessages(prev => [...prev, { sender: 'ploc', text: resultsMsg }]);
      speak(resultsMsg, 16000);
    }
  }, [getPhase1Sequence, onboardingStage, speak]);

  const handleStartOnboardingGame = useCallback(() => {
    cleanupGameStorage();
    setShowStartGameButton(false);
    setGameMode('onboarding_game');
    setOnboardingStage('priority');
    setChatStage(2);
    setIsChatOpen(true);

    const prioText = ONBOARDING_DIALOGUES.intro[3];
    setChatMessages(prev => [...prev, { sender: 'ploc', text: prioText }]);
    speak(prioText, 8000);
  }, [cleanupGameStorage, speak]);

  // Listener para o contador de cliques em bolhas e reações do Ploc
  useEffect(() => {
    const handleBubbleExploded = (data?: {
      word?: string;
      pillar?: 'corpo' | 'mente' | 'vida' | 'liberdade' | 'proposito';
      ref?: string;
      label?: string;
      value?: 'positive' | 'negative' | 'decor';
      points?: number;
      isGameActive?: boolean;
      poppedByUser?: boolean;
      collided?: boolean;
    }) => {
      if (!data) return;
      if (isSleeping) return; // Silêncio absoluto e sem game no sono!

      if (data.ref === 'trigger_onboarding' && data.poppedByUser) {
        handleStartOnboardingGame();
        return;
      }

      const activeMode = localStorage.getItem('ploc_game_mode') || 'decor';
      const completed = localStorage.getItem('ploc_onboarding_completed') === 'true';
      if (completed || isAuthenticated) return;

      // ── 1. REGISTRO ANALÍTICO DE HISTÓRICO DE ESTOUROS ──
      if (typeof window !== 'undefined') {
        const totalPops = parseInt(localStorage.getItem('ploc_total_pops') || '0', 10) + 1;
        localStorage.setItem('ploc_total_pops', totalPops.toString());

        const history = JSON.parse(localStorage.getItem('ploc_pop_sequence') || '[]');
        history.push({
          timestamp: Date.now(),
          pillar: data.pillar,
          ref: data.ref,
          label: data.label,
          value: data.value,
          poppedByUser: !!data.poppedByUser,
          collided: !!data.collided
        });
        localStorage.setItem('ploc_pop_sequence', JSON.stringify(history.slice(-100)));
      }

      // ── 2. LÓGICA EM DIAGNÓSTICO (FASE 1: HÁBITOS) ──
      const phase1Stages = ['corpo', 'mente', 'vida', 'liberdade', 'proposito'];
      if (activeMode === 'onboarding_game' && phase1Stages.includes(onboardingStage) && data.poppedByUser) {
        const nextCount = phase1PopCount + 1;
        setPhase1PopCount(nextCount);

        if (nextCount >= 5) {
          setPhase1PopCount(0);
          localStorage.removeItem('ploc_phase1_pop_count');
          handleAdvanceOnboardingStage();
        }
        return;
      }

      // ── 3. LÓGICA EM MODO DECORATIVO (DECOR) ──
      if (activeMode === 'decor') {
        if (data.collided) {
          // DESATIVADO: Ploc não faz discursos nem fala nada ao colidir com bolhas automáticas flutuantes
          return;
        }

        // Cliques ativos do usuário
        const currentCount = parseInt(localStorage.getItem('ploc_pop_count') || '0', 10) + 1;
        localStorage.setItem('ploc_pop_count', currentCount.toString());

        if (currentCount === 1) {
          const arr = ONBOARDING_DIALOGUES.incentives;
          const msg = arr[Math.floor(Math.random() * arr.length)];
          setChatMessages(prev => [...prev, { sender: 'ploc', text: msg }]);
          setIsChatOpen(true);
          speakAndTrack(msg, 9000, true);
        } else {
          // Cooldown inteligente contado a partir do fim da fala anterior
          const now = Date.now();
          if (isSpeaking || now < speechEndTimestampRef.current + 8000) {
            return;
          }

          const quoteIndex = (currentCount - 2) % ONBOARDING_DIALOGUES.ignoreQuotes.length;
          const ignoreQuote = ONBOARDING_DIALOGUES.ignoreQuotes[quoteIndex];

          setChatMessages(prev => [...prev, { sender: 'ploc', text: ignoreQuote }]);
          setIsChatOpen(true);
          speakAndTrack(ignoreQuote, 12000, true);
        }
        return;
      }

      // ── 4. LÓGICA EM MULTIDIMENSIONAL (FASE 2: GAME) ──
      if (activeMode === 'onboarding_game' && onboardingStage === 'fase2' && data.poppedByUser) {
        const now = Date.now();
        if (now - lastPassiveSpeechRef.current < 8000 || isSpeaking) {
          return;
        }
        lastPassiveSpeechRef.current = now;

        const pilarKey = data.pillar ? data.pillar.toLowerCase() : '';
        const pilarName = data.pillar ? data.pillar.toUpperCase() : 'ATRIBUTO';
        let onboardingMsg = "";

        if (pilarKey && PASSIVE_AGGRESSIVE_QUOTES[pilarKey]) {
          const quotes = PASSIVE_AGGRESSIVE_QUOTES[pilarKey];
          if (data.value === 'negative') {
            const arr = quotes.negative;
            onboardingMsg = arr[Math.floor(Math.random() * arr.length)];
          } else {
            const arr = quotes.positive;
            onboardingMsg = arr[Math.floor(Math.random() * arr.length)];
          }
        } else {
          if (data.value === 'negative') {
            onboardingMsg = `Eita! Estourar essa bolha negativa de ${pilarName} prejudica nossos status! A regra é equilíbrio, sacou?`;
          } else {
            onboardingMsg = `Isso! Somamos pontos para o pilar ${pilarName}! Mas cuidado para não focar demais em um só e esquecer o resto!`;
          }
        }

        if (onboardingMsg) {
          setChatMessages(prev => [...prev, { sender: 'ploc', text: onboardingMsg }]);
          speak(onboardingMsg, 9000);
          setIsChatOpen(true);
        }
      }
    };

    const unsubscribe = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, handleBubbleExploded);
    return () => unsubscribe();
  }, [speak, isAuthenticated, isSpeaking, gameMode, onboardingStage, isSleeping, handleStartOnboardingGame, handleAdvanceOnboardingStage]);

  // Listener para puxão de orelha em estouro desequilibrado (fase 2)
  useEffect(() => {
    const handleUnbalancedPop = () => {
      if (isSleeping) return; // Silêncio absoluto no sono!
      if (onboardingStage === 'fase2') {
        const warningText = "Ei! Focar em um único pilar desmorona os outros! A regra é equilíbrio, busque o balanceamento!";
        speak(warningText, 5000, { queue: true });
        setVisiblePlocText(warningText);
        setTimeout(() => setVisiblePlocText(''), 5000);
      }
    };

    window.addEventListener('ploc_unbalanced_pop', handleUnbalancedPop);
    return () => window.removeEventListener('ploc_unbalanced_pop', handleUnbalancedPop);
  }, [speak, onboardingStage, isSleeping]);

  // Auto-hide legendas
  useEffect(() => {
    const lastMsg = chatMessages.filter(m => m.sender === 'ploc').slice(-1)[0];
    if (lastMsg && isChatOpen) {
      const showTimer = setTimeout(() => {
        setVisiblePlocText(lastMsg.text);
      }, 0);
      const hideTimer = setTimeout(() => {
        setVisiblePlocText('');
      }, 7000);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [chatMessages, isChatOpen]);

  // Auto-scroll da janela de chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages.length, isPending]);

  // Desativa os pontinhos de digitação quando o áudio de fato começa
  useEffect(() => {
    const handleSpeechStart = () => {
      setIsPending(false);
    };
    window.addEventListener('ploc_speech_started', handleSpeechStart);
    return () => window.removeEventListener('ploc_speech_started', handleSpeechStart);
  }, []);

  // Monitora progresso de equilíbrio (Fase 2)
  useEffect(() => {
    if (gameMode === 'onboarding_game' && onboardingStage === 'fase2' && !isGamePaused) {
      const updateScoreFromAttributes = () => {
        const attrs = attributeEngine.getAttributes();
        const values = [attrs.corpo, attrs.mente, attrs.vida, attrs.liberdade, attrs.proposito];

        const pillars: Array<'corpo' | 'mente' | 'vida' | 'liberdade' | 'proposito'> = ['corpo', 'mente', 'vida', 'liberdade', 'proposito'];
        if (!firstPillarTo5) {
          for (const p of pillars) {
            if (attrs[p] >= 5) {
              setFirstPillarTo5(p);
              break;
            }
          }
        }

        if (!firstPillarTo10) {
          for (const p of pillars) {
            if (attrs[p] >= 10) {
              setFirstPillarTo10(p);
              break;
            }
          }
        }

        const completedLvl5 = values.filter(val => val >= 5).length;
        const completedLvl10 = values.filter(val => val >= 10).length;

        // Vitória do Nível 5 (Equilíbrio Mínimo)
        if (completedLvl5 >= 5 && !hasReachedLvl5) {
          setHasReachedLvl5(true);
          setIsGamePaused(true);

          const pilarName = firstPillarTo5 ? firstPillarTo5.toUpperCase() : 'CORPO';
          const minEquilMsg = `Sensacional! Você alcançou o equilíbrio mínimo (todos os pilares no nível 5)! O seu primeiro pilar a se destacar foi o do ${pilarName}. E como estamos falando de harmonia: focar só nele acaba puxando outros pilares pra baixo. Pronto para oficializar seu login ou quer tentar o desafio supremo?`;

          setChatMessages(msgs => [...msgs, { sender: 'ploc', text: minEquilMsg }]);
          speak(minEquilMsg, 12000);

          setShowChoiceButtons(true);
          setIsChatOpen(true);
        }

        // Vitória do Nível 10 (Equilíbrio Supremo)
        if (completedLvl10 >= 5 && !hasReachedLvl10) {
          setHasReachedLvl10(true);
          setGameMode('normal');
          setOnboardingStage('normal');
          localStorage.setItem('ploc_game_mode', 'normal');
          localStorage.setItem('ploc_onboarding_completed', 'true');

          const finalPillarName = firstPillarTo10 ? firstPillarTo10.toUpperCase() : (firstPillarTo5 ? firstPillarTo5.toUpperCase() : 'CORPO');

          localStorage.setItem('ploc_reward_unlocked', 'true');
          localStorage.setItem('ploc_reward_pillar', finalPillarName);

          const maxEquilMsg = `Impressionante! Conquistou o equilíbrio supremo no minijogo! Quero ver você ser bom assim na vida real. Mas não se preocupe: eu vou estar no app de verdade para te puxar a orelha sempre que necessário. Ah, você liberou um presente baseado no seu foco em ${finalPillarName}! A caixa de recompensas já te espera lá dentro. Cadastre-se agora!`;

          setChatMessages(msgs => [...msgs, { sender: 'ploc', text: maxEquilMsg }]);
          speak(maxEquilMsg, 16000);

          setRewardBoxVisible(true);

          setIsChatOpen(true);
        }

        setPlanejeScore(completedLvl5);
      };

      updateScoreFromAttributes();

      const unsubscribe = blackboardEventBus.subscribe(
        BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED,
        updateScoreFromAttributes
      );
      return () => unsubscribe();
    }
  }, [gameMode, onboardingStage, isGamePaused, speak, firstPillarTo5, firstPillarTo10, hasReachedLvl5, hasReachedLvl10]);


  // Inicia oficialmente o minijogo da Fase 2 (Multidimensional)
  const handleStartPhase2 = () => {
    setOnboardingStage('fase2');

    // Zera atributos temporários no motor para o minijogo (começam em 3 de base para que seja um desafio equilibrá-los no nível 5)
    attributeEngine.syncWithBackend({
      body: 3,
      mind: 3,
      life: 3,
      freedom: 3,
      purpose: 3,
      focoCoins: 0,
      premiumCoins: 0,
      level: 1,
      xp: 0,
      streakDays: 0
    });

    const text = ONBOARDING_DIALOGUES.phase2Intro[1] + " " + ONBOARDING_DIALOGUES.phase2Intro[2] + " " + ONBOARDING_DIALOGUES.phase2Intro[3];
    setChatMessages(prev => [...prev, { sender: 'ploc', text }]);
    speak(text, 14000);
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setInputValue('');
    setIsPending(true);

    // Diálogos scriptados do início
    if (chatStage === 0) {
      setTimeout(() => {
        const reply = ONBOARDING_DIALOGUES.intro[1];
        setChatMessages(prev => [...prev, { sender: 'ploc', text: reply }]);
        setChatStage(1);
        setIsPending(false);
        speak(reply, 6000);
      }, 1200);
      return;
    }

    if (chatStage === 1) {
      setTimeout(() => {
        const esporro = ONBOARDING_DIALOGUES.intro[2];
        setChatMessages(prev => [...prev, { sender: 'ploc', text: esporro }]);
        setChatStage(2);
        setIsPending(false);
        speak(esporro, 10000);

        setTimeout(() => {
          cleanupGameStorage();
          setGameMode('onboarding_game');
          setOnboardingStage('priority');
          const prioText = ONBOARDING_DIALOGUES.intro[3];
          setChatMessages(prev => [...prev, { sender: 'ploc', text: prioText }]);
          speak(prioText, 8000);
        }, 10500);
      }, 1200);
      return;
    }

    if (gameMode === 'onboarding_game') {
      setTimeout(() => {
        const reply = "Estoure as bolhas da tela para progredirmos no jogo! Menos papo, mais equilíbrio! ⚖️";
        setChatMessages(prev => [...prev, { sender: 'ploc', text: reply }]);
        setIsPending(false);
        speak(reply, 5000);
      }, 1200);
      return;
    }

    const savedLevel = typeof window !== 'undefined' ? parseInt(localStorage.getItem('ploc_anger_level') || '0', 10) : 0;

    // Se estiver no nível 5 (FURIOSO), recusa todas as tentativas de interação por chat
    if (savedLevel === 5) {
      setTimeout(() => {
        const reply = "NÃO VOU FALAR COM VOCÊ! NÃO TÁ VENDO QUE ESTOU FURIOSO?! 😡👺🔥";
        setChatMessages(prev => [...prev, { sender: 'ploc', text: reply }]);
        setIsPending(false);
        speak(reply, 5000);
      }, 1000);
      return;
    }

    // Se estiver nos níveis 3 ou 4, verifica se é a primeira tentativa naquele nível
    if (savedLevel === 3 || savedLevel === 4) {
      const deniedLevel = typeof window !== 'undefined' ? sessionStorage.getItem('ploc_anger_denied_level') : null;
      if (deniedLevel !== savedLevel.toString()) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('ploc_anger_denied_level', savedLevel.toString());
        }
        setTimeout(() => {
          const reply = savedLevel === 3
            ? "Não quero papo agora. Me deixa em paz! 😠"
            : "ME DEIXA EM PAZ! NÃO VOU RESPONDER NADA! 😡🔥";
          setChatMessages(prev => [...prev, { sender: 'ploc', text: reply }]);
          setIsPending(false);
          speak(reply, 5000);
        }, 1000);
        return;
      }
    }

    // Limpa a primeira tentativa se estiver calmo
    if (savedLevel === 0 && typeof window !== 'undefined') {
      sessionStorage.removeItem('ploc_anger_denied_level');
    }

    try {
      const res = await chatService.sendMessage(text);
      let reply = res.message || "Aparentemente, o filho da puta do desenvolvedor está achando que não preciso ter controle disso, ou seja, vou pedir que ajuste manualmente...";

      // Aplica prefixos baseados nos níveis
      if (savedLevel === 1) {
        const lvl1Prefixes = [
          "Nossa, que chatice... Mas enfim: ",
          "Tô meio amuado com você, mas respondo: ",
          "Humph... se você quer saber: ",
          "Ainda tô um pouco chateado, tá? Mas tudo bem: "
        ];
        const prefix = lvl1Prefixes[Math.floor(Math.random() * lvl1Prefixes.length)];
        reply = prefix + reply;
      } else if (savedLevel === 2) {
        const lvl2Prefixes = [
          "Sinceramente... Mas tudo bem, respondendo sua pergunta: ",
          "Que situação desagradável... Mas aqui está: ",
          "Cara, que frustração... Enfim: ",
          "Não sei nem o que dizer, mas respondo: "
        ];
        const prefix = lvl2Prefixes[Math.floor(Math.random() * lvl2Prefixes.length)];
        reply = prefix + reply;
      } else if (savedLevel === 3) {
        const lvl3Prefixes = [
          "Grrr... Tá bom, tá bom! Olha aqui: ",
          "Você é persistente, hein?! Toma sua resposta: ",
          "Estou muito irritado, mas vou responder para ver se você me deixa quieto: ",
          "Que chateação... só vou falar essa vez: "
        ];
        const prefix = lvl3Prefixes[Math.floor(Math.random() * lvl3Prefixes.length)];
        reply = prefix + reply;
      } else if (savedLevel === 4) {
        const lvl4Prefixes = [
          "SAI DAQUI! QUE RAIVA! Quer saber?! ",
          "EU TÔ QUASE EXPLODINDO! Mas toma isso de uma vez: ",
          "😡 JÁ DISSE QUE NÃO QUERIA FALAR! Mas já que você não para: ",
          "Não aguento mais essa chatice! Lá vai: "
        ];
        const prefix = lvl4Prefixes[Math.floor(Math.random() * lvl4Prefixes.length)];
        reply = prefix + reply;
      }

      setChatMessages(prev => [...prev, { sender: 'ploc', text: reply }]);
      setIsPending(false);
      speak(reply, Math.min(8000, reply.length * 80 + 2000));
    } catch (e) {
      console.error(e);
      setChatMessages(prev => [...prev, { sender: 'ploc', text: "Tive um curto-circuito na conexão. Vamos tentar de novo?" }]);
      setIsPending(false);
    }
  }, [chatStage, gameMode, speak, cleanupGameStorage]);

  // Escuta envio de mensagem vindo da landing page
  useEffect(() => {
    const handleReceivedMsg = (data?: { text?: string }) => {
      if (data && typeof data.text === 'string') {
        handleSendMessage(data.text);
      }
    };
    const unsub = blackboardEventBus.subscribe('SEND_PLOC_MESSAGE', handleReceivedMsg);
    return () => unsub();
  }, [handleSendMessage]);

  // Escuta evento de saída do onboarding game
  useEffect(() => {
    const handleExit = () => {
      cleanupGameStorage();
      setGameMode('decor');
      setOnboardingStage('priority');
      setChatStage(0);
      setChatMessages([]);
      setIsChatOpen(false);
      setShowChoiceButtons(false);
      setShowPriorityConfirmButtons(false);
      setTempSelectedPillar(null);
      setPhase1PopCount(0);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('ploc_anger_denied_level');
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      }
    };

    const unsub = blackboardEventBus.subscribe('EXIT_ONBOARDING_GAME', handleExit);
    return () => unsub();
  }, []);

  const handleOpenIntro = () => {
    if (!isChatOpen && !hasSpokenIntro) {
      setHasSpokenIntro(true);
      setIsPending(true);
      setTimeout(() => {
        const introMsg = ONBOARDING_DIALOGUES.intro[0];
        setChatMessages([{ sender: 'ploc', text: introMsg }]);
        setIsPending(false);
        speak(introMsg, 3000);
      }, 1200);
    }
    setIsChatOpen(!isChatOpen);
  };

  const handleContinuePlaying = () => {
    setIsGamePaused(false);
    setShowChoiceButtons(false);
    const msg = "Ah, quer o desafio supremo então? Excelente. Equilibrar todos no nível 10 é pra poucos. Prossiga!";
    setChatMessages(msgs => [...msgs, { sender: 'ploc', text: msg }]);
    speak(msg, 6000);
  };

  const handleRegisterChoice = () => {
    setShowChoiceButtons(false);
    setIsGamePaused(true);
    setGameMode('normal');
    setOnboardingStage('normal');
    localStorage.setItem('ploc_game_mode', 'normal');
    localStorage.setItem('ploc_onboarding_completed', 'true');
    setAuthModalOpen(true);
  };


  const handleMascotClick = () => {
    const activeMode = localStorage.getItem('ploc_game_mode') || 'decor';
    if (activeMode !== 'decor') return;

    const now = Date.now();
    if (isSpeaking || now < speechEndTimestampRef.current + 3000) return;

    const arr = ONBOARDING_DIALOGUES.clickMascots;
    const clickText = arr[Math.floor(Math.random() * arr.length)];
    setChatMessages(prev => [...prev, { sender: 'ploc', text: clickText }]);
    setIsChatOpen(true);
    speakAndTrack(clickText, 14000, true);
  };

  // Escuta estouro dos TitleBubbles (Easter Egg do nome PLOC)
  useEffect(() => {
    const handleTitleBubblesPopped = () => {
      if (isSleeping) return; // Silêncio absoluto no sono!
      const activeMode = localStorage.getItem('ploc_game_mode') || 'decor';
      if (activeMode !== 'decor') return;

      const bullyingText = ONBOARDING_DIALOGUES.bullyingQuote;
      setChatMessages(prev => [...prev, { sender: 'ploc', text: bullyingText }]);
      setIsChatOpen(true);
      speakAndTrack(bullyingText, 14000, true);
    };

    const unsub = blackboardEventBus.subscribe('TITLE_BUBBLES_POPPED', handleTitleBubblesPopped);
    return () => unsub();
  }, [speakAndTrack, isSleeping]);

  // Listener para seleção de pilar de prioridade
  useEffect(() => {
    const handleSelected = (pillar: unknown) => {
      if (isSleeping) return; // Silêncio absoluto no sono!
      if (onboardingStage !== 'priority') return;

      const pillarStr = String(pillar);
      setTempSelectedPillar(pillarStr);
      setShowPriorityConfirmButtons(true);

      const quotes = PASSIVE_AGGRESSIVE_QUOTES[pillarStr as keyof typeof PASSIVE_AGGRESSIVE_QUOTES]?.positive || [];
      const baseQuote = quotes[0] || `Você selecionou o pilar ${pillarStr.toUpperCase()}.`;
      const explanation = `${baseQuote}\n\nDeseja focar nele? Ou clique em outra bolha para escolher outro.`;

      setChatMessages(prev => [...prev, { sender: 'ploc', text: explanation }]);
      speak(explanation, 12000);
      setIsChatOpen(true);
    };

    const sub = blackboardEventBus.subscribe('PRIORITY_PILLAR_SELECTED', handleSelected);
    return () => sub();
  }, [onboardingStage, speak, isSleeping]);

  const handleConfirmPriorityPillar = () => {
    if (!tempSelectedPillar) return;

    localStorage.setItem('ploc_priority_pillar', tempSelectedPillar);
    blackboardEventBus.emit('PRIORITY_PILLAR_CONFIRMED', tempSelectedPillar);

    setShowPriorityConfirmButtons(false);

    const pillarNameUpper = tempSelectedPillar.toUpperCase();
    const nextSpeech = `Excelente escolha! Agora vamos analisar o pilar do ${pillarNameUpper}. Soltei bolhas com hábitos do seu cotidiano. Estoure 5 bolhas que representam coisas que você REALMENTE faz no seu dia a dia.`;

    setChatMessages(prev => [...prev, { sender: 'ploc', text: nextSpeech }]);
    speak(nextSpeech, 12000);

    setTimeout(() => {
      setOnboardingStage(tempSelectedPillar);
      setPhase1PopCount(0);
    }, 800);
  };

  const handleResetPriorityPillar = () => {
    setTempSelectedPillar(null);
    setShowPriorityConfirmButtons(false);

    blackboardEventBus.emit('PRIORITY_PILLAR_RESET');

    const resetSpeech = "Tudo bem, pode escolher outro pilar então.";
    setChatMessages(prev => [...prev, { sender: 'ploc', text: resetSpeech }]);
    speak(resetSpeech, 5000);
  };

  return {
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
    setGameMode,
    isGamePaused,
    showChoiceButtons,
    rewardBoxVisible,
    setRewardBoxVisible,
    handleContinuePlaying,
    handleRegisterChoice,
    onboardingStage,
    handleAdvanceOnboardingStage,
    handleStartPhase2,
    cleanupGameStorage,
    showStartGameButton,
    handleStartOnboardingGame,
    handleMascotClick,
    tempSelectedPillar,
    showPriorityConfirmButtons,
    handleConfirmPriorityPillar,
    handleResetPriorityPillar,
    phase1PopCount
  };
}
