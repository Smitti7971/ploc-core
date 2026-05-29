const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ include: { stats: true } });
  console.log(JSON.stringify(users.map(u => ({ id: u.id, stats: u.stats?.plocState })), null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
