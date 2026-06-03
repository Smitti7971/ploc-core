import { motion } from 'framer-motion';

export function PlocWaterBody({ thirstLevel }: { thirstLevel: number }) {
  // Thirst 100 = full (height 100%). Thirst 0 = empty (height 0%).
  const fillPercentage = Math.max(0, Math.min(100, thirstLevel));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" style={{ borderRadius: 'inherit' }}>
      <motion.div
        className="absolute bottom-0 left-0 right-0 w-full"
        style={{
          background: 'linear-gradient(to bottom, rgba(34,211,238,0.2), rgba(14,165,233,0.4))',
          boxShadow: 'inset 0 10px 20px rgba(255,255,255,0.1)'
        }}
        initial={{ height: `${fillPercentage}%` }}
        animate={{ height: `${fillPercentage}%` }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      >
        {/* Linha de topo simples (Colarinho de água) */}
        <div className="absolute top-0 left-0 w-full h-[4px] bg-cyan-300/40" />
      </motion.div>
    </div>
  );
}
