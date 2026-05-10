const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Caminhos: /api/auth/register e /api/auth/login
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
