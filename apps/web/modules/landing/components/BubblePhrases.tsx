'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CHALLENGE_PHRASES } from '@/modules/landing/constants/phrases';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '@/modules/blackboard/events/eventBus';

interface BubbleConcept {
  id?: string; // id opcional na base, adicionado dinamicamente
  word: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  theme: 'blue' | 'emerald' | 'gold' | 'violet' | 'dark';
  maxOpacity: number;
  zIndex: number;
  driftX?: number; // Drift horizontal em pixels para efeito de movimento diagonal suave
  noCollision?: boolean; // Se true, a bolha flutua livremente sob o Ploc sem estourar!
  initialY?: string; // Altura de partida para povoar a tela instantaneamente na primeira execução
}

// Pool de verbos de execução configurados para o Efeito Parallax Tridimensional de 5 Camadas
const BASE_CONCEPTS = [
  // Camada 1: Plano de Fundo Abissal Silhueta (Atrás do Texto zIndex 15 e atrás da Moldura zIndex 10) -> zIndex: 4
  { word: 'MEDITE', left: '8%', size: 24, duration: 48, delay: 0, theme: 'dark', maxOpacity: 0.18, zIndex: 4, driftX: 90, initialY: '75vh' },
  { word: 'CALMA', left: '45%', size: 28, duration: 42, delay: 6, theme: 'dark', maxOpacity: 0.18, zIndex: 4, driftX: 60, initialY: '30vh' },

  // Camada 2: Atrás da Frase Silhueta (Frente da Moldura zIndex 10, Atrás do Texto zIndex 15) -> zIndex: 12
  { word: 'DURMA', left: '90%', size: 20, duration: 52, delay: 5, theme: 'dark', maxOpacity: 0.18, zIndex: 12, driftX: -120, initialY: '20vh' },
  { word: 'RESPIRA', left: '72%', size: 26, duration: 38, delay: 11, theme: 'dark', maxOpacity: 0.18, zIndex: 12, driftX: -80, initialY: '60vh' },

  // Camada 3: Frente da Frase, Sob o Ploc (Frente do Texto zIndex 15, Atrás do Ploc zIndex 20) -> zIndex: 18
  { word: 'PLANEJE', left: '22%', size: 62, duration: 32, delay: 15, theme: 'blue', maxOpacity: 0.58, zIndex: 18, driftX: 110, noCollision: true, initialY: '55vh' },

  // Camada 4: Plano do Ploc - COLISÃO! (Frente do Texto zIndex 15, Colide no Ploc zIndex 20) -> zIndex: 20
  { word: 'DANCE', left: '78%', size: 65, duration: 30, delay: 9, theme: 'gold', maxOpacity: 0.58, zIndex: 20, driftX: -110, initialY: '10vh' },
  { word: 'TREINE', left: '12%', size: 78, duration: 22, delay: 3, theme: 'emerald', maxOpacity: 0.72, zIndex: 20, driftX: 140, initialY: '40vh' },

  // Camada 5: Primeiro Plano Gigante (Grandes, Frente de TUDO: Texto, Ploc e Moldura) -> zIndex: 25
  { word: 'CORRA', left: '88%', size: 112, duration: 24, delay: 13, theme: 'emerald', maxOpacity: 0.75, zIndex: 25, driftX: -140, initialY: '90vh' }
];

// Flag global para verificar se o usuário já interagiu com a tela
let hasUserInteracted = false;

// Cache global para a AudioContext e evitar recriação excessiva
let sharedAudioCtx: AudioContext | null = null;

if (typeof window !== 'undefined') {
  const enableAudio = () => {
    hasUserInteracted = true;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass && !sharedAudioCtx) {
        sharedAudioCtx = new AudioContextClass();
        sharedAudioCtx.resume().catch(() => {});
      }
    } catch (e) {
      // Falha silenciosa
    }

    window.removeEventListener('click', enableAudio);
    window.removeEventListener('touchstart', enableAudio);
    window.removeEventListener('keydown', enableAudio);
  };
  window.addEventListener('click', enableAudio, { passive: true });
  window.addEventListener('touchstart', enableAudio, { passive: true });
  window.addEventListener('keydown', enableAudio, { passive: true });
}

