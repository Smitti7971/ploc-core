import React from 'react';
import { Clock } from 'lucide-react';
import { getAssetUrl } from '@/lib/config';
import { RelativeDateDisplay } from './RelativeDateDisplay';
interface LogHistoryProps {
  item?: any;
  itemLogs: any[];
  editingLogId: string | null;
  handleEditLog: (logId: string, info?: string, photoUrl?: string, metadata?: any, timestamp?: number, photoUrls?: string[]) => void;
  title?: string;
  emptyMessage?: string;
  Icon?: React.ElementType;
  isPending?: boolean;
}

export function LogHistory({ item, itemLogs, editingLogId, handleEditLog, title = "Histórico de Registros", emptyMessage = "Nenhum registro encontrado.", Icon = Clock, isPending = false }: LogHistoryProps) {
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

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const nowTime = todayEnd.getTime();

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-4 mt-6">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-white/40" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{title}</span>
        </div>
      </div>

      {itemLogs.length === 0 ? (
        <p className="text-[10px] text-white/30 font-medium text-center py-2">{emptyMessage}</p>
      ) : (
        <div className="flex flex-col gap-0 relative">
          {/* Timeline Vertical Line */}
          <div className="absolute top-2 bottom-2 left-[58px] w-[2px] bg-white/5 z-0" />

          {itemLogs.map(log => {
            const dateObj = new Date(log.timestamp);
            const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            const isFutureTimestamp = log.timestamp > nowTime;
            const isPendingState = log.metadata?.status === 'pending';
            const isExplicitMissed = log.metadata?.status === 'missed';
            const isMissed = isExplicitMissed || (isPendingState && !isFutureTimestamp);
            const isFuturePending = isPendingState && isFutureTimestamp;

            let visualClass = "border-white/5 bg-white/5 hover:bg-white/10";
            let tagColor = "text-zinc-500";
            let circleColor = "bg-zinc-700";
            let iconColor = "text-zinc-300";
            
            const isUsage = log.type === 'consumption' || log.type === 'milestone';

            if (isMissed) {
              visualClass = "border-rose-500/30 bg-rose-950/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]";
              tagColor = "text-rose-400";
              circleColor = "bg-rose-500";
              iconColor = "text-white";
            } else if (isFuturePending) {
              visualClass = "border-sky-500/30 bg-sky-950/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]";
              tagColor = "text-sky-400";
              circleColor = "bg-sky-500";
              iconColor = "text-white";
            } else if (isUsage) {
              const hasConditions = item?.config?.conditions?.length > 0;
              const allMet = log.metadata?.allConditionsMet ?? false;

              if (hasConditions) {
                if (allMet) {
                  visualClass = "border-emerald-500/30 bg-emerald-950/20";
                  circleColor = "bg-emerald-500";
                  iconColor = "text-white";
                } else {
                  visualClass = "border-rose-500/30 bg-rose-950/20";
                  circleColor = "bg-rose-500";
                  iconColor = "text-white";
                }
              } else {
                visualClass = "border-emerald-500/30 bg-emerald-950/20";
                circleColor = "bg-emerald-500";
                iconColor = "text-white";
              }
            } else {
              circleColor = "bg-blue-500";
              iconColor = "text-white";
            }

            const displayPhotos = log.photoUrls?.length ? log.photoUrls : (log.photoUrl ? [log.photoUrl] : []);

            return (
              <div
                key={log.id}
                onClick={() => handleEditLog(log.id, log.info, log.photoUrl, log.metadata, log.timestamp, log.photoUrls)}
                className="flex items-start gap-4 mb-3 relative group"
              >
                {/* Time Column */}
                <div className="w-[35px] text-right shrink-0 mt-3 relative z-10 bg-transparent">
                  <span className="text-[11px] font-medium text-white/50">{timeStr}</span>
                </div>
                
                {/* Timeline Circle */}
                <div className="relative shrink-0 mt-2 z-10">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border-4 border-[#0a0c0a] shadow-sm ${circleColor}`}>
                    <Icon size={12} className={iconColor} />
                  </div>
                </div>

                {/* Content Card */}
                <div className={`flex-1 flex flex-col p-4 relative overflow-hidden rounded-xl border cursor-pointer transition-colors ${visualClass}`}>
                  {displayPhotos[0] && (
                    <>
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none mix-blend-screen"
                        style={{ backgroundImage: `url(${getAssetUrl(displayPhotos[0])})`, imageOrientation: 'from-image' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c0a] via-[#0a0c0a]/60 to-transparent pointer-events-none" />
                    </>
                  )}

                  <div className="flex justify-between items-start mb-2 relative z-10 pointer-events-none">
                    <div>
                      <h4 className="text-white font-bold text-sm tracking-wide">
                        {log.metadata?.title || (log.type === 'start' ? '🟢 Início' : log.type === 'end' ? '🔴 Fim' : log.type === 'consumption' ? 'Registro' : log.type)}
                      </h4>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs ${tagColor}`}>
                          <RelativeDateDisplay date={log.timestamp} />
                        </span>
                        {log.metadata?.recurrence && log.metadata.recurrence !== 'none' && (
                          <span className={`text-[10px] font-black uppercase tracking-wider ${tagColor}`}>
                            • {log.metadata.recurrence === 'daily' ? 'Diária' : log.metadata.recurrence === 'weekly' ? 'Semanal' : log.metadata.recurrence === 'biweekly' ? 'Quinzenal' : 'Mensal'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {isMissed && (
                      <div className="bg-rose-500/20 border border-rose-500/50 px-2 py-1 rounded-md">
                        <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Esquecido</span>
                      </div>
                    )}
                    
                    {isFuturePending && (
                      <div className="bg-sky-500/20 border border-sky-500/50 px-2 py-1 rounded-md">
                        <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest">Pendente</span>
                      </div>
                    )}
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
                    <div className="text-[9px] font-bold text-white/50 relative z-10 pointer-events-none mt-2">
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
