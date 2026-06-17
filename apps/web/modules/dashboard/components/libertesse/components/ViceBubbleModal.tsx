import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

interface ViceBubbleModalProps {
  show: boolean;
  onClose: () => void;
  activeVice: any;
  viceId: string;
  isRegretMode: boolean;
  regretElapsed: number;
  isCountUp: boolean;
  color: string;
  formatTime: (seconds: number) => string;
  setItem: (item: any) => void;
  removeItem: (id: string) => void;
  handleRegistrar: () => void;
  showResistInput: boolean;
  setShowResistInput: (show: boolean) => void;
  resistMinutes: string;
  setResistMinutes: (val: string) => void;
  handleResistMore: (minsOverride?: number) => void;
  showConfirmEnd: boolean;
  setShowConfirmEnd: (show: boolean) => void;
}

export function ViceBubbleModal({
  show,
  onClose,
  activeVice,
  viceId,
  isRegretMode,
  regretElapsed,
  isCountUp,
  color,
  formatTime,
  setItem,
  removeItem,
  handleRegistrar,
  showResistInput,
  setShowResistInput,
  resistMinutes,
  setResistMinutes,
  handleResistMore,
  showConfirmEnd,
  setShowConfirmEnd
}: ViceBubbleModalProps) {
  if (!show || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-modal flex items-end justify-center p-4 pb-[120px] bg-black/60 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-[#0f1115] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <h3 className="text-white font-black text-center tracking-widest text-xs mt-2">
            {isRegretMode
              ? 'TEMPO DE ARREPENDIMENTO'
              : activeVice.config?.mode === 'acompanhe'
                ? 'REGISTRAR USO'
                : (activeVice.config?.mode === 'diminua'
                  ? (!isCountUp ? 'NÃO CEDA AO IMPULSO, ESTAMOS QUASE LÁ!' : 'PARABÉNS! META CONCLUÍDA')
                  : 'QUEBRA DE JEJUM')}
          </h3>

          {isRegretMode ? (
            <div className="flex flex-col gap-4 mt-2">
              <div className="text-center">
                <span className="text-5xl font-mono text-amber-500 font-black drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                  {formatTime(Math.max(0, 300 - regretElapsed))}
                </span>
                <p className="text-xs text-slate-400 mt-4 px-2">
                  Se você não cancelar, o uso será registrado automaticamente.
                </p>
              </div>
              <button 
                onClick={() => {
                  setItem({
                    ...activeVice,
                    config: {
                      ...activeVice.config,
                      regretStart: undefined
                    }
                  });
                  onClose();
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all mt-2"
              >
                CANCELAR ARREPENDIMENTO
              </button>
            </div>
          ) : (
            <>
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
                    <label htmlFor={`resist-minutes-${activeVice.id}`} className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>Minutos para resistir</label>
                    <input
                      id={`resist-minutes-${activeVice.id}`}
                      name="resistMinutes"
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
                        onClose();
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
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
