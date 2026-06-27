import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, Camera, Link as LinkIcon, Loader2, Trash2, Check, EyeOff, Eye, Clock, Edit2, TrendingDown, Activity, ListChecks, CheckSquare, PlusCircle, Map, Bell, BellOff, Settings, Save, AlertCircle } from 'lucide-react';
import { TrackerItem, useTrackerStore } from '../store/trackerStore';
import { apiService } from '@/services/api';
import { getAssetUrl } from '@/lib/config';
import { MissionAntitabagismoModal } from '@/modules/missions';
import { useCorrelationGating } from '../hooks/useCorrelationGating';
import { CorrelationGatingModal } from './CorrelationGatingModal';
import { DateEditModal } from './modals/DateEditModal';
import { StageEditModal } from './modals/StageEditModal';
import { AddConditionModal } from './modals/AddConditionModal';
import { EditLogModal } from './modals/EditLogModal';
import { CardSettingsModal } from './modals/CardSettingsModal';
import { ConfirmDeletePhotoModal } from './modals/ConfirmDeletePhotoModal';
import { ConfirmActionModal, ConfirmActionStyle } from './modals/ConfirmActionModal';
import { ConfirmSaveModal } from './modals/ConfirmSaveModal';
import { LogHistory } from './LogHistory';
import { NewLogArea } from './NewLogArea';
import { TrackerComparison } from './TrackerComparison';

