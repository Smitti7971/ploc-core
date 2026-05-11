const taskRepository = require('../repositories/TaskRepository');

/**
 * TaskService
 * Contém a lógica de negócio e orquestração do módulo de tarefas.
 */
class TaskService {
    async getUserTasks(userId) {
        return taskRepository.findAllByUserId(userId);
    }

    async createNewTask(userId, taskData) {
        console.log(`[AUDITORIA] Criando tarefa para o Usuário ID: ${userId} (Tipo: ${typeof userId})`);
        
        const { name, description, category, scheduledDate, scheduledTime, priority, status, tags } = taskData;
        
        const cleanName = name?.trim();
        if (!cleanName) {
            throw new Error('O nome da tarefa é obrigatório');
        }

        const cleanCategory = category?.trim() || 'Geral';
        
        let parsedDate = undefined;
        if (scheduledDate && typeof scheduledDate === 'string') {
            if (scheduledDate.length === 10) {
                parsedDate = new Date(`${scheduledDate}T12:00:00`);
            } else {
                parsedDate = new Date(scheduledDate);
            }
        }

        return taskRepository.create({
            name: cleanName,
            description: description?.trim(),
            category: cleanCategory,
            priority,
            status,
            tags,
            scheduledDate: parsedDate,
            scheduledTime,
            userId: userId
        });
    }

    async updateExistingTask(userId, taskId, updateData) {
        const tid = parseInt(taskId);
        const task = await taskRepository.findById(tid);
        
        if (!task || task.userId !== userId) {
            throw new Error('Acesso negado ou tarefa não encontrada');
        }

        const { name, description, category, scheduledDate, scheduledTime, completed, priority, status, tags } = updateData;
        
        // Lógica de conclusão
        let completedAt = undefined;
        if (completed === true) completedAt = new Date();
        if (completed === false) completedAt = null;

        const data = {
            name,
            description,
            category,
            priority,
            status,
            tags,
            scheduledTime,
            completed,
            completedAt
        };

        if (scheduledDate !== undefined) {
            if (scheduledDate && typeof scheduledDate === 'string') {
                if (scheduledDate.length === 10) {
                    data.scheduledDate = new Date(`${scheduledDate}T12:00:00`);
                } else {
                    data.scheduledDate = new Date(scheduledDate);
                }
            } else {
                data.scheduledDate = undefined;
            }
        }

        return taskRepository.update(tid, data);
    }

    async removeTask(userId, taskId) {
        const tid = parseInt(taskId);
        const task = await taskRepository.findById(tid);
        
        if (!task || task.userId !== userId) {
            throw new Error('Acesso negado ou tarefa não encontrada');
        }

        return taskRepository.delete(tid);
    }
}

module.exports = new TaskService();
