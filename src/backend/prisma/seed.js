const prisma = require('../config/database');

async function main() {
  console.log('Iniciando seed...');

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

  console.log('Seed finalizado com sucesso! 5 usuários inseridos/atualizados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
