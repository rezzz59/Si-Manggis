"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  ArrowRight,
  Building2,
  BadgeCheck,
  Timer,
} from "lucide-react";

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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f5132] via-[#17633f] to-[#0b3a25]">
        <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-14 -bottom-24 h-72 w-72 rounded-full bg-[#8de7b8]/20 blur-3xl" />

        <div className="public-shell relative pt-24 pb-14 sm:pt-28 sm:pb-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
            <Building2 size={14} />
            Hubungi Kami
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            Kontak Desa
            <span className="block text-[#d7fbe8]">Guntung Manggis</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
            Informasi resmi kontak, lokasi kantor, dan jam layanan untuk membantu kebutuhan administrasi warga secara cepat dan tepat.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white">
              <p className="text-xs uppercase tracking-[0.12em] text-white/80">Kanal Utama</p>
              <p className="mt-1 text-xl font-extrabold">WhatsApp</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white">
              <p className="text-xs uppercase tracking-[0.12em] text-white/80">Jam Layanan</p>
              <p className="mt-1 text-xl font-extrabold">08:00–16:00</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white">
              <p className="text-xs uppercase tracking-[0.12em] text-white/80">Estimasi Respon</p>
              <p className="mt-1 text-xl font-extrabold">{"<"} 1 Hari Kerja</p>
            </div>
          </div>
        </div>
      </section>

      <section className="public-section bg-[radial-gradient(circle_at_top,#eef8f1_0%,#f7fbf9_46%,#f7fbf9_100%)]">
        <div className="public-shell">
          {/* Info Kontak */}
          <section>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#d8e9df] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#1f7a4f]">
              <BadgeCheck size={14} />
              Informasi Layanan
            </p>
            <h2 className="mt-4 text-2xl font-extrabold text-[#0f172a] sm:text-3xl">Informasi Kontak Resmi</h2>
            <p className="mt-2 max-w-2xl text-sm text-[#5f7287]">
              Gunakan kanal berikut untuk pertanyaan layanan administrasi, informasi umum, dan kebutuhan warga lainnya.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {kontakInfo.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="rounded-3xl border border-[#d6e8de] bg-white p-5 shadow-[0_22px_42px_-34px_rgba(15,23,42,0.35)]"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf6ef] text-[#1f7a4f]">
                    <Icon size={18} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">{label}</p>

                  {href ? (
                    <a href={href} className="mt-2 inline-block text-sm font-semibold text-[#1f7a4f] hover:underline">
                      {value}
                    </a>
                  ) : (
                    <p className="mt-2 text-sm font-semibold leading-snug text-[#14532d]">{value}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Respon layanan */}
          <section className="mt-8 rounded-3xl border border-[#d6e8de] bg-white p-6 shadow-[0_22px_42px_-34px_rgba(15,23,42,0.35)]">
            <div className="flex items-center gap-2">
              <Timer size={16} className="text-[#1f7a4f]" />
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">Respon Layanan</p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#e2ede6] bg-[#f8fcfa] p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#6b7280]">Kanal Disarankan</p>
                <p className="mt-1 text-sm font-semibold text-[#0f172a]">WhatsApp / Telepon</p>
              </div>
              <div className="rounded-2xl border border-[#e2ede6] bg-[#f8fcfa] p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#6b7280]">Jam Aktif</p>
                <p className="mt-1 text-sm font-semibold text-[#0f172a]">Senin–Jumat, 08.00–16.00 WIB</p>
              </div>
              <div className="rounded-2xl border border-[#e2ede6] bg-[#f8fcfa] p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#6b7280]">Estimasi Balasan</p>
                <p className="mt-1 text-sm font-semibold text-[#0f172a]">Kurang dari 1 hari kerja</p>
              </div>
            </div>
          </section>

          {/* CTA Pengaduan */}
          <section className="mt-8 rounded-3xl bg-gradient-to-r from-[#1f7a4f] to-[#14532d] p-7 shadow-[0_24px_48px_-30px_rgba(15,23,42,0.45)] sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <MessageSquare size={19} className="text-white/80" />
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Layanan Warga</p>
                </div>
                <h3 className="text-xl font-bold text-white sm:text-2xl">Ajukan Pengaduan atau Aspirasi</h3>
                <p className="mt-2 text-sm text-white/85">
                  Sampaikan keluhan dilengkapi foto dan lokasi agar tim dapat menindaklanjuti dengan lebih cepat.
                </p>
              </div>

              <Link
                href="/pengaduan"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#14532d] shadow-[0_18px_34px_-22px_rgba(15,23,42,0.48)] transition hover:-translate-y-0.5 hover:bg-[#f3fbf7]"
              >
                Kirim Pengaduan
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
