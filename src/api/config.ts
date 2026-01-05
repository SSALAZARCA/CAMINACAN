let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
// Asegurar que la URL termine en /api y no tenga doble slash
apiUrl = apiUrl.replace(/\/$/, '');
if (!apiUrl.endsWith('/api')) {
    apiUrl += '/api';
}

export const API_URL = apiUrl;
export const BASE_URL = apiUrl.replace(/\/api$/, '');

export const getHeaders = () => {
    const user = localStorage.getItem('caminacan_user');
    const token = localStorage.getItem('caminacan_token');
    return {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};
