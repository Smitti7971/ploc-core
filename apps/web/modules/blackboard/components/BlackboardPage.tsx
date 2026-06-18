"use client";

/**
 * @module BlackboardPage
 * @description O quadro principal de interação do Ploc. Um canvas de panning/zoom infinito
 * que gerencia o estado da câmera, orquestra as bolhas de tarefas, anotações (post-its) e
 * a interação com o mascote virtual.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { PlocAvatarClient } from "@/components/mascot/PlocAvatarClient";
import {
  Trophy,
  Clock,
  Target,
  Grid3X3,
  Map,
  Play,
  Pause,
  Square,
  Activity as ActivityIcon,
  Menu,
  Bell,
  ZoomIn,
  ZoomOut,
  Plus,
} from "lucide-react";
import { UserHeader } from "@/components/layout/UserHeader";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  animate,
} from "framer-motion";
import { DockMenu } from "@/components/layout/DockMenu";

// Removido import estático do AttributeMonitor
import { blackboardEventBus, BLACKBOARD_EVENTS } from "../events/eventBus";
import {
  attributeEngine,
  UserAttributes,
} from "../engine/attribute-engine/AttributeEngine";
import { PILLARS_CONFIG, isPillarProfileFilled } from "./AttributePillars";

import dynamic from "next/dynamic";

// Components extraídos (agora com lazy loading para modais pesados)
const NotificationsModal = dynamic(
  () => import("./NotificationsModal").then((mod) => mod.NotificationsModal),
  { ssr: false }
);
const AttributeMonitor = dynamic(
  () => import("./AttributeMonitor").then((mod) => mod.AttributeMonitor),
  { ssr: false }
);



import { AmbientGlowBackground } from "../../landing/particles/AmbientGlowBackground";
import { Vignette } from "../../landing/particles/Vignette";
import { useTrackerStore } from "../../dashboard/components/tracker/store/trackerStore";
import { usePlocSpeech } from '@/modules/chat/hooks/usePlocSpeech';
import { usePlocStateStore } from "../../mascot/store/plocStateStore";
import { BlackboardHUD } from "./BlackboardHUD";
import { BlackboardBottomHUD } from "./BlackboardBottomHUD";
import { BlackboardActiveConsumption } from "./BlackboardActiveConsumption";
import { BlackboardMinimap } from "./BlackboardMinimap";

export default function BlackboardPage() {
  const { user } = useAuthStore();
  const { refreshProfile } = useAuth();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [profileSynced, setProfileSynced] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isPillarActive, setIsPillarActive] = useState(false);

  // Espera a hidratação do Zustand (carregar do localStorage)
  useEffect(() => {
    const unsubAuth = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    const unsubTracker = useTrackerStore.persist.onFinishHydration(() => {
      useTrackerStore.getState().fetchItems();
    });

    if (useAuthStore.persist.hasHydrated()) {
      setTimeout(() => {
        setIsHydrated(true);
      }, 0);
    }

    if (useTrackerStore.persist.hasHydrated()) {
      setTimeout(() => {
        useTrackerStore.getState().fetchItems();
      }, 0);
    }

    return () => {
      unsubAuth();
      unsubTracker();
    };
  }, []);

  // Redireciona se não houver usuário (sessão perdida) - APÓS HIDRATAÇÃO
  useEffect(() => {
    if (isHydrated && !user && typeof window !== "undefined") {
      router.push("/");
    } else if (isHydrated && user && !profileSynced) {
      setProfileSynced(true);
      refreshProfile().catch(console.error);
    }
  }, [isHydrated, user, router, profileSynced, refreshProfile]);

  const [showGrid, setShowGrid] = useState(true);
  const [showMinimap, setShowMinimap] = useState(false);
  const [showAttributes, setShowAttributes] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scale = 1; // Constante mantida para compatibilidade visual dos filhos
  const [plocReaction, setPlocReaction] = useState<
    "idle" | "happy" | "stressed" | "dizzy"
  >("idle");
  const [score, setScore] = useState(attributeEngine.getScore());

  // Janela de tempo baseada no modo de visualização

  const containerRef = useRef<HTMLDivElement>(null);

  const [plocState] = useState<{
    emotion: string;
    energy: number;
    lastAction: string;
  }>({ emotion: "calm", energy: 50, lastAction: "none" });
  const [plocMessage, setPlocMessage] = useState<string | null>(null);

  const mapX = useMotionValue(0);
  const mapY = useMotionValue(0);
  const mapScale = useMotionValue(1);

  // --- RESPONSIVE ZOOM FOR MOBILE ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        // Ajusta o zoom inicial no Mobile para caber a bolha do Ploc inteira (500px + margem)
        const idealScale = window.innerWidth / 550;
        mapScale.set(Math.min(idealScale, 0.7));
      }
    }
  }, [mapScale]);

  // --- PINCH TO ZOOM LOGIC ---
  const initialPinchDist = useRef<number | null>(null);
  const initialScale = useRef<number>(1);

  const getPinchDistance = (e: React.TouchEvent) => {
    if (e.touches.length < 2) return 0;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      initialPinchDist.current = getPinchDistance(e);
      initialScale.current = mapScale.get();
    } else {
      initialPinchDist.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDist.current !== null) {
      // Evita o comportamento padrão do navegador
      // e previne scrolls indesejados durante o pinch
      // (O touch-none do container geralmente já resolve, mas é uma garantia)
      const dist = getPinchDistance(e);
      const scaleChange = dist / initialPinchDist.current;
      let newScale = initialScale.current * scaleChange;

      if (newScale < 0.2) newScale = 0.2;
      if (newScale > 3) newScale = 3;

      mapScale.set(newScale);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      initialPinchDist.current = null;
    }
  };

  // === LÓGICA DE CONSUMO ATIVO (LIBERTESSE) E ALERTAS ===
  const { items, endConsumption, cancelConsumption } = useTrackerStore();
  const activeConsumingVice = Object.values(items).find(
    (v) => v.type === 'vice' && v.isConsuming,
  );

  const plocMood = usePlocStateStore((state) => state.mood);

  const getAvatarEmotion = useCallback(():
    | "calm"
    | "happy"
    | "stressed"
    | "pissed"
    | "sleeping"
    | "dizzy" => {
    if (activeConsumingVice?.isConsuming) return "dizzy";
    if (plocReaction !== "idle") return plocReaction as any;

    switch (plocMood) {
      case "ILUMINADO":
        return "happy";
      case "FELIZ":
        return "calm";
      case "APÁTICO":
        return "calm";
      case "CHATEADO":
        return "stressed";
      case "RAIVA":
        return "pissed";
      default:
        return "calm";
    }
  }, [plocMood, plocReaction, activeConsumingVice?.isConsuming]);

  const [hasPendingPillars, setHasPendingPillars] = useState(false);

  useEffect(() => {
    // Atualiza a flag de pendências
    const checkPendingPillars = () => {
      const attributes = attributeEngine.getAttributes();
      const vices = Object.values(useTrackerStore.getState().items).filter(v => v.type === 'vice' && v.status === 'ACTIVE');

      const pending = (
        Object.keys(PILLARS_CONFIG) as Array<keyof UserAttributes>
      ).some((key) => {
        if (attributes[key] > 0) return false;
        if (key === "liberdade" && vices.length > 0) return false;
        if (isPillarProfileFilled(key)) return false;
        return true;
      });
      setHasPendingPillars(pending);
    };

    checkPendingPillars();

    const interval = setInterval(checkPendingPillars, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  const { speak } = usePlocSpeech();
  // ============================================
  const [minScale, setMinScale] = useState(0.25);

  const userClosedMinimap = useRef(false);
  const autoOpenedMinimap = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight;
      setMinScale(Math.max(0.1, vh / 3000));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useMotionValueEvent(mapX, "change", (latestX) => {
    const latestY = mapY.get();
    const distance = Math.sqrt(latestX * latestX + latestY * latestY);

    // Auto-abre quando afasta muito do centro
    if (distance > 500 && !showMinimap && !userClosedMinimap.current) {
      setShowMinimap(true);
      autoOpenedMinimap.current = true;
    } else if (
      distance <= 500 &&
      showMinimap &&
      autoOpenedMinimap.current &&
      !userClosedMinimap.current
    ) {
      setShowMinimap(false);
      autoOpenedMinimap.current = false;
    }

    // Auto-fecha quando volta pro centro
    if (distance < 50) {
      if (showMinimap) {
        setShowMinimap(false);
      }
      userClosedMinimap.current = false;
      autoOpenedMinimap.current = false;
    }
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault(); // Apenas previne rolagem se for pinch ou ctrl+wheel
      }

      // Fator de zoom sutil para roda do mouse e pinch
      const zoomFactor = 0.001;
      const currentScale = mapScale.get();
      let newScale = currentScale - e.deltaY * zoomFactor;

      newScale = Math.max(minScale, Math.min(newScale, 1.5));
      mapScale.set(newScale);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [minScale, mapScale]);

  const recenterMap = () => {
    animate(mapX, 0, { type: "spring", stiffness: 300, damping: 30 });
    animate(mapY, 0, { type: "spring", stiffness: 300, damping: 30 });
    animate(mapScale, 1, { type: "spring", stiffness: 300, damping: 30 });
  };

  const zoomIn = () => {
    const target = Math.min(mapScale.get() + 0.2, 1.5);
    animate(mapScale, target, { duration: 0.2 });
  };
  const zoomOut = () => {
    const target = Math.max(mapScale.get() - 0.2, minScale);
    animate(mapScale, target, { duration: 0.2 });
  };



  useEffect(() => {
    const unsubscribe = blackboardEventBus.subscribe(
      BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED,
      (change: { pillar: string; value: number }) => {
        if (change.pillar === "foco") {
          setScore(change.value);
        }
      },
    );
    // Reações do Ploc a eventos das bolhas
    const unsubscribeTimeout = blackboardEventBus.subscribe(
      BLACKBOARD_EVENTS.BUBBLE_TIMEOUT,
      (bubble: any) => {
        setPlocReaction("dizzy");
        setTimeout(() => setPlocReaction("idle"), 2000);
      },
    );

    const unsubscribeExplosion = blackboardEventBus.subscribe(
      BLACKBOARD_EVENTS.BUBBLE_EXPLODED,
      (bubble: any & { collided?: boolean; value?: string }) => {
        if (bubble?.collided) return;
        const isNegative = bubble && bubble.value === "negative";
        setPlocReaction(isNegative ? "dizzy" : "happy");
        setTimeout(() => setPlocReaction("idle"), 1500);
      },
    );

    return () => {
      unsubscribe();
      unsubscribeTimeout();
      unsubscribeExplosion();
    };
  }, [score]);

  // Sincroniza atributos reais do backend com o motor visual (AttributeEngine)
  useEffect(() => {
    if (user?.stats) {
      attributeEngine.syncWithBackend(user.stats);
    }
  }, [user]);

  useEffect(() => {
    const unsubReaction = blackboardEventBus.subscribe(
      BLACKBOARD_EVENTS.PLOC_REACTION,
      (data: { message?: string }) => {
        setPlocMessage(data.message || null);
        if (data.message) {
          setTimeout(() => setPlocMessage(null), 4000);
        }
      },
    );

    return () => {
      unsubReaction();
    };
  }, []);

  return (
    <div
      className="blackboard-page w-screen h-screen bg-[#0a0c0a] overflow-hidden relative font-sans touch-none"
      ref={containerRef}
    >
      <AmbientGlowBackground />
      <Vignette />



      <div
        id="blackboard-canvas"
        className="w-full h-full relative p-0 m-0 bg-transparent overflow-hidden"
      >
        <motion.div
          drag
          dragConstraints={{
            left: -1500,
            right: 1500,
            top: -1500,
            bottom: 1500,
          }}
          dragElastic={0}
          dragMomentum={true}
          style={{ x: mapX, y: mapY }}
          whileTap={{ cursor: "grabbing" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3000px] h-[3000px] cursor-grab active:cursor-grabbing touch-none z-base"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            style={{ scale: mapScale }}
            className="w-full h-full relative origin-center"
          >
            <div
              className="canvas-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3000px] h-[3000px] bg-transparent overflow-visible pointer-events-none"
              style={{
                backgroundImage: showGrid
                  ? `linear-gradient(rgba(56, 189, 248, 0.05) 2px, transparent 2px),
                   linear-gradient(90deg, rgba(56, 189, 248, 0.05) 2px, transparent 2px),
                   linear-gradient(rgba(56, 189, 248, 0.02) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(56, 189, 248, 0.02) 1px, transparent 1px)`
                  : `radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
                backgroundSize: showGrid
                  ? "100px 100px, 100px 100px, 20px 20px, 20px 20px"
                  : "40px 40px",
              }}
            >
              {/* Minimapa / HUD Renderizado por Fora, mas Grid aplicada aqui para senso de direção */}

              <div
                id="ploc-anchor"
                className="absolute left-1/2 top-1/2 w-0 h-0 z-20"
              >
                <motion.div
                  className="absolute left-0 top-0 pointer-events-none flex items-center justify-center"
                  initial={{ x: "-50%", y: "-50%", scale: 1.0 }}
                  animate={{
                    x:
                      plocReaction === "dizzy"
                        ? ["-50%", "-52%", "-48%", "-52%", "-48%", "-50%"]
                        : "-50%",
                    y: "-50%",
                    // Escalonamento Fixo: O elemento cancela o zoom do mapa perfeitamente,
                    // garantindo que fique sempre no tamanho base (100px).
                    scale: (plocReaction === "happy" ? 1.1 : 1.0) * (1 / scale),
                  }}
                  transition={{
                    scale: { type: "spring", stiffness: 300, damping: 20 },
                    x: { duration: 0.4 },
                  }}
                >




                  {/* PLOC AVATAR */}
                  <div className="pointer-events-auto z-10">
                    <PlocAvatarClient
                      draggable={true}
                      emotion={getAvatarEmotion()}
                    />
                  </div>

                  {/* FUMAÇA E UI DO CONSUMO ATIVO */}
                  <BlackboardActiveConsumption activeConsumingVice={activeConsumingVice} />
                </motion.div>
                {/* Radar Temporal (Sonar) Removido */}

                {/* Balão de Fala do Ploc (Centralizado e Dinâmico) */}
                <AnimatePresence>
                  {plocMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.8, x: "-50%" }}
                      animate={{ opacity: 1, y: -110, scale: 1, x: "-50%" }}
                      exit={{ opacity: 0, scale: 0.8, x: "-50%" }}
                      className="absolute left-0 w-max max-w-[280px] bg-slate-900/90 backdrop-blur-xl px-5 py-3 rounded-3xl text-white text-[0.85rem] font-extrabold text-center shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-sky-400/30 z-hud pointer-events-none"
                    >
                      {plocMessage}
                      {/* Triângulo do Balão (Seta) */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-slate-900/90" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <BlackboardHUD
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        showMinimap={showMinimap}
        setShowMinimap={setShowMinimap}
        showStatusMenu={showStatusMenu}
        setShowStatusMenu={setShowStatusMenu}
        hasPendingPillars={hasPendingPillars}
        userClosedMinimap={userClosedMinimap}
      />

      {/* Dropdown de Status (Pilares + Modal de Tarefas) */}
      <div className="pointer-events-none fixed inset-0 z-hud">
        <AnimatePresence>
          {showStatusMenu && (
            <>
              <div
                className="absolute inset-0 pointer-events-auto"
                onClick={() => setShowStatusMenu(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-[80px] left-6 w-[calc(100vw-48px)] sm:w-[360px] max-h-[80vh] overflow-y-auto no-scrollbar flex flex-col gap-3 pointer-events-auto rounded-3xl"
              >
                {/* Pilares */}
                <div className="p-4 relative z-10">
                  <AttributeMonitor
                    inline
                    onClose={() => setShowStatusMenu(false)}
                    onTooltipChange={(t) => setIsPillarActive(!!t)}
                  />
                </div>

                {/* Tarefas e Cofre */}
                <AnimatePresence>
                  {!isPillarActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.3 }}
                    >
                      <NotificationsModal
                        inline
                        isOpen={true}
                        onClose={() => setShowStatusMenu(false)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>


      <BlackboardMinimap
        showMinimap={showMinimap}
        zoomOut={zoomOut}
        zoomIn={zoomIn}
        recenterMap={recenterMap}
        mapX={mapX}
        mapY={mapY}
        mapScale={mapScale}
        minScale={minScale}
      />

      <BlackboardBottomHUD />

      {/* ── Menu de Navegação Global (Dock) ────────────────── */}
      <DockMenu />
    </div>
  );
}
