"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";
import LogoMark from "@/components/ui/LogoMark";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/services", label: "Terapias" },
  { href: "/about", label: "Sobre Inma" },
  { href: "/contact", label: "Contacto" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-purple-950/95 backdrop-blur-md shadow-xl shadow-purple-950/30 border-b border-purple-800/40"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group">
            <LogoMark
              size="sm"
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <span className="font-heading text-xl text-white tracking-wide">
                Tikkun
                <span className="text-gold-500">Karuna</span>
              </span>
            </div>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-purple-200 hover:text-gold-400 transition-colors duration-200 text-sm tracking-wide font-body"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Desktop CTAs ── */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-purple-200 hover:text-white text-sm font-body transition-colors duration-200"
            >
              Acceder
            </Link>
            <Link
              href="/services"
              className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-purple-950 text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-gold-500/30 hover:-translate-y-px"
            >
              <Sparkles size={14} />
              Reservar cita
            </Link>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-purple-800/50 transition-colors"
            aria-label="Abrir menú"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-purple-800/60 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-purple-200 hover:text-gold-400 hover:bg-purple-900/50 rounded-lg transition-all font-body text-sm"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-3 pb-2 flex flex-col gap-3">
              <Link
                href="/login"
                className="text-center text-purple-200 text-sm border border-purple-700 rounded-full py-2.5 hover:border-gold-500 hover:text-gold-400 transition-all font-body"
                onClick={() => setIsOpen(false)}
              >
                Acceder
              </Link>
              <Link
                href="/services"
                className="text-center flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-purple-950 font-semibold rounded-full py-2.5 transition-all text-sm"
                onClick={() => setIsOpen(false)}
              >
                <Sparkles size={14} />
                Reservar cita
              </Link>
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
}
