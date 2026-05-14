'use client';

/**
 * PlocAvatar.tsx — Mascote interativo do Ploc
 * Estados: sleeping | active | stressing | pissed
 * Draggável por toda a tela. Balão de fala. Minijogo de raiva.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

type PlocMode = 'sleeping' | 'active' | 'stressing' | 'pissed';

interface PlocState {
  mode: PlocMode;
  angerLevel: number;
  angerClicks: number;
  speech: string | null;
}

// ── Hook de posição draggável ─────────────────────────────────────────────
function useDraggable(initialPos: { x: number; y: number }) {
  const [pos, setPos] = useState(initialPos);
  const [dragging, setDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const posRef = useRef(pos);
  posRef.current = pos;

  // Adjust position after client mount
  const setInitialPos = useCallback((x: number, y: number) => {
    setPos({ x, y });
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    setDragging(true);
    offsetRef.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    setPos({
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y,
    });
  }, [dragging]);

  const onPointerUp = useCallback(() => setDragging(false), []);

  return { pos, setInitialPos, dragging, onPointerDown, onPointerMove, onPointerUp };
}

// ── Componente Principal ──────────────────────────────────────────────────
export function PlocAvatar() {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const isHidden = pathname === '/settings';

  // Estado persistido
  const [plocState, setPlocState] = useState<PlocState>({
    mode: 'sleeping',
    angerLevel: 1,
    angerClicks: 0,
    speech: null,
  });

  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Posição inicial: começa no centro, ajusta no cliente
  const { pos, setInitialPos, dragging, onPointerDown, onPointerMove, onPointerUp } = useDraggable({ x: 0, y: 0 });

  // Lê localStorage e posição inicial no cliente
  useEffect(() => {
    setPlocState(prev => ({
      ...prev,
      angerLevel: parseInt(localStorage.getItem('ploc_anger_level') || '1'),
      angerClicks: parseInt(localStorage.getItem('ploc_anger_clicks') || '0'),
    }));
    // Define posição real após montar no cliente
    const SIZE = isLanding ? 120 : 80;
    if (isLanding) {
      setInitialPos(window.innerWidth / 2 - SIZE / 2, window.innerHeight / 2 - SIZE / 2);
    } else {
      setInitialPos(window.innerWidth - SIZE - 20, window.innerHeight / 2 - SIZE / 2);
    }
  }, [isLanding, setInitialPos]);

  // Fórmula de dificuldade do minijogo
  const getClicksNeeded = (lvl: number) => Math.floor(Math.pow(lvl, 3) * 15);

  const say = useCallback((text: string, duration = 3000) => {
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    setPlocState(prev => ({ ...prev, speech: text }));
    speechTimeoutRef.current = setTimeout(() => {
      setPlocState(prev => ({ ...prev, speech: null }));
    }, duration);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (dragging) return;
    e.stopPropagation();

    setPlocState(prev => {
      const newClicks = prev.angerClicks + 1;
      const needed = getClicksNeeded(prev.angerLevel);

      localStorage.setItem('ploc_anger_clicks', newClicks.toString());

      if (newClicks >= needed) {
        const newLevel = Math.min(prev.angerLevel + 1, 10);
        localStorage.setItem('ploc_anger_level', newLevel.toString());
        localStorage.setItem('ploc_anger_clicks', '0');
        say('AGORA VOCÊ ME IRRITOU!', 5000);
        return { ...prev, mode: 'pissed', angerLevel: newLevel, angerClicks: 0 };
      }

      const progress = newClicks / needed;
      if (progress > 0.5) {
        return { ...prev, mode: 'stressing', angerClicks: newClicks };
      }

      if (prev.mode === 'sleeping') {
        say('Me chamou?');
      }
      return { ...prev, mode: 'active', angerClicks: newClicks };
    });
  }, [dragging, say]);

  // Clique fora: volta a dormir
  useEffect(() => {
    const handleOutside = () => {
      setPlocState(prev => {
        if (prev.mode !== 'sleeping') {
          return { ...prev, mode: 'sleeping', speech: null };
        }
        return prev;
      });
    };
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  if (isHidden) return null;

  // ── Derivados visuais ─────────────────────────────────────────────────
  const { mode, speech } = plocState;
  const isSleeping  = mode === 'sleeping';
  const isPissed    = mode === 'pissed';
  const isStressing = mode === 'stressing';

  const SIZE = isLanding ? 120 : 80;

  // Cor base do corpo — fica vermelho ao stressar
  const progress = plocState.angerClicks / getClicksNeeded(plocState.angerLevel);
  const r = Math.floor(56  + (isStressing ? progress * 183 : 0));
  const g = Math.floor(189 - (isStressing ? progress * 121 : 0));
  const b = Math.floor(248 - (isStressing ? progress * 180 : 0));
  const bodyColor = isPissed
    ? 'radial-gradient(circle at 35% 35%, rgba(239,68,68,0.85) 0%, rgba(220,38,38,0.95) 100%)'
    : `radial-gradient(circle at 35% 35%, rgba(${r},${g},${b},0.75) 0%, rgba(14,165,233,0.85) 60%, rgba(3,105,161,0.95) 100%)`;

  const opacity = isSleeping ? 0.4 : 0.85;

  return (
    <div
      id="ploc-singleton-mount"
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: SIZE,
        height: SIZE,
        zIndex: 999999,
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
        transition: dragging ? 'none' : 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        animation: (!dragging && !isPissed) ? 'plocFloating 3s ease-in-out infinite' : 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={handleClick}
    >
      {/* Balão de fala */}
      {speech && (
        <div style={{
          position: 'absolute',
          bottom: '110%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid #38bdf8',
          padding: '0.6rem 1rem',
          borderRadius: '16px',
          fontSize: '0.75rem',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          color: '#fff',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 10000,
          pointerEvents: 'none',
          animation: 'fadeIn 0.3s ease',
          fontFamily: "'Inter', sans-serif",
        }}>
          {speech}
          {/* Ponteiro */}
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid #38bdf8',
          }} />
        </div>
      )}

      {/* Corpo do Ploc */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50% 50% 50% 50% / 70% 70% 40% 40%',
          background: bodyColor,
          border: '1px solid rgba(255,255,255,0.2)',
          overflow: 'hidden',
          opacity,
          transition: 'opacity 0.5s ease, background 0.5s ease',
          boxShadow: isPissed
            ? '0 0 30px rgba(239,68,68,0.6)'
            : isStressing
              ? `0 0 20px rgba(${r},${g},${b},0.5)`
              : '0 10px 40px rgba(56,189,248,0.3)',
          animation: isPissed ? 'plocShake 0.1s infinite' : undefined,
        }}
      >
        {/* Olhos */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10%', width: '100%', height: '100%' }}>
          {[0, 1].map(i => (
            <div
              key={i}
              style={{
                width: '12%',
                height: isSleeping ? '4%' : '22%',
                background: '#1b234a',
                borderRadius: isSleeping ? '10px' : '80% / 30%',
                transition: 'all 0.3s ease',
                animation: (!isSleeping && !isPissed) ? 'plocBlink 4s infinite' : undefined,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Língua (sleeping) */}
        {isSleeping && (
          <div style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '20%',
            height: '12%',
            background: '#fb7185',
            borderRadius: '0 0 50% 50%',
          }} />
        )}
      </div>

      {/* Zzz particles */}
      {isSleeping && <ZzzParticles />}

      <style>{`
        @keyframes plocBlink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes plocZMove {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translate(30px, -80px) scale(1.5); opacity: 0; }
        }
        @keyframes plocShake {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
      `}</style>
    </div>
  );
}

// ── Partículas Zzz ────────────────────────────────────────────────────────
interface ZParticle { id: number; size: number; }

function ZzzParticles() {
  const [zs, setZs] = useState<ZParticle[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const particle: ZParticle = { id: Date.now(), size: Math.floor(Math.random() * 10 + 12) };
      setZs(prev => [...prev.slice(-5), particle]);
      setTimeout(() => setZs(prev => prev.filter(z => z.id !== particle.id)), 2500);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {zs.map(({ id, size }) => (
        <span
          key={id}
          style={{
            position: 'absolute',
            right: '5px',
            top: '5px',
            color: 'rgba(56,189,248,0.6)',
            fontWeight: 800,
            fontSize: `${size}px`,
            animation: 'plocZMove 2.5s ease-out forwards',
            pointerEvents: 'none',
            fontFamily: 'sans-serif',
          }}
        >
          Z
        </span>
      ))}
    </>
  );
}
