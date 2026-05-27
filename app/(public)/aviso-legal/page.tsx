import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso Legal | TikkunKaruna",
};

export default function AvisoLegalPage() {
  return (
    <>
      <section className="bg-purple-950 pt-36 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
              Última actualización: [fecha pendiente]
            </p>
            <div className="space-y-6 text-purple-700 font-body text-sm leading-relaxed">
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">1. Identificación del titular</h2>
                <p>
                  En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que el titular de la presente web es:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-3">
                  <li><strong>Nombre / Razón social:</strong> [Nombre completo pendiente]</li>
                  <li><strong>NIF / CIF:</strong> [NIF pendiente]</li>
                  <li><strong>Domicilio:</strong> [Dirección pendiente]</li>
                  <li><strong>Correo electrónico:</strong> hola@tikkunkaruna.com</li>
                  <li><strong>Teléfono:</strong> [Teléfono pendiente]</li>
                </ul>
              </div>
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">2. Propiedad intelectual</h2>
                <p>Todos los contenidos de esta web (textos, imágenes, logotipos, diseño, etc.) son propiedad de TikkunKaruna o se dispone de los derechos necesarios para su uso. Queda prohibida la reproducción total o parcial sin autorización expresa. [Completar según caso real]</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">3. Exención de responsabilidad</h2>
                <p>El titular de la web no se hace responsable de los daños o perjuicios derivados del uso de la información contenida en este sitio web, ni de los contenidos enlazados a través de terceros. [Completar según caso real]</p>
              </div>
              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">4. Legislación aplicable</h2>
                <p>Las relaciones derivadas del uso de esta web se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de [ciudad pendiente]. [Completar según caso real]</p>
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
