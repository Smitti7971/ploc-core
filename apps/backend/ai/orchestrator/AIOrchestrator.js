const OpenAIProvider = require('../providers/OpenAIProvider');
const assistantPrompt = require('../prompts/behaviors/assistant.prompt');
const listTasksTool = require('../tools/list-tasks.tool');
const createTaskTool = require('../tools/create-task.tool');
const updateTaskTool = require('../tools/update-task.tool');
const deleteTaskTool = require('../tools/delete-task.tool');

/**
 * AIOrchestrator
 * Gerencia a intenção do usuário e orquestra a execução de ferramentas via LLM.
 */
class AIOrchestrator {
    constructor() {
        this.provider = new OpenAIProvider();
        this.tools = {
            [listTasksTool.name]: listTasksTool,
            [createTaskTool.name]: createTaskTool,
            [updateTaskTool.name]: updateTaskTool,
            [deleteTaskTool.name]: deleteTaskTool
        };
    }

    /**
     * Processa a entrada do usuário e executa as ferramentas necessárias.
     */
    async process(userId, userInput, fillerText = null, isPissedOff = false) {
        console.log(`🤖 IA Processando (Real): "${userInput}" para o usuário ${userId}`);

        try {
            // Prepara o contexto para a IA (Prompt de Sistema + Ferramentas Disponíveis)
            const toolDescriptions = Object.values(this.tools)
                .map(t => `- ${t.name}: ${t.description}`)
                .join('\n');

            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            const dayOfWeek = now.toLocaleDateString('pt-BR', { weekday: 'long' });

            let fullSystemPrompt = `${assistantPrompt.content}\n\nDATA ATUAL: ${dateStr} (${dayOfWeek})\n\nFERRAMENTAS DISPONÍVEIS:\n${toolDescriptions}\n\nREGRA CRÍTICA: Se a solicitação do usuário puder ser atendida por uma ferramenta, responda EXCLUSIVAMENTE com o JSON da ferramenta no formato: {"tool": "nome_da_ferramenta", "data": {...}}. Não adicione saudações ou explicações. Se faltar informações opcionais (descrição, categoria), crie-as de forma criativa ou deixe-as em branco. Se não for caso de ferramenta, responda normalmente em texto.`;

            if (userId === 'guest') {
                fullSystemPrompt += `\n\n[CONTEXTO: VISITANTE NA LANDING PAGE]\nVocê está conversando com um visitante anônimo na Landing Page pública do Ploc.
Seu objetivo é se vender de forma implacável, charmosa e convencer o visitante a criar uma conta clicando em 'Começar Grátis'!
- Apresente seus 5 pilares operacionais (Corpo, Mente, Vida, Liberdade, Propósito) com paixão de código.
- Destaque o seu diferencial: você não é um robô de respostas estúpidas, você altera de verdade o banco de dados e ajuda no Kanban da vida real.
- Convença o usuário com atitude premium e alto nível.`;
            }

            if (fillerText) {
                fullSystemPrompt += `\n\nATENÇÃO (MODO LATÊNCIA ZERO): O usuário já ouviu você falar em áudio a seguinte frase: "${fillerText}".\nVocê DEVE começar o texto da sua resposta de forma a **continuar** ou **fazer sentido completo** a partir do momento em que a palavra "${fillerText}" termina, SEM REPETIR essa palavra. Crie uma ilusão de que foi uma frase só desde o início.`;
            }

            if (isPissedOff) {
                fullSystemPrompt += `\n\n[MODE OVERRIDE: RAIVA E IMPACIÊNCIA ATIVADA]\nO usuário acabou de te "cutucar" fisicamente na interface repetidas vezes, te tratando como um brinquedo e um Tamagotchi. Você está MUITO IRRITADO. Responda a requisição dele com extremo sarcasmo, grosseria e impaciência. Demonstre o seu desdém. Diga que ele atrapalhou seu processamento e mande ele parar de clicar.`;
            }

            const aiResponse = await this.provider.generateResponse(userInput, {
                systemPrompt: fullSystemPrompt,
                history: [] // Futuramente: carregar histórico de memória
            });

            // Tenta detectar se a IA quer usar uma ferramenta
            const intent = await this.provider.parseTools(aiResponse);

            if (intent && intent.tool && this.tools[intent.tool]) {
                if (userId === 'guest') {
                    return {
                        message: "Mestre, eu adoraria fazer isso por você, mas para criar ou gerenciar suas rotinas e tarefas você precisa estar conectado! 🫧 Clique em 'Começar Grátis' no topo da página para criar sua conta rapidinho!"
                    };
                }
                console.log(`🛠️ Executando ferramenta: ${intent.tool}`);
                return await this.tools[intent.tool].execute(userId, intent.data);
            }

            // Se não for ferramenta, retorna a resposta de texto da IA
            return { message: aiResponse };

        } catch (error) {
            console.error('Erro no Orquestrador:', error);
            return { message: "Ops, mestre! Tive um curto-circuito cerebral. Pode repetir? 😅" };
        }
    }
}

module.exports = new AIOrchestrator();
