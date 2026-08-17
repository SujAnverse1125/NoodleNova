const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Connecting to Neon DB...');

    // Create a dummy user
    const newUser = await prisma.user.create({
        data: {
            walletAddress: 'G_TEST_WALLET_' + Date.now(),
            name: 'Test Courier'
        }
    });
    console.log('✅ Successfully created test user:', newUser);

    // Fetch all users
    const users = await prisma.user.findMany();
    console.log(`📊 Total users in DB: ${users.length}`);

    // Clean up
    await prisma.user.delete({
        where: { id: newUser.id }
    });
    console.log('🧹 Test user deleted.');
    console.log('🚀 Neon Database connection is 100% working!');
}

main()
    .catch(e => {
        console.error('❌ DB Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
