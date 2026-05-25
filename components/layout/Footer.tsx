import Link from "next/link";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import LogoMark from "@/components/ui/LogoMark";

/* ── Brand SVG icons ── */
function IconInstagram({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconFacebook({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const footerLinks = {
  navegacion: [
    { href: "/", label: "Inicio" },
    { href: "/services", label: "Terapias" },
    { href: "/about", label: "Sobre Inma" },
    { href: "/contact", label: "Contacto" },
  ],
  legal: [
    { href: "/privacy", label: "Política de privacidad" },
    { href: "/terms", label: "Términos y condiciones" },
  ],
};

const socialLinks = [
  { href: "https://instagram.com/@tikkunkaruna", label: "Instagram", Icon: IconInstagram },
  { href: "https://facebook.com/@tikkunkaruna", label: "Facebook", Icon: IconFacebook },
  { href: "https://wa.me/34600000000", label: "WhatsApp", Icon: MessageCircle },
];

export default function Footer() {
  return (
    <footer className="bg-purple-950 text-purple-200 border-t border-purple-800/40">
      {/* ── Main footer ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              <LogoMark size="sm" />
              <span className="font-heading text-2xl text-white">
                Tikkun<span className="text-gold-500">Karuna</span>
              </span>
            </Link>
            <p className="text-purple-300 text-sm leading-relaxed mb-6 max-w-sm font-body">
              Plataforma profesional de terapias holísticas individuales.
              Un espacio de sanación, transformación y bienestar integral.
            </p>
            {/* Contact info */}
            <div className="space-y-2">
              <a
                href="mailto:hola@tikkunkaruna.com"
                className="flex items-center gap-2 text-purple-300 hover:text-gold-400 transition-colors text-sm font-body"
              >
                <Mail size={15} className="text-gold-600" />
                hola@tikkunkaruna.com
              </a>
              <div className="flex items-center gap-2 text-purple-300 text-sm font-body">
                <MapPin size={15} className="text-gold-600" />
                España
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading text-white text-lg mb-4">Navegación</h4>
            <div className="gold-divider mb-5" style={{ margin: "0 0 1.25rem" }} />
            <ul className="space-y-3">
              {footerLinks.navegacion.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-purple-300 hover:text-gold-400 transition-colors text-sm font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading text-white text-lg mb-4">Legal</h4>
            <div className="gold-divider mb-5" style={{ margin: "0 0 1.25rem" }} />
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-purple-300 hover:text-gold-400 transition-colors text-sm font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-purple-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-purple-400 text-xs font-body">
            © {new Date().getFullYear()} TikkunKaruna · Todos los derechos reservados
          </p>

          {/* Social */}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full border border-purple-700 flex items-center justify-center text-purple-400 hover:border-gold-500 hover:text-gold-400 transition-all duration-200"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          <p className="text-purple-500 text-xs font-body">
            ✦ Desarrollado por{" "}
            <a
              href="https://maseroweb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-700 hover:text-gold-500 transition-colors"
            >
              Masero Web Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
