const prisma = require('../config/database');

/**
 * TaskRepository
 * Responsável exclusivamente pela persistência de dados no banco.
 */
class TaskRepository {
    async findAllByUserId(userId) {
        return prisma.task.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findById(id) {
        return prisma.task.findUnique({
            where: { id }
        });
    }

    async create(data) {
        return prisma.task.create({
            data
        });
    }

    async update(id, data) {
        return prisma.task.update({
            where: { id },
            data
        });
    }

    async delete(id) {
        return prisma.task.delete({
            where: { id }
        });
    }
}

module.exports = new TaskRepository();
