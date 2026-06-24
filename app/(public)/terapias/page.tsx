import type { Metadata } from "next";
import Link from "next/link";
import {
  Flower2, Zap, TreePine, Moon, Waves, Sun,
  Clock, ArrowRight, CalendarCheck, ListChecks, Package,
} from "lucide-react";
import pool from "@/lib/db";

export const metadata: Metadata = {
  title: "Terapias | TikkunKaruna",
  description:
    "Explora todas las terapias holísticas disponibles. Reserva tu sesión online de forma rápida y segura.",
};

const icons = [Flower2, Zap, TreePine, Moon, Waves, Sun];

function formatDuration(minutes: number) {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m} min` : `${h}h`
  }
  return `${minutes} min`
}

export default async function TerapiasPage() {
  let therapies: any[] = []
  try {
    const result = await pool.query(
      `SELECT t.id, t.name, t.description, t.duration_minutes, t.price_cents, t.image_url,
              t.is_pack, t.session_count, t.session_duration_minutes,
              COALESCE(json_agg(tr.description) FILTER (WHERE tr.description IS NOT NULL), '[]') AS requirements
       FROM therapies t
       LEFT JOIN therapy_requirements tr ON tr.therapy_id = t.id
        WHERE t.is_active = true AND t.deleted_at IS NULL
        GROUP BY t.id
       ORDER BY t.sort_order ASC, t.created_at ASC`
    )
    therapies = result.rows
  } catch {
    const result = await pool.query(
      `SELECT t.id, t.name, t.description, t.duration_minutes, t.price_cents, t.image_url,
              COALESCE(json_agg(tr.description) FILTER (WHERE tr.description IS NOT NULL), '[]') AS requirements
       FROM therapies t
       LEFT JOIN therapy_requirements tr ON tr.therapy_id = t.id
        WHERE t.is_active = true AND t.deleted_at IS NULL
        GROUP BY t.id
       ORDER BY t.sort_order ASC, t.created_at ASC`
    )
    therapies = result.rows.map((t: any) => ({ ...t, is_pack: false, session_count: null, session_duration_minutes: null }))
  }

  const services = therapies.map((t, i) => ({
    Icon: icons[i % icons.length],
    id: t.id,
    name: t.name,
    fullDesc: t.description,
    duration: formatDuration(t.duration_minutes),
    price: `${(t.price_cents / 100).toFixed(0)} €`,
    tag: i === 0 ? 'Nueva' : null,
    image_url: t.image_url,
    requirements: t.requirements || [],
    isPack: t.is_pack,
    sessionCount: t.session_count,
    sessionDuration: t.session_duration_minutes,
  }))
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

      {/* ── Services grid ── */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ Icon, id, name, fullDesc, duration, price, tag, image_url, requirements, isPack, sessionCount, sessionDuration }) => (
              <div
                key={name}
                className="group flex flex-col bg-white border border-purple-100 rounded-2xl overflow-hidden hover:border-gold-300 hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                {image_url ? (
                  <div className="w-full h-44 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image_url}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-44 bg-purple-50 flex items-center justify-center">
                    <Icon size={40} className="text-purple-300" />
                  </div>
                )}

                {/* Tag */}
                {tag && (
                  <span className="absolute top-4 right-4 bg-gold-100 text-gold-700 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full z-10">
                    {tag}
                  </span>
                )}

                <div className="flex flex-col flex-1 p-5 pt-4">
                  {isPack && (
                    <span className="inline-flex items-center gap-1 self-start px-2.5 py-1 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700 mb-2">
                      <Package size={11} />
                      Pack · {sessionCount} sesiones de {sessionDuration} min
                    </span>
                  )}
                  {/* Meta row */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1 text-purple-400 text-xs font-body">
                      <Clock size={12} />
                      {duration}
                    </div>
                    <span className="text-purple-200">·</span>
                    <span className="font-heading text-lg text-gold-600 font-medium">{price}</span>
                  </div>

                  {/* Title */}
                  <h2 className="font-heading text-xl text-purple-950 mb-2 leading-snug">{name}</h2>

                  {/* Description */}
                  <p className="text-purple-600 text-sm leading-relaxed font-body flex-1 mb-3 line-clamp-3">
                    {fullDesc}
                  </p>

                  {/* Requirements */}
                  {requirements.length > 0 && (
                    <div className="mb-4">
                      <p className="flex items-center gap-1 text-xs font-semibold text-purple-800 mb-1.5">
                        <ListChecks size={12} />
                        Requisitos
                      </p>
                      <ul className="space-y-1">
                        {requirements.slice(0, 3).map((req: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-purple-600">
                            <span className="mt-1 w-1 h-1 rounded-full bg-gold-400 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                        {requirements.length > 3 && (
                          <li className="text-xs text-purple-400 pl-3">+{requirements.length - 3} más</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* CTA */}
                  <Link
                    href={`/reservar/${id}`}
                    className="inline-flex items-center justify-center gap-2 bg-purple-50 hover:bg-gold-500 text-purple-700 hover:text-purple-950 text-sm font-semibold py-2.5 px-5 rounded-full transition-all duration-300"
                  >
                    <CalendarCheck size={14} />
                    {isPack ? 'Reservar pack' : 'Reservar sesión'}
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom note ── */}
      <section className="py-14 bg-white border-t border-purple-100">
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
