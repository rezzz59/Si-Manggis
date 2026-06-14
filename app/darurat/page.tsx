// app/darurat/page.tsx
import Link from "next/link";
import { Phone, MapPin, Clock, ShieldAlert, Siren, ArrowRight, HeartPulse, Flame } from "lucide-react";
import { dataDarurat } from "@/src/data/darurat";

export const metadata = {
  title: "Informasi Darurat - Si-Manggis",
  description: "Kontak layanan darurat untuk warga Desa Guntung Manggis.",
};

const getCategoryMeta = (kategori: string) => {
  if (kategori === "damkar") {
    return {
      label: "Pemadam Kebakaran",
      icon: Flame,
      badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
      callClass: "from-orange-500 to-orange-600",
    };
  }

  if (kategori === "ambulans") {
    return {
      label: "Ambulans",
      icon: HeartPulse,
      badgeClass: "bg-red-50 text-red-700 border-red-200",
      callClass: "from-red-500 to-red-600",
    };
  }

  return {
    label: "Pos Kesehatan Desa",
    icon: ShieldAlert,
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    callClass: "from-emerald-500 to-emerald-600",
  };
};

export default function DaruratPage() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f5132] via-[#17633f] to-[#0b3a25]">
        <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -bottom-24 h-72 w-72 rounded-full bg-[#8de7b8]/20 blur-3xl" />

        <div className="public-shell relative pt-24 pb-14 sm:pt-28 sm:pb-16">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white">
              <Siren size={14} />
              Layanan Darurat 24 Jam
            </p>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-5xl">
              Informasi Darurat
              <span className="block text-[#d7fbe8]">Desa Guntung Manggis</span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
              Hubungi layanan darurat resmi secara cepat dan tepat. Pilih kontak sesuai kondisi, lalu tekan tombol telepon untuk panggilan langsung.
            </p>

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white">
                <p className="text-xs uppercase tracking-[0.12em] text-white/80">Total Kontak</p>
                <p className="mt-1 text-xl font-extrabold">{dataDarurat.length}</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white">
                <p className="text-xs uppercase tracking-[0.12em] text-white/80">Akses Cepat</p>
                <p className="mt-1 text-xl font-extrabold">24 / 7</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white">
                <p className="text-xs uppercase tracking-[0.12em] text-white/80">Prioritas</p>
                <p className="mt-1 text-xl font-extrabold">Respons Darurat</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alert strip */}
      <section className="border-b border-[#f2d6d6] bg-[#fff2f2]">
        <div className="public-shell py-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#f2b5b5] bg-white px-3 py-1 text-xs font-semibold text-[#b42318]">
              <ShieldAlert size={14} />
              Prioritas
            </span>
            <p className="text-[#7a271a]">
              Gunakan nomor di halaman ini <span className="font-semibold">khusus keadaan darurat</span>. Untuk layanan administrasi, gunakan menu layanan desa.
            </p>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="public-section bg-[radial-gradient(circle_at_top,#eef8f1_0%,#f7fbf9_46%,#f7fbf9_100%)]">
        <div className="public-shell">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {dataDarurat.map((item) => {
              const category = getCategoryMeta(item.kategori);
              const CategoryIcon = category.icon;

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-[#d5e7dc] bg-white shadow-[0_24px_46px_-34px_rgba(15,23,42,0.32)]"
                >
                  <div className="border-b border-[#e5efe8] bg-gradient-to-b from-[#fbfefd] to-[#f3faf6] px-6 py-5">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${category.badgeClass}`}>
                      <CategoryIcon size={13} />
                      {category.label}
                    </span>
                    <h2 className="mt-3 text-lg font-bold leading-snug text-slate-900">{item.nama}</h2>
                  </div>

                  <div className="space-y-3 px-6 py-5">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="mt-0.5 flex-shrink-0 text-[#1f7a4f]" />
                      <p className="text-sm text-[#52657a]">{item.alamat}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock size={16} className="flex-shrink-0 text-[#1f7a4f]" />
                      <p className="text-sm text-[#52657a]">{item.jamOperasional}</p>
                    </div>

                    <a
                      href={`tel:${item.telepon.replace(/-/g, "").replace(/ /g, "")}`}
                      className={`mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_-20px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 ${category.callClass}`}
                    >
                      <Phone size={15} />
                      Hubungi {item.telepon}
                    </a>

                    {item.teleponCadangan && (
                      <a
                        href={`tel:${item.teleponCadangan.replace(/-/g, "").replace(/ /g, "")}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d5e7dc] bg-white px-4 py-2.5 text-sm font-semibold text-[#1f7a4f] transition hover:bg-[#f4fbf7]"
                      >
                        <Phone size={15} />
                        Cadangan {item.teleponCadangan}
                      </a>
                    )}

                    {item.deskripsi && (
                      <p className="rounded-xl border border-[#e8f0eb] bg-[#f9fcfa] px-3 py-2 text-xs leading-relaxed text-[#5f7287]">
                        {item.deskripsi}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-[#e5efe8] bg-white px-4 pb-4">
                    <div className="relative mt-4 h-52 overflow-hidden rounded-2xl border border-[#d8e9df]">
                      <iframe
                        src={item.mapsEmbedSrc}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Lokasi ${item.nama}`}
                      />
                      <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#14532d] shadow-sm">
                        Lokasi Unit
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Panduan */}
          <div className="mt-10 rounded-3xl border border-[#d6e8de] bg-white p-6 shadow-[0_24px_46px_-34px_rgba(15,23,42,0.3)] sm:p-7">
            <h3 className="text-lg font-bold text-[#0f172a]">Panduan Cepat Saat Darurat</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#e1ece5] bg-[#f9fcfa] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">Langkah 1</p>
                <p className="mt-1 text-sm font-semibold text-[#0f172a]">Tetap Tenang</p>
                <p className="mt-1 text-xs text-[#5f7287]">Pastikan lokasi aman sebelum melakukan panggilan.</p>
              </div>
              <div className="rounded-2xl border border-[#e1ece5] bg-[#f9fcfa] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">Langkah 2</p>
                <p className="mt-1 text-sm font-semibold text-[#0f172a]">Sampaikan Detail</p>
                <p className="mt-1 text-xs text-[#5f7287]">Sebutkan jenis kejadian, alamat, dan kondisi korban/lokasi.</p>
              </div>
              <div className="rounded-2xl border border-[#e1ece5] bg-[#f9fcfa] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">Langkah 3</p>
                <p className="mt-1 text-sm font-semibold text-[#0f172a]">Ikuti Instruksi</p>
                <p className="mt-1 text-xs text-[#5f7287]">Ikuti arahan petugas hingga bantuan tiba di lokasi.</p>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 rounded-3xl border border-[#d7e9df] bg-gradient-to-r from-white to-[#f2faf6] p-5 shadow-[0_22px_42px_-34px_rgba(15,23,42,0.35)] sm:p-6">
            <p className="text-sm leading-relaxed text-[#52657a]">
              <span className="font-semibold text-[#14532d]">Catatan:</span> Nomor di atas diprioritaskan untuk keadaan darurat. Untuk pengajuan layanan administrasi desa, gunakan menu layanan utama.
            </p>
            <Link
              href="/layanan"
              className="mt-3 inline-flex items-center gap-1 rounded-full border border-[#d2e6da] bg-white px-4 py-2 text-sm font-semibold text-[#1f7a4f] transition hover:bg-[#f4fbf7]"
            >
              Buka Halaman Layanan
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
