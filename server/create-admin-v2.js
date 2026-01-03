require('dotenv').config();
const prisma = require('./dist/utils/db.js').default;
const bcrypt = require('bcryptjs');

async function main() {
    if (!prisma) {
        console.error('Prisma instance not found in dist/utils/db.js');
        process.exit(1);
    }
    const hashedPassword = await bcrypt.hash('123456', 10);
    console.log('Creating Admin...');
    const admin = await prisma.user.upsert({
        where: { email: 'admin@caminacan.com' },
        update: {},
        create: {
            email: 'admin@caminacan.com',
            name: 'Super Admin',
            password: hashedPassword,
            role: 'ADMIN'
        }
    });
    console.log('Admin created:', admin.email);
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
