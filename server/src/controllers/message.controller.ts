import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../utils/db';

// Get conversations (latest message per user)
export const getConversations = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;

        // Fetch all messages where user is sender or receiver
        // This is a simplified approach. Ideally we use group by or raw query for performance.
        const messages = await prisma.message.findMany({
            where: {
                OR: [{ senderId: userId }, { receiverId: userId }]
            },
            orderBy: { createdAt: 'desc' },
            include: {
                sender: { select: { id: true, name: true, avatar: true } },
                receiver: { select: { id: true, name: true, avatar: true } }
            }
        });

        // Group by other user ID
        const conversationsMap = new Map();
        messages.forEach(msg => {
            const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
            const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;

            if (!conversationsMap.has(otherUserId)) {
                conversationsMap.set(otherUserId, {
                    userId: otherUserId,
                    name: otherUser.name,
                    avatar: otherUser.avatar,
                    lastMessage: msg.content,
                    timestamp: msg.createdAt,
                    unread: msg.receiverId === userId && !msg.read
                });
            }
        });

        const conversations = Array.from(conversationsMap.values());
        res.json(conversations);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching conversations' });
    }
};

// Get messages with a specific user
export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { otherUserId } = req.params;

        // Mark as read
        await prisma.message.updateMany({
            where: { senderId: otherUserId, receiverId: userId, read: false },
            data: { read: true }
        });

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId }
                ]
            },
            orderBy: { createdAt: 'asc' }
        });

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching messages' });
    }
};

// Send a message
export const sendMessage = async (req: AuthRequest, res: Response) => {
    try {

        const senderId = req.user!.userId;
        const { receiverId, content } = req.body;
        const userRole = req.user!.role;

        // Validation: Only allow chat if there is an active booking, unless user is ADMIN
        if (userRole !== 'ADMIN') {
            // Check if receiver is admin (allow message to admin at any time?) - Optional rule
            // Let's assume receiverId could be an admin userId.
            const receiverUser = await prisma.user.findUnique({ where: { id: receiverId } });

            if (receiverUser?.role !== 'ADMIN') {
                // Check for active booking between sender and receiver
                const activeBooking = await prisma.booking.findFirst({
                    where: {
                        OR: [
                            { ownerId: senderId, walker: { userId: receiverId }, status: { in: ['CONFIRMADO', 'EN_PROGRESO'] } },
                            { ownerId: receiverId, walker: { userId: senderId }, status: { in: ['CONFIRMADO', 'EN_PROGRESO'] } }
                        ]
                    }
                });

                if (!activeBooking) {
                    return res.status(403).json({ error: 'Solo puedes enviar mensajes durante un servicio activo.' });
                }
            }
        }

        const message = await prisma.message.create({
            data: {
                content,
                senderId,
                receiverId
            }
        });

        // Emit socket event via request-attached io
        const io = (req as any).io;
        if (io) {
            io.to(receiverId).emit('receive_message', message);
        }

        res.status(201).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error sending message' });
    }
};
