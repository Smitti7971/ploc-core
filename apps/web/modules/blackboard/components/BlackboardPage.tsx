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

import { AttributeMonitor } from "./AttributeMonitor";
import { bubbleEngine } from "../engine/bubble-engine/BubbleEngine";
import { BlackboardBubble } from "../types/bubbles";
import { blackboardEventBus, BLACKBOARD_EVENTS } from "../events/eventBus";
import { ViceBubble } from "../../dashboard/components/libertesse/components/ViceBubble";
import {
  attributeEngine,
  UserAttributes,
} from "../engine/attribute-engine/AttributeEngine";
import { PILLARS_CONFIG, isPillarProfileFilled } from "./AttributePillars";

// Components extraídos
import { NotificationsModal } from "./NotificationsModal";
import { ResourceLayer } from "./ResourceLayer";
import { resourceEngine } from "../engine/resource-engine/ResourceEngine";

import { AmbientGlowBackground } from "../../landing/particles/AmbientGlowBackground";
import { Vignette } from "../../landing/particles/Vignette";
import { useViceStore } from "../../dashboard/components/libertesse/store/viceStore";
import { useTrackerStore } from "../../dashboard/components/tracker/store/trackerStore";
import { usePlocSpeech } from "../../../components/mascot/usePlocSpeech";
import { usePlocStateStore } from "../../mascot/store/plocStateStore";

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
      useViceStore.getState().fetchVices();
    });

    const unsubTracker = useTrackerStore.persist.onFinishHydration(() => {
      useTrackerStore.getState().fetchItems();
    });

    if (useAuthStore.persist.hasHydrated()) {
      setTimeout(() => {
        setIsHydrated(true);
        useViceStore.getState().fetchVices();
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
  const { activeVices, endConsumption, cancelConsumption } = useViceStore();
  const activeConsumingVice = Object.values(activeVices).find(
    (v) => v.isConsuming,
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
      const activeBubbles = bubbleEngine.getActiveBubbles();
      const vices = Object.values(useViceStore.getState().activeVices || {});

      const pending = (
        Object.keys(PILLARS_CONFIG) as Array<keyof UserAttributes>
      ).some((key) => {
        if (attributes[key] > 0) return false;
        const config = PILLARS_CONFIG[key];
        const tasks = activeBubbles.filter((b) =>
          config.habits.includes(
            (b.metadata as { habit?: string })?.habit || "",
          ),
        );
        if (tasks.length > 0) return false;
        if (key === "liberdade" && vices.length > 0) return false;
        if (isPillarProfileFilled(key)) return false;
        return true;
      });
      setHasPendingPillars(pending);
    };

    checkPendingPillars();
    const interval = setInterval(checkPendingPillars, 1000);
    return () => clearInterval(interval);
  }, []);
  const [consumptionElapsed, setConsumptionElapsed] = useState(0);
  const { speak } = usePlocSpeech();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (
      activeConsumingVice?.isConsuming &&
      activeConsumingVice.consumptionStartTime
    ) {
      interval = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - activeConsumingVice.consumptionStartTime!) / 1000,
        );
        setConsumptionElapsed(elapsed);

        // Auto-encerra quando passa de 5 minutos
        const limit = 300; // Fixo em 5 minutos
        if (elapsed >= limit) {
          endConsumption(activeConsumingVice.viceId, limit);
        }
      }, 1000);
    } else {
      const timeout = setTimeout(() => setConsumptionElapsed(0), 0);
      return () => clearTimeout(timeout);
    }
    return () => clearInterval(interval);
  }, [
    activeConsumingVice?.isConsuming,
    activeConsumingVice?.consumptionStartTime,
    activeConsumingVice?.defaultConsumptionSeconds,
    activeConsumingVice?.viceId,
    endConsumption,
  ]);

  const formatConsumingTime = (seconds: number) => {
    const absSeconds = Math.abs(seconds);
    const m = Math.floor(absSeconds / 60);
    const s = absSeconds % 60;
    return `${seconds < 0 ? "+" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };
  const activeSecondsRemaining = 300 - consumptionElapsed;
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

  const miniDotX = useTransform(mapX, [-1500, 1500], [-50, 50]);
  const miniDotY = useTransform(mapY, [-1500, 1500], [-50, 50]);
  // O viewport no minimapa diminui quando damos zoom out (segundo expectativa do usuário)
  // Então scale 1.5 = w-24 h-24, scale minScale = w-8 h-8
  const miniViewportSize = useTransform(mapScale, [1.5, minScale], [24, 8]);

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
      (bubble: BlackboardBubble) => {
        setPlocReaction("dizzy");
        setTimeout(() => setPlocReaction("idle"), 2000);
      },
    );

    const unsubscribeExplosion = blackboardEventBus.subscribe(
      BLACKBOARD_EVENTS.BUBBLE_EXPLODED,
      (bubble: BlackboardBubble & { collided?: boolean; value?: string }) => {
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

  // Bubble Engine Subscription & Event Listeners
  useEffect(() => {
    const unsubscribe = bubbleEngine.subscribe(() => { });

    const onExplode = (
      bubble: BlackboardBubble & { collided?: boolean; value?: string },
    ) => {
      if (bubble?.collided) return;
      setPlocReaction("happy");
      setTimeout(() => {
        setPlocReaction("idle");
      }, 3000);
    };

    const onTimeout = () => {
      setPlocReaction("dizzy");
      setTimeout(() => {
        setPlocReaction("idle");
      }, 3000);
    };

    blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, onExplode);
    blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_TIMEOUT, onTimeout);

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
      unsubscribe();
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3000px] h-[3000px] cursor-grab active:cursor-grabbing touch-none z-[2]"
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
                  {/* A BOLHA DO PLOC (SONAR DE 500px) - Otimizada para Celular */}
                  <motion.div
                    animate={
                      !activeConsumingVice?.isConsuming
                        ? {
                          scale: [1, 1.02, 0.98, 1],
                        }
                        : {
                          scale: 1,
                        }
                    }
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute w-[500px] h-[500px] rounded-full border border-sky-400/15 bg-sky-400/10 flex items-center justify-center pointer-events-none z-0"
                  >
                    <span className="absolute top-[25px] text-[15px] font-bold text-sky-400/40 uppercase tracking-[0.25em]">
                      BOLHA PADRÃO
                    </span>
                  </motion.div>

                  {/* RESOURCE LAYER (GAMIFICATION BUBBLES) */}
                  <div className="pointer-events-auto z-0 absolute inset-0">
                    <ResourceLayer />
                  </div>

                  {/* PLOC AVATAR */}
                  <div className="pointer-events-auto z-10">
                    <PlocAvatarClient
                      draggable={true}
                      emotion={getAvatarEmotion()}
                    />
                  </div>

                  {/* FUMAÇA E UI DO CONSUMO ATIVO */}
                  <AnimatePresence>
                    {activeConsumingVice?.isConsuming && (
                      <motion.div
                        className="absolute inset-0 z-20 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{
                          opacity: 0,
                          transition: { duration: 1.5, ease: "easeInOut" },
                        }}
                      >
                        {/* UI DO CONSUMO ATIVO (BOTÃO PARAR E TIMER) */}
                        <div className="absolute -top-[160px] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto z-[400] scale-90">
                          <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-md px-4 py-1.5 rounded-2xl mb-2 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)] min-w-[140px]">
                            <span className="text-[0.5rem] font-bold text-red-400 uppercase tracking-[0.15em] mb-0.5 text-center ml-[0.15em]">
                              TE DESAFIO A FICAR SEM!
                            </span>
                            <span
                              className={`font-mono font-black text-lg leading-none text-center ${activeSecondsRemaining < 0 ? "text-red-500" : "text-white"}`}
                            >
                              {formatConsumingTime(activeSecondsRemaining)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                cancelConsumption(activeConsumingVice.viceId);
                                speak(
                                  "Esperar te faz mais forte!",
                                  4000,
                                );
                              }}
                              className="bg-zinc-700/80 hover:bg-zinc-600 text-white font-bold px-4 py-2.5 rounded-xl text-[0.55rem] tracking-widest transition-colors shadow-lg whitespace-nowrap backdrop-blur-md"
                            >
                              NÃO VOU CEDER!
                            </button>
                            <button
                              onClick={() =>
                                endConsumption(
                                  activeConsumingVice.viceId,
                                  consumptionElapsed,
                                )
                              }
                              className="bg-red-500 hover:bg-red-600 text-white font-black px-5 py-2.5 rounded-xl text-[0.6rem] tracking-widest transition-colors shadow-lg whitespace-nowrap"
                            >
                              CEDER
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                {/* Radar Temporal (Sonar) Removido */}

                {/* Balão de Fala do Ploc (Centralizado e Dinâmico) */}
                <AnimatePresence>
                  {plocMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.8, x: "-50%" }}
                      animate={{ opacity: 1, y: -110, scale: 1, x: "-50%" }}
                      exit={{ opacity: 0, scale: 0.8, x: "-50%" }}
                      className="absolute left-0 w-max max-w-[280px] bg-slate-900/90 backdrop-blur-xl px-5 py-3 rounded-3xl text-white text-[0.85rem] font-extrabold text-center shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-sky-400/30 z-[300] pointer-events-none"
                    >
                      {plocMessage}
                      {/* Triângulo do Balão (Seta) */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-slate-900/90" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bolhas de Pensamento do Libertesse (Controle de Vícios) */}
                {Object.keys(activeVices)
                  .filter(
                    (viceId) =>
                      !activeVices[viceId].isHidden &&
                      !activeVices[viceId].isVulnerability,
                  )
                  .map((viceId, index, array) => (
                    <ViceBubble
                      key={viceId}
                      viceId={viceId}
                      canvasScale={scale}
                      index={index}
                      total={array.length}
                    />
                  ))}
              </div>
              {/* Bolhas da Wave removidas para otimização de performance */}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="fixed top-[25px] left-0 w-full px-6 flex justify-between items-start z-[100001] pointer-events-none">
        {/* Botões à esquerda */}
        <div className="flex items-center bg-black/40 border border-white/10 backdrop-blur-md rounded-full p-1 shadow-[0_4px_20px_rgba(0,0,0,0.5)] pointer-events-auto gap-1 h-[46px]">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setShowGrid(!showGrid)}
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer shrink-0 transition-colors ${showGrid ? "bg-sky-400/20 text-sky-400" : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"}`}
            title="Grade"
          >
            <Grid3X3 size={16} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              userClosedMinimap.current = showMinimap;
              setShowMinimap(!showMinimap);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer shrink-0 transition-colors ${showMinimap ? "bg-sky-400/20 text-sky-400" : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"}`}
            title="Minimapa"
          >
            <Map size={16} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className={`w-9 h-9 rounded-full flex items-center justify-center relative cursor-pointer transition-colors ${showStatusMenu ? "bg-purple-400/20 text-purple-400" : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"}`}
            title="Status"
          >
            <ActivityIcon size={16} />

            {/* Badge de atenção (Novidades/Ações necessárias) */}
            {hasPendingPillars && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full border-[1.5px] border-black/80 flex items-center justify-center shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-pulse">
                <span className="text-black text-[10px] font-black leading-none mt-[1px]">
                  !
                </span>
              </span>
            )}
          </motion.button>
        </div>

        {/* UserHeader à direita */}
        <div className="flex items-center justify-center pointer-events-auto h-[46px]">
          <UserHeader />
        </div>
      </div>

      {/* Dropdown de Status (Pilares + Modal de Tarefas) */}
      <div className="pointer-events-none fixed inset-0 z-[100002]">
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

      {/* Botão de DEBUG temporário para gamificação */}
      <div className="fixed bottom-[120px] right-[25px] z-[100001] pointer-events-auto flex flex-col items-end gap-2">
        <button
          onClick={() => {
            // As coordenadas são relativas ao Ploc (0,0)
            resourceEngine.spawnBubble("food", "Maçã", 0, -150);
            resourceEngine.spawnBubble("water", "Água", -100, -120);
            resourceEngine.spawnBubble("medicine", "Medicina", 100, -120);
          }}
          className="bg-purple-600/80 hover:bg-purple-500 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)] border border-purple-400/30 flex items-center gap-1 transition-all"
        >
          <span>+</span>
        </button>
        <button
          onClick={() => {
            const store = usePlocStateStore.getState();
            usePlocStateStore.setState({
              hunger: Math.max(0, store.hunger - 10),
              thirst: Math.max(0, store.thirst - 10),
              fatigue: Math.max(0, store.fatigue - 10),
            });
          }}
          className="bg-rose-600/85 hover:bg-rose-500 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-[0_0_15px_rgba(244,63,94,0.3)] border border-rose-400/30 flex items-center gap-1 transition-all"
        >
          <span>-10%</span>
        </button>
      </div>

      {/* Modal/Dropdown do Minimapa (posicionado abaixo dos botões de controle de tela se fosse no menu antigo, mas agora no canto direito para não poluir) */}
      <div className="fixed top-[80px] left-[25px] flex flex-col items-start gap-3 z-[100001] pointer-events-none">
        <AnimatePresence>
          {showMinimap && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="flex flex-col gap-2"
            >
              {/* Controles de Câmera */}
              <div className="flex items-center justify-between w-[100px] bg-black/40 border border-white/10 backdrop-blur-md rounded-xl p-1 pointer-events-auto shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                <button
                  onClick={zoomOut}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  onClick={recenterMap}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-sky-400 transition-colors"
                  title="Centralizar no Ploc"
                >
                  <Target size={16} />
                </button>
                <button
                  onClick={zoomIn}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <ZoomIn size={16} />
                </button>
              </div>

              {/* Minimapa */}
              <div className="w-[100px] h-[100px] rounded-xl bg-black/60 border border-white/10 backdrop-blur-md overflow-hidden pointer-events-none shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative flex items-center justify-center">
                {/* Grade Interna do Minimapa */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `radial-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px)`,
                    backgroundSize: "10px 10px",
                  }}
                ></div>

                {/* Indicador de Viewport (Câmera) com tamanho responsivo ao zoom */}
                <motion.div
                  className="absolute top-1/2 left-1/2 rounded-full border border-sky-400/80 bg-sky-400/20 shadow-[0_0_8px_rgba(56,189,248,0.5)] transform -translate-x-1/2 -translate-y-1/2 origin-center"
                  style={{
                    x: miniDotX,
                    y: miniDotY,
                    width: miniViewportSize,
                    height: miniViewportSize,
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Menu de Navegação Global (Dock) ────────────────── */}
      <DockMenu />
    </div>
  );
}
