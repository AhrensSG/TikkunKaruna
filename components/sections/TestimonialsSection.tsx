import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "María G.",
    location: "Madrid",
    rating: 5,
    text: "La experiencia con Inma fue completamente transformadora. Llegué con mucha carga emocional y salí sintiéndome liviana y reconectada conmigo misma. ¡La recomiendo al 100%!",
    terapia: "Terapia 1",
    initials: "MG",
    color: "bg-purple-600",
  },
  {
    name: "Laura P.",
    location: "Valencia",
    rating: 5,
    text: "Nunca había probado este tipo de terapias y fue una revelación. Inma crea un espacio de confianza único. El proceso de reserva online es super sencillo y cómodo.",
    terapia: "Terapia 3",
    initials: "LP",
    color: "bg-gold-600",
  },
  {
    name: "Carmen S.",
    location: "Barcelona",
    rating: 5,
    text: "Llevo meses acudiendo a las sesiones y cada vez siento una mejora enorme. La plataforma es muy fácil de usar y la confirmación por WhatsApp es muy práctica.",
    terapia: "Terapia 2",
    initials: "CS",
    color: "bg-purple-800",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "text-gold-400 fill-gold-400" : "text-purple-200"}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-24 lg:py-32 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label mb-4">✦ Testimonios</p>
          <h2 className="font-heading text-4xl sm:text-5xl text-purple-950 mb-5">
            Lo que dicen{" "}
            <span className="text-gradient-gold">nuestras clientas</span>
          </h2>
          <div className="gold-divider mb-6" />
          <p className="text-purple-600 text-base max-w-lg mx-auto font-body leading-relaxed">
            Las experiencias reales de quienes ya han confiado en
            TikkunKaruna hablan por sí solas.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {testimonials.map(
            ({ name, location, rating, text, terapia, initials, color }) => (
              <div
                key={name}
                className="relative flex flex-col bg-white rounded-2xl p-7 shadow-sm shadow-purple-100/60 border border-purple-100 hover:shadow-lg hover:shadow-purple-100/60 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Quote icon */}
                <Quote
                  size={32}
                  className="text-purple-100 absolute top-5 right-5"
                />

                {/* Stars */}
                <StarRating rating={rating} />

                {/* Text */}
                <p className="text-purple-700 text-sm leading-relaxed font-body my-5 flex-1">
                  &ldquo;{text}&rdquo;
                </p>

                {/* Terapia badge */}
                <span className="inline-block bg-purple-50 text-purple-600 text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5 w-fit">
                  {terapia}
                </span>

                {/* Author */}
                <div className="flex items-center gap-3 border-t border-purple-50 pt-4">
                  <div
                    className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold font-body shrink-0`}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="font-body font-semibold text-purple-900 text-sm">
                      {name}
                    </p>
                    <p className="text-purple-400 text-xs font-body">{location}</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Trust indicator */}
        <div className="flex items-center justify-center gap-3 text-purple-500 text-sm font-body">
          <div className="flex">
            {["MG", "LP", "CS", "AR"].map((i, idx) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full bg-purple-200 border-2 border-white flex items-center justify-center text-[9px] text-purple-600 font-bold"
                style={{ marginLeft: idx > 0 ? "-8px" : 0 }}
              >
                {i}
              </div>
            ))}
          </div>
          <span>+50 clientas satisfechas</span>
          <span className="text-gold-400">★★★★★</span>
          <span className="font-semibold text-purple-700">5.0</span>
        </div>
      </div>
    </section>
  );
}
