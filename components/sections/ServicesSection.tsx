import Link from "next/link";
import {
  Flower2, Zap, TreePine, Moon, Waves, Sun,
  Clock, ArrowRight,
} from "lucide-react";

const services = [
  {
    Icon: Flower2,
    name: "Terapia 1",
    shortDesc:
      "Descripción breve de la terapia. Un espacio de sanación para el cuerpo y la mente.",
    duration: "60 min",
    price: "XX €",
    tag: "Más solicitada",
  },
  {
    Icon: Zap,
    name: "Terapia 2",
    shortDesc:
      "Descripción breve de la terapia. Trabaja el equilibrio energético profundo.",
    duration: "75 min",
    price: "XX €",
    tag: null,
  },
  {
    Icon: TreePine,
    name: "Terapia 3",
    shortDesc:
      "Descripción breve de la terapia. Un proceso de reconexión con tu esencia.",
    duration: "90 min",
    price: "XX €",
    tag: "Nueva",
  },
  {
    Icon: Moon,
    name: "Terapia 4",
    shortDesc:
      "Descripción breve de la terapia. Para liberar cargas emocionales y patrones.",
    duration: "60 min",
    price: "XX €",
    tag: null,
  },
  {
    Icon: Waves,
    name: "Terapia 5",
    shortDesc:
      "Descripción breve de la terapia. Un viaje de introspección guiada.",
    duration: "90 min",
    price: "XX €",
    tag: null,
  },
  {
    Icon: Sun,
    name: "Terapia 6",
    shortDesc:
      "Descripción breve de la terapia. Limpieza y reequilibrio energético completo.",
    duration: "60 min",
    price: "XX €",
    tag: null,
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label mb-4">✦ Nuestras Terapias</p>
          <h2 className="font-heading text-4xl sm:text-5xl text-purple-950 mb-5">
            Un espacio de{" "}
            <span className="text-gradient-gold">sanación</span>{" "}
            y transformación
          </h2>
          <div className="gold-divider mb-6" />
          <p className="text-purple-600 text-base max-w-xl mx-auto font-body leading-relaxed">
            Cada terapia está diseñada para atender tus necesidades de
            forma individual. Elige la que resuene contigo y reserva tu
            sesión en minutos.
          </p>
        </div>

        {/* Service cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map(({ Icon, name, shortDesc, duration, price, tag }) => (
            <div
              key={name}
              className="group relative flex flex-col bg-white border border-purple-100 rounded-2xl p-7 hover:border-gold-300 hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Tag */}
              {tag && (
                <span className="absolute top-5 right-5 bg-gold-100 text-gold-700 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              )}

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-purple-50 group-hover:bg-gold-50 flex items-center justify-center mb-5 transition-colors duration-300">
                <Icon size={22} className="text-purple-600 group-hover:text-gold-600 transition-colors duration-300" />
              </div>

              {/* Content */}
              <h3 className="font-heading text-2xl text-purple-950 mb-2">{name}</h3>
              <p className="text-purple-600 text-sm leading-relaxed font-body flex-1 mb-5">{shortDesc}</p>

              {/* Meta */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1.5 text-purple-500 text-xs font-body">
                  <Clock size={13} />
                  {duration}
                </div>
                <span className="text-purple-200">·</span>
                <span className="font-heading text-lg text-gold-600 font-medium">{price}</span>
              </div>

              {/* CTA */}
              <Link
                href="/terapias"
                className="inline-flex items-center justify-center gap-2 bg-purple-50 hover:bg-gold-500 text-purple-700 hover:text-purple-950 text-sm font-semibold py-2.5 px-5 rounded-full transition-all duration-300 group-hover:shadow-md"
              >
                Reservar sesión
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link
            href="/terapias"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-gold-600 font-body text-sm font-medium transition-colors"
          >
            Ver todas las terapias y precios
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
