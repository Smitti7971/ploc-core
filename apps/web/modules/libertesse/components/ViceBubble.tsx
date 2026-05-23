import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Wine, WineOff, Pill, Eye, EyeOff, Check, Cigarette, CigaretteOff, X, RotateCcw, History } from 'lucide-react';
import { useViceStore } from '../store/viceStore';
import { ViceOptionsModal } from './ViceOptionsModal';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '../../blackboard/events/eventBus';
import { usePlocSpeech } from '../../../components/mascot/usePlocSpeech';

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
  canvasScale?: number;
}

export function ViceBubble({ canvasScale = 1 }: ViceBubbleProps) {
  const { activeVice, resetTimer, setActiveVice, startConsumption, endConsumption, addFastingTime, setDefaultConsumptionSeconds } = useViceStore();
  const { speak } = usePlocSpeech();

  const [showMotivatorModal, setShowMotivatorModal] = useState(false);
  const [motivatorInput, setMotivatorInput] = useState('');
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
        "Por favor, nào encha minha bolha de fumaça!",
        "Eu to torcendo por você, só mais um pouco!"
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
    startConsumption(motivatorInput);

    setShowMotivatorModal(false);
    setMotivatorInput('');
  };

  const handleResistMore = (minsOverride?: number) => {
    const mins = minsOverride !== undefined ? minsOverride : parseInt(resistMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      addFastingTime(mins * 60);
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
        initial={{ opacity: 0, y: 0, scale: 0, x: '20%' }}
        animate={{ opacity: 1, y: -130, scale: opticalScale, x: '20%' }}
        exit={{ opacity: 0, scale: 0, x: '20%' }}
        transition={{
          scale: { type: 'spring', stiffness: 300, damping: 20 },
          opacity: { duration: 0.3 }
        }}
        className="absolute left-[20px] z-[300] pointer-events-auto flex flex-col items-center justify-center"
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
          className="w-[90px] h-[90px] flex flex-col items-center justify-center cursor-pointer relative group"
          style={{
            background: activeVice.mode === 'diminua' ? 'transparent' : `radial-gradient(circle at 30% 30%, ${color}60, ${color}10)`,
            border: `1px solid ${activeVice.mode === 'diminua' ? (!isCountUp ? '#ef4444' : '#10b981') : color}`,
            boxShadow: `0 0 30px ${activeVice.mode === 'diminua' ? (!isCountUp ? '#ef4444' : '#10b981') : color}40, inset 0 0 20px ${activeVice.mode === 'diminua' ? (!isCountUp ? '#ef4444' : '#10b981') : color}20`,
            backdropFilter: 'blur(12px)',
          }}
        >
          {!isPerformanceMode && (
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center border mb-0.5 bg-transparent ${activeVice.mode === 'diminua'
                ? (!isCountUp ? 'border-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.4)]')
                : 'border-white/20'
                }`}
            >
              <Icon
                size={18}
                color={activeVice.mode === 'diminua' ? (!isCountUp ? '#ef4444' : '#10b981') : '#ffffff'}
                style={{ filter: `drop-shadow(0 0 5px ${activeVice.mode === 'diminua' ? (!isCountUp ? '#ef4444' : '#10b981') : color})` }}
              />
            </div>
          )}

          {activeVice.mode === 'diminua' && (
            <div className="flex flex-col items-center mt-1">
              {!isPerformanceMode && (
                <span className="text-[0.45rem] font-bold uppercase tracking-widest leading-none mt-1 shadow-sm text-white/90">
                  {!isCountUp ? 'RESISTA' : 'META ATINGIDA'}
                </span>
              )}
              <span className={`font-mono font-black tracking-wider shadow-sm leading-none ${isPerformanceMode ? 'text-xs' : 'text-[0.6rem] mt-1'} ${!isCountUp ? 'text-red-500' : 'text-emerald-500'}`}>
                {formatTime(displayedSeconds)}
              </span>
            </div>
          )}

          {activeVice.mode === 'acompanhe' && (
            <span className={`font-bold uppercase tracking-widest leading-none shadow-sm ${isPerformanceMode ? 'text-[0.6rem] text-white' : 'text-[0.55rem] text-white/90 mt-1.5'}`}>
              Uso
            </span>
          )}
        </motion.div>

        {/* Bolinhas de pensamento reposicionadas */}
        <div className="absolute -bottom-3 left-[20%] w-2 h-2 rounded-full bg-[#0f1115] border border-white/20 pointer-events-none" />
        <div className="absolute -bottom-6 left-[10%] w-1.5 h-1.5 rounded-full bg-[#0f1115] border border-white/20 pointer-events-none opacity-70" />
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

              {activeVice.mode === 'diminua' && (
                <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[0.6rem] uppercase tracking-widest text-slate-400 font-bold block mb-0.5">Tempo Médio de Uso</span>
                    <span className="text-sm font-mono text-white/90 font-bold">
                      {Math.floor((activeVice.defaultConsumptionSeconds || 300) / 60)} min {((activeVice.defaultConsumptionSeconds || 300) % 60).toString().padStart(2, '0')}s
                    </span>
                  </div>
                  {(activeVice.defaultConsumptionSeconds || 300) !== 300 && (
                    <button
                      onClick={() => setDefaultConsumptionSeconds(300)}
                      className="text-[0.6rem] text-sky-400 hover:text-sky-300 font-bold tracking-widest flex items-center gap-1 bg-sky-400/10 px-2 py-1 rounded-md"
                    >
                      <RotateCcw size={10} />
                      5 MIN
                    </button>
                  )}
                </div>
              )}

              {showResistInput ? (
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
              ) : (
                <div>
                  <label className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Motivador</label>
                  <input
                    type="text"
                    value={motivatorInput}
                    onChange={(e) => setMotivatorInput(e.target.value)}
                    placeholder="Registre o que motivou o consumo!"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-white/30"
                  />
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

                  <button
                    onClick={() => {
                      setShowHistoryModal(true);
                      setShowMotivatorModal(false);
                    }}
                    className="w-full bg-white/5 hover:bg-white/10 text-slate-300 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-[0.65rem] tracking-widest mt-1"
                  >
                    <History size={14} />
                    VER HISTÓRICO
                  </button>
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
                        setActiveVice(null);
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
