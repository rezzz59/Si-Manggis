"use client";

import { useState } from "react";
import StatusTracker from "@/src/components/StatusTracker";

interface LaporanData {
  tiket: string;
  nama: string;
  nomor_rt: string | null;
  layanan: string;
  sub_layanan: string | null;
  status: string;
  createdat: string;
  surat_url: string | null;
}

export default function LacakPage() {
  const [tiket, setTiket] = useState("");
  const [data, setData] = useState<LaporanData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!tiket.trim()) return;
    setLoading(true);
    setNotFound(false);
    setData(null);
    setError(null);

    fetch(`/api/cek-tiket/${encodeURIComponent(tiket.trim())}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setNotFound(true); return; }
        setData(d);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="w-8 h-[3px] bg-[#f97316] mb-3" />
          <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight">
            Lacak Pengajuan
          </h1>
          <p className="text-sm text-[#94a3b8] mt-2">
            Masukkan nomor tiket referensi yang Anda dapatkan saat laporan.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            value={tiket}
            onChange={(e) => setTiket(e.target.value)}
            placeholder="Contoh: SM-2026-123456"
            className="flex-1 border border-[#cbd5e1] rounded-sm px-4 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1e40af] hover:bg-[#1e3a8a] disabled:bg-[#93c5fd] text-white text-sm font-semibold px-6 py-2.5 rounded-sm transition-colors"
          >
            {loading ? "..." : "Cari"}
          </button>
        </form>

        {/* Not found */}
        {notFound && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">😕</p>
            <p className="text-lg font-semibold text-[#475569] mb-1">Tiket tidak ditemukan</p>
            <p className="text-sm text-[#94a3b8]">Pastikan nomor tiket sudah benar.</p>
          </div>
        )}

        {/* Result */}
        {data && (
          <div className="bg-white border border-[#e2e8f0] rounded-sm p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="text-[10px] text-[#94a3b8] uppercase tracking-wide">Tiket</p>
                <p className="text-xl font-bold text-[#1e293b]">{data.tiket}</p>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-sm ${
                  data.status === "SELESAI"
                    ? "bg-[#f0fdf4] text-[#16a34a]"
                    : data.status === "DITOLAK" || data.status === "DITOLAK_RT"
                    ? "bg-[#fef2f2] text-[#dc2626]"
                    : "bg-[#eff6ff] text-[#1e40af]"
                }`}
              >
                {data.status}
              </span>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[10px] text-[#94a3b8] uppercase tracking-wide">Nama</p>
                <p className="font-semibold text-[#1e293b]">{data.nama}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#94a3b8] uppercase tracking-wide">RT</p>
                <p className="font-semibold text-[#1e293b]">{data.nomor_rt ? `RT ${data.nomor_rt}` : "-"}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#94a3b8] uppercase tracking-wide">Layanan</p>
                <p className="font-semibold text-[#1e293b]">
                  {data.layanan}{data.sub_layanan ? ` — ${data.sub_layanan}` : ""}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#94a3b8] uppercase tracking-wide">Diajukan</p>
                <p className="font-semibold text-[#1e293b]">
                  {data.createdat ? new Date(data.createdat).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric"
                  }) : "-"}
                </p>
              </div>
            </div>

            {/* Status tracker */}
            <div>
              <p className="text-xs font-semibold text-[#475569] uppercase tracking-wide mb-4">
                Status Pengajuan
              </p>
              <StatusTracker status={data.status} />
            </div>

            {/* Download surat */}
            {data.status === "SELESAI" && data.surat_url && (
              <a
                href={data.surat_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-semibold py-3 rounded-sm transition-colors"
              >
                📥 Download Surat
              </a>
            )}

            {data.status === "SELESAI" && !data.surat_url && (
              <p className="text-sm text-center text-[#94a3b8]">
                Surat sedang dalam proses. Hubungi Kelurahan untuk info lebih lanjut.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}