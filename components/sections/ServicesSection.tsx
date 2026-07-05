import Image from "next/image";
import Link from "next/link";
import {
  Flower2, Zap, TreePine, Moon, Waves, Sun,
  Clock, ArrowRight, Package,
} from "lucide-react";
import pool from "@/lib/db";

const icons: Record<string, typeof Flower2> = {
  pack: Flower2,
  higado: Zap,
  reiki: TreePine,
  chakras: Moon,
  tikun: Sun,
};

interface TherapyRow {
  id: string
  name: string
  description: string
  duration_minutes: number
  price_cents: number
  image_url: string
  is_pack: boolean
  session_count: number | null
  session_duration_minutes: number | null
}

const HOMEPAGE_THERAPIES = [
  { id: "41a5ab67-ffd4-4ac1-8245-3c35c6439bbb", displayName: "Pack Reset", iconKey: "pack" },
  { id: "340d8354-95b5-4a90-a3b4-fb89a35c7642", displayName: "Limpieza de hígado", iconKey: "higado" },
  { id: "e8794911-add2-4a05-8ddd-d79c82e14ed6", displayName: "Reiki emocional", iconKey: "reiki" },
  { id: "07fb6c16-02c1-4fc8-ae08-da4c3a2be91e", displayName: "Equilibrado de chakras con Reiki", iconKey: "chakras" },
  { id: "1b3be20b-5416-469d-bf28-e54fc3579844", displayName: "Pack Tikkun Karuna", iconKey: "tikun" },
  { id: "263086e9-a756-4c9a-b597-e8799a48c471", displayName: "Pack Bienestar", iconKey: "pack" },
];

export default async function ServicesSection() {
  const ids = HOMEPAGE_THERAPIES.map(t => t.id)
  const dbMap = new Map<string, TherapyRow>()

  try {
    const result = await pool.query(
      `SELECT id, name, description, duration_minutes, price_cents, image_url,
              is_pack, session_count, session_duration_minutes
       FROM therapies WHERE id = ANY($1) AND is_active = true AND deleted_at IS NULL`,
      [ids]
    )
    for (const row of result.rows) {
      dbMap.set(row.id, row)
    }
  } catch {
    const result = await pool.query(
      `SELECT id, name, description, duration_minutes, price_cents, image_url
       FROM therapies WHERE id = ANY($1) AND is_active = true`,
      [ids]
    )
    for (const row of result.rows) {
      dbMap.set(row.id, { ...row, is_pack: false, session_count: null, session_duration_minutes: null })
    }
  }

  const services = HOMEPAGE_THERAPIES.map(({ id, displayName, iconKey }) => {
    const t = dbMap.get(id)
    const Icon = icons[iconKey]
    return {
      Icon,
      id,
      name: displayName,
      shortDesc: t
        ? (t.description.length > 100 ? t.description.substring(0, 100) + '...' : t.description)
        : '',
      duration: t
        ? (t.duration_minutes >= 60
          ? `${Math.floor(t.duration_minutes / 60)}h ${t.duration_minutes % 60 > 0 ? (t.duration_minutes % 60) + ' min' : ''}`
          : `${t.duration_minutes} min`)
        : '',
      price: t ? `${(t.price_cents / 100).toFixed(0)} €` : '',
      image_url: t?.image_url ?? '',
      isPack: t?.is_pack ?? false,
      sessionCount: t?.session_count ?? null,
      sessionDuration: t?.session_duration_minutes ?? null,
      tag: null,
    }
  })
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
          {services.map(({ Icon, id, name, shortDesc, duration, price, tag, image_url, isPack, sessionCount, sessionDuration }) => (
            <div
              key={name}
              className="group relative flex flex-col bg-white border border-purple-100 rounded-2xl overflow-hidden hover:border-gold-300 hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              {image_url && (
                <div className="relative w-full h-44 overflow-hidden">
                  <Image src={image_url} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                </div>
              )}

              {/* Tag */}
              {tag && (
                <span className="absolute top-4 right-4 bg-gold-100 text-gold-700 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full z-10">
                  {tag}
                </span>
              )}

              <div className="p-7 pt-5">
                {isPack && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700 mb-3">
                    <Package size={11} />
                    Pack · {sessionCount} sesiones de {sessionDuration} min
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
                  <span className="text-lg text-purple-700 font-semibold">{price}</span>
                </div>

                {/* CTA */}
                <Link
                  href={`/reservar/${id}`}
                  className="inline-flex items-center justify-center gap-2 bg-purple-50 hover:bg-gold-500 text-purple-700 hover:text-purple-950 text-sm font-semibold py-2.5 px-5 rounded-full transition-all duration-300 group-hover:shadow-md"
                >
                  {isPack ? 'Reservar pack' : 'Reservar sesión'}
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
