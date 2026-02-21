import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting user account update...');

  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} users.`);

  for (const user of users) {
    try {
      // Skip if username is already the phone number and password is correct
      if (user.username === user.phone && user.password === '123456') {
        console.log(`User ${user.name} already up to date.`);
        continue;
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          username: user.phone,
          password: '123456',
        },
      });

      console.log(`Updated user: ${updatedUser.name} -> Username: ${updatedUser.username}, Password: 123456`);
    } catch (error) {
      console.error(`Failed to update user ${user.name} (ID: ${user.id}):`, error);
    }
  }

  console.log('Update finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
