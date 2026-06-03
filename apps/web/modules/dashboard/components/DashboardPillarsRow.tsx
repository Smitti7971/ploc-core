import React from 'react';
import { motion } from 'framer-motion';

interface DashboardPillarsRowProps {
  pillarsData: Record<string, any>;
  attributes: Record<string, number>;
  setActivePillar: (id: string) => void;
  getStatusColor: (val: number, baseColor: string) => string;
}

export function DashboardPillarsRow({
  pillarsData,
  attributes,
  setActivePillar,
  getStatusColor
}: DashboardPillarsRowProps) {
  return (
    <div className="w-full flex justify-between md:justify-center gap-1 md:gap-4 py-4 z-10 px-2 md:px-4">
      {Object.values(pillarsData).map((pillar) => {
        const Icon = pillar.icon;
        const val = attributes[pillar.id] ?? 50;
        const statusColor = getStatusColor(val, pillar.color);

        return (
          <motion.div
            key={pillar.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActivePillar(pillar.id)}
            className="flex flex-col items-center gap-1 md:gap-2 cursor-pointer flex-1"
          >
            <div
              className="w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center backdrop-blur-md relative"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `2px solid ${statusColor}`,
                boxShadow: `0 8px 20px rgba(0,0,0,0.5), inset 0 0 15px ${statusColor}20`
              }}
            >
              <Icon size={24} color={statusColor} />

              {/* Badge de Nível */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-black border border-white/20 flex items-center justify-center text-[0.45rem] md:text-[0.55rem] font-bold shadow-lg">
                <span style={{ color: statusColor }}>{val}</span>
              </div>
            </div>
            <span className="text-[0.5rem] md:text-[0.6rem] font-black tracking-tighter md:tracking-widest text-slate-400 mt-1 uppercase text-center break-words w-full px-1">
              {pillar.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
