/**
 * config.ts — Configuração centralizada de ambiente
 * Única fonte de verdade para URLs e variáveis de ambiente.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const config = {
  api: {
    baseUrl: API_BASE_URL,
  },
  auth: {
    tokenKey: 'ploc_token',
    userKey: 'ploc_user',
  },
} as const;
