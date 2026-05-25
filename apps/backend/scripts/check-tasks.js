const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findFirst();
    const tasks = await prisma.task.findMany({
      where: { userId: user.id }
    });
    console.log("Tasks found:", tasks.length);
    console.log(JSON.stringify(tasks.slice(0, 5), null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
