"use client";

import { useState, useEffect } from "react";
import { Newspaper, Plus, Search, Edit, Trash2, Eye, Calendar, X, Loader2, Save, Image, FileText } from "lucide-react";
import Link from "next/link";

export type ArtikelItem = {
  id: string;
  slug: string;
  judul: string;
  excerpt: string | null;
  konten: string | null;
  kategori: string | null;
  gambar_url: string | null;
  tgl_publish: string;
  is_published: boolean;
  is_featured: boolean;
};

const defaultGambar = "/img/bg.png";

export default function ArtikelDashboardPage() {
  const [items, setItems] = useState<ArtikelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<ArtikelItem | null>(null);
  const [form, setForm] = useState({
    judul: "",
    excerpt: "",
    konten: "",
    gambar_url: defaultGambar,
    kategori: "berita",
    tgl_publish: new Date().toISOString().split("T")[0],
    is_published: false,
    is_featured: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchArtikel();
  }, []);

  const fetchArtikel = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/artikel");
      const json = await res.json();
      // API only returns published, so we fetch all from a special admin endpoint
      const allRes = await fetch("/api/artikel?all=true");
      const allJson = await allRes.json();
      if (allJson.data) setItems(allJson.data);
      else if (json.data) setItems(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      (item.excerpt?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
      (item.kategori?.toLowerCase() ?? "").includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditItem(null);
    setForm({
      judul: "",
      excerpt: "",
      konten: "",
      gambar_url: defaultGambar,
      kategori: "berita",
      tgl_publish: new Date().toISOString().split("T")[0],
      is_published: false,
      is_featured: false,
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEdit = (item: ArtikelItem) => {
    setEditItem(item);
    setForm({
      judul: item.judul,
      excerpt: item.excerpt || "",
      konten: item.konten || "",
      gambar_url: item.gambar_url || defaultGambar,
      kategori: item.kategori || "berita",
      tgl_publish: item.tgl_publish,
      is_published: item.is_published,
      is_featured: item.is_featured,
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = editItem ? `/api/artikel/${editItem.id}` : "/api/artikel";
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

      setSuccess(editItem ? "Artikel berhasil diperbarui" : "Artikel berhasil ditambahkan");
      setShowModal(false);
      fetchArtikel();
    } catch (e) {
      setError("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: ArtikelItem) => {
    if (!confirm(`Hapus artikel "${item.judul}"?`)) return;

    try {
      const res = await fetch(`/api/artikel/${item.id}`, { method: "DELETE" });
      if (res.ok) {
        fetchArtikel();
      } else {
        alert("Gagal menghapus");
      }
    } catch (e) {
      alert("Terjadi kesalahan");
    }
  };

  const togglePublished = async (item: ArtikelItem) => {
    try {
      const res = await fetch(`/api/artikel/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !item.is_published }),
      });
      if (res.ok) {
        fetchArtikel();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Kelola Artikel</h1>
          <p className="text-sm text-stone-500 mt-1">
            Publish dan kelola artikel berita
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1f7a4f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#176741]"
        >
          <Plus size={16} />
          Artikel Baru
        </button>
      </div>

      <div className="mb-4 rounded-xl border border-stone-200 bg-white p-4">
        <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2">
          <Search size={16} className="text-stone-400" />
          <input
            type="text"
            placeholder="Cari artikel..."
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
        <div className="space-y-3">
          {filteredItems.map((artikel) => (
            <div
              key={artikel.id}
              className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={() => togglePublished(artikel)}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold cursor-pointer hover:opacity-80 ${
                      artikel.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {artikel.is_published ? "Published" : "Draft"}
                  </button>
                  {artikel.kategori && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                      {artikel.kategori}
                    </span>
                  )}
                  {artikel.is_featured && (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-stone-900 truncate">
                  {artikel.judul}
                </h3>
                {artikel.excerpt && (
                  <p className="mt-1 text-sm text-stone-500 truncate">
                    {artikel.excerpt}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-3 text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {artikel.tgl_publish}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex items-center gap-1">
                <Link
                  href={`/artikel/${artikel.slug}`}
                  target="_blank"
                  className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
                >
                  <Eye size={16} />
                </Link>
                <button
                  onClick={() => openEdit(artikel)}
                  className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(artikel)}
                  className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
          <Newspaper size={32} className="mx-auto mb-3 text-stone-400" />
          <p className="text-sm font-medium text-stone-600">
            Belum Ada Artikel
          </p>
          <p className="mt-1 text-xs text-stone-400">
            Klik tombol "Artikel Baru" untuk membuat artikel pertama
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900">
                {editItem ? "Edit Artikel" : "Artikel Baru"}
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
                  Judul Artikel *
                </label>
                <input
                  type="text"
                  value={form.judul}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, judul: e.target.value }))
                  }
                  placeholder="Judul artikel"
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#1f7a4f] focus:ring-2 focus:ring-[#1f7a4f]/20"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Excerpt / Ringkasan
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, excerpt: e.target.value }))
                  }
                  placeholder="Ringkasan artikel..."
                  rows={2}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#1f7a4f] focus:ring-2 focus:ring-[#1f7a4f]/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  Konten
                </label>
                <textarea
                  value={form.konten}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, konten: e.target.value }))
                  }
                  placeholder="Konten artikel..."
                  rows={6}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#1f7a4f] focus:ring-2 focus:ring-[#1f7a4f]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Kategori
                  </label>
                  <select
                    value={form.kategori}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, kategori: e.target.value }))
                    }
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#1f7a4f] focus:ring-2 focus:ring-[#1f7a4f]/20"
                  >
                    <option value="berita">Berita</option>
                    <option value="pengumuman">Pengumuman</option>
                    <option value="kegagalan">Kegagalan</option>
                    <option value="/info">/Info</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Tanggal Publish
                  </label>
                  <input
                    type="date"
                    value={form.tgl_publish}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, tgl_publish: e.target.value }))
                    }
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#1f7a4f] focus:ring-2 focus:ring-[#1f7a4f]/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">
                  URL Gambar
                </label>
                <input
                  type="text"
                  value={form.gambar_url}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, gambar_url: e.target.value }))
                  }
                  placeholder="/img/bg.png"
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#1f7a4f] focus:ring-2 focus:ring-[#1f7a4f]/20"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-stone-700">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, is_published: e.target.checked }))
                    }
                    className="rounded border-stone-300 text-[#1f7a4f] focus:ring-[#1f7a4f]"
                  />
                  Publish sekarang
                </label>

                <label className="flex items-center gap-2 text-sm text-stone-700">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, is_featured: e.target.checked }))
                    }
                    className="rounded border-stone-300 text-[#1f7a4f] focus:ring-[#1f7a4f]"
                  />
                  Featured
                </label>
              </div>

              <button
                onClick={handleSave}
                disabled={saving || !form.judul}
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
                    Simpan Artikel
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
