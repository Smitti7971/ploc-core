const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userId = 'c3dd1b0e-7465-4739-86de-db474c853d8e';
  // 1. Get a tracker item
  let item = await prisma.trackerItem.findFirst({
    where: { userId, type: 'vice' }
  });
  
  if (!item) {
    console.log("No vice item found.");
    return;
  }
  
  console.log("Old startDate:", item.startDate, "getTime:", item.startDate.getTime());
  
  const now = Date.now();
  console.log("Setting new startDate to:", now, new Date(now));
  
  // Simulate syncItemToBackend
  const parsedStartDate = new Date(now);
  await prisma.trackerItem.update({
    where: { id: item.id },
    data: { startDate: parsedStartDate }
  });
  
  let updated = await prisma.trackerItem.findUnique({ where: { id: item.id } });
  console.log("After syncItemToBackend:", updated.startDate, "getTime:", updated.startDate.getTime());
  
  // Simulate createTrackerLog atomic update
  await prisma.trackerItem.update({
    where: { id: item.id },
    data: { startDate: new Date(now) }
  });
  
  let final = await prisma.trackerItem.findUnique({ where: { id: item.id } });
  console.log("After createTrackerLog:", final.startDate, "getTime:", final.startDate.getTime());
}

main().catch(console.error).finally(() => prisma.$disconnect());
