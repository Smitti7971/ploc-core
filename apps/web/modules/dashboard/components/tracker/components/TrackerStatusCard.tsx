import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Activity } from 'lucide-react';
import { TrackerItem } from '../store/trackerStore';

interface TrackerStatusCardProps {
  item: TrackerItem;
  onClick: () => void;
}

export function TrackerStatusCard({ item, onClick }: TrackerStatusCardProps) {
  const showCoverPhoto = item.config?.showCoverPhoto !== false;
  
  const calculateDays = () => {
    return Math.floor((Date.now() - item.startDate) / (1000 * 60 * 60 * 24));
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative w-full h-32 rounded-3xl overflow-hidden cursor-pointer bg-[#0f1115] border border-white/10 group"
    >
      {/* Background Image */}
      {showCoverPhoto && item.coverPhoto && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity transition-opacity group-hover:opacity-60"
          style={{ backgroundImage: `url(${item.coverPhoto})` }}
        />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        
        {/* Top: Icon & Status */}
        <div className="flex justify-between items-start">
          <div className="bg-black/50 backdrop-blur-md p-2 rounded-xl text-emerald-400">
            <Activity size={18} />
          </div>
          
          {item.isConsuming ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 backdrop-blur-md rounded-full border border-rose-500/30">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
                Ativo
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-md rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Acompanhando
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
        </div>
      </div>
    </motion.div>
  );
}
