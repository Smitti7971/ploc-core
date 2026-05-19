const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

async function generate() {
  const sourcePath = path.resolve(__dirname, '../apps/web/public/images/ploc_favicon_source_dark.png');
  const webAppDir = path.resolve(__dirname, '../apps/web');
  const publicDir = path.resolve(webAppDir, 'public');
  const appDir = path.resolve(webAppDir, 'app');

  console.log('Lendo imagem de origem:', sourcePath);
  
  if (!fs.existsSync(sourcePath)) {
    console.error('Imagem de origem não encontrada!');
    process.exit(1);
  }

  // 1. favicon.ico (32x32) na pasta app
  const img32 = await Jimp.read(sourcePath);
  img32.resize({ w: 32, h: 32 });
  const tempPath = path.join(appDir, 'temp_favicon.png');
  const faviconIcoPath = path.join(appDir, 'favicon.ico');
  
  // Escreve como PNG temporário
  await img32.write(tempPath);
  // Copia/Renomeia para favicon.ico
  fs.copyFileSync(tempPath, faviconIcoPath);
  fs.unlinkSync(tempPath);
  console.log('Gerado:', faviconIcoPath);

  // 2. favicon-96x96.png na pasta public
  const img96 = await Jimp.read(sourcePath);
  img96.resize({ w: 96, h: 96 });
  const fav96Path = path.join(publicDir, 'favicon-96x96.png');
  await img96.write(fav96Path);
  console.log('Gerado:', fav96Path);

  // 3. apple-touch-icon.png (180x180) na pasta public
  const img180 = await Jimp.read(sourcePath);
  img180.resize({ w: 180, h: 180 });
  const applePath = path.join(publicDir, 'apple-touch-icon.png');
  await img180.write(applePath);
  console.log('Gerado:', applePath);

  // 4. web-app-manifest-192x192.png na pasta public
  const img192 = await Jimp.read(sourcePath);
  img192.resize({ w: 192, h: 192 });
  const manifest192Path = path.join(publicDir, 'web-app-manifest-192x192.png');
  await img192.write(manifest192Path);
  console.log('Gerado:', manifest192Path);

  // 5. web-app-manifest-512x512.png na pasta public
  const img512 = await Jimp.read(sourcePath);
  img512.resize({ w: 512, h: 512 });
  const manifest512Path = path.join(publicDir, 'web-app-manifest-512x512.png');
  await img512.write(manifest512Path);
  console.log('Gerado:', manifest512Path);

  console.log('Todos os favicons gerados com sucesso!');
}

generate().catch(err => {
  console.error('Erro ao gerar favicons:', err);
});
