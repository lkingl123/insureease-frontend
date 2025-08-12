import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import type { UserPayload } from '@/lib/auth'

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { entity: true },
  })

  if (!user || user.status !== 'active') {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const payload: UserPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    entity: user.role === 'super_admin' ? undefined : user.entity?.slug,
  }

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })

  const response = NextResponse.json({
    message: 'Login successful',
    role: payload.role,
    entity: payload.entity,
  })

  response.headers.set(
    'Set-Cookie',
    serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    })
  )

  return response
}
