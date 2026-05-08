/**
 * Ponto de entrada da aplicação PLOC
 */
import { router } from './router.js';

// Inicialização imediata do roteador
document.addEventListener('DOMContentLoaded', () => {
    console.log('PLOC SPA Initialized');
    router();
});
