"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Send,
  CheckCircle2,
  MapPin,
  Image,
  X,
  Loader2,
  Clock3,
  SearchCheck,
  FileCheck2,
  MessageSquareWarning,
  BadgeCheck,
  HelpCircle,
  ArrowRight,
  FileText,
} from "lucide-react";
import PublicHeroBanner from "@/src/components/PublicHeroBanner";

const TIMELINE = [
  {
    title: "Submit Report",
    desc: "Warga mengirim laporan lengkap beserta bukti.",
    icon: MessageSquareWarning,
  },
  {
    title: "Verification",
    desc: "Tim kelurahan memverifikasi validitas laporan.",
    icon: SearchCheck,
  },
  {
    title: "Follow Up",
    desc: "Penanganan diteruskan ke petugas terkait.",
    icon: FileCheck2,
  },
  {
    title: "Resolved",
    desc: "Status penyelesaian dikirim ke pelapor.",
    icon: BadgeCheck,
  },
];

export default function PengaduanPage() {
  const [form, setForm] = useState({
    nama: "",
    telepon: "",
    pesan: "",
    lokasi: "",
  });
  const [attachments, setAttachments] = useState<{ url: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tiket, setTiket] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung browser ini.");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const val = `${pos.coords.latitude},${pos.coords.longitude}`;
        setForm((f) => ({ ...f, lokasi: val }));
        setGettingLocation(false);
      },
      () => {
        setError("Tidak bisa mendapatkan lokasi. Pastikan GPS aktif.");
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (attachments.length >= 4) break;
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/pengaduan/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setAttachments((prev) => [...prev, { url: data.url, name: file.name }]);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Upload gagal");
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  }

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      nama: form.nama,
      telepon: form.telepon || null,
      pesan: form.pesan,
      lokasi: form.lokasi || null,
      lampiran_url: attachments.map((a) => a.url),
    };

    fetch("/api/pengaduan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setTiket(data.tiket);
        setSubmitted(true);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Gagal"))
      .finally(() => setLoading(false));
  }

  return (
    <main className="flex flex-col">
      <PublicHeroBanner
        kicker="Layanan Pengaduan Warga"
        title="Sampaikan Pengaduan dengan Aman & Transparan"
        description="Laporan Anda diproses secara terstruktur, dilindungi privasinya, dan dapat dilacak melalui nomor tiket."
        visual={
          <div className="space-y-3">
            <div className="rounded-xl border border-[#dcebe3] bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#64748b]">Alur</p>
              <p className="mt-1 text-sm font-bold text-[#0f172a]">Submit → Verifikasi → Tindak Lanjut → Selesai</p>
            </div>
            <div className="rounded-xl border border-[#dcebe3] bg-[#f7fbf9] p-3">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-[#1f7a4f]" />
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#64748b]">Tracking Tiket</p>
              </div>
              <p className="mt-1 text-sm font-bold text-[#0f172a]">Pantau progres pengaduan kapan saja</p>
            </div>
          </div>
        }
      >
        <Link href="/cek-tiket" className="public-btn-primary px-5 py-3 text-sm">
          Lacak Tiket <ArrowRight size={15} />
        </Link>
      </PublicHeroBanner>

      {/* 2) Timeline */}
      <section className="bg-white py-7 sm:py-8 border-b border-[#edf4ef]">
        <div className="public-shell">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="rounded-2xl border border-[#dceae1] bg-[#f9fcfa] px-4 py-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f5ee] text-[#1f7a4f]">
                      <Icon size={15} />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
                      Step {idx + 1}
                    </p>
                  </div>
                  <h3 className="text-sm font-bold text-[#0f172a]">{step.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#5f7287]">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3) Two-column main content */}
      <section className="public-section bg-[#f7fbf9]">
        <div className="public-shell">
          {submitted ? (
            // 7) Success state
            <div className="mx-auto max-w-3xl">
              <div className="public-card overflow-hidden border-[#cfe4d7] bg-white p-0">
                <div className="bg-gradient-to-r from-[#1f7a4f] to-[#14532d] px-6 py-5 sm:px-8">
                  <div className="flex items-center gap-3 text-white">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/80">
                        Status Pengaduan
                      </p>
                      <h2 className="text-xl font-extrabold sm:text-2xl">✅ Laporan Terkirim!</h2>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-7">
                  <p className="text-sm leading-relaxed text-[#4f6478]">
                    Laporan Anda sudah masuk ke sistem SI-MANGGIS. Tim akan memverifikasi, dan WA akan dikirim ke RT terkait untuk persetujuan.
                  </p>

                  {tiket && (
                    <div className="rounded-2xl border border-[#d7e8de] bg-[#f7fbf9] px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5f7287]">
                        No. Referensi Anda
                      </p>
                      <p className="mt-1 text-2xl font-extrabold font-mono text-[#14532d]">{tiket}</p>
                      <p className="mt-2 text-xs text-[#5f7287]">Catat nomor ini untuk melacak status.</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Link href="/cek-tiket" className="public-btn-primary px-5 py-3 text-sm">
                      Lacak Status
                      <ArrowRight size={15} />
                    </Link>
                    <div className="rounded-xl border border-[#dbe8df] bg-white px-4 py-3 text-left">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                        Estimasi Respons
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#14532d]">1–2 x 24 Jam Kerja</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setTiket("");
                      setForm({ nama: "", telepon: "", pesan: "", lokasi: "" });
                      setAttachments([]);
                    }}
                    className="text-sm font-semibold text-[#1f7a4f] underline underline-offset-4"
                  >
                    Kirim pengaduan lain
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left: Form */}
              <div className="lg:col-span-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* 4) Section 1: Reporter Information */}
                  <div className="public-card p-5 sm:p-6">
                    <p className="public-label">Section 1 — Reporter Information</p>
                    <h2 className="text-base font-bold text-[#0f172a]">Data Pelapor</h2>
                    <p className="mt-1 text-xs text-[#5f7287]">
                      Data dasar pelapor untuk kebutuhan klarifikasi jika diperlukan.
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="public-label">
                          Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Nama Anda"
                          value={form.nama}
                          onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                          className="public-input"
                        />
                      </div>
                      <div>
                        <label className="public-label">No. Telepon / WhatsApp</label>
                        <input
                          type="tel"
                          placeholder="08xxxxxxxxxx"
                          value={form.telepon}
                          onChange={(e) => setForm((f) => ({ ...f, telepon: e.target.value }))}
                          className="public-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Location */}
                  <div className="public-card p-5 sm:p-6">
                    <p className="public-label">Section 2 — Location</p>
                    <h2 className="text-base font-bold text-[#0f172a]">Lokasi Kejadian</h2>
                    <p className="mt-1 text-xs text-[#5f7287]">
                      Ambil lokasi otomatis agar tim lebih cepat menindaklanjuti.
                    </p>

                    <div className="mt-4 flex gap-2">
                      <input
                        type="text"
                        readOnly
                        placeholder="Tekan tombol untuk ambil lokasi otomatis"
                        value={form.lokasi}
                        onChange={(e) => setForm((f) => ({ ...f, lokasi: e.target.value }))}
                        className="public-input flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleLocation}
                        disabled={gettingLocation}
                        className="public-btn-primary flex items-center gap-1.5 flex-shrink-0 px-4 py-2.5 text-sm disabled:opacity-50"
                      >
                        {gettingLocation ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <MapPin size={14} />
                        )}
                        {gettingLocation ? "Mengambil..." : "Ambil Lokasi"}
                      </button>
                    </div>
                  </div>

                  {/* Section 3: Evidence Upload */}
                  <div className="public-card p-5 sm:p-6">
                    <p className="public-label">Section 3 — Evidence Upload</p>
                    <h2 className="text-base font-bold text-[#0f172a]">Bukti Foto</h2>
                    <p className="mt-1 text-xs text-[#5f7287]">
                      Maksimal 4 file. Format: JPG/PNG/WEBP. Ukuran disarankan di bawah 5 MB.
                    </p>

                    {attachments.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2.5">
                        {attachments.map((att, i) => (
                          <div key={i} className="relative group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={att.url}
                              alt={att.name}
                              className="h-20 w-20 rounded-xl border border-[#dbe8df] object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeAttachment(i)}
                              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {attachments.length < 4 && (
                      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#cfe0d5] bg-white px-4 py-8 text-center transition-colors hover:border-[#1f7a4f]">
                        {uploading ? (
                          <>
                            <Loader2 size={16} className="animate-spin text-[#1f7a4f]" />
                            <p className="text-sm font-semibold text-[#1f7a4f]">Mengunggah...</p>
                          </>
                        ) : (
                          <>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ee] text-[#1f7a4f]">
                              <Image size={17} />
                            </div>
                            <p className="text-sm font-semibold text-[#1f7a4f]">Klik untuk unggah foto</p>
                            <p className="text-xs text-[#6b7280]">atau drag & drop file gambar Anda</p>
                          </>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    )}
                  </div>

                  {/* Section 4: Complaint Details */}
                  <div className="public-card p-5 sm:p-6">
                    <p className="public-label">Section 4 — Complaint Details</p>
                    <h2 className="text-base font-bold text-[#0f172a]">Detail Pengaduan</h2>
                    <p className="mt-1 text-xs text-[#5f7287]">
                      Tulis kronologi dengan jelas agar proses verifikasi lebih cepat.
                    </p>

                    <div className="mt-4">
                      <label className="public-label">
                        Isi Pengaduan / Aspirasi <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={6}
                        placeholder="Jelaskan kejadian, waktu, dampak, dan harapan tindak lanjut..."
                        value={form.pesan}
                        onChange={(e) => setForm((f) => ({ ...f, pesan: e.target.value }))}
                        className="public-input resize-none"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={loading || uploading}
                      className="public-btn-primary px-8 py-3 text-sm disabled:opacity-60"
                    >
                      <Send size={16} />
                      {loading ? "Mengirim..." : "Kirim Pengaduan"}
                    </button>
                    <Link href="/cek-tiket" className="public-btn-soft px-5 py-3 text-sm">
                      Cek Tiket Anda
                    </Link>
                  </div>
                </form>
              </div>

              {/* Right: Information panel */}
              <aside className="lg:col-span-4">
                <div className="sticky top-24 space-y-4">
                  <div className="public-card p-5">
                    <p className="public-label">Informasi Layanan</p>
                    <h3 className="text-base font-bold text-[#0f172a]">Kenapa Aman Melapor di SI-MANGGIS?</h3>
                    <ul className="mt-4 space-y-3">
                      <li className="flex items-start gap-2.5">
                        <ShieldCheck size={16} className="mt-0.5 text-[#1f7a4f]" />
                        <div>
                          <p className="text-sm font-semibold text-[#0f172a]">Perlindungan Identitas</p>
                          <p className="text-xs text-[#5f7287]">Identitas pelapor dijaga sesuai kebijakan privasi.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <BadgeCheck size={16} className="mt-0.5 text-[#1f7a4f]" />
                        <div>
                          <p className="text-sm font-semibold text-[#0f172a]">Pengiriman Aman</p>
                          <p className="text-xs text-[#5f7287]">Laporan tersimpan aman dan tercatat otomatis.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Clock3 size={16} className="mt-0.5 text-[#1f7a4f]" />
                        <div>
                          <p className="text-sm font-semibold text-[#0f172a]">Estimasi Respons</p>
                          <p className="text-xs text-[#5f7287]">Rata-rata 1–2 x 24 jam kerja.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <FileCheck2 size={16} className="mt-0.5 text-[#1f7a4f]" />
                        <div>
                          <p className="text-sm font-semibold text-[#0f172a]">Pelacakan Tiket</p>
                          <p className="text-xs text-[#5f7287]">Cek status real-time di halaman tiket.</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="public-card p-5">
                    <p className="public-label">FAQ Shortcut</p>
                    <h3 className="text-base font-bold text-[#0f172a]">Pertanyaan Umum</h3>
                    <div className="mt-3 space-y-2">
                      <div className="rounded-xl border border-[#e3eee7] bg-white px-3.5 py-3">
                        <p className="text-xs font-semibold text-[#0f172a]">Apakah laporan bisa anonim?</p>
                        <p className="mt-1 text-xs text-[#5f7287]">
                          Anda dapat mengisi data minimum, tim hanya menghubungi jika diperlukan.
                        </p>
                      </div>
                      <div className="rounded-xl border border-[#e3eee7] bg-white px-3.5 py-3">
                        <p className="text-xs font-semibold text-[#0f172a]">Bagaimana cara cek progres?</p>
                        <p className="mt-1 text-xs text-[#5f7287]">
                          Gunakan nomor tiket pada menu <span className="font-semibold">Cek Tiket</span>.
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/cek-tiket"
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1f7a4f]"
                    >
                      Lihat status tiket
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  <div className="rounded-2xl border border-[#dbe8df] bg-white p-4">
                    <div className="flex items-center gap-2">
                      <HelpCircle size={15} className="text-[#1f7a4f]" />
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
                        Bantuan Cepat
                      </p>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#5f7287]">
                      Jika laporan bersifat darurat (kebakaran/medis), gunakan halaman{" "}
                      <Link href="/darurat" className="font-semibold text-[#1f7a4f] underline">
                        Informasi Darurat
                      </Link>.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
