import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function hasSessionCookie(req: NextRequest): boolean {
  const cookies = req.cookies.getAll()
  return cookies.some((c) =>
    c.name.startsWith('__Secure-authjs.session-token') ||
    c.name.startsWith('authjs.session-token')
  )
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const loggedIn = hasSessionCookie(req)

  if (!loggedIn && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (!loggedIn && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
