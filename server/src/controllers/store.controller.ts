import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../utils/db';

// --- PRODUCTS ---

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
        const { name, category, price, image, description, stock } = req.body;
        const product = await prisma.product.create({
            data: { name, category, price, image, description, stock }
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error creating product' });
    }
};

// --- ORDERS ---

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { items, total, address, userName } = req.body; // items: { productId, quantity }[]

        const order = await prisma.$transaction(async (tx) => {
            let calculatedTotal = 0;

            // 1. Check & Deduct Stock & Calculate Total
            for (const item of items) {
                const product = await tx.product.findUnique({ where: { id: item.productId } });
                if (!product) throw new Error(`Product ${item.productId} not found`);
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}`);
                }

                calculatedTotal += product.price * item.quantity;

                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            // 2. Create Order
            return await tx.order.create({
                data: {
                    userId: req.user!.userId,
                    userName,
                    total: calculatedTotal, // Use backend calculated total
                    address,
                    status: 'Pending',
                    items: {
                        create: items.map((item: any) => ({
                            product: { connect: { id: item.productId } },
                            quantity: item.quantity
                        }))
                    }
                },
                include: { items: { include: { product: true } } }
            });
        });


        const currentUser = await prisma.user.findUnique({ where: { id: req.user!.userId } });

        import('../utils/mailer').then(mailer => {
            const userEmail = currentUser?.email;
            if (userEmail) {
                mailer.sendEmail(
                    userEmail,
                    'Confirmación de Compra - CaminaCan',
                    `<h1>¡Gracias por tu compra!</h1><p>Tu pedido #${order.id} ha sido recibido.</p><p>Total: $${order.total}</p>`
                ).catch(console.error);
            }
        });

        res.status(201).json(order);
    } catch (error: any) {
        console.error(error);
        if (error.message.includes('Insufficient stock')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error creating order' });
    }
};

// --- WISHLIST ---

export const getWishlist = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            include: { wishlist: true }
        });
        res.json(user?.wishlist || []);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching wishlist' });
    }
};

export const toggleWishlist = async (req: AuthRequest, res: Response) => {
    try {
        const { productId } = req.body;
        const userId = req.user!.userId;

        // Check if exists
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
                wishlist: { some: { id: productId } }
            }
        });

        if (user) {
            // Remove
            await prisma.user.update({
                where: { id: userId },
                data: { wishlist: { disconnect: { id: productId } } }
            });
            res.json({ action: 'removed', productId });
        } else {
            // Add
            await prisma.user.update({
                where: { id: userId },
                data: { wishlist: { connect: { id: productId } } }
            });
            res.json({ action: 'added', productId });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error toggling wishlist' });
    }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user!.userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
};
