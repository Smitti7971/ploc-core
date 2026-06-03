const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📦 Criando itens de imunidade no banco...');
  
  await prisma.inventoryItem.upsert({
    where: { slug: 'immunity_food' },
    update: {},
    create: {
      slug: 'immunity_food',
      name: 'Almoço',
      description: 'Mata a fome para 70% e dá imunidade por 3 horas.',
      type: 'CONSUMABLE',
      rarity: 'RARE',
      priceFoco: 80,
    }
  });

  await prisma.inventoryItem.upsert({
    where: { slug: 'immunity_water' },
    update: {},
    create: {
      slug: 'immunity_water',
      name: 'Garrafa de Água',
      description: 'Sacia a sede para 70% e dá imunidade por 2 horas.',
      type: 'CONSUMABLE',
      rarity: 'RARE',
      priceFoco: 60,
    }
  });

  console.log('✅ Itens criados com sucesso!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
