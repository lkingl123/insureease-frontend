import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

export async function POST() {
  const res = NextResponse.json({ message: 'Logged out' })

  // Clear the token cookie
  res.headers.set(
    'Set-Cookie',
    serialize('token', '', {
      httpOnly: true,
      secure: false, // true in prod
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
    })
  )

  return res
}
