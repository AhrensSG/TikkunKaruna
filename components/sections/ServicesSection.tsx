import Link from "next/link";
import {
  Flower2, Zap, TreePine, Moon, Waves, Sun,
  Clock, ArrowRight,
} from "lucide-react";
import pool from "@/lib/db";

const icons = [Flower2, Zap, TreePine, Moon, Waves, Sun];

export default async function ServicesSection() {
  const result = await pool.query(
    `     SELECT name, description, duration_minutes, price_cents, image_url
     FROM therapies WHERE is_active = true AND sort_order > 0
     ORDER BY sort_order ASC, created_at DESC LIMIT 6`
  )
  const therapies = result.rows

  const services = therapies.map((t, i) => ({
    Icon: icons[i % icons.length],
    name: t.name,
    shortDesc: t.description.length > 100
      ? t.description.substring(0, 100) + '...'
      : t.description,
    duration: t.duration_minutes >= 60
      ? `${Math.floor(t.duration_minutes / 60)}h ${t.duration_minutes % 60 > 0 ? (t.duration_minutes % 60) + ' min' : ''}`
      : `${t.duration_minutes} min`,
    price: `${(t.price_cents / 100).toFixed(0)} €`,
    tag: i === 0 ? 'Nueva' : null,
    image_url: t.image_url,
  }))
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
          {services.map(({ Icon, name, shortDesc, duration, price, tag, image_url }) => (
            <div
              key={name}
              className="group relative flex flex-col bg-white border border-purple-100 rounded-2xl overflow-hidden hover:border-gold-300 hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              {image_url && (
                <div className="w-full h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image_url}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Tag */}
              {tag && (
                <span className="absolute top-4 right-4 bg-gold-100 text-gold-700 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full z-10">
                  {tag}
                </span>
              )}

              <div className="p-7 pt-5">
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
