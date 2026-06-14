"use client";

import { useState } from "react";
import RtDropdown from "./RtDropdown";

const JENIS_LAYANAN = [
  { id: "surat-pengantar", label: "Surat Pengantar" },
  { id: "surat-keterangan", label: "Surat Keterangan" },
  { id: "ktp-kk", label: "KTP & Kartu Keluarga" },
  { id: "izin-keramaian", label: "Izin Keramaian" },
];

const SUB_JENIS: Record<string, string[]> = {
  "surat-pengantar": ["KTP", "KK", "Nikah", "Lainnya"],
  "surat-keterangan": ["Domisili", "Usaha", "Pengantar", "Keterangan Lain"],
  "ktp-kk": ["KTP Hilang/Rusak", "Penambahan Anggota Keluarga", "Perubahan Data", "Lainnya"],
  "izin-keramaian": ["Keramaian", "Kesenian", "Olahraga", "Lainnya"],
};

const AGAMA = ["Islam", "Kristen", "Katholik", "Budha", "Hindu"];
const STATUS_KAWIN = ["Kawin", "Belum Kawin", "Cerai Hidup", "Cerai Mati"];
const PENDIDIKAN = ["SD", "SLTP", "SLTA", "D1", "D2", "D3", "S1", "S2", "S3"];

const isSuratPengantar = (jenis: string) => jenis === "surat-pengantar";

type FormDataType = {
  nama: string;
  nik: string;
  alamat: string;
  nomor_rt: string;
  telepon: string;
  jenis: string;
  sub_jenis: string;
  deskripsi: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  agama: string;
  status_kawin: string;
  pendidikan_terakhir: string;
  pekerjaan: string;
  keperluan: string;
  nama_ortu: string;
};

type FormErrors = Partial<Record<keyof FormDataType, string>>;

const onlyDigits = (v: string) => v.replace(/\D/g, "");
const isNikValid = (nik: string) => /^\d{16}$/.test(nik);
const isTeleponValid = (telepon: string) => /^(08\d{8,13}|62\d{8,13})$/.test(telepon);

