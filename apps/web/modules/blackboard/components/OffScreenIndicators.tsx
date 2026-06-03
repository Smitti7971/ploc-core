import React, { useState, useEffect } from 'react';
import { motion, useMotionValueEvent, MotionValue } from 'framer-motion';
import { ResourceBubbleData } from '../engine/resource-engine/ResourceEngine';

interface OffScreenIndicatorsProps {
  bubbles: ResourceBubbleData[];
  mapX: MotionValue<number>;
  mapY: MotionValue<number>;
  mapScale: MotionValue<number>;
}

export function OffScreenIndicators({ bubbles, mapX, mapY, mapScale }: OffScreenIndicatorsProps) {
  const [indicators, setIndicators] = useState<{ id: string, x: number, y: number, angle: number, type: string }[]>([]);

  useEffect(() => {
    let animationFrameId: number;

    const updatePositions = () => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const mx = mapX.get();
      const my = mapY.get();
      const s = mapScale.get();

      const padding = 40; // padding da borda da tela
      const w = cx - padding;
      const h = cy - padding;

      const newIndicators: { id: string, x: number, y: number, angle: number, type: string }[] = [];

      bubbles.forEach(b => {
        // Posição do item na tela
        const screenX = cx + mx + b.x * s;
        const screenY = cy + my + b.y * s;

        // Verifica se está fora da tela (com uma pequena margem de segurança)
        if (screenX < 0 || screenX > window.innerWidth || screenY < 0 || screenY > window.innerHeight) {
          // Relativo ao centro
          const dx = screenX - cx;
          const dy = screenY - cy;

          // Ângulo
          const angle = Math.atan2(dy, dx);

          // Interseção com as bordas da tela
          let x = 0;
          let y = 0;

          // Encontra se bate nas bordas horizontais ou verticais primeiro
          // A reta é y = (dy/dx) * x
          const slope = dy / dx;

          if (Math.abs(slope) < h / w) {
            // Bate nas laterais direita/esquerda
            x = dx > 0 ? w : -w;
            y = x * slope;
          } else {
            // Bate no topo/baixo
            y = dy > 0 ? h : -h;
            x = y / slope;
          }

          newIndicators.push({
            id: b.id,
            x: cx + x,
            y: cy + y,
            angle: angle,
            type: b.type
          });
        }
      });

      setIndicators(newIndicators);
      animationFrameId = requestAnimationFrame(updatePositions);
    };

    animationFrameId = requestAnimationFrame(updatePositions);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [bubbles, mapX, mapY, mapScale]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[50]">
      {indicators.map(ind => {
        let color = '#ef4444';
        if (ind.type === 'water') color = '#3b82f6';
        if (ind.type === 'medicine') color = '#22c55e';

        return (
          <motion.div
            key={ind.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute rounded-full shadow-lg border border-white/20 flex items-center justify-center backdrop-blur-md"
            style={{
              left: ind.x,
              top: ind.y,
              width: 32,
              height: 32,
              transform: `translate(-50%, -50%)`,
              backgroundColor: `${color}80` // semi-transparent
            }}
          >
            {/* Seta direcional na borda do círculo apontando pra fora */}
            <div 
              className="absolute w-0 h-0"
              style={{
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderLeft: `10px solid ${color}`,
                transform: `rotate(${ind.angle}rad) translateX(16px)`,
              }}
            />
            {/* Ponto central brilhante */}
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
