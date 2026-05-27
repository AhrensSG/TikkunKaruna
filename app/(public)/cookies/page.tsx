import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies | TikkunKaruna",
};

export default function CookiesPage() {
  return (
    <>
      <section className="bg-purple-950 pt-36 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label mb-4">✦ Legal</p>
          <h1 className="font-heading text-4xl sm:text-5xl text-white mb-4">
            Política de Cookies
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
                <h2 className="font-heading text-2xl text-purple-950 mb-3">1. ¿Qué son las cookies?</h2>
                <p>Las cookies son pequeños archivos de texto que se almacenan en tu navegador cuando visitas un sitio web. Permiten que el sitio recuerde tus preferencias y comportamiento durante un período de tiempo. [Completar según caso real]</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">2. Tipos de cookies que utilizamos</h2>
                <p><strong>Cookies técnicas:</strong> Necesarias para el funcionamiento básico del sitio, como la autenticación y la seguridad de la plataforma.</p>
                <p><strong>Cookies analíticas:</strong> Nos permiten medir y analizar el tráfico y el comportamiento de los usuarios en el sitio para mejorar la experiencia. [Indicar si se usa Google Analytics u otra herramienta]</p>
                <p><strong>Cookies de preferencias:</strong> Recuerdan tus preferencias (idioma, moneda, etc.) para personalizar tu experiencia. [Completar según caso real]</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">3. Cookies de terceros</h2>
                <p>Utilizamos servicios de terceros como Stripe (procesador de pagos) que pueden establecer cookies propias para garantizar la seguridad y funcionalidad de los pagos online. [Completar con los servicios que se usen realmente]</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">4. Gestión de cookies</h2>
                <p>Puedes configurar, bloquear o eliminar las cookies en cualquier momento a través de la configuración de tu navegador. A continuación, te indicamos los enlaces para los navegadores más comunes:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Chrome: [enlace pendiente]</li>
                  <li>Firefox: [enlace pendiente]</li>
                  <li>Safari: [enlace pendiente]</li>
                  <li>Edge: [enlace pendiente]</li>
                </ul>
              </div>
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">5. Más información</h2>
                <p>Si tienes preguntas sobre nuestra política de cookies, escríbenos a hola@tikkunkaruna.com. [Completar según caso real]</p>
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