function validateForm(form: FormDataType): FormErrors {
  const errors: FormErrors = {};

  if (!form.nama.trim()) errors.nama = "Nama lengkap wajib diisi.";
  if (!form.nik.trim()) {
    errors.nik = "NIK wajib diisi.";
  } else if (!isNikValid(form.nik)) {
    errors.nik = "NIK harus 16 digit angka.";
  }

  if (!form.alamat.trim()) errors.alamat = "Alamat wajib diisi.";
  if (!form.nomor_rt.trim()) errors.nomor_rt = "RT wajib dipilih.";

  if (!form.telepon.trim()) {
    errors.telepon = "Nomor WA wajib diisi.";
  } else if (!isTeleponValid(form.telepon)) {
    errors.telepon = "Format WA tidak valid. Gunakan 08xxxxxxxxxx atau 62xxxxxxxxxx.";
  }

  if (!form.jenis.trim()) errors.jenis = "Jenis pengajuan wajib dipilih.";

  const showBlanko = isSuratPengantar(form.jenis);
  if (showBlanko) {
    if (!form.tempat_lahir.trim()) errors.tempat_lahir = "Tempat lahir wajib diisi.";
    if (!form.tanggal_lahir.trim()) errors.tanggal_lahir = "Tanggal lahir wajib diisi.";
    if (!form.jenis_kelamin.trim()) errors.jenis_kelamin = "Jenis kelamin wajib dipilih.";
    if (!form.agama.trim()) errors.agama = "Agama wajib dipilih.";
    if (!form.status_kawin.trim()) errors.status_kawin = "Status perkawinan wajib dipilih.";
    if (!form.pendidikan_terakhir.trim()) errors.pendidikan_terakhir = "Pendidikan terakhir wajib dipilih.";
    if (!form.pekerjaan.trim()) errors.pekerjaan = "Pekerjaan wajib diisi.";
    if (!form.keperluan.trim()) errors.keperluan = "Keperluan wajib diisi.";
  } else {
    if (!form.deskripsi.trim()) errors.deskripsi = "Isi laporan / keperluan wajib diisi.";
  }

  return errors;
}

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
    // Field tambahan untuk Surat Pengantar (blanko BANJARBARU)
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    agama: "",
    status_kawin: "",
    pendidikan_terakhir: "",
    pekerjaan: "",
    keperluan: "",
    nama_ortu: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const showBlankoFields = isSuratPengantar(form.jenis);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const normalizedForm: FormDataType = {
      ...form,
      nik: onlyDigits(form.nik),
      telepon: onlyDigits(form.telepon),
      nama: form.nama.trim(),
      alamat: form.alamat.trim(),
      jenis: form.jenis.trim(),
      sub_jenis: form.sub_jenis.trim(),
      deskripsi: form.deskripsi.trim(),
      tempat_lahir: form.tempat_lahir.trim(),
      tanggal_lahir: form.tanggal_lahir.trim(),
      jenis_kelamin: form.jenis_kelamin.trim(),
      agama: form.agama.trim(),
      status_kawin: form.status_kawin.trim(),
      pendidikan_terakhir: form.pendidikan_terakhir.trim(),
      pekerjaan: form.pekerjaan.trim(),
      keperluan: form.keperluan.trim(),
      nama_ortu: form.nama_ortu.trim(),
      nomor_rt: form.nomor_rt.trim(),
    };

    const errors = validateForm(normalizedForm);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError("Periksa kembali kolom yang ditandai merah.");
      return;
    }

    setSubmitting(true);
    setForm(normalizedForm);

    fetch("/api/permohonan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizedForm),
    })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok || data.error) throw new Error(data.error || "Gagal mengirim permohonan.");
        return data;
      })
      .then((data) => {
        setSuccess(data.tiket);
      })
      .catch((err) => setError(err.message))
      .finally(() => setSubmitting(false));
  }

  if (success) {
    return (
      <div className="py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50 to-white p-6 sm:p-8 shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
            ✅
          </div>

          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Pengajuan Berhasil
          </p>
          <h2 className="mt-1 text-center text-2xl font-extrabold text-slate-900">
            Permohonan Terkirim
          </h2>
          <p className="mt-2 text-center text-sm leading-relaxed text-slate-600">
            Permohonan Anda sudah kami terima dan otomatis diteruskan ke RT terkait untuk proses persetujuan.
          </p>

          <div className="mt-6 rounded-xl border border-emerald-200 bg-white p-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Nomor Referensi / Tiket
            </p>
            <p className="mt-1 text-3xl font-extrabold tracking-wide text-[#1e40af]">
              {success}
            </p>
          </div>

          <div className="mt-5 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Simpan nomor tiket ini untuk memantau progres layanan pada halaman pelacakan status.
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="/cek-tiket"
              className="inline-flex w-full items-center justify-center rounded-lg bg-[#1e40af] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1e3a8a]"
            >
              Lacak Status Sekarang
            </a>
            <button
              type="button"
              onClick={() => {
                setSuccess(null);
                setError(null);
                setFieldErrors({});
                setForm({
                  nama: "",
                  nik: "",
                  alamat: "",
                  nomor_rt: "",
                  telepon: "",
                  jenis: "",
                  sub_jenis: "",
                  deskripsi: "",
                  tempat_lahir: "",
                  tanggal_lahir: "",
                  jenis_kelamin: "",
                  agama: "",
                  status_kawin: "",
                  pendidikan_terakhir: "",
                  pekerjaan: "",
                  keperluan: "",
                  nama_ortu: "",
                });
              }}
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Buat Pengajuan Baru
            </button>
          </div>
        </div>
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
          onChange={(e) => {
            setForm({ ...form, nama: e.target.value });
            setFieldErrors((prev) => ({ ...prev, nama: undefined }));
          }}
          className={`w-full border rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 ${
            fieldErrors.nama ? "border-[#dc2626] focus:ring-[#dc2626]" : "border-[#cbd5e1] focus:ring-[#1e40af]"
          }`}
          placeholder="Masukkan nama lengkap"
        />
        {fieldErrors.nama && <p className="mt-1 text-xs text-[#dc2626]">{fieldErrors.nama}</p>}
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
          onChange={(e) => {
            const value = onlyDigits(e.target.value).slice(0, 16);
            setForm({ ...form, nik: value });
            setFieldErrors((prev) => ({ ...prev, nik: undefined }));
          }}
          className={`w-full border rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 ${
            fieldErrors.nik ? "border-[#dc2626] focus:ring-[#dc2626]" : "border-[#cbd5e1] focus:ring-[#1e40af]"
          }`}
          placeholder="16 digit NIK"
        />
        {fieldErrors.nik && <p className="mt-1 text-xs text-[#dc2626]">{fieldErrors.nik}</p>}
      </div>

      {/* TTL - hanya untuk Surat Pengantar */}
      {showBlankoFields && (
        <div>
          <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
            Tempat, Tgl. Lahir <span className="text-[#dc2626]">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required={showBlankoFields}
              value={form.tempat_lahir}
              onChange={(e) => setForm({ ...form, tempat_lahir: e.target.value })}
              className="flex-1 border border-[#cbd5e1] rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
              placeholder="Tempat lahir"
            />
            <input
              type="date"
              required={showBlankoFields}
              value={form.tanggal_lahir}
              onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })}
              className="flex-1 border border-[#cbd5e1] rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            />
          </div>
        </div>
      )}

      {/* Jenis Kelamin - hanya untuk Surat Pengantar */}
      {showBlankoFields && (
        <div>
          <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
            Jenis Kelamin <span className="text-[#dc2626]">*</span>
          </label>
          <div className="flex gap-6 pt-2">
            {[
              { v: "L", label: "Laki - Laki" },
              { v: "P", label: "Perempuan" },
            ].map((opt) => (
              <label key={opt.v} className="flex items-center gap-2 text-sm text-[#1e293b] cursor-pointer">
                <input
                  type="radio"
                  name="jenis_kelamin"
                  value={opt.v}
                  required={showBlankoFields}
                  checked={form.jenis_kelamin === opt.v}
                  onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value })}
                  className="w-4 h-4 accent-[#1e40af]"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Alamat */}
      <div>
        <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
          Alamat Lengkap <span className="text-[#dc2626]">*</span>
        </label>
        <textarea
          required
          rows={2}
          value={form.alamat}
          onChange={(e) => {
            setForm({ ...form, alamat: e.target.value });
            setFieldErrors((prev) => ({ ...prev, alamat: undefined }));
          }}
          className={`w-full border rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 resize-none ${
            fieldErrors.alamat ? "border-[#dc2626] focus:ring-[#dc2626]" : "border-[#cbd5e1] focus:ring-[#1e40af]"
          }`}
          placeholder="Jalan, no rumah, komplek..."
        />
        {fieldErrors.alamat && <p className="mt-1 text-xs text-[#dc2626]">{fieldErrors.alamat}</p>}
      </div>

      {/* RT */}
      <div>
        <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
          RT <span className="text-[#dc2626]">*</span>
        </label>
        <RtDropdown
          value={form.nomor_rt}
          onChange={(v) => {
            setForm({ ...form, nomor_rt: v });
            setFieldErrors((prev) => ({ ...prev, nomor_rt: undefined }));
          }}
        />
        {fieldErrors.nomor_rt && <p className="mt-1 text-xs text-[#dc2626]">{fieldErrors.nomor_rt}</p>}
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
          onChange={(e) => {
            const value = onlyDigits(e.target.value).slice(0, 15);
            setForm({ ...form, telepon: value });
            setFieldErrors((prev) => ({ ...prev, telepon: undefined }));
          }}
          className={`w-full border rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 ${
            fieldErrors.telepon ? "border-[#dc2626] focus:ring-[#dc2626]" : "border-[#cbd5e1] focus:ring-[#1e40af]"
          }`}
          placeholder="08xxxxxxxxxx atau 62xxxxxxxxxx"
        />
        {fieldErrors.telepon ? (
          <p className="mt-1 text-xs text-[#dc2626]">{fieldErrors.telepon}</p>
        ) : (
          <p className="mt-1 text-xs text-[#64748b]">Gunakan format 08xxxxxxxxxx atau 62xxxxxxxxxx.</p>
        )}
      </div>

      {/* Jenis */}
      <div>
        <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
          Jenis Pengajuan <span className="text-[#dc2626]">*</span>
        </label>
        <select
          required
          value={form.jenis}
          onChange={(e) => {
            setForm({ ...form, jenis: e.target.value, sub_jenis: "" });
            setFieldErrors((prev) => ({ ...prev, jenis: undefined, deskripsi: undefined }));
          }}
          className={`w-full border rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 ${
            fieldErrors.jenis ? "border-[#dc2626] focus:ring-[#dc2626]" : "border-[#cbd5e1] focus:ring-[#1e40af]"
          }`}
        >
          <option value="">-- Pilih Jenis --</option>
          {JENIS_LAYANAN.map((j) => (
            <option key={j.id} value={j.id}>{j.label}</option>
          ))}
        </select>
        {fieldErrors.jenis && <p className="mt-1 text-xs text-[#dc2626]">{fieldErrors.jenis}</p>}
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

      {/* Field-field tambahan khusus Surat Pengantar (blanko BANJARBARU) */}
      {showBlankoFields && (
        <>
          {/* Agama */}
          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
              Agama <span className="text-[#dc2626]">*</span>
            </label>
            <select
              required={showBlankoFields}
              value={form.agama}
              onChange={(e) => setForm({ ...form, agama: e.target.value })}
              className="w-full border border-[#cbd5e1] rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            >
              <option value="">-- Pilih Agama --</option>
              {AGAMA.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Status Kawin */}
          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
              Status Perkawinan <span className="text-[#dc2626]">*</span>
            </label>
            <select
              required={showBlankoFields}
              value={form.status_kawin}
              onChange={(e) => setForm({ ...form, status_kawin: e.target.value })}
              className="w-full border border-[#cbd5e1] rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            >
              <option value="">-- Pilih Status --</option>
              {STATUS_KAWIN.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Pendidikan Terakhir */}
          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
              Pendidikan Terakhir <span className="text-[#dc2626]">*</span>
            </label>
            <select
              required={showBlankoFields}
              value={form.pendidikan_terakhir}
              onChange={(e) => setForm({ ...form, pendidikan_terakhir: e.target.value })}
              className="w-full border border-[#cbd5e1] rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            >
              <option value="">-- Pilih Pendidikan --</option>
              {PENDIDIKAN.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Pekerjaan */}
          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
              Pekerjaan <span className="text-[#dc2626]">*</span>
            </label>
            <input
              type="text"
              required={showBlankoFields}
              value={form.pekerjaan}
              onChange={(e) => setForm({ ...form, pekerjaan: e.target.value })}
              className="w-full border border-[#cbd5e1] rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
              placeholder="Pekerjaan Anda"
            />
          </div>

          {/* Keperluan */}
          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
              Keperluan <span className="text-[#dc2626]">*</span>
            </label>
            <textarea
              required={showBlankoFields}
              rows={2}
              value={form.keperluan}
              onChange={(e) => setForm({ ...form, keperluan: e.target.value })}
              className="w-full border border-[#cbd5e1] rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af] resize-none"
              placeholder="Surat pengantar ini digunakan untuk..."
            />
          </div>

          {/* Nama Orang Tua - opsional */}
          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
              Nama Orang Tua / Wali <span className="text-[#94a3b8] normal-case">(opsional)</span>
            </label>
            <input
              type="text"
              value={form.nama_ortu}
              onChange={(e) => setForm({ ...form, nama_ortu: e.target.value })}
              className="w-full border border-[#cbd5e1] rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
              placeholder="Kosongkan bila tidak diperlukan"
            />
          </div>
        </>
      )}

      {/* Deskripsi - hanya untuk jenis non-Surat-Pengantar */}
      {!showBlankoFields && (
        <div>
          <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide">
            Isi Laporan / Keperluan <span className="text-[#dc2626]">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={form.deskripsi}
            onChange={(e) => {
              setForm({ ...form, deskripsi: e.target.value });
              setFieldErrors((prev) => ({ ...prev, deskripsi: undefined }));
            }}
            className={`w-full border rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 resize-none ${
              fieldErrors.deskripsi ? "border-[#dc2626] focus:ring-[#dc2626]" : "border-[#cbd5e1] focus:ring-[#1e40af]"
            }`}
            placeholder="Jelaskan kronologi atau keperluan Anda..."
          />
          {fieldErrors.deskripsi && <p className="mt-1 text-xs text-[#dc2626]">{fieldErrors.deskripsi}</p>}
        </div>
      )}

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
