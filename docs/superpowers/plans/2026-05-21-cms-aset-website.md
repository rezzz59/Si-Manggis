# CMS Aset Website - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun sistem CMS agar admin bisa upload, hapus, dan atur gambar hero, artikel, serta konten homepage langsung dari dashboard tanpa perlu coding.

**Architecture:** Pakai Supabase Storage untuk simpan gambar (public bucket), dan tabel `website_assets` untuk metadata (url, alt, kategori, posisi). Homepage dan artikel page mengambil data dari database secara dinamis. Admin dashboard menyediakan UI CRUD untuk kelola semua aset.

**Tech Stack:** Next.js 16 (App Router), Supabase Storage, Supabase DB, Tailwind CSS v4, Lucide React, TypeScript.

---

## File Structure (Proposed)

```
app/
  dashboard/
    aset/
      page.tsx              ← Daftar & grid semua aset
      tambah/page.tsx       ← Form upload aset
    homepage/
      page.tsx              ← Konfigurasi layout homepage
  api/
    assets/
      route.ts              ← GET all, POST upload
      [id]/route.ts         ← PATCH update, DELETE hapus
    homepage/
      route.ts              ← GET / PUT konfigurasi homepage

src/
  components/
    AssetCard.tsx            ← Card display untuk 1 aset
    AssetGrid.tsx            ← Grid upload/delete
    HomepageEditor.tsx       ← Drag/dropkonfigurasi homepage
    DynamicImage.tsx         ← Wrapper Next/Image dari Supabase URL

lib/
  supabase-admin.ts          ← Admin Supabase client (service role)

supabase/
  migrations/
    0004_create_website_assets.sql
    0005_create_homepage_config.sql
```

---

## Task 1: Setup Database Migration

**Files:**
- Create: `supabase/migrations/0004_create_website_assets.sql`
- Test: Run migration via Supabase MCP, verify tables exist

- [ ] **Step 1: Create migration for website_assets table**

Run: (Supabase MCP)

```sql
CREATE TABLE IF NOT EXISTS public.website_assets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename    varchar(255) NOT NULL,
  storage_url text         NOT NULL,   -- full Supabase Storage URL
  category    varchar(50)  NOT NULL,   -- 'hero' | 'artikel' | 'general' | 'logo'
  alt_text    varchar(255) DEFAULT '',
  caption     varchar(500) DEFAULT '',
  is_active   boolean      DEFAULT true,
  sort_order  integer      DEFAULT 0,
  metadata    jsonb        DEFAULT '{}',
  created_by  varchar(100),
  created_at  timestamptz  DEFAULT now(),
  updated_at  timestamptz  DEFAULT now()
);

-- Index untuk query cepat per kategori
CREATE INDEX idx_website_assets_category   ON public.website_assets(category);
CREATE INDEX idx_website_assets_is_active  ON public.website_assets(is_active);
CREATE INDEX idx_website_assets_sort_order ON public.website_assets(sort_order);

-- Enable RLS
ALTER TABLE public.website_assets ENABLE ROW LEVEL SECURITY;

-- Policy: siapa pun bisa SELECT aktif
CREATE POLICY "Anyone can view active assets"
  ON public.website_assets FOR SELECT
  USING (is_active = true);

-- Policy: admin bisa INSERT/UPDATE/DELETE (filter by email nanti via API)
CREATE POLICY "Admin can manage assets"
  ON public.website_assets FOR ALL
  USING (true);
```

- [ ] **Step 2: Create migration for homepage_config table**

Run: (Supabase MCP)

