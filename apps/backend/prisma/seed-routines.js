const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando Seed de Templates de Rotina...');

  const templates = [
    {
      name: 'Corpo de Elite (Iniciante)',
      category: 'TREINO',
      description: 'Treino de força básico para quem está começando. Foco em consistência.',
      config: {
        days: [1, 3, 5], // Seg, Qua, Sex
        time: '07:00',
        duration: 45,
        projectionWeeks: 4
      }
    },
    {
      name: 'Mente Imparável (Foco)',
      category: 'ESTUDO',
      description: 'Blocos de estudo profundo para aprendizado acelerado.',
      config: {
        days: [2, 4], // Ter, Qui
        time: '19:00',
        duration: 90,
        projectionWeeks: 4
      }
    },
    {
      name: 'Ritmo Vital (Caminhada)',
      category: 'SAÚDE',
      description: 'Caminhada matinal para ativar o metabolismo e a clareza mental.',
      config: {
        days: [0, 1, 2, 3, 4, 5, 6], // Todo dia
        time: '06:30',
        duration: 30,
        projectionWeeks: 4
      }
    }
  ];

  for (const t of templates) {
    await prisma.routineTemplate.create({
      data: t
    });
    console.log(`✅ Template criado: ${t.name}`);
  }

  console.log('✨ Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
