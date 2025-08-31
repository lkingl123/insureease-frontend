// src/app/api/me/route.ts

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
    include: { entity: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      entity: user.entity
        ? {
            id: user.entity.id,
            name: user.entity.name,
            slug: user.entity.slug,
          }
        : null,
    },
  })
}
