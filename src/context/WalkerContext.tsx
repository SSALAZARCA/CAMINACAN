import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../api/config';

export interface WalkerApplicant {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    neighborhood: string;
    experience: string;
    bio: string;
    price: number;
    image: string;
    badges: string[];
    documents: {
        idCard: string;
        policeRecord: string;
        certificate: string;
    };
    status: 'Pending' | 'Approved' | 'Rejected';
    dateApplied: string;
}

export interface Review {
    id: string;
    walkerId: string;
    userId: string;
    userName: string;
    rating: number; // 1-5
    comment: string;
    date: string;
}

export interface ActiveWalker extends Omit<WalkerApplicant, 'status'> {
    rating: number;
    walksCompleted: number;
    status: 'Active' | 'Suspended';
    earnings: number;
    gallery?: string[];
    availableSlots?: { [date: string]: string[] };
}

interface WalkerContextType {
    applicants: WalkerApplicant[];
    activeWalkers: ActiveWalker[];
    reviews: Review[];
    registerApplicant: (data: Omit<WalkerApplicant, 'id' | 'status' | 'dateApplied'>) => void;
    approveApplicant: (id: string) => void;
    rejectApplicant: (id: string) => void;
    suspendWalker: (id: string) => void;
    activateWalker: (id: string) => void;
    deleteWalker: (id: string) => void;
    addReview: (review: Omit<Review, 'id' | 'date'> & { bookingId: string }) => Promise<void>;
    updateWalkerProfile: (data: Partial<ActiveWalker>) => Promise<void>;
    updateAvailability: (walkerId: string, date: string, slots: string[]) => void;
}

const WalkerContext = createContext<WalkerContextType | undefined>(undefined);

export const WalkerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [applicants, setApplicants] = useState<WalkerApplicant[]>([]);
    const [activeWalkers, setActiveWalkers] = useState<ActiveWalker[]>([]);

    const fetchWalkers = async () => {
        try {
            const response = await fetch(`${API_URL}/walkers`);
            if (response.ok) {
                const data = await response.json();
                const mapped: ActiveWalker[] = data.map((w: any) => ({
                    id: w.id,
                    name: w.user.name,
                    email: w.user.email,
                    phone: '', // Not in public profile
                    city: w.city,
                    neighborhood: w.neighborhood,
                    experience: w.experience,
                    bio: w.bio,
                    price: w.pricePerHour,
                    image: w.user.avatar || 'https://images.unsplash.com/photo-1517423568366-eb58959600c4?fit=crop&w=200&h=200',
                    badges: w.badges,
                    gallery: w.gallery || [],
                    documents: { idCard: '', policeRecord: '', certificate: '' },
                    dateApplied: '',
                    rating: w.rating,
                    walksCompleted: 0,
                    earnings: 0,
                    status: 'Active',
                    availableSlots: w.availableSlots || {}
                }));
                setActiveWalkers(mapped);
            }
        } catch (error) {
            console.error('Error fetching walkers:', error);
        }
    };

    useEffect(() => {
        fetchWalkers();
    }, []);

    const registerApplicant = async (data: any) => {
        try {
            // Need to convert to FormData for file upload
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('phone', data.phone);
            formData.append('city', data.city);
            formData.append('neighborhood', data.neighborhood);
            formData.append('experience', data.experience);
            formData.append('about', data.about);
            formData.append('price', data.price.toString());

            if (data.documents.idCard instanceof File) formData.append('idCard', data.documents.idCard);
            if (data.documents.policeRecord instanceof File) formData.append('policeRecord', data.documents.policeRecord);
            if (data.documents.certificate instanceof File) formData.append('certificate', data.documents.certificate);

            const response = await fetch(`${API_URL}/walkers/register`, {
                method: 'POST',
                body: formData
                // Content-Type header not set manually for FormData, browser sets it with boundary
            });

            if (response.ok) {
                // Success Logic / Notification
                console.log("Application submitted successfully");
            } else {
                console.error("Failed to submit application");
            }
        } catch (error) {
            console.error("Error registering applicant", error);
        }
    };

    const approveApplicant = (id: string) => {
        setApplicants(prev => prev.filter(a => a.id !== id));
    };

    const rejectApplicant = (id: string) => {
        setApplicants(prev => prev.filter(a => a.id !== id));
    };

    const suspendWalker = (id: string) => {
        setActiveWalkers(prev => prev.map(w => w.id === id ? { ...w, status: 'Suspended' } : w));
    };

    const activateWalker = (id: string) => {
        setActiveWalkers(prev => prev.map(w => w.id === id ? { ...w, status: 'Active' } : w));
    };

    const deleteWalker = (id: string) => {
        setActiveWalkers(prev => prev.filter(w => w.id !== id));
    };

    const addReview = async (reviewData: Omit<Review, 'id' | 'date'> & { bookingId: string }) => {
        try {
            const token = localStorage.getItem('caminacan_token');
            const res = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reviewData)
            });

            if (res.ok) {
                fetchWalkers();
            }
        } catch (error) {
            console.error("Error creating review", error);
        }
    };

    const updateWalkerProfile = async (data: Partial<ActiveWalker>) => {
        try {
            const token = localStorage.getItem('caminacan_token');
            const res = await fetch(`${API_URL}/walkers/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                fetchWalkers();
            }
        } catch (error) {
            console.error("Error updating profile", error);
        }
    };

    const updateAvailability = (walkerId: string, date: string, slots: string[]) => {
        setActiveWalkers(prev => prev.map(w => {
            if (w.id === walkerId) {
                return {
                    ...w,
                    availableSlots: {
                        ...(w.availableSlots || {}),
                        [date]: slots
                    }
                };
            }
            return w;
        }));
    };

    return (
        <WalkerContext.Provider value={{
            applicants,
            activeWalkers,
            reviews,
            registerApplicant,
            approveApplicant,
            rejectApplicant,
            suspendWalker,
            activateWalker,
            deleteWalker,
            addReview,
            updateWalkerProfile,
            updateAvailability
        }}>
            {children}
        </WalkerContext.Provider>
    );
};

export const useWalker = () => {
    const context = useContext(WalkerContext);
    if (context === undefined) {
        throw new Error('useWalker must be used within a WalkerProvider');
    }
    return context;
};
