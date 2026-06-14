"use client";

import { useState } from "react";
import FormLaporan from "@/src/components/FormLaporan";
import {
  FileText,
  IdCard,
  Heart,
  PartyPopper,
  ChevronDown,
  ChevronUp,
  File,
  ArrowRight,
} from "lucide-react";
import { dataLayanan } from "@/src/data/layanan";
import PublicHeroBanner from "@/src/components/PublicHeroBanner";

const iconMap: Record<string, React.ElementType> = {
  "file-text": FileText,
  "id-card": IdCard,
  heart: Heart,
  "party-popper": PartyPopper,
};

export default function LayananPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <main className="flex flex-col">

      <PublicHeroBanner
        kicker="Layanan Warga"
        title="Layanan untuk Warga"
        description="Ajukan surat dan layanan kelurahan tanpa perlu ke kantor. Proses lebih praktis, transparan, dan terhubung ke verifikasi RT via WhatsApp."
        visual={
          <div className="space-y-3">
            <div className="rounded-2xl border border-[#dcebe3] bg-gradient-to-b from-white to-[#f6fbf8] p-4 shadow-[0_16px_34px_-26px_rgba(15,23,42,0.32)]">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#64748b]">Fitur Utama</p>
              <p className="mt-1 text-sm font-bold text-[#0f172a]">Pengajuan Online + Verifikasi WA RT</p>
            </div>
            <div className="rounded-2xl border border-[#dcebe3] bg-white p-4 shadow-[0_16px_34px_-26px_rgba(15,23,42,0.28)]">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#64748b]">Tracking</p>
              <p className="mt-1 text-sm font-bold text-[#0f172a]">Pantau status tiket secara real-time</p>
            </div>
            <div className="rounded-2xl border border-[#dcebe3] bg-[#f2fbf5] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#64748b]">Respon Layanan</p>
              <p className="mt-1 text-sm font-bold text-[#0f7a43]">Estimasi proses cepat sesuai jenis layanan</p>
            </div>
          </div>
        }
      >
        <a
          href="#form-permohonan"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0f7a43] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-18px_rgba(15,122,67,0.55)] transition hover:-translate-y-0.5 hover:bg-[#0d6b3b]"
        >
          Ajukan Sekarang <ArrowRight size={15} />
        </a>
        <a
          href="#daftar-layanan"
          className="inline-flex items-center justify-center rounded-xl border border-[#cfe3d7] bg-white/90 px-5 py-3 text-sm font-semibold text-[#0f7a43] transition hover:bg-white"
        >
          Lihat Daftar Layanan
        </a>
      </PublicHeroBanner>

      {/* Daftar Layanan */}
      <section id="daftar-layanan" className="public-section bg-[#f7fbf8]">
        <div className="public-shell">
          <span className="section-kicker">Pelayanan Utama</span>
          <h2 className="public-title mt-3 mb-2">
            Daftar Layanan
          </h2>
          <p className="public-subtitle !mt-0 !max-w-2xl mb-8">
            Klik salah satu untuk melihat detail dokumen yang diperlukan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5">
            {dataLayanan.map((layanan) => {
              const Icon = iconMap[layanan.icon] ?? FileText;
              const isOpen = openId === layanan.id;
              return (
                <div
                  key={layanan.id}
                  className="overflow-hidden rounded-3xl border border-[#dcebe3] bg-white shadow-[0_16px_34px_-28px_rgba(15,23,42,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-28px_rgba(15,23,42,0.35)]"
                >
                  <button
                    type="button"
                    onClick={() => toggle(layanan.id)}
                    className="w-full cursor-pointer px-5 py-4 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${layanan.warnaBg}`}
                      >
                        <Icon size={18} className={layanan.warnaText} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 leading-snug">
                          {layanan.nama}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-slate-500">
                          {layanan.estimasi}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-slate-400">
                        {isOpen ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#edf4ef] bg-[#fbfefc] px-5 pb-5 pt-4">
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748b]">
                        Dokumen yang diperlukan
                      </p>
                      <ul className="space-y-2">
                        {layanan.dokumen.map((doc, i) => (
                          <li key={i} className="flex items-start gap-2 rounded-lg border border-[#e7f0ea] bg-white px-2.5 py-2">
                            <File
                              size={13}
                              className="mt-0.5 flex-shrink-0 text-[#0f7a43]"
                            />
                            <span className="text-xs text-slate-700">
                              {doc}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ajukan Permohonan */}
      <section id="form-permohonan" className="public-section bg-white">
        <div className="public-shell max-w-3xl">
          <span className="section-kicker">Pengajuan Online</span>
          <h2 className="public-title mt-3 mb-2">
            Ajukan Permohonan
          </h2>
          <p className="public-subtitle !mt-0 !max-w-2xl mb-8">
            Pengajuan akan langsung dikirim ke WA RT terkait untuk persetujuan
            lebih cepat. Lacak status di portal.
          </p>

          <div className="rounded-3xl border border-[#dcebe3] bg-gradient-to-b from-[#fcfefd] to-[#f6fbf8] p-6 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.28)] lg:p-8">
            <FormLaporan />
          </div>
        </div>
      </section>
    </main>
  );
}