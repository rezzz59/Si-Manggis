"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Layanan", href: "/layanan" },
  { label: "Darurat", href: "/darurat" },
  { label: "Kabar", href: "/artikel" },
  { label: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        transparent
          ? "bg-transparent border-b border-transparent"
          : "bg-white border-b border-[#e2e8f0] shadow-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#1e40af]">
                <span className="text-base font-bold text-white">SM</span>
              </div>
              <span
                className={`text-xl font-bold transition-colors duration-200 ${
                  transparent ? "text-white" : "text-[#1e293b]"
                }`}
              >
                Si-Manggis
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-150 ${
                  transparent
                    ? "text-white/80 hover:text-white"
                    : "text-[#64748b] hover:text-[#1e40af]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/masuk"
              className={`rounded-sm px-5 py-2 text-sm font-semibold transition-colors duration-150 cursor-pointer ${
                transparent
                  ? "bg-white text-[#1e40af] hover:bg-white/90"
                  : "bg-[#1e40af] text-white hover:bg-[#1e3a8a]"
              }`}
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`p-1 transition-colors duration-150 cursor-pointer ${
                transparent ? "text-white" : "text-[#1e293b]"
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-[#e2e8f0] bg-white pb-3">
            <div className="space-y-0.5 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-[#64748b] hover:text-[#1e40af] hover:bg-[#f1f5f9] rounded-sm mx-1 transition-colors duration-150 cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/masuk"
                onClick={() => setIsOpen(false)}
                className="mx-1 mt-2 block rounded-sm bg-[#1e40af] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#1e3a8a] transition-colors duration-150 cursor-pointer"
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
