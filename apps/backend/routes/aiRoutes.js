const express = require('express');
const router = express.Router();
const aiOrchestrator = require('../ai/orchestrator/AIOrchestrator');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const JWT_SECRET = authConfig.jwtSecret;

// Middleware de Autenticação Opcional para o Chat do Ploc
// Permite que o Ploc funcione como assistente de boas-vindas na landing page sem estar logado
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1] || req.query.token;

        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET, { algorithms: [authConfig.algorithm] });
            req.user = decoded;
        }
    } catch (error) {
        console.warn('⚠️ [optionalAuth] Token inválido ou expirado:', error.message);
    }
    next();
};

/**
 * @route POST /api/ai/chat
 * @desc Envia uma mensagem para o assistente de IA
 * @access Public / Private (Opcional)
 */
router.post('/chat', optionalAuth, async (req, res) => {
    try {
        const { message, fillerText, isPissedOff } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Mensagem é obrigatória' });
        }

        const userId = req.user?.id || 'guest';
        const response = await aiOrchestrator.process(userId, message, fillerText, isPissedOff);
        res.json(response);
    } catch (error) {
        console.error('❌ Erro na AI Layer:', error);
        res.status(500).json({ error: 'Erro interno ao processar inteligência' });
    }
});

const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const { Readable } = require('stream');

/**
 * Normaliza termos e siglas técnicas comuns de desenvolvimento para escritas fonéticas
 * em português brasileiro, forçando o sintetizador de voz (TTS-1) a manter o sotaque
 * correto em português e evitar a detecção automática incorreta de inglês ou espanhol.
 */
function normalizeTextForPortugueseTTS(text) {
    if (!text) return '';
    let normalized = text;

    const replacements = [
        { pattern: /\bnode\.js\b/gi, replacement: 'nôde jota-ésse' },
        { pattern: /\bnext\.js\b/gi, replacement: 'néx-te jota-ésse' },
        { pattern: /\bnode\b/gi, replacement: 'nôde' },
        { pattern: /\bnext\b/gi, replacement: 'néx-te' },
        { pattern: /\bsaas\b/gi, replacement: 'sás' },
        { pattern: /\bux\b/gi, replacement: 'u-xis' },
        { pattern: /\bui\b/gi, replacement: 'u-í' },
        { pattern: /\bapis\b/gi, replacement: 'apê-ís' },
        { pattern: /\bapi\b/gi, replacement: 'apê-í' },
        { pattern: /\btypescript\b/gi, replacement: 'taipi-scrípite' },
        { pattern: /\bjavascript\b/gi, replacement: 'java-scrípite' },
        { pattern: /\bcss\b/gi, replacement: 'cê-ésse-ésse' },
        { pattern: /\bhtml\b/gi, replacement: 'agá-tê-eme-éle' },
        { pattern: /\burls\b/gi, replacement: 'u-érre-éles' },
        { pattern: /\burl\b/gi, replacement: 'u-érre-éle' },
        { pattern: /\bsql\b/gi, replacement: 'ésse-quê-éle' },
        { pattern: /\bnosql\b/gi, replacement: 'nô-ésse-quê-éle' },
        { pattern: /\bvs\s+code\b/gi, replacement: 'vê-ésse códe' },
        { pattern: /\bjson\b/gi, replacement: 'jêi-som' },
        { pattern: /\bgit\b/gi, replacement: 'guíte' },
        { pattern: /\bgithub\b/gi, replacement: 'guíte-hãb' },
        { pattern: /\bvite\b/gi, replacement: 'váite' },
        { pattern: /\breact\b/gi, replacement: 'ri-éct' },
        { pattern: /\btailwind\b/gi, replacement: 'têiu-uind' },
        { pattern: /\bdevs\b/gi, replacement: 'dévis' },
        { pattern: /\bdev\b/gi, replacement: 'dév' },
        { pattern: /\bbugs\b/gi, replacement: 'bãgues' },
        { pattern: /\bbug\b/gi, replacement: 'bãgue' },
        { pattern: /\bbackend\b/gi, replacement: 'béqui-énde' },
        { pattern: /\bfrontend\b/gi, replacement: 'frón-ténde' },
        { pattern: /\bfullstack\b/gi, replacement: 'fúl-stéque' },
        { pattern: /\bframeworks\b/gi, replacement: 'freim-uérques' },
        { pattern: /\bframework\b/gi, replacement: 'freim-uérque' },
        { pattern: /\blibraries\b/gi, replacement: 'bibliotecas' },
        { pattern: /\blibrary\b/gi, replacement: 'biblioteca' },
        { pattern: /\bdatabases\b/gi, replacement: 'bancos de dados' },
        { pattern: /\bdatabase\b/gi, replacement: 'banco de dados' },
        { pattern: /\binputs\b/gi, replacement: 'ín-puts' },
        { pattern: /\binput\b/gi, replacement: 'ín-put' },
        { pattern: /\boutputs\b/gi, replacement: 'áut-puts' },
        { pattern: /\boutput\b/gi, replacement: 'áut-put' },
        { pattern: /\btokens\b/gi, replacement: 'tóquens' },
        { pattern: /\btoken\b/gi, replacement: 'tóquem' },
        { pattern: /\bdeploys\b/gi, replacement: 'deplóis' },
        { pattern: /\bdeploy\b/gi, replacement: 'deplói' },
        { pattern: /\blayout\b/gi, replacement: 'lei-áute' }
    ];

    for (const r of replacements) {
        normalized = normalized.replace(r.pattern, r.replacement);
    }

    return normalized;
}

/**
 * @route GET /api/ai/tts
 * @desc Transforma texto em áudio ultra-realista via Streaming (OpenAI TTS)
 * @access Public (Para permitir mensagens de boas-vindas e erro)
 */
router.get('/tts', async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.status(400).json({ error: 'Texto é obrigatório' });

        const phoneticText = normalizeTextForPortugueseTTS(text);

        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "echo",
            input: phoneticText,
        });

        res.set('Content-Type', 'audio/mpeg');
        
        // Converte o ReadableStream Web em Node Stream para o Express
        const nodeStream = Readable.fromWeb(mp3.body);
        nodeStream.pipe(res);
    } catch (error) {
        console.error('❌ Erro no TTS:', error);
        res.status(500).json({ error: 'Erro ao gerar áudio' });
    }
});

module.exports = router;
