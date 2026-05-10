import { CONFIG } from '../config/config.js?v=0.0.7';

/**
 * Client API unificado para o PLOC SPA
 */
export const apiClient = {
    baseURL: 'https://backend.midializando.cloud/api',
    async request(endpoint, options = {}) {
        const url = `https://backend.midializando.cloud/api${endpoint}`;
        const token = localStorage.getItem('ploc_token'); // Chave unificada: ploc_token
        
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Erro na comunicação com o servidor');
        }

        return await response.json();
    },

    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    },

    post(endpoint, data, options = {}) {
        return this.request(endpoint, { 
            ...options, 
            method: 'POST', 
            body: JSON.stringify(data) 
        });
    },

    put(endpoint, data, options = {}) {
        return this.request(endpoint, { 
            ...options, 
            method: 'PUT', 
            body: JSON.stringify(data) 
        });
    },

    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
};
