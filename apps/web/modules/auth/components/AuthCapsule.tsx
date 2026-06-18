'use client';

/**
 * ============================================================================
 * Cápsula de Autenticação - AuthCapsule.tsx
 * ============================================================================
 * Descrição: Um botão/cápsula flutuante que permite ao usuário abrir o modal
 * de login ou cadastro, ou exibir os dados do usuário autenticado.
 * ============================================================================
 */
import React, { useState, useEffect } from 'react';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isSettings = pathname === '/settings';
  const isPlocPage = pathname === '/ploc' || pathname === '/'; // Blackboard now at /

  // A cápsula sempre deve aparecer para que o usuário possa deslogar e acessar o perfil
  // (Foi removida a restrição de ocultar nas páginas de configurações e Ploc)
  const handleEnterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setAuthModalOpen(true);
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-fixed pointer-events-none p-4 md:p-6 flex items-start justify-between">
      {/* Lado Esquerdo: Área onde o HUD será inserido via Portal */}
      <div id="blackboard-portal-target" className="pointer-events-auto flex items-center gap-2 md:gap-3" />

      {/* Lado Direito: Cápsula de Login e Perfil */}
      <div className="pointer-events-auto flex items-center justify-end gap-3">
        {mounted && (
          isAuthenticated ? (
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
                    "flex items-center justify-center transition-all h-[46px]"
                  )}
                >
                  <span className="text-white text-[12px] font-black tracking-[1.5px] font-display">
                    ENTRAR
                  </span>
                </motion.div>
              </Link>
              <AuthModal />
            </>
          )
        )}
      </div>
    </header>
  );
};
