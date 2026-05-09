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
    'dashboard': async () => {
        const { renderDashboard } = await import('./components/DashboardPage.js');
        return renderDashboard();
    },
    'settings': async () => {
        const { SettingsPage } = await import('./components/SettingsPage.js');
        const container = document.createElement('div');
        container.innerHTML = SettingsPage.render();
        setTimeout(() => SettingsPage.afterRender(container), 0);
        return container;
    }
};

export const router = async () => {
    const app = document.getElementById('app');
    if (!app) return;

    const hash = window.location.hash.slice(1) || 'landing';
    const renderFunc = routes[hash] || routes['landing'];
    
    try {
        app.innerHTML = ''; 
        const view = await renderFunc();
        if (view instanceof HTMLElement) {
            app.appendChild(view);
        }
    } catch (error) {
        console.error('Erro ao carregar rota:', error);
        app.innerHTML = `<div style="padding: 2rem; color: red;">Erro ao carregar a página: ${error.message}</div>`;
    }
};

// Listeners
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

export const navigateTo = (hash) => {
    window.location.hash = hash;
};
