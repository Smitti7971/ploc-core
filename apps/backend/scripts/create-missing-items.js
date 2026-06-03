const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📦 Criando itens que faltavam no banco...');
  
  await prisma.inventoryItem.upsert({
    where: { slug: 'hot_chocolate' },
    update: {},
    create: {
      slug: 'hot_chocolate',
      name: 'Chocolate Quente',
      description: 'Aquece e melhora a sede e um pouco o humor.',
      type: 'CONSUMABLE',
      rarity: 'UNCOMMON',
      priceFoco: 15,
    }
  });

  await prisma.inventoryItem.upsert({
    where: { slug: 'dices' },
    update: {},
    create: {
      slug: 'dices',
      name: 'Dados',
      description: 'Brinque com o Ploc para aumentar muito o humor e reduzir fadiga.',
      type: 'CONSUMABLE',
      rarity: 'COMMON',
      priceFoco: 30,
    }
  });

  await prisma.inventoryItem.upsert({
    where: { slug: 'toy' },
    update: {},
    create: {
      slug: 'toy',
      name: 'Brinquedo',
      description: 'Item especial de missão.',
      type: 'COLLECTIBLE',
      rarity: 'RARE',
      priceFoco: 20,
    }
  });

  // Também vou garantir que os slugs base existam para apple, water, medicine, caso o banco tenha resetado
  const basics = [
    { slug: 'apple', name: 'Maçã', type: 'CONSUMABLE', price: 10 },
    { slug: 'water', name: 'Água', type: 'CONSUMABLE', price: 5 },
    { slug: 'medicine', name: 'Remédio', type: 'CONSUMABLE', price: 50 },
    { slug: 'coffee', name: 'Café', type: 'CONSUMABLE', price: 15 }
  ];

  for (const b of basics) {
    await prisma.inventoryItem.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        slug: b.slug,
        name: b.name,
        description: 'Item básico.',
        type: b.type,
        rarity: 'COMMON',
        priceFoco: b.price,
      }
    });
  }

  console.log('✅ Itens criados com sucesso!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
