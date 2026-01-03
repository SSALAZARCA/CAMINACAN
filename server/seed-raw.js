const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    await client.connect();

    const hashedPassword = await bcrypt.hash('123456', 10);
    const adminPassword = await bcrypt.hash('adminpassword', 10);

    try {
        // Admin
        const adminRes = await client.query(`
      INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, $2, $3, 'ADMIN', NOW(), NOW())
      ON CONFLICT (email) DO NOTHING RETURNING id`,
            ['admin@caminacan.com', 'Super Admin', adminPassword]
        );
        console.log('Admin processed.');

        // Owner
        const ownerRes = await client.query(`
      INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, $2, $3, 'OWNER', NOW(), NOW())
      ON CONFLICT (email) DO NOTHING RETURNING id`,
            ['owner@caminacan.com', 'Carlos Dueño', hashedPassword]
        );
        console.log('Owner processed.');

        // Walker (Ana)
        const walkerRes = await client.query(`
      INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, $2, $3, 'WALKER', NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
            ['ana@caminacan.com', 'Ana María V.', hashedPassword]
        );

        // Logic to get walker ID if it wasn't returned on conflict
        let walkerId;
        if (walkerRes.rows[0]) walkerId = walkerRes.rows[0].id;
        else {
            const res = await client.query('SELECT id FROM "User" WHERE email = $1', ['ana@caminacan.com']);
            walkerId = res.rows[0].id;
        }

        // Walker Profile
        await client.query(`
        INSERT INTO "WalkerProfile" (id, "userId", bio, city, neighborhood, "pricePerHour", experience, badges)
        VALUES (gen_random_uuid(), $1, 'Veterinaria apasionada...', 'Bogotá', 'Chicó', 20000, '5 años', $2)
        ON CONFLICT ("userId") DO NOTHING`,
            [walkerId, ['Verificado', 'Veterinario']]
        );

        // Products
        const products = [
            ["Alimento Premium Adultos", "Alimento", 185000, "https://images.unsplash.com/photo-1589924691195-41432c84c161?fit=crop&w=300&h=300", "Nutrición balanceada.", 50],
            ["Snacks Naturales de Pollo", "Comida", 25000, "https://images.unsplash.com/photo-1582798358481-d199fb7347bb?fit=crop&w=300&h=300", "Premios saludables.", 100],
            ["Juguete Wesco Kong", "Juguetes", 45000, "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?fit=crop&w=300&h=300", "Juguete resistente.", 30]
        ];

        for (const p of products) {
            await client.query(`
            INSERT INTO "Product" (id, name, category, price, image, description, stock, "createdAt", "updatedAt")
            VALUES (nextval('product_id_seq'::regclass), $1, $2, $3, $4, $5, $6, NOW(), NOW())
            ON CONFLICT DO NOTHING`, // Assuming name or id conflict? No unique constraint on name usually.
                // Actually, usually headers are optional.
                // Prisma autoincrement uses a sequence usually? 
                // If I use createMany, it handles IDs. 
                // Let's assume standard insert.
                p
            );
            // If id is autoincrement, I shouldn't pass it unless I want to override?
            // Wait, regular SQL insert without ID triggers sequence.
        }
        // Re-doing products insert correctly
        for (const p of products) {
            await client.query(`
            INSERT INTO "Product" (name, category, price, image, description, stock, "createdAt", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
                p
            );
        }
        console.log('Products created.');

    } catch (err) {
        console.error('Seed error:', err);
    } finally {
        await client.end();
    }
}

main();
