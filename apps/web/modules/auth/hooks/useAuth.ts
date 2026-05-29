'use client';

/**
 * useAuth.ts — Hook de autenticação
 * Encapsula toda a lógica de login, registro e logout.
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '../services/authService';
import { apiService } from '@/services/api';
import type { User } from '@/types/global.types';
import type { LoginCredentials, RegisterCredentials } from '../types/auth.types';

export function useAuth() {
  const router = useRouter();
  const { setAuth, logout: storeLogout, updateUser, user, isAuthenticated, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      setAuth(data.token, data.user);
      localStorage.setItem('ploc_token', data.token);
      localStorage.setItem('ploc_user', JSON.stringify(data.user));
      
      // Carrega estado do ploc do backend ao logar
      if ((data.user as any)?.stats?.plocState) {
        const { usePlocStateStore } = await import('@/modules/mascot/store/plocStateStore');
        usePlocStateStore.getState().loadFromBackend((data.user as any).stats.plocState);
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha na conexão');
    } finally {
      setIsLoading(false);
    }
  }, [router, setAuth]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.register(credentials);
      setAuth(data.token, data.user);
      localStorage.setItem('ploc_token', data.token);
      localStorage.setItem('ploc_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha na conexão');
    } finally {
      setIsLoading(false);
    }
  }, [router, setAuth]);

  const logout = useCallback(() => {
    storeLogout();
    localStorage.removeItem('ploc_token');
    localStorage.removeItem('ploc_user');
    router.push('/');
  }, [router, storeLogout]);

  const refreshProfile = useCallback(async () => {
    try {
      const response = await apiService.get<User>('/users/me');
      updateUser(response);
      // Mantém os dados antigos e mescla com os novos (stats)
      localStorage.setItem('ploc_user', JSON.stringify({ ...user, ...response }));
      
      // Carrega estado do ploc do backend
      if ((response as any)?.stats?.plocState) {
        const { usePlocStateStore } = await import('@/modules/mascot/store/plocStateStore');
        usePlocStateStore.getState().loadFromBackend((response as any).stats.plocState);
      }
      
      return response;
    } catch (err) {
      console.error('❌ Falha ao atualizar perfil:', err);
      throw err;
    }
  }, [updateUser, user]);

  return { login, register, logout, refreshProfile, user, isAuthenticated, token, isLoading, error, setError };
}
