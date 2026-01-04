import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../utils/db';
import fs from 'fs';
import path from 'path';

// --- ANALYTICS ---

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });

        // 1. User Growth (Last 6 months)
        const userGrowth = await prisma.$queryRaw`
            SELECT TO_CHAR("createdAt", 'Mon') as month, COUNT(*) as count
            FROM "User"
            WHERE "createdAt" >= NOW() - INTERVAL '6 months'
            GROUP BY TO_CHAR("createdAt", 'Mon'), EXTRACT(MONTH FROM "createdAt")
            ORDER BY EXTRACT(MONTH FROM "createdAt")
        `;

        // 2. Top Walkers by Earnings
        // Approximate earnings from completed bookings
        const walkers = await prisma.walkerProfile.findMany({
            include: { user: true, bookings: { where: { status: 'FINALIZADO' } } }
        });

        const topWalkers = walkers.map(w => ({
            name: w.user.name,
            earnings: w.bookings.reduce((sum, b) => sum + b.totalPrice, 0)
        })).sort((a, b) => b.earnings - a.earnings).slice(0, 5);

        // 3. Top Products
        const topProductsRaw = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 5
        });

        const topProducts = await Promise.all(topProductsRaw.map(async (p) => {
            const product = await prisma.product.findUnique({ where: { id: p.productId } });
            return {
                name: product?.name || 'Unknown',
                sold: p._sum.quantity || 0
            };
        }));

        res.json({ userGrowth, topWalkers, topProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching stats' });
    }
};

// --- PAYOUTS ---

export const getPayouts = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });

        const walkers = await prisma.walkerProfile.findMany({
            include: {
                user: true,
                bookings: {
                    where: { status: 'FINALIZADO', isPaidToWalker: false }
                }
            }
        });

        const payouts = walkers.map(w => {
            const totalEarnings = w.bookings.reduce((sum, b) => sum + b.totalPrice, 0);
            const commission = totalEarnings * 0.20; // 20% platform fee
            const netPayout = totalEarnings - commission;

            return {
                walkerId: w.id,
                walkerName: w.user.name,
                bankAccount: "********1234", // Placeholder
                pendingBookings: w.bookings.length,
                totalEarnings,
                commission,
                netPayout
            };
        }).filter(p => p.pendingBookings > 0);

        res.json(payouts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching payouts' });
    }
};

export const processPayout = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
        const { walkerId } = req.body;

        // Mark bookings as paid
        await prisma.booking.updateMany({
            where: { walkerId, status: 'FINALIZADO', isPaidToWalker: false },
            data: { isPaidToWalker: true }
        });

        res.json({ success: true, message: 'Pago procesado y marcado como completado' });
    } catch (error) {
        res.status(500).json({ error: 'Error processing payout' });
    }
};

// --- USERS ---

export const getUsers = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                avatar: true,
                _count: {
                    select: {
                        pets: true,
                        bookings: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
};

// --- CONFIG ---

export const getSystemConfig = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });

        const config = await prisma.systemConfig.findUnique({
            where: { key: 'default' }
        });

        // Don't expose password if not needed, or send masked? 
        // Admin needs to see it to edit it? Usually we send empty or masked.
        // For simplicity sending plain text as it is super admin panel.
        res.json(config || {});
    } catch (error) {
        console.error('Error fetching config:', error);
        res.status(500).json({ error: 'Error fetching config' });
    }
};

export const updateConfig = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });

        const { host, port, user, pass, adminEmail, platformFee } = req.body;

        const config = await prisma.systemConfig.upsert({
            where: { key: 'default' },
            update: {
                smtpHost: host,
                smtpPort: Number(port),
                smtpUser: user,
                smtpPass: pass,
                adminEmail: adminEmail,
                platformFee: platformFee ? Number(platformFee) : undefined
            },
            create: {
                key: 'default',
                smtpHost: host,
                smtpPort: Number(port),
                smtpUser: user,
                smtpPass: pass,
                adminEmail: adminEmail,
                platformFee: platformFee ? Number(platformFee) : 0.20
            }
        });

        res.json({ success: true, message: 'Configuration saved to database', config });
    } catch (error) {
        console.error("Config update error", error);
        res.status(500).json({ error: 'Error updating configuration' });
    }
};
