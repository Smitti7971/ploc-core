/**
 * global.types.ts — Tipos globais reutilizáveis em todo o projeto
 */

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  profilePhoto?: string;
  role?: string;
  createdAt?: string;
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
