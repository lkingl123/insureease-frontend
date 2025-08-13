import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const entities = await prisma.entity.findMany({
    orderBy: { createdAt: 'desc' },
    include: { users: true }, // Required for EntityWithUsers type
  })

  return NextResponse.json(entities)
}
