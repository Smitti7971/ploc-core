'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { playPlocSound } from '../bubbles';

interface PillarHUDButtonProps {
  pillarKey: string;
  config: {
    label: string;
    color: string;
    icon: React.ComponentType<any>;
  };
  isActive: boolean;
  value: number;
  onToggleTooltip: (pillarKey: string) => void;
}

export default function PillarHUDButton({
  pillarKey,
  config,
  isActive,
  value,
  onToggleTooltip
}: PillarHUDButtonProps) {
  const Icon = config.icon;

  const getStatusColor = (val: number) => {
    if (val >= 5) return '#22c55e'; // Verde para nível máximo completo
    return config.color;
  };

  const statusColor = getStatusColor(value);

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        onClick={() => {
          onToggleTooltip(pillarKey);
          playPlocSound();
        }}
        className="w-12 h-12 rounded-full backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer relative overflow-hidden transition-all duration-300 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_60%,rgba(255,255,255,0.01)_100%)]"
        style={{
          border: `1.5px solid ${isActive ? statusColor : 'rgba(255, 255, 255, 0.22)'}`,
          boxShadow: isActive
            ? `0 0 20px ${statusColor}40, inset 0 0 10px ${statusColor}20, 0 4px 12px rgba(0,0,0,0.15)`
            : 'inset 2px 2px 5px rgba(255,255,255,0.15), inset -2px -2px 5px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.15)'
        }}
        title={config.label}
      >
        {/* Brilho Especular Curvo Interno */}
        <div className="absolute top-[8%] left-[8%] w-[32%] h-[32%] rounded-full bg-gradient-to-br from-white/40 to-transparent blur-[1px] pointer-events-none" />

        <Icon size={16} color={statusColor} className="opacity-85" />
        <span className="text-[0.65rem] text-white font-black mt-[-1px] font-outfit">
          {value}
        </span>
      </motion.div>
    </div>
  );
}
