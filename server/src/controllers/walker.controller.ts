import { Request, Response } from 'express';
import prisma from '../utils/db';
import { sendAdminWalkerNotification, sendWelcomeEmail } from '../utils/mailer';

export const getAllWalkers = async (req: Request, res: Response) => {
    try {
        const walkers = await prisma.walkerProfile.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        avatar: true
                    }
                }
            }
        });
        res.json(walkers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching walkers' });
    }
};

export const getWalkerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const walker = await prisma.walkerProfile.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, avatar: true } },
                reviews: {
                    include: {
                        owner: { select: { name: true, avatar: true } }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        if (!walker) return res.status(404).json({ error: 'Walker not found' });
        res.json(walker);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching walker' });
    }
};

export const updateWalkerProfile = async (req: Request, res: Response) => {
    try {
        // Authenticated user (Walker)
        // Need to check if auth middleware is used and user is attached
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { bio, experience, pricePerHour, city, neighborhood, gallery } = req.body;

        const updatedProfile = await prisma.walkerProfile.update({
            where: { userId }, // Update by userId as relation is 1:1
            data: {
                bio,
                experience,
                pricePerHour: parseFloat(pricePerHour),
                city,
                neighborhood,
                gallery
            }
        });

        res.json(updatedProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating walker profile' });
    }
};
// ... existing code

export const registerWalker = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, city, neighborhood, experience, about, price } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // In a real app, you would create a User first or link to existing auth
        // For now, we simulate user creation or assume it exists. 
        // This endpoint should ideally be protected or create a temporary "Applicant" record.

        // Let's create a User + WalkerProfile for simplicity of the flow, using a placeholder password

        // Check if user exists
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const hashedPassword = await require('bcryptjs').hash('ChangeMe123', 10);
            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: 'WALKER',
                }
            });
        } else {
            // Upgrade role if exists
            await prisma.user.update({
                where: { id: user.id },
                data: { role: 'WALKER' }
            });
        }

        const documents = {
            idCard: files['idCard']?.[0]?.filename,
            policeRecord: files['policeRecord']?.[0]?.filename,
            certificate: files['certificate']?.[0]?.filename,
        };


        const walker = await prisma.walkerProfile.create({
            data: {
                userId: user.id,
                city,
                neighborhood,
                experience,
                bio: about,
                pricePerHour: parseFloat(price) || 15000,
                idCard: documents.idCard,
                policeRecord: documents.policeRecord,
                certificate: documents.certificate
            }
        });

        // Notifications
        sendAdminWalkerNotification(user.name).catch(console.error);
        sendWelcomeEmail(user.email, user.name).catch(console.error);

        res.status(201).json({ message: 'Walker registered successfully', walker, documents });
    } catch (error) {
        console.error("Error registering walker:", error);
        res.status(500).json({ error: 'Error registering walker' });
    }
};
