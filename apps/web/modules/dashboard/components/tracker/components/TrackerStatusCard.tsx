import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Activity, Heart, ChevronDown, ChevronUp, Wand2, LineChart, BookOpen, Star, BicepsFlexed } from 'lucide-react';
import { TrackerItem, useTrackerStore } from '../store/trackerStore';
import { getAssetUrl } from '@/lib/config';
import { useDraggable, useDroppable } from '@dnd-kit/core';

interface TrackerStatusCardProps {
  item: TrackerItem;
  onClick: () => void;
  isChild?: boolean;
  visitedIds?: Set<string>;
  isOverlay?: boolean;
}

export function TrackerStatusCard({ item, onClick, isChild = false, visitedIds = new Set(), isOverlay = false }: TrackerStatusCardProps) {
  const { attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging } = useDraggable({
    id: item.id,
  });

  const { isOver: isDragOver, setNodeRef: setDroppableRef } = useDroppable({
    id: item.id,
  });

  const showCoverPhoto = item.config?.showCoverPhoto !== false;

  const allLogs = useTrackerStore((state) => state.logs);
  const logs = allLogs.filter(l => l.trackerItemId === item.id);
  const setItem = useTrackerStore((state) => state.setItem);

  const isFavorite = !!item.config?.isFavorite;
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setItem({ ...item, config: { ...item.config, isFavorite: !isFavorite } });
  };

  const isExpanded = item.config?.isExpanded ?? true;
  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setItem({ ...item, config: { ...item.config, isExpanded: !isExpanded } });
  };

  const checkLate = (targetItem: TrackerItem, targetLogs: any[]) => {
    if (targetItem.status === 'COMPLETED' || targetItem.status === 'PAUSED') return false;
    
    // Metas de dias
    if (targetItem.config?.daysTarget && targetItem.startDate) {
      const elapsedDays = Math.floor((Date.now() - targetItem.startDate) / (1000 * 60 * 60 * 24));
      if (elapsedDays > targetItem.config.daysTarget) return true;
    }

    // Horário esperado
    if (targetItem.config?.expectedTime) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const logsToday = targetLogs.filter(l => l.timestamp >= todayStart.getTime());
      if (logsToday.length === 0) {
        const [h, m] = targetItem.config.expectedTime.split(':').map(Number);
        const expectedDate = new Date();
        expectedDate.setHours(h, m, 0, 0);
        if (Date.now() > expectedDate.getTime()) return true;
      }
    }

    return false;
  };

  const late = checkLate(item, logs);

  const getCardStatusColors = () => {
    if (item.status === 'COMPLETED') {
      return {
        bg: 'bg-emerald-950/60',
        border: 'border-emerald-500/30 hover:border-emerald-500/50',
        text: 'text-emerald-400',
        gradient: 'from-emerald-950/80 via-[#0f1115]/60 to-transparent'
      };
    }
    if (item.status === 'PAUSED') {
      return {
        bg: 'bg-zinc-900/60',
        border: 'border-zinc-500/30 hover:border-zinc-500/50',
        text: 'text-zinc-400',
        gradient: 'from-zinc-900/80 via-[#0f1115]/60 to-transparent'
      };
    }
    if (late) {
      return {
        bg: 'bg-red-950/60',
        border: 'border-red-500/30 hover:border-red-500/50',
        text: 'text-red-400',
        gradient: 'from-red-950/80 via-[#0f1115]/60 to-transparent'
      };
    }
    // ATIVO
    return {
      bg: 'bg-emerald-800/30',
      border: 'border-emerald-500/30 hover:border-emerald-400/50',
      text: 'text-emerald-300',
      gradient: 'from-emerald-800/40 via-[#0f1115]/60 to-transparent'
    };
  };

  const getTypeTheme = () => {
    if (item.type === 'vice') {
      if (item.config?.mode === 'missao-antitabagismo') return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-b border-yellow-500/20' };
      return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-b border-emerald-500/20' };
    }
    if (item.type === 'acompanhe' || item.type === 'tracker') {
      return { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-b border-amber-500/20' };
    }
    if (item.type === 'treine') {
      return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-b border-red-500/20' };
    }
    // Default / Aprenda (sky)
    return { bg: 'bg-sky-500/20', text: 'text-sky-400', border: 'border-b border-sky-500/20' };
  };

  const getLabel = () => {
    if (item.type === 'vice') {
      return item.config?.mode === 'missao-antitabagismo' ? 'MISSÃO' : 'LIBERTESSE';
    }
    if (item.type === 'acompanhe' || item.type === 'tracker') {
      return 'ACOMPANHE';
    }
    if (item.type === 'treine') {
      return 'TREINE';
    }
    return 'APRENDA';
  };

  const colors = getCardStatusColors();
  const typeTheme = getTypeTheme();

  const allItems = useTrackerStore((state) => state.items);
  // Identifica itens correlacionados (subtarefas)
  const childItems = Object.keys(item.correlations || {})
    .map(id => allItems[id])
    .filter(Boolean)
    // Evita loop infinito: se já visitamos esse ID na árvore, não renderiza de novo
    .filter(child => !visitedIds.has(child.id));

  // Adiciona o ID atual ao set de visitados para os filhos
  const nextVisitedIds = new Set(visitedIds);
  nextVisitedIds.add(item.id);

  // Abre o tracker do filho, disparando o evento que o pai (TrackerOverlay) escuta
  const handleChildClick = (childId: string) => {
    window.dispatchEvent(new CustomEvent('openTracker', { detail: childId }));
  };

  const reparentItem = useTrackerStore(state => state.reparentItem);

  const getCategoryIcon = (type: string, size = 12, className = "") => {
    if (type === 'vice') return <Wand2 size={size} className={className} />;
    if (type === 'acompanhe' || type === 'tracker') return <LineChart size={size} className={className} />;
    if (type === 'treine') return <BicepsFlexed size={size} className={className} />;
    if (type === 'aprenda') return <BookOpen size={size} className={className} />;
    return <Star size={size} className={className} />;
  };

  const getCategoryColor = (type: string, mode?: string) => {
    if (type === 'vice') {
      if (mode === 'missao-antitabagismo') return 'bg-yellow-500';
      return 'bg-emerald-500';
    }
    if (type === 'acompanhe' || type === 'tracker') return 'bg-amber-500';
    if (type === 'treine') return 'bg-red-500';
    if (type === 'aprenda') return 'bg-sky-500';
    return 'bg-zinc-600';
  };

  const getChildBorderColor = (child: TrackerItem) => {
    const childLogs = allLogs.filter(l => l.trackerItemId === child.id);
    if (child.status === 'COMPLETED') return 'border-emerald-500';
    if (child.status === 'PAUSED') return 'border-zinc-500';
    if (checkLate(child, childLogs)) return 'border-red-500';
    return 'border-emerald-400'; // ATIVO
  };

  const expandedChildren = childItems.filter(c => c.config?.isExpanded !== false);
  const retractedChildren = childItems.filter(c => c.config?.isExpanded === false);

  // Se for filho e estiver concluído, retorna card minimalista
  if (isChild && item.status === 'COMPLETED') {
    return (
      <div className="relative">
        <div className="flex flex-col w-full">
          <motion.div
            ref={(node) => {
              if (!isOverlay) {
                setDraggableRef(node);
                setDroppableRef(node);
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            style={{
              opacity: isDragging && !isOverlay ? 0.3 : 1,
            }}
            {...(!isOverlay ? attributes : {})}
            {...(!isOverlay ? listeners : {})}
            className={`relative w-full h-12 rounded-xl overflow-hidden cursor-pointer ${colors.bg} transition-colors group flex items-center justify-between px-4 border ${isDragOver && !isOverlay ? 'border-amber-400 border-2' : colors.border} ${isOverlay ? 'ring-2 ring-amber-400 shadow-2xl scale-105' : ''}`}
          >
            <h3 className="text-white font-black text-sm tracking-tight uppercase leading-tight truncate flex-1">
              {item.name || 'Sem nome'}
            </h3>
            <div className="flex items-center gap-1.5 z-20">
              <button onClick={toggleFavorite} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                <Heart size={14} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-white/40'} />
              </button>
              <button onClick={toggleExpanded} className="p-1 rounded-full hover:bg-white/10 transition-colors bg-black/20" title="Recolher filho">
                <ChevronUp size={14} className="text-white/60" />
              </button>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/20 backdrop-blur-md rounded-full border border-emerald-500/30 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">Concluído</span>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Correlações (Netos concluídos) */}
        {!isOverlay && expandedChildren.length > 0 && (
          <div className="flex flex-col ml-8 mt-2 gap-2 relative">
            <div className="absolute top-0 bottom-4 left-[-16px] w-[2px] bg-white/10 rounded-full" />
            {expandedChildren.map((child) => (
              <div key={child.id} className="relative">
                <div className="absolute top-1/2 left-[-16px] w-4 h-[2px] bg-white/10" />
                <TrackerStatusCard 
                  item={child} 
                  onClick={() => handleChildClick(child.id)} 
                  isChild={true}
                  visitedIds={nextVisitedIds}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <motion.div
        ref={(node) => {
          if (!isOverlay) {
            setDraggableRef(node);
            setDroppableRef(node);
          }
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        style={{
          opacity: isDragging && !isOverlay ? 0.3 : 1,
        }}
        {...(!isOverlay ? attributes : {})}
        {...(!isOverlay ? listeners : {})}
        className={`relative w-full ${isChild ? 'h-28' : 'h-36'} rounded-2xl overflow-hidden cursor-pointer ${colors.bg} transition-colors group border ${isDragOver && !isOverlay ? 'border-amber-400 border-2 scale-[1.02]' : colors.border} ${isOverlay ? 'ring-2 ring-amber-400 shadow-2xl scale-105' : ''}`}
      >
        {/* Background Image */}
        {showCoverPhoto && item.coverPhoto && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity transition-opacity group-hover:opacity-50"
            style={{ backgroundImage: `url(${getAssetUrl(item.coverPhoto)})` }}
          />
        )}

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${colors.gradient}`} />

        {/* HEADER (Type Bar) */}
        <div className={`absolute top-0 left-0 right-0 h-6 ${typeTheme.bg} ${typeTheme.border} backdrop-blur-md flex items-center justify-between px-2 z-20`}>
          <div className="flex-1" />
          <span className={`text-[9px] font-black tracking-widest uppercase ${typeTheme.text} drop-shadow-md`}>
            {getLabel()}
          </span>
          <div className="flex-1 flex justify-end items-center gap-2">
            <button onClick={toggleFavorite} className="p-1 rounded-full hover:bg-white/10 transition-colors" title="Favoritar">
              <Heart size={14} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-white/40'} />
            </button>
            {isChild && !isOverlay && (
              <button onClick={toggleExpanded} className="p-1 rounded-full hover:bg-white/10 transition-colors" title="Recolher filho">
                <ChevronUp size={14} className="text-white/60" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 pt-8 p-4 flex flex-col justify-between">
          {/* Top: Status & Actions */}
          <div className="flex justify-end items-start">

            {item.status === 'COMPLETED' ? (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-md rounded-full border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Concluído</span>
              </div>
            ) : item.status === 'PAUSED' ? (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setItem({ ...item, status: 'ACTIVE' });
                }}
                className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800/60 backdrop-blur-md rounded-full border border-zinc-700/50 hover:bg-zinc-700/60 transition-colors group/btn z-20"
              >
                <span className="w-2 h-2 rounded-full bg-zinc-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-hover/btn:hidden">Pausado</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 hidden group-hover/btn:inline">Retomar</span>
              </button>
            ) : late ? (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 backdrop-blur-md rounded-full border border-red-500/30">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-300">Atrasado</span>
              </div>
            ) : item.isConsuming ? (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 backdrop-blur-md rounded-full border border-rose-500/30">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">Consumindo</span>
              </div>
            ) : (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setItem({ ...item, status: 'PAUSED' });
                }}
                className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 backdrop-blur-md rounded-full border border-emerald-800/50 hover:bg-emerald-900/80 transition-colors group/btn z-20"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 group-hover/btn:hidden">Ativo</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 hidden group-hover/btn:inline">Pausar</span>
              </button>
            )}
          </div>

          {/* Bottom: Info */}
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-white font-black text-lg tracking-tight uppercase leading-tight truncate">
                {item.name || 'Sem nome'}
              </h3>
              <p className="text-white/60 text-xs font-medium mt-1 truncate">
                {logs.length} registro{logs.length !== 1 ? 's' : ''}
              </p>
              {(() => {
                if (item.status === 'COMPLETED') return null;

                if (item.config?.expectedTime) {
                  return (
                    <p className="text-white/60 text-[10px] mt-0.5 truncate">
                      Horário esperado: {item.config.expectedTime}
                    </p>
                  );
                } else if (item.config?.daysTarget && item.startDate) {
                  const elapsedDays = Math.floor((Date.now() - item.startDate) / (1000 * 60 * 60 * 24));
                  const remainingDays = item.config.daysTarget - elapsedDays;
                  if (remainingDays > 0) {
                    return (
                      <p className="text-white/60 text-[10px] mt-0.5 truncate">
                        Faltam {remainingDays} dia{remainingDays !== 1 ? 's' : ''}
                      </p>
                    );
                  } else {
                    return (
                      <p className="text-emerald-400/80 text-[10px] font-bold mt-0.5 truncate">
                        Meta atingida!
                      </p>
                    );
                  }
                }

                if (logs.length > 0) {
                  const lastLog = [...logs].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))[0];
                  if (lastLog && lastLog.timestamp) {
                    return (
                      <p className="text-white/40 text-[10px] mt-0.5 truncate">
                        Último registro: {new Date(lastLog.timestamp).toLocaleDateString('pt-BR')}
                      </p>
                    );
                  }
                }
                return null;
              })()}
            </div>
            {/* Avatares dos filhos recolhidos */}
            {!isOverlay && retractedChildren.length > 0 && (
              <div className="flex items-center -space-x-3 z-20 pr-2">
                <AnimatePresence>
                  {retractedChildren.slice(0, 3).map(child => {
                    const hasPhoto = child.coverPhoto && child.config?.showCoverPhoto !== false;
                    return (
                      <motion.button 
                        key={child.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setItem({ ...child, config: { ...child.config, isExpanded: true } }); 
                        }}
                        title={`Expandir ${child.name || 'Sem nome'}`}
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center overflow-hidden hover:scale-110 transition-transform relative shadow-md group/avatar ${getChildBorderColor(child)} ${hasPhoto ? 'bg-zinc-800' : getCategoryColor(child.type, child.config?.mode)}`}
                      >
                        {hasPhoto ? (
                          <img src={getAssetUrl(child.coverPhoto!)} className="w-full h-full object-cover" />
                        ) : child.config?.icon ? (
                          <span className="text-sm">{child.config.icon}</span>
                        ) : (
                          getCategoryIcon(child.type, 18, "text-black/40")
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                          <ChevronDown size={14} className="text-white" />
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
                {retractedChildren.length > 3 && (
                  <div className="w-10 h-10 rounded-full border-2 border-zinc-700 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white/70 shadow-md">
                    +{retractedChildren.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Correlações (Filhos Expandidos) */}
      {!isOverlay && childItems.length > 0 && (
        <div className="flex flex-col ml-8 mt-3 gap-3 relative">
          {/* Linha vertical principal */}
          {expandedChildren.length > 0 && (
            <div className="absolute top-0 bottom-6 left-[-16px] w-[2px] bg-white/10 rounded-full" />
          )}
          
          <AnimatePresence initial={false}>
            {expandedChildren.map((child) => (
              <motion.div 
                key={child.id} 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="relative overflow-hidden"
              >
                <div className="relative pt-3 pb-1">
                  {/* Linha horizontal para cada filho */}
                  <div className="absolute top-[28px] left-[-16px] w-4 h-[2px] bg-white/10" />
                  
                  <TrackerStatusCard 
                    item={child} 
                    onClick={() => handleChildClick(child.id)} 
                    isChild={true}
                    visitedIds={nextVisitedIds}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
