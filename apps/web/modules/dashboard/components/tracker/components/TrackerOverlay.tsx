import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, Camera, Link as LinkIcon, Loader2, Trash2, Check, EyeOff, Eye, Clock, Edit2 } from 'lucide-react';
import { TrackerItem, useTrackerStore } from '../store/trackerStore';
import { apiService } from '@/services/api';

interface TrackerOverlayProps {
  itemId: string;
  onClose: () => void;
}

export function TrackerOverlay({ itemId, onClose }: TrackerOverlayProps) {
  const { items, logs, setItem: updateItem, removeItem: deleteItem, toggleCoverPhoto, addLog, updateLog, deleteLog } = useTrackerStore();
  const item = items[itemId];

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [name, setName] = useState(item?.name || '');
  const [description, setDescription] = useState(item?.description || '');
  const [stage, setStage] = useState(item?.config?.stage || '');

  const initialStartDateStr = item?.startDate ? new Date(item.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  const [startDateStr, setStartDateStr] = useState(initialStartDateStr);

  const initialEndDateStr = item?.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '';
  const [endDateStr, setEndDateStr] = useState(initialEndDateStr);

  const activeMarkers = item?.config?.activeMarkers || ['elapsed', 'stage', 'remaining'];
  const [showMarkersMenu, setShowMarkersMenu] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showCorrelations, setShowCorrelations] = useState(false);

  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editingLogInfo, setEditingLogInfo] = useState('');
  const [editingLogPhoto, setEditingLogPhoto] = useState<string | null>(null);
  const [isUploadingLogPhoto, setIsUploadingLogPhoto] = useState(false);
  const logFileInputRef = useRef<HTMLInputElement>(null);

  const showCoverPhoto = item?.config?.showCoverPhoto !== false;

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleUploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiService.upload<{ url: string }>('/upload?type=tracker', formData);
      if (res.url) {
        updateItem({ ...item, coverPhoto: res.url });
      }
    } catch (e) {
      console.error('Erro ao subir foto', e);
      alert('Falha ao subir imagem. Verifique sua conexão.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveField = (field: string, value: any) => {
    if (field === 'endDateStr') {
      let newEndDate: number | undefined = undefined;
      if (value) {
        const [year, month, day] = value.split('-').map(Number);
        newEndDate = new Date(year, month - 1, day, 23, 59, 59).getTime();
      }
      updateItem({ ...item, endDate: newEndDate });
    } else if (field === 'stage') {
      const newConfig = { ...(item.config || {}), stage: value };
      updateItem({ ...item, config: newConfig });
    } else {
      updateItem({ ...item, [field]: value });
    }
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja apagar este acompanhamento? Todas as bolhas e dados serão perdidos.')) {
      deleteItem(item.id);
      onClose();
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose();
    }
  };

  const handleEditLog = (logId: string, currentInfo: string = '', currentPhoto?: string) => {
    setEditingLogId(logId);
    setEditingLogInfo(currentInfo);
    setEditingLogPhoto(currentPhoto || null);
  };

  const saveLogEdit = (logId: string) => {
    updateLog(logId, { info: editingLogInfo, photoUrl: editingLogPhoto || undefined });
    setEditingLogId(null);
  };

  const handleDeleteLog = (logId: string) => {
    deleteLog(logId);
    setEditingLogId(null);
  };

  const handleUploadLogPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingLogPhoto(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiService.upload<{ url: string }>('/upload?type=tracker', formData);
      if (res.url) {
        setEditingLogPhoto(res.url);
      }
    } catch (e) {
      console.error('Erro ao subir foto do registro', e);
      alert('Falha ao subir imagem. Verifique sua conexão.');
    } finally {
      setIsUploadingLogPhoto(false);
    }
  };

  const calculateDays = () => {
    return Math.floor((Date.now() - item.startDate) / (1000 * 60 * 60 * 24));
  };

  const calculateRemaining = () => {
    if (!item.endDate) return 'Contínuo';
    const remaining = Math.ceil((item.endDate - Date.now()) / (1000 * 60 * 60 * 24));
    return remaining > 0 ? `${remaining} dias` : 'Finalizado';
  };

  const toggleCorrelation = (targetId: string) => {
    const newCorrelations = { ...item.correlations };
    if (newCorrelations[targetId]) {
      delete newCorrelations[targetId];
    } else {
      newCorrelations[targetId] = 'linked';
    }
    updateItem({ ...item, correlations: newCorrelations });
  };

  const isNameDirty = name !== item?.name;
  const isDescDirty = description !== (item?.description || '');
  const isStageDirty = stage !== (item?.config?.stage || '');
  const isEndDirty = endDateStr !== initialEndDateStr;
  const isStartDirty = startDateStr !== initialStartDateStr;

  const toggleMarker = (markerId: string) => {
    if (!item) return;
    const current = [...activeMarkers];
    const index = current.indexOf(markerId);
    if (index >= 0) current.splice(index, 1);
    else current.push(markerId);
    updateItem({
      ...item,
      config: { ...item.config, activeMarkers: current }
    });
  };

  const otherItems = Object.values(items).filter(t => t.id !== item?.id && t.status === 'ACTIVE');

  const itemLogs = logs.filter(l => l.trackerItemId === itemId).sort((a, b) => b.timestamp - a.timestamp);

  if (!item || !mounted) return null;

  return createPortal(
    <React.Fragment>
      <AnimatePresence>
        <motion.div
          key="overlay-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000005] flex flex-col bg-[#0a0c0a]"
        >
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            dragElastic={0.2}
            className="flex-1 w-full flex flex-col relative bg-[#0a0c0a] overflow-hidden"
          >
            {showCoverPhoto && item.coverPhoto && (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-luminosity pointer-events-none"
                  style={{ backgroundImage: `url(${item.coverPhoto})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c0a]/50 via-[#0a0c0a]/80 to-[#0a0c0a] pointer-events-none" />
              </>
            )}

            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full z-[1000006]" />

            {/* Hidden file input for log photos */}
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              ref={logFileInputRef}
              onChange={handleUploadLogPhoto}
            />

            {/* Header */}
            <div className="relative h-28 shrink-0 flex flex-col justify-end p-4 border-b border-white/5 bg-transparent">
              {showCoverPhoto && item.coverPhoto && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
                  style={{ backgroundImage: `url(${item.coverPhoto})` }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c0a] via-[#0a0c0a]/40 to-transparent pointer-events-none" />

              {/* Top Right Controls */}
              <div
                className="absolute top-6 right-4 flex items-center gap-2 z-[100]"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleUploadPhoto}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-black/50 text-white/50 hover:text-white hover:bg-black/80 transition-colors disabled:opacity-50"
                  title="Mudar Foto de Capa"
                >
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                </button>

                <button
                  onClick={() => toggleCoverPhoto(item.id)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${showCoverPhoto ? 'bg-black/50 text-white/50 hover:text-white hover:bg-black/80' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40'}`}
                  title={showCoverPhoto ? "Ocultar Foto na Bolha" : "Mostrar Foto na Bolha"}
                >
                  {showCoverPhoto ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>

                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                  title="Fechar"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col pt-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1 block">
                  {item.type === 'medicine' ? ' Medicamento' : ' Acompanhe'}
                </span>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()}
                    placeholder="NOME"
                    className={`w-full bg-transparent font-black text-white uppercase tracking-tight leading-none border-b border-transparent hover:border-white/20 focus:border-emerald-500/50 focus:outline-none transition-colors ${!name ? 'text-3xl' : 'text-2xl'}`}
                  />
                  <AnimatePresence>
                    {isNameDirty && (
                      <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => handleSaveField('name', name)}
                        className="w-8 h-8 shrink-0 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/40 transition-colors"
                        title="Salvar Nome"
                      >
                        <Check size={16} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto p-4 overscroll-contain touch-pan-y custom-scrollbar"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-12">

                <div className="flex items-center flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider text-white/50 relative">
                  {activeMarkers.includes('elapsed') && (
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                      <span>Dias corridos:</span>
                      <span className="text-white">{calculateDays()}</span>
                    </div>
                  )}
                  {activeMarkers.includes('stage') && (
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded relative group">
                      <span>Etapa:</span>
                      <input
                        type="text"
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                        placeholder="NOME"
                        className="w-16 bg-transparent text-white focus:outline-none placeholder-white/20"
                      />
                      <AnimatePresence>
                        {isStageDirty && (
                          <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={() => handleSaveField('stage', stage)}
                            className="w-4 h-4 shrink-0 absolute right-1 rounded-full bg-emerald-500 text-black flex items-center justify-center hover:bg-emerald-400 transition-colors"
                          >
                            <Check size={10} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  {activeMarkers.includes('remaining') && (
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded relative group">
                      <span>Falta:</span>
                      {endDateStr ? (
                        <span className="text-emerald-400">{calculateRemaining()}</span>
                      ) : (
                        <span className="text-white/30">∞</span>
                      )}
                      <input
                        type="date"
                        value={endDateStr}
                        onChange={(e) => setEndDateStr(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <AnimatePresence>
                        {isEndDirty && (
                          <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={() => handleSaveField('endDateStr', endDateStr)}
                            className="w-4 h-4 shrink-0 absolute right-1 rounded-full bg-emerald-500 text-black flex items-center justify-center z-10 hover:bg-emerald-400 transition-colors"
                          >
                            <Check size={10} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded relative group cursor-pointer">
                    <span>Início:</span>
                    <span className="text-white">{startDateStr.split('-').reverse().join('/')}</span>
                    <input
                      type="date"
                      value={startDateStr}
                      onChange={(e) => setStartDateStr(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <AnimatePresence>
                      {isStartDirty && (
                        <motion.button
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          onClick={() => handleSaveField('startDate', new Date(startDateStr).getTime())}
                          className="w-4 h-4 shrink-0 absolute right-1 rounded-full bg-emerald-500 text-black flex items-center justify-center z-10 hover:bg-emerald-400 transition-colors"
                        >
                          <Check size={10} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative ml-auto">
                    <button
                      onClick={() => setShowMarkersMenu(!showMarkersMenu)}
                      className="text-[9px] bg-white/10 text-white/50 hover:text-white px-2 py-1 rounded font-bold uppercase transition-colors"
                    >
                      + Marcador
                    </button>
                    <AnimatePresence>
                      {showMarkersMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-[#111311] border border-white/10 rounded-xl p-2 z-20 shadow-2xl flex flex-col gap-1"
                        >
                          {[
                            { id: 'elapsed', label: 'Dias Corridos' },
                            { id: 'stage', label: 'Etapa / Dias da Etapa' },
                            { id: 'remaining', label: 'Dias para finalizar' }
                          ].map(m => (
                            <button
                              key={m.id}
                              onClick={() => toggleMarker(m.id)}
                              className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-[10px] font-bold transition-colors ${activeMarkers.includes(m.id) ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-white/5 text-white/50'}`}
                            >
                              {m.label}
                              {activeMarkers.includes(m.id) && <Check size={12} />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-2 block">Descrição / Finalidade</label>
                  <div className="relative">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descreva a finalidade..."
                      className="w-full bg-transparent p-2 text-[11px] font-medium text-white/80 focus:outline-none focus:bg-white/[0.02] resize-none h-10 transition-colors custom-scrollbar"
                    />
                    <AnimatePresence>
                      {isDescDirty && (
                        <motion.button
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          onClick={() => handleSaveField('description', description)}
                          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/40 transition-colors"
                          title="Salvar Descrição"
                        >
                          <Check size={14} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="py-2">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <LinkIcon size={14} className="text-indigo-400" />
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Correlações Ativas</span>
                    </div>
                    <button
                      onClick={() => setShowCorrelations(!showCorrelations)}
                      className="text-[9px] bg-indigo-500/10 text-indigo-300 px-2 py-1 rounded hover:bg-indigo-500/20 font-bold uppercase transition-colors"
                    >
                      {showCorrelations ? 'Ocultar' : '+ Adicionar'}
                    </button>
                  </div>

                  {Object.keys(item.correlations || {}).length === 0 ? (
                    <p className="text-[10px] text-white/30 font-medium">
                      Nenhuma tarefa vinculada.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(item.correlations || {}).map(cId => {
                        const cItem = items[cId];
                        if (!cItem) return null;
                        return (
                          <div key={cId} className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-300 px-2.5 py-1 text-[10px] font-bold rounded-md border border-indigo-500/20">
                            {cItem.name || cItem.id.substring(0, 8)}
                            <button onClick={() => toggleCorrelation(cId)} className="text-indigo-400/50 hover:text-indigo-300">
                              <X size={10} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <AnimatePresence>
                    {showCorrelations && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-indigo-500/10 flex flex-col gap-1 overflow-hidden"
                      >
                        <span className="text-[9px] text-white/30 uppercase font-bold tracking-wider mb-1">Selecione para vincular:</span>
                        {otherItems.length === 0 ? (
                          <p className="text-[10px] text-white/30">Nenhuma outra tarefa ativa encontrada.</p>
                        ) : (
                          otherItems.map(other => {
                            const isLinked = !!item.correlations?.[other.id];
                            return (
                              <div
                                key={other.id}
                                onClick={() => toggleCorrelation(other.id)}
                                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border transition-colors ${isLinked ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'}`}
                              >
                                <span className={`text-[11px] font-bold ${isLinked ? 'text-indigo-300' : 'text-white/60'}`}>
                                  {other.name || other.id.substring(0, 8)}
                                </span>
                                {isLinked && <Check size={12} className="text-indigo-400" />}
                              </div>
                            );
                          })
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Histórico de Registros */}
                <div className="py-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Histórico de Registros</span>
                    </div>
                    <button
                      onClick={() => {
                        const store = useTrackerStore.getState();
                        store.addLog({
                          trackerItemId: itemId,
                          type: 'consumption',
                          info: '',
                          value: 1
                        });
                      }}
                      className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded hover:bg-emerald-500/20 font-bold uppercase transition-colors"
                    >
                      + Novo
                    </button>
                  </div>

                  {itemLogs.length === 0 ? (
                    <p className="text-[10px] text-white/30 font-medium text-center py-2">Nenhum registro encontrado.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {itemLogs.map(log => {
                        const dateObj = new Date(log.timestamp);
                        const dateStr = dateObj.toLocaleDateString('pt-BR');
                        const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                        const isEditing = editingLogId === log.id;

                        return (
                          <div
                            key={log.id}
                            onClick={() => handleEditLog(log.id, log.info, log.photoUrl)}
                            className="py-3 px-3 flex flex-col gap-2 relative overflow-hidden rounded-xl border border-white/5 bg-zinc-900/30 cursor-pointer hover:border-white/10 transition-colors"
                          >
                            {log.photoUrl && (
                              <>
                                <div
                                  className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none mix-blend-screen"
                                  style={{ backgroundImage: `url(${log.photoUrl})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c0a] via-[#0a0c0a]/60 to-transparent pointer-events-none" />
                              </>
                            )}
                            <div className="flex items-center justify-between relative z-10 pointer-events-none">
                              <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest bg-black/40 px-2 py-1 rounded">
                                {log.type === 'start' ? '🟢 Início' :
                                  log.type === 'end' ? '🔴 Fim' :
                                    log.type === 'consumption' ? '✅ Registro' : log.type}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-white/30 font-bold">{dateStr} às {timeStr}</span>
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

                {/* Delete Area */}
                <div className="pt-8 flex justify-center">
                  {!isConfirmingDelete ? (
                    <button
                      onClick={() => setIsConfirmingDelete(true)}
                      className="flex items-center gap-2 text-[10px] font-bold text-white/30 hover:text-red-400 bg-white/[0.02] hover:bg-red-500/10 px-4 py-2 rounded-full transition-colors uppercase tracking-wider"
                    >
                      <Trash2 size={14} />
                      Deletar Acompanhamento
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-4 bg-red-500/10 border border-red-500/20 p-4 rounded-xl w-full"
                    >
                      <div className="text-center">
                        <span className="text-[11px] font-black text-red-400 uppercase tracking-widest block mb-1">Deseja mesmo deletar?</span>
                        <span className="text-[10px] text-white/60">Isso vai deletar todos os dados salvos, inclusive fotos e histórico. Essa ação é irreversível.</span>
                      </div>
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => setIsConfirmingDelete(false)}
                          className="flex-1 text-[10px] font-bold text-white/50 bg-white/5 hover:bg-white/10 py-3 rounded-lg transition-colors uppercase"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleDelete}
                          className="flex-1 text-[10px] font-bold text-red-100 bg-red-500/80 hover:bg-red-500 py-3 rounded-lg transition-colors uppercase shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        >
                          Sim, Deletar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Edit Log Modal */}
      <AnimatePresence>
        {editingLogId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000010] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-5 w-full max-w-sm flex flex-col gap-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-[12px] font-bold text-emerald-400 uppercase tracking-widest">
                  Editar Registro
                </span>
                <button
                  onClick={() => setEditingLogId(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <textarea
                  value={editingLogInfo}
                  onChange={(e) => setEditingLogInfo(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[12px] text-white/80 focus:outline-none focus:border-emerald-500/50 resize-none h-24 custom-scrollbar"
                  placeholder="Anotação..."
                />

                {editingLogPhoto && (
                  <div className="rounded-xl overflow-hidden border border-white/10 relative h-32 w-full">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${editingLogPhoto})` }}
                    />
                    <button
                      onClick={() => setEditingLogPhoto(null)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors shadow-lg"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                <div className="flex justify-between items-center mt-2">
                  <button
                    onClick={() => logFileInputRef.current?.click()}
                    disabled={isUploadingLogPhoto}
                    className="text-[10px] font-bold text-white/60 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 flex items-center gap-2 disabled:opacity-50 transition-colors"
                  >
                    {isUploadingLogPhoto ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
                    ALTERAR FOTO
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2 mt-2 border-t border-white/5">
                <button
                  onClick={() => editingLogId && saveLogEdit(editingLogId)}
                  className="w-full py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Check size={14} />
                  Salvar Alterações
                </button>
                <button
                  onClick={() => editingLogId && handleDeleteLog(editingLogId)}
                  className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 size={14} />
                  Deletar Registro
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>,
    document.body
  );
}
