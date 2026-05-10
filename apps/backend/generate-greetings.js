const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config({ path: '../../.env' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const assets = [
    { name: 'acordou.mp3', text: 'Espero que seja pra arrumar sua vida!' },
    { name: 'sucesso.mp3', text: 'Tava sonhando com seu sucesso. Vamos?' },
    { name: 'roi.mp3', text: 'Dormir não dá ROI. O que manda?' },
    { name: 'me-chamou.mp3', text: 'Me chamou?' }
];

async function generateGreetings() {
    console.log('🎙️ Gerando saudações com "atitude" do Ploc...');
    
    for (const asset of assets) {
        const filePath = path.join(__dirname, 'public/audio/fillers', asset.name);
        
        try {
            const mp3 = await openai.audio.speech.create({
                model: "tts-1",
                voice: "echo", // Voz confiante e energética
                input: asset.text,
                speed: 1.0
            });

            const buffer = Buffer.from(await mp3.arrayBuffer());
            fs.writeFileSync(filePath, buffer);
            console.log(`✅ Gerado: ${asset.name} ("${asset.text}")`);
        } catch (error) {
            console.error(`❌ Erro ao gerar ${asset.name}:`, error.message);
        }
    }
    console.log('✨ Saudações prontas!');
}

generateGreetings();
