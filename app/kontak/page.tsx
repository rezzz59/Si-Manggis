"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

export default function KontakPage() {
  const [form, setForm] = useState({
    nama: "",
    telepon: "",
    email: "",
    subjek: "",
    pesan: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/pengaduan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: form.nama,
          telepon: form.telepon,
          email: form.email,
          topik: form.subjek,
          pesan: form.pesan,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal mengirim pengaduan");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const kontakInfo = [
    {
      icon: MapPin,
      label: "Alamat",
      value: "Balai Desa Guntung Manggis, Kalimantan Selatan 70712",
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
      value: "desaguntungmanggis@email.com",
      href: "mailto:desagantungmanggis@email.com",
    },
    {
      icon: Clock,
      label: "Jam Operasional",
      value: "Senin – Jumat: 08.00 – 16.00 WIB",
    },
  ];

  const pengaduanTopik = [
    "Kebersihan & Drainase",
    "Pembangunan Infrastruktur",
    "Keamanan & Ketertiban",
    "Layanan Administrasi",
    "Bantuan & Kesejahteraan",
    "Lainnya",
  ];

  return (
    <main className="flex flex-col">

      {/* Hero */}
      <section className="bg-[#1B4332] pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">
            Hubungi Kami
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Kontak & Pengaduan
          </h1>
          <p className="text-white/70 max-w-md text-sm">
            Sampaikan pertanyaan, saran, atau pengaduan. Kami siap membantu warga Desa Guntung Manggis.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">

        {/* Info Kontak */}
        <section className="mb-16">
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

        {/* Form Pengaduan */}
        <section>
          <span className="accent-line mb-3 block" />
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={22} className="text-[#1B4332]" />
            <h2 className="text-2xl font-bold text-[#1B4332]">
              Sampaikan Pengaduan
            </h2>
          </div>
          <p className="text-sm text-stone-500 mb-8">
            Pengaduan Anda akan ditindaklanjuti oleh staff desa. Mohon isi data dengan lengkap agar kami bisa merespons dengan tepat.
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5 max-w-2xl">
              <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center max-w-2xl">
              <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-emerald-700 mb-2">
                Pengaduan Terkirim
              </h3>
              <p className="text-sm text-emerald-600 max-w-sm mx-auto">
                Terima kasih telah menyampaikan pengaduan. Kami akan menanganinya secepat mungkin.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm({ nama: "", telepon: "", email: "", subjek: "", pesan: "" });
                }}
                className="mt-6 text-sm font-semibold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
              >
                Kirim pengaduan lain
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-stone-50 rounded-2xl border border-stone-200 p-6 lg:p-8 max-w-2xl space-y-5"
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
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30 focus:border-[#1B4332]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    No. Telepon / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={form.telepon}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, telepon: e.target.value }))
                    }
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30 focus:border-[#1B4332]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@contoh.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30 focus:border-[#1B4332]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Topik Pengaduan <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.subjek}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subjek: e.target.value }))
                  }
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30 focus:border-[#1B4332]"
                >
                  <option value="">Pilih topik pengaduan</option>
                  {pengaduanTopik.map((topik) => (
                    <option key={topik} value={topik}>
                      {topik}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Isi Pengaduan <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ceritakan masalah atau keluhan Anda secara lengkap..."
                  value={form.pesan}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, pesan: e.target.value }))
                  }
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30 focus:border-[#1B4332] resize-none"
                />
              </div>

              <div className="bg-[#FEFCE8] rounded-lg px-4 py-3 flex items-start gap-2">
                <Clock size={15} className="text-[#92400E] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#92400E]">
                  Pengaduan akan ditanggapi dalam 1–3 hari kerja. Untuk darurat, hubungi{" "}
                  <a href="/darurat" className="font-semibold underline">
                    nomor darurat
                  </a>
                  .
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1B4332] text-white font-semibold text-sm px-8 py-3 rounded-lg hover:bg-[#153326] disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {loading ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                {loading ? "Mengirim..." : "Kirim Pengaduan"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
