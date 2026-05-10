"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FileText, Newspaper, Siren, ShieldCheck, Recycle, Heart, Sparkles, ArrowRight, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";

const SEMUA_ITEM = [
  // Layanan
  {
    icon: FileText,
    label: "Ajukan Permohonan",
    desc: "Ajukan surat keterangan, izin domisili, dan lainnya",
    href: "/layanan",
    tag: "Layanan",
  },
  // Form Pengaduan
  {
    icon: Siren,
    label: "Pengaduan Warga",
    desc: "Laporkan masalah di lingkungan sekitar",
    href: "/dashboard/pengaduan",
    tag: "Form",
  },
    // Artikel
  {
    icon: Newspaper,
    label: "Kabar & Artikel",
    desc: "Berita terkini dari kelurahan",
    href: "/artikel",
    tag: "Artikel",
  },
  // Program
  {
    icon: ShieldCheck,
    label: "Kampung KB",
    desc: "Program nasional keluarga berekonomi",
    href: "/profil",
    tag: "Program",
  },
  {
    icon: Recycle,
    label: "Bank Sampah",
    desc: "8 unit bank sampah aktif",
    href: "/profil",
    tag: "Program",
  },
  {
    icon: Heart,
    label: "Home Care Lansia",
    desc: "Pelayanan kesehatan warga lanjut usia",
    href: "/profil",
    tag: "Program",
  },
  {
    icon: Sparkles,
    label: "Kelurahan Bersinar",
    desc: "Wilayah percontohan bersih dari narkoba",
    href: "/profil",
    tag: "Program",
  },
];

const SEMUA_HALAMAN = [
  { label: "Beranda", href: "/" },
  { label: "Profil Kelurahan", href: "/profil" },
  { label: "Layanan & Formulir", href: "/layanan" },
  { label: "Ajukan Pengaduan", href: "/dashboard/pengaduan" },
  { label: "Ajukan Permohonan", href: "/layanan" },
  { label: "Kabar & Artikel", href: "/artikel" },
  { label: "Unit Darurat", href: "/darurat" },
  { label: "Cek Tiket", href: "/cek-tiket" },
  { label: "Login Admin", href: "/masuk" },
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filtered = SEMUA_ITEM.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPages = SEMUA_HALAMAN.filter((p) =>
    p.label.toLowerCase().includes(query.toLowerCase())
  );

  const showDropdown = query.length > 0 && (filtered.length > 0 || filteredPages.length > 0);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalItems = filtered.length + filteredPages.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, totalItems - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const idx = selectedIndex;
      if (idx < filtered.length) {
        router.push(filtered[idx].href);
      } else {
        router.push(filteredPages[idx - filtered.length].href);
      }
      setQuery("");
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={16} className="text-[#94a3b8]" strokeWidth={2} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Cari layanan, dokumen, berita..."
          className="w-full rounded-sm bg-white pl-10 pr-4 py-3.5 text-sm text-[#1e293b] placeholder-[#94a3b8] focus:outline-none"
          style={{ boxShadow: "3px 4px 0 #93c5fd" }}
          autoComplete="off"
        />
      </div>

      {/* Dropdown */}
      {showDropdown && isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-sm overflow-hidden z-50"
          style={{ boxShadow: "3px 4px 0 #bfdbfe" }}
        >
          {/* Items section */}
          {filtered.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-[#eff6ff] transition-colors cursor-pointer ${
                i === selectedIndex ? "bg-[#eff6ff]" : ""
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#eff6ff] flex-shrink-0">
                <item.icon size={15} className="text-[#1e40af]" strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#1e293b] leading-tight">{item.label}</p>
                  <span className="text-[9px] font-bold text-white bg-[#1e40af] px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                    {item.tag}
                  </span>
                </div>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">{item.desc}</p>
              </div>
              <ArrowRight size={12} className="text-[#cbd5e1] flex-shrink-0" />
            </Link>
          ))}

          {/* Halaman section */}
          {filteredPages.length > 0 && (
            <>
              <div className="border-t border-[#e2e8f0] px-4 py-2 bg-[#f8fafc]">
                <p className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Halaman
                </p>
              </div>
              {filteredPages.map((page, i) => (
                <Link
                  key={page.href}
                  href={page.href}
                  onClick={() => {
                    setQuery("");
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 hover:bg-[#f0fdf4] transition-colors cursor-pointer ${
                    filtered.length + i === selectedIndex ? "bg-[#f0fdf4]" : ""
                  }`}
                >
                  <MapPin size={13} className="text-[#16a34a] flex-shrink-0" strokeWidth={1.8} />
                  <p className="text-sm font-medium text-[#1e293b]">{page.label}</p>
                </Link>
              ))}
            </>
          )}

          {/* Footer hint */}
          <div className="px-4 py-2 bg-[#f8fafc] border-t border-[#e2e8f0]">
            <p className="text-[10px] text-[#94a3b8]">
              Tekan ↑↓ navigasi, Enter pilih, Esc tutup
            </p>
          </div>
        </div>
      )}
    </div>
  );
}