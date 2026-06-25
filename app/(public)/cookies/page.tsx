import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies | TikkunKaruna",
  description:
    "Política de cookies de TikkunKaruna. Solo usamos cookies para determinar tu país (España u otro) y aplicar el IVA correcto en tu factura.",
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
              Junio 2026
            </p>
            <div className="space-y-6 text-purple-700 font-body text-sm leading-relaxed">
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">1. ¿Qué son las cookies?</h2>
                <p>
                  Las cookies son pequeños archivos de texto que los sitios web almacenan en el navegador del usuario cuando los visita. Permiten que el sitio web recuerde información sobre la visita para mejorar la experiencia.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">2. ¿Qué cookies usamos y para qué?</h2>
                <p className="mb-3">En TikkunKaruna utilizamos una única cookie con una finalidad muy concreta:</p>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 mb-3">
                  <h3 className="font-heading text-lg text-purple-950 mb-1">Cookie de país (tikkun_country)</h3>
                  <p className="text-purple-700">
                    Cuando aceptas las cookies, determinamos tu país mediante tu dirección IP. Si eres de España, almacenamos <strong>ES</strong>; si eres de otro país, almacenamos <strong>OTHER</strong>. Esto nos permite aplicar el IVA correspondiente (21% para España, 0% para fuera de España) en tu factura.
                  </p>
                  <p className="text-purple-500 text-xs mt-2">Duración: 365 días | Tipo: técnica/funcional</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-heading text-lg text-purple-950 mb-1">Cookie de consentimiento (tikkun_cookie_consent)</h3>
                  <p className="text-purple-700">
                    Almacena si has aceptado o rechazado las cookies para no volver a mostrarte el banner en tus próximas visitas.
                  </p>
                  <p className="text-purple-500 text-xs mt-2">Duración: 365 días | Tipo: técnica</p>
                </div>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">3. ¿Compartimos tus datos con terceros?</h2>
                <p>
                  No. No compartimos, vendemos ni cedemos a terceros la información obtenida a través de cookies. El único dato que almacenamos (tu país) se usa exclusivamente para la facturación interna.
                </p>
                <p className="mt-2">
                  Para determinar tu país utilizamos el servicio <strong>ipapi.co</strong>, que no almacena ni registra tu dirección IP. Es una consulta anónima y puntual.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">4. Cómo gestionar las cookies</h2>
                <p>
                  Puedes aceptar o rechazar las cookies mediante el banner que aparece al acceder al sitio web por primera vez. Si rechazas, no almacenaremos ninguna cookie de país y no podremos determinar tu país automáticamente para la factura.
                </p>
                <p className="mt-2">
                  También puedes configurar, bloquear o eliminar las cookies desde la configuración de tu navegador en cualquier momento.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">5. Consentimiento</h2>
                <p>
                  Al hacer clic en &laquo;Aceptar&raquo; en el banner de cookies, consientes el uso de las cookies descritas en esta política. Puedes retirar tu consentimiento en cualquier momento eliminando las cookies desde la configuración de tu navegador.
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
