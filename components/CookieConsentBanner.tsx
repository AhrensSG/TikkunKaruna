'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const CONSENT_COOKIE = 'tikkun_cookie_consent'
const COUNTRY_COOKIE = 'tikkun_country'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const consent = getCookie(CONSENT_COOKIE)
    if (!consent) setVisible(true)
  }, [])

  async function handleAccept() {
    setLoading(true)
    setCookie(CONSENT_COOKIE, 'accepted', 365)
    try {
      const res = await fetch('https://ipapi.co/json/')
      const data = await res.json()
      const country = data.country_code === 'ES' ? 'ES' : 'OTHER'
      setCookie(COUNTRY_COOKIE, country, 365)
    } catch {
      setCookie(COUNTRY_COOKIE, 'OTHER', 365)
    }
    setLoading(false)
    setVisible(false)
  }

  function handleReject() {
    setCookie(CONSENT_COOKIE, 'rejected', 365)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow-2xl border border-purple-100 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 text-sm text-purple-700">
          <p>
            Este sitio web utiliza cookies.{' '}
            <Link href="/cookies" className="text-gold-600 hover:text-gold-500 underline whitespace-nowrap">
            Más información
            </Link>
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            Rechazar
          </button>
          <button
            onClick={handleAccept}
            disabled={loading}
            className="px-5 py-2 text-sm text-white bg-gold-600 hover:bg-gold-500 rounded-full font-medium transition-colors disabled:opacity-50"
          >
            {loading ? '...' : 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  )
}
