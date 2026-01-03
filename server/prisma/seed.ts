import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Create Walker
    await prisma.user.upsert({
        where: { email: 'ana@caminacan.com' },
        update: {},
        create: {
            email: 'ana@caminacan.com',
            name: 'Ana María V.',
            password: hashedPassword,
            role: 'WALKER',
            walkerProfile: {
                create: {
                    bio: 'Veterinaria apasionada por el cuidado canino.',
                    city: 'Bogotá',
                    neighborhood: 'Chicó',
                    pricePerHour: 20000,
                    experience: '5 años',
                    badges: ['Verificado', 'Veterinario', 'Premium']
                }
            }
        }
    });

    // Create Owner
    await prisma.user.upsert({
        where: { email: 'owner@caminacan.com' },
        update: {},
        create: {
            email: 'owner@caminacan.com',
            name: 'Carlos Dueño',
            password: hashedPassword,
            role: 'OWNER',
            pets: {
                create: [
                    { name: 'Rocco', breed: 'Golden Retriever', age: 3, notes: 'Muy juguetón' },
                    { name: 'Luna', breed: 'Poodle', age: 2, notes: 'Alergia al pollo' }
                ]
            }
        }
    });

    // Create Admin
    await prisma.user.upsert({
        where: { email: 'admin@caminacan.com' },
        update: {},
        create: {
            email: 'admin@caminacan.com',
            name: 'Super Admin',
            password: hashedPassword,
            role: 'ADMIN'
        }
    });

    // Create Products
    await prisma.product.createMany({
        data: [
            {
                name: "Alimento Premium Adultos",
                category: "Alimento",
                price: 185000,
                image: "https://images.unsplash.com/photo-1589924691195-41432c84c161?fit=crop&w=300&h=300",
                description: "Nutrición balanceada para perros adultos de todas las razas.",
                stock: 50
            },
            {
                name: "Snacks Naturales de Pollo",
                category: "Comida",
                price: 25000,
                image: "https://images.unsplash.com/photo-1582798358481-d199fb7347bb?fit=crop&w=300&h=300",
                description: "Premios saludables sin conservantes ni aditivos.",
                stock: 100
            },
            {
                name: "Juguete Wesco Kong",
                category: "Juguetes",
                price: 45000,
                image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?fit=crop&w=300&h=300",
                description: "Juguete de caucho resistente para masticadores potentes.",
                stock: 30
            },
            {
                name: "Correa Retráctil 5m",
                category: "Accesorios",
                price: 65000,
                image: "https://images.unsplash.com/photo-1557303126-77874bd8b724?fit=crop&w=300&h=300",
                description: "Libertad controlada para tus paseos.",
                stock: 25
            },
            {
                name: "Cama Ortopédica L",
                category: "Accesorios",
                price: 220000,
                image: "https://images.unsplash.com/photo-1599305134638-726ef914971c?fit=crop&w=300&h=300",
                description: "Máximo confort para el descanso de tu peludo.",
                stock: 10
            },
            {
                name: "Pelota Interactiva",
                category: "Juguetes",
                price: 35000,
                image: "https://images.unsplash.com/photo-1546487771-b213b30bd80f?fit=crop&w=300&h=300",
                description: "Mantiene a tu perro entretenido por horas.",
                stock: 60
            }
        ],
        skipDuplicates: true
    });

    console.log('Seed data created successfully! 🐶');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
