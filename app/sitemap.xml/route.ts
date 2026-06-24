import { NextResponse } from 'next/server'

const BASE_URL = 'https://tikkunkaruna.vercel.app'

const routes = [
  '/',
  '/terapias',
  '/sobre-nosotros',
  '/contacto',
  '/aviso-legal',
  '/privacidad',
  '/cookies',
  '/terminos',
  '/login',
  '/register',
  '/forgot-password',
]

export async function GET() {
  const urls = routes
    .map(
      (route) => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