// Função ultra-leve de síntese de som de estouro "PLOC" com variações procedurais e presets dinâmicos via Web Audio API
const playPlocSound = () => {
  if (typeof window === 'undefined' || !hasUserInteracted) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContextClass();
    }
    const ctx = sharedAudioCtx;

    // Garante que o contexto de áudio seja retomado se estiver suspenso
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    // Fator de variação randômico sutil para que nenhum som seja idêntico
    const jitter = 0.9 + Math.random() * 0.2; // entre 90% e 110%

    // Escolhe aleatoriamente entre 3 presets de som de estouro
    const soundType = Math.floor(Math.random() * 3);

    if (soundType === 0) {
      // Preset 0: O Ploc Tradicional (Sine Sweep Clássico)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(780 * jitter, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(10 * jitter, now + 0.12);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.start(now);
      osc.stop(now + 0.14);
    } else if (soundType === 1) {
      // Preset 1: O Bloop Profundo (Triângulo Aquático Aveludado)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(340 * jitter, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(20 * jitter, now + 0.15);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      // Filtro passa-baixa para amaciar o triângulo
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);

      osc.disconnect(gain);
      osc.connect(filter);
      filter.connect(gain);

      osc.start(now);
      osc.stop(now + 0.16);
    } else {
      // Preset 2: O Ploc Cristalino Agudo (High Specular Pop)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(1150 * jitter, now + 0.03);
      osc.frequency.exponentialRampToValueAtTime(80 * jitter, now + 0.08);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.start(now);
      osc.stop(now + 0.1);
    }

    setTimeout(() => {
      osc.disconnect();
      gain.disconnect();
    }, 250);
  } catch (e) {
    // Falha silenciosa
  }
};

interface FloatingBubbleProps {
  concept: BubbleConcept;
  isFirstPageLoad?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
}

