/**
 * config.ts — Configuração centralizada de ambiente
 * Única fonte de verdade para URLs e variáveis de ambiente.
 */

const getApiUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  
  // Proteção automática contra Mixed Content:
  // Se o site estiver em HTTPS e a API em HTTP, faz o upgrade do protocolo.
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }
  return url;
};

const API_BASE_URL = getApiUrl();

export const config = {
  api: {
    baseUrl: API_BASE_URL,
  },
  auth: {
    tokenKey: 'ploc_token',
    userKey: 'ploc_user',
  },
} as const;
