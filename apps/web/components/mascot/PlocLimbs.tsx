import { motion } from 'framer-motion';

interface PlocLimbsProps {
  limbColor: string;
  limbShadow: string;
}

export function PlocLimbs({ limbColor, limbShadow }: PlocLimbsProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* Braços Stick (Esquerda/Direita) */}
      {[-1, 1].map((side) => (
        <motion.div
          key={`stick-arm-${side}`}
          animate={{ rotate: [side * 20, side * 40, side * 20] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '50%',
            [side === -1 ? 'left' : 'right']: '-25%',
            width: '20px',
            height: '6px',
            background: limbColor,
            boxShadow: limbShadow,
            borderRadius: '3px',
            transformOrigin: side === -1 ? 'right center' : 'left center',
          }}
        >
          {/* Mãozinhas Redondas */}
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

      {/* Perninhas Stick Flutuantes (Esquerda/Direita) */}
      {[-1, 1].map((side) => (
        <motion.div
          key={`stick-leg-${side}`}
          animate={{ 
            y: [0, 4, 0], 
            rotate: [0, side * 10, 0] 
          }}
          transition={{ 
            duration: 1.5 + Math.abs(side) * 0.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          style={{
            position: 'absolute',
            bottom: '-12%',
            [side === -1 ? 'left' : 'right']: '22%',
            width: '8px',
            height: '16px',
            background: limbColor,
            boxShadow: limbShadow,
            borderRadius: '4px',
            transformOrigin: 'top center',
          }}
        />
      ))}
    </div>
  );
}
