// app/darurat/page.tsx
import { Phone, MapPin, Clock } from "lucide-react";
import { dataDarurat } from "@/src/data/darurat";

export const metadata = {
  title: "Informasi Darurat - Si-Manggis",
  description: "Kontak layanan darurat untuk warga Desa Guntung Manggis.",
};

export default function DaruratPage() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="public-hero">
        <div className="public-shell">
          <p className="public-kicker !border-white/40 !bg-white/10 !text-white before:!bg-white">
            Kontak Penting
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Informasi Darurat
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
            Kontak layanan darurat untuk warga Desa Guntung Manggis. Tekan nomor untuk langsung menelepon.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="public-section public-muted-bg">
        <div className="public-shell">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {dataDarurat.map((item) => (
              <div
                key={item.id}
                className="public-card overflow-hidden"
              >
                {/* Header */}
                <div className="bg-[#f2f8f4] px-6 py-5 border-b border-[#e4eee7]">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#1f7a4f] mb-1">
                    {item.kategori === "damkar"
                      ? "Pemadam Kebakaran"
                      : item.kategori === "ambulans"
                      ? "Ambulans"
                      : "Pos Kesehatan Desa"}
                  </p>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    {item.nama}
                  </h2>
                </div>

                {/* Info */}
                <div className="px-6 py-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={16}
                      className="text-stone-400 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-sm text-stone-600">{item.alamat}</p>
                  </div>

                  <a
                    href={`tel:${item.telepon.replace(/-/g, "").replace(/ /g, "")}`}
                    className="flex items-center gap-3 group"
                  >
                    <Phone
                      size={16}
                      className="text-[#1f7a4f] flex-shrink-0"
                    />
                    <span className="text-sm font-semibold text-[#1f7a4f] group-hover:underline">
                      {item.telepon}
                    </span>
                  </a>

                  {item.teleponCadangan && (
                    <a
                      href={`tel:${item.teleponCadangan.replace(/-/g, "").replace(/ /g, "")}`}
                      className="flex items-center gap-3 group"
                    >
                      <Phone size={16} className="text-stone-400 flex-shrink-0" />
                      <span className="text-sm text-stone-500 group-hover:text-[#1f7a4f] transition-colors">
                        {item.teleponCadangan}
                      </span>
                    </a>
                  )}

                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-stone-400 flex-shrink-0" />
                    <p className="text-sm text-stone-500">{item.jamOperasional}</p>
                  </div>

                  {item.deskripsi && (
                    <p className="text-xs text-stone-400 pt-2 border-t border-stone-100">
                      {item.deskripsi}
                    </p>
                  )}
                </div>

                {/* Map */}
                <div className="h-48 w-full bg-stone-100">
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
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="mt-8 public-card bg-[#f7fbf9] px-6 py-4">
            <p className="text-sm text-stone-600">
              <span className="font-semibold text-[#14532d]">Catatan:</span> Hubungi nomor di atas hanya untuk keadaan darurat. Untuk pengajuan layanan desa, silakan gunakan{" "}
              <a href="/layanan" className="text-[#1f7a4f] font-semibold hover:underline">
                halaman layanan
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
