/**
 * Componente: DashboardPage
 */
import { apiClient } from '../api/client.js';

export const renderDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const container = document.createElement('div');
    Object.assign(container.style, {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        animation: 'fadeIn 0.3s ease-out'
    });

    container.innerHTML = `
        <header style="display: flex; justify-content: space-between; alignItems: center; padding: 1rem 5%; background: #fff; border-bottom: 1px solid #f1f5f9;">
            <div style="font-weight: 900; font-size: 1.2rem; letter-spacing: -1px;">PLOC</div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-size: 0.9rem; font-weight: 600; color: #475569;">Olá, ${user.name || 'Usuário'}</span>
                <button id="btn-logout" style="background: #f1f5f9; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; font-size: 0.8rem; cursor: pointer; color: #ef4444;">Sair</button>
            </div>
        </header>

        <main style="flex: 1; padding: 2rem; display: flex; flex-direction: column; gap: 2rem; overflow-y: auto;">
            <section>
                <h2 style="font-size: 1.8rem; font-weight: 900; letter-spacing: -1px; margin-bottom: 0.5rem;">Seu Painel</h2>
                <p style="color: #64748b;">A estrutura SPA está pronta. O Kanban será integrado aqui em breve.</p>
            </section>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <div style="padding: 1.5rem; background: #f8fafc; border-radius: 16px; border: 1px solid #f1f5f9;">
                    <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; margin-bottom: 0.5rem; letter-spacing: 1px;">TAREFAS HOJE</div>
                    <div style="font-size: 2rem; font-weight: 900;">0</div>
                </div>
                <div style="padding: 1.5rem; background: #f8fafc; border-radius: 16px; border: 1px solid #f1f5f9;">
                    <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; margin-bottom: 0.5rem; letter-spacing: 1px;">HÁBITOS</div>
                    <div style="font-size: 2rem; font-weight: 900;">0</div>
                </div>
            </div>

            <div style="flex: 1; border: 2px dashed #e2e8f0; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-weight: 600;">
                Espaço reservado para o Kanban Modular
            </div>
        </main>
    `;

    // Lógica do Logout
    setTimeout(() => {
        const btnLogout = container.querySelector('#btn-logout');
        if (btnLogout) {
            btnLogout.onclick = () => {
                if (confirm('Deseja realmente sair?')) {
                    localStorage.clear();
                    window.location.hash = '#landing';
                }
            };
        }
    }, 0);

    return container;
};
