import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET!

export async function middleware(req: NextRequest) {
   const pathname = req.nextUrl.pathname
   
   if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/api/accept-invite') 
  ) {
    return NextResponse.next()
  }

  const token = req.cookies.get('token')?.value

  if (!token) {
    console.warn('❌ No token found — redirecting to /login')
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    ) as {
      payload: {
        userId: string
        email: string
        role: string
        entity?: string
      }
    }

    const { role, entity } = payload
    const pathname = req.nextUrl.pathname

    // ✅ Allow super_admin to access everything
    if (role === 'super_admin') {
      return NextResponse.next()
    }

    // ✅ Entity-scoped users can only access paths under their entity slug
    if (!entity || !pathname.startsWith(`/${entity}`)) {
      console.warn(
        `⛔ Access denied: role=${role}, path=${pathname}, expected prefix=/${entity}`
      )
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    return NextResponse.next()
  } catch (err) {
    console.error('❌ JWT verification failed:', err)
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: [
    '/super/dashboard/:path*',
    '/:entity/dashboard/:path*',
    '/api/:path*', // ✅ Protects all API routes too
  ],
}
