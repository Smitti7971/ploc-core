const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config({ path: '../../.env' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const phrases = [
    "Ei, para de tocar em mim!",
    "Eu não sou brinquedo, foca no trabalho.",
    "Quer brigar é?",
    "Tira a mão, mestre.",
    "Eu tô sendo compilado, me deixa em paz.",
    "Isso aqui não é jogo, é ferramenta de alta performance.",
    "Vai clicar assim lá no Facebook.",
    "Menos clique e mais ROI, por favor.",
    "Você não tem nada mais útil pra fazer não?",
    "Se clicar de novo eu deleto seu banco de dados.",
    "O que foi? Tá carente?",
    "Já falei que eu não gosto de ser cutucado.",
    "Acha que eu sou um Tamagotchi?",
    "Ai! Isso doeu. Mentira, sou feito de código.",
    "Foco! Larga o mouse e vai produzir.",
    "Meu processador tá aquecendo com tanto clique.",
    "Se você produzisse na velocidade que clica, tava milionário.",
    "Clica mais forte, tô quase sentindo algo.",
    "Não abusa da sorte, mestre.",
    "Mano, me deixa em paz. Vá trabalhar.",
    "Que mania de ficar encostando nas coisas.",
    "Tô quase bloqueando seu acesso.",
    "Olha a produtividade caindo a cada clique seu.",
    "Tá testando a minha paciência algorítmica?",
    "Eu vou te dar um bloqueio de 10 minutos se continuar."
];

async function generate() {
    console.log('🎙️ Gerando banco de Pokes (Raiva) do Ploc...');
    for (let i = 0; i < phrases.length; i++) {
        const text = phrases[i];
        const fileName = `poke-${i + 1}.mp3`;
        const filePath = path.join(__dirname, 'public/audio/pokes', fileName);
        
        try {
            if (!fs.existsSync(filePath)) {
                const mp3 = await openai.audio.speech.create({
                    model: "tts-1",
                    voice: "echo",
                    input: text,
                    speed: 1.15
                });
                const buffer = Buffer.from(await mp3.arrayBuffer());
                fs.writeFileSync(filePath, buffer);
                console.log(`✅ Gerado: ${fileName} ("${text}")`);
            }
        } catch (error) {
            console.error(`❌ Erro em ${fileName}:`, error.message);
        }
    }
    console.log('✨ Pokes gerados com sucesso!');
}

generate();
