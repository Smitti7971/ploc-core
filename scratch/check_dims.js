const { Jimp } = require('jimp');
const path = require('path');

async function checkDimensions() {
  const mobilePath = path.join(__dirname, "../src/frontend/assets/screenshot-mobile.png");
  const desktopPath = path.join(__dirname, "../src/frontend/assets/screenshot-desktop.png");

  try {
    const mobile = await Jimp.read(mobilePath);
    console.log(`Mobile: ${mobile.width}x${mobile.height}`);
    
    const desktop = await Jimp.read(desktopPath);
    console.log(`Desktop: ${desktop.width}x${desktop.height}`);
  } catch (err) {
    console.error('Erro ao ler imagens:', err);
  }
}

checkDimensions();
