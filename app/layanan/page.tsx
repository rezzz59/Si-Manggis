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
} from "lucide-react";
import { dataLayanan } from "@/src/data/layanan";

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

      {/* Hero */}
      <section className="bg-[#1e40af] pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">
            Layanan Desa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Layanan untuk Warga
          </h1>
          <p className="text-white/70 max-w-md text-sm">
            Ajukan surat dan layanan desa tanpa perlu ke kantor. Isi formulir di
            bawah dan kami akan menghubungi Anda.
          </p>
        </div>
      </section>

      {/* Daftar Layanan */}
      <section className="py-16 lg:py-20 bg-stone-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <span className="accent-line mb-3 block" />
          <h2 className="text-2xl font-bold text-[#1e40af] mb-2">
            Daftar Layanan
          </h2>
          <p className="text-sm text-stone-500 mb-8">
            Klik salah satu untuk melihat detail dokumen yang diperlukan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {dataLayanan.map((layanan) => {
              const Icon = iconMap[layanan.icon] ?? FileText;
              const isOpen = openId === layanan.id;
              return (
                <div
                  key={layanan.id}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden hover-lift"
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
                        <p className="text-sm font-bold text-stone-900 leading-snug">
                          {layanan.nama}
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {layanan.estimasi}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-stone-400">
                        {isOpen ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-stone-100 pt-4">
                      <p className="text-xs text-stone-500 mb-3 font-semibold uppercase tracking-wide">
                        Dokumen yang diperlukan:
                      </p>
                      <ul className="space-y-1.5">
                        {layanan.dokumen.map((doc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <File
                              size={13}
                              className="text-stone-400 mt-0.5 flex-shrink-0"
                            />
                            <span className="text-xs text-stone-600">
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
      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <span className="accent-line mb-3 block" />
          <h2 className="text-2xl font-bold text-[#1e40af] mb-2">
            Ajukan Permohonan
          </h2>
          <p className="text-sm text-stone-500 mb-8">
            Pengajuan akan langsung dikirim ke WA RT terkait untuk persetujuan
            lebih cepat. Lacak status di portal.
          </p>

          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 lg:p-8">
            <FormLaporan />
          </div>
        </div>
      </section>
    </main>
  );
}