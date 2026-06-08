import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | TikkunKaruna",
};

export default function PrivacidadPage() {
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
            Política de Privacidad
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
                <h2 className="font-heading text-2xl text-purple-950 mb-3">1. Responsable del tratamiento</h2>
                <p>
                  En cumplimiento del Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y Garantía de los Derechos Digitales (LOPDGDD), se informa de que el responsable del tratamiento de los datos personales recogidos a través de este sitio web es:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-3">
                  <li><strong>Identidad:</strong> [Nombre completo del responsable]</li>
                  <li><strong>NIF / CIF:</strong> [NIF/CIF]</li>
                  <li><strong>Domicilio:</strong> [Dirección física]</li>
                  <li><strong>Correo electrónico:</strong> hola@tikkunkaruna.com</li>
                  <li><strong>Teléfono:</strong> [Teléfono]</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">2. Datos personales que recogemos</h2>
                <p>Recogemos los siguientes datos personales, en función de la interacción del usuario con la plataforma:</p>
                <ul className="list-disc pl-5 space-y-1 mt-3">
                  <li><strong>Datos de registro:</strong> nombre, apellidos, correo electrónico y contraseña cifrada, proporcionados al crear una cuenta.</li>
                  <li><strong>Datos de reserva:</strong> teléfono, fecha y hora de la sesión, terapia seleccionada y cualquier información adicional que el usuario facilite voluntariamente en el proceso de reserva.</li>
                  <li><strong>Datos de pago:</strong> la información de pago (número de tarjeta, datos bancarios) es gestionada exclusivamente por Stripe, Inc. TikkunKaruna no almacena ni tiene acceso a los datos completos de la tarjeta bancaria. Únicamente recibimos de Stripe el identificador de la transacción y el estado del pago.</li>
                  <li><strong>Datos de comunicación:</strong> información que el usuario proporciona al contactar con nosotros a través del formulario de contacto o correo electrónico.</li>
                  <li><strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas, duración de la visita y otros datos de uso anónimos recogidos a través de cookies (consulta nuestra Política de Cookies para más información).</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">3. Finalidad del tratamiento</h2>
                <p>Los datos personales recogidos se tratan con las siguientes finalidades:</p>
                <ul className="list-disc pl-5 space-y-1 mt-3">
                  <li><strong>Gestión de la cuenta:</strong> crear, mantener y gestionar la cuenta de usuario, permitir el acceso al área privada y gestionar las preferencias del usuario.</li>
                  <li><strong>Gestión de reservas y pagos:</strong> procesar las reservas de sesiones, gestionar el cobro a través de Stripe y enviar confirmaciones y recordatorios de las sesiones.</li>
                  <li><strong>Comunicación:</strong> responder a consultas y solicitudes de información realizadas a través del formulario de contacto o correo electrónico.</li>
                  <li><strong>Envío de comunicaciones comerciales (solo con consentimiento):</strong> informar sobre novedades, promociones y eventos relacionados con TikkunKaruna, siempre que el usuario haya prestado su consentimiento expreso.</li>
                  <li><strong>Cumplimiento de obligaciones legales:</strong> facturación, obligaciones fiscales y contables derivadas de la prestación de servicios.</li>
                  <li><strong>Mejora del servicio:</strong> analizar el uso de la plataforma para mejorar la experiencia del usuario y optimizar los servicios ofrecidos.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">4. Base legal del tratamiento</h2>
                <p>El tratamiento de datos se basa en las siguientes bases legales:</p>
                <ul className="list-disc pl-5 space-y-1 mt-3">
                  <li><strong>Ejecución de un contrato:</strong> la gestión de la cuenta, reservas y pagos es necesaria para la prestación de los servicios solicitados por el usuario (art. 6.1.b RGPD).</li>
                  <li><strong>Consentimiento expreso:</strong> el envío de comunicaciones comerciales y, cuando proceda, el tratamiento de datos de salud se basa en el consentimiento del usuario (art. 6.1.a y art. 9.2.a RGPD).</li>
                  <li><strong>Cumplimiento de obligaciones legales:</strong> la facturación y conservación de datos por obligaciones fiscales (art. 6.1.c RGPD).</li>
                  <li><strong>Interés legítimo:</strong> el análisis de uso y mejora del servicio, siempre que no prevalezcan los derechos e intereses del usuario (art. 6.1.f RGPD).</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">5. Plazo de conservación</h2>
                <p>
                  Los datos personales se conservarán durante el tiempo necesario para cumplir con la finalidad para la que fueron recogidos, y en todo caso durante los plazos legales establecidos por la normativa fiscal y contable (generalmente 5 años desde la última confirmación de la relación contractual). Una vez finalizado el plazo, los datos serán bloqueados y posteriormente eliminados de forma segura.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">6. Destinatarios de los datos</h2>
                <p>
                  TikkunKaruna no cede datos personales a terceros, salvo que sea necesario para la prestación del servicio o exista obligación legal. Los siguientes encargados de tratamiento tienen acceso a datos personales:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-3">
                  <li><strong>Stripe, Inc.</strong> &mdash; procesador de pagos. Se rige por su propia política de privacidad y seguridad. Opera bajo estándares PCI-DSS.</li>
                  <li><strong>Vercel Inc.</strong> &mdash; proveedor de alojamiento web (hosting). Los datos se almacenan en servidores ubicados en la Unión Europea.</li>
                  <li><strong>Railway Corporation</strong> &mdash; proveedor de base de datos PostgreSQL.</li>
                  <li><strong>[Nombre del proveedor de email]</strong> &mdash; envío de correos transaccionales (confirmaciones y recordatorios).</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">7. Transferencias internacionales</h2>
                <p>
                  Stripe, Inc. es una empresa con sede en Estados Unidos. La transferencia de datos a Stripe se ampara en las Cláusulas Contractuales Tipo (SCC) adoptadas por la Comisión Europea, que garantizan un nivel adecuado de protección de datos. Para más información, consulta la <a href="https://stripe.com/es/privacy" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-500 underline">Política de Privacidad de Stripe</a>.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">8. Derechos del usuario</h2>
                <p>El usuario tiene derecho a:</p>
                <ul className="list-disc pl-5 space-y-1 mt-3">
                  <li><strong>Acceder</strong> a sus datos personales y conocer si estamos tratando datos suyos.</li>
                  <li><strong>Rectificar</strong> los datos inexactos o incompletos.</li>
                  <li><strong>Suprimir</strong> sus datos cuando ya no sean necesarios para la finalidad para la que fueron recogidos.</li>
                  <li><strong>Limitar</strong> el tratamiento de sus datos en determinadas circunstancias.</li>
                  <li><strong>Portar</strong> sus datos a otro responsable del tratamiento en un formato estructurado.</li>
                  <li><strong>Oponerse</strong> al tratamiento de sus datos para fines de marketing directo o cuando el tratamiento se base en un interés legítimo.</li>
                  <li><strong>Retirar el consentimiento</strong> en cualquier momento, sin que ello afecte a la licitud del tratamiento basado en el consentimiento previo a su retirada.</li>
                </ul>
                <p className="mt-3">
                  Para ejercer cualquiera de estos derechos, el usuario puede enviar una solicitud a <strong>hola@tikkunkaruna.com</strong> indicando el derecho que desea ejercer y adjuntando una copia de su documento de identidad. También puede presentar una reclamación ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong> si considera que no hemos tratado sus datos correctamente.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">9. Medidas de seguridad</h2>
                <p>
                  TikkunKaruna adopta las medidas técnicas y organizativas necesarias para garantizar la seguridad e integridad de los datos personales, de acuerdo con el estado de la tecnología, la naturaleza de los datos y los riesgos a los que están expuestos. Estas medidas incluyen el cifrado de comunicaciones mediante protocolo HTTPS, el cifrado de contraseñas, y la limitación de accesos a los datos al personal autorizado.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">10. Datos de menores</h2>
                <p>
                  Los servicios de TikkunKaruna están dirigidos a mayores de 18 años. No recogemos de forma consciente datos personales de menores de edad. Si un menor nos ha proporcionado sus datos sin consentimiento parental, los eliminaremos tan pronto como tengamos conocimiento de ello.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
