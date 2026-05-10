const taskService = require('../../services/TaskService');

/**
 * ListTasksTool
 * Lista todas as tarefas do usuário.
 */
class ListTasksTool {
    constructor() {
        this.name = 'list_tasks';
        this.description = 'Lista todas as tarefas atuais do usuário.';
        this.schema = {
            type: 'object',
            properties: {}
        };
    }

    async execute(userId) {
        return await taskService.getUserTasks(userId);
    }
}

module.exports = new ListTasksTool();
