'use client';

/**
 * ============================================================================
 * Página Dashboard - DashboardPage.tsx
 * ============================================================================
 * Descrição: Painel de Controle Vertical
 * Atalhos rápidos para as páginas dos pilares (abertas via Overlay) com status
 * em tempo real, e o catálogo geral de rotinas consolidado em formato
 * de carrossel de modais (telas).
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Clock,
  X,
  Activity,
  Heart,
  Trophy,
  PlusCircle,
  Wand2,
  LineChart,
  Plane,
  PiggyBank,
  Map,
  Timer,
  Droplets
} from 'lucide-react';
import { getAssetUrl } from '@/lib/config';
import { PillarPage } from '@/modules/routines/components/PillarPage';
import { PILLARS_DATA, IMPACT_ICONS } from '@/modules/routines/data/routinesData';
import { LibertesseScreen, VICES } from '../components/libertesse/components/LibertesseScreen';
import { attributeEngine } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';
import { AcompanheScreen } from '../components/tracker/components/AcompanheScreen';
import { GenericTrackerScreen } from '../components/tracker/components/GenericTrackerScreen';
import { PlanejeScreen } from '../components/planeje/components/PlanejeScreen';
import { useTrackerStore } from '../components/tracker/store/trackerStore';
import { TrackerOverlay } from '../components/tracker/components/TrackerOverlay';
import { DashboardRoutinesCarousel } from './DashboardRoutinesCarousel';
import { DashboardPillarsRow } from './DashboardPillarsRow';
import { DashboardMethodSelector } from './DashboardMethodSelector';

const allRoutines = Object.values(PILLARS_DATA).flatMap(pillar =>
  pillar.options.map(opt => ({
    ...opt,
    sourcePillar: pillar.id,
    sourcePillarColor: pillar.color
  }))
);

const METHODS = [
  { id: 'rotinas', label: 'ROTINAS', icon: Clock, color: 'white', bg: 'from-white/10 to-transparent', desc: 'Catálogo de rotinas para o seu dia a dia.' },
  { id: 'libertesse', label: 'LIBERTESSE', icon: Wand2, color: 'sky-500', bg: 'from-sky-500/10 to-sky-900/5', desc: 'Acompanhe, diminua ou pare com vícios que limitam sua liberdade.' },
  { id: 'aprenda', label: 'APRENDA', icon: BookOpen, color: 'emerald-400', bg: 'from-emerald-500/10 to-teal-900/5', desc: 'Desenvolva novas habilidades, acesse micro-cursos e expanda seu conhecimento.' },
  { id: 'acompanhe', label: 'ACOMPANHE', icon: LineChart, color: 'amber-400', bg: 'from-amber-500/10 to-orange-900/5', desc: 'Monitore métricas, hábitos complexos e visualize seu progresso ao longo do tempo.' },
  { id: 'viaje', label: 'VIAJE', icon: Plane, color: 'indigo-400', bg: 'from-indigo-500/10 to-blue-900/5', desc: 'Planeje destinos, organize roteiros e gerencie suas experiências pelo mundo.' },
  { id: 'poupe', label: 'POUPE', icon: PiggyBank, color: 'emerald-500', bg: 'from-green-500/10 to-emerald-900/5', desc: 'Controle gastos, crie reservas financeiras e acompanhe suas economias.' },
  { id: 'planeje', label: 'PLANEJE', icon: Map, color: 'purple-400', bg: 'from-purple-500/10 to-fuchsia-900/5', desc: 'Trace metas de longo prazo, organize projetos e crie planos de ação estruturados.' },
  { id: 'jejue', label: 'JEJUE', icon: Timer, color: 'orange-400', bg: 'from-orange-500/10 to-red-900/5', desc: 'Gerencie protocolos de jejum intermitente e acompanhe os benefícios para sua saúde.' },
  { id: 'hidrate-se', label: 'HIDRATE-SE', icon: Droplets, color: 'cyan-400', bg: 'from-cyan-500/10 to-blue-900/5', desc: 'Controle sua ingestão de água diária e mantenha seu corpo sempre hidratado.' },
];

const TABS = [
  { id: 'ativas', label: 'ROTINAS ATIVAS', icon: Activity },
  { id: 'adote', label: 'ADOTE UMA ROTINA', icon: PlusCircle },
  { id: 'favoritas', label: 'FAVORITAS', icon: Heart },
  { id: 'ranking', label: 'RANKING', icon: Trophy },
];



export default function DashboardPage() {
  const [activePillar, setActivePillar] = useState<string | null>(null);
  const [activeMethod, setActiveMethod] = useState('rotinas');
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const trackerItems = useTrackerStore(state => state.items);
  const activeVicesList = Object.values(trackerItems || {}).filter(t => t.status === 'ACTIVE' && t.type === 'vice');
  const activeTrackers = Object.values(trackerItems || {}).filter(t => t.status === 'ACTIVE' && t.type !== 'vice');

  const [selectedTrackerId, setSelectedTrackerId] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<Record<string, number>>({});

  useEffect(() => {
    setTimeout(() => {
      setAttributes(attributeEngine.getAttributes() as unknown as Record<string, number>);
    }, 0);
    useTrackerStore.getState().fetchItems();

    const handleOpenTracker = (e: any) => {
      setSelectedTrackerId(e.detail);
    };
    window.addEventListener('openTracker', handleOpenTracker);
    return () => window.removeEventListener('openTracker', handleOpenTracker);
  }, []);

  const carouselRef = useRef<HTMLDivElement>(null);

  // O redirecionamento automático para "Adote" foi removido para evitar pulos inesperados no F5

  // Rolagem suave para a aba clicada
  const scrollToTab = (tabId: string, index: number) => {
    setActiveTab(tabId);
    if (carouselRef.current) {
      const container = carouselRef.current;
      const screenWidth = container.clientWidth;
      container.scrollTo({
        left: screenWidth * index,
        behavior: 'smooth'
      });
    }
  };

  // Detectar qual aba está visível no scroll (opcional, para sincronizar as abas no topo)
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const screenWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;
    const index = Math.round(scrollLeft / screenWidth);
    if (TABS[index] && TABS[index].id !== activeTab) {
      setActiveTab(TABS[index].id);
    }
  };

  // Calcula cor do status baseada no valor
  const getStatusColor = (val: number, baseColor: string) => {
    if (val >= 70) return '#22c55e'; // Verde (Excelente)
    return baseColor; // Cor do Pilar (Estável)
  };

  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => setNow(Date.now()), 0);
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getTimeActiveText = (item: any) => {
    if (!now || !item.startDate) return null;

    const diffSeconds = Math.floor((now - item.startDate) / 1000);
    if (diffSeconds < 0) return '0m';

    const d = Math.floor(diffSeconds / 86400);
    const h = Math.floor((diffSeconds % 86400) / 3600);
    const m = Math.floor((diffSeconds % 3600) / 60);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div className="w-full h-[100dvh] bg-black text-white flex flex-col relative overflow-x-hidden overflow-y-auto pb-6 pt-20">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* O Header "Dashboard" foi removido a pedido do usuário para ir direto aos pilares */}

      {/* DASHBOARD PILLARS ROW com Status */}
      <DashboardPillarsRow
        pillarsData={PILLARS_DATA}
        attributes={attributes}
        setActivePillar={setActivePillar}
        getStatusColor={getStatusColor}
      />

      {/* METHOD SELECTOR */}
      <DashboardMethodSelector
        METHODS={METHODS}
        activeMethod={activeMethod}
        setActiveMethod={setActiveMethod}
        activeVicesList={activeVicesList}
        scrollToTab={scrollToTab}
      />

      {/* DYNAMIC CONTENT AREA */}
      {activeMethod === 'rotinas' && (
        <div className="flex-1 min-h-0 w-full relative flex flex-col pt-2">
          {/* Label da Tab Atual */}
          <div className="w-full text-center text-sky-400 font-black text-sm tracking-widest uppercase mb-4 shadow-sky-400/20 drop-shadow-md">
            {TABS.find(t => t.id === activeTab)?.label}
          </div>

          <DashboardRoutinesCarousel
            TABS={TABS}
            activeTab={activeTab}
            scrollToTab={scrollToTab}
            carouselRef={carouselRef}
            handleScroll={handleScroll}
            activeVicesList={activeVicesList}
            activeTrackers={activeTrackers}
            setSelectedTrackerId={setSelectedTrackerId}
            allRoutines={allRoutines}
          />
        </div>
      )}

      {activeMethod === 'libertesse' && (
        <div className="flex-1 min-h-0 w-full relative flex flex-col pt-2">
          <LibertesseScreen />
        </div>
      )}

      {activeMethod === 'acompanhe' && (
        <div className="flex-1 min-h-0 w-full relative flex flex-col pt-2">
          <AcompanheScreen />
        </div>
      )}

      {activeMethod === 'planeje' && (
        <div className="flex-1 min-h-0 w-full relative flex flex-col pt-2">
          <PlanejeScreen />
        </div>
      )}

      {activeMethod !== 'rotinas' && activeMethod !== 'libertesse' && activeMethod !== 'acompanhe' && activeMethod !== 'planeje' && (
        <div className="flex-1 min-h-0 w-full relative flex flex-col pt-2">
          <GenericTrackerScreen methodId={activeMethod} />
        </div>
      )}

      {/* OVERLAY: PILLAR PAGE */}
      <AnimatePresence>
        {activePillar && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#0a0c0a] flex flex-col pt-24"
          >
            <div className="absolute top-24 right-6 z-[60]">
              <button
                onClick={() => setActivePillar(null)}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-xl"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <PillarPage pillarId={activePillar} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {selectedTrackerId && (
        <TrackerOverlay
          itemId={selectedTrackerId}
          onClose={() => setSelectedTrackerId(null)}
        />
      )}
    </div>
  );
}
