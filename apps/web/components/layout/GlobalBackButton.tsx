'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

export const GlobalBackButton: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Não mostrar na raiz/landing page
  if (pathname === '/') return null;

  return (
    <div className="absolute top-[25px] left-[25px] z-fixed pointer-events-auto">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.back()}
        className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-lg"
        aria-label="Voltar"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
};
