import Link from "next/link"
import LogoMark from "@/components/ui/LogoMark"
import { Sparkles, Leaf, Heart, Moon, Sun, ArrowRight, Star } from "lucide-react"

const services = [
  {
    icon: Leaf,
    title: "Reiki",
    description:
      "Canalización de energía universal para restaurar el equilibrio físico, emocional y espiritual.",
  },
  {
    icon: Heart,
    title: "Sanación Emocional",
    description:
      "Acompañamiento terapéutico para liberar bloqueos y sanar heridas del pasado.",
  },
  {
    icon: Moon,
    title: "Meditación Guiada",
    description:
      "Sesiones de meditación para conectar con tu interior y encontrar paz mental.",
  },
  {
    icon: Sun,
    title: "Terapia Energética",
    description:
      "Limpieza y armonización de campos energéticos para recuperar tu vitalidad.",
  },
]

const testimonials = [
  {
    name: "Ana M.",
    text: "Desde la primera sesión sentí una paz profunda. Inma tiene un don especial para conectar y sanar.",
  },
  {
    name: "Carlos R.",
    text: "Las terapias me ayudaron a superar una etapa muy difícil. Recomiendo TikkunKaruna de corazón.",
  },
  {
    name: "Laura G.",
    text: "Un espacio seguro donde he podido sanar heridas que arrastraba desde hace años. Gracias, Inma.",
  },
]

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950">
        {/* Ornamental background blobs */}
        <div
          aria-hidden
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-400/10 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-32">
          <div className="flex justify-center mb-8">
            <LogoMark size="xl" priority />
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
            Tikkun{" "}
            <span className="text-gradient-gold">Karuna</span>
          </h1>

          <p className="text-purple-200 text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            Un espacio de sanación, transformación y bienestar integral.
            Terapias holísticas individuales para reconectar con tu esencia.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-purple-950 font-semibold px-8 py-3.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-gold-500/30 hover:-translate-y-px text-base"
            >
              <Sparkles size={18} />
              Reserva tu cita
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-purple-200 hover:text-gold-400 border border-purple-600 hover:border-gold-500 px-8 py-3.5 rounded-full transition-all duration-200 text-base"
            >
              Conoce a Inma
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          aria-hidden
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-purple-400/60"
        >
          <span className="text-xs tracking-widest uppercase font-body">Descubre</span>
          <div className="w-5 h-8 border-2 border-purple-500/40 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-gold-500/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SERVICIOS
      ════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-label">Terapias</span>
            <h2 className="font-heading text-3xl sm:text-4xl text-purple-950 mt-3 mb-4">
              Terapias Holísticas
            </h2>
            <div className="gold-divider" />
            <p className="text-purple-600 mt-4 max-w-xl mx-auto font-body text-sm">
              Cada sesión está diseñada para acompañarte en tu proceso único de sanación y crecimiento personal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="group bg-white rounded-2xl p-6 border border-purple-100 hover:border-gold-400/50 shadow-sm hover:shadow-lg hover:shadow-purple-950/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-gold-600 mb-5 group-hover:bg-gold-100 group-hover:text-gold-700 transition-colors duration-300">
                  <Icon size={22} />
                </div>
                <h3 className="font-heading text-lg text-purple-950 mb-2">{title}</h3>
                <p className="text-purple-600 text-sm leading-relaxed font-body">
                  {description}
                </p>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-500 font-semibold text-sm transition-colors font-body"
            >
              Ver todas las terapias
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SOBRE INMA
      ════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visual placeholder — se puede reemplazar por una foto */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-200 to-purple-100 flex items-center justify-center">
              <div className="text-center">
                <LogoMark size="lg" />
                <p className="mt-4 text-purple-400 text-xs font-body">Foto de Inma</p>
              </div>
            </div>

            <div>
              <span className="section-label">Sobre Inma</span>
              <h2 className="font-heading text-3xl sm:text-4xl text-purple-950 mt-3 mb-6">
                Tu guía en el camino de sanación
              </h2>
              <div className="gold-divider mb-6" style={{ margin: "0 0 1.5rem" }} />
              <div className="space-y-4 text-purple-700 font-body text-sm leading-relaxed">
                <p>
                  Inma es terapeuta holística con más de 10 años de experiencia
                  acompañando a personas en su proceso de sanación emocional y energética.
                </p>
                <p>
                  Formada en Reiki Usui, Sanación Emocional, Meditación Guiada y
                  diversas técnicas de terapia energética, su enfoque integrador
                  combina sabiduría ancestral con un profundo respeto por el proceso
                  individual de cada persona.
                </p>
                <p>
                  Su propósito es crear un espacio seguro donde puedas reconectar
                  contigo mismo y encontrar el equilibrio que necesitas.
                </p>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 mt-6 text-gold-600 hover:text-gold-500 font-semibold text-sm transition-colors font-body"
              >
                Conoce más sobre Inma
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIOS
      ════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-label">Testimonios</span>
            <h2 className="font-heading text-3xl sm:text-4xl text-purple-950 mt-3 mb-4">
              Lo que dicen de nosotros
            </h2>
            <div className="gold-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(({ name, text }) => (
              <figure
                key={name}
                className="bg-white rounded-2xl p-8 border border-purple-100 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-gold-500 fill-gold-500" />
                  ))}
                </div>
                <blockquote className="text-purple-700 text-sm leading-relaxed font-body mb-6">
                  &ldquo;{text}&rdquo;
                </blockquote>
                <figcaption className="font-heading text-purple-950 text-sm">
                  — {name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA FINAL
      ════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gold-500/5 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <LogoMark size="md" />
          <h2 className="font-heading text-3xl sm:text-4xl text-white mt-8 mb-4">
            Comienza tu viaje de sanación
          </h2>
          <p className="text-purple-200 text-base sm:text-lg max-w-lg mx-auto mb-10 font-body">
            Da el primer paso hacia tu bienestar. Reserva tu primera sesión y descubre
            el poder transformador de las terapias holísticas.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-purple-950 font-semibold px-8 py-3.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-gold-500/30 hover:-translate-y-px text-base"
          >
            <Sparkles size={18} />
            Reserva tu cita ahora
          </Link>
        </div>
      </section>
    </>
  )
}
