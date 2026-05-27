import {
  CalendarCheck, ShieldCheck, BellRing,
  FileText, Heart, Clock,
} from "lucide-react";

const benefits = [
  {
    Icon: CalendarCheck,
    title: "Reserva online 24/7",
    desc: "Reserva tus sesiones en cualquier momento, desde cualquier dispositivo, sin llamadas ni esperas.",
  },
  {
    Icon: ShieldCheck,
    title: "Pago 100% seguro",
    desc: "Integración con Stripe para pagos con tarjeta totalmente seguros y facturación automática.",
  },
  {
    Icon: BellRing,
    title: "Recordatorios automáticos",
    desc: "Recibirás recordatorios por WhatsApp y email para no olvidar nunca tu cita.",
  },
  {
    Icon: FileText,
    title: "Historial de sesiones",
    desc: "Accede a tu panel personal con el historial completo de terapias, pagos y facturas.",
  },
  {
    Icon: Heart,
    title: "Terapias personalizadas",
    desc: "Cada sesión se adapta a tus necesidades únicas, con un enfoque integral y respetuoso.",
  },
  {
    Icon: Clock,
    title: "Gestión de tiempo flexible",
    desc: "Cambia, cancela o reprograma tu cita desde tu panel de usuario de forma sencilla.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-24 lg:py-32 bg-purple-950 relative overflow-hidden">
      {/* Decorative background */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-700/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-purple-600/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold-500/3 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label mb-4">✦ Por qué TikkunKaruna</p>
          <h2 className="font-heading text-4xl sm:text-5xl text-white mb-5">
            Más que una terapia,{" "}
            <span className="text-gradient-gold">una experiencia</span>{" "}
            completa
          </h2>
          <div className="gold-divider mb-6" />
          <p className="text-purple-300 text-base max-w-xl mx-auto font-body leading-relaxed">
            Diseñamos cada detalle para que tu experiencia sea fluida,
            cómoda y transformadora, desde la reserva hasta el final de la sesión.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="group flex gap-4 bg-purple-900/50 hover:bg-purple-900/80 border border-purple-800/60 hover:border-gold-500/40 rounded-2xl p-6 transition-all duration-300"
            >
              {/* Icon */}
              <div className="shrink-0 w-11 h-11 rounded-xl bg-purple-800 group-hover:bg-gold-500/20 flex items-center justify-center transition-colors duration-300">
                <Icon size={20} className="text-gold-400" />
              </div>
              {/* Text */}
              <div>
                <h3 className="font-body font-semibold text-white mb-1.5 text-sm">
                  {title}
                </h3>
                <p className="text-purple-400 text-sm leading-relaxed font-body">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-purple-800/40 pt-12">
          {[
            { value: "+500", label: "Sesiones realizadas" },
            { value: "100%", label: "Pago seguro" },
            { value: "24/7", label: "Reserva online" },
            { value: "✦", label: "Atención personalizada" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-heading text-4xl text-gold-400 mb-2">{value}</p>
              <p className="text-purple-400 text-xs font-body tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
