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
        description="Ajukan surat dan layanan desa tanpa perlu ke kantor. Isi formulir di bawah, dan kami akan menghubungi Anda."
        visual={
          <div className="space-y-3">
            <div className="rounded-xl border border-[#dcebe3] bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#64748b]">Fitur Utama</p>
              <p className="mt-1 text-sm font-bold text-[#0f172a]">Pengajuan Online + Verifikasi WA RT</p>
            </div>
            <div className="rounded-xl border border-[#dcebe3] bg-[#f7fbf9] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#64748b]">Tracking</p>
              <p className="mt-1 text-sm font-bold text-[#0f172a]">Pantau status tiket secara real-time</p>
            </div>
          </div>
        }
      >
        <a href="#form-permohonan" className="public-btn-primary px-5 py-3 text-sm">
          Ajukan Sekarang <ArrowRight size={15} />
        </a>
      </PublicHeroBanner>

      {/* Daftar Layanan */}
      <section className="public-section bg-[#f7fbf8]">
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
                  className="public-card overflow-hidden hover-lift"
                >
                  <button
                    type="button"
                    onClick={() => toggle(layanan.id)}
                    className="w-full text-left px-5 py-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${layanan.warnaBg}`}
                      >
                        <Icon size={18} className={layanan.warnaText} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 leading-snug">
                          {layanan.nama}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
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
                    <div className="px-5 pb-5 border-t border-[#edf4ef] pt-4">
                      <p className="public-label !mb-2">
                        Dokumen yang diperlukan:
                      </p>
                      <ul className="space-y-1.5">
                        {layanan.dokumen.map((doc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <File
                              size={13}
                              className="text-slate-400 mt-0.5 flex-shrink-0"
                            />
                            <span className="text-xs text-slate-600">
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

          <div className="public-card bg-[#f8fbf9] p-6 lg:p-8">
            <FormLaporan />
          </div>
        </div>
      </section>
    </main>
  );
}