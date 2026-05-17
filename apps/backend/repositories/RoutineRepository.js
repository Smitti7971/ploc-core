const prisma = require('../config/database');

/**
 * RoutineRepository
 * Responsável exclusivamente pela persistência de dados de Rotinas e Modelos.
 */
class RoutineRepository {
    // --- Rotinas do Usuário ---
    
    async findAllByUserId(userId) {
        return prisma.routine.findMany({
            where: { userId },
            include: { 
                tasks: true,
                rewards: true,
                _count: { select: { executions: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findById(id) {
        return prisma.routine.findUnique({
            where: { id },
            include: { 
                tasks: true,
                rewards: true,
                executions: {
                    take: 5,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
    }

    async create(data) {
        return prisma.routine.create({
            data
        });
    }

    async update(id, data) {
        return prisma.routine.update({
            where: { id },
            data
        });
    }

    async delete(id) {
        return prisma.routine.delete({
            where: { id }
        });
    }

    // --- Modelos Globais (Templates) ---

    async findAllTemplates() {
        return prisma.routineTemplate.findMany({
            where: { isPublic: true },
            orderBy: { name: 'asc' }
        });
    }

    async findTemplateById(id) {
        return prisma.routineTemplate.findUnique({
            where: { id }
        });
    }

    async createTemplate(data) {
        return prisma.routineTemplate.create({
            data
        });
    }
}

module.exports = new RoutineRepository();
