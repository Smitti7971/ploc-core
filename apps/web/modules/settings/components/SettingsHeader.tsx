import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface SettingsHeaderProps {
  title: string;
}

export function SettingsHeader({ title }: SettingsHeaderProps) {
  const router = useRouter();

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      background: 'rgba(2, 6, 23, 0.7)',
      backdropFilter: 'blur(30px)',
      zIndex: 1000,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <motion.button
        whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.08)' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.back()}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        <ArrowLeft size={18} />
      </motion.button>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>
        {title}
      </h1>
    </div>
  );
}
