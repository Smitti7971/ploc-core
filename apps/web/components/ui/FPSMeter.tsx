'use client';

import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

export function FPSMeter() {
  const [fps, setFps] = useState(60);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isEnabled = localStorage.getItem('debug_fps') === 'true';
    setVisible(isEnabled);

    const handleStorageChange = () => {
      setVisible(localStorage.getItem('debug_fps') === 'true');
    };

    window.addEventListener('fps_toggled', handleStorageChange);
    return () => window.removeEventListener('fps_toggled', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!visible) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const updateFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(updateFPS);
    };

    animationFrameId = requestAnimationFrame(updateFPS);

    return () => cancelAnimationFrame(animationFrameId);
  }, [visible]);

  if (!visible) return null;

  let color = 'text-emerald-400';
  let status = 'ÓTIMO';

  if (fps < 30) {
    color = 'text-red-500';
    status = 'RUIM';
  } else if (fps < 50) {
    color = 'text-yellow-400';
    status = 'MÉDIO';
  } else if (fps >= 90) {
    color = 'text-sky-400';
    status = 'ULTRA';
  }

  return (
    <div className="fixed top-12 left-12 z-[99999] pointer-events-none">
      <div className="flex flex-col items-center justify-center bg-[#020617]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg px-3 py-1 min-w-[60px]">
        <div className="flex items-center gap-1">
          <Activity size={10} className={color} />
          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">FPS</span>
        </div>
        <span className={`font-black text-base ${color} leading-none mt-0.5`}>{fps}</span>
        <span className={`text-[8px] font-bold ${color} mt-0.5`}>{status}</span>
      </div>
    </div>
  );
}
