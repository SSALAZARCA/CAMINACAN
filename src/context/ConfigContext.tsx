import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

import { API_URL } from '../api/config';

// Define the Plan interface
export interface Plan {
    id: string;
    name: string;
    price: number;
    period: string;
    description: string;
    features: string[];
    highlight: boolean;
    tag?: string;
}

// Define the Fees interface
export interface Fees {
    commission: number; // Percentage (e.g., 20)
    insurance: number;  // Percentage (e.g., 8)
}

// Define the Context State interface
interface ConfigContextType {
    fees: Fees;
    plans: Plan[];
    updateFees: (newFees: Fees) => void;
    addPlan: (plan: Omit<Plan, 'id'>) => void;
    updatePlan: (id: string, updatedPlan: Partial<Plan>) => void;
    deletePlan: (id: string) => void;
    updateSystemConfig: (config: any) => Promise<boolean>;
    getSystemConfig: () => Promise<any>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// Default initial data (seeded if empty)
const DEFAULT_FEES: Fees = {
    commission: 20,
    insurance: 8
};

const DEFAULT_PLANS: Plan[] = [
    {
        id: 'basic',
        name: "Básico",
        price: 80000,
        period: "mensual",
        description: "Ideal para perros tranquilos que necesitan salir a estirar las patas.",
        features: [
            "4 Paseos al mes (1 por semana)",
            "Duración: 1 Hora",
            "Reporte básico al finalizar",
            "Seguro básico de accidentes"
        ],
        highlight: false,
        tag: ""
    },
    {
        id: 'pro',
        name: "Pro",
        price: 280000,
        period: "mensual",
        description: "Para dueños que quieren lo mejor. Paseos frecuentes y educación.",
        features: [
            "12 Paseos al mes (3 por semana)",
            "Duración: 1 Hora",
            "Rastreo GPS en tiempo real",
            "Refuerzo positivo básico",
            "Seguro premium cobertura total",
            "Reporte con fotos y videos"
        ],
        highlight: true,
        tag: "MÁS POPULAR"
    },
    {
        id: 'premium',
        name: "Premium",
        price: 450000,
        period: "mensual",
        description: "La experiencia VIP completa. Cuidado total para tu mascota.",
        features: [
            "20 Paseos al mes (Lunes a Viernes)",
            "Duración: 1.5 Horas",
            "Entrenamiento personalizado",
            "Baño mensual incluido",
            "Visita veterinaria preventiva",
            "Kit de bienvenida CaminaCan"
        ],
        highlight: false,
        tag: ""
    }
];

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Load from localStorage or use defaults
    const [fees, setFees] = useState<Fees>(() => {
        const saved = localStorage.getItem('caminacan_fees');
        return saved ? JSON.parse(saved) : DEFAULT_FEES;
    });

    const [plans, setPlans] = useState<Plan[]>(() => {
        const saved = localStorage.getItem('caminacan_plans');
        return saved ? JSON.parse(saved) : DEFAULT_PLANS;
    });

    // Persist changes
    useEffect(() => {
        localStorage.setItem('caminacan_fees', JSON.stringify(fees));
    }, [fees]);

    useEffect(() => {
        localStorage.setItem('caminacan_plans', JSON.stringify(plans));
    }, [plans]);

    const updateFees = (newFees: Fees) => {
        setFees(newFees);
    };

    const addPlan = (plan: Omit<Plan, 'id'>) => {
        const newPlan = { ...plan, id: Date.now().toString() };
        setPlans(prev => [...prev, newPlan]);
    };

    const updatePlan = (id: string, updatedPlan: Partial<Plan>) => {
        setPlans(prev => prev.map(p => (p.id === id ? { ...p, ...updatedPlan } : p)));
    };

    const deletePlan = (id: string) => {
        setPlans(prev => prev.filter(p => p.id !== id));
    };

    const updateSystemConfig = async (config: any): Promise<boolean> => {
        try {
            const token = localStorage.getItem('caminacan_token');
            const res = await fetch(`${API_URL}/admin/config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(config)
            });
            if (res.ok) {
                const data = await res.json();
                if (data.config && data.config.platformFee) {
                    setFees(prev => ({ ...prev, commission: data.config.platformFee }));
                }
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Failed to update config", error);
            return false;
        }
    };

    const getSystemConfig = async () => {
        try {
            const token = localStorage.getItem('caminacan_token');
            const res = await fetch(`${API_URL}/admin/config`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.platformFee) {
                    setFees(prev => ({ ...prev, commission: data.platformFee }));
                }
                return data;
            }
            return null;
        } catch (error) {
            console.error("Failed to get config", error);
            return null;
        }
    };

    return (
        <ConfigContext.Provider value={{ fees, plans, updateFees, addPlan, updatePlan, deletePlan, updateSystemConfig, getSystemConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};
