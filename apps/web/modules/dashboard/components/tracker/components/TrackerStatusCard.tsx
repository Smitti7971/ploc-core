import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Activity } from 'lucide-react';
import { TrackerItem, useTrackerStore } from '../store/trackerStore';

interface TrackerStatusCardProps {
  item: TrackerItem;
  onClick: () => void;
}

export function TrackerStatusCard({ item, onClick }: TrackerStatusCardProps) {
  const showCoverPhoto = item.config?.showCoverPhoto !== false;

  const calculateDays = () => {
    return Math.floor((Date.now() - item.startDate) / (1000 * 60 * 60 * 24));
  };

  const getCardColors = () => {
    if (item.type === 'vice') {
      if (item.config?.mode === 'missao-antitabagismo') {
        return {
          bg: 'bg-yellow-950/40',
          border: 'border-yellow-500/30 hover:border-yellow-500/50',
          text: 'text-yellow-400',
          gradient: 'from-yellow-950/90 via-[#0f1115]/60 to-transparent'
        };
      }
      return {
        bg: 'bg-emerald-950/40',
        border: 'border-emerald-500/30 hover:border-emerald-500/50',
        text: 'text-emerald-400',
        gradient: 'from-emerald-950/90 via-[#0f1115]/60 to-transparent'
      };
    }
    if (item.type === 'acompanhe' || item.type === 'tracker') {
      return {
        bg: 'bg-amber-950/40',
        border: 'border-amber-500/30 hover:border-amber-500/50',
        text: 'text-amber-400',
        gradient: 'from-amber-950/90 via-[#0f1115]/60 to-transparent'
      };
    }
    // Default / Aprenda (sky)
    return {
      bg: 'bg-sky-950/40',
      border: 'border-sky-500/30 hover:border-sky-500/50',
      text: 'text-sky-400',
      gradient: 'from-sky-950/90 via-[#0f1115]/60 to-transparent'
    };
  };

  const getLabel = () => {
    if (item.type === 'vice') {
      return item.config?.mode === 'missao-antitabagismo' ? 'MISSÃO' : 'LIBERTESSE';
    }
    if (item.type === 'acompanhe' || item.type === 'tracker') {
      return 'ACOMPANHE';
    }
    return 'APRENDA';
  };

  const colors = getCardColors();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full h-32 rounded-3xl overflow-hidden cursor-pointer ${colors.bg} border ${colors.border} transition-colors group`}
    >
      {/* Background Image */}
      {showCoverPhoto && item.coverPhoto && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity transition-opacity group-hover:opacity-60"
          style={{ backgroundImage: `url(${item.coverPhoto})` }}
        />
      )}

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${colors.gradient}`} />

      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-between">

        {/* Top: Status */}
        <div className="flex justify-between items-start">
          <p className={`text-[10px] font-black tracking-widest uppercase ${colors.text} drop-shadow-md`}>
            {getLabel()}
          </p>

          {item.isConsuming ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 backdrop-blur-md rounded-full border border-rose-500/30">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
                Consumindo
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-md rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Ativo
              </span>
            </div>
          )}
        </div>

        {/* Bottom: Info */}
        <div>
          <h3 className="text-white font-black text-lg tracking-tight uppercase leading-tight truncate">
            {item.name}
          </h3>
          <p className="text-white/60 text-xs font-medium mt-1 truncate">
            {calculateDays()} dias registrados
          </p>
          {(() => {
            const logs = useTrackerStore.getState().logs.filter(l => l.trackerItemId === item.id);
            if (logs.length > 0) {
              const lastLog = logs.sort((a, b) => b.timestamp - a.timestamp)[0];
              return (
                <p className="text-white/40 text-[10px] mt-0.5 truncate">
                  Último registro: {new Date(lastLog.timestamp).toLocaleDateString('pt-BR')}
                </p>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </motion.div>
  );
}
