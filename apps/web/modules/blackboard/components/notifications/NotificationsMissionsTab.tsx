import React from 'react';

interface NotificationsMissionsTabProps {
  missoes: any[];
  setShowAntitabagismo: (show: boolean) => void;
  formatDays: (startTime: number) => number;
}

export function NotificationsMissionsTab({
  missoes,
  setShowAntitabagismo,
  formatDays
}: NotificationsMissionsTabProps) {

  return (
    <div className="flex flex-col gap-3">
      {missoes.length === 0 && <p className="text-white/40 text-xs text-center py-4">Nenhuma missão ativa.</p>}
      {missoes.map(m => (
        <div
          key={m.id}
          onClick={() => m.config?.mode === 'missao-antitabagismo' ? setShowAntitabagismo(true) : null}
          className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-3 flex flex-col gap-2 cursor-pointer hover:bg-yellow-400/10 transition-colors"
        >
          <div className="flex justify-between items-center">
            <span className="text-yellow-400 text-sm font-bold">{m.config?.customName || m.name.toUpperCase()}</span>
            <span className="text-yellow-400/50 text-[10px] uppercase tracking-wider">{formatDays(m.startDate)} dias</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
            <div className="bg-yellow-400 h-full w-[0%] rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
          </div>
        </div>
      ))}
    </div>
  );
}
