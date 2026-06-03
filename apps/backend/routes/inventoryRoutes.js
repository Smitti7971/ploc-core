const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Listar todos os itens globais
router.get('/items', inventoryController.getAllItems);

// Criar um novo item
router.post('/items', inventoryController.createItem);

// Atualizar (toggle) um item
router.put('/items/:id', inventoryController.updateItem);

// Deletar um item
router.delete('/items/:id', inventoryController.deleteItem);

module.exports = router;
