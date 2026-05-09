/**
 * Componente: DashboardPage
 * Interface Pós-Login: O painel de controle do usuário
 */
export const renderDashboard = () => {
    const container = document.createElement('div');

    Object.assign(container.style, {
        width: '100%', minHeight: '100vh',
        background: '#020617',
        color: '#fff',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '2rem',
        overflowX: 'hidden'
    });

    // Recupera dados do usuário
    const user = JSON.parse(localStorage.getItem('ploc_user') || '{}');
    const userName = user.name || 'MESTRE';

    container.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <!-- Header do Dashboard -->
            <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem;">
                <div>
                    <h1 style="font-size: 1.5rem; margin: 0; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">
                        OLÁ, ${userName.split(' ')[0]}
                    </h1>
                    <p style="color: #64748b; font-size: 0.8rem; margin: 0.5rem 0 0 0;">Seu sócio está pronto para agir.</p>
                </div>
                
                <!-- Cápsula Camaleão (Transformável) -->
                <div id="capsule-container" style="
                    display: flex; align-items: center; 
                    background: rgba(255,255,255,0.03); padding: 0.4rem;
                    border-radius: 40px; border: 1px solid rgba(255,255,255,0.1);
                    cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative; min-width: 120px; justify-content: space-between;
                ">
                    <!-- Estado Inicial: Foto e Nome -->
                    <div id="capsule-user" style="display: flex; align-items: center; gap: 0.8rem; padding: 0 0.6rem;">
                        <div style="
                            width: 32px; height: 32px; border-radius: 50%;
                            background: linear-gradient(145deg, #38bdf8, #1d4ed8);
                            display: flex; align-items: center; justify-content: center;
                            overflow: hidden;
                        ">
                            <span class="material-symbols-rounded" style="font-size: 1.1rem;">person</span>
                        </div>
                        <span style="font-size: 0.75rem; font-weight: 700; letter-spacing: 1px;">${userName.split(' ')[0]}</span>
                    </div>

                    <!-- Estado Transformado: Settings e Logout (Escondidos) -->
                    <div id="capsule-actions" style="display: none; align-items: center; gap: 0.5rem; width: 100%; justify-content: space-around;">
                        <div id="go-settings" style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(255,255,255,0.1);">
                            <span class="material-symbols-rounded" style="font-size: 1.2rem; color: #38bdf8;">settings</span>
                        </div>
                        <div id="do-logout" style="flex: 1; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 20px; background: #ef4444; margin-left: 5px;">
                            <span style="font-size: 0.7rem; font-weight: 800; color: #fff;">SAIR</span>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Cards de Resumo -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 3rem;">
                <div style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.2); padding: 1.5rem; border-radius: 16px;">
                    <span class="material-symbols-rounded" style="color: #38bdf8; margin-bottom: 1rem;">schedule</span>
                    <h3 style="margin: 0; font-size: 0.8rem; color: #38bdf8;">ROTINAS</h3>
                    <p style="font-size: 1.8rem; font-weight: 800; margin: 0.5rem 0 0 0;">12</p>
                </div>
                <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); padding: 1.5rem; border-radius: 16px;">
                    <span class="material-symbols-rounded" style="color: #64748b; margin-bottom: 1rem;">notifications_active</span>
                    <h3 style="margin: 0; font-size: 0.8rem; color: #64748b;">ALERTAS</h3>
                    <p style="font-size: 1.8rem; font-weight: 800; margin: 0.5rem 0 0 0;">03</p>
                </div>
            </div>

            <!-- Lista de Atividades Recentes -->
            <section>
                <h2 style="font-size: 1rem; margin-bottom: 1.5rem; letter-spacing: 2px;">ATIVIDADES RECENTES</h2>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="background: rgba(255,255,255,0.02); padding: 1.2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 10px; height: 10px; background: #22c55e; border-radius: 50%;"></div>
                        <span style="font-size: 0.9rem;">Meta diária de hidratação batida!</span>
                    </div>
                </div>
            </section>
        </div>

        <!-- MODAL DE PROMOÇÃO: CRIE SUA ROTINA -->
        <div id="promo-modal" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(2, 6, 23, 0.9); backdrop-filter: blur(8px);
            z-index: 2000; display: flex; align-items: center; justify-content: center;
            opacity: 0; pointer-events: none; transition: all 0.5s ease;
        ">
            <div style="
                width: 90%; max-width: 400px; background: #1e293b; 
                border-radius: 24px; border: 1px solid rgba(255,255,255,0.1);
                padding: 2rem; position: relative;
            ">
                <div id="close-promo" style="position: absolute; top: 1rem; right: 1rem; cursor: pointer; opacity: 0.5;">
                    <span class="material-symbols-rounded">close</span>
                </div>
                
                <h3 style="font-size: 1.5rem; font-weight: 800; letter-spacing: 2px; margin-bottom: 0.5rem; text-align: center;">CRIE SUA ROTINA</h3>
                <p style="color: #64748b; font-size: 0.8rem; text-align: center; margin-bottom: 2rem;">Escolha um caminho para começar hoje.</p>

                <!-- Banner Horizontal Scrollable -->
                <div id="promo-banner" style="
                    display: flex; gap: 1rem; overflow-x: auto; 
                    padding-bottom: 1rem; scroll-snap-type: x mandatory;
                    -webkit-overflow-scrolling: touch;
                ">
                    <style>
                        #promo-banner::-webkit-scrollbar { display: none; }
                        .promo-item {
                            flex: 0 0 140px; height: 180px; scroll-snap-align: center;
                            border-radius: 16px; display: flex; flex-direction: column;
                            align-items: center; justify-content: center; gap: 1rem;
                            cursor: pointer; transition: transform 0.3s;
                        }
                        .promo-item:active { transform: scale(0.95); }
                    </style>
                    <div class="promo-item" style="background: linear-gradient(135deg, #f43f5e, #fb7185);">
                        <span class="material-symbols-rounded" style="font-size: 2.5rem;">fitness_center</span>
                        <span style="font-weight: 700; font-size: 0.8rem;">MUSCULAÇÃO</span>
                    </div>
                    <div class="promo-item" style="background: linear-gradient(135deg, #10b981, #34d399);">
                        <span class="material-symbols-rounded" style="font-size: 2.5rem;">restaurant</span>
                        <span style="font-weight: 700; font-size: 0.8rem;">DIETA</span>
                    </div>
                    <div class="promo-item" style="background: linear-gradient(135deg, #3b82f6, #60a5fa);">
                        <span class="material-symbols-rounded" style="font-size: 2.5rem;">volunteer_activism</span>
                        <span style="font-weight: 700; font-size: 0.8rem;">SAÚDE</span>
                    </div>
                    <div class="promo-item" style="background: linear-gradient(135deg, #a855f7, #c084fc);">
                        <span class="material-symbols-rounded" style="font-size: 2.5rem;">auto_stories</span>
                        <span style="font-weight: 700; font-size: 0.8rem;">LEITURA</span>
                    </div>
                    <div class="promo-item" style="background: linear-gradient(135deg, #f59e0b, #fbbf24);">
                        <span class="material-symbols-rounded" style="font-size: 2.5rem;">school</span>
                        <span style="font-weight: 700; font-size: 0.8rem;">ESTUDO</span>
                    </div>
                </div>

                <button id="start-now" style="
                    width: 100%; margin-top: 1.5rem; padding: 1rem;
                    background: #38bdf8; border: none; border-radius: 12px;
                    color: #0f172a; font-weight: 800; letter-spacing: 1px;
                    cursor: pointer;
                ">VAMOS LÁ!</button>
            </div>
        </div>

        <!-- Botão Central: Chamar o Ploc -->
        <div id="call-ploc" style="
            position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
            width: 65px; height: 65px; background: #38bdf8; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 10px 30px rgba(56, 189, 248, 0.4); cursor: pointer; z-index: 10;
        ">
            <span class="material-symbols-rounded" style="color: #0f172a; font-size: 2rem;">bolt</span>
        </div>
    `;

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
                    capsule.style.minWidth = '180px';
                } else {
                    capUser.style.display = 'flex';
                    capActions.style.display = 'none';
                    capsule.style.minWidth = '120px';
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
            };
        }

        if (btnSettings) {
            btnSettings.onclick = () => {
                window.location.hash = '#settings';
            };
        }

        // --- LÓGICA DO MODAL PROMO ---
        const promoModal = container.querySelector('#promo-modal');
        const closePromo = container.querySelector('#close-promo');
        const startNow = container.querySelector('#start-now');

        // Mostra o modal com um pequeno delay após carregar
        setTimeout(() => {
            if (promoModal) {
                promoModal.style.opacity = '1';
                promoModal.style.pointerEvents = 'auto';
            }
        }, 800);

        const hidePromo = () => {
            promoModal.style.opacity = '0';
            promoModal.style.pointerEvents = 'none';
        };

        if (closePromo) closePromo.onclick = hidePromo;
        if (startNow) startNow.onclick = hidePromo;

    }, 0);

    return container;
};
