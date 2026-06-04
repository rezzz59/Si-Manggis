"use client";

import { useState } from "react";
import RtDropdown from "./RtDropdown";

const JENIS_LAYANAN = [
  { id: "surat-keterangan", label: "Surat Keterangan" },
  { id: "ktp-kk", label: "KTP & Kartu Keluarga" },
  { id: "izin-keramaian", label: "Izin Keramaian" },
];

const SUB_JENIS: Record<string, string[]> = {
  "surat-keterangan": ["Domisili", "Usaha", "Pengantar", "Keterangan Lain"],
  "ktp-kk": ["KTP Hilang/Rusak", "Penambahan Anggota Keluarga", "Perubahan Data", "Lainnya"],
  "izin-keramaian": ["Keramaian", "Kesenian", "Olahraga", "Lainnya"],
};

export default function FormLaporan() {
  const [form, setForm] = useState({
    nama: "",
    nik: "",
    alamat: "",
    nomor_rt: "",
    telepon: "",
    jenis: "",
    sub_jenis: "",
    deskripsi: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    fetch("/api/permohonan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setSuccess(data.tiket);
      })
      .catch((err) => setError(err.message))
      .finally(() => setSubmitting(false));
  }

  if (success) {
    return (
      <div className="text-center py-16 px-6">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-[#1e293b] mb-2">Laporan Terkirim!</h2>
        <p className="text-[#64748b] mb-2">No. Referensi Anda:</p>
        <p className="text-3xl font-bold text-[#1e40af] mb-6">{success}</p>
        <p className="text-sm text-[#94a3b8]">
          Catat nomor ini untuk melacak status.
          <br />
          WA akan dikirim ke RT terkait untuk persetujuan.
        </p>
        <a
          href="/cek-tiket"
          className="inline-block mt-6 text-sm font-semibold text-[#1e40af] hover:text-[#1e3a8a] underline"
        >
          Lacak Status →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nama */}
      <div>
        <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
          Nama Lengkap <span className="text-[#dc2626]">*</span>
        </label>
        <input
          type="text"
          required
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          className="w-full border border-[#cbd5e1] rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
          placeholder="Masukkan nama lengkap"
        />
      </div>

      {/* NIK */}
      <div>
        <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
          NIK <span className="text-[#dc2626]">*</span>
        </label>
        <input
          type="text"
          required
          minLength={16}
          maxLength={16}
          pattern="[0-9]{16}"
          value={form.nik}
          onChange={(e) => setForm({ ...form, nik: e.target.value })}
          className="w-full border border-[#cbd5e1] rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
          placeholder="16 digit NIK"
        />
      </div>

      {/* Alamat */}
      <div>
        <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
          Alamat Lengkap <span className="text-[#dc2626]">*</span>
        </label>
        <textarea
          required
          rows={2}
          value={form.alamat}
          onChange={(e) => setForm({ ...form, alamat: e.target.value })}
          className="w-full border border-[#cbd5e1] rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af] resize-none"
          placeholder="Jalan, no rumah, komplek..."
        />
      </div>

      {/* RT */}
      <div>
        <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
          RT <span className="text-[#dc2626]">*</span>
        </label>
        <RtDropdown
          value={form.nomor_rt}
          onChange={(v) => setForm({ ...form, nomor_rt: v })}
        />
      </div>

      {/* Telepon */}
      <div>
        <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
          No. WA <span className="text-[#dc2626]">*</span>
        </label>
        <input
          type="tel"
          required
          value={form.telepon}
          onChange={(e) => setForm({ ...form, telepon: e.target.value })}
          className="w-full border border-[#cbd5e1] rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
          placeholder="08xxxxxxxxxx"
        />
      </div>

      {/* Jenis */}
      <div>
        <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
          Jenis Pengajuan <span className="text-[#dc2626]">*</span>
        </label>
        <select
          required
          value={form.jenis}
          onChange={(e) => setForm({ ...form, jenis: e.target.value, sub_jenis: "" })}
          className="w-full border border-[#cbd5e1] rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
        >
          <option value="">-- Pilih Jenis --</option>
          {JENIS_LAYANAN.map((j) => (
            <option key={j.id} value={j.id}>{j.label}</option>
          ))}
        </select>
      </div>

      {/* Sub Jenis */}
      {form.jenis && SUB_JENIS[form.jenis] && (
        <div>
          <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
            Sub Jenis
          </label>
          <select
            value={form.sub_jenis}
            onChange={(e) => setForm({ ...form, sub_jenis: e.target.value })}
            className="w-full border border-[#cbd5e1] rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
          >
            <option value="">-- Pilih Sub Jenis (opsional) --</option>
            {SUB_JENIS[form.jenis].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {/* Deskripsi */}
      <div>
        <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
          Isi Laporan / Keperluan <span className="text-[#dc2626]">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={form.deskripsi}
          onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          className="w-full border border-[#cbd5e1] rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af] resize-none"
          placeholder="Jelaskan kronologi atau keperluan Anda..."
        />
      </div>

      {error && (
        <p className="text-sm text-[#dc2626] bg-[#fef2f2] border border-[#fca5a5] rounded-sm px-4 py-2.5">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] disabled:bg-[#93c5fd] text-white text-sm font-semibold py-3 rounded-sm transition-colors"
      >
        {submitting ? "Mengirim..." : "KIRIM LAPORAN"}
      </button>
    </form>
  );
}