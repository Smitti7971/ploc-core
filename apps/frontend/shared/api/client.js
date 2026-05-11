import { CONFIG } from '../../app/config.js?v=0.1.3';

/**
 * Client API unificado para o PLOC SPA
 */
export const apiClient = {
    baseURL: CONFIG.API_BASE_URL,
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
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
            if (response.status === 401) {
                console.warn('Sessão expirada. Redirecionando...');
                localStorage.removeItem('ploc_token');
                window.location.hash = '#landing';
                window.location.reload(); // Garante a limpeza total do estado
            }
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
    },

    /**
     * Upload de arquivos reais (Multipart/FormData)
     */
    async uploadFile(file, endpoint = '/upload') {
        const url = `${this.baseURL}${endpoint}`;
        const token = localStorage.getItem('ploc_token');
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                // Note: NÃO definimos Content-Type aqui, o navegador faz isso automaticamente para FormData
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Falha no upload do arquivo');
        }

        return await response.json();
    }
};
