"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { MessageSquare, Send, CheckCircle, MapPin, Image, X, Loader2 } from "lucide-react";

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
      {/* Hero */}
      <section className="bg-[#1e40af] pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">
            Layanan Desa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Pengaduan & Aspirasi Warga
          </h1>
          <p className="text-white/70 max-w-md text-sm">
            Sampaikan keluhan atau aspirasi Anda. Lampirkan foto dan lokasi agar
            kami bisa menindak lanjuti dengan tepat.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <span className="accent-line mb-3 block" />
          <h2 className="text-2xl font-bold text-[#1e40af] mb-2">
            Kirim Pengaduan
          </h2>
          <p className="text-sm text-stone-500 mb-8">
            Identitas Anda akan kami jaga kerahasiaannya. Maksimal 4 foto.
          </p>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
              <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-emerald-700 mb-2">
                Pengaduan Terkirim
              </h3>
              <p className="text-sm text-emerald-600 max-w-sm mx-auto mb-4">
                Terima kasih. Kami akan menindaklanjuti laporan Anda secepat mungkin.
              </p>
              {tiket && (
                <div className="inline-block bg-white border border-emerald-300 rounded-xl px-6 py-4">
                  <p className="text-xs text-emerald-500 font-semibold uppercase tracking-wide mb-1">
                    Nomor Tiket Anda
                  </p>
                  <p className="text-2xl font-bold font-mono text-emerald-700">
                    {tiket}
                  </p>
                </div>
              )}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setTiket("");
                    setForm({ nama: "", telepon: "", pesan: "", lokasi: "" });
                    setAttachments([]);
                  }}
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                >
                  Kirim pengaduan lain
                </button>
                <Link
                  href="/cek-tiket"
                  className="text-sm font-semibold text-[#1e40af] hover:text-[#1e3a8a] underline cursor-pointer"
                >
                  Cek Status Tiket →
                </Link>
              </div>
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
                    onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
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
                    onChange={(e) => setForm((f) => ({ ...f, telepon: e.target.value }))}
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                  />
                </div>
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  <MapPin size={12} className="inline mr-1" />
                  Lokasi
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    placeholder="Tekan tombol untuk ambil lokasi otomatis"
                    value={form.lokasi}
                    onChange={(e) => setForm((f) => ({ ...f, lokasi: e.target.value }))}
                    className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                  />
                  <button
                    type="button"
                    onClick={handleLocation}
                    disabled={gettingLocation}
                    className="flex items-center gap-1.5 flex-shrink-0 px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm font-semibold text-[#1e40af] hover:bg-[#eff6ff] transition-colors disabled:opacity-50 cursor-pointer"
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

              {/* Foto */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  <Image size={12} className="inline mr-1" />
                  Foto Bukti (maks. 4 foto, 5MB masing-masing)
                </label>

                {/* Thumbnail previews */}
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {attachments.map((att, i) => (
                      <div key={i} className="relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={att.url}
                          alt={att.name}
                          className="w-16 h-16 object-cover rounded-lg border border-stone-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeAttachment(i)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {attachments.length < 4 && (
                  <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-stone-300 rounded-lg text-sm text-stone-500 hover:border-[#1e40af] hover:text-[#1e40af] transition-colors cursor-pointer">
                    {uploading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Mengunggah...
                      </>
                    ) : (
                      <>
                        <Image size={14} />
                        Tambahkan Foto
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

              {/* Pesan */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Isi Pengaduan / Aspirasi <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Jelaskan kronologi atau aspirasi Anda secara jelas dan lengkap..."
                  value={form.pesan}
                  onChange={(e) => setForm((f) => ({ ...f, pesan: e.target.value }))}
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af] resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || uploading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1e40af] text-white font-semibold text-sm px-8 py-3 rounded-lg hover:bg-[#1e3a8a] transition-colors cursor-pointer disabled:opacity-60"
              >
                <Send size={16} />
                {loading ? "Mengirim..." : "Kirim Pengaduan"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}