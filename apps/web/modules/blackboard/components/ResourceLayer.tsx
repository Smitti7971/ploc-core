import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { resourceEngine, ResourceBubbleData } from '../engine/resource-engine/ResourceEngine';
import { usePlocStateStore } from '../../mascot/store/plocStateStore';
import { blackboardEventBus } from '../events/eventBus';

const COLLISION_RADIUS = 60; // Distância para considerar que o PLOC encostou na bolha
const EVADE_RADIUS = 250; // Distância na qual a bolha começa a fugir do PLOC
const EVADE_SPEED = 12; // Velocidade de fuga da bolha
const MAX_BUBBLE_RADIUS = 200; // Limite máximo para a bolha fugir ou nascer (para não sair do mapa de 500x500 do Ploc)

// SVGs customizados para os recursos
const FoodSVG = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 drop-shadow-lg">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#ef4444" stroke="#b91c1c" />
    <path d="M12 2c0 3 2 5 2 5s-2 2-2 5" stroke="#f87171" strokeWidth="1.5" />
    <path d="M10.5 4.5c-1-1-3-1-3-1s0 2 1 3" stroke="#22c55e" strokeWidth="2" fill="#4ade80" />
  </svg>
);

const WaterSVG = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 drop-shadow-lg">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#3b82f6" stroke="#1d4ed8" />
    <path d="M12 11a4 4 0 0 0-4 4" stroke="#93c5fd" strokeWidth="1.5" />
  </svg>
);

const PillSVG = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 drop-shadow-lg">
    <rect x="2" y="9" width="20" height="6" rx="3" fill="#22c55e" stroke="#15803d" />
    <path d="M12 9v6" stroke="#15803d" strokeWidth="2" />
    <path d="M6 12h.01" stroke="#ffffff" strokeWidth="2" />
    <path d="M18 12h.01" stroke="#ffffff" strokeWidth="2" />
  </svg>
);

