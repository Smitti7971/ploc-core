const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota para listar usuários
router.get('/', userController.getAllUsers);

// Rota de seed (TEMPORÁRIA)
router.get('/seed', userController.seedUsers);

module.exports = router;
