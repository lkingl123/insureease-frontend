import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { name, email, phone, fax } = await req.json()
  const payerId = params.id

  if (!name || !payerId) {
    return NextResponse.json({ error: 'Missing name or payerId' }, { status: 400 })
  }

  try {
    const newContact = await prisma.payerContact.create({
      data: {
        name,
        email,
        phone,
        fax,
        payerId,
      },
    })

    return NextResponse.json(newContact)
  } catch (error) {
    console.error('❌ Failed to create contact:', error)
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 })
  }
}
