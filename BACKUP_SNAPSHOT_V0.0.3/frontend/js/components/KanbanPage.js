/**
 * Componente: KanbanPage
 * Quadro Kanban Premium do Ploc
 */
export const renderKanbanPage = () => {
    const container = document.createElement('div');

    Object.assign(container.style, {
        width: '100%', minHeight: '100vh',
        background: '#020617',
        color: '#fff',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '2rem',
        paddingBottom: '100px',
        overflowX: 'auto'
    });

    const columns = [
        { title: 'A FAZER', color: '#64748b', tasks: ['Arrumar o quarto', 'Estudar JS'] },
        { title: 'EM CURSO', color: '#38bdf8', tasks: ['Desenvolver Ploc'] },
        { title: 'FEITO', color: '#22c55e', tasks: ['Configurar VPS', 'Dockerizar App'] }
    ];

    container.innerHTML = `
        <div style="max-width: 1000px; margin: 0 auto;">
            <!-- Header -->
            <header style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 3rem;">
                <div id="kanban-back" style="cursor: pointer; opacity: 0.6; transition: 0.3s;">
                    <span class="material-symbols-rounded">arrow_back_ios</span>
                </div>
                <h1 style="font-size: 1.2rem; margin: 0; font-weight: 800; letter-spacing: 4px;">QUADRO KANBAN</h1>
            </header>

            <!-- Grid de Colunas -->
            <div style="display: flex; gap: 1.5rem; overflow-X: auto; padding-bottom: 1rem;">
                ${columns.map(col => `
                    <div style="
                        min-width: 280px; flex: 1; background: rgba(255,255,255,0.02);
                        border-radius: 20px; padding: 1.2rem; border: 1px solid rgba(255,255,255,0.05);
                        display: flex; flex-direction: column; gap: 1rem;
                    ">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                            <h2 style="font-size: 0.7rem; color: ${col.color}; letter-spacing: 2px; font-weight: 800; margin: 0;">${col.title}</h2>
                            <span style="background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; color: #64748b;">${col.tasks.length}</span>
                        </div>
                        
                        ${col.tasks.map(task => `
                            <div class="kanban-card" style="
                                background: rgba(255,255,255,0.03); padding: 1.2rem; border-radius: 12px;
                                border: 1px solid rgba(255,255,255,0.05); cursor: grab; transition: all 0.3s ease;
                            ">
                                <p style="margin: 0; font-size: 0.85rem; font-weight: 500;">${task}</p>
                            </div>
                        `).join('')}

                        <div style="
                            padding: 0.8rem; border: 1px dashed rgba(255,255,255,0.1);
                            border-radius: 12px; display: flex; align-items: center; justify-content: center;
                            cursor: pointer; opacity: 0.4; transition: 0.3s;
                        " onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.4">
                            <span class="material-symbols-rounded">add</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <style>
            .kanban-card:hover {
                background: rgba(255,255,255,0.07);
                border-color: rgba(56, 189, 248, 0.3);
                transform: translateY(-2px);
            }
        </style>
    `;

    setTimeout(() => {
        const btnBack = container.querySelector('#kanban-back');
        if (btnBack) {
            btnBack.onclick = () => {
                window.location.hash = '#landing';
            };
        }
    }, 0);

    return container;
};
