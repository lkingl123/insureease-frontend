// src/app/api/login/route.ts
import { PrismaClient, Role } from '@prisma/client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      userRoles: {
        include: { entity: true },
      },
    },
  })

  if (!user || user.status !== 'active') {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  if (!user.userRoles.length) {
    return NextResponse.json({ error: 'User has no roles' }, { status: 403 })
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const { role, entity } = user.userRoles[0]

  const payload = {
    userId: user.id,
    email: user.email,
    role,
    entity: entity?.slug ?? null,
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' })

  const response = NextResponse.json({
    message: 'Login successful',
    role,
    entity: payload.entity,
  })

  response.headers.set(
    'Set-Cookie',
    serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    })
  )

  return response
}
