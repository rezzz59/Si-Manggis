"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, Menu, X } from "lucide-react";

type NavLink = {
  label: string;
  href: string;
  emergency?: boolean;
};

const navLinks: NavLink[] = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Layanan", href: "/layanan" },
  { label: "Cek Tiket", href: "/cek-tiket" },
  { label: "Pengaduan", href: "/pengaduan" },
  { label: "Darurat", href: "/darurat", emergency: true },
  { label: "Kabar", href: "/artikel" },
  { label: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isDashboardArea = useMemo(() => pathname?.startsWith("/dashboard"), [pathname]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isDashboardArea) return;

    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMounted, isDashboardArea]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (!isMounted) return null;
  if (isDashboardArea) return null;

  const transparent = pathname === "/" && !scrolled && !isOpen;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-[#dbe6df]/80 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[74px] items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#16a34a] to-[#15803d] shadow-sm ring-1 ring-[#15803d]/20 transition-transform duration-200 group-hover:scale-[1.03]">
              <span className="text-sm font-extrabold tracking-wide text-white">SM</span>
            </div>
            <div className="leading-tight">
              <p className={`text-base font-bold tracking-tight ${transparent ? "text-white" : "text-[#0f172a]"}`}>
                SI-MANGGIS
              </p>
              <p className={`text-[11px] ${transparent ? "text-white/80" : "text-[#64748b]"}`}>Layanan Kelurahan Digital</p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              if (link.emergency) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`ml-1 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
                      active
                        ? "bg-red-100 text-red-700 ring-1 ring-red-200"
                        : transparent
                        ? "bg-white/15 text-white hover:bg-white/25"
                        : "bg-red-50 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    <AlertTriangle size={14} />
                    {link.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    active
                      ? transparent
                        ? "bg-white/20 text-white"
                        : "bg-[#dcfce7] text-[#15803d]"
                      : transparent
                      ? "text-white/85 hover:text-white"
                      : "text-[#475569] hover:bg-[#f0fdf4] hover:text-[#15803d]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/login"
              className={`ml-2 inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                transparent
                  ? "bg-white text-[#15803d] hover:bg-white/90"
                  : "bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white hover:from-[#15803d] hover:to-[#166534] shadow-sm"
              }`}
            >
              Dashboard
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={`inline-flex items-center justify-center rounded-lg p-2 transition-colors md:hidden ${
              transparent ? "text-white hover:bg-white/15" : "text-[#0f172a] hover:bg-[#f8fafc]"
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="mb-3 rounded-2xl border border-[#dbe6df] bg-white p-2 shadow-lg">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const emergency = Boolean(link.emergency);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`mb-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors last:mb-0 ${
                      emergency
                        ? active
                          ? "bg-red-100 text-red-700"
                          : "bg-red-50 text-red-700 hover:bg-red-100"
                        : active
                        ? "bg-[#dcfce7] text-[#15803d]"
                        : "text-[#475569] hover:bg-[#f0fdf4] hover:text-[#15803d]"
                    }`}
                  >
                    {emergency ? <AlertTriangle size={16} /> : null}
                    {link.label}
                  </Link>
                );
              })}

              <Link
                href="/login"
                className="mt-2 block rounded-xl bg-gradient-to-r from-[#16a34a] to-[#15803d] px-4 py-2.5 text-center text-sm font-semibold text-white hover:from-[#15803d] hover:to-[#166534]"
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
