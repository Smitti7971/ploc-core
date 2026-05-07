const { Jimp } = require('jimp');
const path = require('path');

async function checkDims() {
    const assets = [
        { name: 'screenshot-mobile.png', expected: '390x844' },
        { name: 'screenshot-desktop.png', expected: '1280x800' }
    ];

    for (const asset of assets) {
        try {
            const imgPath = path.join('c:/Users/smitt/OneDrive/Área de Trabalho/AntiGravity/ploc/ploc/src/frontend/assets', asset.name);
            const image = await Jimp.read(imgPath);
            console.log(`${asset.name}: ${image.width}x${image.height} (Esperado: ${asset.expected})`);
        } catch (e) {
            console.error(`Erro ao ler ${asset.name}: ${e.message}`);
        }
    }
}

checkDims();
