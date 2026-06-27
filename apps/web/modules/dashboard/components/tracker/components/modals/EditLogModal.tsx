import React, { useState, useEffect } from 'react';
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
  setEditingLogPhoto: (val: string | null) => void;
  editingLogPhotos: string[];
  setEditingLogPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  editingLogTimestamp: number;
  setEditingLogTimestamp: (val: number) => void;
  isUploadingLogPhoto: boolean;
  setIsUploadingLogPhoto: (val: boolean) => void;
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
  removeCorrelation?: (cId: string) => void;
  handleEditLog: (logId: string, info?: string, photoUrl?: string, metadata?: any, timestamp?: number, photoUrls?: string[]) => void;
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
  setEditingLogPhoto,
  editingLogPhotos,
  setEditingLogPhotos,
  editingLogTimestamp,
  setEditingLogTimestamp,
  isUploadingLogPhoto,
  setIsUploadingLogPhoto,
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
  openCorrelatedItem,
  removeCorrelation,
  handleEditLog
}: EditLogModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePhotoIndex, setDeletePhotoIndex] = useState<number | null>(null);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const logs = useTrackerStore(state => state.logs);

  useEffect(() => {
    setShowUnsavedWarning(false);
  }, [editingLogId]);

  if (!editingLogId) return null;

  const currentLog = itemLogs.find(l => l.id === editingLogId);
  
  let isDirty = false;
  if (editingLogId === 'NEW') {
    isDirty = true;
  } else if (currentLog) {
    const originalPhotos = currentLog.photoUrls || (currentLog.photoUrl ? [currentLog.photoUrl] : []);
    const photosChanged = JSON.stringify(editingLogPhotos) !== JSON.stringify(originalPhotos);
    const checkedConditionsChanged = JSON.stringify(editingLogCheckedConditions) !== JSON.stringify(currentLog.metadata?.checkedConditions || {});
    const conditionPhotosChanged = JSON.stringify(editingLogConditionPhotos) !== JSON.stringify(currentLog.metadata?.conditionPhotos || {});
    
    const safeTrim = (str: any) => (typeof str === 'string' ? str.trim() : '');
    
    isDirty = safeTrim(editingLogTitle) !== safeTrim(currentLog.metadata?.title) ||
              safeTrim(editingLogInfo) !== safeTrim(currentLog.info) ||
              editingLogTimestamp !== currentLog.timestamp ||
              photosChanged ||
              checkedConditionsChanged ||
              conditionPhotosChanged;
  }

  // Format local time for the time input
  const dateObj = new Date(editingLogTimestamp);
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const timeString = `${hours}:${minutes}`;

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  const getRelativeDateLabel = (timestamp: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(timestamp);
    target.setHours(0, 0, 0, 0);
    const diffMs = today.getTime() - target.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'HOJE';
    if (diffDays === 1) return 'ONTEM';
    if (diffDays > 1) return `HÁ ${diffDays} DIAS`;
    if (diffDays === -1) return 'AMANHÃ';
    return `EM ${Math.abs(diffDays)} DIAS`;
  };

  const logTitle = editingLogId === 'NEW' ? `NOVO REGISTRO` : `REGISTRO`;

  const currentIndex = itemLogs.findIndex(l => l.id === editingLogId);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [h, m] = e.target.value.split(':');
    if (h !== undefined && m !== undefined) {
      const newDate = new Date(editingLogTimestamp);
      newDate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
      setEditingLogTimestamp(newDate.getTime());
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [y, m, d] = e.target.value.split('-');
    if (y && m && d) {
      const newDate = new Date(editingLogTimestamp);
      newDate.setFullYear(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
      setEditingLogTimestamp(newDate.getTime());
    }
  };

  const hasConditions = conditions.length > 0 || Object.keys(item.correlations || {}).length > 0;
  const displayPhotos = editingLogPhotos.length > 0 ? editingLogPhotos : (editingLogPhoto ? [editingLogPhoto] : []);

  const handleDragEnd = (event: any, info: any) => {
    if (editingLogId === 'NEW') return;

    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Se o arraste foi maior que 20px ou foi um gesto rápido (swipe)
    if (Math.abs(offset) > 20 || Math.abs(velocity) > 200) {
      if (currentIndex === -1) return;

      if (isDirty) {
        setShowUnsavedWarning(true);
        setTimeout(() => setShowUnsavedWarning(false), 3000);
        return;
      }

      let targetIndex = -1;
      // offset > 0 = drag right -> previous items (older logs) -> index + 1
      // offset < 0 = drag left -> next items (newer logs) -> index - 1
      if (offset > 20 || velocity > 200) {
        targetIndex = currentIndex + 1;
      } else if (offset < -20 || velocity < -200) {
        targetIndex = currentIndex - 1;
      }

      if (targetIndex >= 0 && targetIndex < itemLogs.length) {
        const nextLog = itemLogs[targetIndex];
        handleEditLog(nextLog.id, nextLog.info, nextLog.photoUrl, nextLog.metadata, nextLog.timestamp, nextLog.photoUrls);
      }
    }
  };

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
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          dragDirectionLock={true}
          onDragEnd={handleDragEnd}
          style={{ touchAction: 'pan-y' }}
          className="bg-zinc-900 border border-white/10 rounded-[28px] w-full max-w-[340px] flex flex-col shadow-2xl overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={editingLogId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col w-full h-full"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-zinc-900 z-20 shrink-0 relative">
                {showUnsavedWarning && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-0 left-0 w-full h-full bg-rose-500/90 backdrop-blur-sm z-30 flex items-center justify-center text-white text-[12px] font-bold tracking-wide"
                  >
                    Salve o registro antes de passar!
                  </motion.div>
                )}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400">
                      {getRelativeDateLabel(editingLogTimestamp)}
                    </span>
                    {editingLogId !== 'NEW' && currentIndex === 0 && (
                      <span className="text-[8px] font-black tracking-widest uppercase bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">Último</span>
                    )}
                    {editingLogId !== 'NEW' && currentIndex === itemLogs.length - 1 && itemLogs.length > 1 && (
                      <span className="text-[8px] font-black tracking-widest uppercase bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">Primeiro</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="date" 
                      value={dateString}
                      onChange={handleDateChange}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-zinc-800 text-white/90 text-[12px] font-bold rounded-lg px-2.5 py-1.5 outline-none border border-white/10 focus:border-white/30 transition-colors"
                    />
                    <input 
                      type="time" 
                      value={timeString}
                      onChange={handleTimeChange}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-zinc-800 text-white/90 text-[12px] font-bold rounded-lg px-2.5 py-1.5 outline-none border border-white/10 focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setEditingLogId(null); }} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable Body Container */}
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-zinc-900">
                {/* Top Image Banner (First Photo or Placeholder) */}
                <div 
              onClick={() => logFileInputRef.current?.click()}
            className="w-full h-40 bg-black/40 relative cursor-pointer group flex items-center justify-center border-b border-white/10 shrink-0"
          >
            {displayPhotos[0] ? (
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${getAssetUrl(displayPhotos[0])})` }} />
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
              {displayPhotos.length === 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletePhotoIndex(0);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-rose-500/80 text-white hover:bg-rose-600 transition-colors shadow-lg"
                  title="Remover Foto"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center rounded-full p-2">
               <div className="bg-black/60 backdrop-blur-sm text-white/90 font-medium text-[11px] px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 opacity-80 group-hover:opacity-100 transition-opacity">
                 <Camera size={14} />
                 Adicionar Foto
               </div>
            </div>

            {/* Title inside image banner */}
            <div className="absolute bottom-0 left-0 w-full p-4 pt-12">
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

            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col shrink-0">
              {/* Gallery Area */}
            {displayPhotos.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar mb-4 pb-2 border-b border-white/5">
                {displayPhotos.map((photo, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 group">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${getAssetUrl(photo)})` }} />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletePhotoIndex(i);
                      }}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

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

                  const isItemCompleted = cItem.status === 'COMPLETED';

                  return (
                    <div 
                      key={cId} 
                      className={`flex flex-col gap-1 p-2 rounded-xl border border-l-4 group transition-colors cursor-pointer ${cardBgClass}`}
                      onClick={() => openCorrelatedItem(cId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col flex-1">
                          <span className={`text-[11px] font-bold group-hover:underline ${textClass}`}>
                            {cItem.name || cItem.id.substring(0, 8)}
                          </span>
                          {isItemCompleted && (
                            <span className="text-[9px] font-bold text-zinc-400 mt-0.5 uppercase">
                              Tarefa Concluída
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {removeCorrelation && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCorrelation(cId);
                              }}
                              title="Desativar Correlação"
                              className="p-1 rounded-full text-white/20 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              addCondPhoto();
                            }} 
                            className={`p-1 rounded-full hover:bg-white/10 transition-colors ${editingLogConditionPhotos[cKey] ? 'text-emerald-400' : 'text-white/20'}`}
                          >
                            <Camera size={14} />
                          </button>
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
                  className={`py-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-400 transition-colors shadow-lg shadow-red-500/5 ${isDirty ? 'w-1/5' : 'w-full'}`}
                  title="Deletar Registro"
                >
                  <Trash2 size={18} />
                  {!isDirty && <span className="ml-2 font-medium">Deletar Registro</span>}
                </button>
              )}
              {isDirty && (
                <button 
                  onClick={() => saveLogEdit(editingLogId)}
                  className={`py-3.5 rounded-xl bg-[#5B79EB] hover:bg-[#4A64C9] text-white font-semibold text-[14px] transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 ${editingLogId === 'NEW' ? 'w-full' : 'w-4/5'}`}
                >
                  Salvar Registro
                </button>
              )}
            </div>
            </div>
            </motion.div>
          </AnimatePresence>
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
          {deletePhotoIndex !== null && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              className="bg-zinc-900 border border-red-500/30 w-full max-w-[340px] p-4 rounded-[24px] shadow-2xl flex flex-col gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center text-white/90 text-[14px] font-medium">
                Remover esta foto do registro?
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setDeletePhotoIndex(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[13px] font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    const newPhotos = [...displayPhotos];
                    newPhotos.splice(deletePhotoIndex, 1);
                    setEditingLogPhotos(newPhotos);
                    if (deletePhotoIndex === 0) setEditingLogPhoto(newPhotos[0] || null);
                    setDeletePhotoIndex(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-medium transition-colors shadow-lg shadow-red-500/20"
                >
                  Sim, remover
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
