const { Jimp } = require('jimp');
const path = require('path');

async function resizeScreenshots() {
  const srcMobile = path.join(__dirname, "../docs/deleteds/2026-05-06/screenshot-mobile-wrong-size.png");
  const srcDesktop = path.join(__dirname, "../docs/deleteds/2026-05-06/screenshot-desktop-wrong-size.png");
  
  const destMobile = path.join(__dirname, "../src/frontend/assets/screenshot-mobile.png");
  const destDesktop = path.join(__dirname, "../src/frontend/assets/screenshot-desktop.png");

  try {
    console.log('Redimensionando Mobile para 390x844...');
    const mobile = await Jimp.read(srcMobile);
    // Usando as chaves corretas: w e h
    mobile.resize({ w: 390, h: 844 });
    await mobile.write(destMobile);
    
    console.log('Redimensionando Desktop para 1280x800...');
    const desktop = await Jimp.read(srcDesktop);
    desktop.resize({ w: 1280, h: 800 });
    await desktop.write(destDesktop);
    
    console.log('✅ Redimensionamento concluído com sucesso!');
  } catch (err) {
    console.error('❌ Erro no processamento:', err);
  }
}

resizeScreenshots();
