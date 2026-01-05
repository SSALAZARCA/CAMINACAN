import { API_URL } from "./config";

// Custom fetch wrapper to handle auth headers and 401s
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('caminacan_token');

    const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('caminacan_token');
        localStorage.removeItem('caminacan_user');

        // Redirect to login only if not already there to avoid loose loops, 
        // using window.location for hard redirect ensures clean state.
        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login?expired=true';
        }
        throw new Error('Session expired');
    }

    return response;
};
