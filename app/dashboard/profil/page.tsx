import { profilDesa, pejabatDesa, demografi } from "@/src/data/profil";
import { MapPin, Users, Building, Crown } from "lucide-react";

export const metadata = {
  title: "Kelola Profil Desa - Si-Manggis Admin",
};

export default function ProfilDashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Kelola Profil Desa</h1>
        <p className="text-sm text-stone-500 mt-1">
          Informasi dasar dan pejabat kelurahan
        </p>
      </div>

      {/* Identitas Desa */}
      <div className="mb-6 rounded-xl border border-stone-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-[#1e40af]" />
          <h2 className="text-lg font-semibold text-stone-900">Identitas Desa</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-stone-50 p-3">
            <p className="text-xs text-stone-500">Nama Desa</p>
            <p className="font-medium text-stone-900">{profilDesa.identitas.namaDesa}</p>
          </div>
          <div className="rounded-lg bg-stone-50 p-3">
            <p className="text-xs text-stone-500">Kecamatan</p>
            <p className="font-medium text-stone-900">{profilDesa.identitas.kecamatan}</p>
          </div>
          <div className="rounded-lg bg-stone-50 p-3">
            <p className="text-xs text-stone-500">Kabupaten</p>
            <p className="font-medium text-stone-900">{profilDesa.identitas.kabupaten}</p>
          </div>
          <div className="rounded-lg bg-stone-50 p-3">
            <p className="text-xs text-stone-500">Provinsi</p>
            <p className="font-medium text-stone-900">{profilDesa.identitas.provinsi}</p>
          </div>
          <div className="rounded-lg bg-stone-50 p-3">
            <p className="text-xs text-stone-500">Kode Pos</p>
            <p className="font-medium text-stone-900">{profilDesa.identitas.kodePos}</p>
          </div>
          <div className="rounded-lg bg-stone-50 p-3">
            <p className="text-xs text-stone-500">Luas Wilayah</p>
            <p className="font-medium text-stone-900">{profilDesa.identitas.luasWilayah}</p>
          </div>
        </div>
      </div>

      {/* Pejabat Desa */}
      <div className="mb-6 rounded-xl border border-stone-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <Crown size={18} className="text-[#1e40af]" />
          <h2 className="text-lg font-semibold text-stone-900">Pejabat Desa</h2>
        </div>
        <div className="space-y-2">
          {pejabatDesa.map((pejabat, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-stone-100 bg-stone-50 px-4 py-3"
            >
              <div>
                <p className="font-medium text-stone-900">{pejabat.nama}</p>
<p className="text-xs text-stone-500">{pejabat.jabatan}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demografi */}
      <div className="rounded-xl border border-stone-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <Users size={18} className="text-[#1e40af]" />
          <h2 className="text-lg font-semibold text-stone-900">Demografi</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-stone-50 p-3">
            <p className="text-xs text-stone-500">Jumlah Penduduk</p>
            <p className="font-medium text-stone-900">{demografi.jumlahPenduduk}</p>
          </div>
          <div className="rounded-lg bg-stone-50 p-3">
            <p className="text-xs text-stone-500">Jumlah RT</p>
            <p className="font-medium text-stone-900">{demografi.jumlahRT}</p>
          </div>
          <div className="rounded-lg bg-stone-50 p-3">
            <p className="text-xs text-stone-500">Jumlah RW</p>
            <p className="font-medium text-stone-900">{demografi.jumlahRW}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="mb-2 text-xs text-stone-500">Mata Pencaharian</p>
          <div className="flex flex-wrap gap-2">
            {demografi.mataPencaharian.map((mata, i) => (
              <span
                key={i}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
              >
                {mata}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
