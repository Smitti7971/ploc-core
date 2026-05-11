/**
 * PLOC - Dashboard Logic
 * Gerenciamento do DOM, interação com Kanban e persistência de tarefas.
 */

import { apiClient } from './api/client.js';
import { ui } from './ui.js';

// Estado Global do Dashboard
const state = {
    token: localStorage.getItem('token'),
    kanbanBoard: document.getElementById('kanbanBoard'),
    modal: document.getElementById('modalOverlay'),
    lastDate: new Date(),
    firstDate: new Date(),
    editingTaskId: null,
    targetColumnDate: null
};

// Segurança: Redirecionar se não houver token
if (!state.token) window.location.href = 'login.html';

const DAYS_BR = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MONTHS_BR = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// --- FUNÇÕES DE INICIALIZAÇÃO ---

async function loadTasks() {
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(dz => {
        if (dz.children.length === 0) {
            dz.innerHTML = `<div class="loading-container"><span class="loader"></span><span style="font-size: 0.8rem">Semeando...</span></div>`;
        }
    });

    try {
        const result = await apiClient.get('/tasks');
        
        dropZones.forEach(dz => {
            const loader = dz.querySelector('.loading-container');
            if (loader) loader.remove();
        });

        if (Array.isArray(result)) {
            result.forEach(task => {
                const taskDate = new Date(task.scheduledDate);
                taskDate.setHours(0,0,0,0);
                renderTaskCard({
                    id: task.id,
                    title: task.name,
                    desc: task.description,
                    category: task.category,
                    time: task.scheduledTime,
                    date: taskDate.toISOString()
                });
            });
        }
    } catch (err) { 
        console.error('Erro ao carregar tarefas:', err); 
    }
}

function createDayColumn(date) {
    const col = document.createElement('div');
    col.className = 'day-column';
    col.dataset.date = date.toISOString();
    
    const dayName = DAYS_BR[date.getDay()];
    const dayNum = date.getDate();
    const monthName = MONTHS_BR[date.getMonth()];

    col.innerHTML = `
        <div class="column-header">
            <h3>${dayName}</h3>
            <span>${dayNum} de ${monthName}</span>
        </div>
        <div class="drop-zone" style="min-height: 150px; flex: 1;"></div>
        <button class="add-task-btn" onclick="openModal('${date.toISOString()}')">+ Adicionar</button>
    `;
    
    const dz = col.querySelector('.drop-zone');
    dz.addEventListener('dragover', (e) => e.preventDefault());
    dz.addEventListener('drop', drop);

    return col;
}

// --- FUNÇÕES DO MODAL ---

window.openModal = (dateStr) => {
    state.editingTaskId = null;
    state.targetColumnDate = dateStr;
    document.getElementById('modalTitle').innerText = 'Nova Tarefa';
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskTime').value = '';
    document.getElementById('taskDesc').value = '';
    state.modal.style.display = 'flex';
};

window.closeModal = () => {
    state.modal.style.display = 'none';
};

window.saveTask = async () => {
    const title = document.getElementById('taskTitle').value;
    const time = document.getElementById('taskTime').value;
    const category = document.getElementById('taskCategory').value;
    const desc = document.getElementById('taskDesc').value;

    if (!title) return ui.showToast('Dê um nome para a tarefa!', 'error');

    ui.setLoading('.btn-save', true, 'Salvando...');

    const taskData = {
        name: title,
        scheduledTime: time,
        category: category,
        description: desc,
        scheduledDate: state.targetColumnDate
    };

    try {
        const endpoint = state.editingTaskId ? `/tasks/${state.editingTaskId}` : '/tasks';
        const result = state.editingTaskId 
            ? await apiClient.put(endpoint, taskData)
            : await apiClient.post(endpoint, taskData);

        renderTaskCard({
            id: result.id,
            title: result.name,
            time: result.scheduledTime,
            category: result.category,
            desc: result.description,
            date: state.targetColumnDate
        });
        
        ui.showToast(state.editingTaskId ? 'Tarefa atualizada!' : 'Tarefa criada com sucesso!');
        window.closeModal();
    } catch (err) { 
        ui.showToast(err.message, 'error');
    } finally {
        ui.setLoading('.btn-save', false);
    }
};

// --- RENDERIZAÇÃO E EVENTOS ---

function renderTaskCard(task) {
    const existing = document.getElementById(task.id);
    if (existing) existing.remove();

    const card = document.createElement('div');
    card.className = `task-card ${task.category}`;
    card.draggable = true;
    card.id = task.id;
    card.dataset.date = task.date;
    
    const now = new Date();
    const isToday = new Date(task.date).toDateString() === now.toDateString();
    let timeBadge = '';
    
    if (isToday && task.time) {
        const [h, m] = task.time.split(':').map(Number);
        const taskFullDate = new Date();
        taskFullDate.setHours(h, m, 0, 0);
        
        const diff = (taskFullDate - now) / (1000 * 60);
        if (diff > 0 && diff < 60) timeBadge = '<span class="badge-next">PRÓXIMO</span>';
        else if (Math.abs(diff) < 15) timeBadge = '<span class="badge-now">AGORA</span>';
    }

    card.innerHTML = `
        <div class="task-header">
            <span class="tag">${task.category.replace('cat-', '')}</span>
            <div style="display: flex; align-items: center; gap: 8px;">
                ${timeBadge}
                <span class="time">${task.time || ''}</span>
                <button class="delete-task-btn" title="Apagar" onclick="deleteTask(event, ${task.id})">✕</button>
            </div>
        </div>
        <p id="title-${task.id}"></p>
    `;

    card.querySelector(`#title-${task.id}`).textContent = task.title;

    card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData("text", e.target.id);
        e.target.classList.add('dragging');
    });

    card.addEventListener('dragend', (e) => e.target.classList.remove('dragging'));
    
    const columns = document.querySelectorAll('.day-column');
    columns.forEach(col => {
        if (col.dataset.date === task.date) {
            col.querySelector('.drop-zone').appendChild(card);
        }
    });
}

