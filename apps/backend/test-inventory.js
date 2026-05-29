const prisma = require('./config/database');

async function test() {
  const user = await prisma.user.findFirst();
  if (!user) return console.log('No user');

  const userId = user.id;
  const stats = await prisma.userStats.findUnique({
    where: { userId }
  });

  let currentPlocState = stats?.plocState || {};
  if (typeof currentPlocState === 'string') {
    try { currentPlocState = JSON.parse(currentPlocState); } catch(e) {}
  }
  
  const currentInventory = Array.isArray(currentPlocState.inventory) ? currentPlocState.inventory : [];
  
  const newItem = {
    id: "test-item-" + Date.now(),
    type: "food",
    name: "Teste",
    state: "fresh",
    createdAt: Date.now()
  };

  const newInventory = [...currentInventory, newItem];
  const newPlocState = { ...currentPlocState, inventory: newInventory };

  console.log('UPDATING WITH:', JSON.stringify(newPlocState));

  await prisma.userStats.upsert({
    where: { userId },
    update: {
      plocState: newPlocState,
      lastPlocSync: new Date()
    },
    create: {
      userId,
      plocState: newPlocState,
      lastPlocSync: new Date()
    }
  });

  const check = await prisma.userStats.findUnique({ where: { userId } });
  console.log('SAVED DB RESULT:', check.plocState);
  process.exit(0);
}

test();
