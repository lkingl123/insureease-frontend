// src/app/api/payers/[id]/products/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/guards'
import type { UserPayload } from '@/lib/auth'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await authorize(req)
  if (!(user as UserPayload).role) return user

  if (!['super_admin', 'entity_admin', 'cred_specialist'].includes((user as UserPayload).role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { name } = await req.json()
  const payerId = params.id

  if (!name || !payerId) {
    return NextResponse.json({ error: 'Missing name or payerId' }, { status: 400 })
  }

  try {
    const newProduct = await prisma.product.create({
      data: { name, payerId },
    })

    return NextResponse.json(newProduct)
  } catch (error) {
    console.error('❌ Failed to create product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
