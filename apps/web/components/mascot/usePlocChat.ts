/**
 * ============================================================================
 * Hook de Chat e Diálogo - usePlocChat.ts
 * ============================================================================
 * Descrição: Máquina de estados, lógica de diálogo scriptado e regras de
 * onboarding gamificado (modo pegadinha, equilíbrio mínimo, equilíbrio supremo).
 * ============================================================================
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { chatService } from '@/modules/chat/services/chatService';
import { usePlocSpeech } from './usePlocSpeech';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '@/modules/blackboard/events/eventBus';
import { triggerAchievementUnlock } from './achievements';
import { attributeEngine } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';
import { useAuthStore } from '@/store/authStore';

const PILLAR_EXPLANATIONS: Record<string, string> = {
  corpo: "O Corpo é o seu templo físico, sua energia e saúde. Sem ele, você não tem força nem pra estourar bolha! Cuide do seu sono, alimentação e treinos para manter isso alto.",
  mente: "A Mente é a sua saúde mental, foco e resiliência. Estourar bolhas erradas destrói a mente! Tire um tempo para respirar, descansar e organizar seus pensamentos.",
  vida: "A Vida representa suas conexões, lazer e relacionamentos. Ninguém vive só de obrigações! Reserve um tempo sagrado para seus amigos, família e o que te faz sorrir.",
  liberdade: "A Liberdade é a sua autonomia, controle financeiro e independência. Sem grana e sem tempo livre, você vira prisioneiro da rotina! Planeje-se para conquistar suas asas.",
  proposito: "O Propósito é o seu norte, sua missão de vida e legado. De que adianta equilibrar todos os outros pilares se você não sabe para onde está caminhando?"
};

export function usePlocChat() {
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
  const [chatStage, setChatStage] = useState(0);
  const [planejeScore, setPlanejeScore] = useState(0);

  const [isGamePaused, setIsGamePaused] = useState(false);
  const [showChoiceButtons, setShowChoiceButtons] = useState(false);
  const [rewardBoxVisible, setRewardBoxVisible] = useState(false);

  const [firstPillarTo5, setFirstPillarTo5] = useState<string | null>(null);
  const [firstPillarTo10, setFirstPillarTo10] = useState<string | null>(null);
  const [hasReachedLvl5, setHasReachedLvl5] = useState(false);
  const [hasReachedLvl10, setHasReachedLvl10] = useState(false);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const explainedAttributes = useRef<string[]>([]);
  const lastPassiveSpeechRef = useRef<number>(0);

  // Inicialização e Sincronização de Estados com o LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem('ploc_onboarding_completed') === 'true';
      const mode = localStorage.getItem('ploc_game_mode') as 'decor' | 'onboarding_game' | 'normal' || 'decor';

      if (isAuthenticated || completed) {
        setGameMode('normal');
        localStorage.setItem('ploc_game_mode', 'normal');
        setChatStage(3);
      } else {
        setGameMode(mode);
        if (mode === 'onboarding_game') {
          setChatStage(2);
          attributeEngine.setDemoMode(true);
        } else {
          // Força resetar a contagem ao reiniciar no modo decorativo
          localStorage.setItem('ploc_pop_count', '0');
          localStorage.setItem('ploc_pop_cycle_level', '0');
        }
      }

      // Se a recompensa suprema já foi liberada, mostra a caixa
      if (localStorage.getItem('ploc_reward_unlocked') === 'true') {
        setRewardBoxVisible(true);
      }
    }
  }, [isAuthenticated]);

  // Sincroniza gameMode com o localStorage para que o AttributeEngine leia
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ploc_game_mode', gameMode);
    }
  }, [gameMode]);

  // Listener para o contador de cliques em bolhas vazias (modo pegadinha 'decor')
  useEffect(() => {
    const handleBubbleExploded = (data?: { word?: string; poppedByUser?: boolean; collided?: boolean }) => {
      const activeMode = localStorage.getItem('ploc_game_mode') || 'decor';
      if (activeMode !== 'decor') return;

      const completed = localStorage.getItem('ploc_onboarding_completed') === 'true';
      if (completed || isAuthenticated) return;

      // Se a bolha colidiu fisicamente com o Ploc (drift automático), tratamos de forma silenciosa e sarcástica com cooldown
      if (data?.collided) {
        if (typeof document !== 'undefined' && (!document.hasFocus() || document.hidden)) {
          return;
        }

        const now = Date.now();
        // Cooldown robusto de 15 segundos para evitar que falas silenciosas se atropelem ou ocorram quando Ploc já está falando
        if (now - lastPassiveSpeechRef.current < 15000 || isSpeaking) {
          return;
        }
        lastPassiveSpeechRef.current = now;

        const sarcasticPhrases = [
          "Que bolha interessante... Essas bolhas ensinam muita coisa sabia? por que não estoura algumas",
          "Sabe o que eu gosto dessas bolhas... exatamente tudo, afinal, é sempre bom conhecer novas bolhas não é ? ",
          "Você me irrita sabia? Tantas bolhas por aqui e você preso na sua! por que não estoura algumas comigo",
          "EITA, essa bolha escondia um medo pequeno vestido de gigante. vamos testar juntos essa bolha ? ",
          "Olha, não leve a mal, mas você tá me olhando de um jeito estranho",
          "Bolhas bolhas e mais bolhas, sair da nossa bolha é meio dificil né? ja tentou? estoure essa aqui pra mim",
          "Não sei se você percebeu... Dá pra respirar melhor fora da bolha, por que não estora algumas? ",
          "Você sabia que se você ficar muito tempo na sua bolha, você pode ficar viciado nela? escolha outra vai...",
          "Algumas bolhas protegem. Outras aprisionam. Não é hora de conhecer novas bolhas?",
          "Ei, ei! Tá esperando a bolha certa pra sair da sua? nunca é tarde para sair da sua bolha amigo!",
          "Não leve a mal, mas já que estamos falando de bolhas, você já se perguntou por que você está preso na sua?",
          "Ha há, essas bolhas falam tantas coisas sem dizer nada não é? estoure umas ai, você ja ja entende! ",
          "Não se preocupe, as bolhas vão estourar uma hora ou outra! mas você que tá escolhendo ",
          "Ei, eu entendo seu medo, mas se soubesse o que essa bolha me mostrou você iria querer estourar todas! ",
          "Sabe o que essa bolha me disse... que você tem medo... por que não prova pra ela que ela ta errada?",
          "oba, bolhas trazem um frio na barriga não é, quando conhecer a certa esse frio some, pode apostar?"
        ];
        const randomPhrase = sarcasticPhrases[Math.floor(Math.random() * sarcasticPhrases.length)];

        // Exibe com áudio completo (OpenAI TTS e indicador de carregamento [...])
        setChatMessages(prev => [...prev, { sender: 'ploc', text: randomPhrase }]);
        speak(randomPhrase, 5500);
        setIsChatOpen(true);
        return;
      }

      // Caso contrário (poppedByUser ou disparado sem metadados), é um clique real do usuário!
      const currentCount = parseInt(localStorage.getItem('ploc_pop_count') || '0', 10) + 1;
      localStorage.setItem('ploc_pop_count', currentCount.toString());

      const cycleLevel = parseInt(localStorage.getItem('ploc_pop_cycle_level') || '0', 10);

      if (currentCount >= 1 && cycleLevel < 1) {
        localStorage.setItem('ploc_pop_cycle_level', '1');
        const msg = "Que bom que resolveu conhecer as bolhas, essas bolhas estão  carregadas de conhecimento, estoure algumas e verá!";
        setChatMessages(prev => [...prev, { sender: 'ploc', text: msg }]);
        speak(msg, 6000);
        setIsChatOpen(true);
      } else if (currentCount >= 6 && cycleLevel < 2) {
        localStorage.setItem('ploc_pop_cycle_level', '2');
        const msg = "hmmm, Que estranho, mesmo depois de estourar tantas bolhas, você ainda não parece feliz... por que será?";
        setChatMessages(prev => [...prev, { sender: 'ploc', text: msg }]);
        speak(msg, 5500);
        setIsChatOpen(true);
      } else if (currentCount >= 12 && cycleLevel < 3) {
        localStorage.setItem('ploc_pop_cycle_level', '3');
        const msg = "hmmm, você continua estourando, mas não sei por que, parece que não está conseguindo ver a beleza delas, deixa eu ver se te ajudo... continue estourando elas";
        setChatMessages(prev => [...prev, { sender: 'ploc', text: msg }]);
        speak(msg, 7500);
        setIsChatOpen(true);
      } else if (currentCount >= 18 && cycleLevel < 4) {
        localStorage.setItem('ploc_pop_cycle_level', '4');
        const msg = "ESPERA AI... se o problema não são as bolhas, então talvês seja a forma de estourá-las ? e se tentar de outro jeito?";
        setChatMessages(prev => [...prev, { sender: 'ploc', text: msg }]);
        speak(msg, 5560);
        setIsChatOpen(true);
      } else if (currentCount >= 24 && cycleLevel < 5) {
        localStorage.setItem('ploc_pop_cycle_level', '5');
        const esporro = "Chega dessas bolhas! elas parecem boas, mas são vazias por dentro, cascas ocas... vou soltar minhas... Bolhas especiais... elas podem parecer um pouco dificeis, mas a chave é o equilibrio. vou confiar em você! Se prepare!"
        setChatMessages(prev => [...prev, { sender: 'ploc', text: esporro }]);
        speak(esporro, 13000);
        setIsChatOpen(true);

        // Aguarda a conclusão do áudio antes de iniciar oficialmente o jogo
        setTimeout(() => {
          setGameMode('onboarding_game');
          localStorage.setItem('ploc_game_mode', 'onboarding_game');
          setChatStage(2);
          attributeEngine.setDemoMode(true);
          blackboardEventBus.emit('GAME_MODE_CHANGED', 'onboarding_game');
        }, 12000);
      }
    };

    const unsubscribe = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, handleBubbleExploded);
    return () => unsubscribe();
  }, [speak, isAuthenticated]);

  // Listener para puxão de orelha em estouro desequilibrado
  useEffect(() => {
    const handleUnbalancedPop = () => {
      const warningText = "Ei! Focar em uma única coisa destrói o resto! Você precisa manter o equilíbrio de todos os pilares!";
      speak(warningText, 5000, { queue: true });
      setVisiblePlocText(warningText);
      setTimeout(() => setVisiblePlocText(''), 5000);
    };

    window.addEventListener('ploc_unbalanced_pop', handleUnbalancedPop);
    return () => window.removeEventListener('ploc_unbalanced_pop', handleUnbalancedPop);
  }, [speak]);

  // Auto-hide legendas do Ploc
  useEffect(() => {
    const lastMsg = chatMessages.filter(m => m.sender === 'ploc').slice(-1)[0];
    if (lastMsg && isChatOpen) {
      setVisiblePlocText(lastMsg.text);
      const timer = setTimeout(() => {
        setVisiblePlocText('');
      }, 7000);
      return () => clearTimeout(timer);
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

  // Monitora as alterações de atributos reais no minigame
  useEffect(() => {
    if (gameMode === 'onboarding_game' && !isGamePaused) {
      const updateScoreFromAttributes = () => {
        const attrs = attributeEngine.getAttributes();
        const values = [attrs.corpo, attrs.mente, attrs.vida, attrs.liberdade, attrs.proposito];

        // Identifica e explica o primeiro pilar a atingir 5 pontos
        const pillars: Array<'corpo' | 'mente' | 'vida' | 'liberdade' | 'proposito'> = ['corpo', 'mente', 'vida', 'liberdade', 'proposito'];
        if (!firstPillarTo5) {
          for (const p of pillars) {
            if (attrs[p] >= 5) {
              setFirstPillarTo5(p);
              if (!explainedAttributes.current.includes(p)) {
                explainedAttributes.current.push(p);
                const expl = PILLAR_EXPLANATIONS[p];
                setChatMessages(msgs => [...msgs, { sender: 'ploc', text: expl }]);
                speak(expl, 10000, { queue: true });
              }
              break;
            }
          }
        }

        // Identifica o primeiro pilar a atingir 10 pontos
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
          const minEquilMsg = `Muito bom, você alcançou o equilíbrio mínimo para a gente se ajudar! Sabia que o seu primeiro pilar a atingir o auge foi o do ${pilarName}? E como estamos falando de equilíbrio, não esqueça: focar só nele atrapalha todo o resto da sua vida. Vamos começar pra valer?`;

          setChatMessages(msgs => [...msgs, { sender: 'ploc', text: minEquilMsg }]);
          speak(minEquilMsg, 12000);

          setShowChoiceButtons(true);
          setIsChatOpen(true);
        }

        // Vitória do Nível 10 (Equilíbrio Supremo)
        if (completedLvl10 >= 5 && !hasReachedLvl10) {
          setHasReachedLvl10(true);
          setGameMode('normal');
          localStorage.setItem('ploc_game_mode', 'normal');
          localStorage.setItem('ploc_onboarding_completed', 'true');

          const finalPillarName = firstPillarTo10 ? firstPillarTo10.toUpperCase() : (firstPillarTo5 ? firstPillarTo5.toUpperCase() : 'CORPO');

          localStorage.setItem('ploc_reward_unlocked', 'true');
          localStorage.setItem('ploc_reward_pillar', finalPillarName);

          const maxEquilMsg = `Impressionante! Equilibrar bolhas flutuantes na tela é fácil... quero ver você ser bom assim na vida real! Mas não se preocupe, eu vou estar lá dentro do aplicativo de verdade para te dar um esporro sempre que você vacilar nas suas rotinas e te ajudar a manter essa balança de pé. Ah, e para aguçar sua curiosidade: você acabou de destravar um presente exclusivo baseado no seu foco em ${finalPillarName}! A caixa de recompensas já está te esperando dentro da interface do jogo, pronta para ser aberta assim que você fizer o login!`;

          setChatMessages(msgs => [...msgs, { sender: 'ploc', text: maxEquilMsg }]);
          speak(maxEquilMsg, 16000);

          setRewardBoxVisible(true);
          triggerAchievementUnlock('domador_sabao');
          setIsChatOpen(true);
        }

        // Calcula a quantidade de bolhas com lvl >= 5 apenas para o score textual de progresso
        setPlanejeScore(completedLvl5);
      };

      updateScoreFromAttributes();

      const unsubscribe = blackboardEventBus.subscribe(
        BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED,
        updateScoreFromAttributes
      );
      return () => unsubscribe();
    }
  }, [gameMode, isGamePaused, speak, firstPillarTo5, firstPillarTo10, hasReachedLvl5, hasReachedLvl10]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setInputValue('');
    setIsPending(true);

    // Diálogos scriptados do início
    if (chatStage === 0) {
      setTimeout(() => {
        const reply = "Não quero nem te ouvir, eu sei que você não cuida nem de você, por que acha que vai cuidar de mim?";
        setChatMessages(prev => [...prev, { sender: 'ploc', text: reply }]);
        setChatStage(1);
        speak(reply, 6000);
      }, 1200);
      return;
    }

    if (chatStage === 1) {
      setTimeout(() => {
        const esporro = "CHEGA! Já vi que você não consegue ficar parado! Vamos ver se você é bom em manter o equilíbrio de verdade. Olha só, vou colocar as bolhas de atributos reais na tela. O seu desafio é equilibrar TODOS os 5 pilares no nível 5! Se conseguir, a gente conversa.";
        setChatMessages(prev => [...prev, { sender: 'ploc', text: esporro }]);
        setChatStage(2);
        speak(esporro, 12000);

        setTimeout(() => {
          setGameMode('onboarding_game');
          localStorage.setItem('ploc_game_mode', 'onboarding_game');
          attributeEngine.setDemoMode(true);
          blackboardEventBus.emit('GAME_MODE_CHANGED', 'onboarding_game');
        }, 12000);
      }, 1200);
      return;
    }

    if (gameMode === 'onboarding_game') {
      setTimeout(() => {
        const reply = "Equilibre todos os seus 5 atributos no nível 5 estourando as bolhas certas! Menos papo, mais equilíbrio! ⚖️";
        setChatMessages(prev => [...prev, { sender: 'ploc', text: reply }]);
        speak(reply, 5000);
      }, 1200);
      return;
    }

    try {
      const res = await chatService.sendMessage(text);
      const reply = res.message || "Não entendi muito bem. Pode repetir?";

      setChatMessages(prev => [...prev, { sender: 'ploc', text: reply }]);
      speak(reply, Math.min(8000, reply.length * 80 + 2000));
    } catch (e) {
      console.error(e);
      setChatMessages(prev => [...prev, { sender: 'ploc', text: "Tive um curto-circuito na conexão. Vamos tentar de novo?" }]);
      setIsPending(false);
    }
  };

  // Escuta envio de mensagem vindo da landing page
  useEffect(() => {
    const handleReceivedMsg = (data: any) => {
      if (data && typeof data.text === 'string') {
        handleSendMessage(data.text);
      }
    };
    const unsub = blackboardEventBus.subscribe('SEND_PLOC_MESSAGE', handleReceivedMsg);
    return () => unsub();
  }, [handleSendMessage]);

  const handleOpenIntro = () => {
    if (!isChatOpen && !hasSpokenIntro) {
      setHasSpokenIntro(true);
      setIsPending(true);
      setTimeout(() => {
        const introMsg = 'Veio aqui me dar desculpinhas né?';
        setChatMessages([{ sender: 'ploc', text: introMsg }]);
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
    localStorage.setItem('ploc_game_mode', 'normal');
    localStorage.setItem('ploc_onboarding_completed', 'true');
    setAuthModalOpen(true);
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
  };
}
