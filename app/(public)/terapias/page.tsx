import type { Metadata } from "next";
import Link from "next/link";
import {
  Flower2, Zap, TreePine, Moon, Waves, Sun,
  Clock, ArrowRight, CalendarCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terapias | TikkunKaruna",
  description:
    "Explora todas las terapias holísticas individuales disponibles. Reserva tu sesión online de forma rápida y segura.",
};

const services = [
  {
    Icon: Flower2,
    name: "Terapia 1",
    fullDesc:
      "Descripción completa de la Terapia 1. Aquí puedes explicar en qué consiste, cómo se desarrolla la sesión, qué beneficios aporta y para quién está especialmente indicada. [Pendiente de personalizar]",
    duration: "60 min",
    price: "XX €",
    tag: "Más solicitada",
    beneficios: ["Beneficio 1", "Beneficio 2", "Beneficio 3"],
  },
  {
    Icon: Zap,
    name: "Terapia 2",
    fullDesc:
      "Descripción completa de la Terapia 2. Detalla el método utilizado, el desarrollo de la sesión y los resultados esperados. [Pendiente de personalizar]",
    duration: "75 min",
    price: "XX €",
    tag: null,
    beneficios: ["Beneficio 1", "Beneficio 2", "Beneficio 3"],
  },
  {
    Icon: TreePine,
    name: "Terapia 3",
    fullDesc:
      "Descripción completa de la Terapia 3. Explica el proceso de la terapia, su base teórica y para qué tipo de situaciones o personas está indicada. [Pendiente de personalizar]",
    duration: "90 min",
    price: "XX €",
    tag: "Nueva",
    beneficios: ["Beneficio 1", "Beneficio 2", "Beneficio 3"],
  },
  {
    Icon: Moon,
    name: "Terapia 4",
    fullDesc:
      "Descripción completa de la Terapia 4. Indica qué trabaja esta terapia, cómo se desarrolla y qué puede esperar el cliente después de la sesión. [Pendiente de personalizar]",
    duration: "60 min",
    price: "XX €",
    tag: null,
    beneficios: ["Beneficio 1", "Beneficio 2", "Beneficio 3"],
  },
  {
    Icon: Waves,
    name: "Terapia 5",
    fullDesc:
      "Descripción completa de la Terapia 5. Describe el contexto en que surgió esta terapia y cómo puede ayudar a transformar bloqueos emocionales o físicos. [Pendiente de personalizar]",
    duration: "90 min",
    price: "XX €",
    tag: null,
    beneficios: ["Beneficio 1", "Beneficio 2", "Beneficio 3"],
  },
  {
    Icon: Sun,
    name: "Terapia 6",
    fullDesc:
      "Descripción completa de la Terapia 6. Explica el alcance de esta terapia, qué tipo de trabajo se realiza y qué sensaciones puede experimentar el cliente. [Pendiente de personalizar]",
    duration: "60 min",
    price: "XX €",
    tag: null,
    beneficios: ["Beneficio 1", "Beneficio 2", "Beneficio 3"],
  },
];

export default function TerapiasPage() {
  return (
    <>
      {/* ── Page hero ── */}
      <section className="bg-purple-950 pt-36 pb-20 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-700/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label mb-4">✦ Nuestras Terapias</p>
          <h1 className="font-heading text-5xl sm:text-6xl text-white mb-5">
            Un espacio de{" "}
            <span className="text-gradient-gold">sanación</span>{" "}
            individual
          </h1>
          <div className="gold-divider mb-6" />
          <p className="text-purple-300 text-lg max-w-2xl mx-auto font-body leading-relaxed">
            Cada terapia es un viaje único. Encuentra la que resuena
            contigo y da el primer paso hacia tu transformación.
          </p>
        </div>
      </section>

      {/* ── Services list ── */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {services.map(({ Icon, name, fullDesc, duration, price, tag, beneficios }, idx) => (
              <div
                key={name}
                className={`group grid grid-cols-1 lg:grid-cols-5 gap-8 bg-white border border-purple-100 rounded-3xl p-8 hover:border-gold-200 hover:shadow-xl hover:shadow-purple-100/40 transition-all duration-300`}
              >
                {/* Left: icon + meta */}
                <div className="lg:col-span-1 flex flex-col items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-purple-50 group-hover:bg-gold-50 flex items-center justify-center transition-colors duration-300">
                    <Icon size={28} className="text-purple-600 group-hover:text-gold-600 transition-colors duration-300" />
                  </div>
                  {tag && (
                    <span className="bg-gold-100 text-gold-700 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  )}
                  <div className="flex items-center gap-1.5 text-purple-500 text-sm font-body">
                    <Clock size={14} />
                    {duration}
                  </div>
                  <span className="font-heading text-3xl text-gold-600 font-medium">{price}</span>
                </div>

                {/* Center: description */}
                <div className="lg:col-span-3">
                  <h2 className="font-heading text-3xl text-purple-950 mb-3">{name}</h2>
                  <p className="text-purple-600 leading-relaxed font-body mb-5">{fullDesc}</p>
                  <div className="flex flex-wrap gap-2">
                    {beneficios.map((b) => (
                      <span
                        key={b}
                        className="flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-body px-3 py-1.5 rounded-full"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: CTA */}
                <div className="lg:col-span-1 flex flex-col items-start lg:items-end justify-center gap-3">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-purple-950 font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-gold-500/25 hover:-translate-y-px group"
                  >
                    <CalendarCheck size={15} />
                    Reservar
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <p className="text-purple-400 text-xs font-body">Sesión individual</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom note ── */}
      <section className="py-16 bg-white border-t border-purple-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-purple-500 text-sm font-body leading-relaxed">
            ¿No sabes qué terapia elegir?{" "}
            <Link href="/contacto" className="text-gold-600 hover:text-gold-500 font-semibold transition-colors">
              Escríbenos
            </Link>{" "}
            y te ayudamos a encontrar la más adecuada para ti.
          </p>
        </div>
      </section>
    </>
  );
}
