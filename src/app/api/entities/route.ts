import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/guards'
import { NextResponse } from 'next/server'

// GET - super admin only
export async function GET(req: Request) {
  const user = await authorize(req)
  if ('error' in user) return user

  const entities = await prisma.entity.findMany({
    orderBy: { createdAt: 'desc' },
    include: { users: true },
  })
  return NextResponse.json(entities)
}

// DELETE - super admin only
export async function DELETE(req: Request) {
  const user = await authorize(req)
  if ('error' in user) return user

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

// PATCH - super admin only
export async function PATCH(req: Request) {
  const user = await authorize(req)
  if ('error' in user) return user

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
