/**
 * Componente: LoginPage
 */
import { apiClient } from '../../shared/api/client.js?v=0.0.9';

export const renderLogin = () => {
    const container = document.createElement('div');
    container.className = 'auth-container';

    container.innerHTML = `
        <div class="auth-card glass-card">
            <div style="margin-bottom: 3rem; text-align: left;">
                <h2 style="font-size: 2rem; font-weight: 900; letter-spacing: -1px; margin-bottom: 0.5rem; color: #fff;">Bem-vindo.</h2>
                <p style="color: var(--text-dim);">Acesse sua conta para gerenciar sua rotina.</p>
            </div>

            <form id="login-form" class="flex-column" style="gap: 1.5rem;">
                <div class="flex-column" style="gap: 0.5rem;">
                    <label style="font-size: 0.7rem; font-weight: 800; color: var(--accent); letter-spacing: 1px;">E-MAIL</label>
                    <input type="email" name="email" placeholder="seu@email.com" class="auth-input" required>
                </div>

                <div class="flex-column" style="gap: 0.5rem;">
                    <label style="font-size: 0.7rem; font-weight: 800; color: var(--accent); letter-spacing: 1px;">SENHA</label>
                    <input type="password" name="password" placeholder="••••••••" class="auth-input" required>
                </div>

                <div id="login-error" style="color: #ef4444; font-size: 0.8rem; min-height: 1.2rem;"></div>

                <button type="submit" class="auth-button">
                    ENTRAR NO PLOC
                </button>
            </form>

            <p style="margin-top: 2.5rem; text-align: center; color: var(--text-dim); font-size: 0.85rem;">
                Novo por aqui? <span style="color: var(--accent); font-weight: 700; cursor: pointer;" onclick="window.location.hash='#register'">Crie uma conta</span>
            </p>
        </div>
    `;

    // Lógica do Formulário
    setTimeout(() => {
        const form = container.querySelector('#login-form');
        const errorDiv = container.querySelector('#login-error');

        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            
            try {
                btn.disabled = true;
                btn.innerText = 'Verificando...';
                errorDiv.innerText = '';

                const response = await apiClient.post('/auth/login', data);
                
                if (response.token) {
                    localStorage.setItem('ploc_token', response.token);
                    localStorage.setItem('ploc_user', JSON.stringify(response.user));
                    window.location.hash = '#landing'; // Volta para a home logado
                }
            } catch (error) {
                errorDiv.innerText = error.message;
            } finally {
                btn.disabled = false;
                btn.innerText = originalText;
            }
        };
    }, 0);

    return container;
};
