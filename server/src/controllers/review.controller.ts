import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../utils/db';

export const createReview = async (req: AuthRequest, res: Response) => {
    try {
        const { bookingId, rating, comment } = req.body;
        const ownerId = req.user!.userId;

        // 1. Validate Booking
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { walker: true }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.ownerId !== ownerId) {
            return res.status(403).json({ error: 'Not authorized to review this booking' });
        }

        // Optional: Check status
        // if (booking.status !== 'FINALIZADO') ...

        // 2. Check overlap
        const existingReview = await prisma.review.findUnique({
            where: { bookingId }
        });

        if (existingReview) {
            return res.status(400).json({ error: 'Review already exists for this booking' });
        }

        // 3. Create Review
        const review = await prisma.review.create({
            data: {
                rating,
                comment,
                bookingId,
                walkerId: booking.walkerId,
                ownerId
            }
        });

        // 4. Update Walker Rating
        const walkerId = booking.walkerId;
        const aggregations = await prisma.review.aggregate({
            _avg: { rating: true },
            where: { walkerId }
        });

        const newAverage = aggregations._avg.rating || rating;

        await prisma.walkerProfile.update({
            where: { id: walkerId },
            data: { rating: newAverage }
        });

        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating review' });
    }
};
