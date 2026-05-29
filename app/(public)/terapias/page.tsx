import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, CalendarCheck, ArrowRight, Layers } from "lucide-react";
import pool from "@/lib/db";
import type { TherapyWithDetails } from "@/types";

export const metadata: Metadata = {
  title: "Terapias | Tikkun Karuna",
  description:
    "Sesiones individuales y packs de Péndulo Hebreo y Reiki. Terapia holística online para la limpieza, armonización y transformación de tu sistema energético.",
};

// ─── Helpers ──────────────────────────────────────────────────
function imgSrc(url: string): string {
  if (!url) return ""
  if (url.startsWith("/") || url.startsWith("http")) return url
  return `/sesiones/${url}`
}

function fmtDuration(minutes: number, modality: string, isPack: boolean): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const parts: string[] = []
  if (h > 0) parts.push(`${h}h`)
  if (m > 0) parts.push(`${m} min`)
  return `${parts.join(" ")}${isPack ? " total" : ""} · ${modality === "distancia" ? "A distancia" : "Presencial"}`
}

function fmtPrice(cents: number): string {
  return `${Math.round(cents / 100)} €`
}

// ─── Data fetching ─────────────────────────────────────────────
async function getTherapies(): Promise<TherapyWithDetails[]> {
  const result = await pool.query(`
    SELECT
      t.id, t.name, t.subtitle, t.description, t.duration_minutes, t.price_cents,
      t.image_url, t.category, t.modality, t.is_pack, t.session_count,
      t.sort_order, t.created_at, t.is_active, t.prerequisite_id,
      p.name AS prerequisite_name,
      COALESCE(
        ARRAY_AGG(ti.indication ORDER BY ti.sort_order) FILTER (WHERE ti.id IS NOT NULL),
        ARRAY[]::text[]
      ) AS indications
    FROM therapies t
    LEFT JOIN therapies p ON p.id = t.prerequisite_id
    LEFT JOIN therapy_indications ti ON ti.therapy_id = t.id
    WHERE t.is_active = true
    GROUP BY t.id, t.name, t.subtitle, t.description, t.duration_minutes, t.price_cents,
             t.image_url, t.category, t.modality, t.is_pack, t.session_count,
             t.sort_order, t.created_at, t.is_active, t.prerequisite_id, p.name
    ORDER BY t.sort_order, t.created_at
  `)
  // tag y video_url se añaden con las migraciones 005/006; se normalizan aquí hasta que existan
  return result.rows.map((r) => ({
    ...r,
    tag: r.tag ?? '',
    video_url: r.video_url ?? '',
  }))
}

