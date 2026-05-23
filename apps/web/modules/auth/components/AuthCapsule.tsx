'use client';

/**
 * ============================================================================
 * Cápsula de Autenticação - AuthCapsule.tsx
 * ============================================================================
 * Descrição: Um botão/cápsula flutuante que permite ao usuário abrir o modal
 * de login ou cadastro, ou exibir os dados do usuário autenticado.
 * ============================================================================
 */
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { AuthModal } from './AuthModal';
import { UserHeader } from '@/components/layout/UserHeader';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

// Componente exportado da Cápsula de Entrada
export const AuthCapsule: React.FC = () => {
  const { isAuthenticated, setAuthModalOpen } = useAuthStore(); // Puxa status de auth do zustand
  const pathname = usePathname();
  
  const isSettings = pathname === '/settings';
  const isPlocPage = pathname === '/ploc';

  // Se estivermos nas páginas onde o UserHeader não deve aparecer (para evitar colisão visual), ocultamos.
  if (isAuthenticated && (isSettings || isPlocPage)) {
    return null;
  }

  const handleEnterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setAuthModalOpen(true);
  };

  return (
    <div className="absolute top-[25px] right-[25px] z-[9999] flex items-center gap-3 pointer-events-auto">
      {isAuthenticated ? (
        <UserHeader />
      ) : (
        <>
          <Link href="/dashboard" onClick={handleEnterClick}>
            <motion.div
              initial={{ opacity: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className={cn(
                "bg-gradient-to-r from-[var(--ploc-primary)] to-[var(--ploc-secondary)]",
                "backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/15",
                "cursor-pointer shadow-lg shadow-[var(--ploc-primary)]/10 hover:shadow-[var(--ploc-primary)]/30",
                "flex items-center justify-center transition-all min-h-[36px]"
              )}
            >
              <span className="text-white text-[12px] font-black tracking-[1.5px] font-display">
                ENTRAR
              </span>
            </motion.div>
          </Link>
          <AuthModal />
        </>
      )}
    </div>
  );
};
