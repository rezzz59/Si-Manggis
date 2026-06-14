"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Search, Edit, Trash2, Phone, X, Loader2, Save } from "lucide-react";

export type RtItem = {
  id: string;
  nomor_rt: string;
  nama_ketua: string | null;
  no_wa_rt: string | null;
  rw_id: string | null;
  created_at: string;
  updated_at: string;
};

export default function RtDashboardPage() {
  const [items, setItems] = useState<RtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<RtItem | null>(null);
  const [form, setForm] = useState({ nomor_rt: "", nama_ketua: "", no_wa_rt: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchRt();
  }, []);

  const fetchRt = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rt");
      const json = await res.json();
      if (json.data) setItems(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.nomor_rt.toLowerCase().includes(search.toLowerCase()) ||
      (item.nama_ketua?.toLowerCase() ?? "").includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditItem(null);
    setForm({ nomor_rt: "", nama_ketua: "", no_wa_rt: "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (item: RtItem) => {
    setEditItem(item);
    setForm({
      nomor_rt: item.nomor_rt,
      nama_ketua: item.nama_ketua || "",
      no_wa_rt: item.no_wa_rt || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = editItem ? `/api/rt/${editItem.id}` : "/api/rt";
      const method = editItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Gagal menyimpan");
        return;
      }

      setSuccess(editItem ? "RT berhasil diperbarui" : "RT berhasil ditambahkan");
      setShowModal(false);
      fetchRt();
    } catch (e) {
      setError("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: RtItem) => {
    if (!confirm(`Hapus RT ${item.nomor_rt}?`)) return;

    try {
      const res = await fetch(`/api/rt/${item.id}`, { method: "DELETE" });
      if (res.ok) {
        fetchRt();
      } else {
        alert("Gagal menghapus");
      }
    } catch (e) {
      alert("Terjadi kesalahan");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Kelola RT</h1>
          <p className="text-sm text-stone-500 mt-1">
            Data RT dan RW kelurahan
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1f7a4f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#176741]"
        >
          <Plus size={16} />
          Tambah RT
        </button>
      </div>

      <div className="mb-4 rounded-xl border border-stone-200 bg-white p-4">
        <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2">
          <Search size={16} className="text-stone-400" />
          <input
            type="text"
            placeholder="Cari RT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-stone-400" size={24} />
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((rt) => (
            <div
              key={rt.id}
              className="rounded-xl border border-stone-200 bg-white p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-sm font-bold text-blue-700">
                  RT {rt.nomor_rt}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(rt)}
                    className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(rt)}
                    className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-stone-600">
                  <Users size={14} className="text-stone-400" />
                  <span>{rt.nama_ketua ?? "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600">
                  <Phone size={14} className="text-stone-400" />
                  <span>{rt.no_wa_rt ?? "-"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
          <Users size={32} className="mx-auto mb-3 text-stone-400" />
          <p className="text-sm font-medium text-stone-600">
            Data RT Kosong
          </p>
          <p className="mt-1 text-xs text-stone-400">
            Klik tombol "Tambah RT" untuk menambahkan data
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900">
                {editItem ? "Edit RT" : "Tambah RT"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Nomor RT
                </label>
                <input
                  type="text"
                  value={form.nomor_rt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nomor_rt: e.target.value }))
                  }
                  placeholder="01"
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#1f7a4f] focus:ring-2 focus:ring-[#1f7a4f]/20"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Nama Ketua
                </label>
                <input
                  type="text"
                  value={form.nama_ketua}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nama_ketua: e.target.value }))
                  }
                  placeholder="Nama lengkap"
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#1f7a4f] focus:ring-2 focus:ring-[#1f7a4f]/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  No. WA
                </label>
                <input
                  type="tel"
                  value={form.no_wa_rt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, no_wa_rt: e.target.value }))
                  }
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#1f7a4f] focus:ring-2 focus:ring-[#1f7a4f]/20"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving || !form.nomor_rt}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1f7a4f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#176741] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Simpan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
