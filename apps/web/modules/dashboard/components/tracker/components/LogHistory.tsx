import React from 'react';
import { Clock } from 'lucide-react';
import { getAssetUrl } from '@/lib/config';

interface LogHistoryProps {
  itemLogs: any[];
  editingLogId: string | null;
  handleEditLog: (logId: string, info?: string, photoUrl?: string, metadata?: any) => void;
}

export function LogHistory({ itemLogs, editingLogId, handleEditLog }: LogHistoryProps) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-4">
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
            if (log.metadata && log.metadata.totalConditions > 0) {
              if (log.metadata.allConditionsMet) {
                visualClass = "border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
              } else {
                visualClass = "border-rose-500/50 bg-rose-950/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]";
              }
            }

            return (
              <div
                key={log.id}
                onClick={() => handleEditLog(log.id, log.info, log.photoUrl, log.metadata)}
                className={`py-3 px-3 flex flex-col gap-2 relative overflow-hidden rounded-xl border cursor-pointer transition-colors ${visualClass}`}
              >
                {log.photoUrl && (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none mix-blend-screen"
                      style={{ backgroundImage: `url(${getAssetUrl(log.photoUrl)})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c0a] via-[#0a0c0a]/60 to-transparent pointer-events-none" />
                  </>
                )}
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

                {log.durationSeconds !== undefined && log.durationSeconds > 0 && (
                  <div className="text-[9px] font-bold text-white/50 relative z-10 pointer-events-none">
                    Duração: {Math.floor(log.durationSeconds / 60)}m {log.durationSeconds % 60}s
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
