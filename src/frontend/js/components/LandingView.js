import { Avatar } from './Avatar.js';

export const LandingView = {
    render: () => {
        return `
            <div class="landing-view">
                <div id="avatar-anchor"></div>
                <div class="hero-content">
                    <h1 class="stage-title" id="ploc-greeting">PLOC</h1>
                    <p class="hero-subtitle">O seu sócio inteligente para gestão e produtividade.</p>
                    <div class="cta-group">
                        <button id="btn-start" class="btn-primary">Começar Agora</button>
                    </div>
                </div>
            </div>
        `;
    },

    init: () => {
        Avatar.init('avatar-anchor');
        
        const btnStart = document.getElementById('btn-start');
        if (btnStart) {
            btnStart.addEventListener('click', () => {
                // Dispara evento customizado ou navegação direta
                window.dispatchEvent(new CustomEvent('navigate', { detail: 'login' }));
            });
        }
    }
};
