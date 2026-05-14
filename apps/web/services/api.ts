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
  const authToken =
    token ??
    (typeof window !== 'undefined'
      ? localStorage.getItem(config.auth.tokenKey)
      : null);

  const response = await fetch(`${config.api.baseUrl}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Erro ${response.status}: ${response.statusText}`
    );
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
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem(config.auth.tokenKey)
        : null;

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
