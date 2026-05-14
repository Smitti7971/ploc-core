/**
 * Roteador Minimalista para PLOC SPA
 */

const routes = {
    'landing': async () => {
        const { default: LandingPage } = await import('../features/auth/LandingPage.js?v=0.1.3');
        return LandingPage.render();
    },
    'dashboard': async () => {
        const { default: DashboardPage } = await import('../features/dashboard/DashboardPage.js?v=0.1.3');
        return DashboardPage.render();
    },
    'calendar': async () => {
        const { default: CalendarPage } = await import('../features/calendar/CalendarPage.js?v=0.1.3');
        return CalendarPage.render();
    },
    'kanban': async () => {
        const { default: KanbanPage } = await import('../features/tasks/KanbanPage.js?v=0.1.3');
        return KanbanPage.render();
    },
    'settings': async () => {
        const { SettingsPage } = await import('../features/settings/SettingsPage.js?v=0.1.3');
        return SettingsPage.render();
    },
    'user-settings': async () => {
        const { UserSettingsPage } = await import('../features/settings/UserSettingsPage.js?v=0.1.3');
        return UserSettingsPage.render();
    },
    'routines': async () => {
        const { default: RoutinesPage } = await import('../features/routines/RoutinesPage.js?v=0.1.3');
        return RoutinesPage.render();
    },
    'dev-insights': async () => {
        const { default: DevInsightsPage } = await import('../features/dev-insights/DevInsightsPage.js?v=0.1.3');
        return DevInsightsPage.render();
    }
};

export const router = async () => {
    const app = document.getElementById('app');
    if (!app) return;

    const hash = window.location.hash.slice(1) || 'landing';
    
    // Lista de rotas que exigem autenticação
    const protectedRoutes = ['dashboard', 'calendar', 'kanban', 'settings', 'user-settings', 'routines', 'dev-insights'];
    const token = localStorage.getItem('ploc_token');

    if (protectedRoutes.includes(hash) && !token) {
        console.warn('Acesso negado: Token não encontrado.');
        window.location.hash = '#landing';
        return;
    }

    const renderFunc = routes[hash] || routes['landing'];
    
    try {
        app.innerHTML = ''; 
        const view = await renderFunc();
        
        if (typeof view === 'string') {
            app.innerHTML = view;
        } else if (view instanceof HTMLElement) {
            app.appendChild(view);
        }

        // Atualiza a interface do Mascote Único APÓS a página estar no DOM
        if (window.updatePlocUI) {
            window.updatePlocUI(hash);
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