function FloatingBubble({ concept, isFirstPageLoad = false }: FloatingBubbleProps) {
  const [isPopped, setIsPopped] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [key, setKey] = useState(0);
  const [isFirstRun, setIsFirstRun] = useState(true);

  // Referência física da bolha para detecção de colisão 2D em tempo real
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Referência para armazenar o timeout de respawn e evitar leaks de memória
  const respawnTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Garante a limpeza de qualquer temporizador ativo ao desmontar a bolha
  useEffect(() => {
    return () => {
      if (respawnTimeoutRef.current) {
        clearTimeout(respawnTimeoutRef.current);
      }
    };
  }, []);

  // Guarda de reinício e delay síncrono para fluxo eterno ininterrupto
  const hasRestarted = useRef(false);
  const currentDelay = 0; // Bolhas iniciam imediatamente para dinâmica perfeita e sem pausas

  // Reseta a guarda de disparo a cada reinício de chave
  useEffect(() => {
    hasRestarted.current = false;
  }, [key]);

  // Detector de Colisão 2D em tempo real em pixels (Bate no Ploc -> ESTOURA IMEDIATAMENTE!)
  useEffect(() => {
    if (concept.zIndex !== 20 || concept.noCollision || isPopped) return;

    let active = true;
    const checkCollision = () => {
      if (!active) return;

      const bubbleEl = bubbleRef.current;
      const plocEl = document.getElementById('ploc-singleton-mount');

      if (bubbleEl && plocEl) {
        const bubbleRect = bubbleEl.getBoundingClientRect();
        const plocRect = plocEl.getBoundingClientRect();

        // Posição central real de cada elemento
        const plocCenterX = plocRect.left + plocRect.width / 2;
        const plocCenterY = plocRect.top + plocRect.height / 2;

        const bCenterX = bubbleRect.left + bubbleRect.width / 2;
        const bCenterY = bubbleRect.top + bubbleRect.height / 2;

        // Distância euclidiana entre os dois centros
        const dx = bCenterX - plocCenterX;
        const dy = bCenterY - plocCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Raio de colisão combinando Ploc (diâmetro 120px -> raio 60px) + Bolha (raio concept.size / 2)
        // Aplicamos uma pequena margem interna de 8px para um toque orgânico perfeito
        const collisionRadius = 56 + concept.size / 2;

        if (distance < collisionRadius) {
          // COLISÃO DETECTADA! A bolha "ploca" imediatamente!
          setIsPopped(true);
          playPlocSound();
          
          // Notifica o Ploc para que ele reaja à colisão e fique incomodado/molhado!
          blackboardEventBus.emit(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, {
            word: concept.word,
            collided: true
          });

          active = false;
          return;
        }
      }

      if (active) {
        requestAnimationFrame(checkCollision);
      }
    };

    // Inicia a detecção física imediatamente
    requestAnimationFrame(checkCollision);

    return () => {
      active = false;
    };
  }, [key, isPopped, concept.size, concept.zIndex]);

  // Estilos de cores vibrantes, porém extremamente suaves e translúcidas para evitar poluição visual
  const themeStyles = {
    blue: {
      bg: 'rgba(56, 189, 248, 0.04)',
      border: 'rgba(56, 189, 248, 0.12)',
      text: 'rgba(56, 189, 248, 0.35)',
      shadow: '0 4px 16px rgba(56, 189, 248, 0.02)',
      particle: '#38bdf8'
    },
    emerald: {
      bg: 'rgba(16, 185, 129, 0.04)',
      border: 'rgba(16, 185, 129, 0.12)',
      text: 'rgba(52, 211, 153, 0.35)',
      shadow: '0 4px 16px rgba(16, 185, 129, 0.02)',
      particle: '#10b981'
    },
    gold: {
      bg: 'rgba(251, 191, 36, 0.04)',
      border: 'rgba(251, 191, 36, 0.12)',
      text: 'rgba(251, 191, 36, 0.35)',
      shadow: '0 4px 16px rgba(251, 191, 36, 0.02)',
      particle: '#fbbf24'
    },
    violet: {
      bg: 'rgba(139, 92, 246, 0.04)',
      border: 'rgba(139, 92, 246, 0.12)',
      text: 'rgba(167, 139, 250, 0.35)',
      shadow: '0 4px 16px rgba(139, 92, 246, 0.02)',
      particle: '#8b5cf6'
    },
    dark: {
      bg: 'rgba(0, 0, 0, 0.45)',
      border: 'rgba(255, 255, 255, 0.03)',
      text: 'rgba(255, 255, 255, 0.15)', // Silhueta nítida mas extremamente discreta
      shadow: 'none',
      particle: 'rgba(0, 0, 0, 0.5)'
    }
  }[concept.theme];

  // Gera gotículas lentas ao estourar
  useEffect(() => {
    if (isPopped) {
      const count = 10;
      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (i * 2 * Math.PI) / count + (Math.random() - 0.5) * 0.3;
        const speed = 45 + Math.random() * 45;
        newParticles.push({
          id: i,
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
          size: 3 + Math.random() * 3
        });
      }
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isPopped]);

  // Fator de drift horizontal em pixels para trajetórias diagonais suaves
  const drift = concept.driftX || 0;

  return (
    <motion.div
      key={key}
      ref={bubbleRef}
      initial={{ y: '100vh', x: 0 }}
      animate={{
        y: '-10vh',
        // Interpolação numérica pura: mescla a diagonal suave com a oscilação sinuosa local
        x: [
          0,
          drift * 0.25 + 15,
          drift * 0.5 - 15,
          drift * 0.75 + 10,
          drift
        ]
      }}
      exit={{
        opacity: 0,
        scale: 0.5,
        filter: 'blur(8px)',
        transition: { duration: 0.8, ease: 'easeInOut' }
      }}
      onAnimationComplete={() => {
        // Reinicia a chave através da guarda única garantindo exatamente 1 disparo por ciclo
        if (!hasRestarted.current && !isPopped) {
          hasRestarted.current = true;
          setIsFirstRun(false);
          setKey((prev) => prev + 1);
        }
      }}
      transition={{
        y: { duration: concept.duration, ease: 'linear', delay: 0 },
        x: { duration: concept.duration, ease: 'easeInOut', delay: 0 }
      }}
      onTap={() => {
        if (!isPopped) {
          hasUserInteracted = true;
          setIsPopped(true);
          playPlocSound();
          
          blackboardEventBus.emit(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, {
            word: concept.word,
            poppedByUser: true
          });
        }
      }}
      onMouseDown={() => {
        if (!isPopped) {
          hasUserInteracted = true;
          setIsPopped(true);
          playPlocSound();
          
          blackboardEventBus.emit(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, {
            word: concept.word,
            poppedByUser: true
          });
        }
      }}
      onTouchStart={() => {
        if (!isPopped) {
          hasUserInteracted = true;
          setIsPopped(true);
          playPlocSound();
          
          blackboardEventBus.emit(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, {
            word: concept.word,
            poppedByUser: true
          });
        }
      }}
      style={{
        left: concept.left,
        position: 'absolute',
        width: `${concept.size}px`,
        height: `${concept.size}px`,
        pointerEvents: isPopped ? 'none' : 'auto',
        cursor: 'pointer',
        zIndex: concept.zIndex,
        willChange: 'transform'
      }}
    >
      {/* ── 1. Gotículas de Estouro ── */}
      {isPopped && particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: 0.1
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: themeStyles.particle,
            boxShadow: `0 0 6px ${themeStyles.particle}`,
            pointerEvents: 'none',
            zIndex: p.size + 10
          }}
        />
      ))}

      {/* ── 2. Corpo Principal (Com Textura de Bolha Nítida e Deformação Sincronizada) ── */}
      <AnimatePresence
        onExitComplete={() => {
          // Quando as bolhas que colidem no Ploc explodem, queremos diminuir drasticamente sua frequência de nascimento.
          // Em vez de renascer imediatamente, damos uma pausa silenciosa e relaxante de 32 segundos!
          // Isso traz paz ao visual do site e torna as explosões um evento mais especial e equilibrado.
          // Bolhas menores de fundo (Z-Index 5) ou gigantes da frente (Z-Index 25) podem continuar renascendo normalmente.
          const isCollidingBubble = concept.zIndex === 20;
          const respawnDelay = isCollidingBubble ? 20000 : 0;

          if (respawnDelay > 0) {
            respawnTimeoutRef.current = setTimeout(() => {
              setIsPopped(false);
              setIsFirstRun(false);
              setKey((prev) => prev + 1);
            }, respawnDelay);
          } else {
            setIsPopped(false);
            setIsFirstRun(false);
            setKey((prev) => prev + 1);
          }
        }}
      >
        {!isPopped && (
          <motion.div
            key={`inner-${key}`}
            initial={{ scale: 0.8 }}
            animate={{
              borderRadius: [
                '40% 60% 40% 60% / 60% 40% 60% 40%',
                '60% 40% 60% 40% / 40% 60% 40% 60%',
                '45% 55% 48% 52% / 52% 48% 55% 45%',
                '55% 45% 52% 48% / 48% 52% 45% 55%',
                '50% 50% 50% 50%'
              ]
            }}
            exit={{
              scale: [1, 1.25, 0],
              opacity: 0,
              filter: 'blur(5px)',
              transition: { duration: 0.45, ease: 'easeOut' }
            }}
            transition={{
              borderRadius: { duration: 10, repeat: Infinity, ease: 'easeInOut' }
            }}
            style={{
              width: '100%',
              height: '100%',
              // Copia exata do efeito gel líquido do Ploc para criar lentes de lupa perfeitas!
              background: themeStyles.bg,
              border: concept.theme === 'dark' ? 'none' : '1px solid rgba(255, 255, 255, 0.18)', // Borda reflexiva branca muito sutil e discreta
              // Brilho especular interno extremamente suave para não poluir
              boxShadow: concept.theme === 'dark' ? 'none' : `
                inset 0 0 12px rgba(255, 255, 255, 0.08),
                ${themeStyles.shadow}
              `,
              backdropFilter: concept.theme === 'dark' ? 'none' : 'blur(8px)', // Efeito lupa translúcido idêntico ao Ploc!
              WebkitBackdropFilter: concept.theme === 'dark' ? 'none' : 'blur(8px)',
              willChange: 'filter, transform',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {concept.theme !== 'dark' && (
              /* Reflexo Especular Curvo (Suave e discreto) */
              <div
                style={{
                  position: 'absolute',
                  top: '8%',
                  left: '8%',
                  width: '32%',
                  height: '32%',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 80%)',
                  filter: 'blur(1px)',
                  pointerEvents: 'none'
                }}
              />
            )}

            {concept.theme !== 'dark' && (
              <motion.span
                animate={{
                  y: [0, 3, -3, 0],
                  x: [0, -1, 1, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{
                  color: themeStyles.text,
                  fontSize: `${concept.size * 0.13}px`,
                  fontWeight: 900,
                  fontFamily: 'Outfit, sans-serif',
                  letterSpacing: '1px',
                  textAlign: 'center',
                  userSelect: 'none',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  pointerEvents: 'none',
                  zIndex: 2
                }}
              >
                {concept.word}
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function BubblePhrases() {
  const [isMounted, setIsMounted] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [density, setDensity] = useState<'low' | 'medium' | 'high'>('low');
  const [isFirstPageLoad, setIsFirstPageLoad] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    // Após a página ser montada e as bolhas iniciais serem exibidas, desativamos
    // o carregamento instantâneo. Qualquer bolha adicionada depois nascerá obrigatoriamente do rodapé (110vh).
    const timeout = setTimeout(() => {
      setIsFirstPageLoad(false);
    }, 1500);

    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % CHALLENGE_PHRASES.length);
    }, 60000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  // Lógica dinâmica de empacotamento de bolhas de acordo com o estágio de Densidade
  const getActiveConcepts = (): BubbleConcept[] => {
    const base = BASE_CONCEPTS.map((c, idx) => ({
      ...c,
      id: `base-${idx}`,
      theme: c.theme as 'blue' | 'emerald' | 'gold' | 'violet'
    })) as BubbleConcept[];

    if (density === 'low') return base;

    // Nível Médio adiciona 8 novas bolhas mais abundantes e velozes (durabilidade entre 14s e 22s)
    const medium: BubbleConcept[] = [
      { id: 'med-0', word: 'FOCO', left: '4%', size: 22, duration: 22, delay: 0, theme: 'dark', maxOpacity: 0.18, zIndex: 4, driftX: 80, initialY: '65vh' },
      { id: 'med-2', word: 'PENSE', left: '38%', size: 58, duration: 18, delay: 0, theme: 'gold', maxOpacity: 0.58, zIndex: 18, driftX: -80, noCollision: true, initialY: '30vh' },
      { id: 'med-4', word: 'VIVA', left: '54%', size: 64, duration: 16, delay: 0, theme: 'emerald', maxOpacity: 0.72, zIndex: 20, driftX: -60, initialY: '45vh' },
      { id: 'med-7', word: 'SORRIA', left: '94%', size: 25, duration: 20, delay: 0, theme: 'dark', maxOpacity: 0.18, zIndex: 12, driftX: -110, initialY: '80vh' },
      { id: 'med-8', word: 'PLOC', left: '48%', size: 60, duration: 15, delay: 0, theme: 'blue', maxOpacity: 0.58, zIndex: 20, driftX: 70, initialY: '50vh' },
      { id: 'med-9', word: 'VAI', left: '18%', size: 52, duration: 19, delay: 0, theme: 'violet', maxOpacity: 0.58, zIndex: 18, driftX: -70, noCollision: true, initialY: '15vh' },
      { id: 'med-10', word: 'AGORA', left: '82%', size: 62, duration: 17, delay: 0, theme: 'gold', maxOpacity: 0.58, zIndex: 18, driftX: 90, noCollision: true, initialY: '70vh' },
      { id: 'med-11', word: 'FORÇA', left: '28%', size: 70, duration: 14, delay: 0, theme: 'emerald', maxOpacity: 0.72, zIndex: 20, driftX: -50, initialY: '35vh' }
    ];

    if (density === 'medium') return [...base, ...medium];

    // Nível Alto (Tempestade Vibrante) adiciona mais 8 bolhas ultrarrápidas e densas (durações entre 10s e 15s)
    const high: BubbleConcept[] = [
      ...medium,
      { id: 'high-0', word: 'AME', left: '2%', size: 28, duration: 15, delay: 0, theme: 'dark', maxOpacity: 0.18, zIndex: 4, driftX: 110, initialY: '15vh' },
      { id: 'high-1', word: 'PLOC', left: 'calc(50% - 60px)', size: 68, duration: 12, delay: 0, theme: 'blue', maxOpacity: 0.58, zIndex: 18, driftX: -110, noCollision: true, initialY: '50vh' },
      { id: 'high-2', word: 'AGORA', left: 'calc(50% + 60px)', size: 65, duration: 13, delay: 0, theme: 'gold', maxOpacity: 0.58, zIndex: 18, driftX: 110, noCollision: true, initialY: '25vh' },
      { id: 'high-3', word: 'FORÇA', left: '16%', size: 75, duration: 11, delay: 0, theme: 'emerald', maxOpacity: 0.72, zIndex: 20, driftX: 140, initialY: '85vh' },
      { id: 'high-6', word: 'AÇÃO', left: '84%', size: 120, duration: 10, delay: 0, theme: 'emerald', maxOpacity: 0.75, zIndex: 25, driftX: -140, initialY: '35vh' },
      { id: 'high-9', word: 'EVOLUA', left: '90%', size: 24, duration: 14, delay: 0, theme: 'dark', maxOpacity: 0.18, zIndex: 12, driftX: -160, initialY: '70vh' },
      { id: 'high-10', word: 'CORRA', left: '60%', size: 112, duration: 9, delay: 0, theme: 'emerald', maxOpacity: 0.75, zIndex: 25, driftX: 100, initialY: '80vh' },
      { id: 'high-11', word: 'VIVA', left: '32%', size: 74, duration: 11, delay: 0, theme: 'emerald', maxOpacity: 0.72, zIndex: 20, driftX: -120, initialY: '60vh' }
    ];

    return [...base, ...high];
  };

  if (!isMounted) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* ── 1. O Título Central Dinâmico (Matematicamente Centrado no zIndex: 15 e renderizado PRIMEIRO no DOM) ── */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(50% + 75px)',
          left: 0,
          right: 0,
          width: '100%',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 15 // Sanduíche 3D: À frente das bolhas abissais (4) e de trás da frase (12), mas sob bolhas sob o ploc (18), colisão (20) e frente (25)
        }}
      >
        <AnimatePresence mode="wait">
          <motion.h1
            key={phraseIndex}
            initial={{ opacity: 0, y: 30, filter: 'blur(15px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -30, filter: 'blur(15px)' }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2.2rem, 6.5vw, 4.2rem)',
              margin: 0,
              fontWeight: 900,
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '-2px',
              lineHeight: 1.0,
              textTransform: 'uppercase',
              maxWidth: '850px',
              padding: '0 24px',
              display: 'inline-block',
              textShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}
          >
            {(() => {
              const GRADIENT_MAP = {
                blue: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                emerald: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
                gold: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                violet: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)'
              };

              const phrase = CHALLENGE_PHRASES[phraseIndex];
              if (!phrase) return null;

              const parts = phrase.text.split(phrase.highlight);
              if (parts.length > 1) {
                return (
                  <>
                    <span>{parts[0]}</span>
                    <span
                      style={{
                        background: GRADIENT_MAP[phrase.color],
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block'
                      }}
                    >
                      {phrase.highlight}
                    </span>
                    <span>{parts[1]}</span>
                  </>
                );
              }
              return <span>{phrase.text}</span>;
            })()}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* ── 2. Bolhas Flutuantes Dinâmicas (Renderizadas por SEGUNDO no DOM para garantia absoluta de sobreposição) ── */}
      <AnimatePresence>
        {getActiveConcepts().map((concept) => (
          <FloatingBubble key={concept.id} concept={concept} isFirstPageLoad={isFirstPageLoad} />
        ))}
      </AnimatePresence>

      {/* ── 3. Botão Maroto de Densidade de Bolhas (Cápsula de Bolha Fixa & Líquida) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          pointerEvents: 'auto',
          zIndex: 100
        }}
      >
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{
            scale: 0.92,
            borderRadius: '42% 58% 45% 55% / 55% 45% 58% 42%' // Deformação líquida sutil ao pressionar!
          }}
          onClick={() => {
            setDensity((prev) => {
              if (prev === 'low') return 'medium';
              if (prev === 'medium') return 'high';
              return 'low';
            });
            playPlocSound(); // Som maroto de estouro como feedback!
          }}
          title="Ajustar Densidade de Bolhas"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            // Volume 3D: Gradiente radial de vidro ultra-premium
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 60%, rgba(255, 255, 255, 0.01) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: `
              inset 2px 2px 5px rgba(255, 255, 255, 0.25),
              inset -2px -2px 5px rgba(0, 0, 0, 0.08),
              0 8px 24px rgba(0, 0, 0, 0.25)
            `,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            outline: 'none',
            overflow: 'hidden',
            padding: 0,
            transition: 'border-color 0.3s ease'
          }}
        >
          {/* Brilho Especular Curvo Interno (Garante a textura física de bolha de sabão) */}
          <div
            style={{
              position: 'absolute',
              top: '8%',
              left: '8%',
              width: '32%',
              height: '32%',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 80%)',
              filter: 'blur(1px)',
              pointerEvents: 'none'
            }}
          />

          {/* Ícones Vetoriais Monocromáticos com transição suave e deformação líquida contínua */}
          <AnimatePresence mode="wait">
            <motion.div
              key={density}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                // Deformação líquida senoidal contínua (respiração e wobbling orgânico!)
                scaleX: [1, 1.06, 0.94, 1.04, 0.96, 1],
                scaleY: [1, 0.94, 1.06, 0.96, 1.04, 1],
                rotate: [0, 4, -4, 3, -3, 0],
                x: [0, 1.5, -1.5, 1, -1, 0],
                y: [0, -1.5, 1.5, -1, 1, 0]
              }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{
                // Transição do surgimento (mount)
                duration: 0.25,
                ease: 'easeOut',
                // Loops contínuos assíncronos desregulados para oscilação natural eterna!
                scaleX: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
                scaleY: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
                x: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.85)',
                zIndex: 2,
                pointerEvents: 'none'
              }}
            >
              {density === 'low' && (
                // 1 Bolha Minimalista
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8" />
                  <path d="M10 8c.5-.5 1-.8 1.8-.8" strokeWidth="2" opacity="0.6" />
                </svg>
              )}

              {density === 'medium' && (
                // 2 Bolhas Minimalistas Sobrepostas
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="14" r="6" />
                  <circle cx="16" cy="10" r="6" />
                  <path d="M6 11c.4-.4.8-.6 1.4-.6M14 7c.4-.4.8-.6 1.4-.6" strokeWidth="1.8" opacity="0.6" />
                </svg>
              )}

              {density === 'high' && (
                // 3 Bolhas Clusterizadas
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="7" cy="15" r="5" />
                  <circle cx="17" cy="15" r="5" />
                  <circle cx="12" cy="8" r="5" />
                  <path d="M5 12.5c.3-.3.6-.5 1-.5M15 12.5c.3-.3.6-.5 1-.5M10.5 5.5c.3-.3.6-.5 1-.5" strokeWidth="1.6" opacity="0.6" />
                </svg>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
