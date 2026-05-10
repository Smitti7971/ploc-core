/**
 * BaseProvider
 * Classe abstrata para provedores de modelos de linguagem.
 */
class BaseProvider {
    constructor(config) {
        this.config = config;
    }

    async generateResponse(prompt, context) {
        throw new Error('Método generateResponse deve ser implementado pelo provedor');
    }

    async parseTools(response) {
        throw new Error('Método parseTools deve ser implementado pelo provedor');
    }
}

module.exports = BaseProvider;
