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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => {
        set({ token, user, isAuthenticated: true });
        // Sincroniza com cookie para o Middleware (Next.js)
        document.cookie = `ploc-auth=true; path=/; max-age=${60 * 60 * 24 * 7}`;
      },

      updateUser: (updatedFields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        })),

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
        // Limpa cookie
        document.cookie = 'ploc-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      },
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
