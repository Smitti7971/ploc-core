const plantRepository = require('../repositories/PlantRepository');

/**
 * PlantService
 * Lógica de negócio para o sistema botânico.
 */
class PlantService {
    async getAllPlants(userId) {
        return plantRepository.findAllByUserId(userId);
    }

    async getPlantById(userId, plantId) {
        const plant = await plantRepository.findById(plantId);
        if (!plant || plant.userId !== userId) {
            throw new Error('Planta não encontrada ou acesso negado');
        }
        return plant;
    }

    async createPlant(userId, plantData) {
        const { name, species, germinatedAt } = plantData;

        if (!name?.trim()) {
            throw new Error('O nome da planta é obrigatório');
        }

        return plantRepository.create({
            name: name.trim(),
            species: species?.trim(),
            germinatedAt: germinatedAt ? new Date(germinatedAt) : null,
            userId
        });
    }

    async updatePlant(userId, plantId, updateData) {
        await this.getPlantById(userId, plantId); // Valida posse
        
        const { name, species, germinatedAt, harvestedAt } = updateData;

        return plantRepository.update(plantId, {
            name: name?.trim(),
            species: species?.trim(),
            germinatedAt: germinatedAt ? new Date(germinatedAt) : undefined,
            harvestedAt: harvestedAt ? new Date(harvestedAt) : undefined
        });
    }

    async deletePlant(userId, plantId) {
        await this.getPlantById(userId, plantId); // Valida posse
        return plantRepository.delete(plantId);
    }

    // --- Lógica de Ciclo de Vida (Fases) ---

    async startNewPhase(userId, plantId, phaseData) {
        await this.getPlantById(userId, plantId); // Valida posse
        
        const { phaseName, startedAt } = phaseData;

        // Finalizar fase anterior se existir
        const plant = await plantRepository.findById(plantId);
        const lastPhase = plant.phases[0];
        if (lastPhase && !lastPhase.endedAt) {
            await plantRepository.updatePhase(lastPhase.id, {
                endedAt: startedAt ? new Date(startedAt) : new Date()
            });
        }

        return plantRepository.addPhase({
            plantId,
            phaseName,
            startedAt: startedAt ? new Date(startedAt) : new Date()
        });
    }

    // --- Lógica de Diário (Logs) ---

    async addPlantLog(userId, plantId, logData) {
        await this.getPlantById(userId, plantId); // Valida posse
        
        const { title, mood, notes, tags, loggedAt } = logData;

        if (!title?.trim()) {
            throw new Error('O título do registro é obrigatório');
        }

        return plantRepository.addLog({
            plantId,
            title: title.trim(),
            mood: mood || 'healthy',
            notes,
            tags, // Espera JSON ou Array
            loggedAt: loggedAt ? new Date(loggedAt) : new Date()
        });
    }

    // --- Lógica de Agenda (Eventos) ---

    async addPlantEvent(userId, plantId, eventData) {
        await this.getPlantById(userId, plantId); // Valida posse
        
        const { type, title, description, startsAt, endsAt, metadata } = eventData;

        if (!title?.trim()) {
            throw new Error('O título do evento é obrigatório');
        }

        return plantRepository.addEvent({
            plantId,
            type: type || 'other',
            title: title.trim(),
            description,
            startsAt: startsAt ? new Date(startsAt) : new Date(),
            endsAt: endsAt ? new Date(endsAt) : null,
            status: 'pending',
            metadata
        });
    }

    async getPlantEvents(userId, plantId) {
        const plant = await this.getPlantById(userId, plantId);
        return plant.events;
    }
}

module.exports = new PlantService();
