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

        <main style="flex: 1; padding: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; text-align: center;">
            <div style="margin-bottom: 1rem;">
                <h2 style="font-size: 1.8rem; font-weight: 900; letter-spacing: -1px; margin: 0;">Status do Sistema</h2>
                <p style="color: #64748b; margin-top: 0.5rem;">Verificando conexão com o banco de dados real...</p>
            </div>

            <!-- Indicador de Conexão -->
            <div id="conn-status" style="width: 80px; height: 80px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; transition: all 0.5s ease; box-shadow: 0 0 0 8px rgba(226, 232, 240, 0.2);">
                <div id="conn-inner" style="width: 20px; height: 20px; border-radius: 50%; background: #fff; animation: pulse 2s infinite;"></div>
            </div>

            <div id="conn-text" style="font-weight: 700; font-size: 0.9rem; letter-spacing: 1px; color: #94a3b8; text-transform: uppercase;">
                Testando...
            </div>

            <style>
                @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.5; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(0.95); opacity: 0.5; }
                }
            </style>
        </main>
    `;

    // Lógica de Teste de Conexão
    setTimeout(async () => {
        const statusCircle = container.querySelector('#conn-status');
        const statusText = container.querySelector('#conn-text');
        
        try {
            // Chamada real para a API
            const response = await apiClient.get('/health');
            
            if (response && response.status === "Healthy") {
                statusCircle.style.background = '#22c55e'; // Verde
                statusCircle.style.boxShadow = '0 0 25px rgba(34, 197, 94, 0.4)';
                statusText.innerText = 'CONECTADO';
                statusText.style.color = '#22c55e';
            } else {
                throw new Error();
            }
        } catch (error) {
            statusCircle.style.background = '#ef4444'; // Vermelho
            statusCircle.style.boxShadow = '0 0 25px rgba(239, 68, 68, 0.4)';
            statusText.innerText = 'DESCONECTADO';
            statusText.style.color = '#ef4444';
        }

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