window.deleteTask = async (event, taskId) => {
    event.stopPropagation();
    if (!confirm('Tem certeza que deseja apagar esta tarefa?')) return;

    try {
        await apiClient.delete(`/tasks/${taskId}`);
        const el = document.getElementById(taskId);
        if (el) el.remove();
        ui.showToast('Tarefa eliminada!', 'success');
    } catch (err) {
        ui.showToast('Falha ao apagar: ' + err.message, 'error');
    }
};

async function drop(ev) {
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
        } catch (err) { 
            console.error('Erro ao mover tarefa:', err); 
        }
    }
}

// --- CONTROLE DE NAVEGAÇÃO DO BOARD ---

function initBoard() {
    state.lastDate.setHours(0,0,0,0);
    state.firstDate = new Date(state.lastDate);

    for (let i = 0; i < 7; i++) {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + i);
        newDate.setHours(0,0,0,0);
        state.kanbanBoard.appendChild(createDayColumn(newDate));
        if (i === 6) state.lastDate = newDate;
    }
    loadTasks();
}

state.kanbanBoard.addEventListener('scroll', () => {
    const scrollTotal = state.kanbanBoard.scrollWidth;
    const scrollPos = state.kanbanBoard.scrollLeft + state.kanbanBoard.clientWidth;
    
    if (scrollTotal - scrollPos < 1000) {
        for (let i = 0; i < 5; i++) {
            state.lastDate.setDate(state.lastDate.getDate() + 1);
            state.kanbanBoard.appendChild(createDayColumn(new Date(state.lastDate)));
        }
        loadTasks();
    }

    if (state.kanbanBoard.scrollLeft < 500) {
        const oldScrollWidth = state.kanbanBoard.scrollWidth;
        for (let i = 0; i < 5; i++) {
            state.firstDate.setDate(state.firstDate.getDate() - 1);
            const col = createDayColumn(new Date(state.firstDate));
            state.kanbanBoard.prepend(col);
        }
        const newScrollWidth = state.kanbanBoard.scrollWidth;
        state.kanbanBoard.scrollLeft += (newScrollWidth - oldScrollWidth);
        loadTasks();
    }
});

// SCROLL POR ARRASTE (DESKTOP)
let isDown = false;
let startX;
let scrollLeft;

state.kanbanBoard.addEventListener('mousedown', (e) => {
    if (e.target.closest('.task-card') || e.target.closest('button')) return;
    isDown = true;
    state.kanbanBoard.style.cursor = 'grabbing';
    startX = e.pageX - state.kanbanBoard.offsetLeft;
    scrollLeft = state.kanbanBoard.scrollLeft;
});

window.addEventListener('mouseup', () => {
    isDown = false;
    state.kanbanBoard.style.cursor = 'grab';
});

window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - state.kanbanBoard.offsetLeft;
    const walk = (x - startX) * 2; 
    state.kanbanBoard.scrollLeft = scrollLeft - walk;
});

window.logout = () => { 
    localStorage.clear(); 
    window.location.href = 'login.html'; 
};

// --- MODO CAOS (TESTE DE ESTRESSE) ---

window.generateChaos = async function(count = 50) {
    ui.showToast(`🚀 Gerando ${count} tarefas de teste...`);
    const categories = ['cat-plant', 'cat-work', 'cat-health', 'cat-finance'];
    const titles = ['Fazer café', 'Dominar o mundo', 'Pagar contas', 'Plantar bananeira', 'Reunião Ploc', 'Debugar código'];
    
    for (let i = 0; i < count; i++) {
        const randomDay = Math.floor(Math.random() * 7);
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + randomDay);
        targetDate.setHours(0,0,0,0);

        const taskData = {
            name: titles[Math.floor(Math.random() * titles.length)] + ' #' + (i + 1),
            scheduledTime: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            category: categories[Math.floor(Math.random() * categories.length)],
            description: 'Gerado automaticamente pelo teste de estresse.',
            scheduledDate: targetDate.toISOString()
        };

        try {
            const t = await apiClient.post('/tasks', taskData);
            renderTaskCard({
                id: t.id,
                title: t.name,
                time: t.scheduledTime,
                category: t.category,
                desc: t.description,
                date: targetDate.toISOString()
            });
        } catch (err) {
            console.error('Erro no caos:', err);
        }
    }
};

// Iniciar Aplicação
initBoard();
