/**
 * Roteador Minimalista para PLOC SPA
 */

const routes = {
    'landing': async () => {
        const { renderLandingPage } = await import('./components/LandingPage.js');
        return renderLandingPage();
    },
    'login': async () => {
        const { renderLogin } = await import('./components/LoginPage.js');
        return renderLogin();
    },
    'register': async () => {
        const { renderRegister } = await import('./components/RegisterPage.js');
        return renderRegister();
    },
    'dashboard': async () => {
        const { renderDashboard } = await import('./components/DashboardPage.js');
        return renderDashboard();
    }
};

export const router = async () => {
    const app = document.getElementById('app');
    if (!app) return;

    const hash = window.location.hash.slice(1) || 'landing';
    
    // Lógica básica de proteção de rota
    const token = localStorage.getItem('token');
    // REMOVIDO: Não forçar login para ver o dashboard premium

    // Se estiver logado, não precisa ver landing/login/register
    if (token && (hash === 'landing' || hash === 'login' || hash === 'register')) {
        window.location.hash = '#dashboard';
        return;
    }

    // Ponto de entrada padrão
    if (!hash || hash === '') {
        window.location.hash = '#landing';
        return;
    }

    const renderFunc = routes[hash] || routes['dashboard'];
    
    try {
        app.innerHTML = ''; // Limpa o palco
        const view = await renderFunc();
        app.appendChild(view);
    } catch (error) {
        console.error('Erro ao carregar rota:', error);
        app.innerHTML = `<div style="padding: 2rem; color: red;">Erro ao carregar a página: ${error.message}</div>`;
    }
};

// Listener para mudanças na URL
window.addEventListener('hashchange', router);

