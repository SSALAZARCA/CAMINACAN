import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL, getHeaders } from '../api/config';
import { useAuth } from './AuthContext';

export interface Pet {
    id: string;
    name: string;
    breed: string;
    age: number;
    notes?: string;
    image?: string;
    size?: 'Pequeño' | 'Mediano' | 'Grande';
    vaccines?: string;
    allergies?: string;
    medicalConditions?: string;
    behavior?: string;
    walkingInstructions?: string;
}

interface PetContextType {
    pets: Pet[];
    addPet: (pet: Omit<Pet, 'id'>) => Promise<void>;
    removePet: (id: string) => Promise<void>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [pets, setPets] = useState<Pet[]>([]);

    const fetchPets = async () => {
        if (!user) return; // Guard clause inside function too
        try {
            const response = await fetch(`${API_URL}/pets`, {
                headers: getHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                setPets(data);
            }
        } catch (error) {
            console.error('Error fetching pets:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchPets();
        } else {
            setPets([]);
        }
    }, [user]);

    const addPet = async (pet: Omit<Pet, 'id'>) => {
        try {
            const response = await fetch(`${API_URL}/pets`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(pet)
            });
            if (response.ok) {
                await fetchPets();
            }
        } catch (error) {
            console.error('Error adding pet:', error);
        }
    };

    const removePet = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/pets/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            if (response.ok) {
                setPets(pets.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Error removing pet:', error);
        }
    };

    return (
        <PetContext.Provider value={{ pets, addPet, removePet }}>
            {children}
        </PetContext.Provider>
    );
};

export const usePets = () => {
    const context = useContext(PetContext);
    if (context === undefined) {
        throw new Error('usePets must be used within a PetProvider');
    }
    return context;
};
