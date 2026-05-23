'use client';

/**
 * ============================================================================
 * Modal de Autenticação - AuthModal.tsx
 * ============================================================================
 * Descrição: Interface modal em glassmorphism contendo formulário de login e
 * registro. Mantém estado de erro e de carregamento durante chamadas à API.
 * ============================================================================
 */import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { apiService } from '@/services/api';
import { cn } from '@/lib/utils';
import type { User } from '@/types/global.types';

// Componente do Modal que sobrepõe a tela para autenticar o user
export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin
        ? { email: authEmail, password: authPass }
        : { name: authName, email: authEmail, password: authPass };

      const response = await apiService.post<{ token: string; user: User }>(endpoint, payload);

      useAuthStore.getState().setAuth(response.token, response.user);
      setAuthModalOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao autenticar';
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-5">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAuthModalOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={cn(
              "relative w-full max-w-[340px] p-10 flex flex-col gap-6 z-[1]",
              "bg-[var(--ploc-glass)] backdrop-blur-[40px]",
              "rounded-[var(--radius-card)] border border-[var(--ploc-border)]",
              "shadow-[0_30px_60px_rgba(0,0,0,0.8)] text-[var(--ploc-foreground)]"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h2 className="m-0 text-2xl font-black uppercase tracking-[3px] font-display">
                {isLogin ? 'Login' : 'Cadastro'}
              </h2>
            </div>

            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="NOME"
                  value={authName}
                  required
                  onChange={(e) => setAuthName(e.target.value)}
                  className="bg-white/5 border border-[var(--ploc-border)] rounded-[var(--radius-input)] p-4 text-white text-sm outline-none transition-all placeholder:text-white/20 focus:border-[var(--ploc-primary)]/50 focus:bg-white/10"
                />
              )}
              <input
                type="email"
                placeholder="E-MAIL"
                value={authEmail}
                required
                onChange={(e) => setAuthEmail(e.target.value)}
                className="bg-white/5 border border-[var(--ploc-border)] rounded-[var(--radius-input)] p-4 text-white text-sm outline-none transition-all placeholder:text-white/20 focus:border-[var(--ploc-primary)]/50 focus:bg-white/10"
              />
              <input
                type="password"
                placeholder="SENHA"
                value={authPass}
                required
                onChange={(e) => setAuthPass(e.target.value)}
                className="bg-white/5 border border-[var(--ploc-border)] rounded-[var(--radius-input)] p-4 text-white text-sm outline-none transition-all placeholder:text-white/20 focus:border-[var(--ploc-primary)]/50 focus:bg-white/10"
              />

              {authError && (
                <p className="text-[var(--ploc-danger)] text-[10px] m-0 text-center font-bold">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className={cn(
                  "bg-[var(--ploc-primary)] text-[var(--ploc-background)]",
                  "rounded-[var(--radius-button)] p-[18px] font-black cursor-pointer transition-all hover:brightness-110",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {authLoading ? '...' : isLogin ? 'ENTRAR' : 'CRIAR CONTA'}
              </button>
            </form>

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="bg-transparent border-none text-[var(--ploc-muted)] text-xs cursor-pointer underline hover:text-white/50 transition-colors"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre aqui'}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
