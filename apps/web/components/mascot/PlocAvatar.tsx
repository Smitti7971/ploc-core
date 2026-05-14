import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { chatService } from '@/modules/chat/services/chatService';

type PlocMode = 'sleeping' | 'active' | 'stressing' | 'pissed';

interface PlocState {
  mode: PlocMode;
  angerLevel: number;
  angerClicks: number;
  isHurt: boolean;
}

interface PlocAvatarProps {
  externalOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// ── Componente Principal ──────────────────────────────────────────────────
export default function PlocAvatar({ externalOpen, onOpenChange }: PlocAvatarProps = {}) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const isHidden = pathname === '/settings';

  const [isInputOpen, setIsInputOpen] = useState(false);
  
  // Sincroniza estado local com prop externa se fornecida
  const effectiveOpen = externalOpen !== undefined ? externalOpen : isInputOpen;
  const setEffectiveOpen = (val: boolean) => {
    if (onOpenChange) onOpenChange(val);
    else setIsInputOpen(val);
  };

  const [isMounted, setIsMounted] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const { user } = useAuthStore();

  // Estado persistido
  const [plocState, setPlocState] = useState<PlocState>({
    mode: 'sleeping',
    angerLevel: 0,
    angerClicks: 0,
    isHurt: false,
  });

  const triggerHurt = () => {
    setPlocState(prev => ({ ...prev, isHurt: true }));
    speak("AII! Essa doeu! 🤕", 2000);
    setTimeout(() => {
      setPlocState(prev => ({ ...prev, isHurt: false }));
    }, 1500);
  };

  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Lê localStorage no cliente
  useEffect(() => {
    setPlocState(prev => ({
      ...prev,
      angerLevel: parseInt(localStorage.getItem('ploc_anger_level') || '1'),
      angerClicks: parseInt(localStorage.getItem('ploc_anger_clicks') || '0'),
    }));
  }, []);

  // Fórmula de dificuldade do minijogo
  const getClicksNeeded = (lvl: number) => Math.floor(Math.pow(lvl, 3) * 15);

  const speak = (text: string, duration: number = 4000) => {
    // Balão removido conforme solicitado
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    if (!user) {
      speak("Para eu te ajudar com inteligência total, você precisa entrar primeiro! 😉");
      setInputValue('');
      setEffectiveOpen(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await chatService.sendMessage(inputValue, {
        isPissedOff: plocState.angerLevel >= 3
      });
      
      speak(res.message || "Entendido!");
      setInputValue('');
      setEffectiveOpen(false);
    } catch (err) {
      speak("Ops, me engasguei aqui. Pode repetir? 😅");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Se clicar dormindo, acorda
    if (plocState.mode === 'sleeping') {
      setPlocState(prev => ({ ...prev, mode: 'active' }));
      if (isLanding && !user) setEffectiveOpen(true); // Abre o mini-modal de auth na landing
      return;
    }

    // Se clicar ativo e na landing sem user, toggle o mini-modal
    if (isLanding && !user) {
      setEffectiveOpen(!effectiveOpen);
      return;
    }

    // Comportamento normal de chat se já logado
    setEffectiveOpen(!effectiveOpen);
    
    // Mini game de irritação
    setPlocState(prev => {
      const newClicks = prev.angerClicks + 1;
      const needed = getClicksNeeded(prev.angerLevel);

      localStorage.setItem('ploc_anger_clicks', newClicks.toString());

      if (newClicks >= needed) {
        const newLevel = Math.min(prev.angerLevel + 1, 10);
        localStorage.setItem('ploc_anger_level', newLevel.toString());
        localStorage.setItem('ploc_anger_clicks', '0');
        return { ...prev, mode: 'pissed', angerLevel: newLevel, angerClicks: 0 };
      }

      const progress = newClicks / needed;
      if (progress > 0.5) {
        return { ...prev, mode: 'stressing', angerClicks: newClicks };
      }

      return { ...prev, mode: 'active', angerClicks: newClicks };
    });
  };

  const containerRef = useRef<HTMLDivElement>(null);

  // Clique fora: volta a dormir apenas se não for no Ploc
  useEffect(() => {
    const handleOutside = (e: PointerEvent) => {
      // Se clicou fora do container do Ploc
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPlocState(prev => {
          if (prev.mode !== 'sleeping') {
            return { ...prev, mode: 'sleeping' };
          }
          return prev;
        });
        setEffectiveOpen(false);
      }
    };
    
    // Usamos pointerdown para mobile/desktop e 'true' para capturar o evento na descida
    document.addEventListener('pointerdown', handleOutside, true);
    return () => document.removeEventListener('pointerdown', handleOutside, true);
  }, []);

  if (isHidden) return null;

  // ── Derivados visuais ─────────────────────────────────────────────────
  const { mode } = plocState;
  const isSleeping  = mode === 'sleeping';
  const isPissed    = mode === 'pissed';
  const isStressing = mode === 'stressing';

  const SIZE = isLanding ? 120 : 80;

  // Cor base do corpo — fica vermelho ao stressar
  const progress = plocState.angerClicks / getClicksNeeded(plocState.angerLevel);
  const r = Math.floor(56  + (isStressing ? progress * 183 : 0));
  const g = Math.floor(189 - (isStressing ? progress * 121 : 0));
  const b = Math.floor(248 - (isStressing ? progress * 180 : 0));
  
  const bodyColor = (isPissed || plocState.isHurt)
    ? 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)' 
    : isStressing
      ? `rgba(${r}, ${g}, ${b}, 0.6)`
      : `rgba(${r}, ${g}, ${b}, 0.35)`;

