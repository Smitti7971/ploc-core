import { apiClient } from '../api/client.js';
import { ui } from '../ui.js';

export const DashboardView = {
    state: {
        lastDate: new Date(),
        firstDate: new Date(),
        editingTaskId: null,
        targetColumnDate: null
    },

    render: () => {
        return `
            <div class="dashboard-wrapper">
                <div class="modal-overlay" id="modalOverlay">
                    <div class="modal">
                        <h2 id="modalTitle">Nova Tarefa</h2>
                        <input type="text" id="taskTitle" placeholder="O que vamos fazer?">
                        <div style="display: flex; gap: 0.625rem;">
                            <input type="time" id="taskTime">
                            <select id="taskCategory">
                                <option value="cat-plant">🌱 Planta</option>
                                <option value="cat-work">💼 Trabalho</option>
                                <option value="cat-home">🏠 Casa</option>
                            </select>
                        </div>
                        <textarea id="taskDesc" placeholder="Detalhes (opcional)" rows="3"></textarea>
                        <div class="modal-buttons">
                            <button class="btn-cancel" id="btnCloseModal">Cancelar</button>
                            <button class="btn-save" id="btnSaveTask">Salvar Tarefa</button>
                        </div>
                    </div>
                </div>

                <div class="sidebar-trigger"></div>
                <aside class="sidebar">
                    <h2>PLOC</h2>
                    <nav>
                        <a href="#" class="nav-link active"><span>🗓️</span> Calendário</a>
                        <a href="#" class="nav-link"><span>💡</span> Ideias</a>
                        <a href="#" id="btnChaos" class="nav-link" style="color: #f59e0b; font-weight: 700;"><span>💣</span> Modo Caos</a>
                        <a href="#" class="nav-link"><span>⚙️</span> Ajustes</a>
                    </nav>
                    <div style="margin-top: auto;">
                        <a href="#" id="btnLogout" class="nav-link"><span>🚪</span> Sair</a>
                    </div>
                </aside>

                <main class="main-content">
                    <header>
                        <div>
                            <span>Seu sócio diz:</span>
                            <h1>Dia de florescer.</h1>
                        </div>
                        <div id="userGreeting">Sócio • Hoje</div>
                    </header>
                    <div class="kanban-board" id="kanbanBoard"></div>
                </main>
            </div>
        `;
    },

    init: async function() {
        const board = document.getElementById('kanbanBoard');
        if (!board) return;

        // Inicializar Datas
        this.state.lastDate.setHours(0,0,0,0);
        this.state.firstDate = new Date(this.state.lastDate);

        // Montar Board Inicial
        for (let i = 0; i < 7; i++) {
            const newDate = new Date();
            newDate.setDate(newDate.getDate() + i);
            newDate.setHours(0,0,0,0);
            board.appendChild(this.createDayColumn(newDate));
            if (i === 6) this.state.lastDate = newDate;
        }

        // Eventos Globais
        document.getElementById('btnCloseModal').onclick = () => this.closeModal();
        document.getElementById('btnSaveTask').onclick = () => this.saveTask();
        document.getElementById('btnLogout').onclick = () => {
            localStorage.clear();
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'login' }));
        };
        
        const btnChaos = document.getElementById('btnChaos');
        if (btnChaos) btnChaos.onclick = () => this.generateChaos(30);

        // Infinite Scroll
        board.onscroll = () => this.handleScroll(board);

        // Carregar Tarefas
        await this.loadTasks();
    },

    createDayColumn: function(date) {
        const col = document.createElement('div');
        col.className = 'day-column';
        col.dataset.date = date.toISOString();
        
        const DAYS_BR = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const MONTHS_BR = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

        col.innerHTML = `
            <div class="column-header">
                <h3>${DAYS_BR[date.getDay()]}</h3>
                <span>${date.getDate()} de ${MONTHS_BR[date.getMonth()]}</span>
            </div>
            <div class="drop-zone" style="min-height: 150px; flex: 1;"></div>
            <button class="add-task-btn">+ Adicionar</button>
        `;
        
        col.querySelector('.add-task-btn').onclick = () => this.openModal(date.toISOString());
        
        const dz = col.querySelector('.drop-zone');
        dz.ondragover = (e) => e.preventDefault();
        dz.ondrop = (e) => this.handleDrop(e);

        return col;
    },

    openModal: function(dateStr) {
        this.state.editingTaskId = null;
        this.state.targetColumnDate = dateStr;
        document.getElementById('modalTitle').innerText = 'Nova Tarefa';
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDesc').value = '';
        document.getElementById('modalOverlay').style.display = 'flex';
    },

    closeModal: function() {
        document.getElementById('modalOverlay').style.display = 'none';
    },

    saveTask: async function() {
        const title = document.getElementById('taskTitle').value;
        const time = document.getElementById('taskTime').value;
        const category = document.getElementById('taskCategory').value;
        const desc = document.getElementById('taskDesc').value;

        if (!title) return ui.showToast('Dê um nome para a tarefa!', 'error');

        ui.setLoading('#btnSaveTask', true, 'Salvando...');

        try {
            const result = await apiClient.post('/tasks', {
                name: title,
                scheduledTime: time,
                category: category,
                description: desc,
                scheduledDate: this.state.targetColumnDate
            });

            this.renderTaskCard({
                id: result.id,
                title: result.name,
                time: result.scheduledTime,
                category: result.category,
                desc: result.description,
                date: this.state.targetColumnDate
            });
            
            ui.showToast('Tarefa criada com sucesso!');
            this.closeModal();
        } catch (err) { 
            ui.showToast(err.message, 'error');
        } finally {
            ui.setLoading('#btnSaveTask', false);
        }
    },

    renderTaskCard: function(task) {
        const card = document.createElement('div');
        card.className = `task-card ${task.category}`;
        card.draggable = true;
        card.id = task.id;
        card.dataset.date = task.date;
        
        card.innerHTML = `
            <div class="task-header">
                <span class="tag">${task.category.replace('cat-', '')}</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="time">${task.time || ''}</span>
                    <button class="delete-task-btn">✕</button>
                </div>
            </div>
            <p class="task-title-text"></p>
        `;

        card.querySelector('.task-title-text').textContent = task.title;
        card.querySelector('.delete-task-btn').onclick = (e) => this.deleteTask(e, task.id);

        card.ondragstart = (e) => {
            e.dataTransfer.setData("text", e.target.id);
            e.target.classList.add('dragging');
        };

        card.ondragend = (e) => e.target.classList.remove('dragging');
        
        const columns = document.querySelectorAll('.day-column');
        columns.forEach(col => {
            if (col.dataset.date === task.date) {
                col.querySelector('.drop-zone').appendChild(card);
            }
        });
    },

    loadTasks: async function() {
        try {
            const result = await apiClient.get('/tasks');
            if (Array.isArray(result)) {
                result.forEach(task => {
                    const taskDate = new Date(task.scheduledDate);
                    taskDate.setHours(0,0,0,0);
                    this.renderTaskCard({
                        id: task.id,
                        title: task.name,
                        desc: task.description,
                        category: task.category,
                        time: task.scheduledTime,
                        date: taskDate.toISOString()
                    });
                });
            }
        } catch (err) { console.error(err); }
    },

    handleDrop: async function(ev) {
        ev.preventDefault();
        const taskId = ev.dataTransfer.getData("text");
        const dropZone = ev.target.closest('.drop-zone');
        if (dropZone) {
            const card = document.getElementById(taskId);
            const col = dropZone.closest('.day-column');
            const newDate = col.dataset.date;
            
            try {
                await apiClient.put(`/tasks/${taskId}`, { scheduledDate: newDate });
                card.dataset.date = newDate;
                dropZone.appendChild(card);
            } catch (err) { ui.showToast('Erro ao mover tarefa', 'error'); }
        }
    },

    deleteTask: async function(e, id) {
        e.stopPropagation();
        if (!confirm('Apagar tarefa?')) return;
        try {
            await apiClient.delete(`/tasks/${id}`);
            document.getElementById(id).remove();
            ui.showToast('Tarefa eliminada!');
        } catch (err) { ui.showToast(err.message, 'error'); }
    },

    handleScroll: function(board) {
        const scrollTotal = board.scrollWidth;
        const scrollPos = board.scrollLeft + board.clientWidth;
        
        if (scrollTotal - scrollPos < 800) {
            for (let i = 0; i < 3; i++) {
                this.state.lastDate.setDate(this.state.lastDate.getDate() + 1);
                board.appendChild(this.createDayColumn(new Date(this.state.lastDate)));
            }
            this.loadTasks();
        }
    }
};
