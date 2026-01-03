import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    role: z.enum(['OWNER', 'WALKER']).optional()
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

export const bookingSchema = z.object({
    serviceType: z.string(),
    date: z.string(), // Could add regex for YYYY-MM-DD
    time: z.string(),
    walkerId: z.string().cuid(),
    petIds: z.array(z.string().cuid()).min(1),
    // totalPrice is NOT here because we will calculate it on backend
});

export const reviewSchema = z.object({
    bookingId: z.string().cuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional()
});

export const productSchema = z.object({
    name: z.string().min(3),
    category: z.string(),
    price: z.number().positive(),
    image: z.string().url(),
    description: z.string(),
    stock: z.number().int().nonnegative()
});

export const orderSchema = z.object({
    items: z.array(z.object({
        productId: z.number(), // Assuming Product ID is Int based on schema
        quantity: z.number().int().positive()
    })).min(1),
    address: z.string().min(5),
    userName: z.string().min(2),
    // total is calculated on backend
});
