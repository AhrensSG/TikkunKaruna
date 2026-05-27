import Link from "next/link";
import { CalendarCheck, ArrowRight } from "lucide-react";
import LogoMark from "@/components/ui/LogoMark";

export default function CtaBanner() {
  return (
    <section className="relative py-24 lg:py-32 bg-purple-950 overflow-hidden">
      {/* Decorative background */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-purple-700/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold-500/10 blur-3xl" />
        {/* Gold line decorations */}
        <div className="absolute top-8 left-8 w-24 h-px bg-gradient-to-r from-transparent to-gold-500/30" />
        <div className="absolute bottom-8 right-8 w-24 h-px bg-gradient-to-l from-transparent to-gold-500/30" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <LogoMark size="lg" />
        </div>

        {/* Label */}
        <p className="section-label mb-5">✦ Comienza tu transformación</p>

        {/* Headline */}
        <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-white font-light mb-6 leading-tight">
          ¿Lista para tu{" "}
          <span className="text-gradient-gold">primera sesión</span>?
        </h2>

        {/* Divider */}
        <div className="gold-divider mb-8" />

        {/* Subtitle */}
        <p className="text-purple-300 text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-body font-light">
          Da el primer paso hacia tu bienestar integral. Reserva ahora,
          elige tu horario y recibirás confirmación instantánea.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/terapias"
            className="inline-flex items-center gap-3 bg-gold-500 hover:bg-gold-400 text-purple-950 font-semibold text-base px-10 py-4 rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/30 hover:-translate-y-1 group"
          >
            <CalendarCheck size={18} />
            Reservar mi primera sesión
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 border border-purple-600 hover:border-gold-500/60 text-purple-300 hover:text-gold-400 font-medium text-base px-8 py-4 rounded-full transition-all duration-300"
          >
            Tengo una pregunta
          </Link>
        </div>

        {/* Micro-trust */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-purple-500 text-xs font-body tracking-wide">
          {["✦ Sin permanencia", "✦ Cancela cuando quieras", "✦ Factura automática"].map(
            (t) => (
              <span key={t}>{t}</span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
