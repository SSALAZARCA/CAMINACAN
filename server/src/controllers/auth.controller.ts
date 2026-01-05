import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db';
import { sendWelcomeEmail } from '../utils/mailer';

const JWT_SECRET = process.env.JWT_SECRET || 'caminacan_secret_key_2026';

export const register = async (req: Request, res: Response) => {
    try {
        console.log('DB URL:', process.env.DATABASE_URL);
        const { name, email, password, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // ... removed import
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'OWNER',
            },
        });

        // Send Welcome Email (Non-blocking)
        sendWelcomeEmail(user.email, user.name).catch(console.error);

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ user, token });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: { walkerProfile: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                walkerProfile: user.walkerProfile
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Login error' });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.userId },
            include: { walkerProfile: true, pets: true }
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            walkerProfile: user.walkerProfile,
            pets: user.pets
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return res.json({ message: 'If user exists, email sent' }); // Security: don't reveal existence

        // Generate a token (valid for 1 hour)
        // Ideally save this in DB, but for JWT stateless we can sign the email
        const token = jwt.sign({ userId: user.id, type: 'reset' }, JWT_SECRET, { expiresIn: '1h' });

        import('../utils/mailer').then(async (mailer) => {
            await mailer.sendPasswordReset(user.email, token);
        });

        res.json({ message: 'If user exists, email sent' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending reset email' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        if (!decoded || decoded.type !== 'reset') throw new Error('Invalid token');

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: decoded.userId },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Invalid or expired token' });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { name, avatar, password } = req.body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (avatar) updateData.avatar = avatar;
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            include: { walkerProfile: true, pets: true }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Error updating profile' });
    }
};

export const updateAvatar = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        // Save filename or full URL depending on your strategy.
        // Assuming we serve static from /uploads, we stick to filename for consistency with other files.
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { avatar: file.filename },
            include: { walkerProfile: true }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Update avatar error:', error);
        res.status(500).json({ error: 'Error updating avatar' });
    }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        // Optional: Check/Delete related data like bookings/pets if cascade isn't set in Prisma
        // For simplicity, assuming Prisma schema handles cascade or we just delete user.
        // Actually, we should probably delete pets first if there's no cascade, but let's try direct delete.

        await prisma.user.delete({
            where: { id: userId }
        });

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ error: 'Error deleting account' });
    }
};
