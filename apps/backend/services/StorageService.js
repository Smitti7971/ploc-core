const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');
const path = require('path');

/**
 * StorageService - Gestão de Armazenamento de Objetos (MinIO/S3)
 */

const s3Client = new S3Client({
    endpoint: process.env.STORAGE_ENDPOINT, // Ex: http://vps-ip:9000
    region: process.env.STORAGE_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY,
        secretAccessKey: process.env.STORAGE_SECRET_KEY,
    },
    forcePathStyle: true, // Obrigatório para MinIO
});

class StorageService {
    /**
     * Processa e faz o upload de uma imagem
     * @param {Buffer} fileBuffer Buffer da imagem original
     * @param {string} userId ID do usuário para organização de pastas
     * @param {string} type 'avatar' | 'task' | 'general'
     */
    async uploadImage(fileBuffer, userId, type = 'general') {
        try {
            let pipeline = sharp(fileBuffer);

            // --- LÓGICA DE TRATAMENTO PLOC ---
            if (type === 'avatar') {
                // Avatares: 400x400 fixo (Corte central)
                pipeline = pipeline.resize(400, 400, { fit: 'cover', position: 'center' });
            } else {
                // Fotos de Tarefas/Geral: 1200px max (Preserva proporção)
                pipeline = pipeline.resize(1200, 1200, { 
                    fit: 'inside', 
                    withoutEnlargement: true 
                });
            }

            // Conversão para WebP (Otimização Extrema)
            const processedBuffer = await pipeline
                .webp({ quality: 80 })
                .toBuffer();

            const fileName = `${type}s/${userId}/${Date.now()}.webp`;

            // Upload para o Bucket
            await s3Client.send(new PutObjectCommand({
                Bucket: process.env.STORAGE_BUCKET,
                Key: fileName,
                Body: processedBuffer,
                ContentType: 'image/webp',
                // ACL: 'public-read' // Opcional dependendo da config do MinIO
            }));

            // Retorna a URL pública (usando o endpoint ou um CDN se houver)
            const publicBaseUrl = process.env.STORAGE_PUBLIC_URL || process.env.STORAGE_ENDPOINT;
            return `${publicBaseUrl}/${process.env.STORAGE_BUCKET}/${fileName}`;

        } catch (error) {
            console.error('❌ [StorageService] Erro no upload:', error);
            throw new Error('Falha ao processar e armazenar imagem.');
        }
    }

    /**
     * Remove um objeto do storage
     * @param {string} fileKey Caminho completo do arquivo no bucket
     */
    async deleteFile(fileKey) {
        // Lógica de delete pode ser implementada aqui se necessário
    }
}

module.exports = new StorageService();
