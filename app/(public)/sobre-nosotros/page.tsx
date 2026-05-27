import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Star, Leaf, ArrowRight, BookOpen, Award } from "lucide-react";
import LogoMark from "@/components/ui/LogoMark";

export const metadata: Metadata = {
  title: "Sobre Inma | TikkunKaruna",
  description:
    "Conoce a Inma, terapeuta holística detrás de TikkunKaruna. Su historia, formación y filosofía de trabajo.",
};

const formacion = [
  { year: "20XX", title: "Formación 1", institution: "Instituto / Centro pendiente" },
  { year: "20XX", title: "Formación 2", institution: "Instituto / Centro pendiente" },
  { year: "20XX", title: "Formación 3", institution: "Instituto / Centro pendiente" },
  { year: "20XX", title: "Formación 4", institution: "Instituto / Centro pendiente" },
];

const valores = [
  {
    Icon: Heart,
    title: "Amor y respeto",
    desc: "Cada persona llega a su propio ritmo. Acompañamos sin juzgar, con amor y pleno respeto a cada proceso.",
  },
  {
    Icon: Star,
    title: "Excelencia profesional",
    desc: "Formación continua y compromiso con las mejores prácticas en el campo de las terapias holísticas.",
  },
  {
    Icon: Leaf,
    title: "Enfoque holístico",
    desc: "Trabajamos el ser humano en su totalidad: cuerpo, mente y espíritu, de forma integrada.",
  },
  {
    Icon: BookOpen,
    title: "Aprendizaje continuo",
    desc: "La curiosidad y el estudio permanente son pilares fundamentales de nuestro trabajo.",
  },
  {
    Icon: Award,
    title: "Compromiso ético",
    desc: "Confidencialidad, honestidad y ética profesional en cada sesión y cada relación terapéutica.",
  },
];

export default function SobreNosotrosPage() {
  return (
    <>
      {/* ── Page hero ── */}
      <section className="bg-purple-950 pt-36 pb-20 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-700/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label mb-4">✦ Sobre Inma</p>
          <h1 className="font-heading text-5xl sm:text-6xl text-white mb-5">
            El corazón de{" "}
            <span className="text-gradient-gold">TikkunKaruna</span>
          </h1>
          <div className="gold-divider mb-6" />
          <p className="text-purple-300 text-lg max-w-xl mx-auto font-body leading-relaxed">
            Una historia de transformación personal convertida en
            vocación de acompañar a otros en su camino.
          </p>
        </div>
      </section>

      {/* ── Bio section ── */}
      <section className="py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-purple-100 to-gold-100/30 -z-10" />
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-800 to-purple-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 text-center px-8">
                  <LogoMark size="lg" />
                  <p className="font-heading text-2xl text-white/60 font-light italic">
                    &ldquo;Fotografía de Inma&rdquo;
                  </p>
                  <p className="text-purple-400 text-xs font-body tracking-wide">
                    Imagen pendiente de añadir
                  </p>
                </div>
                <div className="absolute bottom-6 right-6 w-16 h-16 rounded-full border border-gold-500/30" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl shadow-purple-100/60 px-6 py-4 border border-purple-100">
                <p className="section-label mb-1">Terapeuta holística</p>
                <p className="font-heading text-2xl text-purple-900 font-medium">Inma</p>
              </div>
            </div>

            {/* Bio content */}
            <div>
              <p className="section-label mb-4">✦ Mi historia</p>
              <h2 className="font-heading text-4xl sm:text-5xl text-purple-950 leading-tight mb-6">
                Un camino de{" "}
                <span className="text-gradient-gold">sanación</span>{" "}
                con corazón
              </h2>
              <div className="gold-divider mb-8" style={{ margin: "0 0 2rem" }} />

              <div className="space-y-4 text-purple-700 leading-relaxed font-body mb-8">
                <p>
                  Hola, soy Inma. Mi camino hacia las terapias holísticas nació
                  de una búsqueda personal profunda: la necesidad de encontrar
                  herramientas que trabajaran el ser humano en su totalidad,
                  más allá del síntoma. [Texto pendiente de personalizar]
                </p>
                <p>
                  A lo largo de los años he integrado diversas disciplinas que
                  confluyen en un método propio, amoroso y respetuoso, siempre
                  orientado a acompañar a cada persona en su proceso único de
                  transformación. [Texto pendiente de personalizar]
                </p>
                <p>
                  TikkunKaruna —que en hebreo y sánscrito evoca la sanación y
                  la compasión— es mucho más que un proyecto profesional: es
                  la materialización de una misión de vida. [Texto pendiente de personalizar]
                </p>
              </div>

              <blockquote className="border-l-2 border-gold-500 pl-5 mb-8">
                <p className="font-heading text-xl text-purple-800 italic leading-snug">
                  &ldquo;No vengo a darte respuestas. Vengo a ayudarte a encontrarlas.&rdquo;
                </p>
                <footer className="mt-2 text-sm text-purple-500 font-body">— Inma</footer>
              </blockquote>

              <Link
                href="/terapias"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-purple-950 font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-gold-500/25"
              >
                Ver mis terapias
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Formación ── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-label mb-4">✦ Formación</p>
            <h2 className="font-heading text-4xl sm:text-5xl text-purple-950 mb-5">
              Mi{" "}
              <span className="text-gradient-gold">trayectoria</span>
            </h2>
            <div className="gold-divider" />
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-200 via-gold-300/40 to-purple-200" />

            <div className="space-y-8">
              {formacion.map(({ year, title, institution }, idx) => (
                <div
                  key={idx}
                  className={`relative flex items-center gap-6 ${idx % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${idx % 2 === 0 ? "sm:text-right" : "sm:text-left"} pl-16 sm:pl-0`}>
                    <div className="bg-white border border-purple-100 rounded-2xl p-5 hover:border-gold-200 hover:shadow-md transition-all">
                      <span className="section-label block mb-1">{year}</span>
                      <h3 className="font-heading text-xl text-purple-950 mb-1">{title}</h3>
                      <p className="text-purple-500 text-sm font-body">{institution}</p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 w-5 h-5 rounded-full border-2 border-gold-400 bg-white shadow-sm shadow-gold-200 z-10" />

                  {/* Spacer */}
                  <div className="flex-1 hidden sm:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Valores ── */}
      <section className="py-24 bg-purple-950 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-700/20 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-label mb-4">✦ Mis valores</p>
            <h2 className="font-heading text-4xl sm:text-5xl text-white mb-5">
              Lo que me{" "}
              <span className="text-gradient-gold">guía</span>
            </h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {valores.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 bg-purple-900/50 hover:bg-purple-900/80 border border-purple-800/60 hover:border-gold-500/40 rounded-2xl p-6 transition-all duration-300"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-purple-800 flex items-center justify-center">
                  <Icon size={18} className="text-gold-400" />
                </div>
                <div>
                  <h3 className="font-body font-semibold text-white mb-1.5 text-sm">{title}</h3>
                  <p className="text-purple-400 text-sm leading-relaxed font-body">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
