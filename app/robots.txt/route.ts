import { NextResponse } from 'next/server'

export async function GET() {
  const text = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /reservar/
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password

Sitemap: https://tikkunkaruna.vercel.app/sitemap.xml
`

  return new NextResponse(text, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
