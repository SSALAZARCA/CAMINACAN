import { BASE_URL } from '../api/config';

export const getImageUrl = (path: string | undefined | null) => {
    if (!path) return 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?fit=crop&w=200&h=200'; // Default dog
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    // Clean path just in case
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${BASE_URL}/${cleanPath}`;
};
