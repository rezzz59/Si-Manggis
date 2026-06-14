"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock3, Newspaper, Search, Sparkles } from "lucide-react";
import type { ArtikelItem } from "./page";

const CATEGORIES = [
  "Semua",
  "Pengumuman",
  "Kegiatan",
  "Infrastruktur",
  "UMKM",
  "Pelayanan",
  "Pembangunan",
];

function formatTanggal(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function estimateReadTime(text?: string | null) {
  const words = (text ?? "").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min baca`;
}

function normalizeCategory(input?: string | null) {
  const value = (input ?? "").trim();
  return value || "Pengumuman";
}

export default function ArtikelClientPage({ initialItems }: { initialItems: ArtikelItem[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filteredItems = useMemo(() => {
    const lowerQ = query.trim().toLowerCase();

    return initialItems.filter((item) => {
      const category = normalizeCategory(item.kategori);
      const matchCategory = activeCategory === "Semua" || category === activeCategory;
      const searchable = `${item.judul} ${item.excerpt ?? ""} ${category}`.toLowerCase();
      const matchQuery = !lowerQ || searchable.includes(lowerQ);
      return matchCategory && matchQuery;
    });
  }, [initialItems, activeCategory, query]);

  const featured = filteredItems[0] ?? null;
  const latest = filteredItems.slice(1, 6);
  const archive = filteredItems.slice(1);

  return (
    <main className="flex flex-col">
      <section className="relative border-b border-[#e3eee7] bg-gradient-to-b from-[#ecf7f1] via-[#f6fbf8] to-white pt-28 pb-10 sm:pt-32 sm:pb-12">
        <div className="public-shell">
          <div className="max-w-3xl">
            <span className="public-chip !bg-white !text-[#1f7a4f]">
              <Sparkles size={12} />
              Kabar & Pengumuman Warga
            </span>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[#0f172a] sm:text-4xl">
              SI-MANGGIS Newsroom
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[#5f7287] sm:text-base">
              Informasi resmi kelurahan dalam format editorial yang ringkas, jelas, dan mudah
              ditelusuri oleh warga.
            </p>

            <div className="mt-5">
              <div className="flex items-center gap-3 rounded-2xl border border-[#d7e8dd] bg-white px-4 py-3 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.35)]">
                <Search size={18} className="text-[#1f7a4f]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari artikel, topik, atau pengumuman..."
                  aria-label="Cari artikel"
                  className="w-full bg-transparent text-sm text-[#1e293b] placeholder:text-[#94a3b8] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {CATEGORIES.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={
                    active
                      ? "rounded-full border border-[#cfe4d7] bg-[#eaf6ef] px-4 py-2 text-xs font-semibold text-[#1f7a4f]"
                      : "rounded-full border border-[#dfebe4] bg-white px-4 py-2 text-xs font-semibold text-[#52667a] transition-colors hover:border-[#cfe4d7] hover:text-[#1f7a4f]"
                  }
                  aria-pressed={active}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="public-section bg-[#f7fbf9]">
        <div className="public-shell">
          {featured ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <article className="public-card overflow-hidden lg:col-span-8">
                <Link href={`/artikel/${featured.slug}`} className="block">
                  <div className="relative aspect-[16/8] bg-[#e9f3ed]">
                    <Image
                      src={featured.gambar_url ?? "/img/bg.png"}
                      alt={featured.judul}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 65vw"
                    />
                  </div>

                  <div className="p-5 sm:p-6">
                    <span className="public-chip">{normalizeCategory(featured.kategori)}</span>
                    <h2 className="mt-3 text-xl font-extrabold leading-snug text-[#0f172a] sm:text-2xl">
                      {featured.judul}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#52667a] sm:text-base">
                      {featured.excerpt}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#6b7280]">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={13} />
                        {formatTanggal(featured.tgl_publish)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 size={13} />
                        {estimateReadTime(featured.excerpt)}
                      </span>
                    </div>

                    <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#d7e8dd] bg-white px-3.5 py-2 text-sm font-semibold text-[#1f7a4f]">
                      Baca selengkapnya
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </article>

              <aside className="lg:col-span-4">
                <div className="public-card p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#0f172a]">Update Terbaru</h3>
                    <span className="public-chip">Live</span>
                  </div>

                  <div className="space-y-3">
                    {latest.length > 0 ? (
                      latest.map((artikel) => (
                        <Link
                          key={artikel.slug}
                          href={`/artikel/${artikel.slug}`}
                          className="block rounded-xl border border-[#e3eee7] bg-white px-3.5 py-3 transition-all hover:-translate-y-0.5 hover:border-[#cfe4d7] hover:shadow-[0_10px_20px_-16px_rgba(15,23,42,0.35)]"
                        >
                          <div className="mb-1.5 flex items-center justify-between gap-2">
                            <span className="public-chip !text-[10px]">
                              {normalizeCategory(artikel.kategori)}
                            </span>
                            <span className="text-[11px] text-[#6b7280]">
                              {formatTanggal(artikel.tgl_publish)}
                            </span>
                          </div>
                          <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-[#0f172a]">
                            {artikel.judul}
                          </p>
                        </Link>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-[#d7e8dd] bg-[#f8fcfa] px-4 py-6 text-center">
                        <Newspaper size={20} className="mx-auto mb-2 text-[#1f7a4f]" />
                        <p className="text-xs text-[#5f7287]">Belum ada update tambahan.</p>
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            <div className="public-card p-8 text-center sm:p-10">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e9f5ee] text-[#1f7a4f]">
                <Newspaper size={26} />
              </div>
              <h2 className="text-lg font-bold text-[#0f172a]">Belum Ada Artikel Dipublikasikan</h2>
              <p className="mt-2 text-sm text-[#5f7287]">
                Tim redaksi kelurahan sedang menyiapkan pengumuman terbaru untuk warga.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="public-section bg-white">
        <div className="public-shell">
          <div className="mb-8">
            <span className="section-kicker">Arsip Berita</span>
            <h2 className="public-title mt-3">Jelajahi Semua Berita</h2>
            <p className="public-subtitle">
              Kumpulan artikel layanan, kegiatan, pembangunan, dan pengumuman resmi kelurahan.
            </p>
          </div>

          {archive.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {archive.map((artikel) => (
                <Link
                  key={artikel.slug}
                  href={`/artikel/${artikel.slug}`}
                  className="public-card overflow-hidden"
                >
                  <div className="relative aspect-[16/9] bg-[#edf6f1]">
                    <Image
                      src={artikel.gambar_url ?? "/img/bg.png"}
                      alt={artikel.judul}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  <div className="p-4.5 sm:p-5">
                    <div className="mb-2.5 flex items-center justify-between gap-2">
                      <span className="public-chip">{normalizeCategory(artikel.kategori)}</span>
                      <span className="text-[11px] text-[#6b7280]">
                        {formatTanggal(artikel.tgl_publish)}
                      </span>
                    </div>

                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#0f172a]">
                      {artikel.judul}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#5f7287]">
                      {artikel.excerpt}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-[#edf4ef] pt-3 text-[11px]">
                      <span className="inline-flex items-center gap-1 text-[#6b7280]">
                        <Clock3 size={12} />
                        {estimateReadTime(artikel.excerpt)}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#1f7a4f]">
                        Baca
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="public-card p-8 text-center">
              <p className="text-sm text-[#5f7287]">Arsip berita belum tersedia.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
