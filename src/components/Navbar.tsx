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
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isTransparent = !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-white shadow-sm border-b border-[#E7E5E4]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1B4332]">
                <span className="text-lg font-bold text-white">SM</span>
              </div>
              <span
                className={`text-xl font-bold transition-colors duration-300 ${
                  isTransparent ? "text-white drop-shadow-sm" : "text-[#1B4332]"
                }`}
              >
                Si-Manggis
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isTransparent
                    ? "text-white/85 hover:text-white"
                    : "text-[#57534E] hover:text-[#1B4332]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/masuk"
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-200 ${
                isTransparent
                  ? "bg-[#EA580C] text-white hover:bg-[#C2410C]"
                  : "bg-[#1B4332] text-white hover:bg-[#2D5016]"
              }`}
            >
              Masuk
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`p-1 transition-colors duration-200 ${
                isTransparent ? "text-white drop-shadow-sm" : "text-[#1C1917]"
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-[#E7E5E4] bg-white pb-3">
            <div className="space-y-0.5 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-[#57534E] hover:text-[#1B4332] hover:bg-[#F5F5F4] rounded-lg mx-1 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/masuk"
                onClick={() => setIsOpen(false)}
                className="mx-1 mt-2 block rounded-full bg-[#1B4332] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#2D5016] transition-colors"
              >
                Masuk
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
