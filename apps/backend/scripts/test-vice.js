const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No user found.');
      return;
    }
    console.log('User found:', user.id);
    
    // Tentativa de upsert de Vice
    const vice = await prisma.vice.upsert({
      where: { userId_viceId: { userId: user.id, viceId: 'test_vice' } },
      update: {
        mode: 'acompanhe',
        isConsuming: false,
        defaultConsumptionSeconds: 300,
      },
      create: {
        userId: user.id,
        viceId: 'test_vice',
        mode: 'acompanhe',
        startTime: BigInt(Date.now()),
        isConsuming: false,
        defaultConsumptionSeconds: 300,
      }
    });
    console.log('Vice created:', vice);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
