"use client";

import { useState } from "react";
import { Search, FileText, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, Ticket, Download } from "lucide-react";

type StatusConfig = {
  label: string;
  color: string;
  bg: string;
  icon: React.ElementType;
};

const statusConfig: Record<string, StatusConfig> = {
  MENUNGGU:    { label: "Menunggu",     color: "text-yellow-700",  bg: "bg-yellow-50 border-yellow-200", icon: Clock },
  DIPROSES:    { label: "Diproses",     color: "text-blue-700",    bg: "bg-blue-50 border-blue-200", icon: AlertCircle },
  SELESAI:     { label: "Selesai",      color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle },
  DITOLAK:     { label: "Ditolak",      color: "text-red-700",     bg: "bg-red-50 border-red-200", icon: XCircle },
  ESKALASI_STAF: { label: "Dibesarkan", color: "text-amber-700",    bg: "bg-amber-50 border-amber-200", icon: AlertCircle },
};

const STATUS_STEPS = ["MENUNGGU", "DIPROSES", "ESKALASI_STAF", "SELESAI"];

function ProgressTracker({ status }: { status: string }) {
  const currentIndex = STATUS_STEPS.indexOf(status);
  const isRejected = status === "DITOLAK";

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6">
      <h3 className="text-sm font-bold text-stone-900 mb-5">Progress Status</h3>
      <div className="flex items-center gap-0">
        {STATUS_STEPS.map((step, i) => {
          const cfg = statusConfig[step];
          const Icon = cfg.icon;
          const done = currentIndex > i && !isRejected;
          const active = currentIndex === i && !isRejected;

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    done
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : active
                      ? `${cfg.bg} border-current ${cfg.color}`
                      : "bg-stone-50 border-stone-200 text-stone-300"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span className={`text-xs font-semibold ${done || active ? cfg.color : "text-stone-300"}`}>
                  {cfg.label}
                </span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                    currentIndex > i && !isRejected ? "bg-emerald-400" : "bg-stone-100"
                  }`}
                />
              )}
            </div>
          );
        })}
        {isRejected && (
          <div className="flex items-center">
            <div className="flex-1 h-1 mx-2 bg-stone-100" />
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-red-50 border-2 border-red-300 text-red-600">
                <XCircle size={18} />
              </div>
              <span className="text-xs font-semibold text-red-600">Ditolak</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PermohonanResult({ data }: { data: Record<string, unknown> }) {
  const cfg = statusConfig[data.status as string] ?? statusConfig.MENUNGGU;

  return (
    <div className="space-y-4">
      {/* Ticket Header */}
      <div className={`rounded-xl border p-5 ${cfg.bg}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText size={20} className={cfg.color} />
            <span className="text-xs font-bold uppercase tracking-wide text-stone-500">
              Permohonan Layanan
            </span>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
        <p className={`text-2xl font-bold font-mono ${cfg.color}`}>{data.tiket as string}</p>
      </div>

      <ProgressTracker status={data.status as string} />

      {/* Eskalasi Banner */}
      {data.status === "ESKALASI_STAF" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            Permohonan ini telah dibesarkan ke admin desa untuk ditindaklanjuti. Staf desa akan menghubungi Anda melalui nomor telepon yang terdaftar.
          </p>
        </div>
      )}

      {/* Details */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h3 className="text-sm font-bold text-stone-900 mb-4">Detail Permohonan</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {[
            { label: "Nama Pemohon", value: data.nama as string },
            { label: "NIK", value: (data.nik as string) || "—" },
            { label: "Layanan", value: data.layanan as string },
            { label: "Telepon", value: data.telepon as string },
            { label: "Alamat", value: data.alamat as string },
            { label: "Diajukan", value: new Date(data.createdat as string).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">{label}</p>
              <p className="text-sm font-semibold text-stone-800">{value}</p>
            </div>
          ))}

          {/* Field tambahan khusus Surat Pengantar (kondisional) */}
          {Boolean(data.tempat_lahir || data.tanggal_lahir) && (
            <div className="col-span-2">
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Tempat, Tgl. Lahir</p>
              <p className="text-sm font-semibold text-stone-800">
                {String(data.tempat_lahir ?? "—")},{" "}
                {data.tanggal_lahir
                  ? new Date(String(data.tanggal_lahir)).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })
                  : "—"}
              </p>
            </div>
          )}
          {data.jenis_kelamin ? (
            <div>
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Jenis Kelamin</p>
              <p className="text-sm font-semibold text-stone-800">{String(data.jenis_kelamin)}</p>
            </div>
          ) : null}
          {data.agama ? (
            <div>
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Agama</p>
              <p className="text-sm font-semibold text-stone-800">{String(data.agama)}</p>
            </div>
          ) : null}
          {data.status_kawin ? (
            <div>
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Status Perkawinan</p>
              <p className="text-sm font-semibold text-stone-800">{String(data.status_kawin)}</p>
            </div>
          ) : null}
          {data.pendidikan_terakhir ? (
            <div>
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Pendidikan Terakhir</p>
              <p className="text-sm font-semibold text-stone-800">{String(data.pendidikan_terakhir)}</p>
            </div>
          ) : null}
          {data.pekerjaan ? (
            <div>
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Pekerjaan</p>
              <p className="text-sm font-semibold text-stone-800">{String(data.pekerjaan)}</p>
            </div>
          ) : null}

          <div className="col-span-2">
            <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Keperluan</p>
            <p className="text-sm text-stone-700 bg-stone-50 rounded-lg px-4 py-3">{(data.deskripsi as string) || (data.keperluan as string) || "—"}</p>
          </div>
          {(data.catatan as string) && (
            <div className="col-span-2">
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Catatan Staff</p>
              <p className="text-sm text-stone-700 bg-yellow-50 rounded-lg px-4 py-3 border border-yellow-100">
                {data.catatan as string}
              </p>
            </div>
          )}
        </div>

        {data.status === "SELESAI" && (
          <div className="mt-4">
            {(data.surat_url as string) ? (
              <a
                href={data.surat_url as string}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-5 hover:bg-emerald-100 transition-colors"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-500 text-white flex-shrink-0">
                  <Download size={22} />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-800">Surat Anda Sudah Siap</p>
                  <p className="text-xs text-emerald-600">Klik untuk download dokumen PDF</p>
                </div>
              </a>
            ) : (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-5">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-amber-500 text-white flex-shrink-0">
                  <Clock size={22} />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-800">Surat Sedang Diproses</p>
                  <p className="text-xs text-amber-600">Dokumen surat akan segera tersedia. Silakan cek kembali nanti.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 flex items-start gap-3">
        <AlertCircle size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-700">
          Staff desa akan menghubungi Anda melalui nomor telepon yang terdaftar. Untuk pertanyaan lebih lanjut, hubungi kantor desa.
        </p>
      </div>
    </div>
  );
}

function PengaduanResult({ data }: { data: Record<string, unknown> }) {
  const cfg = statusConfig[data.status as string] ?? statusConfig.MENUNGGU;

  return (
    <div className="space-y-4">
      {/* Ticket Header */}
      <div className={`rounded-xl border p-5 ${cfg.bg}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className={cfg.color} />
            <span className="text-xs font-bold uppercase tracking-wide text-stone-500">
              Pengaduan Warga
            </span>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
        <p className={`text-2xl font-bold font-mono ${cfg.color}`}>{data.tiket as string}</p>
      </div>

      <ProgressTracker status={data.status as string} />

      {/* Details */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h3 className="text-sm font-bold text-stone-900 mb-4">Detail Pengaduan</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {[
            { label: "Nama Pengadu", value: data.nama as string },
            { label: "Topik", value: data.topik as string },
            { label: "Telepon", value: (data.telepon as string) || "—" },
            { label: "Email", value: (data.email as string) || "—" },
            { label: "Diajukan", value: new Date(data.createdat as string).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">{label}</p>
              <p className="text-sm font-semibold text-stone-800">{value}</p>
            </div>
          ))}
          <div className="col-span-2">
            <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Pesan</p>
            <p className="text-sm text-stone-700 bg-stone-50 rounded-lg px-4 py-3">{data.pesan as string}</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 flex items-start gap-3">
        <AlertCircle size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-700">
          Terima kasih telah melaporkan. Kami akan menindaklanjuti pengaduan Anda secepat mungkin.
        </p>
      </div>
    </div>
  );
}

export default function CekTiketPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    permohonan: Record<string, unknown> | null;
    pengaduan: Record<string, unknown> | null;
    error: string;
  } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/cek-tiket/${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setResult({ permohonan: null, pengaduan: null, error: data.error ?? "Tiket tidak ditemukan" });
      } else {
        setResult(data);
      }
    } catch {
      setResult({ permohonan: null, pengaduan: null, error: "Terjadi kesalahan. Silakan coba lagi." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="bg-[#1e40af] pt-32 pb-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <Ticket size={18} className="text-white/60" />
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest">
              Lacak Pengajuan
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Cek Status Tiket
          </h1>
          <p className="text-white/70 text-sm max-w-md">
            Masukkan nomor tiket yang Anda terima saat mengajukan permohonan atau pengaduan.
          </p>
        </div>
      </section>

      {/* Search Form */}
      <section className="bg-stone-50 py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm -mt-20">
            <label className="block text-xs font-semibold text-stone-600 mb-2">
              Nomor Tiket
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Contoh: SM-2026-535416"
                className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af] font-mono"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="flex items-center gap-2 bg-[#1e40af] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#1e3a8a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {loading ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Search size={16} />
                )}
                {loading ? "Mencari..." : "Cek Status"}
              </button>
            </div>
            <p className="text-xs text-stone-400 mt-2">
              Nomor tiket diberikan saat Anda mengajukan permohonan atau pengaduan.
            </p>
          </form>

          {/* Results */}
          <div className="mt-6 space-y-4">
            {/* Not found */}
            {result?.error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <XCircle size={40} className="text-red-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-red-700 mb-1">Tiket Tidak Ditemukan</h3>
                <p className="text-sm text-red-600">
                  {result.error}. Pastikan nomor tiket yang Anda masukkan benar.
                </p>
              </div>
            )}

            {/* Permohonan */}
            {result?.permohonan && (
              <PermohonanResult data={result.permohonan} />
            )}

            {/* Pengaduan */}
            {result?.pengaduan && (
              <PengaduanResult data={result.pengaduan} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
