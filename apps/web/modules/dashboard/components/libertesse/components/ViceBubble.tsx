import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { Flame, Wine, WineOff, Pill, Eye, EyeOff, Check, Cigarette, CigaretteOff, X, RotateCcw, History } from 'lucide-react';
import { useTrackerStore } from '../../tracker/store/trackerStore';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '@/modules/blackboard/events/eventBus';
import { usePlocSpeech } from '@/modules/chat/hooks/usePlocSpeech';
import { ViceBubbleModal } from './ViceBubbleModal';

const VICE_ICONS_OFF: Record<string, React.ElementType> = {
  tabagismo: CigaretteOff,
  alcoolismo: WineOff,
  drogas: Pill, // Lucide não tem PillOff, vamos usar a mesma
  pornografia: EyeOff,
};

const VICE_ICONS_ON: Record<string, React.ElementType> = {
  tabagismo: Cigarette,
  alcoolismo: Wine,
  drogas: Pill,
  pornografia: Eye,
};

const VICE_COLORS: Record<string, string> = {
  tabagismo: '#ef4444',
  alcoolismo: '#f59e0b',
  drogas: '#a855f7',
  pornografia: '#3b82f6',
};

interface ViceBubbleProps {
  viceId: string;
  index?: number;
  total?: number;
  canvasScale?: number;
}

