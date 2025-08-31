// src/app/api/payers/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/guards'
import type { UserPayload } from '@/lib/auth'

export async function GET(req: Request) {
  const user = await authorize(req)
  if (!(user as UserPayload).role) return user

  // ✅ All roles are allowed to read
  const payers = await prisma.payer.findMany({
    include: { products: true, contacts: true },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(payers)
}

export async function POST(req: Request) {
  const user = await authorize(req)
  if (!(user as UserPayload).role) return user

  // ✅ Only super_admin or entity_admin can create
  if (!['super_admin', 'entity_admin'].includes((user as UserPayload).role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { name } = await req.json()
  if (!name) return NextResponse.json({ error: 'Missing payer name' }, { status: 400 })

  const payer = await prisma.payer.create({ data: { name } })
  return NextResponse.json(payer)
}
