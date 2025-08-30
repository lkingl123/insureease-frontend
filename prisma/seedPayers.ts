const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Create Payer 1
  const payer1 = await prisma.payer.upsert({
    where: { name: 'BlueShield' },
    update: {},
    create: { name: 'BlueShield' },
  })

  // Products for payer1
  await prisma.product.createMany({
    data: [
      { name: 'Dental Gold', payerId: payer1.id },
      { name: 'Dental Silver', payerId: payer1.id },
    ],
    skipDuplicates: true,
  })

  // Contacts for payer1
  await prisma.payerContact.createMany({
    data: [
      {
        name: 'Lily Blue',
        email: 'lily@blueshield.com',
        phone: '123-456-7890',
        fax: '123-456-7891',
        payerId: payer1.id,
      },
    ],
    skipDuplicates: true,
  })

  // Create Payer 2
  const payer2 = await prisma.payer.upsert({
    where: { name: 'Aetna' },
    update: {},
    create: { name: 'Aetna' },
  })

  // Products for payer2
  await prisma.product.createMany({
    data: [
      { name: 'Premium Plus', payerId: payer2.id },
    ],
    skipDuplicates: true,
  })

  // Contacts for payer2
  await prisma.payerContact.createMany({
    data: [
      {
        name: 'Tom Aetna',
        email: 'tom@aetna.com',
        phone: '555-222-3333',
        fax: '555-222-3334',
        payerId: payer2.id,
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ SeedPayers complete!')
}

main()
  .catch(e => {
    console.error('❌ Error in seedPayers:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
