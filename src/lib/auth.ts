// lib/auth.ts
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET!

// ✅ Strongly typed roles
export type Role = 'super_admin' | 'entity_admin' | 'cred_specialist' | 'provider'

export type UserPayload = {
  userId: string
  email: string
  role: Role
  entity?: string
}

/**
 * ✅ For server components or API routes.
 * Extracts the token from cookies and returns user payload.
 */
export async function getUserFromToken(): Promise<UserPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    console.warn('❌ No token found in cookies')
    return null
  }

  return await verifyToken(token)
}

/**
 * ✅ Shared JWT verifier.
 * Use this in middleware (you provide the token yourself).
 */
export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    )
    return payload as UserPayload
  } catch (err) {
    console.error('❌ JWT verification failed:', err)
    return null
  }
}
