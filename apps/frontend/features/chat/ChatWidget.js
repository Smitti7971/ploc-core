import { apiClient } from '../../shared/api/client.js?v=0.0.9';

/**
 * ChatLogic
 * Gerencia a comunicação com a IA e integra com o PlocAvatar.
 */
export const initChatLogic = () => {
    // Ouve mensagens vindas do Avatar
    document.addEventListener('ploc-message', async (e) => {
        const userMessage = e.detail.text || e.detail; // Suporte a string antiga ou objeto
        const fillerText = e.detail.fillerText || null;
        const token = localStorage.getItem('ploc_token');

        if (!token) {
            window.plocControls.updateMode('active');
            window.plocControls.speak("Mestre, para eu te ajudar com inteligência total, você precisa entrar primeiro! 😉");
            return;
        }
        
        try {
            const isPissedOff = e.detail.isPissedOff || false;
            // Chama a API do PLOC (OpenAI)
            const data = await apiClient.post('/ai/chat', { message: userMessage, fillerText: fillerText, isPissedOff: isPissedOff });
            
            // Reage dependendo da resposta
            if (data.name) {
                // Se for uma ferramenta (ex: criar tarefa)
                document.dispatchEvent(new CustomEvent('ploc-task-created', { detail: data }));
                window.plocControls.updateMode('active');
                window.plocControls.speak(`Tarefa "${data.name}" criada com sucesso! Sou fera, né? 😉`);
            } else if (Array.isArray(data)) {
                window.plocControls.updateMode('active');
                window.plocControls.speak(`Encontrei ${data.length} tarefas. Estamos progredindo! 🚀`);
            } else {
                // Resposta de texto comum (skipFiller = true)
                window.plocControls.updateMode('active');
                window.plocControls.speak(data.message || "Entendido, mestre!", false, true);
            }
        } catch (error) {
            console.error('Erro no Chat:', error);
            window.plocControls.updateMode('sleeping');
            window.plocControls.speak("Ops, me engasguei aqui. Pode repetir? 😅");
        }
    });

    console.log('Cognitive Bridge (ChatLogic) Initialized');
};

// Mantemos compatibilidade caso algo ainda chame createChatWidget
export const createChatWidget = () => {
    initChatLogic();
    return document.createElement('div'); // Retorna um elemento vazio para não quebrar o layout antigo
};

export const toggleChat = () => {
    if (window.plocControls) {
        window.plocControls.showInput();
    }
};
