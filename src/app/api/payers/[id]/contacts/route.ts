//src/app/api/payers/[id]/contacts/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/guards'
import type { UserPayload } from '@/lib/auth'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await authorize(req)

  // 🧠 Type narrowing: check if it's a Response object
  if (!(user as UserPayload).role) return user

  if ((user as UserPayload).role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { name, email, phone, fax } = await req.json()
  const payerId = params.id

  if (!name || !payerId) {
    return NextResponse.json({ error: 'Missing name or payerId' }, { status: 400 })
  }

  try {
    const newContact = await prisma.payerContact.create({
      data: { name, email, phone, fax, payerId },
    })

    return NextResponse.json(newContact)
  } catch (error) {
    console.error('❌ Failed to create contact:', error)
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 })
  }
}
