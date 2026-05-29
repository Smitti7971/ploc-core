require('dotenv').config();
const prisma = require('../config/database');

async function migrateImages() {
  console.log('🔄 Iniciando migração de banco de imagens (URLs)...');
  
  const publicBaseUrl = process.env.STORAGE_PUBLIC_URL || process.env.STORAGE_ENDPOINT;
  const storageBucket = process.env.STORAGE_BUCKET || 'ploc-assets';
  
  if (!publicBaseUrl) {
    console.log('⚠️ STORAGE_PUBLIC_URL não encontrado. Configure no .env primeiro.');
    process.exit(1);
  }

  const targetUrl = `${publicBaseUrl}/${storageBucket}`;
  console.log(`📡 URL Alvo do MinIO: ${targetUrl}`);

  // 1. Migrar Users (profilePhoto)
  const users = await prisma.user.findMany({
    where: {
      profilePhoto: { contains: 'http://localhost:5000' }
    }
  });

  for (const user of users) {
    // Exemplo: http://localhost:5000/uploads/avatars/test-user/1778930661082.webp
    // Para: http://72.61.63.84:9000/ploc-assets/avatars/test-user/1778930661082.webp
    const newUrl = user.profilePhoto.replace('http://localhost:5000/uploads', targetUrl);
    await prisma.user.update({
      where: { id: user.id },
      data: { profilePhoto: newUrl }
    });
    console.log(`✅ [User] Atualizado foto de: ${user.email}`);
  }

  // 2. Migrar TrackerItems (coverPhoto)
  const trackers = await prisma.trackerItem.findMany({
    where: {
      coverPhoto: { contains: 'http://localhost:5000' }
    }
  });

  for (const item of trackers) {
    const newUrl = item.coverPhoto.replace('http://localhost:5000/uploads', targetUrl);
    await prisma.trackerItem.update({
      where: { id: item.id },
      data: { coverPhoto: newUrl }
    });
    console.log(`✅ [Tracker] Atualizado foto de item: ${item.name}`);
  }

  // 3. Migrar TrackerLogs (photoUrl)
  const logs = await prisma.trackerLog.findMany({
    where: {
      photoUrl: { contains: 'http://localhost:5000' }
    }
  });

  for (const log of logs) {
    const newUrl = log.photoUrl.replace('http://localhost:5000/uploads', targetUrl);
    await prisma.trackerLog.update({
      where: { id: log.id },
      data: { photoUrl: newUrl }
    });
    console.log(`✅ [TrackerLog] Atualizado log ID: ${log.id}`);
  }

  console.log('🎉 Migração de URLs concluída!');
  process.exit(0);
}

migrateImages().catch(e => {
  console.error(e);
  process.exit(1);
});
