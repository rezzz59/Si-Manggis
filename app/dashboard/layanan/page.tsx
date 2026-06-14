"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Clock, Users, Plus, X, Pencil, Trash2, Loader2, Save } from "lucide-react";

interface Layanan {
  id?: string;
  nama: string;
  icon: string;
  estimasi: string;
  dokumen: string[];
  warna_bg: string;
  warna_text: string;
  is_active?: boolean;
}

const warnaOptions = [
  { bg: "bg-blue-50", text: "text-blue-600", label: "Biru" },
  { bg: "bg-indigo-50", text: "text-indigo-600", label: "Indigo" },
  { bg: "bg-green-50", text: "text-green-600", label: "Hijau" },
  { bg: "bg-amber-50", text: "text-amber-600", label: "Kuning" },
  { bg: "bg-orange-50", text: "text-orange-600", label: "Oranye" },
  { bg: "bg-red-50", text: "text-red-600", label: "Merah" },
  { bg: "bg-purple-50", text: "text-purple-600", label: "Ungu" },
  { bg: "bg-pink-50", text: "text-pink-600", label: "Merah Muda" },
];

export const metadata = {
  title: "Kelola Layanan - Si-Manggis Admin",
};

export default function LayananDashboardPage() {
  const [layananList, setLayananList] = useState<Layanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [Saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Layanan>({
    nama: "",
    icon: "file-text",
    estimasi: "",
    dokumen: [],
    warna_bg: "bg-blue-50",
    warna_text: "text-blue-600",
  });
  const [dokumenInput, setDokumenInput] = useState("");

  useEffect(() => {
    fetchLayanan();
  }, []);

  async function fetchLayanan() {
    try {
      const res = await fetch("/api/layanan");
      const data = await res.json();
      if (data && data.length > 0) {
        setLayananList(data);
      }
    } catch (e) {
      console.error("Error fetch layanan:", e);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      nama: "",
      icon: "file-text",
      estimasi: "",
      dokumen: [],
      warna_bg: "bg-blue-50",
      warna_text: "text-blue-600",
    });
    setDokumenInput("");
    setEditingId(null);
  }

  function openAddModal() {
    resetForm();
    setShowModal(true);
  }

  function openEditModal(layanan: Layanan) {
    setForm({
      ...layanan,
      dokumen: layanan.dokumen || [],
    });
    setDokumenInput(layanan.dokumen?.join(", ") || "");
    setEditingId(layanan.id || null);
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Parse dokumen
      const docs = dokumenInput
        .split(",")
        .map((d) => d.trim())
        .filter((d) => d);

      const payload = {
        ...form,
        dokumen: docs,
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/layanan/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/layanan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Gagal simpan");

      await fetchLayanan();
      setShowModal(false);
      resetForm();
    } catch (e) {
      console.error("Error save:", e);
      alert("Gagal menyimpan layanan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin hapus layanan ini?")) return;
    try {
      const res = await fetch(`/api/layanan/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal hapus");
      await fetchLayanan();
    } catch (e) {
      console.error("Error delete:", e);
      alert("Gagal menghapus layanan");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Kelola Layanan</h1>
          <p className="text-sm text-stone-500 mt-1">
            Konfigurasi layanan administrasi kelurahan
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1f7a4f] px-4 py-2 text-sm font-medium text-white hover:bg-[#176741]"
        >
          <Plus size={18} />
          Tambah Layanan
        </button>
      </div>

      {layananList.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
          <ClipboardList size={32} className="mx-auto mb-3 text-stone-400" />
          <p className="text-sm font-medium text-stone-600">
            Belum ada layanan
          </p>
          <p className="mt-1 text-xs text-stone-400">
            Klik "Tambah Layanan" untuk membuat yang pertama
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {layananList.map((layanan) => (
            <div
              key={layanan.id}
              className="group relative rounded-xl border border-stone-200 bg-white p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${layanan.warna_bg || "bg-blue-50"} ${layanan.warna_text || "text-blue-600"}`}
                >
                  {layanan.nama}
                </span>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => openEditModal(layanan)}
                    className="rounded p-1 hover:bg-stone-100"
                    title="Edit"
                  >
                    <Pencil size={14} className="text-stone-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(layanan.id!)}
                    className="rounded p-1 hover:bg-red-50"
                    title="Hapus"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-stone-600">
                  <Clock size={14} />
                  <span>{layanan.estimasi || "-"}</span>
                </div>
                <div className="flex items-start gap-2 text-stone-600">
                  <Users size={14} className="mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {(layanan.dokumen || []).map((doc, i) => (
                      <span
                        key={i}
                        className="rounded bg-stone-100 px-2 py-0.5 text-xs"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900">
                {editingId ? "Edit Layanan" : "Tambah Layanan"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded p-1 hover:bg-stone-100"
              >
                <X size={20} className="text-stone-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-stone-600">
                  Nama Layanan *
                </label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#1f7a4f]"
                  placeholder="Surat Keterangan"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-stone-600">
                  Estimasi Waktu
                </label>
                <input
                  type="text"
                  value={form.estimasi}
                  onChange={(e) => setForm({ ...form, estimasi: e.target.value })}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#1f7a4f]"
                  placeholder="1-3 hari kerja"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-stone-600">
                  Dokumen Needed (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={dokumenInput}
                  onChange={(e) => setDokumenInput(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#1f7a4f]"
                  placeholder="KTP asli, KK asli, Surat pengantar RT/RW"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-stone-600">
                  Warna
                </label>
                <div className="flex flex-wrap gap-2">
                  {warnaOptions.map((w) => (
                    <button
                      key={w.label}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          warna_bg: w.bg,
                          warna_text: w.text,
                        })
                      }
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${w.bg} ${w.text} ${
                        form.warna_bg === w.bg
                          ? "ring-2 ring-[#1f7a4f] ring-offset-1"
                          : ""
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-lg border border-stone-300 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={Saving || !form.nama}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#1f7a4f] py-2 text-sm font-medium text-white hover:bg-[#176741] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {Saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
