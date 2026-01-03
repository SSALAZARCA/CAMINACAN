import { PrismaClient } from '@prisma/client';

const url = process.env.DATABASE_URL;

if (!url) {
    console.error('DATABASE_URL is not defined in environment!');
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: url,
        },
    },
});

export default prisma;
