/**
 * config.ts — Configuração centralizada de ambiente
 * Única fonte de verdade para URLs e variáveis de ambiente.
 */

const getApiUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  // Garante que a URL termine com /api se não tiver
  if (!url.endsWith('/api') && !url.endsWith('/api/')) {
    url = url.endsWith('/') ? `${url}api` : `${url}/api`;
  }

  // Proteção automática contra Mixed Content:
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

export const getAssetUrl = (url?: string | null) => {
  if (!url) return '';
  
  const backendRoot = config.api.baseUrl.replace(/\/api\/?$/, '');

  let result = url;

  // Se já for uma URL completa
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (url.includes('localhost:') && typeof window !== 'undefined') {
      result = url.replace(/^https?:\/\/localhost:\d+/, backendRoot);
    } else if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('http://')) {
      // Proteção automática contra Mixed Content para imagens da CDN:
      result = url.replace('http://', 'https://');
    }
  } else {
    // Se for caminho relativo (ex: /uploads/...)
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    
    // Se for imagem local do frontend, não usa o backendRoot
    if (cleanUrl.startsWith('/images/')) {
      result = cleanUrl;
    } else {
      result = `${backendRoot}${cleanUrl}`;
    }
  }

  // DEBUG 404 removed

  return result;
};
