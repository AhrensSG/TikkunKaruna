import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Leaf, ArrowRight, BookOpen, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre Inma | TikkunKaruna",
  description:
    "Conoce a Inma, terapeuta holística detrás de TikkunKaruna. Su historia, formación y filosofía de trabajo.",
};

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
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src="/inma.jpeg"
                  alt="Inma — Terapeuta holística"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/40 via-transparent to-transparent" />
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
                  Hola, soy Inma. Mi camino hacia las terapias holísticas nació mucho antes de que
                  conociera palabras como Reiki, energía o bioreprogramación. Desde niña percibía la
                  vida de una forma diferente. Sentía emociones, ambientes y presencias sutiles que
                  para mí eran naturales, pero que no siempre eran comprendidas por quienes me rodeaban.
                </p>
                <p>
                  Durante muchos años pensé que había algo extraño en mí. Crecí intentando encajar,
                  cuestionando constantemente lo que sentía y tratando de ignorar una sensibilidad que
                  parecía no tener explicación. Esa lucha interna me acompañó especialmente durante la
                  adolescencia, una etapa en la que me sentí incomprendida y desconectada de quien
                  realmente era.
                </p>
                <p>
                  Con el tiempo comprendí que aquello que había intentado esconder no era un problema,
                  sino una capacidad que necesitaba entender. Comencé una búsqueda profunda para
                  descubrir qué era aquello que percibía, estudiando distintas disciplinas relacionadas
                  con la energía, la conciencia y el bienestar integral.
                </p>
                <p>
                  A lo largo de los años he integrado diversas enseñanzas y experiencias que confluyen
                  en un método propio, cercano y respetuoso, siempre orientado a acompañar a cada
                  persona en su proceso único de transformación. Mi propósito no es decirle a nadie
                  qué debe creer, sino ofrecer un espacio seguro donde pueda escucharse, comprenderse
                  y reconectar consigo mismo.
                </p>
                <p>
                  TikkunKaruna —que en hebreo y sánscrito evoca la sanación y la compasión— es mucho
                  más que un proyecto profesional: es la materialización de una misión de vida. El
                  resultado de un camino que comenzó con una niña que se sentía diferente y que, con
                  el tiempo, descubrió que precisamente en esa diferencia se encontraba su mayor regalo.
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
