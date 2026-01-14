import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to DB...');
        const user = await prisma.user.findFirst();
        if (!user) {
            console.log('No users found to test with.');
            return;
        }
        console.log('Found user:', user.email);

        console.log('Fetching categories...');
        const categories = await prisma.category.findMany({
            where: { userId: user.id }
        });
        console.log('Categories found:', categories.length);
        console.log('Success!');
    } catch (error) {
        console.error('DB Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
