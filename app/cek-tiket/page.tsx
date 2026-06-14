"use client";

import Image from "next/image";
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
  Sparkles,
} from "lucide-react";

type StatusConfig = {
  label: string;
  color: string;
  bg: string;
  icon: React.ElementType;
  line: string;
};

const statusConfig: Record<string, StatusConfig> = {
  MENUNGGU: {
    label: "Menunggu",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: Clock,
    line: "bg-amber-500",
  },
  DIPROSES: {
    label: "Diproses",
    color: "text-sky-700",
    bg: "bg-sky-50 border-sky-200",
    icon: AlertCircle,
    line: "bg-sky-500",
  },
  ESKALASI_STAF: {
    label: "Eskalasi Staf",
    color: "text-violet-700",
    bg: "bg-violet-50 border-violet-200",
    icon: AlertCircle,
    line: "bg-violet-500",
  },
  SELESAI: {
    label: "Selesai",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: CheckCircle,
    line: "bg-emerald-500",
  },
  DITOLAK: {
    label: "Ditolak",
    color: "text-rose-700",
    bg: "bg-rose-50 border-rose-200",
    icon: XCircle,
    line: "bg-rose-500",
  },
};

const STATUS_STEPS = ["MENUNGGU", "DIPROSES", "ESKALASI_STAF", "SELESAI"];

