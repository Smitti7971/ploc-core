require('dotenv').config({ path: '../../.env' });
const aiOrchestrator = require('./ai/orchestrator/AIOrchestrator');

async function test() {
    console.log("🎙️ Enviando mensagem de teste para o Ploc...");
    const response = await aiOrchestrator.process('user_123', 'Fala, Ploc! Como está sendo essa fase de criação? Tudo funcionando por aí?');
    
    console.log("\n🤖 --- RESPOSTA DO PLOC ---");
    console.log(response.message || response);
    console.log("--------------------------\n");
}

test();
