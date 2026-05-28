/**
 * api.ts — HTTP Client centralizado
 * Toda comunicação com o backend passa por aqui.
 */

import { config } from '@/lib/config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
}

async function request<T>(
  method: HttpMethod,
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, headers = {}, token } = options;

  // Pega token do localStorage se não for passado explicitamente
  let authToken = token;
  
  if (!authToken && typeof window !== 'undefined') {
    // 1. Tenta na chave direta
    authToken = localStorage.getItem(config.auth.tokenKey) || undefined;
    
    // 2. Se falhar, tenta extrair do objeto persistido do Zustand (ploc-auth)
    if (!authToken) {
      try {
        const persisted = localStorage.getItem('ploc-auth');
        if (persisted) {
          const parsed = JSON.parse(persisted);
          authToken = parsed.state?.token;
        }
      } catch (e) {
        // Ignora erro de parse
      }
    }
  }

  const fullUrl = `${config.api.baseUrl}${endpoint}`;
  console.log(`🚀 [API Request] ${method} ${fullUrl}`, authToken ? 'Token: SIM' : 'Token: NÃO');

  const response = await fetch(fullUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error || `Erro ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export const apiService = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>('GET', endpoint, options),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', endpoint, { ...options, body }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', endpoint, { ...options, body }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', endpoint, { ...options, body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>('DELETE', endpoint, options),

  /** Upload de arquivos (multipart/form-data) */
  upload: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    let token =
      typeof window !== 'undefined'
        ? localStorage.getItem(config.auth.tokenKey)
        : null;

    if (!token && typeof window !== 'undefined') {
      try {
        const persisted = localStorage.getItem('ploc-auth');
        if (persisted) {
          const parsed = JSON.parse(persisted);
          token = parsed.state?.token || null;
        }
      } catch (e) {
        // Ignora erro de parse
      }
    }

    const response = await fetch(`${config.api.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${response.status}`);
    }

    return response.json() as Promise<T>;
  },
};
