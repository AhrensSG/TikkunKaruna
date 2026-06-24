import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso Legal | TikkunKaruna",
  description:
    "Información legal de TikkunKaruna. Identificación del titular, propiedad intelectual, exención de responsabilidad y legislación aplicable.",
};

export default function AvisoLegalPage() {
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
            Aviso Legal
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
                <h2 className="font-heading text-2xl text-purple-950 mb-3">1. Identificación del titular</h2>
                <p>
                  En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que el titular del sitio web <strong>www.tikkunkaruna.com</strong> es:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-3">
                  <li><strong>Nombre / Razón social:</strong> Sunnafreyr18 Group SL</li>
                  <li><strong>NIF / CIF:</strong> B23897952</li>
                  <li><strong>Domicilio:</strong> Carrer de les Barques 2, piso 2, 46002 Valencia</li>
                  <li><strong>Correo electrónico:</strong> hola@tikkunkaruna.com</li>
                  <li><strong>Teléfono:</strong> +34 620 89 75 29</li>
                  <li><strong>Denominación comercial:</strong> TikkunKaruna</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">2. Objeto</h2>
                <p>
                  El presente Aviso Legal regula el acceso, navegación y uso del sitio web www.tikkunkaruna.com (en adelante, &laquo;el sitio web&raquo;), así como la prestación de servicios de información y contratación de sesiones de terapias holísticas ofrecidas por el titular.
                </p>
                <p className="mt-2">
                  El acceso al sitio web implica la aceptación plena y sin reservas de todas las disposiciones incluidas en este Aviso Legal, la Política de Privacidad y la Política de Cookies. Si no estás de acuerdo con alguna de ellas, deberás abstenerte de utilizar el sitio web.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">3. Propiedad intelectual e industrial</h2>
                <p>
                  Todos los contenidos del sitio web (textos, imágenes, gráficos, logotipos, iconos, diseño, código fuente, marcas, nombres comerciales y cualquier otro elemento susceptible de protección) son propiedad del titular o se dispone de los derechos necesarios para su explotación, y están protegidos por la normativa vigente de propiedad intelectual e industrial.
                </p>
                <p className="mt-2">
                  Queda expresamente prohibida la reproducción, distribución, comunicación pública, transformación o cualquier otra forma de explotación de los contenidos sin la autorización previa y por escrito del titular, salvo que se realice para uso personal y privado.
                </p>
                <p className="mt-2">
                  El usuario se compromete a respetar los derechos de propiedad intelectual e industrial del titular. El incumplimiento de esta obligación podrá dar lugar a las acciones legales correspondientes.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">4. Exención de responsabilidad</h2>
                <p>
                  El titular no se hace responsable de:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Los daños o perjuicios derivados del uso de la información contenida en el sitio web, incluyendo errores u omisiones en los contenidos.</li>
                  <li>La existencia de virus, malware o cualquier otro elemento dañino que pueda afectar a los sistemas informáticos del usuario como consecuencia de la navegación o descarga de contenidos.</li>
                  <li>Los contenidos o servicios de sitios web de terceros a los que se pueda acceder mediante enlaces incluidos en esta web (el titular no comercializa ni controla dichos contenidos).</li>
                  <li>La falta de disponibilidad temporal del sitio web por razones de mantenimiento técnico, actualizaciones o causas de fuerza mayor.</li>
                </ul>
                <p className="mt-2">
                  Las terapias holísticas ofrecidas a través de esta plataforma tienen carácter complementario y no sustituyen en ningún caso la atención médica, psicológica o psiquiátrica profesional. El usuario es responsable de consultar con un profesional sanitario ante cualquier problema de salud.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">5. Enlaces a terceros</h2>
                <p>
                  Este sitio web puede incluir enlaces a sitios de terceros (Stripe, YouTube, redes sociales, etc.) con el único fin de facilitar el acceso a servicios complementarios. El titular no asume ninguna responsabilidad sobre el contenido, funcionamiento o políticas de privacidad de dichos sitios. La activación de estos enlaces es responsabilidad exclusiva del usuario.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">6. Legislación aplicable y jurisdicción</h2>
                <p>
                  Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier controversia o litigio que pudiera derivarse del uso del sitio web,                   las partes se someten a los juzgados y tribunales de Valencia, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
