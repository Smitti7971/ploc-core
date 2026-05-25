import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Wine, WineOff, Pill, Eye, EyeOff, Check, Cigarette, CigaretteOff, X, RotateCcw, History } from 'lucide-react';
import { useViceStore } from '../store/viceStore';
import { ViceOptionsModal } from './ViceOptionsModal';
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
  const { activeVices, removeActiveVice, startConsumption, addFastingTime, setDefaultConsumptionSeconds } = useViceStore();
  const activeVice = activeVices[viceId];
  const { speak } = usePlocSpeech();

  const [showMotivatorModal, setShowMotivatorModal] = useState(false);
  const [showResistInput, setShowResistInput] = useState(false);
  const [resistMinutes, setResistMinutes] = useState('10');
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (activeVice?.mode === 'diminua' && activeVice.timerLimitSeconds) {
      const updateTimer = () => {
        const elapsedSeconds = Math.floor((Date.now() - activeVice.startTime) / 1000);
        setElapsed(elapsedSeconds);
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [activeVice]);

  if (!activeVice) return null;

  const isCountUp = activeVice?.timerLimitSeconds
    ? elapsed >= activeVice.timerLimitSeconds
    : true;

  // Decide qual ícone usar com base no modo e fase (resista vs meta atingida)
  const isResistaPhase = activeVice.mode === 'diminua' && !isCountUp;
  const Icon = isResistaPhase ? (VICE_ICONS_OFF[activeVice.viceId] || Flame) : (VICE_ICONS_ON[activeVice.viceId] || Flame);
  const color = VICE_COLORS[activeVice.viceId] || '#ef4444';

  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (d > 0) return `${d}d ${h}h ${m}m`;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };


  const displayedSeconds = activeVice?.timerLimitSeconds
    ? (isCountUp ? elapsed - activeVice.timerLimitSeconds : activeVice.timerLimitSeconds - elapsed)
    : elapsed;

  const handleBubbleClick = () => {
    setShowMotivatorModal(true);
    setShowResistInput(false);

    if (activeVice?.mode === 'diminua' && !isCountUp) {
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
    startConsumption(viceId, "");

    setShowMotivatorModal(false);
  };

  const handleResistMore = (minsOverride?: number) => {
    const mins = minsOverride !== undefined ? minsOverride : parseInt(resistMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      addFastingTime(viceId, mins * 60);
      setShowMotivatorModal(false);
      setShowResistInput(false);
    }
  };

  const opticalScale = Math.max(1, 1 / canvasScale);
  const isPerformanceMode = canvasScale < 0.6;

  if (activeVice?.isConsuming) {
    return null;
  }

  // Chaotic movement logic bounded by radius (PLOC protective bubble is 500px diameter, 250px radius)
  // We use max radius 150px to prevent the 90px bubbles from going out of bounds
  const radius = 150;
  const hash1 = index * 17 + 7;
  const hash2 = index * 31 + 13;
  const x1 = Math.cos(hash1) * radius;
  const y1 = Math.sin(hash1) * radius;
  const x2 = Math.cos(hash2) * radius;
  const y2 = Math.sin(hash2) * radius;

  // Base starting position to avoid overlap initially
  const startAngle = (index / Math.max(total, 1)) * Math.PI * 2;
  const startX = Math.cos(startAngle) * (radius * 0.6);
  const startY = Math.sin(startAngle) * (radius * 0.6);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 0, scale: 0, x: 0 }}
        animate={{
          opacity: 1,
          scale: opticalScale,
          x: [startX, x1, x2, -x1, startX],
          y: [startY, y1, y2, -y2, startY]
        }}
        exit={{ opacity: 0, scale: 0, x: 0 }}
        transition={{
          scale: { type: 'spring', stiffness: 300, damping: 20 },
          opacity: { duration: 0.3 },
          x: { duration: 25 + (index % 3) * 5, repeat: Infinity, ease: "linear" },
          y: { duration: 30 + (index % 4) * 4, repeat: Infinity, ease: "linear" },
        }}
        className="absolute z-[-1] pointer-events-auto flex flex-col items-center justify-center"
      >
        <motion.div
          initial={{ borderRadius: "50% 50% 48% 48% / 48% 48% 52% 52%" }}
          animate={{
            y: [0, -12, 0],
            x: [0, 8, 0, -8, 0],
            scaleX: [1, 1.03, 0.97, 1],
            scaleY: [1, 0.97, 1.03, 1],
            borderRadius: [
              "50% 50% 48% 48% / 48% 48% 52% 52%",
              "46% 54% 44% 56% / 53% 47% 53% 47%",
              "54% 46% 56% 44% / 47% 53% 47% 53%",
              "50% 50% 48% 48% / 48% 48% 52% 52%"
            ]
          }}
          transition={{
            y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
            scaleX: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
            scaleY: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
            borderRadius: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
          }}
          onClick={handleBubbleClick}
          className="w-[60px] h-[60px] flex flex-col items-center justify-center cursor-pointer relative group"
          style={{
            background: activeVice.mode === 'diminua' ? 'transparent' : `radial-gradient(circle at 30% 30%, ${color}60, ${color}10)`,
            border: `1px solid ${activeVice.mode === 'diminua' ? (!isCountUp ? '#ef4444' : '#10b981') : color}`,
            boxShadow: `0 0 30px ${activeVice.mode === 'diminua' ? (!isCountUp ? '#ef4444' : '#10b981') : color}40, inset 0 0 20px ${activeVice.mode === 'diminua' ? (!isCountUp ? '#ef4444' : '#10b981') : color}20`,
            backdropFilter: 'blur(12px)',
          }}
        >
          {!isPerformanceMode && (
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border mb-0.5 bg-transparent ${activeVice.mode === 'diminua'
                ? (!isCountUp ? 'border-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.4)]')
                : 'border-white/20'
                }`}
            >
              <Icon
                size={14}
                color={activeVice.mode === 'diminua' ? (!isCountUp ? '#ef4444' : '#10b981') : '#ffffff'}
                style={{ filter: `drop-shadow(0 0 5px ${activeVice.mode === 'diminua' ? (!isCountUp ? '#ef4444' : '#10b981') : color})` }}
              />
            </div>
          )}

          {activeVice.mode === 'diminua' && (
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

          {activeVice.mode === 'acompanhe' && (
            <span className={`font-bold uppercase tracking-widest leading-none shadow-sm ${isPerformanceMode ? 'text-[0.5rem] text-white' : 'text-[0.45rem] text-white/90 mt-1'}`}>
              Uso
            </span>
          )}
        </motion.div>


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
                {activeVice.mode === 'acompanhe'
                  ? 'REGISTRAR USO'
                  : (activeVice.mode === 'diminua'
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
                    className={`w-full font-black py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs tracking-widest ${activeVice.mode === 'diminua' ? 'text-white' : 'text-black'}`}
                    style={{
                      backgroundColor: activeVice.mode === 'diminua'
                        ? (!isCountUp ? '#ef4444' : '#10b981')
                        : color
                    }}
                  >
                    <Check size={16} />
                    {activeVice.mode === 'diminua'
                      ? (!isCountUp ? 'CEDER AO IMPULSO' : 'REGISTRAR CONSUMO')
                      : 'SALVAR'}
                  </button>

                  {activeVice.mode === 'diminua' && isCountUp && (
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
                        removeActiveVice(activeVice.viceId);
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
      {/* Componente Modal de Histórico */}
      <ViceOptionsModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        viceId={activeVice?.viceId || null}
      />
    </>
  );
}
