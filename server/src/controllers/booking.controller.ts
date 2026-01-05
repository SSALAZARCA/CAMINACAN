import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../utils/db';

export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
        const { serviceType, date, time, walkerId, petIds, isRecurring, selectedDays } = req.body;

        const walker = await prisma.walkerProfile.findUnique({ where: { id: walkerId } });
        if (!walker) return res.status(404).json({ error: 'Walker not found' });

        const hours = 1;
        const calculatedPrice = walker.pricePerHour * hours * petIds.length;
        const ownerId = req.user!.userId;

        const bookingDates: string[] = [];

        if (isRecurring && selectedDays && selectedDays.length > 0) {
            // Generate dates for next 4 weeks
            const startDate = new Date(date);
            for (let i = 0; i < 28; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + i);
                // 0 = Sunday, 1 = Monday...
                if (selectedDays.includes(currentDate.getDay())) {
                    bookingDates.push(currentDate.toISOString().split('T')[0]);
                }
            }
        } else {
            bookingDates.push(date);
        }

        // Use transaction to create all bookings
        const createdBookings = await prisma.$transaction(
            bookingDates.map(bookingDate =>
                prisma.booking.create({
                    data: {
                        serviceType,
                        date: bookingDate,
                        time,
                        totalPrice: calculatedPrice,
                        status: 'PENDIENTE',
                        ownerId: ownerId,
                        walkerId,
                        pets: {
                            connect: petIds.map((id: string) => ({ id }))
                        },
                        liveData: {
                            path: [],
                            peeCount: 0,
                            pooCount: 0,
                            hydrationCount: 0,
                            photos: [],
                            incidents: []
                        }
                    },
                    include: { pets: true, walker: true }
                })
            )
        );

        // Send email only for the first one or a summary (simplified to first one for now)
        const currentUser = await prisma.user.findUnique({ where: { id: req.user!.userId } });
        import('../utils/mailer').then(mailer => {
            const userEmail = currentUser?.email;
            if (userEmail && createdBookings.length > 0) {
                const firstBooking = createdBookings[0];
                mailer.sendBookingConfirmation(userEmail, {
                    serviceType: firstBooking.serviceType,
                    date: firstBooking.date,
                    time: firstBooking.time,
                    totalPrice: firstBooking.totalPrice * createdBookings.length // Total estimated
                }).catch(console.error);
            }
        });

        res.status(201).json(createdBookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating booking' });
    }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        // Fetch bookings where user is EITHER the owner OR the walker
        // This solves issues where token role might be outdated or user is both
        const bookings = await prisma.booking.findMany({
            where: {
                OR: [
                    { ownerId: userId },
                    { walker: { userId: userId } }
                ]
            },
            include: { pets: true, walker: { include: { user: true } }, owner: true },
            orderBy: { createdAt: 'desc' } // Frontend now handles chronological sort for schedule
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching bookings' });
    }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await prisma.booking.update({
            where: { id },
            data: { status }
        });

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Error updating booking status' });
    }
};

export const updateLiveTracking = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { liveData } = req.body;

        // Merge live data or replace? For simplicity, we'll allow partial updates via controller logic if needed, 
        // but here we expect the full object or relevant keys.
        const currentBooking = await prisma.booking.findUnique({ where: { id } });
        if (!currentBooking) return res.status(404).json({ error: 'Booking not found' });

        const newLiveData = {
            ...(currentBooking.liveData as object),
            ...liveData
        };

        const booking = await prisma.booking.update({
            where: { id },
            data: { liveData: newLiveData }
        });

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Error updating live tracking' });
    }
};

export const uploadBookingPhoto = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const file = req.file;

        if (!file) return res.status(400).json({ error: 'No image uploaded' });

        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        const currentLiveData = (booking.liveData as any) || {};
        const currentPhotos = currentLiveData.photos || [];
        const newPhotos = [...currentPhotos, file.filename];

        const updated = await prisma.booking.update({
            where: { id },
            data: {
                liveData: {
                    ...currentLiveData,
                    photos: newPhotos
                }
            }
        });

        res.json(updated);
    } catch (error) {
        console.error("Error uploading booking photo", error);
        res.status(500).json({ error: 'Error uploading photo' });
    }
};
