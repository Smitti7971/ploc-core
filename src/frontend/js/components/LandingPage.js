import { createPlocAvatar } from './PlocAvatar.js';
import { apiClient } from '../api/client.js';

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
        <!-- Indicador de Status de Rede -->
        <div id="network-status" style="
            position: absolute; top: 2rem; left: 2rem; padding: 0.6rem 1.2rem;
            background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px);
            border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex; align-items: center; gap: 0.8rem;
            color: #fff; z-index: 200;
        ">
            <div id="status-dot" style="width: 8px; height: 8px; background: #94a3b8; border-radius: 50%; box-shadow: 0 0 10px rgba(148, 163, 184, 0.5);"></div>
            <span id="status-text" style="font-size: 0.7rem; font-weight: 600; letter-spacing: 1px; opacity: 0.6;">VERIFICANDO...</span>
        </div>

        <!-- Botão de Login ou Perfil no Topo -->
        <div id="auth-area" style="position: absolute; top: 2rem; right: 2rem; z-index: 200;">
            ${localStorage.getItem('ploc_token') ? `
                <!-- Cápsula Camaleão (Transformável) -->
                <div id="user-profile-trigger" style="
                    display: flex; align-items: center; 
                    background: rgba(255,255,255,0.05); backdrop-filter: blur(10px);
                    padding: 0.4rem; border-radius: 40px; border: 1px solid rgba(255,255,255,0.1);
                    cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative; min-width: 130px; justify-content: space-between;
                ">
                    <!-- Estado Inicial: Foto e Nome -->
                    <div id="capsule-user" style="display: flex; align-items: center; gap: 0.8rem; padding: 0 0.6rem; width: 100%;">
                        <div style="
                            width: 30px; height: 30px; border-radius: 50%;
                            background: linear-gradient(145deg, #38bdf8, #1d4ed8);
                            display: flex; align-items: center; justify-content: center;
                            overflow: hidden;
                        ">
                            <span class="material-symbols-rounded" style="font-size: 1rem; color: #fff;">person</span>
                        </div>
                        <span style="font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; color: #fff; text-transform: uppercase;">
                            ${JSON.parse(localStorage.getItem('ploc_user') || '{}').name?.split(' ')[0] || 'MESTRE'}
                        </span>
                    </div>

                    <!-- Estado Transformado: Logout (Esq) e Settings (Dir) -->
                    <div id="capsule-actions" style="display: none; align-items: center; gap: 0.5rem; width: 100%; justify-content: space-around;">
                        <div id="do-logout" style="flex: 1; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 20px; background: #ef4444;">
                            <span style="font-size: 0.7rem; font-weight: 800; color: #fff; letter-spacing: 1px;">SAIR</span>
                        </div>
                        <div id="go-settings" style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(255,255,255,0.1);">
                            <span class="material-symbols-rounded" style="font-size: 1.2rem; color: #38bdf8;">settings</span>
                        </div>
                    </div>
                </div>
            ` : `
                <!-- Botão Login (Deslogado) -->
                <div id="login-trigger" style="
                    padding: 0.6rem 1.5rem; background: rgba(255,255,255,0.05);
                    backdrop-filter: blur(10px); border-radius: 30px;
                    border: 1px solid rgba(255,255,255,0.1); color: #fff;
                    font-size: 0.7rem; font-weight: 700; letter-spacing: 2px;
                    cursor: pointer; transition: all 0.3s ease;
                ">LOGIN</div>
            `}
        </div>

        <!-- Modal de Login Interativo -->
        <!-- MODAL DE PROMOÇÃO: CRIE SUA ROTINA -->
        <div id="promo-modal" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(2, 6, 23, 0.9); backdrop-filter: blur(8px);
            z-index: 3000; display: flex; align-items: center; justify-content: center;
            opacity: 0; pointer-events: none; transition: all 0.5s ease;
        ">
            <div id="promo-card" style="
                width: 95%; max-width: 450px; background: #1e293b; 
                border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
                padding: 1.5rem; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            ">
                <div id="close-promo" style="position: absolute; top: 1rem; right: 1rem; cursor: pointer; color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 5px; border-radius: 50%;">
                    <span class="material-symbols-rounded">close</span>
                </div>
                
                <h3 style="font-size: 1.2rem; font-weight: 800; letter-spacing: 2px; margin-bottom: 2rem; text-align: center; color: #fff;">CRIE SUA ROTINA</h3>

                <!-- Container do Carrossel com Prévias -->
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                    <!-- Prévia Anterior -->
                    <div id="prev-routine" style="cursor: pointer; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(255,255,255,0.05); transition: all 0.3s;">
                        <span id="prev-icon" class="material-symbols-rounded" style="color: rgba(255,255,255,0.4); font-size: 1.5rem;">auto_stories</span>
                    </div>

                    <!-- Visualizador do Carrossel (Mais Baixo) -->
                    <div id="promo-viewport" style="
                        flex: 1; height: 150px; overflow: hidden; 
                        position: relative; border-radius: 8px;
                    ">
                        <div id="promo-banner" style="
                            display: flex; height: 100%; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                        ">
                            <style>
                                .promo-item {
                                    flex: 0 0 100%; height: 100%;
                                    display: flex; flex-direction: column;
                                    align-items: center; justify-content: center; gap: 0.5rem;
                                    color: #fff;
                                }
                            </style>
                            <div class="promo-item" data-icon="fitness_center" style="background: linear-gradient(135deg, #f43f5e, #fb7185);">
                                <span class="material-symbols-rounded" style="font-size: 3rem;">fitness_center</span>
                                <span style="font-weight: 800; font-size: 1rem; letter-spacing: 2px;">MUSCULAÇÃO</span>
                            </div>
                            <div class="promo-item" data-icon="restaurant" style="background: linear-gradient(135deg, #10b981, #34d399);">
                                <span class="material-symbols-rounded" style="font-size: 3rem;">restaurant</span>
                                <span style="font-weight: 800; font-size: 1rem; letter-spacing: 2px;">DIETA</span>
                            </div>
                            <div class="promo-item" data-icon="volunteer_activism" style="background: linear-gradient(135deg, #3b82f6, #60a5fa);">
                                <span class="material-symbols-rounded" style="font-size: 3rem;">volunteer_activism</span>
                                <span style="font-weight: 800; font-size: 1rem; letter-spacing: 2px;">SAÚDE</span>
                            </div>
                            <div class="promo-item" data-icon="auto_stories" style="background: linear-gradient(135deg, #a855f7, #c084fc);">
                                <span class="material-symbols-rounded" style="font-size: 3rem;">auto_stories</span>
                                <span style="font-weight: 800; font-size: 1rem; letter-spacing: 2px;">LEITURA</span>
                            </div>
                        </div>
                    </div>

                    <!-- Prévia Próxima -->
                    <div id="next-routine" style="cursor: pointer; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(255,255,255,0.05); transition: all 0.3s;">
                        <span id="next-icon" class="material-symbols-rounded" style="color: rgba(255,255,255,0.4); font-size: 1.5rem;">restaurant</span>
                    </div>
                </div>

                <button id="start-now" style="
                    width: 100%; margin-top: 2rem; padding: 1.2rem;
                    background: #38bdf8; border: none; border-radius: 8px;
                    color: #0f172a; font-weight: 800; letter-spacing: 1px;
                    cursor: pointer; transition: transform 0.2s;
                ">INICIAR AGORA</button>
            </div>
        </div>


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
            <div id="text-trigger" style="
                margin-top: 2rem; cursor: pointer; display: flex; gap: 6px; 
                transition: all 0.4s ease; padding: 0.5rem 1.2rem;
                background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px; backdrop-filter: blur(10px);
            ">
                <span class="dot" style="width: 6px; height: 6px; background: rgba(255,255,255,0.3); border-radius: 50%;"></span>
                <span class="dot" style="width: 6px; height: 6px; background: rgba(255,255,255,0.3); border-radius: 50%;"></span>
                <span class="dot" style="width: 6px; height: 6px; background: rgba(255,255,255,0.3); border-radius: 50%;"></span>
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
        const avatarContainer = container.querySelector('#ploc-avatar-mount');
        if (avatarContainer) {
            avatarContainer.appendChild(createPlocAvatar('ploc-avatar-mount'));
            
            // --- LÓGICA DA CÁPSULA CAMALEÃO (NA HOME) ---
            const capsule = container.querySelector('#user-profile-trigger');
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
                        capsule.style.minWidth = '160px';
                    } else {
                        capUser.style.display = 'flex';
                        capActions.style.display = 'none';
                        capsule.style.minWidth = '130px';
                    }
                };
                document.addEventListener('click', () => {
                    if (capUser) capUser.style.display = 'flex';
                    if (capActions) capActions.style.display = 'none';
                    if (capsule) capsule.style.minWidth = '130px';
                });

                if (btnLogout) {
                    btnLogout.onclick = (e) => {
                        e.stopPropagation();
                        localStorage.removeItem('ploc_token');
                        localStorage.removeItem('ploc_user');
                        window.location.reload();
                    };
                }
                if (btnSettings) {
                    btnSettings.onclick = (e) => {
                        e.stopPropagation();
                        window.location.hash = '#settings';
                    };
                }
            }

            // --- LÓGICA DO CARROSSEL INFINITO GENUÍNO ---
            const routineBanner = container.querySelector('#promo-banner');
            const prevRoutineIcon = container.querySelector('#prev-icon');
            const nextRoutineIcon = container.querySelector('#next-icon');
            const btnPrevRoutine = container.querySelector('#prev-routine');
            const btnNextRoutine = container.querySelector('#next-routine');

            const routineItems = Array.from(container.querySelectorAll('.promo-item'));
            const totalOriginal = routineItems.length;

            // Clonagem para Looping Perfeito
            const firstClone = routineItems[0].cloneNode(true);
            const lastClone = routineItems[totalOriginal - 1].cloneNode(true);
            
            routineBanner.appendChild(firstClone);
            routineBanner.insertBefore(lastClone, routineItems[0]);

            const allItems = container.querySelectorAll('.promo-item');
            let currentIndex = 1; // Começa no primeiro item real (índice 1)
            let isTransitioning = false;

            const updateCarousel = (animate = true) => {
                routineBanner.style.transition = animate ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
                routineBanner.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                // Atualiza Ícones de Prévia
                const realIdx = (currentIndex - 1 + totalOriginal) % totalOriginal;
                const prevIdx = (realIdx - 1 + totalOriginal) % totalOriginal;
                const nextIdx = (realIdx + 1) % totalOriginal;
                
                if (prevRoutineIcon) prevRoutineIcon.textContent = routineItems[prevIdx].getAttribute('data-icon');
                if (nextRoutineIcon) nextRoutineIcon.textContent = routineItems[nextIdx].getAttribute('data-icon');
            };

            // Posição Inicial
            updateCarousel(false);

            const handleNext = () => {
                if (isTransitioning) return;
                isTransitioning = true;
                currentIndex++;
                updateCarousel(true);
            };

            const handlePrev = () => {
                if (isTransitioning) return;
                isTransitioning = true;
                currentIndex--;
                updateCarousel(true);
            };

            routineBanner.addEventListener('transitionend', () => {
                isTransitioning = false;
                // Salto invisível no final
                if (currentIndex === totalOriginal + 1) {
                    currentIndex = 1;
                    updateCarousel(false);
                }
                // Salto invisível no início
                if (currentIndex === 0) {
                    currentIndex = totalOriginal;
                    updateCarousel(false);
                }
            });

            if (btnPrevRoutine && btnNextRoutine) {
                btnPrevRoutine.onclick = handlePrev;
                btnNextRoutine.onclick = handleNext;
            }

            // --- LÓGICA DO MODAL PROMO (NA HOME) ---
            const promoModal = container.querySelector('#promo-modal');
            const promoCard = container.querySelector('#promo-card');
            const closePromo = container.querySelector('#close-promo');
            const startNow = container.querySelector('#start-now');

            // Se o usuário acabou de logar ou recarregou logado, mostra o modal
            if (localStorage.getItem('ploc_token') && promoModal) {
                setTimeout(() => {
                    promoModal.style.opacity = '1';
                    promoModal.style.pointerEvents = 'auto';
                }, 1000);
            }

            if (promoModal && promoCard) {
                promoModal.onclick = (e) => {
                    if (e.target === promoModal) hidePromo();
                };
            }

            const hidePromo = () => {
                if (promoModal) {
                    promoModal.style.opacity = '0';
                    promoModal.style.pointerEvents = 'none';
                }
            };

            if (closePromo) closePromo.onclick = hidePromo;
            if (startNow) startNow.onclick = hidePromo;




        }

        // Seletores de Autenticação / Perfil
        const loginTrigger = container.querySelector('#login-trigger');
        if (loginTrigger) loginTrigger.onclick = () => setAuthMode('login');
        
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

        // Lógica de Diagnóstico de Conexão
        const checkConnection = async () => {
            const avatar = container.querySelector('#ploc-core');
            const statusDot = container.querySelector('#status-dot');
            const statusText = container.querySelector('#status-text');
            if (!avatar) return;

            try {
                const response = await apiClient.get('/health');
                
                if (response.status === 'Healthy') {
                    // SUCESSO ✅
                    if (statusDot) {
                        statusDot.style.background = '#22c55e';
                        statusDot.style.boxShadow = '0 0 10px #22c55e';
                        statusText.innerText = 'ONLINE';
                        statusText.style.opacity = '1';
                    }
                }
            } catch (error) {
                // ERRO ❌
                if (statusDot) {
                    statusDot.style.background = '#ef4444';
                    statusDot.style.boxShadow = '0 0 10px #ef4444';
                    statusText.innerText = 'OFFLINE';
                    statusText.style.opacity = '1';
                }
                console.error('Erro de conexão:', error);
            }
        };

        const resetPlocStyle = () => {
            const avatar = container.querySelector('#ploc-core');
            if (!avatar) return;
            avatar.style.boxShadow = '';
            avatar.style.background = 'linear-gradient(145deg, #f1f5f9, #cbd5e1)';
        };

        // Verifica a conexão ao carregar
        checkConnection();

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

        // Lógica de Autenticação (Login / Cadastro)
        btnAuth.onclick = async () => {
            const email = inputEmail.value.trim();
            const password = container.querySelector('#input-pass').value;
            const confirm = container.querySelector('#input-confirm').value;

            if (!email || !password) {
                if (window.plocControls) window.plocControls.speak("Preencha todos os campos, mestre.");
                return;
            }

            try {
                // Brilho de processamento (Azul)
                const avatar = container.querySelector('#ploc-core');
                if (avatar) avatar.style.boxShadow = '0 0 40px #38bdf8';

                if (currentMode === 'register') {
                    if (password !== confirm) {
                        if (window.plocControls) window.plocControls.speak("As senhas não conferem!");
                        return;
                    }
                    
                    const res = await apiClient.post('/auth/register', { email, password, name: email.split('@')[0] });
                    if (window.plocControls) window.plocControls.speak(res.message || "Cadastro realizado! Agora faça o login.");
                    resetAuth();
                } else {
                    const res = await apiClient.post('/auth/login', { email, password });
                    
                    // Sucesso no Login
                    localStorage.setItem('ploc_token', res.token);
                    localStorage.setItem('ploc_user', JSON.stringify(res.user));
                    
                    if (window.plocControls) {
                        window.plocControls.speak(`Bem vindo de volta, ${res.user.name || 'mestre'}!`);
                    }

                    // Efeito de sucesso e mostra o Modal de Rotinas
                    if (avatar) {
                        avatar.style.boxShadow = '0 0 60px #22c55e';
                        avatar.style.background = 'linear-gradient(145deg, #dcfce7, #86efac)';
                    }
                    
                    setTimeout(() => {
                        resetPlocStyle();
                        resetAuth();
                        // Recarrega para atualizar a área de Perfil e mostrar o Modal
                        window.location.reload(); 
                    }, 1500);
                }
            } catch (error) {
                console.error('Erro na autenticação:', error);
                const errorMsg = error.response?.data?.error || "Ops! Algo deu errado na autenticação.";
                if (window.plocControls) window.plocControls.speak(errorMsg);
                
                const avatar = container.querySelector('#ploc-core');
                if (avatar) {
                    avatar.style.boxShadow = '0 0 60px #ef4444';
                    avatar.style.background = 'linear-gradient(145deg, #fee2e2, #fca5a5)';
                    setTimeout(() => resetPlocStyle(), 2000);
                }
            }
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

        if (triggerLogin) triggerLogin.onclick = () => setAuthMode('login');
        if (triggerRegister) triggerRegister.onclick = () => setAuthMode('register');
        if (btnBack) btnBack.onclick = resetAuth;
        if (resetLogin) resetLogin.onclick = resetAuth;

        if (loginTrigger) {
            loginTrigger.onclick = () => {
                loginModal.style.opacity = '1';
                loginModal.style.pointerEvents = 'auto';
                loginCard.style.transform = 'scale(1)';
            };
        }

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
            checkConnection(); // Chama o diagnóstico real
            
            // Mantém a funcionalidade original de abrir o input
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
