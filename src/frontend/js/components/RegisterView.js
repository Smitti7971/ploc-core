import { authService } from '../api/auth.js';
import { ui } from '../ui.js';

export const RegisterView = {
    render: () => {
        return `
            <div class="auth-view register-page">
                <div class="auth-card">
                    <div class="auth-header">
                        <h2 class="auth-logo">PLOC</h2>
                        <p class="auth-subtitle">Comece sua jornada com o Ploc.</p>
                    </div>
                    <form id="registerForm">
                        <div class="input-group">
                            <label>Nome</label>
                            <input type="text" id="name" placeholder="Como quer ser chamado?" required>
                        </div>
                        <div class="input-group">
                            <label>E-mail</label>
                            <input type="email" id="email" placeholder="seu@email.com" required>
                        </div>
                        <div class="input-group">
                            <label>Senha</label>
                            <input type="password" id="password" placeholder="Mínimo 6 caracteres" required minlength="6">
                        </div>
                        <button type="submit" id="btnRegister" class="btn-auth">Criar Conta</button>
                    </form>
                    <div class="auth-footer">
                        <p>Já tem conta? <a href="#" id="linkLogin">Faça Login</a></p>
                    </div>
                </div>
            </div>
        `;
    },

    init: () => {
        const form = document.getElementById('registerForm');
        if (!form) return;

        form.onsubmit = async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            ui.setLoading('#btnRegister', true, 'Criando...');

            try {
                await authService.register(name, email, password);
                ui.showToast('Conta criada! Faça seu login. ✨');
                window.dispatchEvent(new CustomEvent('navigate', { detail: 'login' }));
            } catch (err) {
                ui.showToast(err.message, 'error');
            } finally {
                ui.setLoading('#btnRegister', false);
            }
        };

        const linkLogin = document.getElementById('linkLogin');
        if (linkLogin) {
            linkLogin.onclick = (e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('navigate', { detail: 'login' }));
            };
        }
    }
};
