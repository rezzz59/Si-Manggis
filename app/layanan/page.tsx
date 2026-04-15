"use client";

import { useState } from "react";
import {
  FileText,
  IdCard,
  Heart,
  PartyPopper,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  File,
  Send,
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
  const [form, setForm] = useState({
    nama: "",
    nik: "",
    alamat: "",
    layanan: "",
    keperluan: "",
    telepon: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            Ajukan surat dan layanan desa tanpa perlu ke kantor. Isi formulir di bawah dan kami akan menghubungi Anda.
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

      {/* Formulir */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <span className="accent-line mb-3 block" />
          <h2 className="text-2xl font-bold text-[#1e40af] mb-2">
            Ajukan Permohonan
          </h2>
          <p className="text-sm text-stone-500 mb-8">
            Isi formulir di bawah. Staff desa akan menghubungi Anda melalui nomor yang diberikan.
          </p>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
              <CheckCircle
                size={48}
                className="text-emerald-500 mx-auto mb-4"
              />
              <h3 className="text-lg font-bold text-emerald-700 mb-2">
                Permohonan Terkirim
              </h3>
              <p className="text-sm text-emerald-600 max-w-sm mx-auto">
                Terima kasih. Staff desa akan menghubungi Anda dalam 1–2 hari kerja untuk konfirmasi lebih lanjut.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    nama: "",
                    nik: "",
                    alamat: "",
                    layanan: "",
                    keperluan: "",
                    telepon: "",
                  });
                }}
                className="mt-6 text-sm font-semibold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
              >
                Ajukan permohonan lain
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-stone-50 rounded-2xl border border-stone-200 p-6 lg:p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda"
                    value={form.nama}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, nama: e.target.value }))
                    }
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    NIK (Nomor Induk Kependudukan)
                  </label>
                  <input
                    type="text"
                    placeholder="16 digit NIK"
                    value={form.nik}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, nik: e.target.value }))
                    }
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Alamat lengkap di Desa Guntung Manggis"
                  value={form.alamat}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, alamat: e.target.value }))
                  }
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    Jenis Layanan <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.layanan}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, layanan: e.target.value }))
                    }
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                  >
                    <option value="">Pilih layanan</option>
                    {dataLayanan.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    No. Telepon / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="08xxxxxxxxxx"
                    value={form.telepon}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, telepon: e.target.value }))
                    }
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Keperluan / Keterangan <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ceritakan keperluan Anda..."
                  value={form.keperluan}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, keperluan: e.target.value }))
                  }
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af] resize-none"
                />
              </div>

              <div className="bg-[#eff6ff] rounded-lg px-4 py-3 flex items-start gap-2">
                <Clock size={15} className="text-[#1e40af] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#1e40af]">
                  Estimasi proses: 1–7 hari kerja tergantung jenis layanan.
                  Staff desa akan menghubungi Anda setelah permohonan diverifikasi.
                </p>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1e40af] text-white font-semibold text-sm px-8 py-3 rounded-lg hover:bg-[#1e3a8a] transition-colors cursor-pointer"
              >
                <Send size={16} />
                Kirim Permohonan
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
