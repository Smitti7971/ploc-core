const { S3Client, CreateBucketCommand, PutBucketPolicyCommand } = require('@aws-sdk/client-s3');

const client = new S3Client({
    endpoint: 'http://72.61.63.84:9000',
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'ploc_admin',
        secretAccessKey: 'ploc_secret_password_2026',
    },
    forcePathStyle: true,
});

async function setup() {
    const bucketName = 'ploc-assets';
    try {
        console.log(`🚀 Criando bucket: ${bucketName}...`);
        await client.send(new CreateBucketCommand({ Bucket: bucketName }));
        console.log('✅ Bucket criado!');

        console.log('🔒 Configurando política pública...');
        const policy = {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Principal: { AWS: ["*"] },
                    Action: ["s3:GetObject"],
                    Resource: [`arn:aws:s3:::${bucketName}/*`]
                }
            ]
        };

        await client.send(new PutBucketPolicyCommand({
            Bucket: bucketName,
            Policy: JSON.stringify(policy)
        }));
        console.log('✅ Política pública configurada!');
        console.log('🎉 MinIO pronto para o Ploc!');
    } catch (err) {
        if (err.name === 'BucketAlreadyOwnedByYou' || err.name === 'BucketAlreadyExists') {
            console.log('ℹ️ Bucket já existe, seguindo em frente...');
        } else {
            console.error('❌ Erro no setup:', err);
        }
    }
}

setup();
