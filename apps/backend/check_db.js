const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
prisma.userFitnessProfile.findMany().then(profiles => {
  console.log('Profiles in DB:', JSON.stringify(profiles, null, 2));
  prisma.$disconnect();
}).catch(e => console.error(e));
