const taskService = require('../../services/TaskService');

/**
 * CreateTaskTool
 * Cria uma nova tarefa para o usuário.
 */
class CreateTaskTool {
    constructor() {
        this.name = 'create_task';
        this.description = 'Cria uma nova tarefa com nome, descrição e categoria opcionais.';
        this.schema = {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Nome da tarefa' },
                description: { type: 'string', description: 'Descrição detalhada' },
                category: { type: 'string', description: 'Categoria da tarefa' },
                scheduledDate: { type: 'string', description: 'Data da tarefa (YYYY-MM-DD)' },
                scheduledTime: { type: 'string', description: 'Hora da tarefa (HH:mm)' }
            },
            required: ['name']
        };
    }

    async execute(userId, data) {
        return await taskService.createNewTask(userId, data);
    }
}

module.exports = new CreateTaskTool();
