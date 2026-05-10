const OpenAI = require('openai');
const BaseProvider = require('./BaseProvider');

/**
 * OpenAIProvider
 * Implementação do provedor de IA utilizando a API da OpenAI.
 */
class OpenAIProvider extends BaseProvider {
    constructor(config = {}) {
        super(config);
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.model = config.model || 'gpt-4o-mini';
    }

    /**
     * Gera uma resposta baseada no prompt e contexto.
     */
    async generateResponse(prompt, context = []) {
        try {
            const messages = [
                { role: 'system', content: context.systemPrompt || 'Você é o PLOC, um assistente de produtividade inteligente e amigável.' },
                ...context.history,
                { role: 'user', content: prompt }
            ];

            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: messages,
                temperature: 0.7,
                // Tentaremos forçar um formato que facilite a detecção de ferramentas se necessário
                // mas para o "primeiro sopro", manteremos flexível.
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Erro na OpenAIProvider (generateResponse):', error);
            throw new Error('Falha ao gerar resposta da IA');
        }
    }

    /**
     * Analisa a resposta em busca de intenções de ferramentas.
     * Futuramente usaremos Function Calling oficial da OpenAI.
     */
    async parseTools(responseContent) {
        try {
            // Busca por qualquer bloco que pareça JSON {...} na resposta
            const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return null;
        } catch (e) {
            console.error('Erro ao fazer parse de ferramenta:', e);
            return null;
        }
    }
}

module.exports = OpenAIProvider;
