'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PlocAvatar from '@/components/mascot/PlocAvatar';

export function MascotCenter() {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      // Herda o zIndex: 8 do palco principal para permitir o sanduíche 3D perfeito
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '350px',
      height: '350px'
    }}>
      {/* O Ploc */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      >
        <PlocAvatar />
      </motion.div>
    </div>
  );
}
