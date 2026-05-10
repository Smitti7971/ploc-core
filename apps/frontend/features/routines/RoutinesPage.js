import { apiClient } from '../../shared/api/client.js';

export const renderRoutinesPage = () => {
    const container = document.createElement('div');
    container.className = 'page-container';
    container.style.cssText = `
        padding: 1.5rem; min-height: 100vh; color: #fff;
        background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
        animation: fadeIn 0.5s ease;
    `;

    container.innerHTML = `
        <style>
            .routine-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 1.5rem;
                margin-top: 1rem;
            }
            .routine-banner {
                position: relative;
                height: 180px;
                border-radius: 24px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 1px solid rgba(255,255,255,0.05);
            }
            .routine-banner:hover {
                transform: translateY(-8px) scale(1.02);
                box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                border-color: rgba(255,255,255,0.2);
            }
            .routine-banner::before {
                content: '';
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
                z-index: 1;
            }
            .routine-content {
                position: absolute;
                bottom: 0; left: 0; width: 100%;
                padding: 1.5rem;
                z-index: 2;
            }
            .routine-badge {
                position: absolute;
                top: 1rem; right: 1rem;
                padding: 0.3rem 0.8rem;
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(5px);
                border-radius: 12px;
                font-size: 0.6rem;
                font-weight: 800;
                letter-spacing: 1px;
                z-index: 2;
            }
            
            /* Gradients por Categoria */
            .bg-treino { background: linear-gradient(45deg, #ef4444, #991b1b); }
            .bg-estudo { background: linear-gradient(45deg, #3b82f6, #1e40af); }
            .bg-saude { background: linear-gradient(45deg, #22c55e, #166534); }
            .bg-trabalho { background: linear-gradient(45deg, #eab308, #854d0e); }
            .bg-leitura { background: linear-gradient(45deg, #a855f7, #6b21a8); }
            .bg-custom { background: linear-gradient(45deg, #64748b, #334155); border: 2px dashed rgba(255,255,255,0.1); }
        </style>

        <header style="display: flex; align-items: center; gap: 1.2rem; margin-bottom: 2rem;">
            <div id="btn-back-dashboard" class="flex-center" style="width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.05); cursor: pointer; border: 1px solid rgba(255,255,255,0.1);">
                <span class="material-symbols-rounded">arrow_back</span>
            </div>
            <div>
                <h1 style="font-size: 1.6rem; font-weight: 900; letter-spacing: 2px; margin: 0;">CENTRO DE ROTINAS</h1>
                <p style="font-size: 0.75rem; opacity: 0.5; letter-spacing: 1px; margin-top: 0.2rem;">PROJETE SUA MELHOR VERSÃO</p>
            </div>
        </header>

        <div id="routines-loading" style="padding: 4rem; text-align: center; opacity: 0.5;">
            <div class="flex-center" style="margin-bottom: 1rem;">
                <div style="width: 20px; height: 20px; border: 2px solid var(--accent); border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            </div>
            <p style="font-size: 0.8rem; font-weight: 700; letter-spacing: 1px;">SINCRONIZANDO TEMPLATES...</p>
        </div>

        <div id="templates-grid" class="routine-grid" style="display: none;">
            <!-- Templates serão injetados aqui -->
        </div>

        <!-- Opção de Criar do Zero -->
        <div style="margin-top: 3rem;">
            <h3 style="font-size: 0.8rem; letter-spacing: 2px; opacity: 0.4; margin-bottom: 1.5rem;">ESTRUTURA PERSONALIZADA</h3>
            <div id="btn-create-scratch" class="routine-banner bg-custom" style="height: 100px; display: flex; align-items: center; justify-content: center; gap: 1rem;">
                <span class="material-symbols-rounded" style="font-size: 2rem; opacity: 0.5;">add_circle</span>
                <div style="text-align: left;">
                    <h4 style="margin: 0; font-size: 0.9rem; font-weight: 800;">CRIAR DO ZERO</h4>
                    <p style="margin: 0; font-size: 0.6rem; opacity: 0.5;">DEFINA CADA ENGRENAGEM DA SUA ROTINA</p>
                </div>
            </div>
        </div>

        <!-- Modal de Decisão de Rotina -->
        <div id="routine-decision-modal" style="
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); backdrop-filter: blur(20px); z-index: 3000;
            align-items: center; justify-content: center; opacity: 0; transition: all 0.4s ease;
        ">
            <div class="glass-pill" style="width: 90%; max-width: 400px; padding: 2.5rem; border-radius: 40px; border: 1px solid rgba(255,255,255,0.1); text-align: center;">
                <div id="modal-template-category" class="routine-badge" style="position: static; display: inline-block; margin-bottom: 1rem;">CATEGORIA</div>
                <h2 id="modal-template-name" style="font-size: 1.3rem; font-weight: 900; letter-spacing: 2px; margin-bottom: 1rem;">NOME DA ROTINA</h2>
                <p id="modal-template-desc" style="font-size: 0.75rem; opacity: 0.6; line-height: 1.6; margin-bottom: 2rem;">Descrição curta do que esta rotina faz e como ela vai te ajudar.</p>

                <div id="decision-step-1" class="flex-column" style="gap: 1rem;">
                    <button id="btn-adopt-ready" class="glass-pill" style="padding: 1.2rem; border: none; background: var(--accent); color: #fff; font-weight: 800; font-size: 0.75rem; cursor: pointer; letter-spacing: 1px; transition: all 0.3s ease;">
                        ADOTAR PRONTA ⚡
                    </button>
                    <button id="btn-customize" class="glass-pill" style="padding: 1.2rem; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: #fff; font-weight: 800; font-size: 0.75rem; cursor: pointer; letter-spacing: 1px; transition: all 0.3s ease;">
                        PERSONALIZAR DETALHES
                    </button>
                    <button id="btn-close-modal" style="background: none; border: none; color: var(--text-dim); font-size: 0.7rem; font-weight: 700; cursor: pointer; margin-top: 0.5rem; text-decoration: underline;">VOLTAR</button>
                </div>

                <!-- Passo 2: Escolha de Dias (Apenas para Adoção Pronta) -->
                <div id="decision-step-2" style="display: none; flex-direction: column; gap: 1.5rem;">
                    <p style="font-size: 0.7rem; font-weight: 800; letter-spacing: 1px; opacity: 0.8;">QUAIS DIAS VOCÊ TEM DISPONÍVEIS?</p>
                    <div style="display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap;">
                        ${['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => `
                            <div class="day-picker-circle" data-day="${i}" style="
                                width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1);
                                display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800;
                                cursor: pointer; transition: all 0.3s ease;
                            ">${d}</div>
                        `).join('')}
                    </div>
                    <button id="btn-confirm-adopt" class="glass-pill" style="padding: 1.2rem; border: none; background: #22c55e; color: #fff; font-weight: 900; font-size: 0.75rem; cursor: pointer; letter-spacing: 2px; box-shadow: 0 10px 20px rgba(34, 197, 94, 0.2);">
                        ATIVAR ROTINA AGORA 🚀
                    </button>
                </div>
            </div>
        </div>
    `;

    const loadTemplates = async () => {
        const loading = container.querySelector('#routines-loading');
        const grid = container.querySelector('#templates-grid');

        try {
            const templates = await apiClient.get('/routines/templates');
            loading.style.display = 'none';
            grid.style.display = 'grid';

            grid.innerHTML = templates.map(t => `
                <div class="routine-banner bg-${t.category.toLowerCase()}" data-id="${t.id}">
                    <div class="routine-badge">${t.category}</div>
                    <div class="routine-content">
                        <h3 style="margin: 0; font-size: 1.1rem; font-weight: 900; letter-spacing: 1px;">${t.name.toUpperCase()}</h3>
                        <p style="margin: 0.4rem 0 0 0; font-size: 0.65rem; opacity: 0.8; line-height: 1.4;">${t.description}</p>
                    </div>
                </div>
            `).join('');

            grid.querySelectorAll('.routine-banner').forEach(banner => {
                banner.onclick = () => {
                    const templateId = banner.dataset.id;
                    const template = templates.find(item => item.id == templateId);
                    openDecisionModal(template);
                };
            });
        } catch (error) {
            console.error('Erro ao carregar templates:', error);
            loading.innerHTML = `<p style="color: #ef4444;">Erro ao conectar com o servidor.</p>`;
        }
    };

    const openDecisionModal = (template) => {
        const modal = container.querySelector('#routine-decision-modal');
        const step1 = container.querySelector('#decision-step-1');
        const step2 = container.querySelector('#decision-step-2');
        
        container.querySelector('#modal-template-category').innerText = template.category;
        container.querySelector('#modal-template-name').innerText = template.name.toUpperCase();
        container.querySelector('#modal-template-desc').innerText = template.description;

        const btnAdoptReady = container.querySelector('#btn-adopt-ready');
        const btnConfirmAdopt = container.querySelector('#btn-confirm-adopt');
        const dayCircles = container.querySelectorAll('.day-picker-circle');
        let selectedDays = [...(template.config.days || [])];

        // Reset visual dos dias
        dayCircles.forEach(c => {
            const day = parseInt(c.dataset.day);
            if (selectedDays.includes(day)) {
                c.style.background = 'var(--accent)';
                c.style.borderColor = 'var(--accent)';
            } else {
                c.style.background = 'transparent';
                c.style.borderColor = 'rgba(255,255,255,0.1)';
            }
            
            c.onclick = () => {
                const dayIndex = parseInt(c.dataset.day);
                if (selectedDays.includes(dayIndex)) {
                    selectedDays = selectedDays.filter(d => d !== dayIndex);
                    c.style.background = 'transparent';
                    c.style.borderColor = 'rgba(255,255,255,0.1)';
                } else {
                    selectedDays.push(dayIndex);
                    c.style.background = 'var(--accent)';
                    c.style.borderColor = 'var(--accent)';
                }
            };
        });

        btnAdoptReady.onclick = () => {
            step1.style.display = 'none';
            step2.style.display = 'flex';
        };

        btnConfirmAdopt.onclick = async () => {
            if (selectedDays.length === 0) return alert("Mestre, selecione pelo menos um dia! 😉");
            
            try {
                btnConfirmAdopt.innerText = "ATIVANDO...";
                btnConfirmAdopt.disabled = true;
                
                await apiClient.post('/routines/adopt', {
                    templateId: template.id,
                    config: { ...template.config, days: selectedDays }
                });

                alert("Rotina ativada com sucesso! As tarefas foram projetadas no seu calendário. 🚀");
                window.location.hash = '#dashboard';
            } catch (error) {
                alert("Erro ao adotar rotina: " + error.message);
                btnConfirmAdopt.innerText = "ATIVAR ROTINA AGORA 🚀";
                btnConfirmAdopt.disabled = false;
            }
        };

        modal.style.display = 'flex';
        setTimeout(() => { modal.style.opacity = '1'; }, 10);

        container.querySelector('#btn-close-modal').onclick = () => {
            modal.style.opacity = '0';
            setTimeout(() => { 
                modal.style.display = 'none';
                step1.style.display = 'flex';
                step2.style.display = 'none';
            }, 400);
        };
    };

    setTimeout(() => {
        const btnBack = container.querySelector('#btn-back-dashboard');
        if (btnBack) btnBack.onclick = () => window.location.hash = '#dashboard';

        const btnScratch = container.querySelector('#btn-create-scratch');
        if (btnScratch) btnScratch.onclick = () => alert('Fluxo de criação do zero em breve!');

        loadTemplates();
    }, 0);

    return container;
};
