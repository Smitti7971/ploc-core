// ⚙️ Configurações Globais do PLOC
// Detecção automática de ambiente (Local vs Produção)
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const CONFIG = {
    API_BASE_URL: isLocal ? 'http://localhost:3000/api' : 'https://backend.midializando.cloud/api',
    VERSION: 'v0.0.3'
};
