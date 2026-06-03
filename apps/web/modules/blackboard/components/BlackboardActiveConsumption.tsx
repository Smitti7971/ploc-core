import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTrackerStore } from "../../dashboard/components/tracker/store/trackerStore";
import { usePlocSpeech } from "../../../components/mascot/usePlocSpeech";

interface BlackboardActiveConsumptionProps {
  activeConsumingVice: any;
}

export function BlackboardActiveConsumption({
  activeConsumingVice,
}: BlackboardActiveConsumptionProps) {
  const { cancelConsumption, endConsumption } = useTrackerStore();
  const { speak } = usePlocSpeech();
  const [consumptionElapsed, setConsumptionElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeConsumingVice?.isConsuming && activeConsumingVice.consumptionStart) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - activeConsumingVice.consumptionStart!) / 1000);
        setConsumptionElapsed(elapsed);

        // Auto-encerra quando passa de 5 minutos
        const limit = 300; // Fixo em 5 minutos
        if (elapsed >= limit) {
          endConsumption(activeConsumingVice.id, limit);
        }
      }, 1000);
    } else {
      const timeout = setTimeout(() => setConsumptionElapsed(0), 0);
      return () => clearTimeout(timeout);
    }
    return () => clearInterval(interval);
  }, [
    activeConsumingVice?.isConsuming,
    activeConsumingVice?.consumptionStart,
    activeConsumingVice?.id,
    endConsumption,
  ]);

  const formatConsumingTime = (seconds: number) => {
    const absSeconds = Math.abs(seconds);
    const m = Math.floor(absSeconds / 60);
    const s = absSeconds % 60;
    return `${seconds < 0 ? "+" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const activeSecondsRemaining = 300 - consumptionElapsed;

  return (
    <AnimatePresence>
      {activeConsumingVice?.isConsuming && (
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 1.5, ease: "easeInOut" },
          }}
        >
          {/* UI DO CONSUMO ATIVO (BOTÃO PARAR E TIMER) */}
          <div className="absolute -top-[160px] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto z-[400] scale-90">
            <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-md px-4 py-1.5 rounded-2xl mb-2 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)] min-w-[140px]">
              <span className="text-[0.5rem] font-bold text-red-400 uppercase tracking-[0.15em] mb-0.5 text-center ml-[0.15em]">
                TE DESAFIO A FICAR SEM!
              </span>
              <span
                className={`font-mono font-black text-lg leading-none text-center ${activeSecondsRemaining < 0 ? "text-red-500" : "text-white"}`}
              >
                {formatConsumingTime(activeSecondsRemaining)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  cancelConsumption(activeConsumingVice.id);
                  speak("Esperar te faz mais forte!", 4000);
                }}
                className="bg-zinc-700/80 hover:bg-zinc-600 text-white font-bold px-4 py-2.5 rounded-xl text-[0.55rem] tracking-widest transition-colors shadow-lg whitespace-nowrap backdrop-blur-md"
              >
                NÃO VOU CEDER!
              </button>
              <button
                onClick={() => endConsumption(activeConsumingVice.id, consumptionElapsed)}
                className="bg-red-500 hover:bg-red-600 text-white font-black px-5 py-2.5 rounded-xl text-[0.6rem] tracking-widest transition-colors shadow-lg whitespace-nowrap"
              >
                CEDER
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
