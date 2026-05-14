'use client';

/**
 * useAuth.ts — Hook de autenticação
 * Encapsula toda a lógica de login, registro e logout.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '../services/authService';
import type { LoginCredentials, RegisterCredentials } from '../types/auth.types';

export function useAuth() {
  const router = useRouter();
  const { setAuth, logout: storeLogout, user, isAuthenticated, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      setAuth(data.token, data.user);
      // Compatibilidade com o app legado
      localStorage.setItem('ploc_token', data.token);
      localStorage.setItem('ploc_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha na conexão');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
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
  };

  const logout = () => {
    storeLogout();
    localStorage.removeItem('ploc_token');
    localStorage.removeItem('ploc_user');
    router.push('/');
  };

  return { login, register, logout, user, isAuthenticated, token, isLoading, error, setError };
}
