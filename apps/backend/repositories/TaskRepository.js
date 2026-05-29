const prisma = require('../config/database');

/**
 * TaskRepository
 * Tarefas legadas foram deletadas e migradas para TrackerItem.
 */
class TaskRepository {
    async findAllByUserId(userId) {
        throw new Error("Tarefas foram migradas para TrackerItem. Atualize o Frontend para usar /api/tracker");
    }

    async findById(id) {
        throw new Error("Tarefas foram migradas para TrackerItem. Atualize o Frontend para usar /api/tracker");
    }

    async create(data) {
        throw new Error("Tarefas foram migradas para TrackerItem. Atualize o Frontend para usar /api/tracker");
    }

    async update(id, data) {
        throw new Error("Tarefas foram migradas para TrackerItem. Atualize o Frontend para usar /api/tracker");
    }

    async delete(id) {
        throw new Error("Tarefas foram migradas para TrackerItem. Atualize o Frontend para usar /api/tracker");
    }
}

module.exports = new TaskRepository();
