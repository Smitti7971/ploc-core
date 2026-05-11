const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Verificando Tabelas do Sistema Botânico ---');
  try {
    const plants = await prisma.plant.findMany();
    console.log('✅ Tabela Plant acessível. Total:', plants.length);
    
    const phases = await prisma.plantPhase.findMany();
    console.log('✅ Tabela PlantPhase acessível. Total:', phases.length);
    
    const logs = await prisma.plantLog.findMany();
    console.log('✅ Tabela PlantLog acessível. Total:', logs.length);
    
    const media = await prisma.plantMedia.findMany();
    console.log('✅ Tabela PlantMedia acessível. Total:', media.length);
    
    const events = await prisma.plantEvent.findMany();
    console.log('✅ Tabela PlantEvent acessível. Total:', events.length);
  } catch (e) {
    console.error('❌ Erro ao validar tabelas:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
