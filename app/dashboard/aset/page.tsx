// app/dashboard/aset/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Images, Filter } from "lucide-react";
import AssetCard from "@/src/components/AssetCard";

type Asset = {
  id: string;
  filename: string;
  storage_url: string;
  category: string;
  alt_text: string;
  caption: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

const CATEGORIES = [
  { value: "", label: "Semua" },
  { value: "hero", label: "Hero Image" },
  { value: "artikel", label: "Foto Artikel" },
  { value: "logo", label: "Logo" },
  { value: "general", label: "Umum" },
];

export default function AsetPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("hero");
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const fetchAssets = useCallback(async (category = "") => {
    setLoading(true);
    const url = category
      ? `/api/assets?category=${category}`
      : "/api/assets";
    const res = await fetch(url);
    const { data } = await res.json();
    setAssets(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAssets(filter);
  }, [filter, fetchAssets]);

  function handleDeleted(id: string) {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }

  function handleUpdated(updated: Asset) {
    setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  }

  async function handleUpload(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", uploadCategory);
    formData.append("alt_text", uploadAlt);
    formData.append("caption", uploadCaption);

    const res = await fetch("/api/assets", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const { data } = await res.json();
      setAssets((prev) => [data, ...prev]);
      setUploadAlt("");
      setUploadCaption("");
    } else {
      const err = await res.json();
      alert(`Upload gagal: ${err.error}`);
    }
    setUploading(false);
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      await handleUpload(file);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Aset Website</h1>
          <p className="text-sm text-stone-500 mt-1">
            Kelola gambar hero, artikel, logo, dan aset lainnya.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          dragOver ? "border-blue-400 bg-blue-50" : "border-stone-200 bg-white"
        }`}
      >
        <div className="flex flex-wrap sm:flex-row items-center gap-4">
          {/* File input */}
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
            <span className="inline-flex items-center gap-2 text-sm font-semibold bg-[#1e40af] text-white px-5 py-2.5 rounded-lg hover:bg-[#1e3a8a] transition cursor-pointer">
              <Plus size={16} />
              Upload Gambar
            </span>
          </label>

          {/* Metadata form */}
          <div className="flex flex-wrap gap-2 flex-1">
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="text-xs border border-stone-200 rounded px-2 py-2"
            >
              {CATEGORIES.filter((c) => c.value).map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <input
              value={uploadAlt}
              onChange={(e) => setUploadAlt(e.target.value)}
              placeholder="Alt text (SEO)"
              className="text-xs border border-stone-200 rounded px-2 py-2 flex-1 min-w-[150px]"
            />
            <input
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              placeholder="Caption singkat"
              className="text-xs border border-stone-200 rounded px-2 py-2 flex-1 min-w-[150px]"
            />
          </div>
        </div>

        <p className="text-[11px] text-stone-400 mt-3">
          Drag & drop atau klik untuk upload. Maks 5MB. Format: JPG, PNG, WebP, GIF
        </p>

        {uploading && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-blue-600">
            <span className="animate-spin">⏳</span> Mengupload...
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter size={14} className="text-stone-400" />
        <div className="flex gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-full transition ${
                filter === cat.value
                  ? "bg-[#1e40af] text-white"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-stone-400 ml-auto">
          {assets.length} aset
        </span>
      </div>

      {/* Asset Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-52 bg-stone-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <Images size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Belum ada aset di kategori ini.</p>
          <p className="text-xs mt-1">Upload gambar pertama kamu!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onDeleted={handleDeleted}
              onUpdated={handleUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}