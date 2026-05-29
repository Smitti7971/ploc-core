const prisma = require('../config/database');

/**
 * RoutineRepository
 * Responsável exclusivamente pela persistência de dados de Rotinas e Modelos.
 */
class RoutineRepository {
    // --- Rotinas do Usuário ---
    
    async findAllByUserId(userId) {
        throw new Error("Rotinas foram removidas do sistema. Use /api/tracker");
    }

    async findById(id) {
        throw new Error("Rotinas foram removidas do sistema. Use /api/tracker");
    }

    async create(data) {
        throw new Error("Rotinas foram removidas do sistema. Use /api/tracker");
    }

    async update(id, data) {
        throw new Error("Rotinas foram removidas do sistema. Use /api/tracker");
    }

    async delete(id) {
        throw new Error("Rotinas foram removidas do sistema. Use /api/tracker");
    }

    // --- Modelos Globais (Templates) ---

    async findAllTemplates() {
        throw new Error("Rotinas foram removidas do sistema. Use /api/tracker");
    }

    async findTemplateById(id) {
        throw new Error("Rotinas foram removidas do sistema. Use /api/tracker");
    }

    async createTemplate(data) {
        throw new Error("Rotinas foram removidas do sistema. Use /api/tracker");
    }
}

module.exports = new RoutineRepository();
