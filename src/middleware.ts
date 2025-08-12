import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET)) as {
      payload: {
        userId: string
        email: string
        role: string
        entity?: string
      }
    }

    const { role, entity } = payload
    const pathname = req.nextUrl.pathname

    // Allow super_admin to access anything
    if (role === 'super_admin') {
      return NextResponse.next()
    }

    // If not super_admin, ensure the path starts with their entity slug
    if (!entity || !pathname.startsWith(`/${entity}`)) {
      console.warn(`Access denied for ${role} to path ${pathname}, expected /${entity}`)
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    return NextResponse.next()
  } catch (err) {
    console.error('Invalid token:', err)
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: [
    '/super/dashboard/:path*',
    '/:entity/dashboard/:path*', // Dynamic matcher for entity-specific dashboards
  ],
}
