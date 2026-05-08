import { CONFIG } from '../config.js';

export const apiClient = {
    async request(endpoint, options = {}) {
        const url = `${CONFIG.API_BASE_URL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
            },
            ...options
        };

        const response = await fetch(url, defaultOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro na comunicação com o servidor');
        }

        return data;
    },

    get(endpoint) { return this.request(endpoint, { method: 'GET' }); },
    post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
};
