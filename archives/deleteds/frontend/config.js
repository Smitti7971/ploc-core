/**
 * Configuração Global do Frontend Ploc
 */
const CONFIG = {
    // URL base da API (Mude aqui para afetar todo o projeto)
    API_URL: 'https://backend.midializando.cloud/api',
    
    // Versão do Sistema
    VERSION: '1.0.8',
    
    // Configurações de UI
    DEFAULT_CATEGORY: 'cat-plant',
};

// Congelar para evitar alterações acidentais
Object.freeze(CONFIG);
export default CONFIG;
