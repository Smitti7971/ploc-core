import React from 'react';
import { motion, AnimatePresence, useTransform, MotionValue } from 'framer-motion';
import { ZoomIn, ZoomOut, Target } from 'lucide-react';

interface BlackboardMinimapProps {
  showMinimap: boolean;
  zoomOut: () => void;
  zoomIn: () => void;
  recenterMap: () => void;
  mapX: MotionValue<number>;
  mapY: MotionValue<number>;
  mapScale: MotionValue<number>;
  minScale: number;
  bubbles: any[];
}

export function BlackboardMinimap({
  showMinimap,
  zoomOut,
  zoomIn,
  recenterMap,
  mapX,
  mapY,
  mapScale,
  minScale,
  bubbles
}: BlackboardMinimapProps) {
  const miniDotX = useTransform(mapX, [-1500, 1500], [-50, 50]);
  const miniDotY = useTransform(mapY, [-1500, 1500], [-50, 50]);
  const miniViewportSize = useTransform(mapScale, [1.5, minScale], [24, 8]);

  return (
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

              {/* Indicadores de Itens no Minimapa */}
              {bubbles.map(b => (
                <div
                  key={b.id}
                  className="absolute w-1.5 h-1.5 rounded-full shadow-sm"
                  style={{
                    left: `calc(50% + ${(b.x / 3000) * 100}%)`,
                    top: `calc(50% + ${(b.y / 3000) * 100}%)`,
                    backgroundColor: b.type === 'food' ? '#ef4444' : b.type === 'water' ? '#3b82f6' : '#22c55e',
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={b.name}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
