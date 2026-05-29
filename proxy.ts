export { auth as proxy } from '@/lib/auth.config'

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
