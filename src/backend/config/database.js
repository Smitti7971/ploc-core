const { PrismaClient } = require('@prisma/client');

/**
 * Gestor Central do Banco de Dados (Prisma Singleton)
 * 
 * Por que isso existe?
 * Para evitar que o servidor abra centenas de conexões desnecessárias.
 * Todos os "Ajudantes" (Services) devem usar este arquivo para falar com o banco.
 */

const prisma = new PrismaClient();

// Teste de conexão inicial
prisma.$connect()
  .then(() => console.log('✅ Banco de Dados: Conexão centralizada estabelecida com sucesso.'))
  .catch((err) => console.error('❌ Banco de Dados: Erro na conexão centralizada:', err));

module.exports = prisma;
