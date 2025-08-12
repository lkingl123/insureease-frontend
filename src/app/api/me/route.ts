import { NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const userPayload = await getUserFromToken()

  if (!userPayload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userPayload.userId },
    include: {
      userRoles: {
        include: { entity: true },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const role = user.userRoles?.[0]?.role ?? null
  const entity = user.userRoles?.[0]?.entity ?? null

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role,
      entity: entity
        ? {
            id: entity.id,
            name: entity.name,
            slug: entity.slug,
          }
        : null,
    },
  })
}
