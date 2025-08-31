// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/guards'
import type { UserPayload } from '@/lib/auth'

// GET /api/users
export async function GET(req: NextRequest) {
  const user = await authorize(req)
  if (!(user as UserPayload).role) return user

  if (!['super_admin', 'entity_admin'].includes((user as UserPayload).role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const users = await prisma.user.findMany({
      where: { role: { not: 'super_admin' } },
      orderBy: { createdAt: 'desc' },
      include: { entity: true },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error('❌ Failed to fetch users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

// DELETE /api/users
export async function DELETE(req: NextRequest) {
  const user = await authorize(req)
  if (!(user as UserPayload).role) return user

  if (!['super_admin', 'entity_admin'].includes((user as UserPayload).role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })

    const target = await prisma.user.findUnique({ where: { id } })
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (target.role === 'super_admin') {
      return NextResponse.json({ error: 'Cannot delete super_admin' }, { status: 403 })
    }

    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ message: 'User deleted' })
  } catch (err) {
    console.error('❌ Delete error:', err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}

// PATCH /api/users
export async function PATCH(req: NextRequest) {
  const user = await authorize(req)
  if (!(user as UserPayload).role) return user

  if (!['super_admin', 'entity_admin'].includes((user as UserPayload).role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id, newStatus } = await req.json()
    if (!id || !newStatus) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const target = await prisma.user.findUnique({ where: { id } })
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (target.role === 'super_admin') {
      return NextResponse.json({ error: 'Cannot modify super_admin' }, { status: 403 })
    }

    await prisma.user.update({
      where: { id },
      data: { status: newStatus },
    })

    return NextResponse.json({ message: 'Status updated' })
  } catch (err) {
    console.error('❌ Patch error:', err)
    return NextResponse.json({ error: 'Status update failed' }, { status: 500 })
  }
}
