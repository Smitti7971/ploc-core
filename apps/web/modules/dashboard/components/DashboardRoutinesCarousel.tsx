import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { getAssetUrl } from '@/lib/config';
import { TrackerStatusCard } from './tracker/components/TrackerStatusCard';
import { IMPACT_ICONS } from '@/modules/routines/data/routinesData';
import { useTrackerStore } from './tracker/store/trackerStore';
import { useDroppable } from '@dnd-kit/core';

interface DashboardRoutinesCarouselProps {
  TABS: any[];
  activeTab: string;
  scrollToTab: (tabId: string, index: number) => void;
  carouselRef: React.RefObject<HTMLDivElement | null>;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  activeVicesList: any[];
  activeTrackers: any[];
  completedVicesList: any[];
  completedTrackers: any[];
  favoriteItems: any[];
  setSelectedTrackerId: (id: string) => void;
  allRoutines: any[];
}

export function DashboardRoutinesCarousel({
  TABS,
  activeTab,
  scrollToTab,
  carouselRef,
  handleScroll,
  activeVicesList,
  activeTrackers,
  completedVicesList,
  completedTrackers,
  favoriteItems,
  setSelectedTrackerId,
  allRoutines
}: DashboardRoutinesCarouselProps) {
  const { isOver: isDragOver, setNodeRef } = useDroppable({
    id: 'root-dropzone',
  });

  return (
    <>
      {/* Label da Tab Atual */}
      <div className="w-full text-center text-sky-400 font-black text-sm tracking-widest uppercase mb-4 shadow-sky-400/20 drop-shadow-md">
        {TABS.find(t => t.id === activeTab)?.label}
      </div>

      {/* BOTÕES FLUTUANTES DE NAVEGAÇÃO DO CARROSSEL */}
      <div className="absolute top-1/2 left-2 -translate-y-1/2 z-20">
        {TABS.findIndex(t => t.id === activeTab) > 0 && (() => {
          const prevTab = TABS[TABS.findIndex(t => t.id === activeTab) - 1];
          const Icon = prevTab.icon;
          return (
            <button
              onClick={() => scrollToTab(prevTab.id, TABS.findIndex(t => t.id === activeTab) - 1)}
              className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 hover:border-sky-400/50 hover:text-sky-400 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] group"
              title={`Ir para ${prevTab.label}`}
            >
              <Icon size={22} className="group-hover:scale-110 transition-transform" />
            </button>
          );
        })()}
      </div>
      <div className="absolute top-1/2 right-2 -translate-y-1/2 z-20">
        {TABS.findIndex(t => t.id === activeTab) < TABS.length - 1 && (() => {
          const nextTab = TABS[TABS.findIndex(t => t.id === activeTab) + 1];
          const Icon = nextTab.icon;
          return (
            <button
              onClick={() => scrollToTab(nextTab.id, TABS.findIndex(t => t.id === activeTab) + 1)}
              className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 hover:border-sky-400/50 hover:text-sky-400 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] group"
              title={`Ir para ${nextTab.label}`}
            >
              <Icon size={22} className="group-hover:scale-110 transition-transform" />
            </button>
          );
        })()}
      </div>

      <div
        ref={(node) => {
          setNodeRef(node);
          if (carouselRef) (carouselRef as any).current = node;
        }}
        onScroll={handleScroll}
        className={`w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide relative shrink-0 transition-colors ${isDragOver ? 'bg-amber-500/5' : ''}`}
      >
        {/* TELA: ROTINAS ATIVAS */}
        <div className="w-full shrink-0 snap-start px-4 pb-2 flex flex-col relative pt-4">
          {activeVicesList.length > 0 || activeTrackers.length > 0 ? (
            <div className="flex flex-col gap-4">
              {activeVicesList.map(activeVice => (
                <TrackerStatusCard
                  key={activeVice.id}
                  item={activeVice}
                  onClick={() => setSelectedTrackerId(activeVice.id)}
                />
              ))}
              {activeTrackers.map(tracker => (
                <TrackerStatusCard
                  key={tracker.id}
                  item={tracker}
                  onClick={() => setSelectedTrackerId(tracker.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center opacity-50 min-h-[200px]">
              <span className="text-slate-400 font-bold text-sm">Nenhuma rotina ativa no momento.</span>
            </div>
          )}
        </div>

        {/* TELA: CONCLUÍDAS */}
        <div className="w-full shrink-0 snap-start px-4 pb-2 flex flex-col relative pt-4">
          {completedVicesList.length > 0 || completedTrackers.length > 0 ? (
            <div className="flex flex-col gap-4">
              {completedVicesList.map(vice => (
                <TrackerStatusCard
                  key={vice.id}
                  item={vice}
                  onClick={() => setSelectedTrackerId(vice.id)}
                />
              ))}
              {completedTrackers.map(tracker => (
                <TrackerStatusCard
                  key={tracker.id}
                  item={tracker}
                  onClick={() => setSelectedTrackerId(tracker.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center opacity-50 min-h-[200px]">
              <span className="text-slate-400 font-bold text-sm">Nenhuma rotina concluída.</span>
            </div>
          )}
        </div>

        {/* TELA: ADOTE UMA ROTINA (Com Filtro e Grade de Ecommerce) */}
        <div className="w-full shrink-0 snap-start px-4 pb-2 relative">
          {/* FILTER AREA (E-Commerce Style) */}
          <div className="w-full mb-6 flex gap-2">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl h-12 flex items-center px-4 gap-3 focus-within:border-white/30 transition-colors">
              <Search size={18} className="text-slate-400" />
              <label htmlFor="search-routines" className="sr-only">Buscar rotinas</label>
              <input
                id="search-routines"
                name="search-routines"
                type="text"
                autoComplete="off"
                placeholder="Buscar rotinas..."
                className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 font-medium"
              />
            </div>
            <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <Filter size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allRoutines.map(routine => (
              <motion.div
                key={routine.id}
                whileHover={{ scale: 1.02 }}
                className="relative bg-[#0f1115] border border-white/5 rounded-2xl cursor-pointer overflow-hidden flex flex-col min-h-[140px] shadow-lg"
              >
                {/* Product Banner */}
                <div className="h-24 w-full relative bg-[#1a1d1a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getAssetUrl(routine.image)}
                    alt={routine.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] to-transparent" />

                  {/* Pillar Badge */}
                  <div
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[0.6rem] font-bold tracking-widest backdrop-blur-md"
                    style={{ backgroundColor: `${routine.sourcePillarColor}20`, color: routine.sourcePillarColor, border: `1px solid ${routine.sourcePillarColor}40` }}
                  >
                    {routine.sourcePillar.toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 pt-1 flex flex-col">
                  <h4 className="text-white text-base font-extrabold mb-1.5 leading-tight">{routine.title}</h4>
                  <p className="text-slate-400 text-xs mb-4 leading-snug line-clamp-2">{routine.desc}</p>

                  {/* Impacts Footer */}
                  <div className="flex justify-between items-end mt-auto pt-2 border-t border-white/5">
                    <div className="flex flex-wrap gap-2">
                      {routine.impacts.map((imp: any, idx: number) => {
                        const ImpIcon = IMPACT_ICONS[imp.pilar as keyof typeof IMPACT_ICONS];
                        const isPositive = imp.val > 0;
                        const impColor = isPositive ? '#22c55e' : '#ef4444';
                        return (
                          <div key={idx} className="flex items-center gap-1.5 text-[0.7rem] font-black bg-black/40 px-2 py-1 rounded" style={{ color: impColor }}>
                            {ImpIcon && <ImpIcon size={12} />}
                            <span>{isPositive ? `+${imp.val}` : imp.val}</span>
                          </div>
                        );
                      })}
                    </div>
                    <button className="text-[0.65rem] font-bold text-white bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors">
                      ADQUIRIR
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* TELA: FAVORITAS */}
        <div className="w-full shrink-0 snap-start px-4 pb-2 flex flex-col relative pt-4">
          {favoriteItems.length > 0 ? (
            <div className="flex flex-col gap-4">
              {favoriteItems.map(item => (
                <TrackerStatusCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedTrackerId(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center opacity-50 min-h-[200px]">
              <span className="text-slate-400 font-bold text-sm">Nenhuma favorita ainda.</span>
            </div>
          )}
        </div>

        {/* TELA: RANKING */}
        <div className="w-full shrink-0 snap-start px-4 pb-2 relative flex flex-col items-center justify-center opacity-50">
          <span className="text-slate-400 font-bold text-sm">Ranking em breve.</span>
        </div>
      </div>
    </>
  );
}
