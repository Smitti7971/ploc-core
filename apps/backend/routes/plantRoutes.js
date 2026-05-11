const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas as rotas de plantas exigem autenticação
router.use(authMiddleware);

// CRUD de Plantas
router.get('/', plantController.getAllPlants);
router.get('/:id', plantController.getPlantById);
router.post('/', plantController.createPlant);
router.put('/:id', plantController.updatePlant);
router.delete('/:id', plantController.deletePlant);

// Ciclo de Vida, Diário e Agenda
router.post('/:id/phases', plantController.startPhase);
router.post('/:id/logs', plantController.addLog);
router.post('/:id/events', plantController.addEvent);
router.get('/:id/events', plantController.getEvents);

module.exports = router;
