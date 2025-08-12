// prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const entity = await prisma.entity.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corp',
      slug: 'acme-corp',
    },
  });

  const roles = ['super_admin', 'entity_admin', 'cred_specialist', 'provider'];

  for (const role of roles) {
    const email = `${role}@example.com`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashedPassword,
        name: role.replace('_', ' ').toUpperCase(),
        status: 'active',
      },
    });

    await prisma.userEntityRole.upsert({
      where: {
        userId_entityId: {
          userId: user.id,
          entityId: entity.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        entityId: entity.id,
        role,
      },
    });
  }

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
