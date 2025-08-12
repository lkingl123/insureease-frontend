const { PrismaClient, Role } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create entities
  const acme = await prisma.entity.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: { name: 'Acme Corp', slug: 'acme-corp' },
  })

  const dental = await prisma.entity.upsert({
    where: { slug: 'dental-pro' },
    update: {},
    create: { name: 'Dental Pro', slug: 'dental-pro' },
  })

  // Super admin (no entity)
  await prisma.user.upsert({
    where: { email: 'super_admin@example.com' },
    update: {},
    create: {
      email: 'super_admin@example.com',
      password: hashedPassword,
      name: 'SUPER ADMIN',
      status: 'active',
      role: Role.super_admin,
    },
  })

  // Entity-bound users
  const entityUsers = [
    { email: 'admin@acme.com', name: 'ACME ADMIN', role: Role.entity_admin, entityId: acme.id },
    { email: 'cred@acme.com', name: 'ACME CRED', role: Role.cred_specialist, entityId: acme.id },
    { email: 'provider@acme.com', name: 'ACME PROVIDER', role: Role.provider, entityId: acme.id },

    { email: 'admin@dental.com', name: 'DENTAL ADMIN', role: Role.entity_admin, entityId: dental.id },
  ]

  for (const user of entityUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
        status: 'active',
        role: user.role,
        entityId: user.entityId,
      },
    })
  }

  console.log('✅ Seed complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
