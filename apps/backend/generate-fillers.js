const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config({ path: '../../.env' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const assets = [
    { name: 'pensando.mp3', text: 'Deixa eu analisar isso aqui...' },
    { name: 'organizando.mp3', text: 'Faz sentido. Vamos organizar isso.' },
    { name: 'logica.mp3', text: 'Entendi a lógica. Veja bem...' },
    { name: 'processando.mp3', text: 'Processando seu pedido, Mestre...' },
    { name: 'calculando.mp3', text: 'Ok, estou calculando as variáveis...' }
];

async function generateAssets() {
    console.log('🎙️ Gerando banco de fillers NEUTROS do Ploc...');
    
    for (const asset of assets) {
        const filePath = path.join(__dirname, 'public/audio/fillers', asset.name);
        
        try {
            const mp3 = await openai.audio.speech.create({
                model: "tts-1",
                voice: "echo",
                input: asset.text
            });

            const buffer = Buffer.from(await mp3.arrayBuffer());
            fs.writeFileSync(filePath, buffer);
            console.log(`✅ Gerado: ${asset.name} ("${asset.text}")`);
        } catch (error) {
            console.error(`❌ Erro ao gerar ${asset.name}:`, error.message);
        }
    }
    console.log('✨ Tiques neutros prontos!');
}

generateAssets();
