import { apiClient } from '../../shared/api/client.js?v=0.1.3';

/**
 * LandingPage - Experiência de Entrada do Ploc
 */
const LandingPage = {
    render: async () => {
        const token = localStorage.getItem('ploc_token');
        const user = token ? JSON.parse(localStorage.getItem('ploc_user') || '{}') : null;

        const menuItems = [
            { icon: 'dashboard', route: '#dashboard' },
            { icon: 'calendar_month', route: '#calendar' },
            { icon: 'task_alt', route: '#kanban' },
            { icon: 'analytics', route: '#finance' },
            { icon: 'volunteer_activism', route: '#health' },
            { icon: 'auto_awesome', route: '#routines' },
            { icon: 'person_4', route: '#user-settings' },
            { icon: 'settings', route: '#settings' }
        ];

        // Lógica de pós-renderização (Eventos)
        setTimeout(() => {
            const container = document.getElementById('landing-container');
            if (!container) return;

            // --- Lógica de Status Online ---
            const statusDot = container.querySelector('#status-dot');
            const checkStatus = async () => {
                try {
                    await apiClient.get('/health');
                    if (statusDot) statusDot.style.background = '#22c55e';
                } catch (e) {
                    if (statusDot) statusDot.style.background = '#ef4444';
                }
            };
            checkStatus();

            // --- Lógica da Gaveta (Drawer) ---
            const bottomPanel = container.querySelector('#bottom-panel');
            const drawerCloser = container.querySelector('#drawer-closer');

            if (bottomPanel) bottomPanel.onclick = () => {
                if (!bottomPanel.classList.contains('active')) {
                    bottomPanel.classList.add('active');
                }
            };

            if (drawerCloser) drawerCloser.onclick = (e) => {
                if (bottomPanel.classList.contains('active')) {
                    e.stopPropagation();
                    bottomPanel.classList.remove('active');
                }
            };

            // --- Navegação do Menu ---
            container.querySelectorAll('.menu-btn').forEach(btn => {
                btn.onclick = () => {
                    const route = btn.getAttribute('data-route');
                    if (route) window.location.hash = route;
                };
            });

            // --- Lógica da Cápsula Camaleão Unificada ---
            const capsule = container.querySelector('#user-capsule-container');
            const contentProfile = container.querySelector('#content-profile');
            const contentActions = container.querySelector('#content-actions');

            if (capsule) {
                const openCapsule = () => {
                    if (contentActions.style.display === 'flex') return;
                    contentProfile.style.opacity = '0';
                    setTimeout(() => {
                        contentProfile.style.display = 'none';
                        contentActions.style.display = 'flex';
                        setTimeout(() => contentActions.style.opacity = '1', 10);
                    }, 300);
                };

                const closeCapsule = () => {
                    if (contentActions.style.display !== 'flex') return;
                    contentActions.style.opacity = '0';
                    setTimeout(() => {
                        contentActions.style.display = 'none';
                        contentProfile.style.display = 'flex';
                        setTimeout(() => contentProfile.style.opacity = '1', 10);
                    }, 300);
                };

                capsule.onclick = (e) => {
                    e.stopPropagation();
                    openCapsule();
                };

                window.addEventListener('click', (e) => {
                    if (capsule && !capsule.contains(e.target)) closeCapsule();
                });

                const logoutBtn = container.querySelector('#do-logout');
                if (logoutBtn) logoutBtn.onclick = (e) => {
                    e.stopPropagation();
                    localStorage.removeItem('ploc_token');
                    localStorage.removeItem('ploc_user');
                    window.location.reload();
                };

                const settingsBtn = container.querySelector('#go-settings');
                if (settingsBtn) settingsBtn.onclick = (e) => {
                    e.stopPropagation();
                    window.location.hash = '#user-settings';
                };
            }

            const loginTrigger = container.querySelector('#login-trigger');
            if (loginTrigger) loginTrigger.onclick = () => AuthModal.open('login');

            // --- Listener para Atualização em Tempo Real da Cápsula ---
            window.addEventListener('ploc_user_updated', (e) => {
                const updatedUser = e.detail;
                const avatarEl = container.querySelector('#capsule-avatar');
                const nameEl = container.querySelector('#content-profile span');

                if (avatarEl) {
                    avatarEl.innerHTML = (updatedUser.profilePhoto)
                        ? `<img src="${updatedUser.profilePhoto}" style="width: 100%; height: 100%; object-fit: cover;">`
                        : (updatedUser.username || updatedUser.name || 'U').charAt(0).toUpperCase();
                }
                if (nameEl) {
                    nameEl.innerText = updatedUser.username || updatedUser.name?.split(' ')[0] || 'Usuário';
                }
            });

        }, 0);

        // Retornamos a String HTML que será injetada pelo Router
        return `
            <div id="landing-container" class="landing-page" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at top right, #1e293b 0%, #020617 100%); z-index: 9999; display: flex; flex-direction: column; justify-content: center; align-items: center; overflow: hidden; font-family: 'Inter', sans-serif;">
                
                <!-- Overlay de Partículas ou Textura (Opcional, mas dá o toque Premium) -->
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('https://www.transparenttextures.com/patterns/dark-matter.png'); opacity: 0.1; pointer-events: none;"></div>

                <div id="network-status" style="position: absolute; top: 1.5rem; left: 1.5rem; z-index: 1000;">
                    <div id="status-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #94a3b8; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 15px rgba(148, 163, 184, 0.3);"></div>
                </div>

                <div id="user-capsule-mount" style="position: absolute; top: 1.5rem; right: 1.5rem; z-index: 1000;">
                    ${token ? `
                        <div id="user-capsule-container" class="glass-pill" style="display: flex; align-items: center; padding: 4px; gap: 12px; cursor: pointer; min-width: 50px; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.3); background: rgba(15, 23, 42, 0.6);">
                            <div id="capsule-avatar" style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #38bdf8, #1d4ed8); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.9rem; color: #fff; flex-shrink: 0; overflow: hidden; border: 2px solid rgba(255,255,255,0.1);">
                                ${user?.profilePhoto ? `<img src="${user.profilePhoto}" style="width: 100%; height: 100%; object-fit: cover;">` : (user?.username || user?.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            
                            <div id="content-profile" style="display: flex; flex-direction: column; justify-content: center; padding-right: 12px; transition: all 0.4s ease;">
                                <span style="font-size: 0.85rem; color: #fff; font-weight: 800; letter-spacing: 0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
                                    ${(() => {
                    try {
                        const userData = JSON.parse(localStorage.getItem('ploc_user') || '{}');
                        return userData.username || userData.name?.split(' ')[0] || 'USUÁRIO';
                    } catch (e) { return 'USUÁRIO'; }
                })()}
                                </span>
                            </div>

                            <div id="content-actions" style="display: none; align-items: center; gap: 10px; opacity: 0; transition: all 0.4s ease;">
                                <div id="go-settings" class="flex-center" style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.1); hover: background: rgba(56, 189, 248, 0.2);">
                                    <span class="material-symbols-rounded" style="font-size: 1.3rem; color: #38bdf8;">settings</span>
                                </div>
                                <div id="do-logout" style="padding: 6px 14px; border-radius: 20px; background: #ef4444; color: #fff; font-size: 0.65rem; font-weight: 900; letter-spacing: 1.5px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">SAIR</div>
                            </div>
                        </div>
                    ` : `
                        <div id="login-trigger" class="glass-pill" style="padding: 10px 24px; color: #fff; font-size: 0.75rem; font-weight: 800; letter-spacing: 3px; cursor: pointer; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);">ACESSAR</div>
                    `}
                </div>

                <!-- Mount Point do Mascote (Centralizado) -->
                <div class="flex-column" style="position: relative; z-index: 5; margin-bottom: 80px;">
                    <div id="ploc-mount" style="width: 140px; height: 140px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.5));"></div>
                </div>

                <!-- Painel Inferior (Drawer) Estilizado -->
                <div id="bottom-panel" class="bottom-panel" style="background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(30px) saturate(180%); -webkit-backdrop-filter: blur(30px) saturate(180%); border-top: 1px solid rgba(255,255,255,0.1); box-shadow: 0 -10px 40px rgba(0,0,0,0.5);">
                    <div id="drawer-closer" style="width: 100%; height: 60px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease;">
                        <div id="panel-handle" style="width: 40px; height: 4px; background: rgba(255,255,255,0.3); border-radius: 10px; box-shadow: 0 0 10px rgba(255,255,255,0.1);"></div>
                    </div>
                    <div id="drawer-content" class="drawer-grid" style="padding-bottom: 40px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px 10px;">
                        ${menuItems.map(item => `
                            <div class="menu-btn" data-route="${item.route}" style="cursor: pointer; display: flex; align-items: center; justify-content: center;">
                                <span class="material-symbols-rounded" style="font-size: 1.8rem; color: #94a3b8;">${item.icon}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div id="footer-trigger" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 70px; cursor: pointer; z-index: 200; display: flex; align-items: flex-start; justify-content: center;">
                    <div style="margin-top: 15px; width: 30px; height: 3px; background: rgba(255,255,255,0.1); border-radius: 10px;"></div>
                </div>

                <style>
                    .menu-btn:hover .icon-wrap {
                        background: rgba(56, 189, 248, 0.15);
                        border-color: #38bdf8;
                        transform: translateY(-5px);
                        box-shadow: 0 10px 20px rgba(56, 189, 248, 0.2);
                    }
                    .menu-btn:hover .material-symbols-rounded {
                        color: #38bdf8;
                    }
                </style>
            </div>
        `;
    }
};

const AuthModal = {
    open: (type = 'login') => {
        const existing = document.getElementById('auth-modal-root');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'auth-modal-root';
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); backdrop-filter: blur(15px);
            display: flex; align-items: center; justify-content: center; z-index: 10010;
            animation: fadeIn 0.3s ease; font-family: 'Inter', sans-serif;
            opacity: 1; pointer-events: all;
        `;

        const updateModal = (currentType) => {
            const isLogin = currentType === 'login';
            modal.innerHTML = `
                <div id="login-modal-card" style="width: 90%; max-width: 400px; padding: 2.5rem; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(40px) saturate(200%); -webkit-backdrop-filter: blur(40px) saturate(200%); border-radius: 28px; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6); display: flex; flex-direction: column; gap: 1.5rem; transform: scale(0.9); transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden; font-family: 'Inter', sans-serif;">
                    
                    <div id="close-modal" style="position: absolute; top: 1.2rem; right: 1.2rem; cursor: pointer; color: rgba(255,255,255,0.4); transition: color 0.3s;">
                        <span class="material-symbols-rounded">close</span>
                    </div>

                    <div style="text-align: center; margin-bottom: 0.5rem;">
                        <h2 style="color: #fff; font-size: 1.4rem; font-weight: 900; letter-spacing: 1px; margin: 0;">PLOC <span style="color: #38bdf8;">${isLogin ? 'LOGIN' : 'CADASTRO'}</span></h2>
                        <p style="color: #94a3b8; font-size: 0.8rem; margin-top: 4px;">${isLogin ? 'Sua produtividade inteligente começa aqui.' : 'Crie sua conta e comece agora.'}</p>
                    </div>

                    <form id="auth-form-element" style="display: flex; flex-direction: column; gap: 1.2rem;">
                        <input type="email" id="auth-email" placeholder="E-mail" style="width: 100%; background: rgba(0,0,0,0.3); border: 1.5px solid rgba(255,255,255,0.1); padding: 1.1rem; border-radius: 16px; color: #fff; outline: none; font-size: 0.95rem; transition: border-color 0.3s;" required>
                        <input type="password" id="auth-password" placeholder="Senha" style="width: 100%; background: rgba(0,0,0,0.3); border: 1.5px solid rgba(255,255,255,0.1); padding: 1.1rem; border-radius: 16px; color: #fff; outline: none; font-size: 0.95rem; transition: border-color 0.3s;" required>
                        
                        ${!isLogin ? `
                            <input type="password" id="auth-confirm" placeholder="Confirmar Senha" style="width: 100%; background: rgba(0,0,0,0.3); border: 1.5px solid rgba(255,255,255,0.1); padding: 1.1rem; border-radius: 16px; color: #fff; outline: none; font-size: 0.95rem; transition: border-color 0.3s;" required>
                        ` : ''}

                        <div id="auth-error-log" style="color: #ef4444; font-size: 0.75rem; text-align: center; display: none; padding: 0.8rem; background: rgba(239, 68, 68, 0.1); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.2);"></div>

                        <button type="submit" id="auth-btn" style="background: linear-gradient(135deg, #38bdf8, #1d4ed8); color: #fff; padding: 1.1rem; border-radius: 18px; text-align: center; font-weight: 900; font-size: 0.95rem; cursor: pointer; border: none; margin-top: 0.5rem; box-shadow: 0 10px 25px rgba(29, 78, 216, 0.4); letter-spacing: 1px; transition: all 0.3s;">
                            ${isLogin ? 'ACESSAR' : 'CRIAR CONTA'}
                        </button>
                    </form>

                    <div style="text-align: center; margin-top: 0.5rem;">
                        <p id="switch-auth" style="color: #94a3b8; font-size: 0.8rem; cursor: pointer; font-weight: 500;">
                            ${isLogin ? 'Novo por aqui? <span style="color: #38bdf8; font-weight: 800;">Cadastre-se</span>' : 'Já tem conta? <span style="color: #38bdf8; font-weight: 800;">Faça login</span>'}
                        </p>
                    </div>

                    <style>
                        #login-modal-card input:focus { border-color: #38bdf8 !important; background: rgba(56, 189, 248, 0.05) !important; }
                        #close-modal:hover { color: #fff !important; }
                        #auth-btn:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(29, 78, 216, 0.5); }
                        #auth-btn:active { transform: scale(0.98); }
                    </style>
                </div>
            `;

            const form = modal.querySelector('#auth-form-element');
            const switchBtn = modal.querySelector('#switch-auth');
            const closeBtn = modal.querySelector('#close-modal');

            // Trigger entrance animation
            setTimeout(() => modal.querySelector('#login-modal-card').style.transform = 'scale(1)', 10);

            switchBtn.onclick = () => updateModal(isLogin ? 'register' : 'login');
            closeBtn.onclick = () => modal.remove();

            form.onsubmit = async (e) => {
                e.preventDefault();
                const btn = modal.querySelector('#auth-btn');
                const errorLog = modal.querySelector('#auth-error-log');
                const email = modal.querySelector('#auth-email').value;
                const password = modal.querySelector('#auth-password').value;

                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.innerText = 'PROCESSANDO...';
                errorLog.style.display = 'none';

                try {
                    const endpoint = isLogin ? '/auth/login' : '/auth/register';
                    const data = await apiClient.post(endpoint, { email, password });
                    localStorage.setItem('ploc_token', data.token);
                    localStorage.setItem('ploc_user', JSON.stringify(data.user));
                    modal.remove();
                    window.location.hash = '#dashboard';
                } catch (err) {
                    errorLog.innerText = err.message || 'Falha na conexão';
                    errorLog.style.display = 'block';
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    btn.innerText = isLogin ? 'ACESSAR CONTA' : 'CRIAR CONTA';
                }
            };
        };

        updateModal(type);
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        document.body.appendChild(modal);
    }
};

export default LandingPage;
export { AuthModal };
