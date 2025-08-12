import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    console.warn('❌ No token found — redirecting to /login')
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
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

    // ✅ Super admin can access anything
    if (role === 'super_admin') {
      return NextResponse.next()
    }

    // ✅ For entity-based users, enforce path starts with /{entity}
    if (!entity || !pathname.startsWith(`/${entity}`)) {
      console.warn(
        `⛔ Access denied for role=${role}, path=${pathname}, expected prefix=/${entity}`
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
  ],
}

