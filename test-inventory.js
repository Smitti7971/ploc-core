const prisma = require('./apps/backend/config/database');

async function check() {
  const users = await prisma.user.findMany({
    include: {
      inventory: {
        include: { inventoryItem: true }
      }
    }
  });

  for (const user of users) {
    console.log(`\nUser: ${user.email} (ID: ${user.id})`);
    console.log(`Inventory Items count: ${user.inventory.length}`);
    for (const inv of user.inventory) {
      console.log(`  - ${inv.inventoryItem.name}: quantity ${inv.quantity}`);
    }
  }
}
check().catch(console.error).finally(() => process.exit(0));
