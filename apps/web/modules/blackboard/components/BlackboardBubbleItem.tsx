/**
 * @module BlackboardBubbleItem
 * @description Componente visual de uma bolha de tarefa, conhecimento ou insight no Blackboard.
 * Gerencia a animação de flutuação, efeitos visuais baseados no tipo, e a interação de clique (explosão).
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Activity as ActivityIcon } from 'lucide-react';
import { BlackboardBubble } from '../types/bubbles';

const BUBBLE_COLORS: Record<string, string> = {
  work: '#38bdf8',
  study: '#a78bfa',
  health: '#4ade80',
  bright_idea: '#fcd34d',
  knowledge: '#f472b6'
};

export const BlackboardBubbleItem = memo(({ 
  bubble, 
  onExplode, 
  windowMinutes = 10, 
  canvasScale = 1 
}: {
  bubble: BlackboardBubble,
  onExplode: () => void,
  windowMinutes?: number,
  canvasScale?: number
}) => {
  const Icon = bubble.type === 'bright_idea' ? Sparkles : (bubble.type === 'knowledge' ? Brain : ActivityIcon);
  const themeColor = BUBBLE_COLORS[bubble.type] || '#38bdf8';
  const isOutward = (bubble as unknown as { metadata?: { direction?: string } })?.metadata?.direction === 'outward';

  const opticalScale = Math.max(1, 1 / canvasScale);
  const isPerformanceMode = canvasScale < 0.6;

  const isGoalReached = isOutward && (bubble.minutesRemaining || 0) <= 0;
  const mainColor = isGoalReached ? '#10b981' : (isOutward ? '#ef4444' : themeColor);

  return (
    <motion.div
      id={`bubble-${bubble.id}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        y: [0, -12, 0],
        x: [0, 8, 0, -8, 0],
        scale: opticalScale,
        opacity: 1
      }}
      exit={{
        scale: opticalScale * 4,
        opacity: 0,
        filter: 'brightness(2) blur(10px)',
        transition: { duration: 0.4, ease: "easeOut" }
      }}
      transition={{
        y: { duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" },
        x: { duration: 5 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" },
        scale: { type: 'spring', stiffness: 300, damping: 20 },
        opacity: { duration: 0.3 }
      }}
      className="absolute origin-center rounded-full flex items-center justify-center text-white cursor-pointer pointer-events-auto z-[100]"
      style={{
        left: bubble.x - bubble.size / 2,
        top: bubble.y - bubble.size / 2,
        width: bubble.size,
        height: bubble.size,
        backgroundColor: isOutward ? 'transparent' : `${mainColor}20`,
        backgroundImage: isOutward
          ? `radial-gradient(circle, ${mainColor}40 0%, ${mainColor}10 100%)`
          : 'none',
        backdropFilter: 'blur(12px)',
        border: `2px solid ${mainColor}99`,
        boxShadow: `0 0 20px ${mainColor}44`,
        transform: `translateZ(0)`
      }}
      whileHover={{
        scale: 1.2 * opticalScale,
        backgroundColor: isOutward ? 'transparent' : `${mainColor}40`,
        backgroundImage: isOutward
          ? `radial-gradient(circle, ${mainColor}60 0%, ${mainColor}20 100%)`
          : 'none'
      }}
      onClick={onExplode}
    >
      {/* Reflexo Especular (Efeito de Bolha) */}
      <div 
        className="absolute top-[15%] left-[15%] w-[30%] h-[30%] rounded-full blur-[1px] z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 80%)'
        }} 
      />

      <div className="flex flex-col items-center justify-center gap-1 relative z-20">
        {isOutward ? (
          <div style={{ fontSize: bubble.size * 0.4 }}>🚭</div>
        ) : (
          <Icon size={bubble.size * 0.35} color={themeColor} />
        )}
        <span 
          className="text-[10px] font-black font-mono flex flex-col items-center text-center leading-none"
          style={{
            color: isGoalReached ? '#dcfce7' : (isOutward ? '#fca5a5' : '#fff'),
            textShadow: `0 0 5px ${mainColor}`,
          }}
        >
          {isOutward && (
            <span className="text-[7px] mb-[2px]">
              {isGoalReached ? 'META ALCANÇADA' : 'RESISTIR'}
            </span>
          )}
          {(() => {
            const absMins = Math.abs(bubble.minutesRemaining || 0);
            const totalSecs = Math.floor(absMins * 60);
            const m = Math.floor(totalSecs / 60);
            const s = totalSecs % 60;
            return `${isGoalReached ? '+' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
          })()}
        </span>
      </div>

      {bubble.energy > 0 && (
        <svg
          viewBox={`0 0 ${bubble.size} ${bubble.size}`}
          width={bubble.size}
          height={bubble.size}
          className="absolute top-0 left-0 origin-center -rotate-90 pointer-events-none z-30"
        >
          <circle
            cx={bubble.size / 2}
            cy={bubble.size / 2}
            r={bubble.size / 2 - 3}
            fill="none"
            stroke={mainColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * (bubble.size / 2 - 3)}
            strokeDashoffset={isGoalReached ? 0 : (2 * Math.PI * (bubble.size / 2 - 3) * (1 - (bubble.minutesRemaining || 0) / (Number(bubble.metadata?.totalMinutes) || 10)))}
            style={{
              filter: `drop-shadow(0 0 5px ${mainColor})`,
              transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease'
            }}
          />
        </svg>
      )}
    </motion.div>
  );
});

BlackboardBubbleItem.displayName = 'BlackboardBubbleItem';