function StatusTimeline({ status }: { status: string }) {
  const currentIndex = STATUS_STEPS.indexOf(status);
  const isRejected = status === "DITOLAK";

  return (
    <div className="rounded-3xl border border-[#d3e7dc] bg-white p-5 shadow-[0_20px_48px_-34px_rgba(15,23,42,0.34)] sm:p-6">
      <h3 className="mb-4 text-sm font-bold text-slate-900">Progress Tiket</h3>

      <div className="space-y-4 sm:hidden">
        {STATUS_STEPS.map((step, i) => {
          const cfg = statusConfig[step];
          const Icon = cfg.icon;
          const done = currentIndex > i && !isRejected;
          const active = currentIndex === i && !isRejected;

          return (
            <div key={step} className="relative flex items-start gap-3">
              {i < STATUS_STEPS.length - 1 && (
                <div className={`absolute left-[18px] top-9 h-[32px] w-[2px] ${done ? cfg.line : "bg-slate-200"}`} />
              )}
              <div
                className={`relative z-[1] flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                  done ? "border-emerald-600 bg-emerald-500 text-white" : active ? `${cfg.bg} ${cfg.color}` : "border-slate-200 bg-slate-50 text-slate-300"
                }`}
              >
                <Icon size={15} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${done || active ? cfg.color : "text-slate-400"}`}>{cfg.label}</p>
                <p className="text-xs text-slate-500">
                  {active ? "Status saat ini" : done ? "Tahap selesai" : "Menunggu tahap sebelumnya"}
                </p>
              </div>
            </div>
          );
        })}

        {isRejected && (
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-rose-300 bg-rose-50 text-rose-600">
              <XCircle size={15} />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-600">Ditolak</p>
              <p className="text-xs text-rose-500">Permohonan dihentikan sesuai keputusan verifikasi.</p>
            </div>
          </div>
        )}
      </div>

      <div className="hidden sm:block">
        <div className="flex items-start">
          {STATUS_STEPS.map((step, i) => {
            const cfg = statusConfig[step];
            const Icon = cfg.icon;
            const done = currentIndex > i && !isRejected;
            const active = currentIndex === i && !isRejected;

            return (
              <div key={step} className="flex min-w-0 flex-1 items-start last:flex-none">
                <div className="flex min-w-0 flex-col items-center gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-sm ${
                      done ? "border-emerald-600 bg-emerald-500 text-white" : active ? `${cfg.bg} ${cfg.color}` : "border-slate-200 bg-slate-50 text-slate-300"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <span className={`text-center text-[11px] font-semibold ${done || active ? cfg.color : "text-slate-400"}`}>
                    {cfg.label}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`mx-2 mt-5 h-1.5 flex-1 rounded-full ${currentIndex > i && !isRejected ? "bg-emerald-500" : "bg-slate-100"}`} />
                )}
              </div>
            );
          })}
          {isRejected && (
            <div className="flex items-start">
              <div className="mx-2 mt-5 h-1.5 w-10 rounded-full bg-slate-100" />
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-rose-300 bg-rose-50 text-rose-600 shadow-sm">
                  <XCircle size={16} />
                </div>
                <span className="text-center text-[11px] font-semibold text-rose-600">Ditolak</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultPanel({
  title,
  icon: Icon,
  data,
}: {
  title: string;
  icon: React.ElementType;
  data: Record<string, unknown>;
}) {
  const cfg = statusConfig[data.status as string] ?? statusConfig.MENUNGGU;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-[#d4e7dd] bg-white shadow-[0_22px_50px_-34px_rgba(15,23,42,0.3)]">
        <div className="flex items-center justify-between border-b border-[#e5eee8] bg-gradient-to-r from-[#f3fbf6] to-white px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Icon size={18} className={cfg.color} />
            <p className="text-xs font-bold uppercase tracking-[0.11em] text-slate-500">{title}</p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Nomor Tiket</p>
          <p className={`mt-2 font-mono text-[1.85rem] font-bold leading-none tracking-wide ${cfg.color}`}>{data.tiket as string}</p>
          <div className={`mt-4 h-1.5 w-full rounded-full ${cfg.line}`} />
        </div>
      </div>

      <StatusTimeline status={data.status as string} />
    </div>
  );
}

function EmptyTimelineCard() {
  return (
    <div className="rounded-3xl border border-[#d5e7dc] bg-white p-6 shadow-[0_20px_48px_-34px_rgba(15,23,42,0.32)] sm:p-7">
      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#98a6b1]">
        <span>Pengajuan</span>
        <span>Verifikasi</span>
        <span>Proses</span>
        <span>Selesai</span>
      </div>

      <div className="mt-3 flex items-center">
        <div className="h-3 w-3 rounded-full bg-[#d8e1e8]" />
        <div className="mx-2 h-1.5 flex-1 rounded-full bg-[#e4ebf0]" />
        <div className="h-3 w-3 rounded-full bg-[#d8e1e8]" />
        <div className="mx-2 h-1.5 flex-1 rounded-full bg-[#e4ebf0]" />
        <div className="h-3 w-3 rounded-full bg-[#d8e1e8]" />
        <div className="mx-2 h-1.5 flex-1 rounded-full bg-[#e4ebf0]" />
        <div className="h-3 w-3 rounded-full bg-[#d8e1e8]" />
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-[#d6e3db] bg-[#f8fcfa] px-6 py-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f5ee] text-[#1f7a4f]">
          <FileSearch size={24} />
        </div>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-[#6b7280]">
          Masukkan nomor tiket pada form pencarian untuk menampilkan progres permohonan atau pengaduan Anda.
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
    <main className="min-h-full bg-[radial-gradient(circle_at_top,#edf8f1_0%,#f5f8f6_42%,#f5f8f6_100%)] pb-16 sm:pb-20">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f7a43] via-[#0f7a43] to-[#0d6c3b] pt-20 text-white sm:pt-24">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_24%_30%,white_0%,transparent_30%),radial-gradient(circle_at_80%_10%,white_0%,transparent_24%)]" />
        <div className="public-shell relative z-[1] pb-20 sm:pb-24">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]">
                <Sparkles size={13} />
                Ticket Tracking
              </div>
              <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">Cek Status Tiket</h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-emerald-50 sm:text-lg">
                Lacak progres permohonan dan pengaduan Anda secara cepat, rapi, dan transparan dengan tampilan baru yang lebih nyaman dipantau.
              </p>
            </div>

            <div className="space-y-3 pt-5 sm:pt-7 lg:col-span-5 lg:pt-10">
              <div className="rounded-2xl border border-white/30 bg-white/95 px-4 py-3 text-[#0f172a] shadow-lg">
                <div className="flex items-center gap-2">
                  <Ticket size={15} className="text-[#1f7a4f]" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Transparan</p>
                </div>
                <p className="mt-1 text-sm font-bold">Status tiket terlihat dari pengajuan hingga selesai</p>
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/95 px-4 py-3 text-[#0f172a] shadow-lg">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Estimasi Update</p>
                <p className="mt-1 text-sm font-bold">Pembaruan berkala ± 1×24 jam kerja</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-6 sm:-mt-8">
        <div className="public-shell">
          <form
            onSubmit={handleSearch}
            className="rounded-[28px] border border-[#cfe4d8] bg-white p-6 shadow-[0_24px_62px_-34px_rgba(15,23,42,0.32)] sm:p-7"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b98a8]">Pencarian Tiket</p>
                <h2 className="mt-1 text-xl font-bold text-[#0f172a]">Lacak Status Permohonan Anda</h2>
              </div>
              <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-[#e8f5ee] text-[#1f7a4f] sm:flex">
                <Search size={18} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8ba09a]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Masukkan nomor tiket, contoh: 54321"
                  className="public-input h-12 w-full rounded-xl border-[#d7e6de] pl-9 font-mono text-[15px]"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0f7a43] px-6 text-sm font-semibold text-white shadow-[0_16px_34px_-20px_rgba(15,122,67,0.6)] transition hover:-translate-y-0.5 hover:bg-[#0d6b3b] disabled:cursor-not-allowed disabled:opacity-50"
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
        </div>
      </section>

      <section className="mt-6">
        <div className="public-shell">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
            <div className="space-y-6 lg:col-span-6">
              {!result && <EmptyTimelineCard />}

              {result?.error && (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-[0_18px_40px_-30px_rgba(225,29,72,0.55)]">
                  <XCircle size={42} className="mx-auto mb-3 text-rose-400" />
                  <h3 className="mb-1 text-base font-bold text-rose-700">Tiket Tidak Ditemukan</h3>
                  <p className="text-sm text-rose-600">{result.error}. Pastikan nomor tiket yang Anda masukkan benar.</p>
                </div>
              )}

              {result?.permohonan && <ResultPanel title="Permohonan Layanan" icon={FileText} data={result.permohonan} />}
              {result?.pengaduan && <ResultPanel title="Pengaduan Warga" icon={MessageSquare} data={result.pengaduan} />}
            </div>

            <aside className="space-y-6 lg:col-span-4">
              <div className="overflow-hidden rounded-3xl border border-[#d4e7dd] bg-white shadow-[0_22px_52px_-34px_rgba(15,23,42,0.3)]">
                <div className="relative h-56 w-full">
                  <Image
                    src="/img/cek-tiket.jpeg"
                    alt="Ilustrasi petugas verifikasi tiket"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 400px"
                    priority
                  />
                </div>
                <div className="border-t border-[#e4eee8] px-5 py-4">
                  <h3 className="text-base font-bold text-[#0f172a]">Ilustrasi Petugas Verifikasi</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#6f7f90]">
                    Petugas layanan melakukan pengecekan validasi tiket warga secara bertahap.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-[#d4e7dd] bg-white p-5 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.3)]">
                <h3 className="text-base font-bold text-[#0f172a]">Butuh Bantuan?</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#6f7f90]">
                  Jika Anda kesulitan menemukan tiket, hubungi admin layanan kelurahan dengan membawa data pengajuan.
                </p>
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#dce9e1] bg-[#f8fcfa] px-3.5 py-3">
                  <ShieldCheck size={15} className="mt-0.5 text-[#1f7a4f]" />
                  <p className="text-xs leading-relaxed text-[#5f7287]">Tracking tiket transparan untuk menjaga kepercayaan layanan publik.</p>
                </div>
              </div>

              <div className="rounded-3xl border border-[#d4e7dd] bg-white p-5 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.3)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b98a8]">FAQ Shortcut</p>
                <h3 className="mt-1 text-base font-bold text-[#0f172a]">Pertanyaan Umum</h3>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl border border-[#dfebe4] bg-white px-3.5 py-3">
                    <div className="flex items-start gap-2">
                      <HelpCircle size={15} className="mt-0.5 text-[#1f7a4f]" />
                      <div>
                        <p className="text-xs font-semibold text-[#0f172a]">Lupa nomor tiket?</p>
                        <p className="mt-1 text-xs leading-5 text-[#6f7f90]">Cek SMS/WhatsApp/email konfirmasi saat pengajuan.</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#dfebe4] bg-white px-3.5 py-3">
                    <div className="flex items-start gap-2">
                      <HelpCircle size={15} className="mt-0.5 text-[#1f7a4f]" />
                      <div>
                        <p className="text-xs font-semibold text-[#0f172a]">Berapa lama status diperbarui?</p>
                        <p className="mt-1 text-xs leading-5 text-[#6f7f90]">Status diperbarui berkala, umumnya dalam 1×24 jam kerja.</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#dfebe4] bg-white px-3.5 py-3">
                    <div className="flex items-start gap-2">
                      <HelpCircle size={15} className="mt-0.5 text-[#1f7a4f]" />
                      <div>
                        <p className="text-xs font-semibold text-[#0f172a]">Apakah data saya aman?</p>
                        <p className="mt-1 text-xs leading-5 text-[#6f7f90]">Ya, data disimpan dengan standar keamanan layanan publik.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
