const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const vices = await prisma.vice.findMany({
      include: { user: true, logs: true }
    });
    console.log("Vices found:", vices.length);
    console.log(JSON.stringify(vices.map(v => ({ email: v.user.email, viceId: v.viceId, logs: v.logs.length })), null, 2));
    
    const tasks = await prisma.task.findMany({ include: { user: true }});
    console.log("Tasks found:", tasks.length);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
