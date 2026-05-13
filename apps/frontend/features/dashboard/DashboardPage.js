import { apiClient } from '../../shared/api/client.js?v=0.1.3';

const DashboardPage = {
    render: async () => {
        const container = document.createElement('div');
        container.className = 'dashboard-container';
        Object.assign(container.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            background: '#020617',
            overflow: 'hidden',
            margin: '0',
            padding: '0',
            border: 'none',
            zIndex: '10'
        });

        // Recupera dados do usuário
        let user = {};
        try {
            const storedUser = localStorage.getItem('ploc_user');
            if (storedUser && storedUser !== 'undefined') {
                user = JSON.parse(storedUser);
            }
        } catch (e) {
            console.error('Erro ao recuperar usuário:', e);
            user = {};
        }

        container.innerHTML = `
            <style>
                /* Reset Radical para garantir o Viewport */
                html, body { 
                    margin: 0 !important; 
                    padding: 0 !important; 
                    overflow: hidden !important; 
                    width: 100% !important; 
                    height: 100% !important; 
                    background: #020617;
                }
                * { box-sizing: border-box; }
                
                #dashboard-carousel::-webkit-scrollbar { display: none; }
                @keyframes bounceX {
                    0%, 100% { transform: translate(0, -50%); }
                    50% { transform: translate(10px, -50%); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>

            <!-- Botão de Retorno (Top Left) -->
            <button id="btn-return-landing" style="
                position: fixed; top: 20px; left: 20px; z-index: 100;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                color: #fff; width: 45px; height: 45px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; transition: all 0.3s;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            " onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
                <span class="material-symbols-rounded">arrow_back</span>
            </button>

            <div id="dashboard-carousel" style="
                width: 100vw; height: 100vh; 
                display: flex; overflow-x: auto; 
                scroll-snap-type: x mandatory;
                scroll-behavior: smooth;
                -ms-overflow-style: none; scrollbar-width: none;
            ">
                <!-- SLIDE 0: FINANÇAS -->
                <section id="slide-financas" style="
                    flex-shrink: 0;
                    width: 100vw; height: 100vh; 
                    scroll-snap-align: start;
                    display: flex; align-items: center; justify-content: center;
                    background: radial-gradient(circle at center, rgba(34, 197, 94, 0.05) 0%, transparent 70%);
                    overflow: hidden;
                    position: relative;
                ">
                    <h2 style="font-size: 3.5rem; font-weight: 950; letter-spacing: 15px; color: #fff; text-transform: uppercase; opacity: 0.15; filter: blur(1px); white-space: nowrap;">FINANÇAS</h2>
                    <div style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); opacity: 0.2; animation: bounceX 2s infinite;">
                        <span class="material-symbols-rounded" style="font-size: 1.5rem; color: #fff;">chevron_right</span>
                    </div>
                </section>

                <!-- SLIDE 1: LABORATÓRIO (CENTRAL DE COMANDOS) -->
                <section id="slide-laboratorio" style="
                    flex-shrink: 0;
                    width: 100vw; height: 100vh; 
                    scroll-snap-align: start;
                    scroll-snap-stop: always;
                    display: flex; flex-direction: column; 
                    align-items: center; justify-content: flex-start; 
                    gap: 1.2rem; padding: 1.5rem 1rem;
                    position: relative;
                    background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.08) 0%, transparent 50%);
                ">
                    <h1 style="color: var(--accent); letter-spacing: 4px; font-size: 0.9rem; font-weight: 900; margin: 1rem 0; opacity: 0.8;">LABORATÓRIO</h1>
                    
                    <!-- BENTO GRID DE RESUMO -->
                    <div class="bento-grid" style="
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        grid-template-rows: auto auto auto;
                        gap: 1rem;
                        width: 100%;
                        max-width: 360px;
                        padding-bottom: 5rem; /* Espaço para o dock */
                    ">
                        <!-- Card: Atividades -->
                        <div class="lab-card" style="grid-column: span 2; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 20px; padding: 1.2rem; display: flex; align-items: center; gap: 1rem;">
                            <div style="width: 50px; height: 50px; border-radius: 15px; background: #38bdf8; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(56, 189, 248, 0.3);">
                                <i class="icon-task-square" style="color: #fff; font-size: 1.5rem;"></i>
                            </div>
                            <div>
                                <h3 style="margin: 0; font-size: 0.7rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Atividades</h3>
                                <div style="font-size: 1.5rem; font-weight: 900; color: #fff;">12 <span style="font-size: 0.8rem; color: #38bdf8; font-weight: 600;">ATIVAS</span></div>
                            </div>
                        </div>

                        <!-- Card: Foco -->
                        <div class="lab-card" style="background: rgba(192, 132, 252, 0.1); border: 1px solid rgba(192, 132, 252, 0.2); border-radius: 20px; padding: 1.2rem; display: flex; flex-direction: column; gap: 0.5rem;">
                            <i class="icon-magic-star" style="color: #c084fc; font-size: 1.5rem;"></i>
                            <h3 style="margin: 0; font-size: 0.65rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Dias em Foco</h3>
                            <div style="font-size: 1.4rem; font-weight: 900; color: #fff;">07 <span style="font-size: 0.7rem; color: #c084fc;">DIAS</span></div>
                        </div>

                        <!-- Card: Sono -->
                        <div class="lab-card" style="background: rgba(45, 212, 191, 0.1); border: 1px solid rgba(21, 212, 191, 0.2); border-radius: 20px; padding: 1.2rem; display: flex; flex-direction: column; gap: 0.5rem;">
                            <i class="icon-moon" style="color: #2dd4bf; font-size: 1.5rem;"></i>
                            <h3 style="margin: 0; font-size: 0.65rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Qualidade Sono</h3>
                            <div style="font-size: 1.4rem; font-weight: 900; color: #fff;">85<span style="font-size: 0.7rem; color: #2dd4bf;">%</span></div>
                        </div>

                        <!-- Card: Resumo Saúde e Corpo -->
                        <div class="lab-card" style="grid-column: span 2; background: rgba(251, 113, 133, 0.1); border: 1px solid rgba(251, 113, 133, 0.2); border-radius: 20px; padding: 1.2rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                <h3 style="margin: 0; font-size: 0.7rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Saúde e Corpo</h3>
                                <i class="icon-heart" style="color: #fb7185; font-size: 1.2rem;"></i>
                            </div>
                            <div style="display: flex; gap: 1rem;">
                                <div style="flex: 1; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 0.8rem; text-align: center;">
                                    <div style="color: #94a3b8; font-size: 0.6rem; font-weight: 700; margin-bottom: 4px;">PESO</div>
                                    <div style="color: #fff; font-weight: 900;">78.5 <span style="font-size: 0.6rem; color: #fb7185;">KG</span></div>
                                </div>
                                <div style="flex: 1; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 0.8rem; text-align: center;">
                                    <div style="color: #94a3b8; font-size: 0.6rem; font-weight: 700; margin-bottom: 4px;">IMC</div>
                                    <div style="color: #fff; font-weight: 900;">24.2 <span style="font-size: 0.6rem; color: #fb7185;">IDEAL</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%) rotate(180deg); opacity: 0.2;">
                        <span class="material-symbols-rounded" style="font-size: 1.5rem; color: #fff;">chevron_right</span>
                    </div>
                    <div style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); opacity: 0.2;">
                        <span class="material-symbols-rounded" style="font-size: 1.5rem; color: #fff;">chevron_right</span>
                    </div>
                </section>

                <!-- SLIDE 2: TREINO -->
                <section id="slide-treino" style="
                    flex-shrink: 0;
                    width: 100vw; height: 100vh; 
                    scroll-snap-align: start;
                    scroll-snap-stop: always;
                    display: flex; align-items: center; justify-content: center;
                    background: radial-gradient(circle at center, rgba(56, 189, 248, 0.05) 0%, transparent 70%);
                    overflow: hidden;
                    position: relative;
                ">
                    <div style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%) rotate(180deg); opacity: 0.2; animation: bounceX 2s infinite;">
                        <span class="material-symbols-rounded" style="font-size: 1.5rem; color: #fff;">chevron_right</span>
                    </div>
                    <h2 style="font-size: 3.5rem; font-weight: 950; letter-spacing: 15px; color: #fff; text-transform: uppercase; opacity: 0.15; filter: blur(1px); white-space: nowrap;">TREINO</h2>
                    <div style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); opacity: 0.2; animation: bounceX 2s infinite;">
                        <span class="material-symbols-rounded" style="font-size: 1.5rem; color: #fff;">chevron_right</span>
                    </div>
                </section>

                <!-- SLIDE 3: SAUDE -->
                <section id="slide-saude" style="
                    flex-shrink: 0;
                    width: 100vw; height: 100vh; 
                    scroll-snap-align: start;
                    scroll-snap-stop: always;
                    display: flex; align-items: center; justify-content: center;
                    background: radial-gradient(circle at center, rgba(239, 68, 68, 0.05) 0%, transparent 70%);
                    overflow: hidden;
                    position: relative;
                ">
                    <div style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%) rotate(180deg); opacity: 0.2; animation: bounceX 2s infinite;">
                        <span class="material-symbols-rounded" style="font-size: 1.5rem; color: #fff;">chevron_right</span>
                    </div>
                    <h2 style="font-size: 3.5rem; font-weight: 950; letter-spacing: 15px; color: #fff; text-transform: uppercase; opacity: 0.15; filter: blur(1px); white-space: nowrap;">SAÚDE</h2>
                    <div style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); opacity: 0.2; animation: bounceX 2s infinite;">
                        <span class="material-symbols-rounded" style="font-size: 1.5rem; color: #fff;">chevron_right</span>
                    </div>
                </section>

                <!-- SLIDE 4: DIETA -->
                <section id="slide-dieta" style="
                    flex-shrink: 0;
                    width: 100vw; height: 100vh; 
                    scroll-snap-align: start;
                    scroll-snap-stop: always;
                    display: flex; align-items: center; justify-content: center;
                    background: radial-gradient(circle at center, rgba(249, 115, 22, 0.05) 0%, transparent 70%);
                    overflow: hidden;
                    position: relative;
                ">
                    <div style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%) rotate(180deg); opacity: 0.2; animation: bounceX 2s infinite;">
                        <span class="material-symbols-rounded" style="font-size: 1.5rem; color: #fff;">chevron_right</span>
                    </div>
                    <h2 style="font-size: 3.5rem; font-weight: 950; letter-spacing: 15px; color: #fff; text-transform: uppercase; opacity: 0.15; filter: blur(1px); white-space: nowrap;">DIETA</h2>
                    <div style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); opacity: 0.2; animation: bounceX 2s infinite;">
                        <span class="material-symbols-rounded" style="font-size: 1.5rem; color: #fff;">chevron_right</span>
                    </div>
                </section>

                <!-- SLIDE 5: PLANTAS -->
                <section id="slide-plantas" style="
                    flex-shrink: 0;
                    width: 100vw; height: 100vh; 
                    scroll-snap-align: start;
                    scroll-snap-stop: always;
                    display: flex; flex-direction: column; 
                    align-items: center; justify-content: flex-start; 
                    gap: 1.5rem; padding: 2rem 1rem;
                    background: radial-gradient(circle at center, rgba(16, 185, 129, 0.05) 0%, transparent 70%);
                    overflow-y: auto;
                    position: relative;
                ">
                    <h1 style="color: #10b981; letter-spacing: 2px; font-size: 1rem; font-weight: 900; margin: 1rem 0;">BOTÂNICA</h1>
                    
                    <!-- Grid de Plantas -->
                    <div id="plants-grid" style="
                        display: grid; 
                        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); 
                        gap: 1rem; width: 100%; max-width: 600px;
                        padding: 1rem;
                    ">
                        <!-- Card de Exemplo -->
                        <div class="glass-card" style="
                            background: rgba(255,255,255,0.03); 
                            border: 1px solid rgba(16, 185, 129, 0.2);
                            border-radius: 15px; padding: 1rem;
                            display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
                        ">
                            <div style="width: 50px; height: 50px; background: rgba(16, 185, 129, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span class="material-symbols-rounded" style="color: #10b981;">potted_plant</span>
                            </div>
                            <span style="color: #fff; font-size: 0.8rem; font-weight: 700;">Suculenta</span>
                            <span style="color: #64748b; font-size: 0.6rem;">Status: Saudável</span>
                        </div>

                        <!-- Botão Adicionar -->
                        <div id="btn-add-plant" style="
                            border: 2px dashed rgba(16, 185, 129, 0.3);
                            border-radius: 15px; padding: 1rem;
                            display: flex; flex-direction: column; align-items: center; justify-content: center;
                            gap: 0.5rem; cursor: pointer; min-height: 110px;
                            transition: all 0.3s;
                        " onmouseover="this.style.background='rgba(16, 185, 129, 0.05)'" onmouseout="this.style.background='transparent'">
                            <span class="material-symbols-rounded" style="color: #10b981; font-size: 2rem;">add_circle</span>
                            <span style="color: #10b981; font-size: 0.7rem; font-weight: 800;">ADICIONAR</span>
                        </div>
                    </div>

                    <div style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%) rotate(180deg); opacity: 0.2; animation: bounceX 2s infinite;">
                        <span class="material-symbols-rounded" style="font-size: 1.5rem; color: #fff;">chevron_right</span>
                    </div>
                </section>
            </div>
        `;

        setTimeout(() => {
            const carousel = container.querySelector('#dashboard-carousel');
            const btnReturn = container.querySelector('#btn-return-landing');

            // Centraliza no slide LABORATÓRIO (Slide 1) ao carregar
            if (carousel) {
                carousel.scrollLeft = 1 * window.innerWidth;
            }

            if (btnReturn) {
                btnReturn.onclick = () => window.location.hash = '#landing';
            }

            // Lógica para o laboratório de PLANTAS
            const btnAddPlant = container.querySelector('#btn-add-plant');
            const plantsGrid = container.querySelector('#plants-grid');

            if (btnAddPlant && plantsGrid) {
                btnAddPlant.onclick = () => {
                    const newCard = document.createElement('div');
                    newCard.className = 'glass-card';
                    newCard.style.cssText = `
                        background: rgba(255,255,255,0.03); 
                        border: 1px solid rgba(16, 185, 129, 0.2);
                        border-radius: 15px; padding: 1rem;
                        display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
                        animation: fadeIn 0.5s ease;
                    `;
                    newCard.innerHTML = `
                        <div style="width: 50px; height: 50px; background: rgba(16, 185, 129, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <span class="material-symbols-rounded" style="color: #10b981;">nature</span>
                        </div>
                        <span style="color: #fff; font-size: 0.8rem; font-weight: 700;">Nova Planta</span>
                        <span style="color: #64748b; font-size: 0.6rem;">Status: Teste</span>
                    `;
                    plantsGrid.insertBefore(newCard, btnAddPlant);
                };
            }
        }, 100);

        return container;
    }
};

export default DashboardPage;
