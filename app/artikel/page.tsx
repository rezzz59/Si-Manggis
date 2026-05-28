// app/artikel/page.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export const metadata = {
  title: "Kabar Desa - Si-Manggis",
  description: "Berita dan informasi terkini dari Kelurahan Guntung Manggis.",
};

function formatTanggal(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default async function ArtikelPage() {
  const { data: artikelList } = await supabaseAdmin
    .from("artikel")
    .select("*")
    .eq("is_published", true)
    .order("tgl_publish", { ascending: false });
  return (
    <main className="flex flex-col">

      {/* Hero */}
      <section className="bg-[#1e40af] pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">
            Kabar Desa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Berita & Informasi
          </h1>
          <p className="text-white/70 max-w-md text-sm">
            Kabar terbaru dari Kelurahan Guntung Manggis — pemerintahan, pembangunan, dan kehidupan warga.
          </p>
        </div>
      </section>

      {/* Artikel */}
      <section className="py-16 lg:py-20 bg-stone-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <span className="accent-line mb-3 block" />
          <h2 className="text-2xl font-bold text-[#1e40af] mb-8">
            Semua Berita
          </h2>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(artikelList ?? []).map((artikel) => (
              <Link
                key={artikel.slug}
                href={`/artikel/${artikel.slug}`}
                className="hover-lift bg-white rounded-2xl overflow-hidden border border-stone-200 flex flex-col cursor-pointer"
              >
                {/* Gambar */}
                <div className="relative h-44 overflow-hidden bg-stone-100">
                  <Image
                    src={artikel.gambar_url ?? "/img/bg.png"}
                    alt={artikel.judul}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold text-white bg-[#1e40af] px-2.5 py-1 rounded-sm">
                      {artikel.kategori}
                    </span>
                  </div>
                </div>

                {/* Isi */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-sm font-bold text-stone-900 leading-snug mb-3 flex-1">
                    {artikel.judul}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 mb-4">
                    {artikel.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-3 border-t border-stone-100">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {formatTanggal(artikel.tgl_publish)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={11} />
                      {artikel.penulis}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-[#1e40af]">
                    Baca Selengkapnya <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
