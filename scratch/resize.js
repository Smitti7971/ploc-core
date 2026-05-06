const { Jimp } = require('jimp');
const path = require('path');

async function resize() {
  const inputPath = "C:\\Users\\smitt\\.gemini\\antigravity\\brain\\f86c8965-1d30-4e0b-9f99-18cc755f965e\\ploc_new_icon_1778104337822.png";
  
  try {
    const image = await Jimp.read(inputPath);
    
    // Gerar 512px
    console.log('Gerando 512px...');
    const img512 = image.clone().resize({ w: 512, h: 512 });
    await img512.write(path.join(__dirname, "../src/frontend/assets/icon-512.png"));
    
    // Gerar 192px
    console.log('Gerando 192px...');
    const img192 = image.clone().resize({ w: 192, h: 192 });
    await img192.write(path.join(__dirname, "../src/frontend/assets/icon-192.png"));
    
    console.log('Sucesso: Ícones de 512 e 192 gerados!');
  } catch (err) {
    console.error('Erro ao redimensionar:', err);
  }
}

resize();
