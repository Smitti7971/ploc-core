const prisma = require('./config/database');

async function test() {
  const users = await prisma.user.findMany({ include: { stats: true } });
  for (const user of users) {
    console.log(`User: ${user.email} - PlocState:`, user.stats?.plocState ? JSON.stringify(user.stats.plocState) : 'NULL');
  }
  process.exit(0);
}

test();