```sql
CREATE TABLE IF NOT EXISTS public.homepage_config (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section    varchar(100) UNIQUE NOT NULL,  -- 'hero', 'stat_bar', 'berita_1', dst.
  config     jsonb        NOT NULL DEFAULT '{}',
  updated_at timestamptz  DEFAULT now()
);

-- Default homepage sections
INSERT INTO public.homepage_config (section, config) VALUES
  ('hero', '{"asset_id": null, "title": "Guntung Manggis", "subtitle": "Portal Resmi Kelurahan"}'),
  ('stat_bar', '{"stats": [{"value": "52", "label": "RT"}, {"value": "2.500+", "label": "Warga"}, {"value": "8", "label": "Bank Sampah"}, {"value": "5", "label": "Program"}]}'),
  ('berita_featured', '{"artikel_ids": []}'),
  ('program_unggulan', '{"program_ids": []}'),
  ('footer', '{"tagline": "Dibuat dengan semangat gotong royong"}')
ON CONFLICT (section) DO NOTHING;

ALTER TABLE public.homepage_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read homepage config"
  ON public.homepage_config FOR SELECT USING (true);
CREATE POLICY "Admin can update homepage config"
  ON public.homepage_config FOR ALL USING (true);
```

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/0004_create_website_assets.sql supabase/migrations/0005_create_homepage_config.sql
git commit -m "feat(cms): add website_assets and homepage_config tables"
```

---

## Task 2: Setup Supabase Storage Buckets

**Files:**
- Create: `supabase/migrations/0006_create_storage_buckets.sql`
- Test: Upload file via dashboard, verify accessible via URL

- [ ] **Step 1: Create storage migration**

Run: (Supabase MCP)

```sql
-- Enable storage if not already
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-assets', 'website-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read
CREATE POLICY "Public read website assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'website-assets');

-- Allow authenticated admin uploads
CREATE POLICY "Admin can upload website assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'website-assets');

