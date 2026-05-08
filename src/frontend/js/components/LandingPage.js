import { createPlocAvatar } from './PlocAvatar.js';

export const renderLandingPage = () => {
    const container = document.createElement('div');

    Object.assign(container.style, {
        position: 'fixed',
        top: '0', left: '0', right: '0', bottom: '0',
        background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
        zIndex: '9999',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif'
    });

    const menuItems = [
        { icon: 'dashboard', label: 'Dashboard' },
        { icon: 'calendar_today', label: 'Calendário' },
        { icon: 'hub', label: 'Social' },
        { icon: 'repeat', label: 'Rotinas' },
        { icon: 'view_kanban', label: 'Kanban' },
        { icon: 'notifications', label: 'Alertas' },
        { icon: 'mail', label: 'Mensagens' },
        { icon: 'settings', label: 'Configurações' }
    ];

    container.innerHTML = `
        <!-- Botão de Login no Topo (Cápsula) -->
        <div id="login-trigger" style="
            position: absolute; top: 2rem; right: 2rem; padding: 0.6rem 1.5rem;
            background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px);
            border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex; align-items: center; gap: 0.8rem;
            color: #fff; cursor: pointer; transition: all 0.3s ease; z-index: 200;
        ">
            <span class="material-symbols-rounded" style="font-size: 1.2rem;">account_circle</span>
            <span style="font-size: 0.8rem; font-weight: 600; letter-spacing: 2px;">LOGIN</span>
        </div>

        <!-- Modal de Login Interativo -->
        <div id="login-modal" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(40px);
            display: flex; align-items: center; justify-content: center;
            opacity: 0; pointer-events: none; transition: all 0.5s ease; z-index: 1000;
        ">
            <div style="
                width: 90%; max-width: 400px; padding: 4rem 3rem;
                background: rgba(255, 255, 255, 0.04); border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px);
                box-shadow: 0 40px 100px rgba(0,0,0,0.5);
                display: flex; flex-direction: column; gap: 2rem;
                transform: scale(0.9); transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            " id="login-card">
                
                <!-- Header: Mini Ploc + PLOC -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 1rem; cursor: pointer;" id="reset-login">
                        <div style="width: 30px; height: 30px; background: linear-gradient(145deg, #f1f5f9, #cbd5e1); border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                            <div style="display: flex; gap: 4px;">
                                <div style="width: 2px; height: 6px; background: #1e293b; border-radius: 5px;"></div>
                                <div style="width: 2px; height: 6px; background: #1e293b; border-radius: 5px;"></div>
                            </div>
                        </div>
                        <h2 style="color: #fff; margin: 0; font-weight: 800; letter-spacing: 5px; font-size: 2rem;">PLOC</h2>
                    </div>
                    <span id="close-login" class="material-symbols-rounded" style="color: #fff; cursor: pointer; opacity: 0.3;">close</span>
                </div>

                <!-- Gatilhos: LOGIN / CADASTRO -->
                <div id="auth-triggers" style="display: flex; gap: 2rem; transition: all 0.4s ease;">
                    <button id="trigger-login" style="
                        flex: 1; background: transparent; color: #fff; padding: 1rem 0; border: none;
                        border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: 600; cursor: pointer;
                        transition: all 0.4s ease; letter-spacing: 2px; font-size: 0.8rem; text-align: left;
                    ">LOGIN</button>
                    
                    <button id="trigger-register" style="
                        flex: 1; background: transparent; color: #fff; padding: 1rem 0; border: none;
                        border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: 600; cursor: pointer;
                        transition: all 0.4s ease; letter-spacing: 2px; font-size: 0.8rem; text-align: left;
                    ">CADASTRO</button>
                </div>

                <!-- Formulário Dinâmico -->
                <div id="auth-form" style="display: flex; flex-direction: column; gap: 1.5rem; height: 0; opacity: 0; overflow: hidden; transition: all 0.5s ease;">
                    <input type="email" id="input-email" placeholder="DIGITE SEU E-MAIL" style="
                        background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.2);
                        padding: 1rem 0; color: #fff; outline: none; letter-spacing: 2px; font-size: 0.8rem;
                    ">
                    
                    <input type="password" id="input-pass" placeholder="SENHA" style="
                        background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.2);
                        padding: 1rem 0; color: #fff; outline: none; letter-spacing: 2px; font-size: 0.8rem;
                    ">

                    <div id="confirm-pass-container" style="height: 0; opacity: 0; overflow: hidden; transition: all 0.4s ease;">
                        <input type="password" id="input-confirm" placeholder="CONFIRMAR SENHA" style="
                            width: 100%; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.2);
                            padding: 1rem 0; color: #fff; outline: none; letter-spacing: 2px; font-size: 0.8rem;
                        ">
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                        <span id="btn-back" style="color: rgba(255,255,255,0.3); cursor: pointer; font-size: 0.7rem; letter-spacing: 2px;">VOLTAR</span>
                        <button id="btn-auth-action" style="
                            background: #38bdf8; color: #0f172a; padding: 1rem 2rem; border: none;
                            border-radius: 4px; font-weight: 700; cursor: pointer;
                            transition: all 0.3s ease; letter-spacing: 2px;
                        ">ENTRAR</button>
                    </div>
                </div>
                
                <p id="auth-footer" style="color: rgba(255,255,255,0.4); font-size: 0.8rem; text-align: center; margin-top: 1rem;">
                    Esqueceu a senha? <span style="color: #38bdf8; cursor: pointer;">Recuperar</span>
                </p>
            </div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; position: relative; z-index: 5;">
            <!-- O PLOC Central (Ponto de Montagem) -->
            <div id="ploc-avatar-mount"></div>
            <div id="text-trigger" style="margin-top: 0.5rem; cursor: pointer; display: flex; gap: 8px; transition: all 0.4s ease; padding: 10px;">
                <span class="dot" style="width: 10px; height: 10px; background: #38bdf8; border-radius: 50%; animation: dotWave 1.5s infinite 0s;"></span>
                <span class="dot" style="width: 10px; height: 10px; background: #38bdf8; border-radius: 50%; animation: dotWave 1.5s infinite 0.3s;"></span>
                <span class="dot" style="width: 10px; height: 10px; background: #38bdf8; border-radius: 50%; animation: dotWave 1.5s infinite 0.6s;"></span>
            </div>
            <div id="input-container" style="height: 0; opacity: 0; overflow: hidden; transition: all 0.5s ease; transform: translateY(-10px); width: min(90vw, 320px);">
                <input type="text" id="ploc-input" placeholder="O que deseja, mestre?" style="width: 100%; margin-top: 0.5rem; padding: 1.2rem 1.5rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; background: rgba(255,255,255,0.03); backdrop-filter: blur(15px); color: #fff; outline: none;">
            </div>
        </div>
        <!-- Painel Inferior -->

        <div id="bottom-panel" style="
            position: absolute; bottom: -200px; left: 0; width: 100%; background: rgba(255, 255, 255, 0.04);
            backdrop-filter: blur(35px); border-radius: 0; border: 1px solid rgba(255, 255, 255, 0.1);
            border-bottom: none; padding: 3rem 5%; transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 100; box-shadow: 0 -20px 50px rgba(0,0,0,0.5);
        ">
            <div id="panel-handle" style="width: 45px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 10px; margin: -1.5rem auto 2rem auto; cursor: pointer;"></div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; max-width: 100%; margin: 0 auto;">
                ${menuItems.map(item => `
                    <div class="menu-btn" style="
                        aspect-ratio: 1; background: rgba(255,255,255,0.05); border-radius: 50%; display: flex;
                        align-items: center; justify-content: center; color: rgba(255,255,255,0.8);
                        cursor: pointer; transition: all 0.3s ease; border: 1px solid rgba(255,255,255,0.05);
                    ">
                        <span class="material-symbols-rounded" style="font-size: 1.8rem;">${item.icon}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div id="footer-trigger" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 60px; cursor: pointer; z-index: 200;"></div>

        <style>
            @keyframes plocBlink { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
            @keyframes dotWave { 0%, 100% { opacity: 0.2; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-5px); } }
            @keyframes plocBreath {
                0%, 100% { transform: scale(1); box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 2px 2px 5px rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.3); }
                50% { transform: scale(1.08); box-shadow: 0 30px 80px rgba(56, 189, 248, 0.2), inset 2px 2px 10px rgba(255,255,255,1); border-color: rgba(56, 189, 248, 0.5); }
            }
            #ploc-core { animation: plocBreath 4s ease-in-out infinite; }
            .menu-btn:hover { background: rgba(56, 189, 248, 0.2); border-color: rgba(56, 189, 248, 0.4); transform: scale(1.1); }
            #btn-auth-action:hover { background: #fff; color: #000; transform: translateY(-2px); }
        </style>
    `;

    setTimeout(() => {
        // Montar o Avatar Interativo
        const mount = container.querySelector('#ploc-avatar-mount');
        if (mount) {
            mount.appendChild(createPlocAvatar());
        }

        const loginTrigger = container.querySelector('#login-trigger');
        const loginModal = container.querySelector('#login-modal');
        const loginCard = container.querySelector('#login-card');
        const closeLogin = container.querySelector('#close-login');
        const resetLogin = container.querySelector('#reset-login');

        const triggerLogin = container.querySelector('#trigger-login');
        const triggerRegister = container.querySelector('#trigger-register');
        const authTriggers = container.querySelector('#auth-triggers');
        const authForm = container.querySelector('#auth-form');
        const confirmPass = container.querySelector('#confirm-pass-container');
        const btnAuth = container.querySelector('#btn-auth-action');
        const inputEmail = container.querySelector('#input-email');

        const btnBack = container.querySelector('#btn-back');

        const trigger = container.querySelector('#text-trigger');
        const inputWrapper = container.querySelector('#input-container');
        const bottomPanel = container.querySelector('#bottom-panel');
        const footerTrigger = container.querySelector('#footer-trigger');
        const inputField = container.querySelector('#ploc-input');

        let isPanelOpen = false;
        let isInputOpen = false;
        let currentMode = null; // 'login' ou 'register'

        // Lógica de Transição LOGIN / CADASTRO
        const setAuthMode = (mode) => {
            currentMode = mode;
            authForm.style.height = mode === 'register' ? '350px' : '260px';
            authForm.style.opacity = '1';
            authForm.style.overflow = 'visible';

            if (mode === 'login') {
                triggerRegister.style.width = '0';
                triggerRegister.style.opacity = '0';
                triggerRegister.style.pointerEvents = 'none';
                confirmPass.style.height = '0';
                confirmPass.style.opacity = '0';
                btnAuth.innerText = 'ENTRAR';
            } else {
                triggerLogin.style.width = '0';
                triggerLogin.style.opacity = '0';
                triggerLogin.style.pointerEvents = 'none';
                confirmPass.style.height = '60px';
                confirmPass.style.opacity = '1';
                btnAuth.innerText = 'CADASTRAR';
            }
            setTimeout(() => inputEmail.focus(), 500);
        };

        const resetAuth = () => {
            currentMode = null;
            authForm.style.height = '0';
            authForm.style.opacity = '0';
            authForm.style.overflow = 'hidden';
            triggerLogin.style.width = 'auto';
            triggerLogin.style.opacity = '1';
            triggerLogin.style.pointerEvents = 'auto';
            triggerRegister.style.width = 'auto';
            triggerRegister.style.opacity = '1';
            triggerRegister.style.pointerEvents = 'auto';
        };

        triggerLogin.onclick = () => setAuthMode('login');
        triggerRegister.onclick = () => setAuthMode('register');
        btnBack.onclick = resetAuth;
        resetLogin.onclick = resetAuth;

        loginTrigger.onclick = () => {
            loginModal.style.opacity = '1';
            loginModal.style.pointerEvents = 'auto';
            loginCard.style.transform = 'scale(1)';
        };

        const closeModals = () => {
            loginModal.style.opacity = '0';
            loginModal.style.pointerEvents = 'none';
            loginCard.style.transform = 'scale(0.9)';
            setTimeout(resetAuth, 500);
        };

        closeLogin.onclick = closeModals;
        loginModal.onclick = (e) => { if (e.target === loginModal) closeModals(); };

        const togglePanel = () => {
            isPanelOpen = !isPanelOpen;
            bottomPanel.style.bottom = isPanelOpen ? '0' : '-200px';
        };

        // Ativando cliques nos itens do menu
        const menuBtns = container.querySelectorAll('.menu-btn');
        menuBtns.forEach((btn, index) => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const item = menuItems[index];
                if (item.label === 'Dashboard') {
                    window.location.hash = '#dashboard';
                } else if (item.label === 'Rotinas') {
                    window.location.hash = '#routines';
                    if (isPanelOpen) togglePanel();
                } else if (item.label === 'Calendário') {
                    window.location.hash = '#calendar';
                } else if (item.label === 'Configurações') {
                    window.location.hash = '#settings';
                } else if (item.label === 'Kanban') {
                    window.location.hash = '#kanban';
                } else {
                    console.log('Navegando para:', item.label);
                }
            };
        });

        const panelHandle = container.querySelector('#panel-handle');
        panelHandle.onclick = (e) => { e.stopPropagation(); togglePanel(); };

        footerTrigger.onclick = (e) => { e.stopPropagation(); togglePanel(); };

        container.onclick = (e) => {
            if (isPanelOpen && !bottomPanel.contains(e.target)) togglePanel();
            if (isInputOpen && !inputWrapper.contains(e.target) && e.target !== trigger) {
                isInputOpen = false;
                inputWrapper.style.height = '0';
                inputWrapper.style.opacity = '0';
                inputWrapper.style.transform = 'translateY(-10px)';
                trigger.style.opacity = '1';
            }
        };

        trigger.onclick = (e) => {
            e.stopPropagation();
            isInputOpen = true;
            inputWrapper.style.height = '100px';
            inputWrapper.style.opacity = '1';
            inputWrapper.style.transform = 'translateY(0)';
            trigger.style.opacity = '0';
            setTimeout(() => inputField.focus(), 300);
        };
    }, 0);

    return container;
};
