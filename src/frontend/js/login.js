/**
 * PLOC - Login Logic
 * Gerenciamento de autenticação e feedback visual.
 */

import { authService } from './api/auth.js';
import { ui } from './ui.js';

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            ui.setLoading('.btn-premium', true, 'Entrando...');
            await authService.login(email, password);

            ui.showToast("Login realizado! Preparando o PLOC...");
            
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
        } catch (error) {
            ui.showToast(error.message, 'error');
        } finally {
            ui.setLoading('.btn-premium', false);
        }
    });
}
