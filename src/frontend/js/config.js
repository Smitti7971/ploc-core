// ⚙️ Configurações Globais do PLOC (Modo Híbrido Dinâmico)
export const CONFIG = {
    // Detecta automaticamente se deve usar o backend local ou a produção
    get API_BASE_URL() {
        const isLocal = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' || 
                        window.location.protocol === 'file:';
        
        return isLocal 
            ? 'http://localhost:3000/api' 
            : 'https://backend.midializando.cloud/api';
    },
    VERSION: '1.2.0'
};
