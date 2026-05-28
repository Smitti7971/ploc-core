const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');

// Configuração do Multer (Memória)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite de 5MB
    },
    fileFilter: (req, file, cb) => {
        // Aceita apenas imagens
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
        }
    }
});

// Rota de Ping para Diagnóstico
router.get('/ping', (req, res) => res.json({ message: "Rota de Upload está VIVA! 🚀" }));

// Rota de Upload Único (Autenticação adicionada novamente)
router.post('/upload', authMiddleware, upload.single('file'), uploadController.upload);

module.exports = router;