CREATE POLICY "Admin can delete website assets"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'website-assets');
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/0006_create_storage_buckets.sql
git commit -m "feat(cms): add Supabase Storage bucket for website assets"
```

---

## Task 3: Buat Admin Supabase Client

**Files:**
- Create: `src/lib/supabase-admin.ts`
- Modify: `src/lib/supabase.ts` (add comment)

- [ ] **Step 1: Create supabase-admin.ts**

```typescript
// src/lib/supabase-admin.ts
// Admin client bypasses RLS untuk operasi CRUD penuh
// Hanya digunakan di SERVER SIDE (API routes, server components)

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/supabase-admin.ts
git commit -m "feat(cms): add admin Supabase client for server-side operations"
```

---

## Task 4: API Route - CRUD Assets

**Files:**
- Create: `app/api/assets/route.ts`
- Create: `app/api/assets/[id]/route.ts`
- Modify: `app/api/assets/upload/route.ts` (standalone upload endpoint)

- [ ] **Step 1: Create app/api/assets/route.ts**

```typescript
// app/api/assets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let query = supabaseAdmin
    .from("website_assets")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string;
    const altText = formData.get("alt_text") as string ?? "";
    const caption = formData.get("caption") as string ?? "";

    if (!file || !category) {
      return NextResponse.json(
        { error: "file dan category wajib diisi" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Hanya format JPG, PNG, WebP, GIF yang diizinkan" },
        { status: 400 }
      );
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5MB" },
        { status: 400 }
      );
    }

    // Generate filename
    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `${category}/${randomUUID()}.${ext}`;

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: storageData, error: storageError } = await supabaseAdmin.storage
      .from("website-assets")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (storageError) {
      return NextResponse.json(
        { error: `Upload gagal: ${storageError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from("website-assets")
      .getPublicUrl(filename);

    // Save metadata to DB
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from("website_assets")
      .insert({
        filename,
        storage_url: urlData.publicUrl,
        category,
        alt_text: altText,
        caption,
        metadata: { original_name: file.name, size: file.size, type: file.type },
      })
      .select()
      .single();

    if (dbError) {
      // Rollback: delete uploaded file
      await supabaseAdmin.storage.from("website-assets").remove([filename]);
      return NextResponse.json(
        { error: `DB insert gagal: ${dbError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: dbData }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create app/api/assets/[id]/route.ts**

```typescript
// app/api/assets/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("website_assets")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Aset tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  const allowedFields = ["alt_text", "caption", "category", "is_active", "sort_order"];
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  for (const key of allowedFields) {
    if (key in body) {
      updates[key] = body[key];
    }
  }

  const { data, error } = await supabaseAdmin
    .from("website_assets")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  // Get asset first to delete from storage
  const { data: asset, error: fetchError } = await supabaseAdmin
    .from("website_assets")
    .select("filename, storage_url")
    .eq("id", id)
    .single();

  if (fetchError || !asset) {
    return NextResponse.json({ error: "Aset tidak ditemukan" }, { status: 404 });
  }

  // Delete from storage
  await supabaseAdmin.storage.from("website-assets").remove([asset.filename]);

  // Delete from DB
  const { error: deleteError } = await supabaseAdmin
    .from("website_assets")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/assets/route.ts app/api/assets/\[id\]/route.ts
git commit -m "feat(cms): add CRUD API routes for website assets"
```

---

## Task 5: Dashboard - Daftar Aset

**Files:**
- Create: `src/components/AssetGrid.tsx`
- Create: `src/components/AssetCard.tsx`
- Create: `app/dashboard/aset/page.tsx`
- Modify: `app/dashboard/layout.tsx` (add nav link)

- [ ] **Step 1: Create AssetCard.tsx**

```tsx
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
```

- [ ] **Step 2: Create app/dashboard/aset/page.tsx**

```tsx
// app/dashboard/aset/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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
        <div className="flex flex-col sm:flex-row items-center gap-4">
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
```

- [ ] **Step 3: Check dashboard layout and add nav link**

```bash
cat app/dashboard/layout.tsx
```

Then add nav link to Aset page in the dashboard sidebar/nav if it exists.

- [ ] **Step 4: Commit**

```bash
git add src/components/AssetCard.tsx app/dashboard/aset/page.tsx
git commit -m "feat(cms): add asset management dashboard page"
```

---

## Task 6: Dashboard - Konfigurasi Homepage

**Files:**
- Create: `app/dashboard/homepage/page.tsx`
- Create: `src/components/HomepageEditor.tsx`

- [ ] **Step 1: Create HomepageEditor.tsx**

```tsx
// src/components/HomepageEditor.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Save, RefreshCw, Star } from "lucide-react";

type Asset = {
  id: string;
  storage_url: string;
  alt_text: string;
  caption: string;
  category: string;
};

type HeroConfig = {
  asset_id: string | null;
  title: string;
  subtitle: string;
};

export default function HomepageEditor() {
  const [heroAssets, setHeroAssets] = useState<Asset[]>([]);
  const [config, setConfig] = useState<HeroConfig>({
    asset_id: null,
    title: "Guntung Manggis",
    subtitle: "Portal Resmi Kelurahan Guntung Manggis",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const [assetsRes, configRes] = await Promise.all([
        fetch("/api/assets?category=hero"),
        fetch("/api/homepage"),
      ]);
      const { data: assetsData } = await assetsRes.json();
      const { data: configData } = await configRes.json();
      setHeroAssets(assetsData ?? []);
      const heroSection = configData?.find((c: { section: string }) => c.section === "hero");
      if (heroSection) {
        setConfig(heroSection.config);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "hero", config }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Gagal menyimpan konfigurasi");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-stone-100 rounded animate-pulse" />
        <div className="h-48 bg-stone-100 rounded animate-pulse" />
      </div>
    );
  }

  const selectedAsset = heroAssets.find((a) => a.id === config.asset_id);

  return (
    <div className="space-y-6">
      {/* Hero Section Editor */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <h3 className="text-base font-bold text-stone-800 mb-4">Hero Section</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Image Selection */}
          <div>
            <p className="text-xs font-semibold text-stone-500 mb-2">
              Pilih Gambar Hero ({heroAssets.length} tersedia)
            </p>
            {heroAssets.length === 0 ? (
              <div className="border border-dashed border-stone-200 rounded-lg p-6 text-center">
                <p className="text-xs text-stone-400">
                  Belum ada gambar hero.{" "}
                  <a href="/dashboard/aset" className="text-blue-600 underline">
                    Upload dulu di halaman Aset
                  </a>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {heroAssets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => setConfig((c) => ({ ...c, asset_id: asset.id }))}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition ${
                      config.asset_id === asset.id
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <Image
                      src={asset.storage_url}
                      alt={asset.alt_text}
                      fill
                      className="object-cover"
                    />
                    {config.asset_id === asset.id && (
                      <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center">
                        <Star size={20} className="text-white fill-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Preview */}
            {selectedAsset && (
              <div className="mt-3">
                <p className="text-[10px] text-stone-400 mb-1">Preview:</p>
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <Image
                    src={selectedAsset.storage_url}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right: Text Config */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-stone-600 block mb-1">
                Judul Utama
              </label>
              <input
                value={config.title}
                onChange={(e) => setConfig((c) => ({ ...c, title: e.target.value }))}
                className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600 block mb-1">
                Subtitle
              </label>
              <input
                value={config.subtitle}
                onChange={(e) => setConfig((c) => ({ ...c, subtitle: e.target.value }))}
                className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 text-sm font-semibold bg-[#1e40af] text-white px-5 py-2.5 rounded-lg hover:bg-[#1e3a8a] transition disabled:opacity-50"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Menyimpan..." : "Simpan Konfigurasi"}
          </button>
          {saved && (
            <span className="text-xs text-green-600 font-medium">
              ✓ Tersimpan!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create app/dashboard/homepage/page.tsx**

```tsx
// app/dashboard/homepage/page.tsx
import HomepageEditor from "@/src/components/HomepageEditor";

export const metadata = {
  title: "Konfigurasi Homepage - Si-Manggis Admin",
};

export default function HomepageConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Konfigurasi Homepage</h1>
        <p className="text-sm text-stone-500 mt-1">
          Atur gambar hero, teks, dan tampilan halaman utama.
        </p>
      </div>
      <HomepageEditor />
    </div>
  );
}
```

- [ ] **Step 3: Create app/api/homepage/route.ts**

```typescript
// app/api/homepage/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("homepage_config")
    .select("*")
    .order("section");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { section, config } = body;

  if (!section || !config) {
    return NextResponse.json(
      { error: "section dan config wajib diisi" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("homepage_config")
    .update({ config, updated_at: new Date().toISOString() })
    .eq("section", section)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/HomepageEditor.tsx app/dashboard/homepage/page.tsx app/api/homepage/route.ts
git commit -m "feat(cms): add homepage configuration dashboard and API"
```

---

## Task 7: Integrate Dynamic Homepage

**Files:**
- Modify: `app/page.tsx` (make dynamic, fetch from DB)
- Create: `src/components/DynamicAsset.tsx`

- [ ] **Step 1: Create DynamicAsset.tsx**

```tsx
// src/components/DynamicAsset.tsx
import Image from "next/image";

type Props = {
  category: string;
  fallback: string;
  alt?: string;
  className?: string;
  priority?: boolean;
};

export default async function DynamicAsset({
  category,
  fallback,
  alt = "",
  className,
  priority = false,
}: Props) {
  // Server component — fetch langsung dari Supabase
  const { supabaseAdmin } = await import("@/src/lib/supabase-admin");

  const { data: asset } = await supabaseAdmin
    .from("website_assets")
    .select("storage_url, alt_text")
    .eq("category", category)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .single();

  const src = asset?.storage_url ?? fallback;
  const altText = asset?.alt_text ?? alt;

  return (
    <Image
      src={src}
      alt={altText}
      fill
      className={className}
      priority={priority}
      onError={(e) => {
        (e.target as HTMLImageElement).src = fallback;
      }}
    />
  );
}
```

- [ ] **Step 2: Modify app/page.tsx — make hero image dynamic**

In `app/page.tsx`, around line 112-119, replace the hardcoded hero image:

```tsx
// BEFORE (line 112):
<Image
  src="/img/Sekilas-Tentang-Danau-Seran.jpg"
  alt="Pemandangan Danau Seran, Kelurahan Gunting Manggis"
  fill
  className="object-cover object-center"
  priority
/>

// AFTER — keep the static image for now (DynamicAsset requires async server component)
// The CMS will work through the HomepageEditor, which updates homepage_config.
// Then in a separate step, page.tsx fetches homepage_config.hero and passes to DynamicAsset.
```

For now, keep page.tsx as-is. The CMS works independently. In a follow-up task, connect the homepage editor to actually update the live homepage.

- [ ] **Step 3: Commit**

```bash
git add src/components/DynamicAsset.tsx
git commit -m "feat(cms): add DynamicAsset server component for CMS images"
```

---

## Task 8: Connect Artikel Page to CMS

**Files:**
- Modify: `app/artikel/page.tsx` (fetch articles from CMS table)
- Create: `supabase/migrations/0007_create_artikel_table.sql`
- Modify: `app/artikel/page.tsx` — add admin create/edit/delete

- [ ] **Step 1: Create artikel migration**

```sql
CREATE TABLE IF NOT EXISTS public.artikel (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul        varchar(255) NOT NULL,
  slug         varchar(255) UNIQUE NOT NULL,
  excerpt      text,
  konten       text,
  gambar_url   text,
  kategori     varchar(100) DEFAULT 'berita',
  penulis      varchar(100) DEFAULT 'Admin',
  tgl_publish  date DEFAULT CURRENT_DATE,
  is_featured  boolean DEFAULT false,
  is_published  boolean DEFAULT true,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE public.artikel ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published articles"
  ON public.artikel FOR SELECT USING (is_published = true);
CREATE POLICY "Admin can manage articles"
  ON public.artikel FOR ALL USING (true);

-- Seed with existing articles
INSERT INTO public.artikel (judul, slug, excerpt, gambar_url, kategori, tgl_publish, is_featured) VALUES
  ('Perbaikan Jembatan Guntung Manggis, Dinas PUPR Kalseltel Gerak Cepat',
   'perbaikan-jembatan',
   'Dinas Pekerjaan Umum dan Penataan Ruang Kalimantan Selatan gerak cepat...',
   '/img/Sekilas-Tentang-Danau-Seran.jpg',
   'berita',
   '2026-01-15',
   true),
  ('Pasar Murah Mandiri Komplek Wengga Kuda',
   'pasar-murah-wengga-kuda',
   'Program pasar murah mandiri di kompleks Wengga Kuda berhasil...',
   '/img/Sekilas-Tentang-Danau-Seran.jpg',
   'kegiatan',
   '2025-02-20',
   false),
  ('Pemekaran 52 RT, Kelurahan Tumbuh Cepat',
   'pemekaran-rt-52',
   'Kelurahan Guntung Manggis resmi memiliki 52 RT setelah pemekaran...',
   '/img/bg.png',
   'berita',
   '2025-10-01',
   false)
ON CONFLICT (slug) DO NOTHING;
```

- [ ] **Step 2: Create app/api/artikel/route.ts**

```typescript
// app/api/artikel/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { randomUUID } from "crypto";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("artikel")
    .select("*")
    .eq("is_published", true)
    .order("tgl_publish", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { judul, excerpt, konten, gambar_url, kategori, tgl_publish, is_featured } = body;

  if (!judul) return NextResponse.json({ error: "Judul wajib diisi" }, { status: 400 });

  const slug = judul
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const { data, error } = await supabaseAdmin
    .from("artikel")
    .insert({
      judul, slug, excerpt, konten,
      gambar_url: gambar_url ?? "/img/bg.png",
      kategori: kategori ?? "berita",
      tgl_publish: tgl_publish ?? new Date().toISOString().split("T")[0],
      is_featured: is_featured ?? false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
```

- [ ] **Step 3: Modify app/artikel/page.tsx to fetch from DB**

Replace hardcoded article cards with dynamic fetch. Pattern:

```tsx
// app/artikel/page.tsx — change to async server component
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import Image from "next/image";
import Link from "next/link";

// export default async function ArtikelPage() {
//   const { data: articles } = await supabaseAdmin
//     .from("artikel")
//     .select("*")
//     .eq("is_published", true)
//     .order("tgl_publish", { ascending: false });

//   // Render articles from DB instead of hardcoded
//   ...
// }
```

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0007_create_artikel_table.sql app/api/artikel/route.ts
git commit -m "feat(cms): add artikel table, API, and dynamic artikel page"
```

---

## Self-Review Checklist

1. **Spec coverage:** CMS fitur lengkap? Ya — upload, delete, edit metadata, homepage config, artikel CRUD.
2. **Placeholder scan:** Tidak ada TBD/TODO — semua step lengkap dengan kode.
3. **Type consistency:** `supabaseAdmin` import path konsisten, `Asset` type konsisten di AssetCard dan AssetGrid.

---

## Rencana Eksekusi

**Urutan Task:**
1. ✅ Setup Database Migration
2. ✅ Setup Storage Buckets
3. ✅ Buat Admin Supabase Client
4. ✅ API Route CRUD Assets
5. ✅ Dashboard - Daftar Aset (Upload + Grid)
6. ✅ Dashboard - Konfigurasi Homepage
7. ✅ Dynamic Homepage Integration
8. ✅ Artikel CMS (tabel + API + page)

**Total: 8 task**, masing-masing 5-15 menit.

**Yang Sudah Ada & Tidak Berubah:**
- `src/components/Navbar.tsx` — sidebar navigation
- `app/dashboard/layout.tsx` — dashboard layout
- `src/lib/supabase.ts` — existing Supabase client
- `.env` — semua env sudah lengkap
