console.log('🔍 PLOC CONFIG DEBUG:', { hostname: window.location.hostname, protocol: window.location.protocol });

export const CONFIG = {
    API_BASE_URL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.search.includes('dev=true'))
        ? 'http://localhost:3000/api'
        : 'https://backend.midializando.cloud/api',
    VERSION: 'v0.0.7-diagnostic'
};

console.log('🚀 API_BASE_URL set to:', CONFIG.API_BASE_URL);
