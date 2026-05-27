import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | TikkunKaruna",
};

export default function PrivacidadPage() {
  return (
    <>
      <section className="bg-purple-950 pt-36 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label mb-4">✦ Legal</p>
          <h1 className="font-heading text-4xl sm:text-5xl text-white mb-4">
            Política de Privacidad
          </h1>
          <div className="gold-divider" />
        </div>
      </section>
      <section className="py-20 bg-cream-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-purple-100 p-8 sm:p-12 prose prose-sm max-w-none">
            <p className="text-purple-400 text-sm font-body mb-8">
              Última actualización: [fecha pendiente]
            </p>
            <div className="space-y-6 text-purple-700 font-body text-sm leading-relaxed">
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">1. Responsable del tratamiento</h2>
                <p>[Nombre completo / razón social pendiente] · [NIF pendiente] · hola@tikkunkaruna.com</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">2. Datos que recogemos</h2>
                <p>Recogemos los datos que nos facilitas voluntariamente al registrarte, realizar una reserva o contactar con nosotros: nombre, email, teléfono y datos de pago (gestionados por Stripe). [Completar según caso real]</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">3. Finalidad del tratamiento</h2>
                <p>Gestionar reservas y pagos, enviarte confirmaciones y recordatorios, responder a tus consultas y cumplir obligaciones legales. [Completar según caso real]</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">4. Base legal</h2>
                <p>Ejecución del contrato de prestación de servicios y consentimiento expreso del usuario. [Completar según caso real]</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">5. Derechos del usuario</h2>
                <p>Tienes derecho de acceso, rectificación, supresión, limitación, portabilidad y oposición. Para ejercerlos escríbenos a hola@tikkunkaruna.com. [Completar según caso real]</p>
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
