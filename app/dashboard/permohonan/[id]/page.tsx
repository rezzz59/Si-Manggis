"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle, FileText, AlertCircle } from "lucide-react";

export default function PermohonanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState<string | null>(null);

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
    DISETUJAI_RT: "bg-teal-100 text-teal-700",
    DIPROSES: "bg-blue-100 text-blue-700",
    SELESAI: "bg-green-100 text-green-700",
    DITOLAK_RT: "bg-orange-100 text-orange-700",
    DITOLAK: "bg-red-100 text-red-700",
  };

  const statuses = ["MENUNGGU", "DISETUJAI_RT", "DIPROSES", "SELESAI", "DITOLAK_RT", "DITOLAK"];

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
          Diajukan: {new Date(data.createdat as string).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-sm font-bold text-stone-900 mb-4">Informasi Pemohon</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Nama", value: data.nama },
            { label: "NIK", value: data.nik || "-" },
            { label: "Alamat", value: data.alamat },
            { label: "RT", value: data.nomor_rt ? `RT ${data.nomor_rt}` : "-" },
            { label: "Telepon", value: data.telepon },
            { label: "Layanan", value: data.layanan },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">{label}</p>
              <p className="text-sm font-semibold text-stone-800">{value}</p>
            </div>
          ))}

          {/* Field tambahan khusus Surat Pengantar (kondisional) */}
          {(data.tempat_lahir || data.tanggal_lahir) && (
            <div className="col-span-2">
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Tempat, Tgl. Lahir</p>
              <p className="text-sm font-semibold text-stone-800">
                {data.tempat_lahir || "-"},{" "}
                {data.tanggal_lahir
                  ? new Date(data.tanggal_lahir as string).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })
                  : "-"}
              </p>
            </div>
          )}
          {data.jenis_kelamin && (
            <div>
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Jenis Kelamin</p>
              <p className="text-sm font-semibold text-stone-800">{data.jenis_kelamin as string}</p>
            </div>
          )}
          {data.agama && (
            <div>
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Agama</p>
              <p className="text-sm font-semibold text-stone-800">{data.agama as string}</p>
            </div>
          )}
          {data.status_kawin && (
            <div>
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Status Perkawinan</p>
              <p className="text-sm font-semibold text-stone-800">{data.status_kawin as string}</p>
            </div>
          )}
          {data.pendidikan_terakhir && (
            <div>
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Pendidikan Terakhir</p>
              <p className="text-sm font-semibold text-stone-800">{data.pendidikan_terakhir as string}</p>
            </div>
          )}
          {data.pekerjaan && (
            <div>
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Pekerjaan</p>
              <p className="text-sm font-semibold text-stone-800">{data.pekerjaan as string}</p>
            </div>
          )}

          {data.sub_layanan && (
            <div>
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Sub Jenis</p>
              <p className="text-sm font-semibold text-stone-800">{data.sub_layanan}</p>
            </div>
          )}
          {data.deskripsi && (
            <div className="col-span-2">
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Deskripsi</p>
              <p className="text-sm text-stone-700 bg-stone-50 rounded-lg px-4 py-3">{data.deskripsi}</p>
            </div>
          )}
          {data.keperluan && !data.deskripsi && (
            <div className="col-span-2">
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Keperluan</p>
              <p className="text-sm text-stone-700 bg-stone-50 rounded-lg px-4 py-3">{data.keperluan}</p>
            </div>
          )}
          {data.catatan && (
            <div className="col-span-2">
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Catatan Staff</p>
              <p className="text-sm text-stone-700 bg-stone-50 rounded-lg px-4 py-3">{data.catatan}</p>
            </div>
          )}
          {data.rt_approved_at && (
            <div className="col-span-2">
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Disetujui RT Pada</p>
              <p className="text-sm text-stone-700">{new Date(data.rt_approved_at).toLocaleString("id-ID")}</p>
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

      {data.status === "SELESAI" && (
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="text-sm font-bold text-stone-900 mb-4">Surat</h2>
          {data.surat_url ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={data.surat_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <FileText size={15} />
                Download Surat
              </a>
              <button
                onClick={async () => {
                  if (!confirm("Kirim ulang WA notifikasi ke warga?")) return;
                  const res = await fetch("/api/surat/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ permohonanId: id }),
                  });
                  const resData = await res.json();
                  if (resData.success) alert("WA berhasil dikirim ulang");
                  else alert("Gagal: " + (resData.error ?? "Unknown error"));
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-stone-100 text-stone-700 text-sm font-semibold rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <FileText size={15} />
                Kirim Ulang WA
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-stone-500">Surat belum dibuat. Klik tombol di bawah untuk generate dan kirim ke warga.</p>
              <button
                onClick={async () => {
                  setSaving(true);
                  setGenerateError(null);
                  setGenerateSuccess(null);
                  try {
                    const res = await fetch("/api/surat/generate", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ permohonanId: id }),
                    });
                    const resData = await res.json();
                    if (resData.success) {
                      setGenerateSuccess("Surat berhasil dibuat dan WA terkirim!");
                      setData((prev) => ({ ...prev, surat_url: resData.suratUrl }));
                    } else {
                      setGenerateError(resData.error ?? "Gagal generate surat");
                    }
                  } catch (e) {
                    setGenerateError("Terjadi kesalahan saat generate surat");
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1e40af] text-white text-sm font-semibold rounded-lg hover:bg-[#1e3a8a] disabled:opacity-60 cursor-pointer"
              >
                <FileText size={15} />
                {saving ? "Generating..." : "Generate & Kirim Surat"}
              </button>
              {generateError && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <AlertCircle size={15} />
                  {generateError}
                </div>
              )}
              {generateSuccess && (
                <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
                  <CheckCircle size={15} />
                  {generateSuccess}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
