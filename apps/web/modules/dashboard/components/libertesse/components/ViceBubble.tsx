import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { Flame, Wine, WineOff, Pill, Eye, EyeOff, Check, Cigarette, CigaretteOff, X, RotateCcw, History } from 'lucide-react';
import { useTrackerStore } from '../../tracker/store/trackerStore';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '@/modules/blackboard/events/eventBus';
import { usePlocSpeech } from '@/components/mascot/usePlocSpeech';

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
  const { items, removeItem, startConsumption, setItem } = useTrackerStore();
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

      // 4. Quique elástico na Parede Circular externa do Sonar de 500px (raio 160px orig -> 110px para evitar clip)
      const maxRadius = 110;
      const distFromCenter = Math.sqrt(nextX * nextX + nextY * nextY);
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
    startConsumption(viceId);

    setShowMotivatorModal(false);
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

          {activeVice.config?.mode === 'acompanhe' && (
            <span className={`font-bold uppercase tracking-widest leading-none shadow-sm ${isPerformanceMode ? 'text-[0.5rem] text-white' : 'text-[0.45rem] text-white/90 mt-1'}`}>
              Uso
            </span>
          )}
        </div>


      </motion.div>

      {showMotivatorModal && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999999] flex items-end justify-center p-4 pb-[120px] bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={() => setShowMotivatorModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#0f1115] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
            >
              <button
                onClick={() => setShowMotivatorModal(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="text-white font-black text-center tracking-widest text-xs mt-2">
                {activeVice.config?.mode === 'acompanhe'
                  ? 'REGISTRAR USO'
                  : (activeVice.config?.mode === 'diminua'
                    ? (!isCountUp ? 'NÃO CEDA AO IMPULSO, ESTAMOS QUASE LÁ!' : 'PARABÉNS! META CONCLUÍDA')
                    : 'QUEBRA DE JEJUM')}
              </h3>


              {showResistInput && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[0.7rem] font-bold text-red-400 uppercase tracking-widest">Resistir mais...</label>
                    <button
                      onClick={() => setShowResistInput(false)}
                      className="text-slate-500 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => handleResistMore(10)} className="bg-white/5 hover:bg-white/10 text-white font-black py-2 rounded-lg text-xs transition-colors">10 MIN</button>
                    <button onClick={() => handleResistMore(30)} className="bg-white/5 hover:bg-white/10 text-white font-black py-2 rounded-lg text-xs transition-colors">30 MIN</button>
                    <button onClick={() => handleResistMore(60)} className="bg-white/5 hover:bg-white/10 text-white font-black py-2 rounded-lg text-xs transition-colors">60 MIN</button>
                  </div>

                  <div className="flex gap-2 mt-1">
                    <input
                      type="number"
                      value={resistMinutes}
                      onChange={(e) => setResistMinutes(e.target.value)}
                      placeholder="Outro"
                      className="w-full bg-[#0f1115] border border-red-500/20 rounded-xl px-4 py-2 text-white font-mono text-center outline-none focus:border-red-500/50 text-sm"
                    />
                    <button
                      onClick={() => handleResistMore()}
                      className="bg-red-500 hover:bg-red-600 text-white font-black px-4 rounded-xl text-xs tracking-widest transition-colors whitespace-nowrap"
                    >
                      OK
                    </button>
                  </div>
                </div>
              )}

              {!showResistInput && (
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    onClick={handleRegistrar}
                    className={`w-full font-black py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs tracking-widest ${activeVice.config?.mode === 'diminua' ? 'text-white' : 'text-black'}`}
                    style={{
                      backgroundColor: activeVice.config?.mode === 'diminua'
                        ? (!isCountUp ? '#ef4444' : '#10b981')
                        : color
                    }}
                  >
                    <Check size={16} />
                    {activeVice.config?.mode === 'diminua'
                      ? (!isCountUp ? 'CEDER AO IMPULSO' : 'REGISTRAR CONSUMO')
                      : 'SALVAR'}
                  </button>

                  {activeVice.config?.mode === 'diminua' && isCountUp && (
                    <button
                      onClick={() => setShowResistInput(true)}
                      className="w-full border border-sky-400/50 text-sky-400 font-bold py-3 rounded-xl transition-colors text-xs tracking-widest hover:bg-sky-400/10"
                    >
                      RESISTIR MAIS UM POUCO
                    </button>
                  )}


                </div>
              )}

              {/* Botão Sutil de Encerrar */}
              {showConfirmEnd ? (
                <div className="mt-4 flex flex-col items-center gap-2 border-t border-white/10 pt-4">
                  <span className="text-red-400 text-xs font-bold tracking-wider text-center leading-relaxed">
                    Tem certeza que deseja encerrar a estratégia?<br />
                    <span className="opacity-80">Seu progresso atual será perdido.</span>
                  </span>
                  <div className="flex gap-2 w-full mt-2">
                    <button
                      onClick={() => setShowConfirmEnd(false)}
                      className="flex-1 text-slate-300 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-bold tracking-widest transition-colors"
                    >
                      NÃO, VOLTAR
                    </button>
                    <button
                      onClick={() => {
                        removeItem(activeVice.id);
                        setShowMotivatorModal(false);
                        setShowConfirmEnd(false);
                      }}
                      className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white py-2 rounded-lg text-xs font-bold tracking-widest transition-colors"
                    >
                      SIM, ENCERRAR
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmEnd(true)}
                  className="mt-2 text-slate-500 text-[0.65rem] uppercase tracking-widest font-bold hover:text-white transition-colors"
                >
                  Encerrar Estratégia
                </button>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
      {/* Fim do Bubble */}
    </>
  );
}
