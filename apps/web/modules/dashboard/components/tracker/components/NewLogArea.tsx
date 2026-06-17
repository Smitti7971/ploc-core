import React from 'react';
import { Camera, Check, PlusCircle, CheckSquare } from 'lucide-react';
import { getAssetUrl } from '@/lib/config';
import { useTrackerStore } from '../store/trackerStore';

interface NewLogAreaProps {
  item: any;
  conditions: string[];
  conditionPhotoInputRef: React.RefObject<HTMLInputElement | null>;
  handleUploadConditionPhoto: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  setUploadingConditionKey: (key: string) => void;
  transformConditionToAcompanhe: (cond: string, idx: number) => void;
  conditionPhotos: Record<string, string>;
  checkedConditions: Record<string, boolean>;
  setCheckedConditions: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  items: Record<string, any>;
  openCorrelatedItem: (id: string) => void;
  requestAddLog: (params: any, opts?: any, cb?: (id: string) => void) => void;
  itemId: string;
  setConditionPhotos: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleEditLog: (id: string, info: string, photoUrl: string | undefined, metadata: any) => void;
}

export function NewLogArea({
  item,
  conditions,
  conditionPhotoInputRef,
  handleUploadConditionPhoto,
  setUploadingConditionKey,
  transformConditionToAcompanhe,
  conditionPhotos,
  checkedConditions,
  setCheckedConditions,
  items,
  openCorrelatedItem,
  requestAddLog,
  itemId,
  setConditionPhotos,
  handleEditLog
}: NewLogAreaProps) {
  const logs = useTrackerStore(state => state.logs);

  return (
    <div className="py-2 mb-4 border-t border-white/5 pt-4">
      <div className="flex items-center gap-2 mb-3">
        <CheckSquare size={14} className="text-sky-400" />
        <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Novo Registro</span>
      </div>
      
      <input 
        id={`${item.id}-add-condition-photo`}
        name="addConditionPhoto"
        aria-label="Upload de foto para registro da condição"
        type="file" 
        ref={conditionPhotoInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleUploadConditionPhoto} 
      />

      {(conditions.length > 0 || Object.keys(item.correlations || {}).length > 0) && (
        <div className="flex flex-col gap-2 mb-4">
          {conditions.map((cond, idx) => {
            const addCondPhoto = (cKey: string) => {
              setUploadingConditionKey(cKey);
              setTimeout(() => conditionPhotoInputRef.current?.click(), 0);
            };

            return (
              <div key={idx} className="flex flex-col gap-1 p-2 rounded-xl bg-black/40 border border-white/5 group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/80 flex-1">{cond}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => transformConditionToAcompanhe(cond, idx)}
                      title="Transformar em Acompanhe"
                      className="text-white/20 hover:text-amber-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <PlusCircle size={14} />
                    </button>
                    <button
                      onClick={() => addCondPhoto(`cond-${idx}`)}
                      title="Anexar Foto"
                      className={`p-1 rounded-full hover:bg-white/10 transition-colors ${conditionPhotos[`cond-${idx}`] ? 'text-emerald-400' : 'text-white/30'}`}
                    >
                      <Camera size={14} />
                    </button>
                    <button 
                      onClick={() => setCheckedConditions(prev => ({...prev, [`cond-${idx}`]: !prev[`cond-${idx}`]}))}
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${checkedConditions[`cond-${idx}`] ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/20 text-transparent'}`}
                    >
                      <Check size={12} />
                    </button>
                  </div>
                </div>
                {conditionPhotos[`cond-${idx}`] && (
                  <div className="h-16 w-16 mt-1 rounded-lg overflow-hidden border border-white/10 relative">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${getAssetUrl(conditionPhotos[`cond-${idx}`])})` }} />
                  </div>
                )}
              </div>
            );
          })}
          
          {Object.keys(item.correlations || {}).map(cId => {
            const cItem = items[cId];
            if (!cItem) return null;
            
            const todayStr = new Date().toISOString().split('T')[0];
            const logsToday = logs.filter(l => {
              if (l.trackerItemId !== cId) return false;
              const lDateStr = new Date(l.timestamp).toISOString().split('T')[0];
              return lDateStr === todayStr;
            });
            const loops = cItem.config?.dailyLoops ?? 1;
            const targetLoops = loops === 'infinite' ? 1 : (typeof loops === 'number' ? loops : 1);
            
            let validLogs = logsToday;
            const hasConditions = cItem.config?.conditions && cItem.config.conditions.length > 0;
            if (hasConditions) {
              validLogs = logsToday.filter(l => l.metadata?.allConditionsMet === true);
            }
            
            const isCompletedToday = validLogs.length >= targetLoops;

            const isLibertesse = cItem.type === 'vice';
            const addCondPhoto = (cKey: string) => {
              setUploadingConditionKey(cKey);
              setTimeout(() => conditionPhotoInputRef.current?.click(), 0);
            };
            
            const cardBgClass = isCompletedToday 
              ? 'bg-emerald-500/10 border-emerald-500/30 border-l-emerald-500' 
              : 'bg-rose-500/10 border-rose-500/30 border-l-rose-500';
            const textClass = isCompletedToday ? 'text-emerald-300' : 'text-rose-300';
            
            return (
              <div key={cId} 
                    className={`flex flex-col gap-1 p-2 rounded-xl border border-l-4 group transition-colors ${cardBgClass}`}
                    style={cItem.coverPhoto ? { backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.6)), url(${getAssetUrl(cItem.coverPhoto)})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              >
                <div className="flex items-center justify-between">
                  <span 
                    className={`text-[11px] font-bold flex-1 cursor-pointer hover:underline ${textClass}`}
                    onClick={() => openCorrelatedItem(cId)}
                  >
                    {cItem.name || cItem.id.substring(0, 8)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addCondPhoto(`corr-${cId}`)}
                      title="Anexar Foto"
                      className={`p-1 rounded-full hover:bg-white/10 transition-colors ${conditionPhotos[`corr-${cId}`] ? 'text-emerald-400' : 'text-white/30'}`}
                    >
                      <Camera size={14} />
                    </button>
                    <div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${isCompletedToday ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-rose-500/20 border-rose-500/50 text-rose-400'}`}
                    >
                      <Check size={12} />
                    </div>
                  </div>
                </div>
                {conditionPhotos[`corr-${cId}`] && (
                  <div className="h-16 w-16 mt-1 rounded-lg overflow-hidden border border-white/10 relative">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${getAssetUrl(conditionPhotos[`corr-${cId}`])})` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => {
          const totalConditions = conditions.length;
          const metCount = Object.keys(checkedConditions).filter(k => k.startsWith('cond-') && checkedConditions[k]).length;
          const allMet = totalConditions > 0 && metCount === totalConditions;

          const metadata = {
            checkedConditions,
            conditionPhotos,
            totalConditions,
            allConditionsMet: allMet
          };

          setCheckedConditions({});
          setConditionPhotos({});
          handleEditLog('NEW', '', undefined, metadata);
        }}
        className="w-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 font-black uppercase tracking-widest text-xs py-3 rounded-xl transition-colors shadow-[0_0_15px_rgba(16,185,129,0.1)]"
      >
        Gravar Registro
      </button>
    </div>
  );
}