function WheelPicker({ options, value, onChange, label }: { options: number[], value: number, onChange: (val: number) => void, label: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);

  const handleScroll = () => {
    isScrollingRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      if (!scrollRef.current) return;
      const index = Math.round(scrollRef.current.scrollTop / 40);
      if (options[index] !== undefined && options[index] !== value) {
        onChange(options[index]);
      }
    }, 150);
  };

  useEffect(() => {
    if (scrollRef.current && !isScrollingRef.current) {
      const idx = options.indexOf(value);
      if (idx !== -1) {
        const targetScroll = idx * 40;
        if (Math.abs(scrollRef.current.scrollTop - targetScroll) > 10) {
          scrollRef.current.scrollTop = targetScroll;
        }
      }
    }
  }, [value, options]);

  return (
    <div className="flex-1 flex flex-col items-center bg-black/40 border border-white/10 rounded-xl py-2 relative overflow-hidden">
      <label className="text-[8px] text-white/50 uppercase font-bold px-1 z-10">{label}</label>
      
      <div className="relative w-full h-[120px] mt-1">
        <div className="absolute top-[40px] left-0 right-0 h-[40px] bg-white/5 border-y border-white/10 pointer-events-none" />

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full w-full overflow-y-scroll snap-y snap-mandatory relative z-10"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="h-[40px]" />
          {options.map((opt) => (
            <div 
              key={opt} 
              className={`h-[40px] flex items-center justify-center text-lg snap-center transition-all duration-200 ${value === opt ? 'text-white font-bold scale-110' : 'text-white/40 scale-100'}`}
            >
              {opt.toString().padStart(2, '0')}
            </div>
          ))}
          <div className="h-[40px]" />
        </div>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

interface TrackerOverlayProps {
  itemId: string;
  onClose: () => void;
  contextItemIds?: string[];
  onSwitchItem?: (itemId: string) => void;
}

export function TrackerOverlay({ itemId, onClose, contextItemIds, onSwitchItem }: TrackerOverlayProps) {
  const { items, logs, setItem: storeUpdateItem, removeItem: deleteItem, addLog, updateLog, deleteLog } = useTrackerStore();
  
  const storeItem = items[itemId];
  const [localItem, setLocalItem] = useState<TrackerItem>(
    storeItem || ({ id: itemId, type: 'acompanhe', name: '', status: 'ACTIVE', startDate: Date.now() } as TrackerItem)
  );
  const item = localItem;

  const [direction, setDirection] = useState(0);
  const [swipeAlert, setSwipeAlert] = useState(false);
  const prevItemIdRef = useRef(itemId);

  useEffect(() => {
    if (prevItemIdRef.current !== itemId) {
      prevItemIdRef.current = itemId;
      const newItem = items[itemId];
      setLocalItem(newItem || ({ id: itemId, type: 'acompanhe', name: '', status: 'ACTIVE', startDate: Date.now() } as TrackerItem));
      setIsConfirmSaveOpen(false);
      setIsDateModalOpen(false);
      setIsStageModalOpen(false);
      setEditingLogId(null);
      setActiveTab(null);
      setIsSettingsModalOpen(false);
      setSwipeAlert(false);
    }
  }, [itemId, items]);

  useEffect(() => {
    if (swipeAlert) {
      const timer = setTimeout(() => setSwipeAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [swipeAlert]);

  const swipeVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const handleSwipeEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!contextItemIds || contextItemIds.length <= 1 || !onSwitchItem) return;
    
    const currentIndex = contextItemIds.indexOf(itemId);
    const threshold = 100;
    
    if (Math.abs(info.offset.x) > threshold && hasChanges) {
      setSwipeAlert(true);
      return;
    }

    if (info.offset.x < -threshold && currentIndex < contextItemIds.length - 1) {
      setDirection(1);
      onSwitchItem(contextItemIds[currentIndex + 1]);
    } else if (info.offset.x > threshold && currentIndex > 0) {
      setDirection(-1);
      onSwitchItem(contextItemIds[currentIndex - 1]);
    }
  };
  
  // Custom update function that updates local state instead of the store
  const updateItem = (newItem: any) => {
    setLocalItem(newItem);
  };
  
  // Custom delete cover photo logic
  const handleCoverPhotoToggleLocal = () => {
    updateItem({ ...item, coverPhoto: undefined });
  };

  // Helper para ignorar espaos extras nas comparaes
  const trimDeep = (obj: any): any => {
    if (typeof obj === 'string') return obj.trim();
    if (Array.isArray(obj)) return obj.map(trimDeep);
    if (obj !== null && typeof obj === 'object') {
      const newObj: any = {};
      for (const key in obj) {
        newObj[key] = trimDeep(obj[key]);
      }
      return newObj;
    }
    return obj;
  };

  const hasChanges = JSON.stringify(trimDeep(localItem)) !== JSON.stringify(trimDeep(storeItem));
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);

  const handleClose = () => {
    if (hasChanges) {
      setIsConfirmSaveOpen(true);
    } else {
      if (!item.name || item.name.trim() === '') {
        deleteItem(item.id);
      }
      onClose();
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [stage, setStage] = useState(item?.config?.stage || '');
  const [activeTab, setActiveTab] = useState<'looping' | 'tarefas' | 'condicoes' | 'correlacoes' | 'estrategia' | 'custos' | null>(null);

  const initialStartDateStr = item?.startDate ? new Date(item.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  const [startDateStr, setStartDateStr] = useState(initialStartDateStr);

  const initialEndDateStr = item?.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '';
  const [endDateStr, setEndDateStr] = useState(initialEndDateStr);

  // Modais de edição de período e etapas
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [tempStartDateStr, setTempStartDateStr] = useState('');
  const [tempEndDateStr, setTempEndDateStr] = useState('');
  const [tempExpectedTime, setTempExpectedTime] = useState('');

  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [tempStageName, setTempStageName] = useState('');
  const [tempStageStartDateStr, setTempStageStartDateStr] = useState('');
  const [tempStageEndDateStr, setTempStageEndDateStr] = useState('');

  const activeMarkers = item?.config?.activeMarkers || ['elapsed', 'stage', 'remaining'];
  const showMarkersMenuState = useState(false);
  const showMarkersMenu = showMarkersMenuState[0];
  const setShowMarkersMenu = showMarkersMenuState[1];

  const showStartDate = !!item?.config?.showStartDate;
  const showDaysTarget = !!item?.config?.showDaysTarget;
  const showStage = !!item?.config?.showStage;
  const showMarkers = !!item?.config?.showMarkers;

  const [isAddConditionModalOpen, setIsAddConditionModalOpen] = useState(false);
  const [newConditionTitle, setNewConditionTitle] = useState('');
  const [editingConditionIndex, setEditingConditionIndex] = useState<number | null>(null);
  const conditions = item?.config?.conditions || [];
  const todos = item?.config?.todos || [];
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoDate, setNewTodoDate] = useState('');

  const removeCondition = (index: number) => {
    const updated = [...conditions];
    updated.splice(index, 1);
    updateItem({
      ...item,
      config: { ...item.config, conditions: updated }
    });
  };

  const addTodo = () => {
    if (!newTodoText.trim()) return;
    const newTodo = {
      id: crypto.randomUUID(),
      text: newTodoText.trim(),
      date: newTodoDate || new Date().toISOString().split('T')[0],
      completed: false
    };
    updateItem({
      ...item,
      config: { ...item.config, todos: [...todos, newTodo].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) }
    });
    setNewTodoText('');
    setNewTodoDate('');
  };

  const toggleTodo = (id: string) => {
    const updated = todos.map((t: any) => t.id === id ? { ...t, completed: !t.completed } : t);
    updateItem({
      ...item,
      config: { ...item.config, todos: updated }
    });
  };

  const deleteTodo = (id: string) => {
    const updated = todos.filter((t: any) => t.id !== id);
    updateItem({
      ...item,
      config: { ...item.config, todos: updated }
    });
  };

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showCorrelations, setShowCorrelations] = useState(false);

  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editingLogTitle, setEditingLogTitle] = useState('');
  const [editingLogInfo, setEditingLogInfo] = useState('');
  const [editingLogPhoto, setEditingLogPhoto] = useState<string | null>(null);
  const [editingLogPhotos, setEditingLogPhotos] = useState<string[]>([]);
  const [editingLogTimestamp, setEditingLogTimestamp] = useState<number>(Date.now());
  const [isUploadingLogPhoto, setIsUploadingLogPhoto] = useState(false);
  const logFileInputRef = useRef<HTMLInputElement>(null);

  const showCoverPhoto = item?.config?.showCoverPhoto !== false;

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{ isOpen: boolean; title: string; description: string; actionStyle: ConfirmActionStyle; onConfirm: () => void; confirmText?: string; }>({ isOpen: false, title: '', description: '', actionStyle: 'danger', onConfirm: () => {} });
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDeleteCoverModalOpen, setIsDeleteCoverModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const [showTabuleiro, setShowTabuleiro] = useState(false);

  const { pendingCorrelations, originalItem, requestAddLog, confirmAndBypass, cancelRequest } = useCorrelationGating();

  const [checkedConditions, setCheckedConditions] = useState<Record<string, boolean>>({});
  const [conditionPhotos, setConditionPhotos] = useState<Record<string, string>>({});

  const [editingLogCheckedConditions, setEditingLogCheckedConditions] = useState<Record<string, boolean>>({});
  const [editingLogConditionPhotos, setEditingLogConditionPhotos] = useState<Record<string, string>>({});
  const [uploadingConditionKey, setUploadingConditionKey] = useState<string | null>(null);
  const conditionPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleUploadConditionPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !uploadingConditionKey) return;
    
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await apiService.upload<{ url: string }>('/upload?type=tracker', formData);
      if (res.url) {
        if (editingLogId) {
          setEditingLogConditionPhotos(prev => ({ ...prev, [uploadingConditionKey]: res.url }));
        } else {
          setConditionPhotos(prev => ({ ...prev, [uploadingConditionKey]: res.url }));
        }
      }
    } catch (e) {
      console.error('Erro ao subir foto da condição', e);
      alert('Falha ao subir imagem da condição.');
    } finally {
      setUploadingConditionKey(null);
      if (conditionPhotoInputRef.current) conditionPhotoInputRef.current.value = '';
    }
  };

  const transformConditionToAcompanhe = (condText: string, condIndex: number) => {
    const newItemId = crypto.randomUUID();
    // Cria o novo Acompanhe
    updateItem({
      id: newItemId,
      type: 'acompanhe',
      name: condText,
      status: 'ACTIVE',
      config: { showCoverPhoto: true },
      startDate: Date.now(),
      correlations: {},
      isConsuming: false,
      defaultTimer: 300,
      userId: (item as any).userId || 'test-user',
      createdAt: new Date(),
      updatedAt: new Date()
    } as any);

    // Remove das condições textuais e adiciona como correlação
    const newConditions = [...conditions];
    newConditions.splice(condIndex, 1);

    updateItem({
      ...item,
      config: { ...item.config, conditions: newConditions },
      correlations: { ...item.correlations, [newItemId]: 'linked' }
    });
  };

  const openCorrelatedItem = (cId: string) => {
    // Dispara evento para a tela "pai" fechar este modal e abrir o outro
    onClose();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openTracker', { detail: cId }));
    }, 50);
  };

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

  const handleSaveDates = (newStartStr: string, newEndStr: string, newTimeStr: string) => {
    let newStartDate = item.startDate;
    if (newStartStr) {
      const [year, month, day] = newStartStr.split('-').map(Number);
      newStartDate = new Date(year, month - 1, day, 0, 0, 0).getTime();
    }

    let newEndDate: number | undefined = undefined;
    if (newEndStr) {
      const [year, month, day] = newEndStr.split('-').map(Number);
      newEndDate = new Date(year, month - 1, day, 23, 59, 59).getTime();
    }

    updateItem({
      ...item,
      startDate: newStartDate,
      endDate: newEndDate,
      config: { ...item.config, expectedTime: newTimeStr || undefined }
    });

    setStartDateStr(newStartStr);
    setEndDateStr(newEndStr);
    setTempExpectedTime(newTimeStr);
  };

  const handleSaveStage = (name: string, startStr: string, endStr: string) => {
    updateItem({
      ...item,
      config: {
        ...(item.config || {}),
        stage: name,
        stageStartDate: startStr,
        stageEndDate: endStr
      }
    });
    setStage(name);
  };

  const handleReactivate = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Reativar Tarefa',
      description: 'Deseja reativar esta tarefa? Ela voltará a aparecer nas suas rotinas.',
      actionStyle: 'warning',
      confirmText: 'Reativar',
      onConfirm: () => {
        updateItem({
          ...item,
          status: 'ACTIVE',
          endDate: undefined
        });
        onClose();
      }
    });
  };

  const markTaskAsCompleted = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Concluir Tarefa',
      description: 'Deseja realmente marcar esta tarefa como concluída?',
      actionStyle: 'success',
      confirmText: 'Concluir',
      onConfirm: () => {
        updateItem({
          ...item,
          status: 'COMPLETED',
          endDate: Date.now()
        });
        onClose();
      }
    });
  };

  const handleDelete = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Deletar Tarefa',
      description: 'Tem certeza que deseja apagar este acompanhamento? Todas as bolhas e dados serão perdidos.',
      actionStyle: 'danger',
      confirmText: 'Deletar',
      onConfirm: () => {
        deleteItem(item.id);
        onClose();
      }
    });
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y > 100) {
      handleClose();
    }
  };

  const handleEditLog = (logId: string, currentInfo: string = '', currentPhoto?: string, currentMetadata?: any) => {
    setEditingLogId(logId);
    setEditingLogTitle(currentMetadata?.title || '');
    setEditingLogInfo(currentInfo);
    setEditingLogPhoto(currentPhoto || null);
    
    // Suporte para nova estrutura de múltiplas fotos (se log.photoUrls existir usa ele, senão converte o atual)
    if (logId !== 'NEW') {
      const log = useTrackerStore.getState().logs.find(l => l.id === logId);
      if (log) {
        setEditingLogPhotos(log.photoUrls || (currentPhoto ? [currentPhoto] : []));
        setEditingLogTimestamp(log.timestamp || Date.now());
      }
    } else {
      setEditingLogPhotos([]);
      setEditingLogTimestamp(Date.now());
    }

    setEditingLogCheckedConditions(currentMetadata?.checkedConditions || {});
    setEditingLogConditionPhotos(currentMetadata?.conditionPhotos || {});
  };

  const saveLogEdit = (logId: string) => {
    const totalConditions = conditions.length + Object.keys(item.correlations || {}).length;
    const metCount = Object.values(editingLogCheckedConditions).filter(Boolean).length;
    const allMet = totalConditions > 0 && metCount === totalConditions;

    const metadataToSave = {
      ...(logId !== 'NEW' ? useTrackerStore.getState().logs.find(l => l.id === logId)?.metadata || {} : {}),
      title: editingLogTitle,
      checkedConditions: editingLogCheckedConditions,
      conditionPhotos: editingLogConditionPhotos,
      totalConditions,
      allConditionsMet: allMet
    };

    if (logId === 'NEW') {
      requestAddLog({
        trackerItemId: itemId,
        type: 'consumption',
        info: editingLogInfo,
        photoUrls: editingLogPhotos,
        value: 1,
        metadata: metadataToSave
      }, editingLogTimestamp, () => {
        setEditingLogId(null);
      });
    } else {
      updateLog(logId, { 
        info: editingLogInfo, 
        photoUrls: editingLogPhotos,
        metadata: metadataToSave,
        timestamp: editingLogTimestamp
      });
      setEditingLogId(null);
    }
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
        setEditingLogPhoto(res.url); // Keep for backwards compatibility if needed
        setEditingLogPhotos(prev => [...prev, res.url]);
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
    const targetItem = items[targetId];
    if (!targetItem) return;

    const newCorrelations = { ...item.correlations };
    if (newCorrelations[targetId]) {
      delete newCorrelations[targetId];
    } else {
      newCorrelations[targetId] = 'linked';
    }

    updateItem({ ...item, correlations: newCorrelations });
  };

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

  const notificationsEnabled = item?.config?.notificationsEnabled ?? (item?.type !== 'vice');

  const toggleNotifications = () => {
    if (!item) return;
    if (!notificationsEnabled && item.type === 'vice') {
      alert("Aviso: As notificações geralmente ficam desativadas para vícios para não servirem de gatilho. Você pode manter ativado se for o seu interesse.");
    }
    updateItem({
      ...item,
      config: {
        ...(item.config || {}),
        notificationsEnabled: !notificationsEnabled
      }
    });
  };

  if (!item || !mounted) return null;

  return createPortal(
    <React.Fragment>
      <AnimatePresence>
        <motion.div
          key="overlay-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-modal flex flex-col bg-[#0a0c0a]"
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
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={itemId}
                custom={direction}
                variants={swipeVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                drag={contextItemIds && contextItemIds.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleSwipeEnd}
                className="absolute inset-0 flex flex-col overflow-hidden"
              >
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full z-modal" />

                {/* Swipe Alert */}
                <AnimatePresence>
                  {swipeAlert && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute top-6 left-4 right-4 bg-red-500/90 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-lg z-50 text-center flex items-center justify-center gap-2 backdrop-blur-md border border-red-400/30"
                    >
                      <AlertCircle size={16} />
                      Salve ou descarte as alterações antes de mudar de rotina
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hidden file input for log photos */}
                <input
                  id={`${item.id}-log-file-input`}
                  name="logFileInput"
                  aria-label="Upload de foto do registro"
                  type="file"
                  accept="image/*,application/pdf"
                  capture="environment"
                  className="hidden"
                  ref={logFileInputRef}
                  onChange={handleUploadLogPhoto}
                />

                {/* Header */}
                <div className={`relative min-h-[12rem] shrink-0 flex flex-col justify-end p-4 border-b border-white/5 ${!showCoverPhoto || !item.coverPhoto ? 'bg-gradient-to-br from-zinc-900 to-black' : 'bg-transparent'}`}>
                  {(!showCoverPhoto || !item.coverPhoto) && (
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                  )}
                  {showCoverPhoto && item.coverPhoto && (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-50"
                      style={{ backgroundImage: `url(${getAssetUrl(item.coverPhoto)})` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c0a] via-[#0a0c0a]/40 to-transparent pointer-events-none" />

                  {/* Top Right Controls */}
                  <div
                    className="absolute top-6 right-4 flex items-center gap-2 z-base"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <input
                      id={`${item.id}-cover-photo-input`}
                      name="coverPhotoInput"
                      aria-label="Upload da foto de capa"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleUploadPhoto}
                    />
                    <input
                      id={`${item.id}-condition-photo-input`}
                      name="conditionPhotoInput"
                      aria-label="Upload de foto da condição"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      ref={conditionPhotoInputRef}
                      onChange={handleUploadConditionPhoto}
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
                      onClick={() => setIsSettingsModalOpen(true)}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-black/50 text-white/50 hover:text-white hover:bg-black/80 transition-colors"
                      title="Configurações do Card"
                    >
                      <Settings size={16} />
                    </button>

                    {item.config?.isMission && (
                      <button
                        onClick={() => setShowTabuleiro(true)}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/40 transition-colors"
                        title="Abrir Tabuleiro"
                      >
                        <Map size={16} />
                      </button>
                    )}

                    {hasChanges && (
                      <button
                        onClick={() => {
                          if (!item.name || item.name.trim() === '') {
                            alert('O título é obrigatório para registrar a rotina.');
                            return;
                          }
                          storeUpdateItem(localItem);
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/40 transition-colors"
                        title="Salvar"
                      >
                        <Save size={16} />
                      </button>
                    )}

                    <button
                      onClick={handleClose}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                      title="Fechar"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className={`absolute top-6 left-4 z-50 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <h2 className="text-white font-black text-lg max-w-[200px] truncate drop-shadow-md">
                      {item.name || 'Nova Tarefa'}
                    </h2>
                  </div>

                  {item.config?.showStreak !== false && (
                    <div className="relative z-10 w-full max-w-2xl mx-auto pt-4">
                      <TrackerComparison item={item} logs={itemLogs} />
                    </div>
                  )}
                </div>

                <div
                  ref={scrollContainerRef}
                  className="flex-1 overflow-y-auto p-4 overscroll-contain touch-pan-y custom-scrollbar"
                  onPointerDown={(e) => e.stopPropagation()}
                  onScroll={(e) => {
                    const target = e.currentTarget;
                    if (target.scrollTop > 80 && !isScrolled) setIsScrolled(true);
                    if (target.scrollTop <= 80 && isScrolled) setIsScrolled(false);
                  }}
                >
                  <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-12">
                    {/* Title and Type */}
                    <div className="flex flex-col px-2">
                      <label htmlFor={`${item.id}-item-type-select`} className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>Tipo de item</label>
                      <select
                        id={`${item.id}-item-type-select`}
                        name="itemTypeSelect"
                        value={item.type}
                        onChange={(e) => updateItem({ ...item, type: e.target.value })}
                        className="bg-transparent text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-0.5 block focus:outline-none cursor-pointer appearance-none w-max"
                        style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                      >
                        <option value="acompanhe" style={{ background: '#0a0c0a' }}>Acompanhe</option>
                        <option value="aprenda" style={{ background: '#0a0c0a' }}>Aprenda</option>
                        <option value="treine" style={{ background: '#0a0c0a' }}>Treine</option>
                        <option value="viaje" style={{ background: '#0a0c0a' }}>Viaje</option>
                        <option value="poupe" style={{ background: '#0a0c0a' }}>Poupe</option>
                        <option value="planeje" style={{ background: '#0a0c0a' }}>Planeje</option>
                        <option value="jejue" style={{ background: '#0a0c0a' }}>Jejue</option>
                        <option value="hidrate-se" style={{ background: '#0a0c0a' }}>Hidrate-se</option>
                        <option value="vice" style={{ background: '#0a0c0a' }}>Libertesse</option>
                        <option value="medicine" style={{ background: '#0a0c0a' }}>Medicamento</option>
                      </select>

                      <div className="flex items-center gap-3">
                        <input
                          id={`${item.id}-goal-name`} autoComplete="off"
                          name="goalName"
                          aria-label="Nome da Rotina"
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem({ ...item, name: e.target.value })}
                          onPointerDown={(e) => e.stopPropagation()}
                          placeholder="NOME"
                          className="w-full bg-transparent font-black text-white uppercase tracking-tight leading-none border-b border-transparent hover:border-white/20 focus:border-emerald-500/50 focus:outline-none transition-colors text-3xl"
                        />
                      </div>
                    </div>

                  <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-row flex-nowrap gap-1.5 overflow-x-auto custom-scrollbar pb-2 px-2 box-border">
                    {showStartDate && (
                      <div
                        onClick={() => {
                          setTempStartDateStr(startDateStr);
                          setTempEndDateStr(endDateStr);
                          setTempExpectedTime(item.config?.expectedTime || '');
                          setIsDateModalOpen(true);
                        }}
                        className="w-[64px] h-[64px] shrink-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 rounded-xl relative group cursor-pointer hover:bg-white/5 hover:border-emerald-500/30 transition-colors"
                      >
                        <span className="text-[7.5px] text-white/50 uppercase tracking-widest mb-0.5 text-center leading-tight">Início</span>
                        <span className="text-[9px] font-bold text-white text-center px-1 leading-tight">
                          {startDateStr.split('-').reverse().join('/')}
                        </span>
                        {endDateStr && (
                          <span className="text-[6.5px] text-emerald-400 font-bold mt-0.5 text-center leading-none scale-[0.85]">
                            Até {endDateStr.split('-').reverse().join('/')}
                          </span>
                        )}
                      </div>
                    )}

                    {showDaysTarget && activeMarkers.includes('elapsed') && (
                      <div className="w-[64px] h-[64px] shrink-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 rounded-xl relative">
                        <span className="text-[7.5px] text-white/50 uppercase tracking-widest mb-0.5 text-center leading-tight">Dias</span>
                        <span className="text-sm font-black text-white">{calculateDays()}</span>
                      </div>
                    )}
                    
                    {showStage && activeMarkers.includes('stage') && (
                      <div
                        onClick={() => {
                          setTempStageName(stage);
                          setTempStageStartDateStr(item.config?.stageStartDate || '');
                          setTempStageEndDateStr(item.config?.stageEndDate || '');
                          setIsStageModalOpen(true);
                        }}
                        className="w-[64px] h-[64px] shrink-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 rounded-xl relative group cursor-pointer hover:bg-white/5 hover:border-emerald-500/30 transition-colors"
                      >
                        <span className="text-[7.5px] text-white/50 uppercase tracking-widest mb-0.5 text-center leading-tight">Etapa</span>
                        <span className="text-[9px] font-bold text-white text-center px-1 truncate w-full leading-tight">
                          {stage || 'NOME'}
                        </span>
                        {item.config?.stageStartDate && (
                          <span className="text-[6.5px] text-emerald-400 font-bold mt-0.5 text-center leading-none scale-[0.85]">
                            {item.config.stageStartDate.split('-').reverse().join('/')}
                          </span>
                        )}
                      </div>
                    )}

                    {showDaysTarget && activeMarkers.includes('remaining') && endDateStr && (
                      <div
                        onClick={() => {
                          setTempStartDateStr(startDateStr);
                          setTempEndDateStr(endDateStr);
                          setTempExpectedTime(item.config?.expectedTime || '');
                          setIsDateModalOpen(true);
                        }}
                        className="w-[64px] h-[64px] shrink-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 rounded-xl relative group cursor-pointer hover:bg-white/5 hover:border-emerald-500/30 transition-colors"
                      >
                        <span className="text-[7.5px] text-white/50 uppercase tracking-widest mb-0.5 text-center leading-tight">Falta</span>
                        <span className="text-[9px] font-black text-emerald-400">{calculateRemaining()}</span>
                      </div>
                    )}

                    {showMarkers && (
                      <div className="relative shrink-0 flex items-center justify-center w-[64px] h-[64px]">
                        <button
                          onClick={() => setShowMarkersMenu(!showMarkersMenu)}
                          className="w-full h-full flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 border-dashed rounded-xl transition-colors group"
                        >
                          <span className="text-white/30 group-hover:text-white/60 text-lg font-light mb-0.5">+</span>
                          <span className="text-[7.5px] font-bold text-white/30 group-hover:text-white/60 uppercase tracking-widest">Marcador</span>
                        </button>
                        <AnimatePresence>
                          {showMarkersMenu && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute left-0 bottom-full mb-2 w-48 bg-[#111311] border border-white/10 rounded-xl p-2 z-20 shadow-2xl flex flex-col gap-1"
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
                    )}
                  </div>

                    {/* Subcontainer agrupando Descrição com espaçamento bem apertado */}
                    <div className="flex flex-col gap-3.5 px-2">
                      {/* Description */}
                      <div>
                        <div className="relative">
                          <textarea
                            id={`${item.id}-goal-desc`} autoComplete="off"
                            name="goalDesc"
                            value={item.description || ""}
                            onChange={(e) => updateItem({ ...item, description: e.target.value })}
                            placeholder="Descreva a finalidade..."
                            className="w-full bg-transparent p-2 text-[11px] font-medium text-white/80 focus:outline-none focus:bg-white/[0.02] resize-none h-10 transition-colors custom-scrollbar"
                          />
                        </div>

                        <div className="flex justify-center mt-3">
                          {item.status === 'COMPLETED' ? (
                            <button
                              onClick={handleReactivate}
                              className="flex items-center justify-center gap-2 text-[10px] font-bold text-yellow-400/70 hover:text-yellow-400 bg-white/[0.02] hover:bg-yellow-500/10 px-4 py-2 rounded-full transition-colors uppercase tracking-wider w-max"
                            >
                              <Activity size={14} />
                              Reativar Tarefa
                            </button>
                          ) : (
                            <button
                              onClick={markTaskAsCompleted}
                              className="flex items-center justify-center gap-2 text-[10px] font-bold text-emerald-400/70 hover:text-emerald-400 bg-white/[0.02] hover:bg-emerald-500/10 px-4 py-2 rounded-full transition-colors uppercase tracking-wider w-max"
                            >
                              <CheckSquare size={14} />
                              Marcar como Concluída
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Tabs Navigation */}
                    <div className="flex flex-wrap bg-white/5 border-y border-white/10 p-1 mt-1 mb-2 rounded-xl gap-1">
                      {[
                        { id: 'looping', label: 'HORÁRIOS', icon: Clock, color: 'emerald' },
                        { id: 'tarefas', label: 'TAREFAS', icon: ListChecks, color: 'emerald' },
                        { id: 'condicoes', label: 'CONDIÇÕES', icon: CheckSquare, color: 'emerald' },
                        { id: 'correlacoes', label: 'CORRELAÇÕES', icon: LinkIcon, color: 'indigo' },
                        ...(item.type === 'vice' ? [{ id: 'estrategia', label: 'ESTRATÉGIA', icon: TrendingDown, color: 'yellow' }] : []),
                        ...(item.type === 'vice' ? [{ id: 'custos', label: 'CUSTOS', icon: Activity, color: 'emerald' }] : [])
                      ].map(tab => {
                        const isActive = activeTab === tab.id;
                        const colorClasses = {
                          emerald: isActive ? 'bg-emerald-400/20 text-emerald-400' : 'text-white/50 hover:text-white/80 hover:bg-white/5',
                          indigo: isActive ? 'bg-indigo-400/20 text-indigo-400' : 'text-white/50 hover:text-white/80 hover:bg-white/5',
                          yellow: isActive ? 'bg-yellow-400/20 text-yellow-400' : 'text-white/50 hover:text-white/80 hover:bg-white/5',
                        }[tab.color];

                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(prev => prev === tab.id ? null : tab.id as any)}
                            className={`flex-1 min-w-[30%] py-2 text-[9px] sm:text-[10px] font-bold tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 uppercase ${colorClasses}`}
                          >
                            <tab.icon size={12} />
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>

                    <AnimatePresence mode="wait">
                      {/* Horários */}
                      {activeTab === 'looping' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="py-2 mb-2 flex flex-col gap-5">
                            
                            {/* Término */}
                            <div className="flex flex-col gap-2">
                              <span className="text-[10px] font-medium text-white/50 flex items-center gap-1.5">
                                <Clock size={12} /> Término (Opcional)
                              </span>
                              
                              <div className="flex items-center gap-2">
                                <input
                                  id={`${item.id}-endDateInput`}
                                  name="endDateInput"
                                  aria-label="Término Opcional"
                                  type="date"
                                  value={item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : ''}
                                  onChange={(e) => {
                                    if (!e.target.value) {
                                      updateItem({ ...item, endDate: undefined });
                                    } else {
                                      const d = new Date(e.target.value);
                                      d.setHours(23, 59, 59, 999);
                                      updateItem({ ...item, endDate: d.getTime() });
                                    }
                                  }}
                                  className="flex-1 bg-white/5 border border-white/5 rounded-lg p-2 text-[12px] text-white/80 focus:outline-none focus:border-white/10"
                                />
                                <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-lg p-1.5">
                                  <span className="text-[10px] text-white/30 px-1">+</span>
                                  <input
                                    id={`${item.id}-endDateAddNumber`}
                                    name="endDateAddNumber"
                                    aria-label="Adicionar número"
                                    type="number"
                                    placeholder="0"
                                    min="1"
                                    className="w-8 bg-transparent text-center text-[12px] text-white focus:outline-none"
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value);
                                      if (!val) return;
                                      const select = e.target.nextElementSibling as HTMLSelectElement;
                                      const unit = select.value;
                                      const now = new Date();
                                      if (unit === 'days') now.setDate(now.getDate() + val);
                                      if (unit === 'months') now.setMonth(now.getMonth() + val);
                                      updateItem({ ...item, endDate: now.getTime() });
                                    }}
                                  />
                                  <select 
                                    id={`${item.id}-endDateAddUnit`}
                                    name="endDateAddUnit"
                                    aria-label="Adicionar unidade de tempo"
                                    className="bg-transparent text-[11px] text-white/50 focus:outline-none"
                                    onChange={(e) => {
                                      const input = e.target.previousElementSibling as HTMLInputElement;
                                      const val = parseInt(input.value);
                                      if (!val) return;
                                      const unit = e.target.value;
                                      const now = new Date();
                                      if (unit === 'days') now.setDate(now.getDate() + val);
                                      if (unit === 'months') now.setMonth(now.getMonth() + val);
                                      updateItem({ ...item, endDate: now.getTime() });
                                    }}
                                  >
                                    <option value="days">dias</option>
                                    <option value="months">meses</option>
                                  </select>
                                </div>
                              </div>
                              {item.endDate && (
                                <div className="text-[10px] text-emerald-400/80 flex justify-between items-center px-1">
                                  <span>Até {new Date(item.endDate).toLocaleDateString('pt-BR')}</span>
                                  <button onClick={() => updateItem({ ...item, endDate: undefined })} className="text-white/30 hover:text-white/80 transition-colors">Remover</button>
                                </div>
                              )}
                            </div>

                            {/* Frequência */}
                            <div className="flex flex-col gap-2">
                              <span className="text-[10px] font-medium text-white/50 flex items-center gap-1.5">
                                <Activity size={12} /> Frequência
                              </span>
                              
                              <div className="flex items-center gap-2">
                                <label htmlFor={`${item.id}-loopModeSelect`} className="sr-only">Frequência</label>
                                <select
                                  id={`${item.id}-loopModeSelect`}
                                  name="loopModeSelect"
                                  value={item.config?.loopMode || 'daily'}
                                  onChange={(e) => updateItem({ ...item, config: { ...item.config, loopMode: e.target.value } })}
                                  className="flex-1 bg-white/5 border border-white/5 rounded-lg p-2.5 text-[12px] text-white/80 focus:outline-none focus:border-white/10"
                                >
                                  <option value="daily">Diário</option>
                                  <option value="monthly">Mensal</option>
                                </select>

                                <div className="w-16 h-12 relative bg-white/5 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center">
                                  <WheelPicker
                                    label="x"
                                    options={[1,2,3,4,5,6,7,8,9,10,15,20,30]}
                                    value={typeof item.config?.dailyLoops === 'number' ? item.config.dailyLoops : 1}
                                    onChange={(val) => {
                                      let newLoopTimes = item.config?.loopTimes || [];
                                      if (newLoopTimes.length < val) {
                                        newLoopTimes = [...newLoopTimes, ...Array(val - newLoopTimes.length).fill('')];
                                      } else {
                                        newLoopTimes = newLoopTimes.slice(0, val);
                                      }
                                      let newMonthlyDays = item.config?.monthlyDays || [];
                                      if (newMonthlyDays.length < val) {
                                        newMonthlyDays = [...newMonthlyDays, ...Array(val - newMonthlyDays.length).fill(1)];
                                      } else {
                                        newMonthlyDays = newMonthlyDays.slice(0, val);
                                      }
                                      updateItem({ ...item, config: { ...item.config, dailyLoops: val, loopTimes: newLoopTimes, monthlyDays: newMonthlyDays } });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Horários */}
                            {(typeof item.config?.dailyLoops === 'number' && item.config.dailyLoops > 0) && (
                              <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-medium text-white/50 flex items-center gap-1.5">
                                  <Clock size={12} /> Horários
                                </span>
                                <div className="flex flex-col gap-1.5">
                                  {Array.from({ length: item.config.dailyLoops }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <span className="text-[10px] text-white/30 w-4">{i + 1}</span>
                                      
                                      {item.config?.loopMode === 'monthly' && (
                                        <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-lg px-2">
                                          <span className="text-[10px] text-white/40">Dia</span>
                                          <input
                                            id={`${item.id}-monthlyDay-${i}`}
                                            name={`monthlyDay-${i}`}
                                            aria-label="Dia do mês"
                                            type="number"
                                            min="1" max="31"
                                            value={item.config?.monthlyDays?.[i] || ''}
                                            onChange={(e) => {
                                              const newDays = [...(item.config?.monthlyDays || Array(item.config?.dailyLoops || 1).fill(1))];
                                              newDays[i] = parseInt(e.target.value) || 1;
                                              updateItem({ ...item, config: { ...item.config, monthlyDays: newDays } });
                                            }}
                                            className="w-8 bg-transparent p-1.5 text-[12px] text-white/80 focus:outline-none text-center"
                                          />
                                        </div>
                                      )}

                                      <input
                                        id={`${item.id}-loopTime-${i}`}
                                        name={`loopTime-${i}`}
                                        aria-label="Horário"
                                        type="time"
                                        value={item.config?.loopTimes?.[i] || ''}
                                        onChange={(e) => {
                                          const newTimes = [...(item.config?.loopTimes || Array(item.config?.dailyLoops || 1).fill(''))];
                                          newTimes[i] = e.target.value;
                                          updateItem({ ...item, config: { ...item.config, loopTimes: newTimes } });
                                        }}
                                        className="flex-1 bg-white/5 border border-white/5 rounded-lg p-2 text-[12px] text-white/80 focus:outline-none focus:border-white/10"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Tarefas */}
                      {activeTab === 'tarefas' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="py-2 mb-2 bg-black/20 rounded-xl p-3 border border-white/5">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <ListChecks size={14} className="text-emerald-400" />
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Tarefas Futuras</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 mb-4">
                              <input 
                                type="text"
                                placeholder="Descrição da tarefa..."
                                value={newTodoText}
                                onChange={(e) => setNewTodoText(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg p-2 text-[12px] text-white focus:outline-none focus:border-white/20"
                              />
                              <div className="flex gap-2">
                                <input 
                                  type="date"
                                  value={newTodoDate}
                                  onChange={(e) => setNewTodoDate(e.target.value)}
                                  className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-[12px] text-white/80 focus:outline-none focus:border-white/20"
                                />
                                <button 
                                  onClick={addTodo}
                                  disabled={!newTodoText.trim()}
                                  className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-colors flex items-center justify-center min-w-[40px]"
                                >
                                  <PlusCircle size={16} />
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              {todos.length === 0 ? (
                                <p className="text-[10px] text-white/30 text-center py-2">Nenhuma tarefa cadastrada</p>
                              ) : (
                                todos.map((todo: any) => (
                                  <div key={todo.id} className={`flex items-start gap-2 p-2 rounded-lg border ${todo.completed ? 'bg-white/5 border-transparent opacity-60' : 'bg-black/40 border-white/5'} transition-all`}>
                                    <button 
                                      onClick={() => toggleTodo(todo.id)}
                                      className="mt-0.5 text-white/50 hover:text-emerald-400 transition-colors shrink-0"
                                    >
                                      {todo.completed ? <CheckSquare size={16} className="text-emerald-400" /> : <div className="w-4 h-4 rounded-sm border border-white/30" />}
                                    </button>
                                    <div className="flex-1 flex flex-col min-w-0">
                                      <span className={`text-[12px] text-white/90 break-words ${todo.completed ? 'line-through text-white/50' : ''}`}>
                                        {todo.text}
                                      </span>
                                      <span className="text-[9px] text-white/40 mt-1 flex items-center gap-1">
                                        <Clock size={10} /> {new Date(todo.date).toLocaleDateString('pt-BR')}
                                      </span>
                                    </div>
                                    <button 
                                      onClick={() => deleteTodo(todo.id)}
                                      className="text-white/30 hover:text-red-400 transition-colors p-1 shrink-0"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Condições */}
                      {activeTab === 'condicoes' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="py-2 mb-2 bg-black/20 rounded-xl p-3 border border-white/5">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <CheckSquare size={14} className="text-emerald-400" />
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Condições</span>
                              </div>
                              <button 
                                onClick={() => {
                                  setEditingConditionIndex(null);
                                  setNewConditionTitle('');
                                  setIsAddConditionModalOpen(true);
                                }}
                                className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                title="Adicionar Condição"
                              >
                                <PlusCircle size={12} />
                              </button>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              {conditions.length === 0 ? (
                                <p className="text-[10px] text-white/30 font-medium">Nenhuma condição definida.</p>
                              ) : (
                                conditions.map((cond, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 px-2.5 py-1 text-[10px] font-bold rounded-md border border-emerald-500/20">
                                    <span className="cursor-pointer hover:underline" onClick={() => {
                                      setEditingConditionIndex(idx);
                                      setNewConditionTitle(cond);
                                      setIsAddConditionModalOpen(true);
                                    }}>{cond}</span>
                                    <button onClick={() => removeCondition(idx)} className="text-emerald-400/50 hover:text-emerald-300">
                                      <X size={10} />
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Correlações */}
                      {activeTab === 'correlacoes' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="py-2 mb-2 bg-black/20 rounded-xl p-3 border border-white/5">
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
                                  const isLibertesse = cItem.type === 'vice';
                                  return (
                                    <div key={cId} 
                                         className={`flex items-center gap-2 px-2.5 py-1.5 text-[10px] font-bold rounded-md border border-l-4 ${isLibertesse ? 'bg-yellow-500/5 text-yellow-300 border-yellow-500/20 border-l-yellow-500' : 'bg-emerald-500/5 text-emerald-300 border-emerald-500/20 border-l-emerald-500'}`}
                                         style={cItem.coverPhoto ? { backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.65)), url(${getAssetUrl(cItem.coverPhoto)})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                                    >
                                      <div className="flex flex-col gap-0.5">
                                        <span className={`text-[7px] tracking-widest uppercase font-black ${isLibertesse ? 'text-yellow-400' : 'text-emerald-400'}`}>
                                          {isLibertesse ? 'Libertesse' : 'Acompanhe'}
                                        </span>
                                        <span 
                                          className="cursor-pointer hover:underline truncate max-w-[150px] text-white"
                                          onClick={() => openCorrelatedItem(cId)}
                                        >
                                          {cItem.name || cItem.id.substring(0, 8)}
                                        </span>
                                      </div>
                                      <button onClick={() => toggleCorrelation(cId)} className={`hover:text-white transition-colors ml-1 ${isLibertesse ? 'text-yellow-400/50' : 'text-emerald-400/50'}`}>
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
                                      const isLibertesse = other.type === 'vice';
                                      const borderLeftColor = isLibertesse ? 'border-l-yellow-500' : 'border-l-emerald-500';
                                      const subtextColor = isLibertesse ? 'text-yellow-400' : 'text-emerald-400';
                                      const hoverColor = isLibertesse ? 'hover:border-yellow-500/30 hover:bg-yellow-500/[0.02]' : 'hover:border-emerald-500/30 hover:bg-emerald-500/[0.02]';
                                      
                                      return (
                                        <div
                                          key={other.id}
                                          onClick={() => { toggleCorrelation(other.id); setShowCorrelations(false); }}
                                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border border-l-4 border-white/5 transition-all ${borderLeftColor} ${hoverColor} ${isLinked ? (isLibertesse ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-emerald-500/10 border-emerald-500/30') : 'bg-white/[0.02]'}`}
                                          style={other.coverPhoto ? { backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.65)), url(${getAssetUrl(other.coverPhoto)})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                                        >
                                          <div className="flex flex-col gap-0.5">
                                            <span className={`text-[7px] tracking-widest uppercase font-black ${subtextColor}`}>
                                              {isLibertesse ? 'Libertesse' : 'Acompanhe'}
                                            </span>
                                            <span className={`text-[11px] font-bold ${isLinked ? 'text-white' : 'text-white/70'}`}>
                                              {other.name || other.id.substring(0, 8)}
                                            </span>
                                          </div>
                                          {isLinked ? (
                                            <Check size={12} className={isLibertesse ? 'text-yellow-400' : 'text-emerald-400'} />
                                          ) : (
                                            <span className="text-[14px] text-white/20 font-light pr-1">+</span>
                                          )}
                                        </div>
                                      );
                                    })
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      )}

                      {/* Estratégia Libertesse */}
                      {activeTab === 'estrategia' && item.type === 'vice' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="py-2 mb-2 bg-black/20 rounded-xl p-3 border border-white/5">
                            <div className="flex items-center gap-2 mb-3">
                              <TrendingDown size={14} className="text-yellow-400" />
                              <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">Estratégia Libertesse</span>
                            </div>
                            
                            <div className="flex flex-col gap-3">
                              <label htmlFor={`${item.id}-libertesse-mode-select`} className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>Modo Libertesse</label>
                              <select
                                id={`${item.id}-libertesse-mode-select`}
                                name="libertesseModeSelect"
                                value={item.config?.mode || 'acompanhe'}
                                onChange={(e) => updateItem({ ...item, config: { ...item.config, mode: e.target.value } })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[12px] text-white/80 focus:outline-none focus:border-yellow-500/50 appearance-none cursor-pointer"
                                style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                              >
                                <option value="acompanhe" style={{background: '#0a0c0a'}}>SE CONHEÇA - Apenas Acompanhar</option>
                                <option value="diminua" style={{background: '#0a0c0a'}}>DIMINUA - Definir Metas de Redução e Jejum</option>
                              </select>

                              {item.config?.isMission && (
                                <div className="bg-yellow-950/30 border border-yellow-500/30 rounded-xl p-3 flex items-center justify-between shadow-[0_0_15px_rgba(234,179,8,0.05)]">
                                  <div className="flex items-center gap-2">
                                    <Activity size={16} className="text-yellow-400 animate-pulse" />
                                    <span className="text-yellow-400 text-xs font-black tracking-widest uppercase">MISSÃO ATIVA</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-slate-400 text-[0.6rem] font-bold tracking-widest uppercase block mb-0.5">Progresso</span>
                                    <span className="text-yellow-400 text-xs font-extrabold">Estágio {Math.min(10, (item.config?.antitabagismoLevel ?? 0) + 1)}/10</span>
                                  </div>
                                </div>
                              )}

                              {item.config?.mode === 'diminua' && (() => {
                                const seconds = item.config?.timerLimitSeconds || 0;
                                const d = Math.floor(seconds / 86400);
                                const h = Math.floor((seconds % 86400) / 3600);
                                const m = Math.floor((seconds % 3600) / 60);

                                return (
                                  <div className="flex flex-col gap-2">
                                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Meta de Jejum (Tempo de Espera)</label>
                                    <div className="flex gap-2">
                                      <WheelPicker 
                                        label="Dias" 
                                        options={Array.from({length: 31}, (_, i) => i)} 
                                        value={d} 
                                        onChange={(newD) => {
                                          const total = (newD * 86400) + (h * 3600) + (m * 60);
                                          updateItem({ ...item, config: { ...item.config, timerLimitSeconds: total } });
                                        }} 
                                      />
                                      <WheelPicker 
                                        label="Horas" 
                                        options={Array.from({length: 24}, (_, i) => i)} 
                                        value={h} 
                                        onChange={(newH) => {
                                          const total = (d * 86400) + (newH * 3600) + (m * 60);
                                          updateItem({ ...item, config: { ...item.config, timerLimitSeconds: total } });
                                        }} 
                                      />
                                      <WheelPicker 
                                        label="Minutos" 
                                        options={Array.from({length: 60}, (_, i) => i)} 
                                        value={m} 
                                        onChange={(newM) => {
                                          const total = (d * 86400) + (h * 3600) + (newM * 60);
                                          updateItem({ ...item, config: { ...item.config, timerLimitSeconds: total } });
                                        }} 
                                      />
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Custos */}
                      {activeTab === 'custos' && item.type === 'vice' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="py-2 mb-2 bg-black/20 rounded-xl p-3 border border-white/5">
                            {(() => {
                              const legacyCost = item.config?.costPerUse || 0;
                              const displayPriceNum = item.config?.costItemPrice !== undefined ? item.config.costItemPrice : (legacyCost > 0 ? legacyCost : '');
                              const displayQty = item.config?.costItemQuantity !== undefined ? item.config.costItemQuantity : (legacyCost > 0 ? 1 : '');

                              return (
                                <div className="flex flex-col gap-3">
                                  <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Mapeamento de Custo</label>
                                  <div className="flex flex-col gap-2">
                                    <label htmlFor={`${item.id}-costItemName`} className="sr-only">Item de custo</label>
                                    <input
                                      id={`${item.id}-costItemName`}
                                      name="costItemName"
                                      type="text"
                                      value={item.config?.costItemName || ''}
                                      onChange={(e) => updateItem({ ...item, config: { ...item.config, costItemName: e.target.value } })}
                                      className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-white/20 transition-colors w-full"
                                      placeholder="O que você costuma comprar? (ex: Maço de cigarro)"
                                    />
                                    <div className="flex gap-2">
                                      <div className="flex-1">
                                        <label className="text-[8px] text-white/50 uppercase font-bold px-1 block mb-1">Preço Pago (R$)</label>
                                        <input
                                          id={`${item.id}-costItemPrice`}
                                          name="costItemPrice"
                                          aria-label="Preço Pago"
                                          type="text"
                                          inputMode="decimal"
                                          value={item.config?.costItemPriceRaw !== undefined ? item.config.costItemPriceRaw : (displayPriceNum ? displayPriceNum.toString().replace('.', ',') : '')}
                                          onChange={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9,.]/g, '');
                                            // Replace comma with dot for parsing
                                            const parsedString = rawValue.replace(',', '.');
                                            const price = parseFloat(parsedString) || 0;
                                            const qty = item.config?.costItemQuantity !== undefined ? item.config.costItemQuantity : (legacyCost > 0 ? 1 : 1);
                                            updateItem({ 
                                              ...item, 
                                              config: { 
                                                ...item.config,
                                                costItemPriceRaw: rawValue,
                                                costItemPrice: price,
                                                costItemQuantity: qty,
                                                costPerUse: qty > 0 ? price / qty : 0
                                              } 
                                            });
                                          }}
                                          className="bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-white placeholder-white/20 text-sm outline-none focus:border-white/20 transition-colors w-full"
                                          placeholder="0,00"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <label className="text-[8px] text-white/50 uppercase font-bold px-1 block mb-1">Quantidade que vem</label>
                                        <input
                                          id={`${item.id}-costItemQuantity`}
                                          name="costItemQuantity"
                                          aria-label="Quantidade que vem"
                                          type="number"
                                          min="1"
                                          value={item.config?.costItemQuantityRaw !== undefined ? item.config.costItemQuantityRaw : (item.config?.costItemQuantity !== undefined ? item.config.costItemQuantity : 1)}
                                          onChange={(e) => {
                                            const rawVal = e.target.value;
                                            const qty = rawVal === '' ? 1 : (parseInt(rawVal) || 1);
                                            const price = item.config?.costItemPrice !== undefined ? item.config.costItemPrice : (legacyCost > 0 ? legacyCost : 0);
                                            updateItem({ 
                                              ...item, 
                                              config: { 
                                                ...item.config,
                                                costItemQuantityRaw: rawVal,
                                                costItemQuantity: qty,
                                                costPerUse: qty > 0 ? price / qty : 0
                                              } 
                                            });
                                          }}
                                          className="bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-white placeholder-white/20 text-sm outline-none focus:border-white/20 transition-colors w-full"
                                          placeholder="ex: 1"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  {item.config?.costPerUse > 0 && (
                                    <div className="text-[10px] text-emerald-400/80 font-mono tracking-wider text-right px-1">
                                      Custo calculado por uso: {item.config.costPerUse.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Nova Área de Adicionar Registro */}
                    <NewLogArea
                      item={item}
                      conditions={conditions}
                      conditionPhotoInputRef={conditionPhotoInputRef}
                      handleUploadConditionPhoto={handleUploadConditionPhoto}
                      setUploadingConditionKey={setUploadingConditionKey}
                      transformConditionToAcompanhe={transformConditionToAcompanhe}
                      conditionPhotos={conditionPhotos}
                      checkedConditions={checkedConditions}
                      setCheckedConditions={setCheckedConditions}
                      items={items}
                      openCorrelatedItem={(id) => {
                        const el = document.getElementById(`item-${id}`);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          setTimeout(() => {
                            el.classList.add('ring-2', 'ring-emerald-500', 'ring-offset-2', 'ring-offset-black', 'transition-all', 'duration-500');
                            setTimeout(() => {
                              el.classList.remove('ring-2', 'ring-emerald-500', 'ring-offset-2', 'ring-offset-black');
                            }, 2000);
                          }, 500);
                        }
                      }}
                      requestAddLog={requestAddLog}
                      itemId={itemId}
                      setConditionPhotos={setConditionPhotos}
                      handleEditLog={handleEditLog}
                    />

                    {/* Histórico de Registros */}
                    <LogHistory
                      item={item}
                      itemLogs={itemLogs}
                      editingLogId={editingLogId}
                      handleEditLog={handleEditLog}
                    />

                    {/* Action Area */}
                    <div className="pt-8 flex flex-col gap-3 justify-center">
                      {!isConfirmingDelete ? (
                        <button
                          onClick={() => setIsConfirmingDelete(true)}
                          className="flex items-center justify-center gap-2 text-[10px] font-bold text-white/30 hover:text-red-400 bg-white/[0.02] hover:bg-red-500/10 px-4 py-2 rounded-full transition-colors uppercase tracking-wider mx-auto w-max"
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
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Add Condition Modal */}
      <AddConditionModal
        isOpen={isAddConditionModalOpen}
        onClose={() => setIsAddConditionModalOpen(false)}
        itemId={item.id}
        item={item}
        updateItem={updateItem}
        newConditionTitle={newConditionTitle}
        setNewConditionTitle={setNewConditionTitle}
        editingConditionIndex={editingConditionIndex}
        setEditingConditionIndex={setEditingConditionIndex}
        conditions={conditions}
      />

      {/* Edit Log Modal */}
      <EditLogModal
        editingLogId={editingLogId}
        setEditingLogId={setEditingLogId}
        itemLogs={itemLogs}
        editingLogTitle={editingLogTitle}
        setEditingLogTitle={setEditingLogTitle}
        handleDeleteLog={handleDeleteLog}
        saveLogEdit={saveLogEdit}
        logFileInputRef={logFileInputRef}
        editingLogPhoto={editingLogPhoto}
        setEditingLogPhoto={setEditingLogPhoto}
        editingLogPhotos={editingLogPhotos}
        setEditingLogPhotos={setEditingLogPhotos}
        handleEditLog={handleEditLog}
        editingLogTimestamp={editingLogTimestamp}
        setEditingLogTimestamp={setEditingLogTimestamp}
        isUploadingLogPhoto={isUploadingLogPhoto}
        setIsUploadingLogPhoto={setIsUploadingLogPhoto}
        editingLogInfo={editingLogInfo}
        setEditingLogInfo={setEditingLogInfo}
        conditions={conditions}
        item={item}
        setUploadingConditionKey={setUploadingConditionKey}
        conditionPhotoInputRef={conditionPhotoInputRef}
        editingLogConditionPhotos={editingLogConditionPhotos}
        editingLogCheckedConditions={editingLogCheckedConditions}
        setEditingLogCheckedConditions={setEditingLogCheckedConditions}
        items={items}
        openCorrelatedItem={openCorrelatedItem}
      />

      <ConfirmSaveModal
        isOpen={isConfirmSaveOpen}
        onClose={() => setIsConfirmSaveOpen(false)}
        onDiscard={() => {
          setIsConfirmSaveOpen(false);
          if (!storeItem || !storeItem.name || storeItem.name.trim() === '') {
            deleteItem(item.id);
          }
          onClose();
        }}
        onSave={() => {
          if (!item.name || item.name.trim() === '') {
            alert('O título é obrigatório para registrar a rotina.');
            return;
          }
          storeUpdateItem(localItem);
          setIsConfirmSaveOpen(false);
          onClose();
        }}
      />

      {/* Modal de Período (Início e Fim) */}
      <DateEditModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        itemId={item.id}
        tempStartDateStr={tempStartDateStr}
        setTempStartDateStr={setTempStartDateStr}
        tempEndDateStr={tempEndDateStr}
        setTempEndDateStr={setTempEndDateStr}
        tempExpectedTime={tempExpectedTime}
        setTempExpectedTime={setTempExpectedTime}
        handleSaveDates={handleSaveDates}
      />

      {/* Modal de Etapa */}
      <StageEditModal
        isOpen={isStageModalOpen}
        onClose={() => setIsStageModalOpen(false)}
        itemId={item.id}
        tempStageName={tempStageName}
        setTempStageName={setTempStageName}
        tempStageStartDateStr={tempStageStartDateStr}
        setTempStageStartDateStr={setTempStageStartDateStr}
        tempStageEndDateStr={tempStageEndDateStr}
        setTempStageEndDateStr={setTempStageEndDateStr}
        handleSaveStage={handleSaveStage}
      />

      <MissionAntitabagismoModal isOpen={showTabuleiro} onClose={() => setShowTabuleiro(false)} />

      <CorrelationGatingModal
        isOpen={pendingCorrelations.length > 0}
        pendingItems={pendingCorrelations}
        originalItemName={originalItem?.name}
        onRegistrar={(cid) => {
          cancelRequest();
          openCorrelatedItem(cid);
        }}
        onLembrarMaisTarde={cancelRequest}
        onIgnorar={confirmAndBypass}
      />

      <CardSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        item={item}
        updateItem={updateItem}
        openDateModal={() => { setIsSettingsModalOpen(false); setIsDateModalOpen(true); }}
        openStageModal={() => { setIsSettingsModalOpen(false); setIsStageModalOpen(true); }}
      />

      <ConfirmDeletePhotoModal
        isOpen={isDeleteCoverModalOpen}
        onClose={() => setIsDeleteCoverModalOpen(false)}
        onConfirm={() => {
          updateItem({ ...item, coverPhoto: undefined });
          setIsDeleteCoverModalOpen(false);
        }}
        title="Deletar Capa"
        description="Tem certeza que deseja deletar a foto de capa atual?"
      />

      <ConfirmActionModal
        isOpen={confirmModalConfig.isOpen}
        onClose={() => setConfirmModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModalConfig.onConfirm}
        title={confirmModalConfig.title}
        description={confirmModalConfig.description}
        actionStyle={confirmModalConfig.actionStyle}
        confirmText={confirmModalConfig.confirmText}
      />
    </React.Fragment>,
    document.body
  );
}
