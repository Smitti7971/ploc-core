import { authService } from '../api/auth.js';
import { ui } from '../ui.js';

export const LoginView = {
    render: () => {
        return `
            <div class="auth-view login-page">
                <div class="auth-card">
                    <div class="auth-header">
                        <h2 class="auth-logo">PLOC</h2>
                        <p class="auth-subtitle">Identifique-se para o seu sócio.</p>
                    </div>
                    <form id="loginForm">
                        <div class="input-group">
                            <label>E-mail</label>
                            <input type="email" id="email" placeholder="seu@email.com" required>
                        </div>
                        <div class="input-group">
                            <label>Senha</label>
                            <input type="password" id="password" placeholder="••••••••" required>
                        </div>
                        <button type="submit" id="btnLogin" class="btn-auth">Entrar no Reino</button>
                    </form>
                    <div class="auth-footer">
                        <p>Não tem conta? <a href="#" id="linkRegister">Crie uma agora</a></p>
                    </div>
                </div>
            </div>
        `;
    },

    init: () => {
        const form = document.getElementById('loginForm');
        if (!form) return;

        form.onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            ui.setLoading('#btnLogin', true, 'Validando...');

            try {
                await authService.login(email, password);
                ui.showToast('Bem-vindo de volta! 🔓');
                
                // Navega para o Dashboard
                window.dispatchEvent(new CustomEvent('navigate', { detail: 'dashboard' }));
            } catch (err) {
                ui.showToast(err.message, 'error');
            } finally {
                ui.setLoading('#btnLogin', false);
            }
        };

        const linkRegister = document.getElementById('linkRegister');
        if (linkRegister) {
            linkRegister.onclick = (e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('navigate', { detail: 'register' }));
            };
        }
    }
};
