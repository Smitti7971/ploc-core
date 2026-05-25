const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findFirst();
    const vices = await prisma.vice.findMany({
      where: { userId: user.id },
      include: { logs: true }
    });
    console.log(JSON.stringify(vices, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    , 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
