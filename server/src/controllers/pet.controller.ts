import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../utils/db';

export const getMyPets = async (req: AuthRequest, res: Response) => {
    try {
        const pets = await prisma.pet.findMany({
            where: { ownerId: req.user?.userId },
        });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching pets' });
    }
};

export const createPet = async (req: AuthRequest, res: Response) => {
    try {
        const { name, breed, age, notes, image } = req.body;
        const pet = await prisma.pet.create({
            data: {
                name,
                breed,
                age: parseInt(age),
                notes,
                image,
                ownerId: req.user!.userId,
            },
        });
        res.status(201).json(pet);
    } catch (error) {
        res.status(500).json({ error: 'Error creating pet' });
    }
};

export const deletePet = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.pet.delete({
            where: { id, ownerId: req.user?.userId },
        });
        res.json({ message: 'Pet deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting pet' });
    }
};
