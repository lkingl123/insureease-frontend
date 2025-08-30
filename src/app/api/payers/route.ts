import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const payers = await prisma.payer.findMany({
    include: { products: true, contacts: true },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(payers)
}

export async function POST(req: Request) {
  const { name } = await req.json()
  if (!name) return NextResponse.json({ error: 'Missing payer name' }, { status: 400 })

  const payer = await prisma.payer.create({ data: { name } })
  return NextResponse.json(payer)
}
