/**
 * authStore.ts — Estado global de autenticação (Zustand)
 * Única fonte de verdade para sessão do usuário.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/global.types';
import { config } from '@/lib/config';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (token: string, user: User) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => {
        set({ token, user, isAuthenticated: true });
      },

      updateUser: (updatedFields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        })),

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(config.auth.tokenKey);
          localStorage.removeItem(config.auth.userKey);
          localStorage.removeItem('ploc-auth');
          localStorage.removeItem('ploc-tracker-storage');
          localStorage.removeItem('ploc-vice-storage');
          localStorage.removeItem('ploc-state');
        }
        set({ token: null, user: null, isAuthenticated: false });
      },

      isAuthModalOpen: false,
      setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
    }),
    {
      name: 'ploc-auth',
      // Mapeia as chaves do localStorage para compatibilidade com o app antigo
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
      // Permite que o app antigo (vanilla JS) continue lendo ploc_token
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        
        // Garante que se houver token, isAuthenticated seja true
        if (state.token && !state.isAuthenticated) {
          state.isAuthenticated = true;
        }

        // Sincroniza com as chaves legadas se necessário
        const legacyToken = localStorage.getItem(config.auth.tokenKey);
        const legacyUser = localStorage.getItem(config.auth.userKey);
        if (legacyToken && !state.token) {
          try {
            const user = legacyUser ? JSON.parse(legacyUser) : null;
            state.setAuth(legacyToken, user);
          } catch {
            // silently fail
          }
        }
      },
    }
  )
);
