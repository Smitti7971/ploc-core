import { apiClient } from './client.js';

/**
 * Módulo de Autenticação
 * Cuida de Login, Cadastro e Logout.
 */
export const authService = {
    async login(email, password) {
        try {
            const result = await apiClient.post('/auth/login', { email, password });
            
            // Salva os dados no armário (localStorage)
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            
            return result;
        } catch (error) {
            throw error;
        }
    },

    async register(name, email, password) {
        try {
            const result = await apiClient.post('/auth/register', { name, email, password });
            return result;
        } catch (error) {
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};
