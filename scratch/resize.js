const { Jimp } = require('jimp');
const path = require('path');

async function resize() {
  const inputPath = "C:\\Users\\smitt\\.gemini\\antigravity\\brain\\f86c8965-1d30-4e0b-9f99-18cc755f965e\\ploc_new_icon_1778104337822.png";
  const outputPath = path.join(__dirname, "../src/frontend/assets/icon-512.png");

  try {
    console.log('Lendo imagem...');
    const image = await Jimp.read(inputPath);
    console.log('Redimensionando...');
    image.resize({ w: 512, h: 512 });
    console.log('Salvando...');
    await image.write(outputPath);
    console.log('Sucesso: Ícone redimensionado para 512x512!');
  } catch (err) {
    console.error('Erro ao redimensionar:', err);
  }
}

resize();
