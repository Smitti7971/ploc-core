const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Carrega o .env da raiz do projeto
const envPath = path.join(__dirname, '..', '..', '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL=["']?(.+?)["']?(\s|$)/);
const databaseUrl = dbUrlMatch ? dbUrlMatch[1].trim() : null;

if (!databaseUrl) {
    console.error('❌ DATABASE_URL não encontrada no arquivo .env');
    process.exit(1);
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: databaseUrl
        }
    }
});

async function main() {
    console.log('🚀 Iniciando Snapshot do Banco de Dados...');
    
    try {
        const users = await prisma.user.findMany({ include: { routines: true, tasks: true } });
        
        const snapshot = {
            timestamp: new Date().toISOString(),
            version: 'v0.0.3',
            data: {
                users
            }
        };

        // Salva na pasta docs na raiz do projeto
        const backupDir = path.join(__dirname, '..', '..', 'docs', 'backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const fileName = `snapshot_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        fs.writeFileSync(path.join(backupDir, fileName), JSON.stringify(snapshot, null, 2));

        console.log(`✅ Snapshot concluído com sucesso!`);
        console.log(`📂 Salvo em: docs/backups/${fileName}`);
        console.log(`📊 Total de Usuários capturados: ${users.length}`);

    } catch (error) {
        console.error('❌ Erro ao criar snapshot:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
