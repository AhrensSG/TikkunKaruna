import { Search, CalendarDays, CreditCard, CheckCircle2 } from "lucide-react";

const steps = [
  {
    step: "01",
    Icon: Search,
    title: "Elige tu terapia",
    desc: "Explora todas las terapias disponibles y elige la que mejor se adapta a tu momento y necesidades.",
  },
  {
    step: "02",
    Icon: CalendarDays,
    title: "Selecciona fecha y hora",
    desc: "Consulta la disponibilidad en el calendario interactivo y elige el horario que te venga mejor.",
  },
  {
    step: "03",
    Icon: CreditCard,
    title: "Paga con seguridad",
    desc: "Realiza el pago online de forma segura a través de Stripe. Recibirás tu factura automáticamente.",
  },
  {
    step: "04",
    Icon: CheckCircle2,
    title: "¡Confirmación instantánea!",
    desc: "Recibirás una confirmación por WhatsApp y email con todos los detalles de tu sesión.",
  },
];

export default function ProcessSection() {
  return (
    <section className="py-24 lg:py-32 bg-purple-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label mb-4">✦ Cómo funciona</p>
          <h2 className="font-heading text-4xl sm:text-5xl text-purple-950 mb-5">
            Reserva tu sesión{" "}
            <span className="text-gradient-gold">en minutos</span>
          </h2>
          <div className="gold-divider mb-6" />
          <p className="text-purple-600 text-base max-w-xl mx-auto font-body leading-relaxed">
            Un proceso sencillo y seguro para que puedas centrarte en lo
            que de verdad importa: tu bienestar.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-14 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent z-0"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map(({ step, Icon, title, desc }, idx) => (
              <div
                key={step}
                className="flex flex-col items-center text-center"
              >
                {/* Step icon with ring */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-gold-400/20 scale-150 blur-xl" />
                  <div className="relative w-28 h-28 rounded-full border-2 border-purple-200 bg-white flex flex-col items-center justify-center shadow-lg shadow-purple-100/50">
                    <Icon size={28} className="text-purple-600 mb-1" />
                    <span className="text-gold-600 text-xs font-semibold font-body">{step}</span>
                  </div>
                  {/* Connector arrow (except last) */}
                  {idx < steps.length - 1 && (
                    <div className="lg:hidden absolute -right-4 top-1/2 -translate-y-1/2 text-purple-300 text-xl">
                      →
                    </div>
                  )}
                </div>

                <h3 className="font-heading text-2xl text-purple-950 mb-3">{title}</h3>
                <p className="text-purple-600 text-sm leading-relaxed font-body">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
