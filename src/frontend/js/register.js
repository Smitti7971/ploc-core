/**
 * PLOC - Register Logic
 * Criação de conta e onboarding inicial.
 */

import { authService } from './api/auth.js';
import { ui } from './ui.js';

const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            ui.setLoading('.btn-premium', true, 'Semeando...');
            
            await authService.register(name, email, password);

            ui.showToast("Conta criada! Bem-vindo ao Reino.");
            setTimeout(() => window.location.href = 'login.html', 1500);
        } catch (error) {
            ui.showToast(error.message, 'error');
        } finally {
            ui.setLoading('.btn-premium', false);
        }
    });
}
