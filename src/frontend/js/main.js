import { LandingView } from './components/LandingView.js';
import { LoginView } from './components/LoginView.js';
import { RegisterView } from './components/RegisterView.js';
import { DashboardView } from './components/DashboardView.js';
import { authService } from './api/auth.js';

/**
 * Maestro SPA (Router & Controller)
 */
const Router = {
    routes: {
        'landing': LandingView,
        'login': LoginView,
        'register': RegisterView,
        'dashboard': DashboardView
    },

    appElement: document.getElementById('app'),

    async navigate(route) {
        const view = this.routes[route];
        if (!view) return this.navigate('landing');

        // Limpar e Injetar
        this.appElement.innerHTML = view.render();
        
        // Inicializar Lógica da View
        if (view.init) await view.init();
        
        console.log(`🚀 Navegou para: ${route}`);
    },

    init() {
        // Ouvir eventos de navegação customizados
        window.addEventListener('navigate', (e) => {
            this.navigate(e.detail);
        });

        // Verificação Inicial de Rota
        const user = authService.getUser();
        if (user) {
            this.navigate('dashboard');
        } else {
            this.navigate('landing');
        }
    }
};

// Iniciar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    Router.appElement = document.getElementById('app');
    Router.init();
});
