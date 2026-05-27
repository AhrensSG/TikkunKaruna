import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | TikkunKaruna",
};

export default function TerminosPage() {
  return (
    <>
      <section className="bg-purple-950 pt-36 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label mb-4">✦ Legal</p>
          <h1 className="font-heading text-4xl sm:text-5xl text-white mb-4">
            Términos y Condiciones
          </h1>
          <div className="gold-divider" />
        </div>
      </section>
      <section className="py-20 bg-cream-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-purple-100 p-8 sm:p-12">
            <p className="text-purple-400 text-sm font-body mb-8">
              Última actualización: [fecha pendiente]
            </p>
            <div className="space-y-6 text-purple-700 font-body text-sm leading-relaxed">
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">1. Objeto</h2>
                <p>Las presentes condiciones regulan el uso de la plataforma TikkunKaruna y la contratación de sesiones de terapias holísticas individuales. [Completar según caso real]</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">2. Reservas y pagos</h2>
                <p>Las reservas se confirman una vez completado el pago online a través de Stripe. Recibirás confirmación por email y WhatsApp. [Completar según caso real]</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">3. Cancelaciones y reembolsos</h2>
                <p>Política de cancelación pendiente de definir. [Completar según caso real]</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">4. Responsabilidad</h2>
                <p>Las terapias holísticas no sustituyen el tratamiento médico. [Completar según caso real]</p>
              </div>
              <p className="text-purple-400 text-xs italic">
                Este texto es un placeholder. Debe ser redactado y revisado por un profesional legal antes de publicarse.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
