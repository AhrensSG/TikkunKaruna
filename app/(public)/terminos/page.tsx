import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | TikkunKaruna",
};

export default function TerminosPage() {
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
            Términos y Condiciones
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
                <h2 className="font-heading text-2xl text-purple-950 mb-3">1. Objeto</h2>
                <p>
                  Las presentes condiciones generales (en adelante, &laquo;Condiciones&raquo;) regulan el acceso, registro y uso de la plataforma online TikkunKaruna (www.tikkunkaruna.com), así como la contratación de sesiones de terapias holísticas individuales ofrecidas a través de la misma.
                </p>
                <p className="mt-2">
                  Al registrarse y utilizar la plataforma, el usuario acepta expresamente estas Condiciones. Si no está de acuerdo con alguna de ellas, deberá abstenerse de utilizar los servicios.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">2. Descripción del servicio</h2>
                <p>
                  TikkunKaruna es una plataforma que permite a los usuarios reservar y contratar sesiones individuales de terapias holísticas con Inma, terapeuta especializada.                   Las sesiones se realizan de forma presencial en Valencia u online mediante videollamada, según la terapia seleccionada.
                </p>
                <p className="mt-2">
                  La descripción detallada de cada terapia (duración, precio, requisitos y beneficios) está disponible en la sección de Terapias de la plataforma.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">3. Registro de usuario</h2>
                <p>
                  Para realizar una reserva es necesario registrarse en la plataforma. El usuario se compromete a proporcionar información veraz y mantenerla actualizada. La contraseña es personal e intransferible, y el usuario es responsable de mantener su confidencialidad.
                </p>
                <p className="mt-2">
                  El usuario será el único responsable de todas las actividades que se realicen desde su cuenta. En caso de sospecha de uso no autorizado, deberá contactar inmediatamente con TikkunKaruna.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">4. Proceso de reserva y pago</h2>
                <p>El proceso de contratación se realiza de la siguiente forma:</p>
                <ol className="list-decimal pl-5 space-y-1 mt-3">
                  <li>El usuario selecciona la terapia deseada y elige una fecha y hora disponible en el calendario.</li>
                  <li>Revisa el resumen de su reserva y procede al pago.</li>
                  <li>El pago se realiza a través de la pasarela de pago seguro Stripe, que acepta tarjetas de crédito/débito y otros métodos de pago habilitados.</li>
                  <li>Una vez confirmado el pago, el usuario recibe la confirmación de su reserva por correo electrónico y, si está configurado, por WhatsApp.</li>
                </ol>
                <p className="mt-3">
                  El precio de cada terapia es el indicado en la plataforma en el momento de la reserva, con los impuestos aplicables incluidos. TikkunKaruna se reserva el derecho de modificar los precios en cualquier momento, sin que ello afecte a las reservas ya confirmadas.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">5. Cancelaciones y reembolsos</h2>
                <p>La política de cancelación es la siguiente:</p>
                <ul className="list-disc pl-5 space-y-1 mt-3">
                  <li><strong>Cancelación con más de 24 horas de antelación:</strong> se reembolsará el importe íntegro de la sesión, descontando únicamente las comisiones de procesamiento de pago (generalmente 2-3% del importe).</li>
                  <li><strong>Cancelación entre 24 y 2 horas antes de la sesión:</strong> se ofrecerá la opción de reprogramar la sesión sin coste adicional, siempre que haya disponibilidad. No se realizará reembolso económico.</li>
                  <li><strong>Cancelación con menos de 2 horas de antelación o no presentación:</strong> no se realizará reembolso ni se permitirá reprogramar, salvo causas de fuerza mayor debidamente justificadas.</li>
                  <li><strong>Cancelación por parte de TikkunKaruna:</strong> si la terapeuta cancela la sesión por cualquier motivo, se ofrecerá al usuario la opción de reprogramar sin coste o el reembolso íntegro del importe.</li>
                </ul>
                <p className="mt-3">
                  Para solicitar una cancelación o reprogramación, el usuario debe contactar a través del área de dashboard o mediante el correo electrónico hola@tikkunkaruna.com.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">6. Responsabilidad y exención</h2>
                <p>
                  Las terapias holísticas ofrecidas en TikkunKaruna tienen un enfoque complementario y de bienestar. En ningún caso sustituyen la atención médica, psicológica, psiquiátrica o de cualquier otro profesional sanitario colegiado. El usuario reconoce que:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-3">
                  <li>Las terapias no diagnostican, tratan ni curan enfermedades o condiciones médicas.</li>
                  <li>El usuario es responsable de consultar con un médico o profesional sanitario ante cualquier problema de salud, y de informar a la terapeuta sobre cualquier condición relevante antes de la sesión.</li>
                  <li>Los resultados de las terapias pueden variar según cada persona y no están garantizados.</li>
                </ul>
                <p className="mt-3">
                  TikkunKaruna no se hace responsable de los daños o perjuicios que pudieran derivarse del uso de la información o servicios ofrecidos, ni de la suspensión temporal del servicio por causas técnicas o de fuerza mayor.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">7. Obligaciones del usuario</h2>
                <p>El usuario se compromete a:</p>
                <ul className="list-disc pl-5 space-y-1 mt-3">
                  <li>Hacer un uso adecuado de la plataforma y de los servicios contratados, cumpliendo con la legislación vigente y estas Condiciones.</li>
                  <li>No realizar actos que puedan dañar, deshabilitar o sobrecargar la infraestructura de la plataforma.</li>
                  <li>No utilizar la plataforma para fines fraudulentos o ilícitos.</li>
                  <li>Llegar puntual a las sesiones concertadas. En caso de retraso, la sesión finalizará a la hora prevista, sin derecho a reembolso ni ampliación del tiempo.</li>
                  <li>Respetar el descanso y las condiciones de la terapeuta, incluyendo la comunicación con antelación suficiente para cambios o cancelaciones.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">8. Propiedad intelectual</h2>
                <p>
                  Todos los contenidos de la plataforma (textos, imágenes, vídeos, logotipos, diseños, etc.) son propiedad de TikkunKaruna o se dispone de los derechos necesarios para su uso. Queda prohibida la reproducción, distribución o modificación sin autorización expresa del titular. El incumplimiento podrá dar lugar a las acciones legales correspondientes.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">9. Protección de datos</h2>
                <p>
                  El tratamiento de los datos personales se realiza conforme a nuestra <a href="/privacidad" className="text-gold-600 hover:text-gold-500 underline">Política de Privacidad</a>. Al registrarse y utilizar la plataforma, el usuario acepta dicha política.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">10. Modificaciones</h2>
                <p>
                  TikkunKaruna se reserva el derecho de modificar estas Condiciones en cualquier momento. Los cambios serán notificados a los usuarios a través de la plataforma o por correo electrónico con al menos 15 días de antelación a su entrada en vigor. El uso continuado de la plataforma después de dicha notificación implicará la aceptación de las nuevas condiciones.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">11. Legislación aplicable y jurisdicción</h2>
                <p>
                  Estas Condiciones se rigen por la legislación española. Para cualquier controversia o litigio derivado de las mismas,                   las partes se someten a los juzgados y tribunales de Valencia, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-purple-950 mb-3">12. Contacto</h2>
                <p>
                  Para cualquier consulta sobre estas Condiciones, puedes contactarnos en <strong>hola@tikkunkaruna.com</strong> o a través del <a href="/contacto" className="text-gold-600 hover:text-gold-500 underline">formulario de contacto</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
