const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rotas de perfil do usuário logado
router.get('/me', userController.getMe);
router.put('/me', userController.updateMe);
router.delete('/me', userController.deleteMe);
router.put('/me/ploc', userController.updatePlocState);
router.post('/me/ploc/inventory', userController.addPlocInventoryItem);
router.delete('/me/ploc/inventory/:slug', userController.consumePlocInventoryItem);

// Rota para listar usuários (Adm/Debug)
router.get('/', userController.getAllUsers);

module.exports = router;
