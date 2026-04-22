import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'Le Bistro Test',
      slug: 'le-bistro-test',
      city: 'Paris',
      isPartner: true,
      isPremium: true,
      description: 'Un bistro délicieux pour tester.',
    },
  });
  console.log('Created restaurant:', restaurant);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
