import { auth } from '@/lib/auth.config'
import { NextResponse } from 'next/server'

export default auth((req) => {
  if (!req.auth && (
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/admin')
  )) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
})

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
