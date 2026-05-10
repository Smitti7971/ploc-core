const taskService = require('../../services/TaskService');

/**
 * UpdateTaskTool
 * Atualiza uma tarefa existente.
 */
class UpdateTaskTool {
    constructor() {
        this.name = 'update_task';
        this.description = 'Atualiza o status, nome ou detalhes de uma tarefa existente.';
        this.schema = {
            type: 'object',
            properties: {
                id: { type: 'number', description: 'ID da tarefa' },
                name: { type: 'string' },
                completed: { type: 'boolean' }
            },
            required: ['id']
        };
    }

    async execute(userId, data) {
        return await taskService.updateExistingTask(userId, data.id, data);
    }
}

module.exports = new UpdateTaskTool();
