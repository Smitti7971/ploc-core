const plantService = require('../services/PlantService');

/**
 * plantController
 * Gerencia as requisições HTTP para o sistema botânico.
 */
exports.getAllPlants = async (req, res) => {
    try {
        const plants = await plantService.getAllPlants(req.user.id);
        res.json(plants);
    } catch (error) {
        console.error('❌ Erro ao listar plantas:', error.message);
        res.status(500).json({ error: 'Erro interno ao listar plantas' });
    }
};

exports.getPlantById = async (req, res) => {
    try {
        const plant = await plantService.getPlantById(req.user.id, req.params.id);
        res.json(plant);
    } catch (error) {
        console.error('❌ Erro ao buscar planta:', error.message);
        const status = error.message.includes('negado') ? 403 : 404;
        res.status(status).json({ error: error.message });
    }
};

exports.createPlant = async (req, res) => {
    try {
        const newPlant = await plantService.createPlant(req.user.id, req.body);
        res.status(201).json(newPlant);
    } catch (error) {
        console.error('❌ Erro ao criar planta:', error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.updatePlant = async (req, res) => {
    try {
        const updatedPlant = await plantService.updatePlant(req.user.id, req.params.id, req.body);
        res.json(updatedPlant);
    } catch (error) {
        console.error('❌ Erro ao atualizar planta:', error.message);
        const status = error.message.includes('negado') ? 403 : 400;
        res.status(status).json({ error: error.message });
    }
};

exports.deletePlant = async (req, res) => {
    try {
        await plantService.deletePlant(req.user.id, req.params.id);
        res.json({ message: 'Planta removida com sucesso' });
    } catch (error) {
        console.error('❌ Erro ao deletar planta:', error.message);
        const status = error.message.includes('negado') ? 403 : 500;
        res.status(status).json({ error: error.message });
    }
};

// --- Ciclo de Vida e Diário ---

exports.startPhase = async (req, res) => {
    try {
        const phase = await plantService.startNewPhase(req.user.id, req.params.id, req.body);
        res.status(201).json(phase);
    } catch (error) {
        console.error('❌ Erro ao iniciar fase:', error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.addLog = async (req, res) => {
    try {
        const log = await plantService.addPlantLog(req.user.id, req.params.id, req.body);
        res.status(201).json(log);
    } catch (error) {
        console.error('❌ Erro ao adicionar log:', error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.addEvent = async (req, res) => {
    try {
        const event = await plantService.addPlantEvent(req.user.id, req.params.id, req.body);
        res.status(201).json(event);
    } catch (error) {
        console.error('❌ Erro ao adicionar evento:', error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const events = await plantService.getPlantEvents(req.user.id, req.params.id);
        res.json(events);
    } catch (error) {
        console.error('❌ Erro ao buscar eventos:', error.message);
        const status = error.message.includes('negado') ? 403 : 404;
        res.status(status).json({ error: error.message });
    }
};
