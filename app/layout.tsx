import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = "https://tikkunkaruna.vercel.app"

export const metadata: Metadata = {
  title: {
    default: "TikkunKaruna | Terapias Holísticas · Reiki · Péndulo — Reserva Online",
    template: "%s | TikkunKaruna",
  },
  description:
    "Reserva tu terapia holística online con Inma: Reiki, Péndulo, Armonización de Chakras y más. Espacio seguro, resultados reales. ¡Primera sesión disponible hoy!",
  keywords: [
    "terapias holísticas",
    "Reiki",
    "Péndulo Hebreo",
    "sanación energética",
    "bienestar",
    "TikkunKaruna",
    "Inma",
    "reservas online",
    "Valencia",
  ],
  openGraph: {
    title: "TikkunKaruna | Terapias Holísticas",
    description:
      "Reserva tu sesión online. Reiki, Péndulo, Armonización de Chakras y más.",
    url: BASE_URL,
    siteName: "TikkunKaruna",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TikkunKaruna | Terapias Holísticas",
    description:
      "Reserva tu sesión online. Reiki, Péndulo y más.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "TikkunKaruna",
      description: "Terapias holísticas personalizadas — Reiki, Péndulo Hebreo, Armonización de Chakras",
      url: BASE_URL,
      email: "hola@tikkunkaruna.com",
      telephone: "+34 620 89 75 29",
      priceRange: "€€",
      serviceArea: "España",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Valencia",
        addressCountry: "ES",
      },
      sameAs: [
        "https://instagram.com/@tikkunkaruna",
        "https://facebook.com/@tikkunkaruna",
      ],
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${cormorantGaramond.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