export function ViceBubble({ viceId, index = 0, total = 1, canvasScale = 1 }: ViceBubbleProps) {
  const { items, removeItem, startConsumption, setItem, addLog } = useTrackerStore();
  const activeVice = items[viceId];
  const { speak } = usePlocSpeech();

  const [showMotivatorModal, setShowMotivatorModal] = useState(false);
  const [showResistInput, setShowResistInput] = useState(false);
  const [resistMinutes, setResistMinutes] = useState('10');
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Configuração física para o jogo de empurrar bolhas
  const radius = 150;
  const startAngle = (index / Math.max(total, 1)) * Math.PI * 2;
  const startX = Math.cos(startAngle) * (radius * 0.6);
  const startY = Math.sin(startAngle) * (radius * 0.6);

  // Estados e refs de física via Framer Motion
  const posX = useMotionValue(startX);
  const posY = useMotionValue(startY);

  // Velocidade inicial calma em qualquer direção randômica
  const vx = useRef<number>((Math.random() - 0.5) * 1.2);
  const vy = useRef<number>((Math.random() - 0.5) * 1.2);

  const currentPos = useRef({ x: startX, y: startY });
  const plocPos = useRef({ x: 0, y: 0 });
  const prevPlocPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // 1. Escuta posição e ações de arrasto do Ploc
    const unsubDragMove = blackboardEventBus.subscribe('PLOC_DRAG_MOVE', (data) => {
      if (data) {
        plocPos.current = { x: data.x, y: data.y };
      }
    });

    const unsubDragEnd = blackboardEventBus.subscribe('PLOC_DRAG_END', (data) => {
      if (data) {
        plocPos.current = { x: data.x, y: data.y };
      }
    });

    let animationFrameId: number;

    // 2. Loop de Simulação de Física usando requestAnimationFrame (60fps sincronizado com o monitor)
    const updatePhysics = () => {
      // Calcula a velocidade instantânea do Ploc (empurrão físico ativo)
      const px = plocPos.current.x;
      const py = plocPos.current.y;
      const pvx = px - prevPlocPos.current.x;
      const pvy = py - prevPlocPos.current.y;
      prevPlocPos.current = { x: px, y: py };

      // Aplica atrito leve adaptado para ~60fps
      vx.current *= 0.996; 
      vy.current *= 0.996;

      // Mantém um fluxo calmo perpétuo para qualquer direção
      const minSpeed = 0.45; // Metade do antigo (pois roda 2x mais rápido)
      const maxSpeed = 2.5;  // Metade do antigo
      const currentSpeed = Math.sqrt(vx.current * vx.current + vy.current * vy.current);
      if (currentSpeed < minSpeed) {
        const angle = currentSpeed > 0.05 ? Math.atan2(vy.current, vx.current) : Math.random() * Math.PI * 2;
        vx.current = Math.cos(angle) * minSpeed;
        vy.current = Math.sin(angle) * minSpeed;
      } else if (currentSpeed > maxSpeed) {
        vx.current = (vx.current / currentSpeed) * maxSpeed;
        vy.current = (vy.current / currentSpeed) * maxSpeed;
      }

      let nextX = currentPos.current.x + vx.current;
      let nextY = currentPos.current.y + vy.current;

      // 3. Colisão Física e Ricochete elástico contra o Mascote Ploc (Futebol de Botão)
      const dx = nextX - px;
      const dy = nextY - py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const R_col = 82; // Raio combinado de colisão (Ploc ~52px + Bolha ~30px)

      if (dist < R_col && dist > 0) {
        const overlap = R_col - dist;
        const nx = dx / dist;
        const ny = dy / dist;

        // Empurra a bolha para fora do Ploc
        nextX += nx * overlap;
        nextY += ny * overlap;

        // Ricochete elástico
        const dot = vx.current * nx + vy.current * ny;
        vx.current = (vx.current - 2 * dot * nx) * 0.8 + pvx * 0.55;
        vy.current = (vy.current - 2 * dot * ny) * 0.8 + pvy * 0.55;
      }

      // 4. Quique elástico na Parede Circular próxima ao Ploc (500x500 = raio 250)
      // Mantém as bolhas orbitando próximas ao centro
      const maxRadius = 350;
      const distFromCenter = Math.sqrt(nextX * nextX + nextY * nextY);
      
      // Adiciona uma atração suave (gravidade) em direção ao Ploc se estiverem se afastando muito
      if (distFromCenter > 280) {
        vx.current -= (nextX / distFromCenter) * 0.05;
        vy.current -= (nextY / distFromCenter) * 0.05;
      }

      if (distFromCenter > maxRadius) {
        const ratio = maxRadius / distFromCenter;
        nextX = nextX * ratio;
        nextY = nextY * ratio;

        const nx = -nextX / distFromCenter;
        const ny = -nextY / distFromCenter;
        
        const dot = vx.current * nx + vy.current * ny;
        vx.current = (vx.current - 2 * dot * nx) * 0.88;
        vy.current = (vy.current - 2 * dot * ny) * 0.88;
      }

      currentPos.current = { x: nextX, y: nextY };
      posX.set(nextX);
      posY.set(nextY);

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();

    return () => {
      unsubDragMove();
      unsubDragEnd();
      cancelAnimationFrame(animationFrameId);
    };
  }, [index]);
  const isRegretMode = !!activeVice.config?.regretStart;
  const [regretElapsed, setRegretElapsed] = useState(0);

  useEffect(() => {
    if (activeVice?.config?.mode === 'diminua' && activeVice.config?.timerLimitSeconds) {
      const updateTimer = () => {
        const elapsedSeconds = Math.floor((Date.now() - activeVice.startDate) / 1000);
        setElapsed(elapsedSeconds);
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [activeVice]);

  useEffect(() => {
    if (isRegretMode && activeVice.config?.regretStart) {
      const updateRegret = () => {
        const elapsed = Math.floor((Date.now() - activeVice.config.regretStart!) / 1000);
        setRegretElapsed(elapsed);

        if (elapsed >= 300) {
          // 5 minutes passed, automatically register usage
          addLog({
            trackerItemId: viceId,
            type: 'consumption',
            info: 'Uso registrado automaticamente após 5 min de arrependimento',
            durationSeconds: 300,
            value: 1
          });

          setItem({
            ...activeVice,
            startDate: Date.now(),
            config: {
              ...activeVice.config,
              regretStart: undefined
            }
          });
        }
      };
      updateRegret();
      const interval = setInterval(updateRegret, 1000);
      return () => clearInterval(interval);
    }
  }, [isRegretMode, activeVice, viceId, addLog, setItem]);

  if (!activeVice) return null;

  const isCountUp = activeVice?.config?.timerLimitSeconds
    ? elapsed >= activeVice.config.timerLimitSeconds
    : true;

  // Decide qual ícone usar com base no modo e fase (resista vs meta atingida)
  const isResistaPhase = activeVice.config?.mode === 'diminua' && !isCountUp;
  const Icon = isResistaPhase ? (VICE_ICONS_OFF[activeVice.config?.viceId] || Flame) : (VICE_ICONS_ON[activeVice.config?.viceId] || Flame);
  const color = VICE_COLORS[activeVice.config?.viceId] || '#ef4444';

  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (d > 0) return `${d}d ${h}h ${m}m`;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  const displayedSeconds = activeVice?.config?.timerLimitSeconds
    ? (isCountUp ? elapsed - activeVice.config.timerLimitSeconds : activeVice.config.timerLimitSeconds - elapsed)
    : elapsed;

  const handleBubbleClick = () => {
    if (isRegretMode) {
      // Apenas abre o modal, o cancelamento é feito lá dentro
      setShowMotivatorModal(true);
      return;
    }

    setShowMotivatorModal(true);
    setShowResistInput(false);

    if (activeVice?.config?.mode === 'diminua' && !isCountUp) {
      const phrases = [
        "Você tem certeza disso?",
        "Não ceda agora, você consegue!",
        "Por favor, não encha minha bolha de fumaça!",
        "Eu tô torcendo por você, só mais um pouco!"
      ];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

      // Visual reaction
      blackboardEventBus.emit(BLACKBOARD_EVENTS.PLOC_REACTION, {
        type: 'happy',
        message: randomPhrase
      });

      // Audio speech
      speak(randomPhrase, 4000);
    }
  };

  const handleRegistrar = () => {
    // Ao invés de startConsumption, iniciamos o período de arrependimento de 5 minutos
    setItem({
      ...activeVice,
      config: {
        ...activeVice.config,
        regretStart: Date.now()
      }
    });

    // Mantemos o modal aberto para que o usuário possa ver o botão de cancelar
  };

  const handleResistMore = (minsOverride?: number) => {
    const mins = minsOverride !== undefined ? minsOverride : parseInt(resistMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      const additionalSeconds = mins * 60;
      const currentElapsed = Math.floor((Date.now() - activeVice.startDate) / 1000);
      const currentLimit = activeVice.config?.timerLimitSeconds || 0;
      
      let newStartDate = activeVice.startDate;
      let newLimit = currentLimit;

      if (currentElapsed >= currentLimit) {
        newStartDate = Date.now();
        newLimit = additionalSeconds;
      } else {
        newLimit = currentLimit + additionalSeconds;
      }

      setItem({
        ...activeVice,
        startDate: newStartDate,
        config: {
          ...activeVice.config,
          timerLimitSeconds: newLimit
        }
      });
      setShowMotivatorModal(false);
      setShowResistInput(false);
    }
  };

  const opticalScale = Math.max(1, 1 / canvasScale);
  const isPerformanceMode = canvasScale < 0.6;

  if (activeVice?.isConsuming) {
    return null;
  }


  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 1,
          scale: opticalScale,
        }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          scale: { type: 'spring', stiffness: 300, damping: 20 },
          opacity: { duration: 0.3 }
        }}
        style={{
          x: posX,
          y: posY,
        }}
        className="absolute z-[-1] pointer-events-auto flex flex-col items-center justify-center"
      >
        <div
          onClick={handleBubbleClick}
          className="w-[60px] h-[60px] flex flex-col items-center justify-center cursor-pointer relative group rounded-full backdrop-blur-sm"
          style={{
            backgroundColor: activeVice.config?.mode === 'diminua' ? 'rgba(20,25,30,0.85)' : `${color}30`,
            border: `1px solid ${activeVice.config?.mode === 'diminua' ? (!isCountUp ? '#ef4444' : '#10b981') : `${color}60`}`,
            boxShadow: `inset 0 0 10px ${color}20` // Lightweight inner shadow instead of gradient
          }}
        >
          {!isPerformanceMode && (
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border mb-0.5 bg-transparent ${activeVice.config?.mode === 'diminua'
                ? (!isCountUp ? 'border-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.4)]')
                : 'border-white/20'
                }`}
            >
              <Icon
                size={14}
                color={activeVice.config?.mode === 'diminua' ? (!isCountUp ? '#ef4444' : '#10b981') : '#ffffff'}
              />
            </div>
          )}

          {isRegretMode ? (
            <div className="flex flex-col items-center mt-[1px]">
              {!isPerformanceMode && (
                <span className="text-[0.35rem] font-bold uppercase tracking-widest leading-none mt-0.5 shadow-sm text-amber-400">
                  ARREPENDIMENTO
                </span>
              )}
              <span className={`font-mono font-black tracking-wider shadow-sm leading-none ${isPerformanceMode ? 'text-[0.5rem]' : 'text-[0.5rem] mt-0.5'} text-amber-500`}>
                {formatTime(Math.max(0, 300 - regretElapsed))}
              </span>
              {!isPerformanceMode && (
                <span className="text-[0.3rem] font-bold uppercase tracking-widest leading-none mt-0.5 opacity-70">
                  Toque para cancelar
                </span>
              )}
            </div>
          ) : (
            <>
              {activeVice.config?.mode === 'diminua' && (
                <div className="flex flex-col items-center mt-[1px]">
                  {!isPerformanceMode && (
                    <span className="text-[0.35rem] font-bold uppercase tracking-widest leading-none mt-0.5 shadow-sm text-white/90">
                      {!isCountUp ? 'RESISTA' : 'ALCANÇADA'}
                    </span>
                  )}
                  <span className={`font-mono font-black tracking-wider shadow-sm leading-none ${isPerformanceMode ? 'text-[0.5rem]' : 'text-[0.5rem] mt-0.5'} ${!isCountUp ? 'text-red-500' : 'text-emerald-500'}`}>
                    {formatTime(displayedSeconds)}
                  </span>
                </div>
              )}

              {activeVice.config?.mode !== 'diminua' && (
                <span className={`font-bold uppercase tracking-widest leading-none shadow-sm ${isPerformanceMode ? 'text-[0.5rem] text-white' : 'text-[0.45rem] text-white/90 mt-1'}`}>
                  Uso
                </span>
              )}
            </>
          )}
        </div>

        {/* Título do Vício Abaixo da Bolha */}
        {!isPerformanceMode && (
          <div className="mt-1 px-2 py-0.5 rounded text-[0.4rem] font-bold uppercase tracking-wider bg-black/60 border border-white/10 text-white/90 backdrop-blur-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px] text-center">
            {activeVice.name || 'DESCONHECIDO'}
          </div>
        )}      </motion.div>

      {/* Modal Extraído */}
      <ViceBubbleModal
        show={showMotivatorModal}
        onClose={() => setShowMotivatorModal(false)}
        activeVice={activeVice}
        viceId={viceId}
        isRegretMode={isRegretMode}
        regretElapsed={regretElapsed}
        isCountUp={isCountUp}
        color={color}
        formatTime={formatTime}
        setItem={setItem}
        removeItem={removeItem}
        handleRegistrar={handleRegistrar}
        showResistInput={showResistInput}
        setShowResistInput={setShowResistInput}
        resistMinutes={resistMinutes}
        setResistMinutes={setResistMinutes}
        handleResistMore={handleResistMore}
        showConfirmEnd={showConfirmEnd}
        setShowConfirmEnd={setShowConfirmEnd}
      />
      {/* Fim do Bubble */}
    </>
  );
}
