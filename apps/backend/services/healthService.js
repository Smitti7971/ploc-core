const prisma = require('../config/database');

/**
 * Ajudante de Saúde (Service)
 * Ele vai até a biblioteca (Banco) e checa se consegue ler algo.
 */
const checkSystemHealth = async () => {
  try {
    // Tenta contar quantos usuários existem apenas para ver se o banco responde
    const userCount = await prisma.user.count();
    return {
      status: 'Healthy',
      message: 'O Restaurante Ploc está operando perfeitamente!',
      database: 'Conectado',
      stats: { users: userCount }
    };
  } catch (error) {
    throw new Error('Erro ao falar com o banco de dados: ' + error.message);
  }
};

module.exports = { checkSystemHealth };
