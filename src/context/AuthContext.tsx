import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../api/config';
import { apiFetch } from '../api/fetch';

// Define User type
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'walker' | 'admin';
    walkerProfile?: any;
    pets?: any[];
}

interface AuthContextType {
    user: User | null;
    login: (email: string, pass: string) => Promise<boolean>;
    register: (name: string, email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('caminacan_token');
            if (token) {
                try {
                    // Use apiFetch, stripping /api if API_URL included it or adjusting path
                    const res = await apiFetch('/auth/me');
                    if (res.ok) {
                        const data = await res.json();
                        setUser({
                            id: data.id,
                            name: data.name,
                            email: data.email,
                            role: data.role.toLowerCase() as User['role'],
                            walkerProfile: data.walkerProfile,
                            pets: data.pets
                        });
                    }
                } catch (error) {
                    console.error('Error validating session:', error);
                    // No need to call logout() here significantly as apiFetch handles 401 redirect
                }
            }
        };
        fetchUser();
    }, []);

    const login = async (email: string, pass: string): Promise<boolean> => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: pass })
            });

            if (!response.ok) return false;

            const data = await response.json();
            const userData: User = {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role.toLowerCase() as User['role'],
                walkerProfile: data.user.walkerProfile,
                pets: data.user.pets
            };

            setUser(userData);
            localStorage.setItem('caminacan_user', JSON.stringify(userData));
            localStorage.setItem('caminacan_token', data.token);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const register = async (name: string, email: string, pass: string): Promise<boolean> => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password: pass })
            });

            if (!response.ok) return false;

            const data = await response.json();
            const userData: User = {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role.toLowerCase() as User['role'],
                walkerProfile: data.user.walkerProfile,
                pets: data.user.pets
            };

            setUser(userData);
            localStorage.setItem('caminacan_user', JSON.stringify(userData));
            localStorage.setItem('caminacan_token', data.token);
            return true;
        } catch (error) {
            console.error('Register error:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('caminacan_user');
        localStorage.removeItem('caminacan_token');
    };

    const token = localStorage.getItem('caminacan_token');

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
