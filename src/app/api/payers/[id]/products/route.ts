import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { name } = await req.json()
  const payerId = params.id

  if (!name || !payerId) {
    return NextResponse.json({ error: 'Missing name or payerId' }, { status: 400 })
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        payerId,
      },
    })

    return NextResponse.json(newProduct)
  } catch (error) {
    console.error('❌ Failed to create product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