  const limbColor = isSleeping ? '#0f172a' : (isPissed || plocState.isHurt ? 'rgba(239, 68, 68, 0.5)' : 'rgba(56, 189, 248, 0.4)');
  const limbShadow = isSleeping ? 'none' : `0 0 3px ${isPissed || plocState.isHurt ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.2)'}`; 

  const opacity = isSleeping ? 0.6 : 1;

  if (!isMounted) return null;

  return (
    <motion.div
      ref={containerRef}
      id="ploc-singleton-mount"
      drag
      dragConstraints={typeof window !== 'undefined' ? (
        isLanding ? {
          left: -window.innerWidth / 2 + (pathname === '/dashboard' ? 60 : 90),
          right: window.innerWidth / 2 - (pathname === '/dashboard' ? 60 : 90),
          top: -window.innerHeight / 2 + (pathname === '/dashboard' ? 60 : 90),
          bottom: window.innerHeight / 2 - (pathname === '/dashboard' ? 60 : 90),
        } : {
          left: -window.innerWidth + 100,
          right: 30,
          top: -window.innerHeight + 150,
          bottom: 30,
        }
      ) : false}
      dragElastic={0.2}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      onDragEnd={(e, info) => {
        const threshold = 600; // Um pouco mais difícil de machucar
        if (Math.abs(info.velocity.x) > threshold || Math.abs(info.velocity.y) > threshold) {
          // Pequeno atraso para o grito coincidir com a batida na borda (inércia)
          setTimeout(() => {
            triggerHurt();
          }, 150); 
        }
      }}
      whileDrag={{ 
        scale: 1.05, // Aumento sutil no container
      }}
      initial={{ 
        x: 0, 
        y: 0, 
        opacity: 0,
        scale: 0.5 
      }}
      animate={{ 
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 }
      }}
      style={{
        position: 'relative', // Agora é relativo ao container que o AppShell/Blackboard define
        width: isLanding ? 120 : 80,
        height: isLanding ? 120 : 80,
        zIndex: 999999,
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none',
      }}
      onClick={handleClick}
    >
      {/* Camada Interna para Flutuar e Respirar (Separada do Drag) */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >

      {/* Corpo do Ploc (Gelatina) */}
      <motion.div
        className={isPissed ? 'ploc-body-shake' : ''}
        animate={{
          background: bodyColor,
          borderRadius: isPissed 
            ? ["48% 52% 50% 50% / 50% 50% 50% 50%", "52% 48% 50% 50% / 50% 50% 50% 50%", "48% 52% 50% 50% / 50% 50% 50% 50%"]
            : [
                "50% 50% 48% 52% / 55% 55% 45% 45%", 
                "54% 46% 52% 48% / 52% 56% 44% 48%", 
                "48% 52% 50% 50% / 55% 48% 52% 45%",
                "50% 50% 48% 52% / 55% 55% 45% 45%"
              ],
          scaleX: isSleeping ? 1.05 : 1,
          scaleY: isSleeping ? 0.95 : 1,
        }}
        whileDrag={{
          scaleX: 0.9, // Fica mais "fino"
          scaleY: 1.1, // Fica mais "alto/esticado"
          rotate: [0, 2, -2, 0],
        }}
        transition={{ 
          background: { duration: 0.5 },
          borderRadius: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          scaleX: { type: "spring", stiffness: 300, damping: 15 },
          scaleY: { type: "spring", stiffness: 300, damping: 15 }
        }}
        whileTap={{ scale: 0.9, rotate: [0, -2, 2, 0] }} // Vibra ao clicar
        style={{
          position: 'absolute',
          inset: 0,
          border: '1px solid rgba(255,255,255,0.4)',
          overflow: 'hidden',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          filter: isSleeping ? 'brightness(0.5) saturate(0.8)' : 'none',
          boxShadow: isPissed
            ? '0 0 40px rgba(239,68,68,0.8), inset 0 0 20px rgba(255,255,255,0.3)'
            : '0 10px 40px rgba(56,189,248,0.3), inset 0 0 15px rgba(255,255,255,0.2)',
        }}
      >
        {/* Bolhas de Ar Internas (Modo Estável) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {[1, 2, 3, 4, 5].map((b) => (
            <motion.div
              key={b}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.cos(b) * 15, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 5 + b,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: 'absolute',
                bottom: `${10 + b * 15}%`,
                left: `${15 + (b % 3) * 20}%`,
                width: `${6 + b * 2}px`,
                height: `${6 + b * 2}px`,
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 70%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
              }}
            />
          ))}
        </div>

        {/* Olhos */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15%', width: '100%', height: '100%', position: 'relative', zIndex: 2 }}>
          {[0, 1].map(i => (
            <div key={`eye-group-${i}`} style={{ position: 'relative', width: '12%', height: '20%', display: 'flex', alignItems: 'center' }}>
              {/* Sombrancelhas */}
              <motion.div
                animate={{
                  rotate: (plocState.isHurt || isPissed) ? (i === 0 ? 30 : -30) : 0,
                  y: (plocState.isHurt || isPissed) ? 1 : -4, // Sobe um pouco no repouso
                }}
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '-20%',
                  width: '140%',
                  height: '4px',
                  background: '#0f172a',
                  borderRadius: '2px',
                }}
              />
              {/* Olhos */}
              <motion.div
                className={(!isSleeping && !isPissed) ? 'ploc-eye-blink' : ''}
                animate={{
                  height: isSleeping ? '10%' : '100%', 
                  borderRadius: isSleeping ? '2px' : '50%',
                }}
                transition={{ duration: 0.2 }}
                style={{
                  width: '100%', 
                  height: '100%',
                  background: '#0f172a',
                }}
              />
            </div>
          ))}
        </div>


