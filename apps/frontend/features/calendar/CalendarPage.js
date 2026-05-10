import { createPlocAvatar } from '../../shared/components/PlocAvatar.js?v=0.0.9';
import { apiClient } from '../../shared/api/client.js?v=0.0.9';
import { initChatLogic } from '../chat/ChatWidget.js?v=0.0.9';

/**
 * Calendar Page - Visualização de Compromissos e Tarefas
 */
export const renderCalendarPage = () => {
    const container = document.createElement('div');
    container.className = 'page-container';
    container.style.cssText = `
        padding: 2rem; min-height: 100vh; color: #fff;
        background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
    `;

    container.innerHTML = `
        <style>
            .calendar-header { 
                display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; gap: 1rem;
            }
            .view-content-grid {
                display: grid; gap: 1rem; transition: all 0.5s ease;
            }
            /* Mobile Adjustments */
            @media (max-width: 600px) {
                .calendar-header { flex-direction: column; align-items: stretch; }
                .calendar-header > div { justify-content: space-between; width: 100%; }
                #view-switcher { order: 3; width: 100%; justify-content: center; }
                
                .year-grid { grid-template-columns: repeat(2, 1fr) !important; }
                .week-grid { 
                    display: flex !important; overflow-x: auto; padding-bottom: 1rem;
                    scroll-snap-type: x mandatory; gap: 1rem;
                }
                .week-day-card { 
                    min-width: 80% !important; scroll-snap-align: center;
                }
                .month-grid { gap: 2px !important; }
                .calendar-day { height: 60px !important; padding: 2px !important; }
                .calendar-day span { font-size: 0.5rem !important; }
            }
        </style>
        <header class="calendar-header">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div id="btn-back-landing" class="flex-center" style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.05); cursor: pointer;">
                    <span class="material-symbols-rounded">arrow_back</span>
                </div>
                <div>
                    <h1 style="font-size: 1.5rem; font-weight: 800; letter-spacing: 2px;">CALENDÁRIO</h1>
                    <p style="font-size: 0.8rem; opacity: 0.5; letter-spacing: 1px;">SUA LINHA DO TEMPO COGNITIVA</p>
                </div>
            </div>
            
            <div id="view-switcher" class="glass-pill" style="display: flex; gap: 0.5rem; padding: 0.3rem;">
                ${['ANO', 'MÊS', 'SEMANA', 'DIA'].map(v => `
                    <div class="view-option ${v === 'MÊS' ? 'active' : ''}" data-view="${v}" style="
                        padding: 0.4rem 1rem; font-size: 0.6rem; font-weight: 800; border-radius: 15px;
                        cursor: pointer; transition: all 0.3s ease; letter-spacing: 1px;
                        background: ${v === 'MÊS' ? 'var(--accent)' : 'transparent'};
                        color: ${v === 'MÊS' ? '#fff' : 'rgba(255,255,255,0.4)'};
                    ">${v}</div>
                `).join('')}
            </div>

            <div style="display: flex; align-items: center; gap: 1rem;">
                <div id="current-period-label" class="glass-pill" style="padding: 0.5rem 1rem; font-size: 0.7rem; font-weight: 700; min-width: 120px; text-align: center;">
                    ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}
                </div>
                
                <!-- Cápsula Camaleão -->
                <div id="capsule-container" class="glass-pill" style="
                    display: flex; align-items: center; padding: 0.4rem;
                    cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative; min-width: 100px; justify-content: space-between;
                ">
                    <div id="capsule-user" class="flex-center" style="gap: 0.8rem; padding: 0 0.6rem;">
                        <div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(145deg, var(--accent), #1d4ed8); display: flex; align-items: center; justify-content: center;">
                            <span class="material-symbols-rounded" style="font-size: 1rem;">person</span>
                        </div>
                        <span style="font-size: 0.7rem; font-weight: 700;">${JSON.parse(localStorage.getItem('ploc_user') || '{}').name?.split(' ')[0] || 'MESTRE'}</span>
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
            </div>
        </header>

        <!-- Container Principal Dinâmico -->
        <div id="view-content" style="min-height: 400px; transition: all 0.5s ease;">
            <!-- Conteúdo injetado via JS -->
        </div>

        <!-- Modal de Criação/Edição Refatorado -->
        <div id="quick-task-modal" style="
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); backdrop-filter: blur(15px); z-index: 2000;
            align-items: center; justify-content: center; opacity: 0; transition: all 0.3s ease;
        ">
            <div class="glass-pill" style="width: 90%; max-width: 450px; padding: 2.5rem; border-radius: 40px; display: flex; flex-direction: column; gap: 1.5rem; border: 1px solid rgba(255,255,255,0.1);">
                <div style="text-align: center; margin-bottom: 0.5rem;">
                    <h2 id="modal-date-title" style="font-size: 1.1rem; letter-spacing: 4px; color: var(--accent); font-weight: 800;">00 DE MAIO</h2>
                    <p id="modal-subtitle" style="font-size: 0.6rem; opacity: 0.5; font-weight: 700; margin-top: 0.3rem;">DETALHES DA TAREFA</p>
                </div>

                <div class="flex-column" style="gap: 1.2rem;">
                    <!-- Nome -->
                    <div class="flex-column" style="gap: 0.4rem;">
                        <label style="font-size: 0.55rem; opacity: 0.4; font-weight: 800; letter-spacing: 1px; padding-left: 0.5rem;">TÍTULO</label>
                        <input type="text" id="quick-task-input" placeholder="O QUE VAMOS FAZER?" style="
                            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
                            padding: 1rem; border-radius: 18px; color: #fff; font-size: 0.85rem; outline: none;
                            font-weight: 600; transition: border 0.3s ease;
                        ">
                    </div>

                    <!-- Descrição -->
                    <div class="flex-column" style="gap: 0.4rem;">
                        <label style="font-size: 0.55rem; opacity: 0.4; font-weight: 800; letter-spacing: 1px; padding-left: 0.5rem;">NOTAS</label>
                        <textarea id="quick-task-desc" placeholder="DETALHES ADICIONAIS..." style="
                            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
                            padding: 1rem; border-radius: 18px; color: #fff; font-size: 0.8rem; outline: none;
                            font-weight: 500; height: 80px; resize: none; transition: border 0.3s ease;
                        "></textarea>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <!-- Prioridade -->
                        <div class="flex-column" style="gap: 0.4rem;">
                            <label style="font-size: 0.55rem; opacity: 0.4; font-weight: 800; letter-spacing: 1px; padding-left: 0.5rem;">PRIORIDADE</label>
                            <select id="quick-task-priority" style="
                                background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
                                padding: 0.8rem; border-radius: 15px; color: #fff; font-size: 0.75rem; outline: none;
                                font-weight: 700; cursor: pointer;
                            ">
                                <option value="BAIXA" style="background: #1e293b;">BAIXA</option>
                                <option value="MEDIA" style="background: #1e293b;" selected>MÉDIA</option>
                                <option value="ALTA" style="background: #1e293b;">ALTA</option>
                            </select>
                        </div>
                        <!-- Categoria -->
                        <div class="flex-column" style="gap: 0.4rem;">
                            <label style="font-size: 0.55rem; opacity: 0.4; font-weight: 800; letter-spacing: 1px; padding-left: 0.5rem;">CATEGORIA</label>
                            <input type="text" id="quick-task-category" placeholder="EX: TRABALHO" style="
                                background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
                                padding: 0.8rem; border-radius: 15px; color: #fff; font-size: 0.75rem; outline: none;
                                font-weight: 700;
                            ">
                        </div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.8rem; margin-top: 1rem;">
                    <div style="display: flex; gap: 1rem;">
                        <button id="btn-cancel-quick" style="flex: 1; padding: 1rem; border-radius: 18px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #fff; cursor: pointer; font-size: 0.7rem; font-weight: 800; transition: all 0.3s ease;">VOLTAR</button>
                        <button id="btn-save-quick" style="flex: 1; padding: 1rem; border-radius: 18px; border: none; background: var(--accent); color: #fff; cursor: pointer; font-size: 0.7rem; font-weight: 800; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);">SALVAR</button>
                    </div>
                    <button id="btn-delete-modal" style="display: none; width: 100%; padding: 0.9rem; border-radius: 18px; border: none; background: rgba(239, 68, 68, 0.08); color: #ef4444; cursor: pointer; font-size: 0.65rem; font-weight: 800; transition: all 0.3s ease;">EXCLUIR TAREFA</button>
                </div>
            </div>
        </div>

        <div id="task-list" class="flex-column" style="gap: 1rem;">
            <h3 style="font-size: 0.8rem; letter-spacing: 2px; opacity: 0.5;">PRÓXIMAS TAREFAS</h3>
            <div id="tasks-container" style="display: flex; flex-direction: column; gap: 0.8rem;">
                <div style="padding: 2rem; text-align: center; opacity: 0.3; font-size: 0.8rem; border: 1px dashed rgba(255,255,255,0.1); border-radius: 20px;">
                    NENHUMA TAREFA AGENDADA
                </div>
            </div>
        </div>

        <!-- O Avatar estará sempre presente para controle -->
        <div id="avatar-container" style="position: fixed; bottom: 2rem; right: 2rem; z-index: 100;"></div>
    `;

    // Lógica da Página
    setTimeout(async () => {
        const avatarContainer = container.querySelector('#avatar-container');
        if (avatarContainer) {
            avatarContainer.appendChild(createPlocAvatar());
            initChatLogic();
        }

        const btnBack = container.querySelector('#btn-back-landing');
        if (btnBack) btnBack.onclick = () => window.location.hash = '#landing';

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
                if (capUser) capUser.style.display = 'flex';
                if (capActions) capActions.style.display = 'none';
                if (capsule) capsule.style.minWidth = '100px';
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

        // --- LÓGICA DE TROCA DE VISUALIZAÇÃO ---
        const viewSwitcher = container.querySelector('#view-switcher');
        const viewContent = container.querySelector('#view-content');
        const periodLabel = container.querySelector('#current-period-label');
        let currentView = 'MÊS';

        const renderYearView = () => {
            const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
            periodLabel.innerText = new Date().getFullYear();
            viewContent.innerHTML = `
                <div class="year-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; animation: fadeIn 0.5s ease;">
                    ${months.map((m, i) => `
                        <div class="glass-pill" style="padding: 1rem; text-align: center; border-radius: 20px;">
                            <h4 style="font-size: 0.7rem; margin-bottom: 0.5rem; color: var(--accent); font-weight: 800;">${m}</h4>
                            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px;">
                                ${Array.from({ length: 31 }).map((_, d) => `
                                    <div style="width: 4px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        };

        const renderMonthView = () => {
            periodLabel.innerText = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase();
            viewContent.innerHTML = `
                <div id="calendar-grid" class="month-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; margin-bottom: 2rem; animation: fadeIn 0.5s ease;">
                    ${['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(dia => `
                        <div style="text-align: center; font-size: 0.6rem; font-weight: 800; opacity: 0.3; padding: 0.5rem 0;">${dia}</div>
                    `).join('')}
                    ${Array.from({ length: 35 }).map((_, i) => {
                        const day = i - 3; // Simulação
                        const isToday = day === new Date().getDate();
                        const isValidDay = day > 0 && day <= 31;
                        return `
                            <div class="calendar-day ${isValidDay ? 'day-clickable' : ''}" data-day="${day}" style="
                                height: 80px; background: ${isToday ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)'};
                                border-radius: 12px; padding: 0.5rem; border: 1px solid ${isToday ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)'};
                                display: flex; flex-direction: column; gap: 0.3rem; transition: all 0.3s ease;
                                cursor: ${isValidDay ? 'pointer' : 'default'};
                            ">
                                <span style="font-size: 0.7rem; font-weight: 700; opacity: ${isValidDay ? '1' : '0.2'}">${isValidDay ? day : ''}</span>
                                <div id="day-events-${day}" style="display: flex; flex-direction: column; gap: 2px; overflow: hidden;"></div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            container.querySelectorAll('.day-clickable').forEach(el => {
                el.onclick = () => openModal(parseInt(el.dataset.day));
            });
        };

        const renderWeekView = () => {
            periodLabel.innerText = "ESTA SEMANA";
            viewContent.innerHTML = `
                <div class="week-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1rem; animation: fadeIn 0.5s ease;">
                    ${['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((dia, i) => {
                        const dayDate = new Date();
                        dayDate.setDate(dayDate.getDate() - dayDate.getDay() + i);
                        const dayStr = dayDate.getDate();
                        const fullDateStr = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`;
                        
                        return `
                            <div class="week-day-card glass-pill" 
                                data-full-date="${fullDateStr}"
                                style="min-height: 350px; padding: 1rem; border-radius: 25px; transition: all 0.3s ease;">
                                <div style="text-align: center; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1rem;">
                                    <div style="font-size: 0.6rem; opacity: 0.5; font-weight: 800;">${dia}</div>
                                    <div style="font-size: 1.2rem; font-weight: 800; color: var(--accent);">${dayStr}</div>
                                </div>
                                <div id="week-day-events-${dayStr}" class="flex-column" style="gap: 0.5rem; min-height: 200px;">
                                    <!-- Tarefas da semana aqui -->
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

            // Configurar Drop Zones
            container.querySelectorAll('.week-day-card').forEach(col => {
                col.ondragover = (e) => {
                    e.preventDefault();
                    col.style.background = 'rgba(255,255,255,0.08)';
                    col.style.transform = 'scale(1.02)';
                };
                col.ondragleave = () => {
                    col.style.background = '';
                    col.style.transform = 'scale(1)';
                };
                col.ondrop = async (e) => {
                    e.preventDefault();
                    col.style.background = '';
                    col.style.transform = 'scale(1)';
                    
                    const taskId = e.dataTransfer.getData('text/plain');
                    const newDate = col.dataset.fullDate;

                    try {
                        await apiClient.put(`/tasks/${taskId}`, {
                            scheduledDate: newDate
                        });
                        loadTasks(); // Recarrega tudo
                        if (window.plocControls) window.plocControls.speak("Tarefa reposicionada, mestre!");
                    } catch (err) {
                        console.error("Erro ao mover tarefa:", err);
                    }
                };
            });
        };

        const renderDayView = () => {
            periodLabel.innerText = "HOJE, " + new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }).toUpperCase();
            viewContent.innerHTML = `
                <div class="glass-pill" style="padding: 2rem; border-radius: 30px; min-height: 400px; animation: fadeIn 0.5s ease;">
                    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                        ${Array.from({ length: 12 }).map((_, i) => {
                            const hour = i + 8;
                            return `
                                <div style="display: flex; gap: 2rem; align-items: center;">
                                    <div style="font-size: 0.7rem; opacity: 0.3; width: 40px; font-weight: 800;">${hour}:00</div>
                                    <div id="day-hour-${hour}" style="flex: 1; height: 1px; background: rgba(255,255,255,0.05); position: relative;">
                                        <!-- Tarefas do dia aqui -->
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        };

        viewSwitcher.onclick = (e) => {
            const opt = e.target.closest('.view-option');
            if (!opt) return;

            viewSwitcher.querySelectorAll('.view-option').forEach(el => {
                el.classList.remove('active');
                el.style.background = 'transparent';
                el.style.color = 'rgba(255,255,255,0.4)';
            });
            opt.classList.add('active');
            opt.style.background = 'var(--accent)';
            opt.style.color = '#fff';

            currentView = opt.dataset.view;
            if (currentView === 'ANO') renderYearView();
            if (currentView === 'MÊS') renderMonthView();
            if (currentView === 'SEMANA') renderWeekView();
            if (currentView === 'DIA') renderDayView();
            
            loadTasks();
        };

        renderMonthView(); // Inicializa o grid dinâmico

        if (btnSettings) {
            btnSettings.onclick = () => window.location.hash = '#settings';
        }

        const btnGoRoutines = container.querySelector('#go-routines');
        if (btnGoRoutines) {
            btnGoRoutines.onclick = (e) => {
                e.stopPropagation();
                window.location.hash = '#routines';
            };
        }

        // Carregar Tarefas
        const loadTasks = async () => {
            const tasksContainer = container.querySelector('#tasks-container');
            
            // Limpa containers dependendo da visão
            if (currentView === 'MÊS') {
                container.querySelectorAll('[id^="day-events-"]').forEach(day => day.innerHTML = '');
            } else if (currentView === 'SEMANA') {
                container.querySelectorAll('[id^="week-day-events-"]').forEach(day => day.innerHTML = '');
            } else if (currentView === 'DIA') {
                container.querySelectorAll('[id^="day-hour-"]').forEach(hour => hour.innerHTML = '');
            }

            try {
                const tasks = await apiClient.get('/tasks');
                if (tasks.length > 0) {
                    const priorityColors = { ALTA: '#ef4444', MEDIA: '#eab308', BAIXA: '#3b82f6' };

                    // Renderiza Lista Lateral (sempre visível)
                    tasksContainer.innerHTML = tasks.slice(0, 10).map(task => `
                        <div class="glass-pill" style="padding: 1rem; border-radius: 15px; display: flex; justify-content: space-between; align-items: center; animation: slideIn 0.3s ease; border-left: 4px solid ${priorityColors[task.priority] || '#3b82f6'};">
                            <div style="flex: 1;">
                                <div style="font-size: 0.8rem; font-weight: 700;">${task.name}</div>
                                <div style="font-size: 0.6rem; opacity: 0.5;">${task.scheduledTime || 'Sem hora'} | ${task.priority || 'MEDIA'}</div>
                            </div>
                            <div class="btn-delete-task flex-center" data-id="${task.id}" style="width: 24px; height: 24px; border-radius: 50%; background: rgba(239, 68, 68, 0.1); cursor: pointer; transition: all 0.3s ease;">
                                <span class="material-symbols-rounded" style="font-size: 1rem; color: #ef4444;">delete</span>
                            </div>
                        </div>
                    `).join('');

                    // Listeners de deleção e EDIÇÃO na lista lateral
                    container.querySelectorAll('.btn-delete-task').forEach(btn => {
                        btn.onclick = async (e) => {
                            e.stopPropagation();
                            if (confirm("Mestre, deseja mesmo eliminar esta tarefa?")) {
                                try {
                                    await apiClient.delete(`/tasks/${btn.dataset.id}`);
                                    loadTasks();
                                    if (window.plocControls) window.plocControls.speak("Tarefa eliminada!");
                                } catch (err) { console.error(err); }
                            }
                        };
                    });

                    // EDIÇÃO na lista lateral (clique no texto)
                    container.querySelectorAll('#tasks-container > div').forEach((item, idx) => {
                        const task = tasks[idx];
                        item.onclick = (e) => {
                            if (!e.target.closest('.btn-delete-task')) {
                                openModal(task);
                            }
                        };
                    });

                    // Distribui tarefas no Grid Ativo
                    tasks.forEach(task => {
                        if (!task.scheduledDate) return;
                        
                        const datePart = task.scheduledDate.split('T')[0];
                        const [year, month, dayStr] = datePart.split('-');
                        const day = parseInt(dayStr);
                        const hour = task.scheduledTime ? parseInt(task.scheduledTime.split(':')[0]) : null;

                        if (currentView === 'MÊS') {
                            const eventSlot = container.querySelector(`#day-events-${day}`);
                            if (eventSlot) {
                                eventSlot.innerHTML += `<div title="${task.name}" style="width: 100%; height: 4px; background: var(--accent); border-radius: 2px; margin-top: 2px;"></div>`;
                            }
                        } else if (currentView === 'SEMANA') {
                            const weekSlot = container.querySelector(`#week-day-events-${day}`);
                            if (weekSlot) {
                                const card = document.createElement('div');
                                card.draggable = true;
                                card.dataset.taskId = task.id;
                                card.style.cssText = `
                                    background: rgba(255,255,255,0.05); padding: 0.5rem; border-radius: 10px; 
                                    font-size: 0.6rem; border-left: 3px solid ${priorityColors[task.priority] || 'var(--accent)'}; cursor: grab;
                                    transition: transform 0.2s ease, opacity 0.2s ease;
                                `;
                                card.innerHTML = `
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
                                        <div style="flex: 1;">
                                            <div style="font-weight: 800;">${task.name}</div>
                                            <div style="opacity: 0.5;">${task.scheduledTime || ''}</div>
                                        </div>
                                        <div class="mini-delete" style="opacity: 0.3; cursor: pointer; transition: all 0.3s ease;">
                                            <span class="material-symbols-rounded" style="font-size: 0.9rem;">close</span>
                                        </div>
                                    </div>
                                `;

                                // Lógica de deleção e EDIÇÃO no card
                                const btnDel = card.querySelector('.mini-delete');
                                btnDel.onclick = async (e) => {
                                    e.stopPropagation();
                                    if (confirm("Deletar tarefa?")) {
                                        try {
                                            await apiClient.delete(`/tasks/${task.id}`);
                                            loadTasks();
                                        } catch (err) { console.error(err); }
                                    }
                                };
                                btnDel.onmousedown = (e) => e.stopPropagation(); 
                                btnDel.ontouchstart = (e) => e.stopPropagation();

                                card.onclick = (e) => {
                                    if (!e.target.closest('.mini-delete')) {
                                        openModal(task);
                                    }
                                };

                                card.ondragstart = (e) => {
                                    e.dataTransfer.setData('text/plain', task.id);
                                    card.style.opacity = '0.5';
                                    card.style.transform = 'scale(0.95)';
                                };
                                card.ondragend = () => {
                                    card.style.opacity = '1';
                                    card.style.transform = 'scale(1)';
                                };

                                // Suporte a Touch (Mobile)
                                card.ontouchstart = (e) => {
                                    card.style.opacity = '0.5';
                                    card.style.zIndex = '1000';
                                };
                                card.ontouchmove = (e) => {
                                    if (e.cancelable) e.preventDefault(); // Impede scroll durante o drag
                                    const touch = e.touches[0];
                                    const target = document.elementFromPoint(touch.clientX, touch.clientY);
                                    const col = target?.closest('.week-day-card');
                                    
                                    // Feedback visual no mobile
                                    container.querySelectorAll('.week-day-card').forEach(c => c.style.background = '');
                                    if (col) col.style.background = 'rgba(255,255,255,0.08)';
                                };
                                card.ontouchend = async (e) => {
                                    card.style.opacity = '1';
                                    const touch = e.changedTouches[0];
                                    const target = document.elementFromPoint(touch.clientX, touch.clientY);
                                    const col = target?.closest('.week-day-card');

                                    if (col) {
                                        const newDate = col.dataset.fullDate;
                                        try {
                                            await apiClient.put(`/tasks/${task.id}`, { scheduledDate: newDate });
                                            loadTasks();
                                            if (window.plocControls) window.plocControls.speak("Tarefa movida!");
                                        } catch (err) { console.error(err); }
                                    }
                                    container.querySelectorAll('.week-day-card').forEach(c => c.style.background = '');
                                };

                                weekSlot.appendChild(card);
                            }
                        } else if (currentView === 'DIA' && hour) {
                            const hourSlot = container.querySelector(`#day-hour-${hour}`);
                            const isToday = day === new Date().getDate();
                            if (hourSlot && isToday) {
                                hourSlot.innerHTML += `
                                    <div style="
                                        position: absolute; top: -10px; left: 10px; right: 10px;
                                        background: var(--accent); padding: 0.5rem 1rem; border-radius: 10px;
                                        font-size: 0.7rem; font-weight: 800; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                                        animation: fadeIn 0.5s ease;
                                    ">${task.name} <span style="opacity: 0.6; font-weight: 400; margin-left: 0.5rem;">${task.scheduledTime}</span></div>
                                `;
                            }
                        }
                    });
                }
            } catch (e) {
                console.error("Erro ao carregar tarefas", e);
            }
        };

        loadTasks();

        // Lógica do Modal de Criação/Edição
        const quickModal = container.querySelector('#quick-task-modal');
        const quickInput = container.querySelector('#quick-task-input');
        const quickDesc = container.querySelector('#quick-task-desc');
        const quickPriority = container.querySelector('#quick-task-priority');
        const quickCategory = container.querySelector('#quick-task-category');
        
        const modalTitle = container.querySelector('#modal-date-title');
        const btnCancel = container.querySelector('#btn-cancel-quick');
        const btnSave = container.querySelector('#btn-save-quick');
        const btnDeleteModal = container.querySelector('#btn-delete-modal');
        let selectedDate = null;
        let editingTaskId = null;

        const openModal = (dayOrTask) => {
            const now = new Date();
            
            if (typeof dayOrTask === 'number') {
                // Modo CRIAÇÃO
                selectedDate = new Date(now.getFullYear(), now.getMonth(), dayOrTask);
                modalTitle.innerText = `${dayOrTask} DE ${now.toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase()}`;
                quickInput.value = '';
                quickDesc.value = '';
                quickPriority.value = 'MEDIA';
                quickCategory.value = 'Geral';
                btnSave.innerText = "AGENDAR";
                editingTaskId = null;
                btnDeleteModal.style.display = 'none';
            } else {
                // Modo EDIÇÃO
                editingTaskId = dayOrTask.id;
                quickInput.value = dayOrTask.name || '';
                quickDesc.value = dayOrTask.description || '';
                quickPriority.value = dayOrTask.priority || 'MEDIA';
                quickCategory.value = dayOrTask.category || 'Geral';
                modalTitle.innerText = "EDITAR TAREFA";
                btnSave.innerText = "ATUALIZAR";
                btnDeleteModal.style.display = 'block';
            }

            quickModal.style.display = 'flex';
            setTimeout(() => {
                quickModal.style.opacity = '1';
                quickInput.focus();
            }, 10);
        };

        const closeModal = () => {
            quickModal.style.opacity = '0';
            setTimeout(() => {
                quickModal.style.display = 'none';
                quickInput.value = '';
                quickDesc.value = '';
                quickPriority.value = 'MEDIA';
                quickCategory.value = 'Geral';
                editingTaskId = null;
                btnDeleteModal.style.display = 'none';
            }, 300);
        };

        btnDeleteModal.onclick = async () => {
            if (confirm("Mestre, deseja mesmo eliminar esta tarefa?")) {
                try {
                    await apiClient.delete(`/tasks/${editingTaskId}`);
                    closeModal();
                    loadTasks();
                    if (window.plocControls) window.plocControls.speak("Tarefa eliminada!");
                } catch (err) { console.error(err); }
            }
        };

        container.querySelectorAll('.day-clickable').forEach(el => {
            el.onclick = () => openModal(parseInt(el.dataset.day));
        });

        btnCancel.onclick = closeModal;

        btnSave.onclick = async () => {
            const taskName = quickInput.value.trim();
            if (!taskName) return alert("Mestre, dê um nome para a tarefa! 😉");

            const payload = {
                name: taskName,
                description: quickDesc.value.trim(),
                priority: quickPriority.value,
                category: quickCategory.value.trim() || 'Geral'
            };

            try {
                if (editingTaskId) {
                    // MODO EDIÇÃO
                    await apiClient.put(`/tasks/${editingTaskId}`, payload);
                    if (window.plocControls) window.plocControls.speak("Tarefa atualizada!");
                } else {
                    // MODO CRIAÇÃO
                    const year = selectedDate.getFullYear();
                    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                    const day = String(selectedDate.getDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}`;
                    
                    payload.scheduledDate = dateStr;
                    
                    await apiClient.post('/tasks', payload);
                    if (window.plocControls) window.plocControls.speak("Tarefa agendada!");
                }
                
                closeModal();
                loadTasks(); // Atualiza a UI
            } catch (e) {
                alert("Erro ao processar: " + e.message);
            }
        };

        // Escuta por novas tarefas criadas pela IA
        document.addEventListener('ploc-task-created', () => {
            loadTasks();
            if (window.plocControls) window.plocControls.speak("Calendário atualizado, mestre!");
        });

    }, 0);

    return container;
};
