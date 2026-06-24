import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies | TikkunKaruna",
  description:
    "Conoce cómo TikkunKaruna utiliza las cookies técnicas, analíticas y de terceros. Gestiona tus preferencias y protege tu privacidad en nuestra plataforma.",
};

export default function CookiesPage() {
  return (
    <>
      <section className="bg-purple-950 pt-36 pb-20 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-700/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
              Última actualización: 8 de junio de 2026
            </p>
            <div className="space-y-6 text-purple-700 font-body text-sm leading-relaxed">
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">1. ¿Qué son las cookies?</h2>
                <p>
                  Las cookies son pequeños archivos de texto que los sitios web almacenan en el navegador del usuario cuando los visita. Permiten que el sitio web recuerde información sobre la visita, como el idioma preferido, las opciones de navegación u otros datos, facilitando la siguiente visita y haciendo que el sitio sea más útil.
                </p>
                <p className="mt-2">
                  También pueden utilizarse tecnologías similares como píxeles de seguimiento, etiquetas o localStorage. En esta política, el término &laquo;cookies&raquo; abarca todas estas tecnologías.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">2. Tipos de cookies que utilizamos</h2>
                <p className="mb-3">En TikkunKaruna utilizamos las siguientes categorías de cookies:</p>

                <h3 className="font-heading text-lg text-purple-950 mt-5 mb-2">Cookies técnicas (necesarias)</h3>
                <p>
                  Son esenciales para el funcionamiento básico del sitio web y permiten la navegación y el acceso a áreas seguras. Sin estas cookies, el sitio no puede funcionar correctamente. Entre ellas se incluyen las cookies de autenticación (para mantener la sesión iniciada), de seguridad y de gestión de la plataforma de pago.
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2 text-purple-600">
                  <li><strong>next-auth.*</strong> &mdash; Gestión de sesión de usuario</li>
                  <li><strong>__stripe_*</strong> &mdash; Seguridad y prevención de fraude en pagos</li>
                </ul>

                <h3 className="font-heading text-lg text-purple-950 mt-5 mb-2">Cookies analíticas</h3>
                <p>
                  Actualmente no utilizamos herramientas de análisis de terceros. Si en el futuro implementáramos herramientas analíticas, actualizaríamos esta política para informar de forma transparente.
                </p>

                <h3 className="font-heading text-lg text-purple-950 mt-5 mb-2">Cookies de preferencias</h3>
                <p>
                  Permiten recordar las preferencias del usuario (como el idioma o la moneda) para personalizar la experiencia de navegación. Actualmente no utilizamos cookies de preferencias, pero si en el futuro las implementáramos, actualizaríamos esta política.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">3. Cookies de terceros</h2>
                <p>
                  En nuestro sitio web se utilizan cookies de terceros proveedores de servicios:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-3">
                  <li>
                    <strong>Stripe</strong> &mdash; Establece cookies necesarias para procesar los pagos online de forma segura y prevenir el fraude. Stripe puede almacenar cookies propias durante el proceso de pago. Más información en la <a href="https://stripe.com/es/privacy" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-500 underline">Política de Privacidad de Stripe</a>.
                  </li>
                  <li>
                    <strong>NextAuth.js</strong> &mdash; Utiliza cookies técnicas para gestionar la autenticación de usuarios de forma segura.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">4. Gestión y configuración de cookies</h2>
                <p>
                  Puedes configurar, bloquear o eliminar las cookies en cualquier momento a través de la configuración de tu navegador. También puedes rechazar la instalación de cookies no esenciales mediante el banner de cookies que aparece al acceder al sitio web.
                </p>
                <p className="mt-3">A continuación, te indicamos los enlaces para gestionar las cookies en los navegadores más comunes:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>
                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-500 underline">
                      Google Chrome
                    </a>
                  </li>
                  <li>
                    <a href="https://support.mozilla.org/es/kb/proteccion-antirastreo-mejorada-de-firefox" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-500 underline">
                      Mozilla Firefox
                    </a>
                  </li>
                  <li>
                    <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-500 underline">
                      Safari (Apple)
                    </a>
                  </li>
                  <li>
                    <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-500 underline">
                      Microsoft Edge
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">5. Consentimiento</h2>
                <p>
                  Al acceder por primera vez a nuestro sitio web, se muestra un banner de cookies que te informa de su uso y te permite aceptar o rechazar las cookies no esenciales. Las cookies técnicas no requieren consentimiento, ya que son necesarias para el funcionamiento del sitio.
                </p>
                <p className="mt-2">
                  Puedes retirar tu consentimiento en cualquier momento eliminando las cookies a través de la configuración de tu navegador.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">6. Más información</h2>
                <p>
                  Si tienes cualquier duda sobre nuestra política de cookies, puedes contactarnos en <strong>hola@tikkunkaruna.com</strong>. También puedes consultar nuestra <a href="/privacidad" className="text-gold-600 hover:text-gold-500 underline">Política de Privacidad</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
