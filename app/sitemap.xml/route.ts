import { NextResponse } from 'next/server'

const BASE_URL = 'https://tikkunkaruna.vercel.app'

const routes = [
  { path: '/', priority: '1.0', freq: 'daily' },
  { path: '/terapias', priority: '0.9', freq: 'weekly' },
  { path: '/sobre-nosotros', priority: '0.8', freq: 'weekly' },
  { path: '/contacto', priority: '0.7', freq: 'monthly' },
  { path: '/aviso-legal', priority: '0.3', freq: 'monthly' },
  { path: '/privacidad', priority: '0.3', freq: 'monthly' },
  { path: '/cookies', priority: '0.3', freq: 'monthly' },
  { path: '/terminos', priority: '0.3', freq: 'monthly' },
]

export async function GET() {
  const urls = routes
    .map(
      (r) => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <changefreq>${r.freq}</changefreq>
    <priority>${r.priority}</priority>
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
