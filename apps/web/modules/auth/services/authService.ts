/**
 * authService.ts — Serviço de autenticação
 * Toda comunicação auth com o backend passa por aqui.
 */

import { apiService } from '@/services/api';
import type { AuthResponse } from '@/types/global.types';
import type { LoginCredentials, RegisterCredentials } from '../types/auth.types';

export const authService = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    apiService.post<AuthResponse>('/auth/login', credentials),

  register: (credentials: RegisterCredentials): Promise<AuthResponse> =>
    apiService.post<AuthResponse>('/auth/register', credentials),

  checkHealth: (): Promise<{ status: string }> =>
    apiService.get<{ status: string }>('/health'),
};
