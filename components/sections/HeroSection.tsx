import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";
import LogoMark from "@/components/ui/LogoMark";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-purple-950">
      {/* ── Decorative background blobs ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
      >
        {/* Top-right large glow */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-purple-700/20 blur-3xl" />
        {/* Bottom-left glow */}
        <div className="absolute -bottom-40 -left-24 w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-3xl" />
        {/* Center gold accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gold-500/5 blur-3xl" />
        {/* Decorative top dot grid */}
        <svg
          className="absolute top-20 left-10 opacity-10"
          width="200"
          height="200"
          fill="none"
        >
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 6 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={col * 30 + 15}
                cy={row * 30 + 15}
                r="1.5"
                fill="#c9a227"
              />
            ))
          )}
        </svg>
        {/* Decorative bottom-right dot grid */}
        <svg
          className="absolute bottom-24 right-10 opacity-10"
          width="200"
          height="200"
          fill="none"
        >
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 6 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={col * 30 + 15}
                cy={row * 30 + 15}
                r="1.5"
                fill="#c9a227"
              />
            ))
          )}
        </svg>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 py-24 sm:py-32">
        {/* Logo */}
        <div className="mb-8">
          <LogoMark size="xl" priority />
        </div>

        {/* Label */}
        <p className="section-label mb-6 tracking-[0.3em]">
          ✦ Péndulo Hebreo y Reiki by Inma ✦
        </p>

        {/* Headline */}
        <h1 className="font-heading text-5xl sm:text-6xl lg:text-8xl font-light text-white leading-none mb-3 max-w-4xl">
          Sana.{" "}
          <span className="text-gradient-gold font-normal">Transforma.</span>
        </h1>
        <h1 className="font-heading text-5xl sm:text-6xl lg:text-8xl font-light text-white leading-none mb-8 max-w-4xl">
          Reconecta.
        </h1>

        {/* Gold divider */}
        <div className="gold-divider mb-8" />

        {/* Subtitle */}
        <p className="text-purple-200 text-lg sm:text-xl max-w-2xl leading-relaxed mb-12 font-body font-light">
          Un espacio de bienestar integral donde cada sesión es un paso
          hacia tu mejor versión. Cuando la energía fluye en armonía
          encontramos claridad, equilibrio y paz interior.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/terapias"
            className="inline-flex items-center gap-3 bg-gold-500 hover:bg-gold-400 text-purple-950 font-semibold text-base px-8 py-4 rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/30 hover:-translate-y-1 group"
          >
            <CalendarCheck size={18} />
            Reservar mi sesión
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/sobre-nosotros"
            className="inline-flex items-center gap-2 border-2 border-purple-500 text-purple-200 hover:border-gold-500 hover:text-gold-400 font-medium text-base px-8 py-4 rounded-full transition-all duration-300"
          >
            Conocer a Inma
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-16 text-purple-400 text-xs font-body tracking-wide">
          {[
            "✦ Reserva online 24/7",
            "✦ Pago seguro con Stripe",
            "✦ Confirmación por WhatsApp",
          ].map((badge) => (
            <span key={badge}>{badge}</span>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-purple-400 text-xs tracking-widest font-body uppercase">
          Descubrir
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-purple-400 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
