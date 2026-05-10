import { createPlocAvatar } from '../../shared/components/PlocAvatar.js?v=0.0.9';
import { initChatLogic } from '../chat/ChatWidget.js?v=0.0.9';

export const renderDashboard = () => {
    const container = document.createElement('div');
    container.className = 'dashboard-container';

    // Recupera dados do usuário
    const user = JSON.parse(localStorage.getItem('ploc_user') || '{}');
    const userName = user.name || 'MESTRE';

    container.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <!-- Header do Dashboard -->
            <header class="dashboard-header" style="display: flex; align-items: center; gap: 1rem;">
                <div id="btn-back-landing" class="flex-center" style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.05); cursor: pointer;">
                    <span class="material-symbols-rounded">arrow_back</span>
                </div>
                <div style="flex: 1;">
                    <h1 style="font-size: 1.5rem; margin: 0; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">
                        OLÁ, ${userName.split(' ')[0]}
                    </h1>
                    <p style="color: var(--text-dim); font-size: 0.8rem; margin: 0.5rem 0 0 0;">Seu sócio está pronto para agir.</p>
                </div>
                
                <!-- Cápsula Camaleão (Transformável) -->
                <div id="capsule-container" class="glass-pill" style="
                    display: flex; align-items: center; padding: 0.4rem;
                    cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative; min-width: 100px; justify-content: space-between;
                ">
                    <!-- Estado Inicial: Foto e Nome -->
                    <div id="capsule-user" class="flex-center" style="gap: 0.8rem; padding: 0 0.6rem;">
                        <div style="
                            width: 32px; height: 32px; border-radius: 50%;
                            background: linear-gradient(145deg, var(--accent), #1d4ed8);
                            display: flex; align-items: center; justify-content: center;
                            overflow: hidden;
                        ">
                            <span class="material-symbols-rounded" style="font-size: 1.1rem;">person</span>
                        </div>
                        <span style="font-size: 0.75rem; font-weight: 700; letter-spacing: 1px;">${userName.split(' ')[0]}</span>
                    </div>

                    <div id="capsule-actions" style="display: none; align-items: center; gap: 0.6rem; width: 100%; justify-content: space-around;">
                        <div id="do-logout" class="flex-center" style="width: 42px; height: 22px; border-radius: 12px; background: #ef4444;">
                            <span style="font-size: 0.55rem; font-weight: 800; color: #fff;">SAIR</span>
                        </div>
                        <div id="go-routines" class="flex-center" style="width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.1);">
                            <span class="material-symbols-rounded" style="font-size: 1rem; color: #eab308;">auto_awesome</span>
                        </div>
                        <div id="go-settings" class="flex-center" style="width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.1);">
                            <span class="material-symbols-rounded" style="font-size: 1rem; color: var(--accent);">settings</span>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Cards de Resumo -->
            <div class="grid-2" style="margin-bottom: 2rem;">
                <div id="btn-routines-card" class="stat-card accent" style="cursor: pointer;">
                    <span class="material-symbols-rounded" style="color: var(--accent); margin-bottom: 1rem;">schedule</span>
                    <h3 style="margin: 0; font-size: 0.8rem; color: var(--accent);">ROTINAS</h3>
                    <p style="font-size: 1.8rem; font-weight: 800; margin: 0.5rem 0 0 0;">--</p>
                </div>
                <div class="stat-card">
                    <span class="material-symbols-rounded" style="color: var(--text-dim); margin-bottom: 1rem;">notifications_active</span>
                    <h3 style="margin: 0; font-size: 0.8rem; color: var(--text-dim);">ALERTAS</h3>
                    <p style="font-size: 1.8rem; font-weight: 800; margin: 0.5rem 0 0 0;">03</p>
                </div>
            </div>

            <!-- CENTRO DE INTELIGÊNCIA: O PLOC AVATAR -->
            <div id="ploc-avatar-container" class="flex-center" style="
                margin: 2rem 0; height: 180px; position: relative;
                animation: fadeIn 1s ease;
            ">
                <!-- O Avatar será injetado aqui via JS -->
            </div>

            <div id="ploc-status-text" style="text-align: center; color: var(--text-dim); font-size: 0.8rem; margin-bottom: 3rem; letter-spacing: 1px;">
                CLIQUE NO <span style="color: var(--accent); font-weight: 800;">PLOC</span> PARA CONVERSAR
            </div>

            <!-- Lista de Atividades Recentes -->
            <section>
                <h2 style="font-size: 1rem; margin-bottom: 1.5rem; letter-spacing: 2px;">ATIVIDADES RECENTES</h2>
                <div class="flex-column" style="gap: 1rem;">
                    <div class="activity-item">
                        <div style="width: 10px; height: 10px; background: #22c55e; border-radius: 50%;"></div>
                        <span style="font-size: 0.9rem;">Meta diária de hidratação batida!</span>
                    </div>
                </div>
            </section>
        </div>
    `;

    // Injeta o Avatar e Inicializa Lógica de IA
    const avatarContainer = container.querySelector('#ploc-avatar-container');
    const plocAvatar = createPlocAvatar();
    avatarContainer.appendChild(plocAvatar);
    
    initChatLogic(); // Inicializa a ponte cognitiva

    setTimeout(() => {
        // --- LÓGICA DA CÁPSULA CAMALEÃO ---
        const capsule = container.querySelector('#capsule-container');
        const capUser = container.querySelector('#capsule-user');
        const capActions = container.querySelector('#capsule-actions');
        const btnLogout = container.querySelector('#do-logout');
        const btnSettings = container.querySelector('#go-settings');

        if (capsule) {
            capsule.onclick = (e) => {
                e.stopPropagation();
                const isOpen = capActions.style.display === 'flex';
                if (!isOpen) {
                    capUser.style.display = 'none';
                    capActions.style.display = 'flex';
                    capsule.style.minWidth = '100px';
                } else {
                    capUser.style.display = 'flex';
                    capActions.style.display = 'none';
                    capsule.style.minWidth = '100px';
                }
            };
            document.addEventListener('click', () => {
                capUser.style.display = 'flex';
                capActions.style.display = 'none';
                capsule.style.minWidth = '120px';
            });
        }

        if (btnLogout) {
            btnLogout.onclick = () => {
                localStorage.removeItem('ploc_token');
                localStorage.removeItem('ploc_user');
                window.location.hash = '#landing';
                window.location.reload();
            };
        }

        if (btnSettings) {
            btnSettings.onclick = () => {
                window.location.hash = '#settings';
            };
        }

        const btnGoRoutines = container.querySelector('#go-routines');
        if (btnGoRoutines) {
            btnGoRoutines.onclick = (e) => {
                e.stopPropagation();
                window.location.hash = '#routines';
            };
        }

        const btnRoutinesCard = container.querySelector('#btn-routines-card');
        if (btnRoutinesCard) {
            btnRoutinesCard.onclick = () => {
                window.location.hash = '#routines';
            };
        }

        const btnBackLanding = container.querySelector('#btn-back-landing');
        if (btnBackLanding) {
            btnBackLanding.onclick = () => {
                window.location.hash = '#landing';
            };
        }

    }, 0);

    return container;
};
