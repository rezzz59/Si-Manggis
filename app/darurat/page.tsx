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
      <section className="bg-[#EA580C] pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-2">
            Kontak Penting
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Informasi Darurat
          </h1>
          <p className="text-white/75 max-w-md text-sm">
            Kontak layanan darurat untuk warga Desa Guntung Manggis. Tekan nomor untuk langsung menelepon.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-16 lg:py-20 bg-stone-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {dataDarurat.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover-lift"
              >
                {/* Header */}
                <div className={`${item.warnaBg} px-6 py-5`}>
                  <p className={`text-xs font-bold uppercase tracking-wide ${item.warnaText} mb-1`}>
                    {item.kategori === "damkar"
                      ? "Pemadam Kebakaran"
                      : item.kategori === "ambulans"
                      ? "Ambulans"
                      : "Pos Kesehatan Desa"}
                  </p>
                  <h2 className="text-lg font-bold text-stone-900 leading-snug">
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
                      className="text-[#EA580C] flex-shrink-0"
                    />
                    <span className="text-sm font-semibold text-[#EA580C] group-hover:underline">
                      {item.telepon}
                    </span>
                  </a>

                  {item.teleponCadangan && (
                    <a
                      href={`tel:${item.teleponCadangan.replace(/-/g, "").replace(/ /g, "")}`}
                      className="flex items-center gap-3 group"
                    >
                      <Phone size={16} className="text-stone-400 flex-shrink-0" />
                      <span className="text-sm text-stone-500 group-hover:text-[#EA580C] transition-colors">
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
          <div className="mt-8 bg-[#FEFCE8] rounded-xl border border-stone-200 px-6 py-4">
            <p className="text-sm text-stone-600">
              <span className="font-semibold text-[#92400E]">Catatan:</span> Hubungi nomor di atas hanya untuk keadaan darurat. Untuk pengajuan layanan desa, silakan gunakan{" "}
              <a href="/layanan" className="text-[#EA580C] font-semibold hover:underline">
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
