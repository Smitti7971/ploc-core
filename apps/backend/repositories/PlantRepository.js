const prisma = require('../config/database');

/**
 * PlantRepository
 * Responsável pela persistência de dados das plantas.
 */
class PlantRepository {
    async findAllByUserId(userId) {
        return prisma.plant.findMany({
            where: { userId },
            include: {
                phases: { orderBy: { startedAt: 'desc' }, take: 1 },
                logs: { orderBy: { loggedAt: 'desc' }, take: 1 }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findById(id) {
        return prisma.plant.findUnique({
            where: { id },
            include: {
                phases: { orderBy: { startedAt: 'desc' } },
                logs: { orderBy: { loggedAt: 'desc' } },
                events: { orderBy: { startsAt: 'asc' } },
                media: true
            }
        });
    }

    async create(data) {
        return prisma.plant.create({
            data
        });
    }

    async update(id, data) {
        return prisma.plant.update({
            where: { id },
            data
        });
    }

    async delete(id) {
        return prisma.plant.delete({
            where: { id }
        });
    }

    // --- Relacionados ---

    async addLog(data) {
        return prisma.plantLog.create({
            data
        });
    }

    async addPhase(data) {
        return prisma.plantPhase.create({
            data
        });
    }

    async addEvent(data) {
        return prisma.plantEvent.create({
            data
        });
    }

    async updatePhase(id, data) {
        return prisma.plantPhase.update({
            where: { id },
            data
        });
    }
}

module.exports = new PlantRepository();
