const prisma = require('../prismaClient');

// Listar todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Seed de teste (será protegido ou removido no futuro)
exports.seedUsers = async (req, res) => {
  try {
    const users = [
      { name: 'Smitti Admin', email: 'admin@ploc.com' },
      { name: 'Ana Silva', email: 'ana@gmail.com' },
      { name: 'Carlos Oliveira', email: 'carlos@outlook.com' },
      { name: 'Beatriz Santos', email: 'beatriz@tech.com' },
      { name: 'Ricardo Lima', email: 'ricardo@startup.io' },
    ];

    for (const user of users) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: user,
      });
    }

    res.json({ message: "Banco de dados populado com sucesso! 🚀" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
