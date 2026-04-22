// app/profil/page.tsx
import { MapPin, Users, Briefcase } from "lucide-react";
import {
  profilDesa,
  pejabatDesa,
  visiMisi,
  demografi,
} from "@/src/data/profil";

export const metadata = {
  title: "Profil Desa - Si-Manggis",
  description: "Profil Desa Gunting Manggis - Identitas, pemerintahan, dan potensi desa.",
};

export default function ProfilPage() {
  return (
    <main className="flex flex-col">

      {/* Hero */}
      <section className="bg-[#1B4332] pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">
            Tentang Kami
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Profil Desa
          </h1>
          <p className="text-white/70 max-w-md text-sm">
            Mengenal lebih dekat Desa Gunting Manggis — identitas, pemerintahan, dan potensi desa.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20 space-y-16">

        {/* Identitas */}
        <section>
          <span className="accent-line mb-3 block" />
          <h2 className="text-2xl font-bold text-[#1B4332] mb-6">Identitas Desa</h2>
          <div className="bg-[#FEFCE8] rounded-xl overflow-hidden border border-stone-200">
            <div className="divide-y divide-stone-200">
              {[
                { label: "Nama Desa", value: profilDesa.identitas.namaDesa },
                { label: "Kecamatan", value: profilDesa.identitas.kecamatan },
                { label: "Kabupaten", value: profilDesa.identitas.kabupaten },
                { label: "Provinsi", value: profilDesa.identitas.provinsi },
                { label: "Kode Pos", value: profilDesa.identitas.kodePos },
                { label: "Luas Wilayah", value: profilDesa.identitas.luasWilayah },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-6 py-4">
                  <span className="text-sm text-stone-500">{label}</span>
                  <span className="text-sm font-semibold text-[#1B4332]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sejarah */}
        <section>
          <span className="accent-line mb-3 block" />
          <h2 className="text-2xl font-bold text-[#1B4332] mb-4">Sejarah Singkat</h2>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <p className="text-stone-600 leading-relaxed">{profilDesa.sejarah}</p>
            </div>
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl border border-stone-200 p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#EA580C]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={22} className="text-[#EA580C]" />
                </div>
                <div>
                  <p className="text-xs text-stone-400 uppercase font-semibold">Lokasi</p>
                  <p className="text-sm font-bold text-[#1B4332]">Kalimantan Selatan</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Struktur Pemerintah */}
        <section>
          <span className="accent-line mb-3 block" />
          <h2 className="text-2xl font-bold text-[#1B4332] mb-2">Struktur Pemerintah Desa</h2>
          <p className="text-sm text-stone-500 mb-6">Penanggung jawab pemerintahan Desa Gunting Manggis.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {pejabatDesa.map((p) => (
              <div
                key={p.jabatan}
                className="bg-white rounded-xl border border-stone-200 p-4 text-center hover-lift"
              >
                <div className="h-16 w-16 rounded-full bg-[#1B4332]/10 mx-auto mb-3 flex items-center justify-center">
                  <Users size={22} className="text-[#1B4332]" />
                </div>
                <p className="text-xs font-bold text-[#1B4332] leading-snug">{p.nama}</p>
                <p className="text-xs text-stone-400 mt-1">{p.jabatan}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Visi Misi */}
        <section>
          <span className="accent-line mb-3 block" />
          <h2 className="text-2xl font-bold text-[#1B4332] mb-6">Visi & Misi</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#1B4332] rounded-xl p-6">
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Visi</p>
              <p className="text-white leading-relaxed font-medium">&ldquo;{visiMisi.visi}&rdquo;</p>
            </div>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Misi</p>
              <ul className="space-y-3">
                {visiMisi.misi.map((m, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-[#EA580C] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-stone-600 leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Demografi */}
        <section>
          <span className="accent-line mb-3 block" />
          <h2 className="text-2xl font-bold text-[#1B4332] mb-6">Demografi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: Users,
                label: "Jumlah Penduduk",
                value: demografi.jumlahPenduduk,
                color: "bg-emerald-50 text-emerald-600",
              },
              {
                icon: MapPin,
                label: "Jumlah RT / RW",
                value: `${demografi.jumlahRT} / ${demografi.jumlahRW}`,
                color: "bg-orange-50 text-orange-600",
              },
              {
                icon: Briefcase,
                label: "Mata Pencaharian",
                value: demografi.mataPencaharian.join(", "),
                color: "bg-blue-50 text-blue-600",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="bg-white rounded-xl border border-stone-200 p-5 hover-lift"
              >
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${color.split(" ")[0]}`}>
                  <Icon size={18} className={color.split(" ")[1]} />
                </div>
                <p className="text-xs text-stone-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
                <p className="text-sm font-bold text-[#1B4332] leading-snug">{value}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
