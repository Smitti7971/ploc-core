const storageService = require('../services/StorageService');

/**
 * UploadController - Gerencia requisições de arquivos
 */
class UploadController {
    /**
     * Endpoint Genérico de Upload
     * Espera um campo 'file' no multipart/form-data
     * Opcional: query param 'type' (avatar | task)
     */
    async upload(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
            }

            const userId = req.user?.id || 'test-user';
            const type = req.query.type || 'general'; // Define o tipo de tratamento

            const fileUrl = await storageService.uploadImage(
                req.file.buffer, 
                userId, 
                type
            );

            res.json({
                message: 'Upload concluído com sucesso! 🚀',
                url: fileUrl,
                type: type
            });

        } catch (error) {
            console.error('❌ [UploadController] Erro:', error);
            res.status(500).json({ error: 'Erro ao processar upload de imagem.' });
        }
    }
}

module.exports = new UploadController();