function ResourceBubble({ bubble }: { bubble: ResourceBubbleData }) {
  const eat = usePlocStateStore(state => state.eat);
  const store = usePlocStateStore(state => state.store);
  const [isPopping, setIsPopping] = useState(false);

  useEffect(() => {
    // Checagem de colisão e evasão com o PLOC enquanto ele é arrastado
    const handlePlocMove = (payload: { x: number, y: number }) => {
      if (isPopping) return;

      const dx = payload.x - bubble.x;
      const dy = payload.y - bubble.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // CABO DE GUERRA: Fuga da bolha
      if (distance < EVADE_RADIUS && distance > COLLISION_RADIUS) {
        // Move na direção oposta ao PLOC
        const moveX = -(dx / distance) * EVADE_SPEED;
        const moveY = -(dy / distance) * EVADE_SPEED;
        
        // Limita a fuga para não sair do limite onde o PLOC consegue ir
        const newX = bubble.x + moveX;
        const newY = bubble.y + moveY;
        const distFromCenter = Math.sqrt(newX * newX + newY * newY);
        
        // Se a bolha ainda estiver dentro do raio máximo, ela foge. 
        // Se bater no "canto" do limite, ela desliza ou para, permitindo o Ploc pegá-la.
        if (distFromCenter < MAX_BUBBLE_RADIUS) {
          resourceEngine.updateBubblePosition(bubble.id, newX, newY);
        }
      }

      if (distance <= COLLISION_RADIUS) {
        setIsPopping(true);
        // Colidiu! Come direto
        if (bubble.type === 'food' || bubble.type === 'water') {
          // Dispara evento visual para a boca mastigar e pros indicadores flutuantes
          blackboardEventBus.emit('PLOC_EAT', { bubbleId: bubble.id, type: bubble.type });
          eat({
            id: bubble.id,
            type: bubble.type,
            name: bubble.name,
            createdAt: bubble.createdAt,
            state: 'fresh'
          }, 'direct');
        } else {
          // Outros itens como medicina, entram na bolsa direto se encostar
          blackboardEventBus.emit('PLOC_STORE_ITEM');
          store({
            type: bubble.type,
            name: bubble.name
          });
        }

        setTimeout(() => {
          resourceEngine.removeBubble(bubble.id);
        }, 300); // tempo da animação de pop
      }
    };

    const unsubscribe = blackboardEventBus.subscribe('PLOC_DRAG_MOVE', handlePlocMove);
    return () => unsubscribe();
  }, [bubble, eat, store, isPopping]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPopping) return;
    setIsPopping(true);

    // Clicou, vai pra bolsa
    blackboardEventBus.emit('PLOC_STORE_ITEM');
    store({
      type: bubble.type,
      name: bubble.name
    });

    setTimeout(() => {
      resourceEngine.removeBubble(bubble.id);
    }, 300);
  };

  const getIcon = () => {
    switch (bubble.type) {
      case 'food': return <FoodSVG />;
      case 'water': return <WaterSVG />;
      case 'medicine': return <PillSVG />;
      default: return <FoodSVG />;
    }
  };

  // Animação de flutuação orgânica similar a bolha de Tabagismo
  const floatDurationY = 3 + Math.random() * 2;
  const floatDurationX = 5 + Math.random() * 2;

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: bubble.x,
        top: bubble.y,
        marginLeft: -25, // Reduzimos o tamanho total da div interativa também
        marginTop: -25,
        width: 50,
        height: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 50,
      }}
      onClick={handleClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={isPopping ? { scale: 1.8, opacity: 0 } : { 
        scale: 1, 
        opacity: 1,
        y: [0, -12, 0],
        x: [0, 8, 0, -8, 0]
      }}
      transition={{
        scale: isPopping ? { duration: 0.2 } : { type: "spring", stiffness: 150, damping: 12 },
        opacity: isPopping ? { duration: 0.2 } : { duration: 0.3 },
        y: { duration: floatDurationY, repeat: Infinity, ease: "easeInOut" },
        x: { duration: floatDurationX, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <div 
        className={`absolute inset-0 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.15)] border-2 ${bubble.type === 'medicine' ? 'border-emerald-500/50' : 'border-white/30'} overflow-hidden`}
      >
        <div className="w-full h-full bg-black/40 backdrop-blur-md" />
      </div>

      {/* Reflexo Especular (Efeito de Bolha) para ficar igual a de tabagismo */}
      <div 
        className="absolute top-[15%] left-[15%] w-[30%] h-[30%] rounded-full blur-[1px] z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 80%)'
        }} 
      />

      <div className="relative z-20 flex flex-col items-center justify-center scale-75">
        {getIcon()}
      </div>
    </motion.div>
  );
}

export function ResourceLayer() {
  const [bubbles, setBubbles] = useState<ResourceBubbleData[]>([]);

  useEffect(() => {
    setBubbles(resourceEngine.getBubbles());

    const unsubscribe = resourceEngine.subscribe(() => {
      setBubbles([...resourceEngine.getBubbles()]);
    });

    // Spawn aleatório de itens a cada 30 segundos
    const spawnInterval = setInterval(() => {
      const currentBubbles = resourceEngine.getBubbles();
      if (currentBubbles.length < 5) { // Limite de 5 itens na tela
        const types = ['food', 'water', 'medicine'] as const;
        const randomType = types[Math.floor(Math.random() * types.length)];
        const names = { food: 'Maçã', water: 'Água', medicine: 'Vitamina' };
        
        // Spawn em posição aleatória ao redor do centro (DENTRO do limite do Ploc)
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * MAX_BUBBLE_RADIUS; // Nasce sempre até 200px do centro
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        resourceEngine.spawnBubble(randomType, names[randomType], x, y);
      }
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(spawnInterval);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {bubbles.map(b => (
          <ResourceBubble key={b.id} bubble={b} />
        ))}
      </AnimatePresence>
    </>
  );
}
