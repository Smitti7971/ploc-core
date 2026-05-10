export const CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : 'https://backend.midializando.cloud/api',
    VERSION: 'v0.0.5-cloud'
};
