"use client";

import { useState } from "react";
import {
  Search,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Ticket,
  FileSearch,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import PublicHeroBanner from "@/src/components/PublicHeroBanner";

type StatusConfig = {
  label: string;
  color: string;
  bg: string;
  icon: React.ElementType;
};

const statusConfig: Record<string, StatusConfig> = {
  MENUNGGU: { label: "Menunggu", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200", icon: Clock },
  DIPROSES: { label: "Diproses", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: AlertCircle },
  SELESAI: { label: "Selesai", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle },
  DITOLAK: { label: "Ditolak", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: XCircle },
  ESKALASI_STAF: { label: "Dibesarkan", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: AlertCircle },
};

const STATUS_STEPS = ["MENUNGGU", "DIPROSES", "ESKALASI_STAF", "SELESAI"];

function ProgressTracker({ status }: { status: string }) {
  const currentIndex = STATUS_STEPS.indexOf(status);
  const isRejected = status === "DITOLAK";

  return (
    <div className="overflow-hidden rounded-3xl border border-[#d2e6d9] bg-white shadow-[0_24px_52px_-34px_rgba(13,32,20,0.34)]">
      <div className="border-b border-[#e1eee6] bg-gradient-to-r from-[#f5fbf7] to-[#ffffff] px-6 py-4">
        <h3 className="text-sm font-bold text-[#0f172a]">Progress Status</h3>
      </div>
      <div className="px-5 py-6 sm:px-6">
        <div className="flex items-start gap-0">
          {STATUS_STEPS.map((step, i) => {
            const cfg = statusConfig[step];
            const Icon = cfg.icon;
            const done = currentIndex > i && !isRejected;
            const active = currentIndex === i && !isRejected;

            return (
              <div key={step} className="flex min-w-0 flex-1 items-center last:flex-none">
                <div className="flex min-w-0 flex-col items-center gap-2">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 shadow-sm transition-all ${
                      done
                        ? "border-emerald-600 bg-emerald-500 text-white"
                        : active
                          ? `${cfg.bg} border-current ${cfg.color}`
                          : "border-stone-200 bg-stone-50 text-stone-300"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span
                    className={`text-center text-[11px] font-semibold leading-tight ${done || active ? cfg.color : "text-stone-300"}`}
                  >
                    {cfg.label}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div
                    className={`mx-2 mt-5 h-1.5 flex-1 rounded-full transition-all ${
                      currentIndex > i && !isRejected ? "bg-emerald-500" : "bg-stone-100"
                    }`}
                  />
                )}
              </div>
            );
          })}
          {isRejected && (
            <div className="flex items-center">
              <div className="mx-2 mt-5 h-1.5 flex-1 rounded-full bg-stone-100" />
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-red-300 bg-red-50 text-red-600 shadow-sm">
                  <XCircle size={18} />
                </div>
                <span className="text-center text-[11px] font-semibold leading-tight text-red-600">Ditolak</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PermohonanResult({ data }: { data: Record<string, unknown> }) {
  const cfg = statusConfig[data.status as string] ?? statusConfig.MENUNGGU;

  return (
    <div className="space-y-4">
      <div className={`overflow-hidden rounded-2xl border shadow-[0_20px_42px_-30px_rgba(15,23,42,0.26)] ${cfg.bg}`}>
        <div className="h-1.5 w-full bg-[#0f7a43]" />
        <div className="p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileText size={20} className={cfg.color} />
              <span className="text-xs font-bold uppercase tracking-wide text-stone-500">Permohonan Layanan</span>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
          </div>
          <p className={`font-mono text-[1.65rem] font-bold leading-none tracking-wide ${cfg.color}`}>{data.tiket as string}</p>
        </div>
      </div>
      <ProgressTracker status={data.status as string} />
    </div>
  );
}

function PengaduanResult({ data }: { data: Record<string, unknown> }) {
  const cfg = statusConfig[data.status as string] ?? statusConfig.MENUNGGU;

  return (
    <div className="space-y-4">
      <div className={`overflow-hidden rounded-2xl border shadow-[0_20px_42px_-30px_rgba(15,23,42,0.26)] ${cfg.bg}`}>
        <div className="h-1.5 w-full bg-[#0f7a43]" />
        <div className="p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} className={cfg.color} />
              <span className="text-xs font-bold uppercase tracking-wide text-stone-500">Pengaduan Warga</span>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
          </div>
          <p className={`font-mono text-[1.65rem] font-bold leading-none tracking-wide ${cfg.color}`}>{data.tiket as string}</p>
        </div>
      </div>
      <ProgressTracker status={data.status as string} />
    </div>
  );
}

function TimelinePlaceholder() {
  return (
    <div className="rounded-3xl border border-[#dcebe3] bg-white p-6 shadow-[0_20px_42px_-30px_rgba(15,23,42,0.28)] sm:p-7">
      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9aa7b5]">
        <span>Pengajuan</span>
        <span>Diproses</span>
        <span>Selesai</span>
      </div>
      <div className="mt-3 flex items-center">
        <div className="h-3 w-3 rounded-full bg-[#d8e1e8]" />
        <div className="mx-2 h-1 flex-1 rounded-full bg-[#e4ebf0]" />
        <div className="h-3 w-3 rounded-full bg-[#d8e1e8]" />
        <div className="mx-2 h-1 flex-1 rounded-full bg-[#e4ebf0]" />
        <div className="h-3 w-3 rounded-full bg-[#d8e1e8]" />
      </div>
      <div className="mt-7 rounded-2xl border border-dashed border-[#d9e4dd] bg-[#f9fcfa] px-6 py-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#e9f5ee] text-[#1f7a4f]">
          <FileSearch size={24} />
        </div>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-[#6b7280]">
          Masukkan nomor tiket Anda di atas untuk melihat riwayat perjalanan permohonan Anda.
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
    <main className="min-h-full bg-[#f4f7f5]">
      <PublicHeroBanner
        kicker="Ticket Tracking"
        title="Cek Status Tiket"
        description="Pantau progres permohonan atau pengaduan Anda secara cepat, transparan, dan terstruktur dengan antarmuka yang lebih jelas."
        visual={
          <div className="space-y-3">
            <div className="rounded-2xl border border-[#dcebe3] bg-gradient-to-b from-white to-[#f6fbf8] p-4 shadow-[0_16px_34px_-26px_rgba(15,23,42,0.32)]">
              <div className="flex items-center gap-2">
                <Ticket size={15} className="text-[#1f7a4f]" />
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#64748b]">Transparan</p>
              </div>
              <p className="mt-1 text-sm font-bold text-[#0f172a]">Lacak status dari pengajuan hingga selesai</p>
            </div>
            <div className="rounded-2xl border border-[#dcebe3] bg-white p-4 shadow-[0_16px_34px_-26px_rgba(15,23,42,0.28)]">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#64748b]">Estimasi</p>
              <p className="mt-1 text-sm font-bold text-[#0f172a]">Pembaruan berkala ± 1×24 jam kerja</p>
            </div>
          </div>
        }
      />

      <section className="relative -mt-8 pb-14 sm:pb-16">
        <div className="public-shell">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
            <div className="space-y-6 lg:col-span-6">
              <form onSubmit={handleSearch} className="rounded-3xl border border-[#dcebe3] bg-white p-6 shadow-[0_20px_42px_-30px_rgba(15,23,42,0.28)] sm:p-7">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b98a8]">
                  Nomor Tiket
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8ba09a]" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Contoh: 54321"
                      className="public-input h-12 w-full pl-9 font-mono text-[15px]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0f7a43] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_-18px_rgba(15,122,67,0.55)] transition hover:-translate-y-0.5 hover:bg-[#0d6b3b] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Search size={15} />
                    )}
                    {loading ? "Mencari..." : "Cek Status"}
                  </button>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#748394]">
                  Nomor tiket diberikan saat Anda mengajukan permohonan atau pengaduan.
                </p>
              </form>

              {!result && <TimelinePlaceholder />}

              {result?.error && (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-[0_18px_36px_-28px_rgba(220,38,38,0.45)]">
                  <XCircle size={40} className="mx-auto mb-3 text-red-400" />
                  <h3 className="mb-1 text-base font-bold text-red-700">Tiket Tidak Ditemukan</h3>
                  <p className="text-sm text-red-600">{result.error}. Pastikan nomor tiket yang Anda masukkan benar.</p>
                </div>
              )}

              {result?.permohonan && <PermohonanResult data={result.permohonan} />}
              {result?.pengaduan && <PengaduanResult data={result.pengaduan} />}
            </div>

            <aside className="space-y-6 lg:col-span-4">
              <div className="rounded-3xl border border-[#dcebe3] bg-white p-5 shadow-[0_20px_42px_-30px_rgba(15,23,42,0.28)]">
                <div className="overflow-hidden rounded-2xl border border-[#d8e7dd] bg-[#edf7f1]">
                  <div className="relative h-56 w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/img/cek-tiket.jpeg"
                      alt="Ilustrasi petugas layanan mengecek dokumen tiket warga"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/img/layanan.png";
                      }}
                    />
                  </div>
                  <div className="border-t border-[#d8e7dd] bg-white px-4 py-3">
                    <p className="text-sm font-semibold text-[#1f7a4f]">Ilustrasi Petugas Verifikasi</p>
                    <p className="mt-1 text-xs text-[#6b7280]">Petugas layanan mengecek dokumen tiket warga.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[#dcebe3] bg-white p-5 shadow-[0_20px_42px_-30px_rgba(15,23,42,0.28)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b98a8]">FAQ Shortcut</p>
                <h3 className="mt-1 text-base font-bold text-[#0f172a]">Pertanyaan umum</h3>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl border border-[#e2ebe6] bg-white px-3.5 py-3">
                    <p className="text-xs font-semibold text-[#0f172a]">Lupa Nomor Tiket?</p>
                    <p className="mt-1 text-xs leading-5 text-[#6f7f90]">
                      Cek SMS/WhatsApp/email konfirmasi saat pengajuan.
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#e2ebe6] bg-white px-3.5 py-3">
                    <p className="text-xs font-semibold text-[#0f172a]">Berapa lama status diperbarui?</p>
                    <p className="mt-1 text-xs leading-5 text-[#6f7f90]">
                      Status diperbarui berkala, umumnya dalam 1×24 jam kerja.
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#e2ebe6] bg-white px-3.5 py-3">
                    <p className="text-xs font-semibold text-[#0f172a]">Apakah data saya aman?</p>
                    <p className="mt-1 text-xs leading-5 text-[#6f7f90]">
                      Ya, data pengajuan disimpan aman sesuai kebijakan layanan.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#dce9e1] bg-[#f8fcfa] px-3.5 py-3">
                  <ShieldCheck size={15} className="mt-0.5 text-[#1f7a4f]" />
                  <p className="text-xs leading-relaxed text-[#5f7287]">
                    Tracking tiket transparan untuk menjaga kepercayaan layanan publik.
                  </p>
                </div>

                <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#dce9e1] bg-[#f8fcfa] px-3.5 py-3">
                  <HelpCircle size={15} className="mt-0.5 text-[#1f7a4f]" />
                  <p className="text-xs leading-relaxed text-[#5f7287]">
                    Butuh bantuan lebih lanjut? Hubungi kantor kelurahan atau admin layanan.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
