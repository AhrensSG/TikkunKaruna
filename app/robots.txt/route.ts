import { NextResponse } from 'next/server'

export async function GET() {
  const text = `User-agent: *
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/

Sitemap: https://tikkunkaruna.vercel.app/sitemap.xml
`

  return new NextResponse(text, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
