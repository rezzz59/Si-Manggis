"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock, MessageSquare, ArrowRight } from "lucide-react";

const kontakInfo = [
  {
    icon: MapPin,
    label: "Alamat",
    value: "Balai Desa Gunting Manggis, Kalimantan Selatan 70712",
  },
  {
    icon: Phone,
    label: "Telepon / WhatsApp",
    value: "0812-3456-7890",
    href: "tel:081234567890",
  },
  {
    icon: Mail,
    label: "Email",
    value: "desaguntingmanggis@email.com",
    href: "mailto:desagantingmanggis@email.com",
  },
  {
    icon: Clock,
    label: "Jam Operasional",
    value: "Senin – Jumat: 08.00 – 16.00 WIB",
  },
];

export default function KontakPage() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="bg-[#1B4332] pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">
            Hubungi Kami
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Kontak Desa
          </h1>
          <p className="text-white/70 max-w-md text-sm">
            Informasi kontak dan lokasi Kantor Desa Gunting Manggis.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
        {/* Info Kontak */}
        <section className="mb-12">
          <span className="accent-line mb-3 block" />
          <h2 className="text-2xl font-bold text-[#1B4332] mb-6">
            Informasi Kontak
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kontakInfo.map(({ icon: Icon, label, value, href }) => (
              <div
                key={label}
                className="bg-white rounded-xl border border-stone-200 p-5 hover-lift"
              >
                <div className="h-10 w-10 rounded-lg bg-[#1B4332]/10 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-[#1B4332]" />
                </div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">
                  {label}
                </p>
                {href ? (
                  <a
                    href={href}
                    className="text-sm font-semibold text-[#1B4332] hover:underline"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-sm font-semibold text-[#1B4332] leading-snug">
                    {value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Pengaduan */}
        <section className="bg-[#1B4332] rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
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
            className="flex-shrink-0 flex items-center gap-2 bg-white text-[#1B4332] font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#f0fdf4] transition-colors cursor-pointer"
          >
            Kirim Pengaduan
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </main>
  );
}