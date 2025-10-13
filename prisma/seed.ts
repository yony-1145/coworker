import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: 'テストユーザー',
      email: 'test@example.com',
      image: null,
      location: {
        create: {
          lat: 35.6895,
          lng: 139.6917,
          message: '新宿付近にいます',
        },
      },
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
