import { authService } from '../api/auth.js';
import { Modal } from './Modal.js';
import { Avatar } from './Avatar.js';

/**
 * Componente: LoginForm
 * Gera o HTML do formulário de login para ser usado dentro de um modal.
 */
export const LoginForm = {
    render() {
        return `
            <div class="login-modal-header">
                <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 10px;">PLOC</h2>
                <p style="color: var(--text-muted); margin-bottom: 30px;">Identifique-se para o seu sócio.</p>
            </div>
            <form id="modalLoginForm">
                <div style="margin-bottom: 20px; text-align: left;">
                    <label style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 8px; color: var(--text-muted); text-transform: uppercase;">E-mail</label>
                    <input type="email" id="modalEmail" placeholder="seu@email.com" required 
                        style="width: 100%; padding: 15px; border-radius: 14px; border: 1px solid var(--border); background: #f8fafc; outline: none;">
                </div>
                <div style="margin-bottom: 30px; text-align: left;">
                    <label style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 8px; color: var(--text-muted); text-transform: uppercase;">Senha</label>
                    <input type="password" id="modalPassword" placeholder="••••••••" required 
                        style="width: 100%; padding: 15px; border-radius: 14px; border: 1px solid var(--border); background: #f8fafc; outline: none;">
                </div>
                <button type="submit" style="width: 100%; padding: 16px; border-radius: 14px; border: none; background: #1e293b; color: white; font-weight: 600; cursor: pointer;">Entrar no Reino</button>
                <div id="modalMessage" class="message" style="margin-top: 15px;"></div>
            </form>
        `;
    },

    initEvents() {
        const form = document.getElementById('modalLoginForm');
        const messageDiv = document.getElementById('modalMessage');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('modalEmail').value;
            const password = document.getElementById('modalPassword').value;

            try {
                messageDiv.style.display = 'none';
                await authService.login(email, password);

                messageDiv.className = 'message success';
                messageDiv.style.display = 'block';
                messageDiv.innerText = "Login realizado! Preparando o Palco...";
                
                // Muda o estado do Ploc para Trabalhando
                Avatar.setState(Avatar.states.WORKING);

                // Fecha o modal e recarrega para aplicar o estado logado
                setTimeout(() => {
                    Modal.close();
                    window.location.reload(); 
                }, 1000);
            } catch (error) {
                messageDiv.className = 'message error';
                messageDiv.style.display = 'block';
                messageDiv.innerText = error.message;
            }
        });
    }
};
