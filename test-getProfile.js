const prisma = require('./apps/backend/config/database');
const userService = require('./apps/backend/services/UserService');

async function test() {
  const users = await prisma.user.findMany({ include: { inventory: true } });
  const userWithInv = users.find(u => u.inventory && u.inventory.length > 0);
  
  if (!userWithInv) {
    console.log("Nenhum usuário com inventário encontrado");
    return;
  }
  
  console.log("Buscando getProfile para o usuário", userWithInv.id);
  const profile = await userService.getProfile(userWithInv.id);
  console.log("Result plocState:", JSON.stringify(profile.stats.plocState, null, 2));
}
test().catch(console.error).finally(() => process.exit(0));
