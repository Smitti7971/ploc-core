import React from 'react';
import { Clock } from 'lucide-react';
import { getAssetUrl } from '@/lib/config';
interface LogHistoryProps {
  item?: any;
  itemLogs: any[];
  editingLogId: string | null;
  handleEditLog: (logId: string, info?: string, photoUrl?: string, metadata?: any, timestamp?: number, photoUrls?: string[]) => void;
}

export function LogHistory({ item, itemLogs, editingLogId, handleEditLog }: LogHistoryProps) {
  const sortedLogs = [...itemLogs].sort((a, b) => a.timestamp - b.timestamp);
  const logDecorations: Record<string, { index: number, colorClass: string }> = {};

  const colorClasses = [
    "bg-blue-500/50 border-blue-500/60 text-white",
    "bg-purple-500/50 border-purple-500/60 text-white",
    "bg-emerald-500/50 border-emerald-500/60 text-white",
    "bg-amber-500/50 border-amber-500/60 text-white",
    "bg-rose-500/50 border-rose-500/60 text-white",
    "bg-cyan-500/50 border-cyan-500/60 text-white",
  ];

  let currentDay = '';
  let currentMonth = '';
  let groupColorIndex = -1;
  let dayIndex = 0;

  const isMultiPerDay = typeof item?.config?.dailyLoops === 'number' && item.config.dailyLoops > 1;

  sortedLogs.forEach((log) => {
    const dateObj = new Date(log.timestamp);
    const dayStr = dateObj.toLocaleDateString('pt-BR');
    const monthStr = `${dateObj.getMonth()}-${dateObj.getFullYear()}`;

    if (dayStr !== currentDay) {
      currentDay = dayStr;
      dayIndex = 0;
      if (isMultiPerDay) {
        groupColorIndex = (groupColorIndex + 1) % colorClasses.length;
      }
    }

    if (log.type === 'consumption' || log.type === 'milestone') {
      dayIndex++;
    }

    if (!isMultiPerDay) {
      if (monthStr !== currentMonth) {
        currentMonth = monthStr;
        groupColorIndex = (groupColorIndex + 1) % colorClasses.length;
      }
    }

    logDecorations[log.id] = {
      index: dayIndex,
      colorClass: colorClasses[groupColorIndex] || colorClasses[0]
    };
  });

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-4 mt-6">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-white/40" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Histórico de Registros</span>
        </div>
      </div>

      {itemLogs.length === 0 ? (
        <p className="text-[10px] text-white/30 font-medium text-center py-2">Nenhum registro encontrado.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {itemLogs.map(log => {
            const dateObj = new Date(log.timestamp);
            const dateStr = dateObj.toLocaleDateString('pt-BR');
            const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            let visualClass = "border-white/5 bg-zinc-900/30";
            const isUsage = log.type === 'consumption' || log.type === 'milestone';

            if (isUsage) {
              const hasConditions = item?.config?.conditions?.length > 0;
              const allMet = log.metadata?.allConditionsMet ?? false;

              if (hasConditions) {
                if (allMet) {
                  visualClass = "border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                } else {
                  visualClass = "border-rose-500/50 bg-rose-950/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]";
                }
              } else {
                visualClass = "border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
              }
            }

            const deco = logDecorations[log.id];
            const displayPhotos = log.photoUrls?.length ? log.photoUrls : (log.photoUrl ? [log.photoUrl] : []);

            return (
              <div
                key={log.id}
                onClick={() => handleEditLog(log.id, log.info, log.photoUrl, log.metadata, log.timestamp, log.photoUrls)}
                className={`py-3 px-3 flex gap-3 relative overflow-hidden rounded-xl border cursor-pointer transition-colors ${visualClass}`}
              >
                {displayPhotos[0] && (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none mix-blend-screen"
                      style={{ backgroundImage: `url(${getAssetUrl(displayPhotos[0])})`, imageOrientation: 'from-image' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c0a] via-[#0a0c0a]/60 to-transparent pointer-events-none" />
                  </>
                )}

                {isUsage && deco && (
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border text-[14px] font-black relative z-10 pointer-events-none ${deco.colorClass}`}>
                    {deco.index}
                  </div>
                )}

                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between relative z-10 pointer-events-none">
                    <div className="flex-1 flex justify-between items-center bg-black/40 px-3 py-2 rounded-2xl border border-white/5 mr-2">
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">
                        {log.metadata?.title || (log.type === 'start' ? '🟢 Início' : log.type === 'end' ? '🔴 Fim' : log.type === 'consumption' ? '✅ Registro' : log.type)}
                      </p>
                      <span className="text-[10px] font-bold text-white/50">{timeStr}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-white/30 font-bold">{dateStr}</span>
                    </div>
                  </div>

                  {log.info && (
                    <p className="text-[11px] text-white/90 leading-relaxed relative z-10 font-medium pointer-events-none">
                      {log.info}
                    </p>
                  )}

                  {displayPhotos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto custom-scrollbar relative z-10 mt-1 pb-1">
                      {displayPhotos.slice(1).map((photo: string, idx: number) => (
                        <div 
                          key={idx} 
                          className="w-12 h-12 rounded-lg border border-white/20 shrink-0 bg-cover bg-center shadow-lg pointer-events-none"
                          style={{ backgroundImage: `url(${getAssetUrl(photo)})`, imageOrientation: 'from-image' }}
                        />
                      ))}
                    </div>
                  )}

                  {log.durationSeconds !== undefined && log.durationSeconds > 0 && (
                    <div className="text-[9px] font-bold text-white/50 relative z-10 pointer-events-none">
                      Duração: {Math.floor(log.durationSeconds / 60)}m {log.durationSeconds % 60}s
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