// ─── TherapyCard ───────────────────────────────────────────────
function TherapyCard({ t }: { t: TherapyWithDetails }) {
  const src = imgSrc(t.image_url)
  const duration = fmtDuration(t.duration_minutes, t.modality, t.is_pack)
  const price = fmtPrice(t.price_cents)
  const descParagraphs = t.description.split("\n\n").filter(Boolean)

  return (
    <div className="group grid grid-cols-1 lg:grid-cols-5 bg-white border border-purple-100 rounded-3xl overflow-hidden hover:border-gold-200 hover:shadow-xl hover:shadow-purple-100/40 transition-all duration-300">

      {/* Cover image */}
      <div className="relative lg:col-span-2 h-60 lg:h-auto min-h-[240px] bg-purple-100">
        {src && (
          <Image
            src={src}
            alt={t.name}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        )}
        {/* Price overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-950/90 via-purple-950/50 to-transparent px-5 py-4">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl text-gold-400 font-medium">{price}</span>
            {t.is_pack && (
              <span className="text-purple-300 text-xs font-body">{t.session_count} sesiones</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-purple-300 text-xs font-body mt-0.5">
            <Clock size={11} />
            {duration}
          </div>
        </div>
        {/* Pack badge */}
        {t.is_pack && (
          <div className="absolute top-4 left-4">
            <span className="flex items-center gap-1.5 bg-purple-900/80 backdrop-blur-sm text-gold-400 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border border-gold-500/30">
              <Layers size={10} />
              Pack · {t.session_count} sesiones
            </span>
          </div>
        )}
        {/* Tag badge */}
        {t.tag && !t.is_pack && (
          <div className="absolute top-4 left-4">
            <span className="bg-gold-500/90 backdrop-blur-sm text-purple-950 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
              {t.tag}
            </span>
          </div>
        )}
        {t.tag && t.is_pack && (
          <div className="absolute top-4 right-4">
            <span className="bg-gold-500/90 backdrop-blur-sm text-purple-950 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
              {t.tag}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="lg:col-span-3 p-7 flex flex-col justify-between gap-5">
        <div>
          <h3 className="font-heading text-2xl text-purple-950 mb-1">{t.name}</h3>
          {t.subtitle && (
            <p className="text-gold-600 font-body text-sm font-medium mb-3 leading-snug">{t.subtitle}</p>
          )}
          <div className="space-y-2">
            {descParagraphs.map((p, i) => (
              <p key={i} className="text-purple-600 text-sm font-body leading-relaxed">{p}</p>
            ))}
          </div>

          {/* Indications */}
          {t.indications.length > 0 && (
            <div className="mt-4">
              <p className="text-purple-400 text-[10px] uppercase tracking-widest font-semibold mb-2">Ideal si sientes</p>
              <div className="flex flex-wrap gap-2">
                {t.indications.map((ind) => (
                  <span
                    key={ind}
                    className="flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-body px-3 py-1.5 rounded-full"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-purple-50">
          <div>
            {t.prerequisite_name ? (
              <p className="text-purple-400 text-[11px] font-body">
                Se recomienda haber realizado previamente el{" "}
                <span className="text-gold-600 font-semibold">{t.prerequisite_name}</span>
              </p>
            ) : (
              <p className="text-purple-400 text-[11px] font-body">
                Sesión {t.is_pack ? "en pack" : "individual"} · Modalidad {t.modality === "distancia" ? "a distancia" : "presencial"}
              </p>
            )}
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-purple-950 font-semibold text-sm px-6 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-gold-500/25 hover:-translate-y-px shrink-0"
          >
            <CalendarCheck size={14} />
            Reservar
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── CategoryHeader ────────────────────────────────────────────
function CategoryHeader({
  image, label, title, description,
}: {
  image: string; label: string; title: string; description: string
}) {
  return (
    <div className="relative rounded-3xl overflow-hidden h-72 sm:h-80">
      <Image src={image} alt={title} fill sizes="100vw" className="object-cover object-center" priority />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-950/90 via-purple-950/60 to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-center px-10 max-w-xl">
        <p className="section-label mb-3">{label}</p>
        <h2 className="font-heading text-4xl sm:text-5xl text-white mb-3">{title}</h2>
        <div className="gold-divider mb-4 mx-0" />
        <p className="text-purple-200 font-body text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// ─── Section helper ────────────────────────────────────────────
function TherapySection({ title, therapies }: { title: string; therapies: TherapyWithDetails[] }) {
  if (therapies.length === 0) return null
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="gold-divider flex-none w-10 mx-0" />
        <h3 className="font-heading text-2xl text-purple-950">{title}</h3>
      </div>
      <div className="space-y-6">
        {therapies.map((t) => <TherapyCard key={t.id} t={t} />)}
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────
export default async function TerapiasPage() {
  const therapies = await getTherapies()

  const pendulo = therapies.filter((t) => t.category === "pendulo_hebreo")
  const reiki   = therapies.filter((t) => t.category === "reiki")
  const combinado = therapies.filter((t) => t.category === "combinado")

  const penduloSessions = pendulo.filter((t) => !t.is_pack)
  const penduloPacks    = pendulo.filter((t) => t.is_pack)
  const reikiSessions   = reiki.filter((t) => !t.is_pack)
  const reikiPacks      = [...reiki.filter((t) => t.is_pack), ...combinado.filter((t) => t.is_pack)]

  return (
    <>
      {/* ── Hero ── */}
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
            Sesiones de Péndulo Hebreo y Reiki realizadas a distancia, orientadas a la
            limpieza, armonización y transformación de tu sistema energético.
          </p>
        </div>
      </section>

      {/* ── PÉNDULO HEBREO ── */}
      {(penduloSessions.length > 0 || penduloPacks.length > 0) && (
        <section className="py-20 bg-cream-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <CategoryHeader
              image="/sesiones/IMG_6612.jpg"
              label="✦ Terapia Energética"
              title="Péndulo Hebreo"
              description="El péndulo hebreo es una herramienta de sanación y alta radiestesia que combina la madera sagrada con la vibración de las letras hebreas — frecuencias divinas que detectan, limpian y transforman tu campo energético desde la raíz."
            />
            <TherapySection title="Sesiones Individuales" therapies={penduloSessions} />
            <TherapySection title="Packs de Péndulo Hebreo" therapies={penduloPacks} />
          </div>
        </section>
      )}

      {/* ── REIKI ── */}
      {(reikiSessions.length > 0 || reikiPacks.length > 0) && (
        <section className="py-20 bg-white border-t border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <CategoryHeader
              image="/sesiones/IMG_6623.jpg"
              label="✦ Terapia Japonesa"
              title="Reiki"
              description="Terapia energética de origen japonés que armoniza el cuerpo, la mente y las emociones a través de la transmisión de energía. RE (energía universal) · KI (energía vital). Ayuda a desbloquear, equilibrar y recuperar la armonía interior."
            />
            <TherapySection title="Sesiones Individuales" therapies={reikiSessions} />
            <TherapySection title="Packs de Reiki" therapies={reikiPacks} />
          </div>
        </section>
      )}

      {/* ── Disclaimer ── */}
      <section className="py-12 bg-purple-950/5 border-t border-purple-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-purple-500 text-xs font-body leading-relaxed">
            <span className="font-semibold text-purple-600">Aviso importante:</span>{" "}
            Ninguna de las sesiones ofrecidas sustituye un proceso médico ni la atención de un profesional de la salud.
            En estas sesiones se trabaja exclusivamente en el campo energético como complemento al bienestar personal.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-white border-t border-purple-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="font-heading text-2xl text-purple-950 mb-3">¿No sabes qué terapia elegir?</p>
          <p className="text-purple-500 text-sm font-body mb-6">
            Escríbenos y te ayudamos a encontrar la sesión más adecuada para ti.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 border border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-purple-950 font-semibold text-sm px-8 py-3 rounded-full transition-all duration-200"
          >
            Contactar
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
