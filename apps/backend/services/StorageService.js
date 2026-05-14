const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

/**
 * StorageService - Gestão de Armazenamento Híbrido (Local / MinIO)
 */

class StorageService {
    constructor() {
        this.storageType = process.env.STORAGE_TYPE || 's3'; // 's3' ou 'local'
        
        if (this.storageType === 's3') {
            this.s3Client = new S3Client({
                endpoint: process.env.STORAGE_ENDPOINT,
                region: process.env.STORAGE_REGION || 'us-east-1',
                credentials: {
                    accessKeyId: process.env.STORAGE_ACCESS_KEY,
                    secretAccessKey: process.env.STORAGE_SECRET_KEY,
                },
                forcePathStyle: true,
            });
        }
    }

    async uploadImage(fileBuffer, userId, type = 'general') {
        try {
            // 1. Processamento da Imagem com Sharp
            let pipeline = sharp(fileBuffer);
            if (type === 'avatar') {
                pipeline = pipeline.resize(400, 400, { fit: 'cover', position: 'center' });
            } else {
                pipeline = pipeline.resize(1200, 1200, { fit: 'inside', withoutEnlargement: true });
            }

            const processedBuffer = await pipeline.webp({ quality: 80 }).toBuffer();
            const fileName = `${type}s/${userId}/${Date.now()}.webp`;

            // 2. Lógica de Armazenamento
            if (this.storageType === 'local') {
                // --- MODO LOCAL (SALVAMENTO EM PASTA) ---
                const uploadDir = path.join(__dirname, '../public/uploads', type + 's', userId);
                await fs.mkdir(uploadDir, { recursive: true });
                const filePath = path.join(uploadDir, path.basename(fileName));
                await fs.writeFile(filePath, processedBuffer);
                
                const publicUrl = process.env.STORAGE_PUBLIC_URL || `http://localhost:${process.env.PORT || 3000}`;
                return `${publicUrl}/uploads/${fileName}`;

            } else {
                // --- MODO S3/MINIO (PADRÃO ONLINE) ---
                await this.s3Client.send(new PutObjectCommand({
                    Bucket: process.env.STORAGE_BUCKET,
                    Key: fileName,
                    Body: processedBuffer,
                    ContentType: 'image/webp',
                }));

                const publicBaseUrl = process.env.STORAGE_PUBLIC_URL || process.env.STORAGE_ENDPOINT;
                return `${publicBaseUrl}/${process.env.STORAGE_BUCKET}/${fileName}`;
            }

        } catch (error) {
            // LOGS DETALHADOS PARA MATAR O ERRO 500 ONLINE
            console.error('❌ [StorageService] Erro Crítico no Upload:');
            console.error('Mensagem:', error.message);
            console.error('Código:', error.code || error.$metadata?.httpStatusCode);
            console.error('Stack:', error.stack);
            
            throw new Error(`Erro no armazenamento (${this.storageType}): ${error.message}`);
        }
    }

    async deleteFile(fileKey) {
        // Implementar delete se necessário
    }
}

module.exports = new StorageService();
