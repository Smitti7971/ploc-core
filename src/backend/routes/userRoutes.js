const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota para obter perfil do usuário logado
router.get('/me', userController.getMe);

// Rota para listar usuários (Adm/Debug)
router.get('/', userController.getAllUsers);

module.exports = router;
