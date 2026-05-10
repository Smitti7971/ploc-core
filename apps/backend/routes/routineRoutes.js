const express = require('express');
const routineController = require('../controllers/routineController');
const router = express.Router();

// Listar rotinas do usuário
router.get('/', routineController.getRoutines);

// Criar nova rotina (do zero)
router.post('/', routineController.createRoutine);

// Listar templates globais
router.get('/templates', routineController.getTemplates);

// Adotar um template de rotina
router.post('/adopt', routineController.adoptTemplate);

// Remover uma rotina
router.delete('/:id', routineController.deleteRoutine);

module.exports = router;