        {/* Brilho Superior (Efeito Poring 3D) */}
        <div style={{
          position: 'absolute',
          top: '12%',
          left: '18%',
          width: '25%',
          height: '18%',
          background: 'rgba(255,255,255,0.35)',
          borderRadius: '50%',
          filter: 'blur(3px)',
          transform: 'rotate(-25deg)',
        }} />
      </motion.div>

      {/* Membros estilo Palitinho (Doodle) */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {/* Braços */}
        {[-1, 1].map(side => (
          <motion.div
            key={`stick-arm-${side}`}
            animate={{ rotate: [side * 20, side * 40, side * 20] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              top: '50%',
              [side === -1 ? 'left' : 'right']: '-25%', // Mais longe
              width: '20px',
              height: '6px',
              background: limbColor,
              boxShadow: limbShadow,
              borderRadius: '3px',
              transformOrigin: side === -1 ? 'right center' : 'left center',
            }}
          >
            <div style={{
              position: 'absolute',
              [side === -1 ? 'left' : 'right']: '-8px',
              top: '-2px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: limbColor,
              boxShadow: limbShadow,
            }} />
          </motion.div>
        ))}

        {/* Perninhas Flutuantes (Assumindo o estilo desconectado) */}
        {[-1, 1].map(side => (
          <motion.div
            key={`stick-leg-${side}`}
            animate={{ rotate: [side * 10, side * -10, side * 10] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              bottom: '-25px', // Bem soltas embaixo
              [side === -1 ? 'left' : 'right']: '25%',
              width: '6px',
              height: '20px',
              background: limbColor,
              boxShadow: limbShadow,
              borderRadius: '3px',
              transformOrigin: 'top center',
            }}
          >
            <div style={{
              position: 'absolute',
              bottom: '-5px',
              left: '-2px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: limbColor,
              boxShadow: limbShadow,
            }} />
          </motion.div>
        ))}
      </div>
      {/* Limpeza de vestígios do Modal removido */}
      {isSleeping && <ZzzParticles />}
    </motion.div>
    </motion.div>
  );
}

// ── Partículas Zzz ────────────────────────────────────────────────────────
interface ZParticle { id: number; size: number; }

function ZzzParticles() {
  const [zs, setZs] = useState<ZParticle[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const particle: ZParticle = { 
        id: Date.now(), 
        size: Math.floor(Math.random() * 15 + 20) 
      };
      setZs(prev => [...prev.slice(-5), particle]);
      setTimeout(() => setZs(prev => prev.filter(z => z.id !== particle.id)), 2500);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'absolute', right: '10px', top: '-40px', width: '100px', height: '100px', pointerEvents: 'none' }}>
      {zs.map(({ id, size }, index) => (
        <motion.span
          key={id}
          initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0, 1, 0], 
            y: -100, 
            x: Math.sin(id) * 20,
            scale: 1.2
          }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          style={{
            position: 'absolute',
            color: index % 2 === 0 ? '#ffffff' : '#38bdf8', // Alterna entre branco e azul
            textShadow: '0 0 12px rgba(56,189,248,0.6)',
            fontWeight: 900,
            fontSize: `${size}px`,
            fontFamily: 'Outfit, sans-serif',
            display: 'inline-block',
          }}
        >
          Z
        </motion.span>
      ))}
    </div>
  );
}
