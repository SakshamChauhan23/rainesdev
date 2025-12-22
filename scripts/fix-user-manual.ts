
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixUser() {
    const userId = '7522627a-ee5b-44b2-b3b7-6fea85456913';
    const email = 'sakshamchauhan23@gmail.com';

    console.log(`🛠️ Manually creating public user record for: ${email}`);

    // Upsert to be safe
    const user = await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
            id: userId,
            email: email,
            role: 'SELLER',
            name: 'Saksham Chauhan',
        }
    });

    console.log('✅ User fixed:', user);
}

fixUser()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
