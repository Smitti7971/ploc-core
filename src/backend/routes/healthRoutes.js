const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

/**
 * Rotas de Saúde (Routes)
 * Define o caminho "/health-check" e chama o Chef.
 */
router.get('/health-check', healthController.getHealthStatus);

module.exports = router;
