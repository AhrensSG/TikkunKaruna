import type { Metadata } from "next";
import { Mail, MessageCircle, Clock } from "lucide-react";
import ContactForm from "./ContactForm";

function IconInstagram({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconFacebook({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Contacto | TikkunKaruna",
  description:
    "Contacta con TikkunKaruna. Estamos aquí para resolver todas tus dudas antes de reservar tu sesión.",
};

const contactInfo = [
  {
    Icon: Mail,
    label: "Email",
    value: "hola@tikkunkaruna.com",
    href: "mailto:hola@tikkunkaruna.com",
  },
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    value: "+34 620 89 75 29",
    href: "https://wa.me/34620897529",
  },
  {
    Icon: IconInstagram,
    label: "Instagram",
    value: "@tikkunkaruna",
    href: "https://instagram.com/@tikkunkaruna",
  },
  {
    Icon: IconFacebook,
    label: "Facebook",
    value: "@tikkunkaruna",
    href: "https://facebook.com/@tikkunkaruna",
  },
];

export default function ContactoPage() {
  return (
    <>
      {/* ── Page hero ── */}
      <section className="bg-purple-950 pt-36 pb-20 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-700/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label mb-4">✦ Contacto</p>
          <h1 className="font-heading text-5xl sm:text-6xl text-white mb-5">
            Estamos aquí{" "}
            <span className="text-gradient-gold">para ti</span>
          </h1>
          <div className="gold-divider mb-6" />
          <p className="text-purple-300 text-lg max-w-xl mx-auto font-body leading-relaxed">
            ¿Tienes alguna duda antes de reservar? Escríbenos y te
            responderemos lo antes posible.
          </p>
        </div>
      </section>

      {/* ── Contact content ── */}
      <section className="py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact form */}
            <div>
              <h2 className="font-heading text-3xl text-purple-950 mb-2">
                Envíanos un mensaje
              </h2>
              <div className="w-10 h-px bg-gold-500 mb-8" />

              <ContactForm />
            </div>

            {/* Contact info */}
            <div>
              <h2 className="font-heading text-3xl text-purple-950 mb-2">
                Información de contacto
              </h2>
              <div className="w-10 h-px bg-gold-500 mb-8" />

              <div className="space-y-4 mb-10">
                {contactInfo.map(({ Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 bg-white border border-purple-100 rounded-2xl hover:border-gold-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-purple-50 group-hover:bg-gold-50 flex items-center justify-center shrink-0 transition-colors">
                      <Icon size={20} className="text-purple-600 group-hover:text-gold-600 transition-colors" />
                    </div>
                    <div>
                      <p className="text-purple-500 text-xs font-body mb-0.5">{label}</p>
                      <p className="text-purple-900 font-body font-semibold text-sm">{value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Hours */}
              <div className="bg-purple-950 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={16} className="text-gold-400" />
                  <h3 className="font-body font-semibold text-white text-sm">Horario de atención</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { day: "Lunes – Viernes", hours: "Pendiente de definir" },
                    { day: "Sábados", hours: "Pendiente de definir" },
                    { day: "Domingos", hours: "Cerrado" },
                  ].map(({ day, hours }) => (
                    <div key={day} className="flex justify-between text-sm font-body">
                      <span className="text-purple-300">{day}</span>
                      <span className="text-gold-400 font-medium">{hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-purple-800">
                  <p className="text-purple-400 text-xs font-body">
                    ✦ Las reservas online están disponibles 24/7 desde la plataforma.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
