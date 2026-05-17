/**
 * global.types.ts — Tipos globais reutilizáveis em todo o projeto
 */

export interface UserStats {
  body: number;
  mind: number;
  life: number;
  freedom: number;
  purpose: number;
  focoCoins: number;
  premiumCoins: number;
  level: number;
  xp: number;
  streakDays: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  profilePhoto?: string;
  role?: string;
  createdAt?: string;
  stats?: UserStats;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  status?: string;
  error?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
