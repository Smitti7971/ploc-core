/**
 * Componente: LoginPage
 */
import { apiClient } from '../api/client.js';

export const renderLogin = () => {
    const container = document.createElement('div');
    Object.assign(container.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem',
        animation: 'fadeIn 0.4s ease-out'
    });

    container.innerHTML = `
        <div style="width: 100%; max-width: 400px;">
            <div style="margin-bottom: 3rem; text-align: left;">
                <h2 style="font-size: 2rem; font-weight: 900; letter-spacing: -1px; margin-bottom: 0.5rem;">Bem-vindo de volta.</h2>
                <p style="color: #64748b;">Acesse sua conta para gerenciar sua rotina.</p>
            </div>

            <form id="login-form" style="display: flex; flexDirection: column; gap: 1.2rem;">
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <label style="font-size: 0.85rem; font-weight: 700; color: #475569;">E-MAIL</label>
                    <input type="email" name="email" placeholder="seu@email.com" required 
                        style="padding: 1rem; border-radius: 12px; border: 1.5px solid #e2e8f0; font-size: 1rem; transition: border-color 0.2s;">
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <label style="font-size: 0.85rem; font-weight: 700; color: #475569;">SENHA</label>
                    <input type="password" name="password" placeholder="••••••••" required 
                        style="padding: 1rem; border-radius: 12px; border: 1.5px solid #e2e8f0; font-size: 1rem; transition: border-color 0.2s;">
                </div>

                <div id="login-error" style="color: #ef4444; font-size: 0.9rem; min-height: 1.2rem; margin-top: -0.5rem;"></div>

                <button type="submit" style="background: #000; color: #fff; border: none; padding: 1.1rem; border-radius: 12px; font-weight: 700; font-size: 1rem; cursor: pointer; margin-top: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    Entrar no Ploc
                </button>
            </form>

            <p style="margin-top: 2rem; text-align: center; color: #64748b; font-size: 0.95rem;">
                Não tem uma conta? <span style="color: #000; font-weight: 700; cursor: pointer;" onclick="window.location.hash='#register'">Cadastre-se</span>
            </p>
        </div>
    `;

    // Lógica do Formulário
    setTimeout(() => {
        const form = container.querySelector('#login-form');
        const errorDiv = container.querySelector('#login-error');
        const inputs = form.querySelectorAll('input');

        inputs.forEach(input => {
            input.onfocus = () => input.style.borderColor = '#000';
            input.onblur = () => input.style.borderColor = '#e2e8f0';
        });

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
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    window.location.hash = '#dashboard';
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
