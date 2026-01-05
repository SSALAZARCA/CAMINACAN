import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL, getHeaders } from '../api/config';

export interface Booking {
    id: string;
    ownerId: string;
    walkerUserId: string;
    service: string;
    walkerId: string;
    walkerName: string;
    petIds: string[];
    pets: any[];
    date: string;
    time: string;
    status: string;
    totalPrice: number;
    liveData?: {
        currentLocation?: [number, number];
        path: [number, number][];
        startTime?: string;
        endTime?: string;
        peeCount: number;
        pooCount: number;
        hydrationCount: number;
        photos: string[];
        incidents: string[];
    };
}

interface AddBookingDTO {
    service: string;
    walkerId: string;
    walkerName: string;
    petIds: string[];
    date: string;
    time: string;
    totalPrice: number;
    isRecurring?: boolean;
    selectedDays?: number[];
}

interface BookingContextType {
    bookings: Booking[];
    fetchBookings: () => Promise<void>;
    addBooking: (booking: AddBookingDTO) => Promise<void>;
    updateBookingStatus: (id: string, status: string) => Promise<void>;
    updateLiveTracking: (id: string, data: Record<string, any>) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Helper to map status from backend to frontend if needed (or just use backend status)
const mapStatus = (status: string) => {
    const map: Record<string, string> = {
        'PENDIENTE': 'Pendiente',
        'CONFIRMADO': 'Confirmado',
        'EN_PROGRESO': 'En Progreso',
        'ESPERANDO_CONFIRMACION': 'Esperando Confirmación',
        'FINALIZADO': 'Finalizado'
    };
    return map[status] || status;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);

    const fetchBookings = async () => {
        try {
            const response = await fetch(`${API_URL}/bookings`, {
                headers: getHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                const mappedBookings = data.map((b: any) => ({
                    id: b.id,
                    ownerId: b.ownerId,
                    walkerUserId: b.walker?.userId,
                    service: b.serviceType,
                    walkerId: b.walkerId,
                    walkerName: b.walker?.user?.name || 'Paseador',
                    petIds: b.pets.map((p: any) => p.id),
                    pets: b.pets,
                    date: b.date,
                    time: b.time,
                    status: mapStatus(b.status),
                    totalPrice: b.totalPrice,
                    liveData: b.liveData
                }));
                setBookings(mappedBookings);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const addBooking = async (booking: AddBookingDTO) => {
        try {
            const response = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    serviceType: booking.service,
                    date: booking.date,
                    time: booking.time,
                    walkerId: booking.walkerId,
                    petIds: booking.petIds,
                    totalPrice: booking.totalPrice,
                    isRecurring: booking.isRecurring,
                    selectedDays: booking.selectedDays
                })
            });
            if (response.ok) {
                await fetchBookings();
            }
        } catch (error) {
            console.error('Error adding booking:', error);
        }
    };

    const updateBookingStatus = async (id: string, status: string) => {
        // Optimistic update
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: status } : b));

        try {
            // Map back to backend status
            const backMap: Record<string, string> = {
                'Pendiente': 'PENDIENTE',
                'Confirmado': 'CONFIRMADO',
                'En Progreso': 'EN_PROGRESO',
                'Esperando Confirmación': 'ESPERANDO_CONFIRMACION',
                'Finalizado': 'FINALIZADO'
            };
            const backendStatus = backMap[status] || status;

            const response = await fetch(`${API_URL}/bookings/${id}/status`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({ status: backendStatus })
            });
            if (response.ok) {
                await fetchBookings();
            } else {
                await fetchBookings(); // Revert
            }
        } catch (error) {
            console.error('Error updating status:', error);
            await fetchBookings(); // Revert
        }
    };

    const updateLiveTracking = async (id: string, data: Record<string, any>) => {
        // 1. Instant Optimistic Update to Local State
        setBookings(prevBookings => prevBookings.map(b => {
            if (b.id === id) {
                // Deep merge logic for liveData
                const currentLive = b.liveData || {};
                return {
                    ...b,
                    liveData: { ...currentLive, ...data } as any
                };
            }
            return b;
        }));

        try {
            const response = await fetch(`${API_URL}/bookings/${id}/live`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({ liveData: data })
            });

            if (!response.ok) {
                // If fails, re-fetch to sync truth
                console.error("Sync failed, refetching");
                await fetchBookings();
            }
            // Success: We keep the optimistic state, no need to re-fetch immediately for speed.
        } catch (error) {
            console.error('Error updating live tracking:', error);
            // Revert on critical error
            await fetchBookings();
        }
    };

    return (
        <BookingContext.Provider value={{ bookings, fetchBookings, addBooking, updateBookingStatus, updateLiveTracking }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBookings = () => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBookings must be used within a BookingProvider');
    }
    return context;
};
