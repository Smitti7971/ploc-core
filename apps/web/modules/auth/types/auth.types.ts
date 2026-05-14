/**
 * auth.types.ts — Tipos do módulo de autenticação
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
}

export type AuthModalType = 'login' | 'register';
