/**
 * Componente: KanbanPage
 * Quadro Kanban Premium do Ploc
 */
export const renderKanbanPage = () => {
    const container = document.createElement('div');
    container.className = 'kanban-container';

    const columns = [
        { title: 'A FAZER', color: '#64748b', tasks: ['Arrumar o quarto', 'Estudar JS'] },
        { title: 'EM CURSO', color: '#38bdf8', tasks: ['Desenvolver Ploc'] },
        { title: 'FEITO', color: '#22c55e', tasks: ['Configurar VPS', 'Dockerizar App'] }
    ];

    container.innerHTML = `
        <div style="max-width: 1000px; margin: 0 auto;">
            <!-- Header -->
            <header class="flex-center" style="justify-content: flex-start; gap: 1.5rem; margin-bottom: 3rem;">
                <div id="kanban-back" style="cursor: pointer; opacity: 0.6;">
                    <span class="material-symbols-rounded">arrow_back_ios</span>
                </div>
                <h1 style="font-size: 1.2rem; margin: 0; font-weight: 800; letter-spacing: 4px;">QUADRO KANBAN</h1>
            </header>

            <!-- Grid de Colunas -->
            <div style="display: flex; gap: 1.5rem; overflow-x: auto; padding-bottom: 1rem;">
                ${columns.map(col => `
                    <div class="kanban-column">
                        <div class="flex-center" style="justify-content: space-between; margin-bottom: 0.5rem;">
                            <h2 style="font-size: 0.7rem; color: ${col.color}; letter-spacing: 2px; font-weight: 800; margin: 0;">${col.title}</h2>
                            <span class="glass-pill" style="padding: 2px 8px; font-size: 0.7rem; color: var(--text-dim);">${col.tasks.length}</span>
                        </div>
                        
                        ${col.tasks.map(task => `
                            <div class="kanban-card">
                                <p style="margin: 0; font-size: 0.85rem; font-weight: 500;">${task}</p>
                            </div>
                        `).join('')}

                        <div class="kanban-add-btn">
                            <span class="material-symbols-rounded">add</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
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
