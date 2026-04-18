"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle } from "lucide-react";

export default function PermohonanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/permohonan/${id}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [id]);

  const handleUpdate = async (status: string) => {
    setSaving(true);
    const res = await fetch(`/api/permohonan/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setData((prev) => ({ ...prev, ...updated }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const handleCatatan = async (catatan: string) => {
    setSaving(true);
    const res = await fetch(`/api/permohonan/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ catatan }),
    });
    if (res.ok) {
      const updated = await res.json();
      setData((prev) => ({ ...prev, ...updated }));
    }
    setSaving(false);
  };

  if (loading) return <div className="text-stone-400">Memuat...</div>;

  const statusColors: Record<string, string> = {
    MENUNGGU: "bg-yellow-100 text-yellow-700",
    DIPROSES: "bg-blue-100 text-blue-700",
    SELESAI: "bg-green-100 text-green-700",
    DITOLAK: "bg-red-100 text-red-700",
  };

  const statuses = ["MENUNGGU", "DIPROSES", "SELESAI", "DITOLAK"];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/permohonan"
          className="flex items-center gap-2 text-sm text-stone-500 hover:text-[#1e40af] transition-colors"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-stone-900">Detail Permohonan</h1>
          {saved && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <CheckCircle size={12} /> Tersimpan
            </span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <p className="text-xs text-stone-400 font-semibold uppercase tracking-wide mb-1">Nomor Tiket</p>
        <p className="text-2xl font-mono font-bold text-[#1e40af]">{data.tiket}</p>
        <p className="text-xs text-stone-400 mt-1">
          Diajukan: {new Date(data.createdAt ?? Date.now()).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-sm font-bold text-stone-900 mb-4">Informasi Pemohon</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Nama", value: data.nama },
            { label: "NIK", value: data.nik || "-" },
            { label: "Alamat", value: data.alamat },
            { label: "Telepon", value: data.telepon },
            { label: "Layanan", value: data.layanan },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">{label}</p>
              <p className="text-sm font-semibold text-stone-800">{value}</p>
            </div>
          ))}
          <div className="col-span-2">
            <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Keperluan</p>
            <p className="text-sm text-stone-700 bg-stone-50 rounded-lg px-4 py-3">{data.keperluan}</p>
          </div>
          {data.catatan && (
            <div className="col-span-2">
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Catatan Staff</p>
              <p className="text-sm text-stone-700 bg-stone-50 rounded-lg px-4 py-3">{data.catatan}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-sm font-bold text-stone-900 mb-4">Update Status</h2>
        <div className="flex flex-wrap gap-2 mb-5">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => handleUpdate(s)}
              disabled={saving}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                data.status === s
                  ? `${statusColors[s]} ring-2 ring-offset-1 ring-stone-300`
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              } ${saving ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1.5">Catatan Staff</label>
          <div className="flex gap-3">
            <textarea
              id="catatan"
              rows={2}
              defaultValue={data.catatan ?? ""}
              className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 resize-none"
              placeholder="Tambahkan catatan..."
            />
            <button
              onClick={() => {
                const val = (document.getElementById("catatan") as HTMLTextAreaElement).value;
                handleCatatan(val);
              }}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1e40af] text-white text-sm font-semibold rounded-lg hover:bg-[#1e3a8a] disabled:opacity-60 cursor-pointer"
            >
              <Save size={15} />
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
