"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "¿En qué consisten las terapias holísticas?",
    a: "Las terapias holísticas abordan a la persona en su totalidad: cuerpo, mente y espíritu. No se centran únicamente en el síntoma, sino en la raíz del desequilibrio, facilitando procesos de sanación profundos y duraderos. Cada sesión es diseñada de forma única para ti, atendiendo a tus necesidades y momento vital.",
  },
  {
    q: "¿Cuánto dura cada sesión?",
    a: "La duración varía según la terapia elegida, entre 60 y 90 minutos. Puedes consultar la duración exacta en la página de cada terapia. Si tienes dudas, contáctanos y te asesoramos sin compromiso.",
  },
  {
    q: "¿Las sesiones son presenciales u online?",
    a: "Actualmente todas nuestras sesiones se realizan exclusivamente online a través de videollamada. De esta forma, puedes disfrutar de tus terapias desde cualquier lugar, con la misma cercanía y efectividad que en una sesión presencial.",
  },
  {
    q: "¿Cómo puedo reservar una cita?",
    a: "El proceso es muy sencillo: elige tu terapia, selecciona el día y la hora que mejor te venga en el calendario interactivo, completa el pago online de forma segura y recibirás confirmación instantánea por WhatsApp y email.",
  },
  {
    q: "¿Qué métodos de pago aceptáis?",
    a: "Aceptamos pagos con tarjeta de crédito/débito a través de Stripe, una plataforma de pago segura y cifrada. Recibirás tu factura de forma automática por correo electrónico.",
  },
  {
    q: "¿Puedo cancelar o cambiar mi reserva?",
    a: "Sí, puedes gestionar tus reservas desde tu panel de usuario. No realizamos reembolsos, pero puedes reprogramar sin coste siempre que nos avises con al menos 2 horas de antelación.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-label mb-4">✦ FAQ</p>
          <h2 className="font-heading text-4xl sm:text-5xl text-purple-950 mb-5">
            Preguntas{" "}
            <span className="text-gradient-gold">frecuentes</span>
          </h2>
          <div className="gold-divider mb-5" />
          <p className="text-purple-600 text-base font-body leading-relaxed">
            ¿Tienes alguna duda? Aquí resolvemos las más habituales.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map(({ q, a }, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                open === idx
                  ? "border-gold-300 shadow-md shadow-gold-100/40"
                  : "border-purple-100 hover:border-purple-200"
              }`}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group"
                onClick={() => setOpen(open === idx ? null : idx)}
                aria-expanded={open === idx}
              >
                <span
                  className={`font-body font-semibold text-sm sm:text-base leading-snug transition-colors ${
                    open === idx ? "text-gold-700" : "text-purple-900 group-hover:text-purple-700"
                  }`}
                >
                  {q}
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-purple-400 transition-all duration-300 ${
                    open === idx ? "rotate-180 text-gold-500" : ""
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  open === idx ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5 border-t border-purple-50">
                  <p className="text-purple-600 text-sm leading-relaxed font-body pt-4">{a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact prompt */}
        <div className="text-center mt-10">
          <p className="text-purple-500 text-sm font-body">
            ¿No encuentras tu respuesta?{" "}
            <a
              href="/contacto"
              className="text-gold-600 hover:text-gold-500 font-semibold transition-colors"
            >
              Escríbenos
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
