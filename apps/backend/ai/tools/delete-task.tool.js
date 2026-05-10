const taskService = require('../../services/TaskService');

/**
 * DeleteTaskTool
 * Remove uma tarefa.
 */
class DeleteTaskTool {
    constructor() {
        this.name = 'delete_task';
        this.description = 'Remove permanentemente uma tarefa do usuário.';
        this.schema = {
            type: 'object',
            properties: {
                id: { type: 'number', description: 'ID da tarefa a ser removida' }
            },
            required: ['id']
        };
    }

    async execute(userId, data) {
        return await taskService.removeTask(userId, data.id);
    }
}

module.exports = new DeleteTaskTool();
