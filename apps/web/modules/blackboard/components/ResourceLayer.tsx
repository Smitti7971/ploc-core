import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Droplet, Pill, Box } from 'lucide-react';
import { resourceEngine, ResourceBubbleData } from '../engine/resource-engine/ResourceEngine';
import { usePlocStateStore } from '../../mascot/store/plocStateStore';
import { blackboardEventBus } from '../events/eventBus';

const COLLISION_RADIUS = 60; // Distância para considerar que o PLOC encostou na bolha

function ResourceBubble({ bubble }: { bubble: ResourceBubbleData }) {
  const eat = usePlocStateStore(state => state.eat);
  const store = usePlocStateStore(state => state.store);
  const [isPopping, setIsPopping] = useState(false);

  useEffect(() => {
    // Checagem de colisão com o PLOC enquanto ele é arrastado
    const handlePlocMove = (payload: { x: number, y: number }) => {
      if (isPopping) return;
      
      const dx = payload.x - bubble.x;
      const dy = payload.y - bubble.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < COLLISION_RADIUS) {
        setIsPopping(true);
        // Colidiu! Come direto
        if (bubble.type === 'food' || bubble.type === 'water') {
          eat({
            id: bubble.id,
            type: bubble.type,
            name: bubble.name,
            createdAt: bubble.createdAt,
            state: 'fresh'
          }, 'direct');
        } else {
          // Outros itens como medicina, entram na bolsa direto se encostar
          store({
            type: bubble.type,
            name: bubble.name
          });
        }
        
        // Efeito visual / som aqui se quiser
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
    store({
      type: bubble.type,
      name: bubble.name
    });

    setTimeout(() => {
      resourceEngine.removeBubble(bubble.id);
    }, 300);
  };

  const getBubbleColor = () => {
    switch(bubble.type) {
      case 'food': return '#ef4444'; // red
      case 'water': return '#3b82f6'; // blue
      case 'medicine': return '#22c55e'; // green
      default: return '#c084fc'; // purple
    }
  };

  const getIcon = () => {
    switch(bubble.type) {
      case 'food': return <Apple size={24} className="text-red-400 drop-shadow-lg" />;
      case 'water': return <Droplet size={24} className="text-blue-400 drop-shadow-lg" />;
      case 'medicine': return <Pill size={24} className="text-green-400 drop-shadow-lg" />;
      default: return <Box size={24} className="text-purple-400 drop-shadow-lg" />;
    }
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        x: bubble.x,
        y: bubble.y,
        marginLeft: -30,
        marginTop: -30,
        width: 60,
        height: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 50,
      }}
      onClick={handleClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={isPopping ? { scale: 1.5, opacity: 0 } : { scale: 1, opacity: 1, y: [0, -10, 0] }}
      transition={{ 
        y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
        scale: isPopping ? { duration: 0.2 } : { type: "spring", stiffness: 300, damping: 20 },
        opacity: isPopping ? { duration: 0.2 } : { duration: 0.3 }
      }}
    >
      {getIcon()}
      <span className="text-white text-[8px] mt-0.5 font-black uppercase text-center leading-tight drop-shadow-md">
        {bubble.name}
      </span>
    </motion.div>
  );
}

export function ResourceLayer() {
  const [bubbles, setBubbles] = useState<ResourceBubbleData[]>([]);

  useEffect(() => {
    setBubbles(resourceEngine.getBubbles());
    return resourceEngine.subscribe(() => {
      setBubbles([...resourceEngine.getBubbles()]);
    });
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
