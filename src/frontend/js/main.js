import { Avatar } from './components/Avatar.js';
import { Modal } from './components/Modal.js';
import { LoginForm } from './components/LoginForm.js';
import { authService } from './api/auth.js';

/**
 * Maestro do Palco (Main Logic)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o Ploc (Avatar)
    Avatar.init('avatar-anchor');

    // 2. Verifica se o usuário está logado
    const user = authService.getUser();
    const greetingEl = document.getElementById('ploc-greeting');

    if (!user) {
        // --- CENÁRIO: DESLOGADO ---
        Avatar.setState(Avatar.states.SLEEPING);
        greetingEl.innerText = "Ploc está dormindo...";

        // Abre o Modal de Login (Não deixa fechar clicando fora para forçar o login)
        setTimeout(() => {
            Modal.open(LoginForm.render(), false); 
            LoginForm.initEvents();
        }, 800);

    } else {
        // --- CENÁRIO: LOGADO ---
        Avatar.setState(Avatar.states.WORKING);
        greetingEl.innerText = `Olá, ${user.name || 'Sócio'}! Ploc está trabalhando.`;
        
        // Em breve: Aqui liberamos as sidebars e o input de chat
        console.log("✅ Usuário autenticado. Palco liberado.");
    }
});
