// src/app/api/entities/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET - fetch entities
export async function GET() {
  const entities = await prisma.entity.findMany({
    orderBy: { createdAt: 'desc' },
    include: { users: true },
  })
  return NextResponse.json(entities)
}

// DELETE - remove entity
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'Missing entity ID' }, { status: 400 })
    }

    await prisma.entity.delete({ where: { id } })

    return NextResponse.json({ message: 'Entity deleted successfully' })
  } catch (error) {
    console.error('❌ Failed to delete entity:', error)
    return NextResponse.json({ error: 'Failed to delete entity' }, { status: 500 })
  }
}


// EDIT - update entity
export async function PATCH(req: Request) {
  try {
    const { id, name, slug } = await req.json()
    if (!id || !name || !slug) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await prisma.entity.update({
      where: { id },
      data: { name, slug },
    })

    return NextResponse.json({ message: 'Entity updated successfully' })
  } catch (error) {
    console.error('❌ Failed to update entity:', error)
    return NextResponse.json({ error: 'Failed to update entity' }, { status: 500 })
  }
}

