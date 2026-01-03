export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const getHeaders = () => {
    const user = localStorage.getItem('caminacan_user');
    const token = localStorage.getItem('caminacan_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};
