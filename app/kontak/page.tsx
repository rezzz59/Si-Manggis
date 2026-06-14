"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock, MessageSquare, ArrowRight } from "lucide-react";

const kontakInfo = [
  {
    icon: MapPin,
    label: "Alamat",
    value: "Balai Desa Guntung Manggis, Kota Banjarbaru, Kalimantan Selatan 70721",
  },
  {
    icon: Phone,
    label: "Telepon / WhatsApp",
    value: "0812-3456-7890",
    href: "tel:+6281234567890",
  },
  {
    icon: Mail,
    label: "Email",
    value: "desaguntungmanggis@email.com",
    href: "mailto:desaguntungmanggis@email.com",
  },
  {
    icon: Clock,
    label: "Jam Operasional",
    value: "Senin–Jumat, 08.00–16.00 WIB",
  },
];

export default function KontakPage() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="public-hero">
        <div className="public-shell">
          <p className="public-kicker !border-white/40 !bg-white/10 !text-white before:!bg-white">
            Hubungi Kami
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Kontak Desa
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
            Informasi kontak dan lokasi Kantor Desa Gunting Manggis.
          </p>
        </div>
      </section>

      <div className="public-shell public-section">
        {/* Info Kontak */}
        <section className="mb-12">
          <span className="section-kicker">Informasi Layanan</span>
          <h2 className="mt-3 public-title mb-6">Informasi Kontak</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kontakInfo.map(({ icon: Icon, label, value, href }) => (
              <div
                key={label}
                className="public-card p-5"
              >
                <div className="h-10 w-10 rounded-lg bg-[#eaf6ef] flex items-center justify-center mb-3">
                  <Icon size={18} className="text-[#1f7a4f]" />
                </div>
                <p className="public-meta font-semibold uppercase tracking-wide mb-1">
                  {label}
                </p>
                {href ? (
                  <a
                    href={href}
                    className="text-sm font-semibold text-[#1f7a4f] hover:underline"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-sm font-semibold text-[#1f7a4f] leading-snug">
                    {value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Pengaduan */}
        <section className="public-card bg-gradient-to-r from-[#1f7a4f] to-[#14532d] rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={20} className="text-white/70" />
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest">
                Layanan Warga
              </p>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              Ajukan Pengaduan atau Aspirasi
            </h3>
            <p className="text-white/70 text-sm">
              Sampaikan keluhan Anda dilengkapi foto dan lokasi agar kami bisa menindak lanjuti dengan tepat.
            </p>
          </div>
          <Link
            href="/pengaduan"
            className="public-btn-soft flex-shrink-0 bg-white text-[#14532d] border-white px-6 py-3 text-sm cursor-pointer"
          >
            Kirim Pengaduan
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </main>
  );
}