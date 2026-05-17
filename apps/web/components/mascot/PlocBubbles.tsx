import { motion } from 'framer-motion';

export function PlocBubbles() {
  return (
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
  );
}
