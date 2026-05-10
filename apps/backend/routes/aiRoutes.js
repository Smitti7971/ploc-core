const express = require('express');
const router = express.Router();
const aiOrchestrator = require('../ai/orchestrator/AIOrchestrator');

/**
 * @route POST /api/ai/chat
 * @desc Envia uma mensagem para o assistente de IA
 * @access Private
 */
router.post('/chat', async (req, res) => {
    try {
        const { message, fillerText, isPissedOff } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Mensagem é obrigatória' });
        }

        const response = await aiOrchestrator.process(req.user.id, message, fillerText, isPissedOff);
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
 * @route GET /api/ai/tts
 * @desc Transforma texto em áudio ultra-realista via Streaming (OpenAI TTS)
 * @access Private
 */
router.get('/tts', async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.status(400).json({ error: 'Texto é obrigatório' });

        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "echo",
            input: text,
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
