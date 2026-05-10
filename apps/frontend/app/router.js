/**
 * Roteador Minimalista para PLOC SPA
 */

const routes = {
    'landing': async () => {
        const { renderLandingPage } = await import('../features/auth/LandingPage.js');
        return renderLandingPage();
    },
    'login': async () => {
        const { renderLogin } = await import('../features/auth/LoginPage.js');
        return renderLogin();
    },
    'dashboard': async () => {
        const { renderDashboard } = await import('../features/dashboard/DashboardPage.js');
        return renderDashboard();
    },
    'calendar': async () => {
        const { renderCalendarPage } = await import('../features/calendar/CalendarPage.js');
        return renderCalendarPage();
    },
    'kanban': async () => {
        const { renderKanbanPage } = await import('../features/tasks/KanbanPage.js');
        return renderKanbanPage();
    },
    'settings': async () => {
        const { SettingsPage } = await import('../features/settings/SettingsPage.js');
        const container = document.createElement('div');
        container.innerHTML = SettingsPage.render();
        setTimeout(() => SettingsPage.afterRender(container), 0);
        return container;
    },
    'routines': async () => {
        const { renderRoutinesPage } = await import('../features/routines/RoutinesPage.js');
        return renderRoutinesPage();
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
