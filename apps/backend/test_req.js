const controller = require('./controllers/trackerController');

const req = {
  user: { id: 'c3dd1b0e-7465-4739-86de-db474c853d8e' },
  body: {
    id: 'f932f91a-c7bc-4927-a02e-d0a06af2b0a6', // replace with actual ID
    startDate: 1780190830194 // a number!
  }
};

const res = {
  status: (code) => {
    console.log("Status:", code);
    return {
      json: (data) => console.log("JSON:", data)
    };
  }
};

async function main() {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  const item = await prisma.trackerItem.findFirst({ where: { type: 'vice' }});
  req.body.id = item.id;
  req.body.type = item.type;
  req.body.name = item.name;
  req.body.status = item.status;
  
  await controller.createTrackerItem(req, res);
  
  const updated = await prisma.trackerItem.findUnique({ where: { id: item.id }});
  console.log("Updated DB startDate:", updated.startDate);
  
  prisma.$disconnect();
}

main().catch(console.error);
