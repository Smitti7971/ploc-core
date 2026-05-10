const routineService = require('../services/RoutineService');

exports.getRoutines = async (req, res) => {
    try {
        const routines = await routineService.getUserRoutines(req.user.id);
        res.json(routines);
    } catch (error) {
        console.error('❌ Erro ao buscar rotinas:', error);
        res.status(500).json({ error: 'Erro interno ao buscar rotinas' });
    }
};

exports.createRoutine = async (req, res) => {
    try {
        const newRoutine = await routineService.createRoutine(req.user.id, req.body);
        res.status(201).json(newRoutine);
    } catch (error) {
        console.error('❌ Erro ao criar rotina:', error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.getTemplates = async (req, res) => {
    try {
        const templates = await routineService.getTemplates();
        res.json(templates);
    } catch (error) {
        console.error('❌ Erro ao buscar templates de rotina:', error);
        res.status(500).json({ error: 'Erro interno ao buscar templates' });
    }
};

exports.adoptTemplate = async (req, res) => {
    try {
        const { templateId, config } = req.body;
        const routine = await routineService.adoptTemplate(req.user.id, templateId, config);
        res.status(201).json(routine);
    } catch (error) {
        console.error('❌ Erro ao adotar template:', error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.deleteRoutine = async (req, res) => {
    try {
        const { id } = req.params;
        await routineService.removeRoutine(req.user.id, id);
        res.json({ message: 'Rotina removida com sucesso' });
    } catch (error) {
        console.error('❌ Erro ao remover rotina:', error.message);
        const status = error.message.includes('negado') ? 403 : 400;
        res.status(status).json({ error: error.message });
    }
};
