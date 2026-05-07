/**
 * Mensageiro Central da API (Client)
 * 
 * Este arquivo centraliza todas as chamadas para o Backend.
 * Ninguém no Frontend deve usar fetch() diretamente, apenas através deste cliente.
 */

const API_BASE_URL = 'https://backend.midializando.cloud/api';

export const apiClient = {
    /**
     * Faz uma requisição para a API
     * @param {string} endpoint - O caminho da rota (ex: '/auth/login')
     * @param {object} options - Opções do fetch (method, body, etc)
     */
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro na comunicação com o servidor');
            }

            return data;
        } catch (error) {
            console.error(`❌ API Error [${endpoint}]:`, error);
            throw error;
        }
    },

    get(endpoint) { return this.request(endpoint, { method: 'GET' }); },
    post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); },
    put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); },
    delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
};
