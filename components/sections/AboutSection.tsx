import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Star, Leaf } from "lucide-react";

const highlights = [
  { Icon: Heart, label: "Vocación genuina", desc: "Cada sesión, un compromiso real con tu bienestar." },
  { Icon: Star, label: "Método propio", desc: "Un enfoque integrador que aúna distintas disciplinas." },
  { Icon: Leaf, label: "Espacio seguro", desc: "Confidencialidad, respeto y cuidado en cada encuentro." },
];

export default function AboutSection() {
  return (
    <section className="py-24 lg:py-32 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: image / visual ── */}
          <div className="relative order-2 lg:order-1">
            {/* Decorative frame */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-purple-100 to-gold-100/30 -z-10" />
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/inma.jpeg"
                alt="Inma — Terapeuta holística"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/40 via-transparent to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl shadow-purple-100/60 px-6 py-4 border border-purple-100">
              <p className="section-label mb-1">Terapeuta certificada</p>
              <p className="font-heading text-2xl text-purple-900 font-medium">Inma</p>
            </div>
          </div>

          {/* ── Right: content ── */}
          <div className="order-1 lg:order-2">
            <p className="section-label mb-4">✦ Sobre Inma</p>
            <h2 className="font-heading text-4xl sm:text-5xl text-purple-950 leading-tight mb-6">
              Un camino de{" "}
              <span className="text-gradient-gold">sanación</span>{" "}
              con corazón
            </h2>
            <div className="gold-divider mb-8" style={{ margin: "0 0 2rem" }} />

            <p className="text-purple-800 leading-relaxed mb-5 font-body">
              Hola, soy Inma. Mi camino hacia las terapias holísticas nació de
              una búsqueda personal profunda: la necesidad de encontrar
              herramientas que trabajaran el ser humano en su totalidad, más
              allá del síntoma.
            </p>
            <p className="text-purple-700 leading-relaxed mb-8 font-body">
              A lo largo de los años he integrado diversas disciplinas que
              confluyen en un método propio, amoroso y respetuoso, siempre
              orientado a acompañar a cada persona en su proceso único de
              transformación.
            </p>

            {/* Quote */}
            <blockquote className="border-l-2 border-gold-500 pl-5 mb-10">
              <p className="font-heading text-xl text-purple-800 italic leading-snug">
                &ldquo;No vengo a darte respuestas. Vengo a ayudarte a
                encontrarlas.&rdquo;
              </p>
              <footer className="mt-2 text-sm text-purple-500 font-body">— Inma</footer>
            </blockquote>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {highlights.map(({ Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex flex-col items-start gap-2 p-4 rounded-xl bg-white border border-purple-100 hover:border-gold-200 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Icon size={18} className="text-gold-600" />
                  </div>
                  <p className="font-body font-semibold text-purple-900 text-sm">{label}</p>
                  <p className="font-body text-purple-500 text-xs leading-snug">{desc}</p>
                </div>
              ))}
            </div>

            <Link
              href="/sobre-nosotros"
              className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-500 font-semibold text-sm font-body transition-colors group"
            >
              Conocer más sobre Inma
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
