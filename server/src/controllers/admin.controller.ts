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

export const updateConfig = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });

        const { host, port, user, pass, adminEmail } = req.body;

        // you would use a Config table in DB or a secure secrets manager.
        // For this local/demo setup, we will read and rewrite the .env file.
        const envPath = path.resolve(__dirname, '../../.env');
        let envContent = '';

        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
        }

        // Helper to update or add key
        const updateKey = (key: string, val: string) => {
            const regex = new RegExp(`^${key}=.*`, 'm');
            if (regex.test(envContent)) {
                envContent = envContent.replace(regex, `${key}=${val}`);
            } else {
                envContent += `\n${key}=${val}`;
            }
        };

        if (host) updateKey('SMTP_HOST', host);
        if (port) updateKey('SMTP_PORT', port);
        if (user) updateKey('SMTP_USER', user);
        if (pass) updateKey('SMTP_PASS', pass);
        if (adminEmail) updateKey('ADMIN_EMAIL', adminEmail);

        fs.writeFileSync(envPath, envContent.trim());

        // Reload environment variables for the current process
        // Note: Some libraries might require a full restart to pick up changes
        process.env.SMTP_HOST = host || process.env.SMTP_HOST;
        process.env.SMTP_PORT = port || process.env.SMTP_PORT;
        process.env.SMTP_USER = user || process.env.SMTP_USER;
        process.env.SMTP_PASS = pass || process.env.SMTP_PASS;
        process.env.ADMIN_EMAIL = adminEmail || process.env.ADMIN_EMAIL;

        res.json({ success: true, message: 'Configuration updated successfully' });
    } catch (error) {
        console.error("Config update error", error);
        res.status(500).json({ error: 'Error updating configuration' });
    }
};
