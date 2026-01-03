const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('123456', 10);
    console.log('Creating Admin...');
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
    console.log('Admin created.');
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
