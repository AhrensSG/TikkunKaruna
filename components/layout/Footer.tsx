import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">TikkunKaruna</h3>
            <p className="text-sm">
              Espacio de terapias holísticas para el bienestar integral.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-indigo-400 transition-colors">Sobre nosotros</Link></li>
              <li><Link href="/services" className="hover:text-indigo-400 transition-colors">Terapias</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-indigo-400 transition-colors">Términos y condiciones</Link></li>
              <li><Link href="/privacy" className="hover:text-indigo-400 transition-colors">Política de privacidad</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} TikkunKaruna. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
