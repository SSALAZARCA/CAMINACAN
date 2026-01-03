import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

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
    updateSystemConfig: (config: any) => Promise<void>;
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

    const updateSystemConfig = async (config: any) => {
        try {
            await fetch('http://localhost:5000/api/admin/config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(config)
            });
        } catch (error) {
            console.error("Failed to update config", error);
        }
    };

    return (
        <ConfigContext.Provider value={{ fees, plans, updateFees, addPlan, updatePlan, deletePlan, updateSystemConfig }}>
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
