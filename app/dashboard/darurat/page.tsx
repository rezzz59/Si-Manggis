import { dataDarurat } from "@/src/data/darurat";
import { Phone, MapPin, Clock, AlertTriangle, Siren } from "lucide-react";

export const metadata = {
  title: "Kelola Nomor Darurat - Si-Manggis Admin",
};

export default function DaruratDashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Kelola Nomor Darurat</h1>
        <p className="text-sm text-stone-500 mt-1">
          Data nomor telepon dan layanan darurat
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dataDarurat.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-stone-200 bg-white p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              {item.kategori === "damkar" && (
                <AlertTriangle size={18} className="text-orange-600" />
              )}
              {item.kategori === "ambulans" && (
                <Siren size={18} className="text-red-600" />
              )}
              {item.kategori === "poskesdes" && (
                <Phone size={18} className="text-emerald-600" />
              )}
              <span
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${item.warnaBg} ${item.warnaText}`}
              >
                {item.kategori === "damkar"
                  ? "Damkar"
                  : item.kategori === "ambulans"
                  ? "Ambulans"
                  : "Poskesdes"}
              </span>
            </div>

            <h3 className="font-semibold text-stone-900">{item.nama}</h3>
            <p className="mt-1 text-sm text-stone-500">{item.alamat}</p>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-stone-600">
                <Phone size={14} />
                <span className="font-medium">{item.telepon}</span>
                {item.teleponCadangan && (
                  <span className="text-stone-400">/ {item.teleponCadangan}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <Clock size={14} />
                <span>{item.jamOperasional}</span>
              </div>
              {item.deskripsi && (
                <p className="text-xs text-stone-500">{item.deskripsi}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
        <Phone size={32} className="mx-auto mb-3 text-stone-400" />
        <p className="text-sm font-medium text-stone-600">
          Tambah Nomor Darurat
        </p>
        <p className="mt-1 text-xs text-stone-400">
          Fitur edit nomor darurat akan segera tersedia
        </p>
      </div>
    </div>
  );
}
