import { createPlocAvatar } from '../../shared/components/PlocAvatar.js?v=0.0.9';
import { apiClient } from '../../shared/api/client.js?v=0.0.9';
import { initChatLogic } from '../chat/ChatWidget.js?v=0.0.9';

/**
 * Landing Page - A "cara" do PLOC AI
 * O ponto de entrada principal onde o Avatar interage com o usuário.
 */
export const renderLandingPage = () => {
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
        z-index: 9999; display: flex; justify-content: center; align-items: center;
        overflow: hidden; font-family: 'Inter', sans-serif;
    `;

    const menuItems = [
        { icon: 'dashboard', label: 'Dashboard', route: '#dashboard' },
        { icon: 'calendar_today', label: 'Calendário', route: '#calendar' },
        { icon: 'hub', label: 'Social', route: '#social' },
        { icon: 'repeat', label: 'Rotinas', route: '#routines' },
        { icon: 'view_kanban', label: 'Kanban', route: '#kanban' },
        { icon: 'notifications', label: 'Alertas', route: '#alerts' },
        { icon: 'mail', label: 'Mensagens', route: '#messages' },
        { icon: 'settings', label: 'Configurações', route: '#settings' }
    ];

    container.innerHTML = `
        <!-- Indicador de Status de Rede Minimalista -->
        <div id="network-status" style="position: absolute; top: 1.5rem; left: 1.5rem; z-index: 1000;">
            <div id="status-dot" style="width: 8px; height: 8px; border-radius: 50%; background: #94a3b8; transition: all 0.3s ease;"></div>
        </div>

        <!-- Botão de Login ou Perfil no Topo -->
        <div id="auth-area" class="auth-area-top" style="position: absolute; top: 1.5rem; right: 1.5rem; z-index: 1000;">
            ${localStorage.getItem('ploc_token') ? `
                <div id="user-capsule-container" class="glass-pill" style="
                    display: flex; align-items: center; padding: 0.4rem;
                    cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative; min-width: 100px; justify-content: space-between;
                    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                ">
                    <!-- Estado Inicial: Foto e Nome -->
                    <div id="capsule-user" class="flex-center" style="gap: 0.8rem; padding: 0 0.6rem;">
                        <div style="
                            width: 28px; height: 28px; border-radius: 50%;
                            background: linear-gradient(145deg, var(--accent), #1d4ed8);
                            display: flex; align-items: center; justify-content: center;
                            overflow: hidden;
                        ">
                            <span class="material-symbols-rounded" style="font-size: 1rem; color: #fff;">person</span>
                        </div>
                        <span style="font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; color: #fff; text-transform: uppercase;">
                            ${JSON.parse(localStorage.getItem('ploc_user') || '{}').name?.split(' ')[0] || 'MESTRE'}
                        </span>
                    </div>

                    <!-- Estado Transformado: Sair (Esquerda) e Settings (Direita) -->
                    <div id="capsule-actions" style="display: none; align-items: center; gap: 0.8rem; width: 100%; justify-content: space-around;">
                        <div id="do-logout" class="flex-center" style="width: 50px; height: 24px; border-radius: 12px; background: #ef4444;">
                            <span style="font-size: 0.6rem; font-weight: 800; color: #fff;">SAIR</span>
                        </div>
                        <div id="go-settings" class="flex-center" style="width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.1);">
                            <span class="material-symbols-rounded" style="font-size: 1rem; color: var(--accent);">settings</span>
                        </div>
                    </div>
                </div>
            ` : `
                <div id="login-trigger" class="glass-pill" style="padding: 0.6rem 1.5rem; color: #fff; font-size: 0.7rem; font-weight: 700; letter-spacing: 2px; cursor: pointer;">LOGIN</div>
            `}
        </div>

        <div id="login-modal" class="modal-overlay" style="z-index: 1000; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(40px);">
            <div id="login-card" class="login-modal-card">
                <div class="flex-center" style="justify-content: space-between; margin-bottom: 1rem;">
                    <div id="reset-login" class="flex-center" style="gap: 1rem; cursor: pointer;">
                        <h2 style="color: #fff; margin: 0; font-weight: 800; letter-spacing: 5px; font-size: 2rem;">PLOC</h2>
                    </div>
                    <span id="close-login" class="material-symbols-rounded" style="color: #fff; cursor: pointer; opacity: 0.3;">close</span>
                </div>
                <div id="auth-triggers" style="display: flex; gap: 2rem; width: 100%; justify-content: center;">
                    <button id="trigger-login" class="auth-trigger-btn" style="
                        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                        color: white; border: none; padding: 1rem 2rem; border-radius: 15px;
                        font-weight: 800; letter-spacing: 2px; cursor: pointer; flex: 1;
                        box-shadow: 0 10px 20px rgba(34, 197, 94, 0.2);
                    ">LOGIN</button>
                    <button id="trigger-register" class="auth-trigger-btn" style="
                        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                        color: white; border: none; padding: 1rem 2rem; border-radius: 15px;
                        font-weight: 800; letter-spacing: 2px; cursor: pointer; flex: 1;
                        box-shadow: 0 10px 20px rgba(59, 130, 246, 0.2);
                    ">CADASTRO</button>
                </div>
                <div id="auth-form" class="flex-column" style="gap: 1.5rem; height: 0; opacity: 0; overflow: hidden; transition: all 0.5s ease;">
                    <input type="email" id="input-email" class="auth-input" placeholder="DIGITE SEU E-MAIL">
                    <input type="password" id="input-pass" class="auth-input" placeholder="SENHA">
                    <div id="confirm-pass-container" style="height: 0; opacity: 0; overflow: hidden;">
                        <input type="password" id="input-confirm" class="auth-input" style="width: 100%;" placeholder="CONFIRMAR SENHA">
                    </div>
                    <div class="flex-center" style="justify-content: space-between; margin-top: 1rem;">
                        <span id="btn-back" style="color: rgba(255,255,255,0.3); cursor: pointer; font-size: 0.7rem; letter-spacing: 2px;">VOLTAR</span>
                        <button id="btn-auth-action" class="auth-button">ENTRAR</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex-column" style="position: relative; z-index: 5;">
            <div id="ploc-avatar-mount" style="height: 250px; display: flex; align-items: center; justify-content: center;"></div>
            <div style="text-align: center; color: var(--text-dim); font-size: 0.8rem; margin-top: 1rem; letter-spacing: 2px; opacity: 0.7;">
                CLIQUE NO <span style="color: var(--accent); font-weight: 800;">PLOC</span> PARA CONVERSAR
            </div>
        </div>

        <!-- Painel Inferior (Gaveta Dividida) -->
        <div id="bottom-panel" class="bottom-panel" style="padding: 0;">
            <!-- Parte Superior: Gatilho de Fechamento -->
            <div id="drawer-closer" style="width: 100%; height: 50px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                <div id="panel-handle" class="panel-handle" style="margin-top: 20px;"></div>
            </div>
            
            <!-- Parte Inferior: Conteúdo dos Botões -->
            <div id="drawer-content" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; max-width: 100%; padding: 0 1.5rem 2rem 1.5rem;">
                ${menuItems.map(item => `
                    <div class="menu-btn" data-route="${item.route}" style="cursor: pointer;">
                        <span class="material-symbols-rounded" style="font-size: 1.8rem;">${item.icon}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        <div id="footer-trigger" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 60px; cursor: pointer; z-index: 200;"></div>
    `;

    setTimeout(() => {
        const avatarContainer = container.querySelector('#ploc-avatar-mount');
        if (avatarContainer) {
            avatarContainer.appendChild(createPlocAvatar({ isLanding: true }));
            initChatLogic();
        }

        const loginTrigger = container.querySelector('#login-trigger');
        const loginModal = container.querySelector('#login-modal');
        const closeLogin = container.querySelector('#close-login');
        const triggerLogin = container.querySelector('#trigger-login');
        const triggerRegister = container.querySelector('#trigger-register');
        const authForm = container.querySelector('#auth-form');
        const authTriggers = container.querySelector('#auth-triggers');
        const confirmPassContainer = container.querySelector('#confirm-pass-container');
        const btnAuthAction = container.querySelector('#btn-auth-action');
        const btnBackAuth = container.querySelector('#btn-back');

        let isRegister = false;

        if (loginTrigger) loginTrigger.onclick = () => { loginModal.style.opacity = '1'; loginModal.style.pointerEvents = 'auto'; };
        if (closeLogin) closeLogin.onclick = () => { loginModal.style.opacity = '0'; loginModal.style.pointerEvents = 'none'; };

        const showForm = (register = false) => {
            isRegister = register;
            authTriggers.style.display = 'none';
            authForm.style.height = 'auto';
            authForm.style.opacity = '1';
            authForm.style.overflow = 'visible';
            
            if (register) {
                confirmPassContainer.style.height = 'auto';
                confirmPassContainer.style.opacity = '1';
                confirmPassContainer.style.overflow = 'visible';
                btnAuthAction.innerText = 'CRIAR CONTA';
            } else {
                confirmPassContainer.style.height = '0';
                confirmPassContainer.style.opacity = '0';
                confirmPassContainer.style.overflow = 'hidden';
                btnAuthAction.innerText = 'ENTRAR';
            }
        };

        if (triggerLogin) triggerLogin.onclick = () => showForm(false);
        if (triggerRegister) triggerRegister.onclick = () => showForm(true);
        if (btnBackAuth) btnBackAuth.onclick = () => {
            authTriggers.style.display = 'flex';
            authForm.style.height = '0';
            authForm.style.opacity = '0';
            authForm.style.overflow = 'hidden';
        };

        if (btnAuthAction) {
            btnAuthAction.onclick = async () => {
                const email = container.querySelector('#input-email').value;
                const password = container.querySelector('#input-pass').value;
                const confirmPassword = container.querySelector('#input-confirm').value;

                try {
                    btnAuthAction.innerText = 'CARREGANDO...';
                    let response;
                    
                    if (isRegister) {
                        if (password !== confirmPassword) throw new Error('As senhas não coincidem');
                        response = await apiClient.post('/auth/register', { email, password, name: email.split('@')[0] });
                    } else {
                        response = await apiClient.post('/auth/login', { email, password });
                    }

                    if (response.token) {
                        localStorage.setItem('ploc_token', response.token);
                        localStorage.setItem('ploc_user', JSON.stringify(response.user));
                        window.location.reload(); // Recarrega para entrar no estado logado
                    }
                } catch (e) {
                    alert(e.message || 'Erro na autenticação');
                    btnAuthAction.innerText = isRegister ? 'CRIAR CONTA' : 'ENTRAR';
                }
            };
        }

        const checkConnection = async () => {
            const statusDot = container.querySelector('#status-dot');
            try {
                await apiClient.get('/health');
                if (statusDot) {
                    statusDot.style.background = '#22c55e';
                    statusDot.style.boxShadow = '0 0 10px #22c55e';
                }
            } catch (e) {
                if (statusDot) {
                    statusDot.style.background = '#ef4444';
                    statusDot.style.boxShadow = '0 0 10px #ef4444';
                }
            }
        };
        checkConnection();

        const bottomPanel = container.querySelector('#bottom-panel');
        const footerTrigger = container.querySelector('#footer-trigger');
        const drawerCloser = container.querySelector('#drawer-closer');

        const toggleDrawer = (forceClose = false) => {
            const isOpen = bottomPanel.style.bottom === '0px';
            bottomPanel.style.bottom = (isOpen || forceClose) ? '-200px' : '0px';
        };

        if (footerTrigger) footerTrigger.onclick = (e) => { e.stopPropagation(); toggleDrawer(); };
        if (drawerCloser) drawerCloser.onclick = (e) => { e.stopPropagation(); toggleDrawer(true); };

        // Navegação da Gaveta
        container.querySelectorAll('.menu-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const route = btn.getAttribute('data-route');
                if (route) window.location.hash = route;
            };
        });

        // Lógica da Cápsula Camaleão (Landing Page)
        const capsule = container.querySelector('#user-capsule-container');
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
        }

        if (btnLogout) {
            btnLogout.onclick = (e) => {
                e.stopPropagation();
                localStorage.removeItem('ploc_token');
                localStorage.removeItem('ploc_user');
                window.location.reload(); // Recarrega para voltar ao estado de visitante
            };
        }

        if (btnSettings) {
            btnSettings.onclick = (e) => {
                e.stopPropagation();
                window.location.hash = '#settings';
            };
        }

        // FECHAMENTO INTELIGENTE: Clicou fora da área de botões = Fecha
        document.addEventListener('click', (e) => {
            const isOpen = bottomPanel.style.bottom === '0px';
            if (!isOpen) return;

            const panelRect = bottomPanel.getBoundingClientRect();
            // Se clicar acima da gaveta, fecha
            if (e.clientY < panelRect.top) {
                toggleDrawer(true);
            }
        });

    }, 0);

    return container;
};
