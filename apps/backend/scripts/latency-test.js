const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzbWl0dGkuakBnbWFpbC5jb20iLCJpYXQiOjE3NzgzODQ1OTEsImV4cCI6MTc3ODQ3MDk5MX0.YdY2gq4EWdBuCh9ZtnUeCBNHCaVvVppZcLQMTiagvmU';
const text = encodeURIComponent('Teste de latência do Ploc');
const url = `http://127.0.0.1:3000/api/ai/tts?text=${text}&token=${token}`;

console.log('🚀 Iniciando teste de latência (TTFB)...');
const start = Date.now();

http.get(url, (res) => {
    res.once('data', () => {
        const diff = Date.now() - start;
        console.log(`✅ Primeiro byte recebido em: ${diff}ms`);
        process.exit(0);
    });

    res.on('error', (err) => {
        console.error('❌ Erro no teste:', err.message);
        process.exit(1);
    });
}).on('error', (err) => {
    console.error('❌ Erro de conexão:', err.message);
    process.exit(1);
});
