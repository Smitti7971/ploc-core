import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, Check, Camera, Loader2, Image as ImageIcon } from 'lucide-react';
import { getAssetUrl } from '@/lib/config';
import { useTrackerStore } from '../../store/trackerStore';

interface EditLogModalProps {
  editingLogId: string | null;
  setEditingLogId: (id: string | null) => void;
  itemLogs: any[];
  editingLogTitle: string;
  setEditingLogTitle: (val: string) => void;
  handleDeleteLog: (id: string) => void;
  saveLogEdit: (id: string) => void;
  logFileInputRef: React.RefObject<HTMLInputElement | null>;
  editingLogPhoto: string | null;
  isUploadingLogPhoto: boolean;
  editingLogInfo: string;
  setEditingLogInfo: (val: string) => void;
  conditions: string[];
  item: any;
  setUploadingConditionKey: (key: string) => void;
  conditionPhotoInputRef: React.RefObject<HTMLInputElement | null>;
  editingLogConditionPhotos: Record<string, string>;
  editingLogCheckedConditions: Record<string, boolean>;
  setEditingLogCheckedConditions: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  items: Record<string, any>;
  openCorrelatedItem: (id: string) => void;
}

export function EditLogModal({
  editingLogId,
  setEditingLogId,
  itemLogs,
  editingLogTitle,
  setEditingLogTitle,
  handleDeleteLog,
  saveLogEdit,
  logFileInputRef,
  editingLogPhoto,
  isUploadingLogPhoto,
  editingLogInfo,
  setEditingLogInfo,
  conditions,
  item,
  setUploadingConditionKey,
  conditionPhotoInputRef,
  editingLogConditionPhotos,
  editingLogCheckedConditions,
  setEditingLogCheckedConditions,
  items,
  openCorrelatedItem
}: EditLogModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const logs = useTrackerStore(state => state.logs);

  if (!editingLogId) return null;

  const currentLog = itemLogs.find(l => l.id === editingLogId);
  const logTime = currentLog ? new Date(currentLog.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const logTitle = editingLogId === 'NEW' ? `NOVO REGISTRO - ${logTime}` : `REGISTRO - ${logTime}`;

  const hasConditions = conditions.length > 0 || Object.keys(item.correlations || {}).length > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-zinc-900 border border-white/10 rounded-[28px] w-full max-w-[340px] flex flex-col shadow-2xl overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Image Banner */}
          <div 
            onClick={() => logFileInputRef.current?.click()}
            className="w-full h-48 bg-black/40 relative cursor-pointer group flex items-center justify-center border-b border-white/10"
          >
            {editingLogPhoto ? (
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${getAssetUrl(editingLogPhoto)})` }} />
            ) : (
              isUploadingLogPhoto ? (
                <Loader2 size={32} className="animate-spin text-white/20" />
              ) : (
                <ImageIcon size={48} className="text-white/10 group-hover:scale-110 transition-transform duration-300" />
              )
            )}
            
            {/* Gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Top Overlay Buttons */}
            <div className="absolute top-3 right-3 flex gap-2 z-10">
              <button 
                onClick={(e) => { e.stopPropagation(); setEditingLogId(null); }} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white/70 hover:bg-black/60 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center rounded-full p-2">
               <div className="bg-black/60 backdrop-blur-sm text-white/90 font-medium text-[11px] px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 opacity-80 group-hover:opacity-100 transition-opacity">
                 <Camera size={14} />
                 {editingLogPhoto ? "Trocar Foto" : "Adicionar Foto"}
               </div>
            </div>

            {/* Title inside image banner */}
            <div className="absolute bottom-0 left-0 w-full p-4 pt-8">
              <input 
                 id="editLogTitle"
                 name="editLogTitle"
                 aria-label="Título do Registro"
                 type="text" 
                 className="text-[26px] font-extrabold text-white bg-transparent outline-none placeholder-white/50 w-full drop-shadow-md"
                 value={editingLogTitle}
                 onChange={(e) => setEditingLogTitle(e.target.value)}
                 onClick={(e) => e.stopPropagation()}
                 placeholder={logTitle}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="p-5 flex flex-col bg-zinc-900">
            <textarea 
               id="editLogInfo"
               name="editLogInfo"
               aria-label="Notas Detalhadas"
               className="text-[16px] text-white/70 bg-transparent outline-none resize-none h-20 w-full leading-relaxed placeholder-white/30 mb-4"
               value={editingLogInfo}
               onChange={(e) => setEditingLogInfo(e.target.value)}
               placeholder="Adicione notas detalhadas..."
            />

            {/* Conditions / Correlations Area (Small scrolling list if they exist) */}
            {hasConditions && (
              <div className="flex flex-col gap-2 max-h-32 overflow-y-auto custom-scrollbar mb-4 border-t border-white/5 pt-3">
                {conditions.map((cond, idx) => {
                  const cKey = `cond-${idx}`;
                  const addCondPhoto = () => {
                    setUploadingConditionKey(cKey);
                    setTimeout(() => conditionPhotoInputRef.current?.click(), 0);
                  };
                  return (
                    <div key={idx} className="flex flex-col gap-1 p-2 rounded-xl bg-black/40 border border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-white/70 font-medium flex-1">{cond}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={addCondPhoto} className={`p-1 rounded-full hover:bg-white/10 transition-colors ${editingLogConditionPhotos[cKey] ? 'text-emerald-400' : 'text-white/20'}`}><Camera size={14} /></button>
                          <button onClick={() => setEditingLogCheckedConditions(p => ({...p, [cKey]: !p[cKey]}))} className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${editingLogCheckedConditions[cKey] ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/20 text-transparent'}`}><Check size={12} /></button>
                        </div>
                      </div>
                      {editingLogConditionPhotos[cKey] && (
                        <div className="h-10 w-10 mt-1 rounded-md overflow-hidden border border-white/10 relative">
                          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${getAssetUrl(editingLogConditionPhotos[cKey])})` }} />
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
                  const cKey = `corr-${cId}`;
                  const addCondPhoto = () => {
                    setUploadingConditionKey(cKey);
                    setTimeout(() => conditionPhotoInputRef.current?.click(), 0);
                  };

                  const cardBgClass = isCompletedToday 
                    ? 'bg-emerald-500/10 border-emerald-500/30 border-l-emerald-500' 
                    : 'bg-rose-500/10 border-rose-500/30 border-l-rose-500';
                  const textClass = isCompletedToday ? 'text-emerald-300' : 'text-rose-300';

                  return (
                    <div key={cId} className={`flex flex-col gap-1 p-2 rounded-xl border border-l-4 transition-colors ${cardBgClass}`}>
                      <div className="flex items-center justify-between">
                        <span 
                          className={`text-[11px] font-bold flex-1 cursor-pointer hover:underline ${textClass}`}
                          onClick={() => openCorrelatedItem(cId)}
                        >
                          {cItem.name || cItem.id.substring(0, 8)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button onClick={addCondPhoto} className={`p-1 rounded-full hover:bg-white/10 transition-colors ${editingLogConditionPhotos[cKey] ? 'text-emerald-400' : 'text-white/20'}`}><Camera size={14} /></button>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${isCompletedToday ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-rose-500/20 border-rose-500/50 text-rose-400'}`}><Check size={12} /></div>
                        </div>
                      </div>
                      {editingLogConditionPhotos[cKey] && (
                        <div className="h-10 w-10 mt-1 rounded-md overflow-hidden border border-white/10 relative">
                          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${getAssetUrl(editingLogConditionPhotos[cKey])})` }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-2">
              {editingLogId !== 'NEW' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }} 
                  className="w-1/5 py-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-400 transition-colors shadow-lg shadow-red-500/5"
                  title="Deletar Registro"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <button 
                onClick={() => saveLogEdit(editingLogId)}
                className={`py-3.5 rounded-xl bg-[#5B79EB] hover:bg-[#4A64C9] text-white font-semibold text-[14px] transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 ${editingLogId === 'NEW' ? 'w-full' : 'w-4/5'}`}
              >
                Salvar Registro
              </button>
            </div>
          </div>
        </motion.div>

        {/* Confirmation Modal Below */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              className="bg-zinc-900 border border-red-500/30 w-full max-w-[340px] p-4 rounded-[24px] shadow-2xl flex flex-col gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center text-white/90 text-[14px] font-medium">
                Apagar este registro permanentemente?
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[13px] font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    handleDeleteLog(editingLogId);
                    setShowDeleteConfirm(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-medium transition-colors shadow-lg shadow-red-500/20"
                >
                  Sim, apagar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
