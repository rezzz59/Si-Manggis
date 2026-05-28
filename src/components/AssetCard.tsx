// src/components/AssetCard.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { Trash2, Edit2, Copy, Check } from "lucide-react";

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

type Props = {
  asset: Asset;
  onDeleted: (id: string) => void;
  onUpdated: (asset: Asset) => void;
};

const CATEGORY_LABELS: Record<string, string> = {
  hero: "Hero Image",
  artikel: "Foto Artikel",
  logo: "Logo",
  general: "Umum",
};

const CATEGORY_COLORS: Record<string, string> = {
  hero: "bg-blue-100 text-blue-700",
  artikel: "bg-green-100 text-green-700",
  logo: "bg-purple-100 text-purple-700",
  general: "bg-gray-100 text-gray-700",
};

export default function AssetCard({ asset, onDeleted, onUpdated }: Props) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [altText, setAltText] = useState(asset.alt_text);
  const [caption, setCaption] = useState(asset.caption);

  async function handleDelete() {
    if (!confirm(`Hapus "${asset.alt_text || asset.filename}"?`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/assets/${asset.id}`, { method: "DELETE" });
      if (res.ok) {
        onDeleted(asset.id);
      } else {
        const err = await res.json();
        alert(`Gagal hapus: ${err.error}`);
      }
    } finally {
      setDeleting(false);
    }
  }

  async function handleSave() {
    const res = await fetch(`/api/assets/${asset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt_text: altText, caption }),
    });
    if (res.ok) {
      const { data } = await res.json();
      onUpdated(data);
      setEditing(false);
    }
  }

  async function handleCopyUrl() {
    await navigator.clipboard.writeText(asset.storage_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col">
      {/* Preview */}
      <div className="relative h-40 bg-stone-100">
        <Image
          src={asset.storage_url}
          alt={asset.alt_text || asset.filename}
          fill
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/img/bg.png";
          }}
        />
        <span
          className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[asset.category] ?? "bg-gray-100"}`}
        >
          {CATEGORY_LABELS[asset.category] ?? asset.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {editing ? (
          <>
            <input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Alt text (untuk SEO)"
              className="text-xs border border-stone-200 rounded px-2 py-1.5 w-full"
            />
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption singkat"
              rows={2}
              className="text-xs border border-stone-200 rounded px-2 py-1.5 w-full resize-none"
            />
            <div className="flex gap-1">
              <button
                onClick={handleSave}
                className="flex-1 text-xs font-semibold bg-blue-600 text-white rounded py-1.5 hover:bg-blue-700 transition"
              >
                Simpan
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 text-xs font-semibold border border-stone-200 rounded py-1.5 hover:bg-stone-50 transition"
              >
                Batal
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-xs font-semibold text-stone-800 truncate">
                {asset.alt_text || <span className="text-stone-400 italic">Tanpa alt text</span>}
              </p>
              {asset.caption && (
                <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-2">
                  {asset.caption}
                </p>
              )}
            </div>
            <div className="flex gap-1 mt-auto">
              <button
                onClick={() => setEditing(true)}
                className="flex-1 flex items-center justify-center gap-1 text-[10px] font-medium text-stone-500 border border-stone-200 rounded py-1.5 hover:bg-stone-50 transition"
              >
                <Edit2 size={10} /> Edit
              </button>
              <button
                onClick={handleCopyUrl}
                className="flex-1 flex items-center justify-center gap-1 text-[10px] font-medium text-stone-500 border border-stone-200 rounded py-1.5 hover:bg-stone-50 transition"
              >
                {copied ? <Check size={10} className="text-green-600" /> : <Copy size={10} />}
                {copied ? "Copied!" : "Copy URL"}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center justify-center gap-1 text-[10px] font-medium text-red-600 border border-red-200 rounded px-3 py-1.5 hover:bg-red-50 transition disabled:opacity-50"
              >
                <Trash2 size={10} />
                {deleting ? "..." : "Hapus"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
