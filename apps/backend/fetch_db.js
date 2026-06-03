const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const items = await prisma.trackerItem.findMany({
    where: { type: 'vice' }
  });
  console.log(items);
}
main().catch(console.error).finally(() => prisma.$disconnect());
