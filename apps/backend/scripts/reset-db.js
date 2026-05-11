const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const prisma = new PrismaClient();

const BACKUP_DIR = path.join(__dirname, '../archives/backups');

/**
 * RESET-DB: PROTOCOLO DE SEGURANÇA 🛡️
 */
async function main() {
  console.log('\n\x1b[41m\x1b[37m  AVISO: PROTOCOLO DE RESET DO BANCO DE DADOS ATIVADO  \x1b[0m\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const confirm = () => new Promise(resolve => {
    rl.question('⚠️  Isso vai DESTRUIR todos os dados. Digite "DESTRUIR-TODOS-OS-DADOS" para confirmar: ', answer => {
      resolve(answer === 'DESTRUIR-TODOS-OS-DADOS');
    });
  });

  if (!await confirm()) {
    console.log('❌ Operação cancelada. Ufa! 😅');
    process.exit(0);
  }

  try {
    // 1. GERAR BACKUP DE EMERGÊNCIA
    console.log('📦 Gerando backup de emergência...');
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `backup-before-reset-${timestamp}.json`);

    const data = {
      users: await prisma.user.findMany(),
      routines: await prisma.routine.findMany(),
      tasks: await prisma.task.findMany()
    };

    fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
    console.log(`✅ Backup salvo em: ${backupFile}`);

    // 2. LIMPEZA TOTAL
    console.log('🧹 Limpando tabelas e resetando sequências...');
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Task", "Routine", "User" RESTART IDENTITY CASCADE;`);
    
    console.log('\n\x1b[32m✨ BANCO DE DADOS RESETADO COM SUCESSO! ✨\x1b[0m');
    console.log('📈 Próximo registro será o ID 1.\n');

  } catch (error) {
    console.error('❌ ERRO CRÍTICO NO RESET:', error.message);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

main();
