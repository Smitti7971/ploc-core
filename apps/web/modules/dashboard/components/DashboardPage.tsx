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
  Search,
  Filter,
  Wand2,
  History,
  Edit,
  LineChart,
  Plane,
  PiggyBank,
  Map,
  Timer,
  Droplets,
  Heart,
  Trophy,
  PlusCircle
} from 'lucide-react';
import { getAssetUrl } from '@/lib/config';
import { PillarPage } from '@/modules/routines/components/PillarPage';
import { PILLARS_DATA, IMPACT_ICONS } from '@/modules/routines/data/routinesData';
import { LibertesseScreen, VICES } from '../components/libertesse/components/LibertesseScreen';
import { ViceOptionsModal } from '../components/libertesse/components/ViceOptionsModal';
import { attributeEngine } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';
import { useViceStore } from '../components/libertesse/store/viceStore';
import { PlanejeScreen } from '../components/planeje/components/PlanejeScreen';

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

const MOCK_APRENDA = [
  { title: "Instrumentos", desc: "Violão", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80" },
  { title: "Instrumentos", desc: "Teclado", image: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&q=80" },
  { title: "Línguas", desc: "Inglês", image: "https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?w=800&q=80" },
  { title: "Línguas", desc: "Espanhol", image: "https://images.unsplash.com/photo-1566378822998-1e43c5b81dfc?w=800&q=80" },
  { title: "Hobbies", desc: "Poker", image: "https://images.unsplash.com/photo-1540324155970-1c6dc00115db?w=800&q=80" },
  { title: "Hobbies", desc: "Pesca", image: "https://images.unsplash.com/photo-1506509657088-77c05b82c610?w=800&q=80" },
];

const MOCK_ACOMPANHE = [
  { title: "Crescimento de Pets", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80" },
  { title: "Crescimento dos filhos", image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80" },
  { title: "Cuidados de Planta", image: "https://images.unsplash.com/photo-1466692476877-3aa0c8225d25?w=800&q=80" },
  { title: "Acompanhamento de remédios", image: "https://images.unsplash.com/photo-1584308666744-24d5e4a8dc7b?w=800&q=80" },
];

const MOCK_VIAJE = [
  { title: "Trilhas nacionais", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80" },
  { title: "Praias", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" },
  { title: "Parques", image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80" },
  { title: "Eventos", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80" },
];

const MOCK_POUPE = [
  { title: "Carro", image: "https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=800&q=80" },
  { title: "Presentes", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80" },
  { title: "Construção", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80" },
  { title: "Contas de consumo", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80" },
];

const MOCK_PLANEJE = [
  { title: "Avanços de obra", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80" },
  { title: "Nascimento do filho", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80" },
  { title: "Crescimento de Pets", image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80" },
  { title: "Crescimento de Plantas", image: "https://images.unsplash.com/photo-1416879598555-2518ff0b14f8?w=800&q=80" },
  { title: "Criação de moveis", image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80" },
];

const MOCK_JEJUE = [
  { title: "Jejum extenso", image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80" },
  { title: "Jejum intermitente", image: "https://images.unsplash.com/photo-1447078806655-40579c2520d6?w=800&q=80" },
  { title: "Jejum de dopamina", image: "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800&q=80" },
];

const MOCK_HIDRATE = [
  { title: "Controle de agua", image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80" },
];

const getMockForMethod = (methodId: string) => {
  switch (methodId) {
    case 'aprenda': return MOCK_APRENDA;
    case 'acompanhe': return MOCK_ACOMPANHE;
    case 'viaje': return MOCK_VIAJE;
    case 'poupe': return MOCK_POUPE;
    case 'planeje': return MOCK_PLANEJE;
    case 'jejue': return MOCK_JEJUE;
    case 'hidrate-se': return MOCK_HIDRATE;
    default: return [];
  }
};

export default function DashboardPage() {
  const [activePillar, setActivePillar] = useState<string | null>(null);
  const [activeMethod, setActiveMethod] = useState('rotinas');
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [selectedViceId, setSelectedViceId] = useState<string | null>(null);
  const [modalInitialStep, setModalInitialStep] = useState<'options' | 'active_options' | 'history' | 'form_acompanhe' | 'form_diminua' | 'confirm_end' | undefined>();
  const [attributes, setAttributes] = useState<Record<string, number>>({});

  const activeVices = useViceStore(state => state.activeVices);
  const activeVicesList = Object.values(activeVices || {});


  useEffect(() => {
    setTimeout(() => {
      setAttributes(attributeEngine.getAttributes() as unknown as Record<string, number>);
    }, 0);
    useViceStore.getState().fetchVices();
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
    if (val >= 40) return baseColor; // Cor do Pilar (Estável)
    return '#ef4444'; // Vermelho (Crítico)
  };

  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => setNow(Date.now()), 0);
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getTimeActiveText = (viceId: string) => {
    if (!now) return null;
    const activeVice = activeVices[viceId];
    if (!activeVice || !activeVice.startTime) return null;

    const diffSeconds = Math.floor((now - activeVice.startTime) / 1000);
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

      {/* DASHBOARD PILLARS ROW com Status */}
      <div className="w-full flex justify-between md:justify-center gap-1 md:gap-4 py-4 z-10 px-2 md:px-4">
        {Object.values(PILLARS_DATA).map((pillar) => {
          const Icon = pillar.icon;
          const val = attributes[pillar.id] ?? 50;
          const statusColor = getStatusColor(val, pillar.color);

          return (
            <motion.div
              key={pillar.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePillar(pillar.id)}
              className="flex flex-col items-center gap-1 md:gap-2 cursor-pointer flex-1"
            >
              <div
                className="w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center backdrop-blur-md relative"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `2px solid ${statusColor}`,
                  boxShadow: `0 8px 20px rgba(0,0,0,0.5), inset 0 0 15px ${statusColor}20`
                }}
              >
                <Icon size={24} color={statusColor} />

                {/* Badge de Nível */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-black border border-white/20 flex items-center justify-center text-[0.45rem] md:text-[0.55rem] font-bold shadow-lg">
                  <span style={{ color: statusColor }}>{val}</span>
                </div>
              </div>
              <span className="text-[0.5rem] md:text-[0.6rem] font-black tracking-tighter md:tracking-widest text-slate-400 mt-1 uppercase text-center break-words w-full px-1">
                {pillar.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* METHOD SELECTOR (Substitui as antigas abas) */}
      <div className="w-full px-4 mt-4 mb-2 z-10 shrink-0 border-b border-white/5 pb-4">
        <div className="flex gap-1.5 overflow-x-auto snap-x scrollbar-hide">
          {METHODS.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => {
                  setActiveMethod(method.id);
                  if (method.id === 'rotinas') {
                    if (activeVicesList.length > 0) {
                      setTimeout(() => scrollToTab('ativas', 0), 50);
                    } else {
                      setTimeout(() => scrollToTab('adote', 1), 50);
                    }
                  }
                }}
                className={`shrink-0 snap-center px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[0.65rem] font-black tracking-wider transition-all duration-300 ${activeMethod === method.id
                  ? 'bg-white text-black shadow-lg shadow-white/20'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                  }`}
              >
                {Icon && <Icon size={14} strokeWidth={2.5} />}
                {method.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC CONTENT AREA */}
      {activeMethod === 'rotinas' && (
        <div className="flex-1 min-h-0 w-full relative flex flex-col pt-2">
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
            ref={carouselRef}
            onScroll={handleScroll}
            className="w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide relative shrink-0"
          >
            {/* TELA: ROTINAS ATIVAS */}
            <div className="w-full shrink-0 snap-start px-4 pb-2 flex flex-col relative pt-4">
              {activeVicesList.length > 0 ? (
                activeVicesList.map(activeVice => (
                  <div key={activeVice.viceId} className="mb-6 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <Wand2 size={18} className="text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-emerald-400 text-xs font-bold tracking-widest uppercase">Libertesse Ativo</p>
                          <h3 className="text-white text-sm font-extrabold tracking-widest uppercase">
                            {VICES.find(v => v.id === activeVice.viceId)?.label || activeVice.viceId}
                          </h3>
                        </div>
                      </div>
                      {getTimeActiveText(activeVice.viceId) && (
                        <div className="text-right">
                          <p className="text-slate-400 text-[0.6rem] font-bold tracking-widest uppercase">Ativo há</p>
                          <p className="text-white text-xs font-extrabold">{getTimeActiveText(activeVice.viceId)}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setModalInitialStep('history');
                          setSelectedViceId(activeVice.viceId);
                        }}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-[0.6rem] tracking-widest"
                      >
                        <History size={14} />
                        HISTÓRICO
                      </button>
                      <button
                        onClick={() => {
                          setModalInitialStep('options');
                          setSelectedViceId(activeVice.viceId);
                        }}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-[0.6rem] tracking-widest"
                      >
                        <Edit size={14} />
                        EDITAR
                      </button>
                      <button
                        onClick={() => {
                          setModalInitialStep('confirm_end');
                          setSelectedViceId(activeVice.viceId);
                        }}
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-3 rounded-xl border border-red-500/20 transition-colors flex items-center justify-center gap-2 text-[0.6rem] tracking-widest"
                      >
                        <X size={14} />
                        ENCERRAR
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center opacity-50">
                  <span className="text-slate-400 font-bold text-sm">Nenhuma rotina ativa no momento.</span>
                </div>
              )}
            </div>

            {/* TELA: ADOTE UMA ROTINA (Com Filtro e Grade de Ecommerce) */}
            <div className="w-full shrink-0 snap-start px-4 pb-2 relative">
              {/* FILTER AREA (E-Commerce Style) */}
              <div className="w-full mb-6 flex gap-2">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl h-12 flex items-center px-4 gap-3 focus-within:border-white/30 transition-colors">
                  <Search size={18} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar no catálogo..."
                    className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-slate-500 font-medium"
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
                          {routine.impacts.map((imp, idx) => {
                            const ImpIcon = IMPACT_ICONS[imp.pilar];
                            const isPositive = imp.val > 0;
                            const impColor = isPositive ? '#22c55e' : '#ef4444';
                            return (
                              <div key={idx} className="flex items-center gap-1.5 text-[0.7rem] font-black bg-black/40 px-2 py-1 rounded" style={{ color: impColor }}>
                                <ImpIcon size={12} />
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
            <div className="w-full shrink-0 snap-start px-4 pb-2 relative flex flex-col items-center justify-center opacity-50">
              <span className="text-slate-400 font-bold text-sm">Nenhuma favorita ainda.</span>
            </div>

            {/* TELA: RANKING */}
            <div className="w-full shrink-0 snap-start px-4 pb-2 relative flex flex-col items-center justify-center opacity-50">
              <span className="text-slate-400 font-bold text-sm">Ranking em breve.</span>
            </div>
          </div>
        </div>
      )}

      {activeMethod === 'libertesse' && (
        <div className="flex-1 min-h-0 w-full relative flex flex-col pt-2">
          <LibertesseScreen />
        </div>
      )}

      {activeMethod === 'planeje' && (
        <div className="flex-1 min-h-0 w-full relative flex flex-col pt-2">
          <PlanejeScreen />
        </div>
      )}

      {activeMethod !== 'rotinas' && activeMethod !== 'libertesse' && activeMethod !== 'planeje' && (
        <div className="flex-1 min-h-0 w-full flex flex-col items-center px-6 pb-24 overflow-y-auto pt-8">
          {(() => {
            const methodDef = METHODS.find(m => m.id === activeMethod);
            if (!methodDef) return null;
            const Icon = methodDef.icon;
            const items = getMockForMethod(activeMethod);

            return (
              <div className="w-full max-w-sm flex flex-col gap-8">
                {/* Cabeçalho do Método */}
                <motion.div
                  key={methodDef.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-3 relative"
                >
                  <div className={`w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden text-${methodDef.color}`}>
                    <div className="absolute inset-0 bg-white/5 animate-pulse" />
                    <Icon size={28} />
                  </div>
                  <h3 className="text-white font-black text-2xl tracking-widest uppercase mt-1">
                    {methodDef.label}
                  </h3>
                  <p className="text-slate-400 text-center text-[0.8rem] font-medium leading-relaxed max-w-[280px]">
                    {methodDef.desc}
                  </p>
                </motion.div>

                {/* Grid de Cards Genéricos */}
                <div className="grid grid-cols-2 gap-3 pb-8">
                  {items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="relative w-full aspect-square rounded-[20px] overflow-hidden border border-white/10 group cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={getAssetUrl(item.image)} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                      <div className="absolute inset-0 p-3 flex flex-col justify-end">
                        {('desc' in item && typeof item.desc === 'string') ? (
                          <span className={`text-[0.6rem] font-black text-${methodDef.color} uppercase tracking-wider mb-[2px] opacity-90 drop-shadow-md`}>
                            {item.title}
                          </span>
                        ) : null}
                        <h4 className="text-white font-extrabold text-sm leading-tight drop-shadow-lg">
                          {('desc' in item && typeof item.desc === 'string') ? item.desc : item.title}
                        </h4>
                      </div>
                    </motion.div>
                  ))}

                  {/* Card Extra: Em breve */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: items.length * 0.05 }}
                    className="relative w-full aspect-square rounded-[20px] overflow-hidden border border-white/5 bg-white/5 flex flex-col items-center justify-center group cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <PlusCircle size={24} className="text-white/30 mb-2" />
                    <span className="text-white/40 font-bold text-xs">MAIS EM BREVE</span>
                  </motion.div>
                </div>
              </div>
            );
          })()}
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

      <ViceOptionsModal
        isOpen={!!selectedViceId}
        onClose={() => {
          setSelectedViceId(null);
          setModalInitialStep(undefined);
        }}
        viceId={selectedViceId}
        initialStep={modalInitialStep}
      />
    </div>
  );
}
