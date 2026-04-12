# Si-Manggis Phase 1 — Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Bangun 4 halaman Phase 1: `/darurat`, `/profil`, `/layanan`, `/masuk` — plus update Navbar.

**Architecture:** Static pages dengan data di file terpisah (`src/data/`). Tidak ada database atau auth di Phase 1 — `/masuk` placeholder, `/layanan` form tanpa submission nyata. WhatsApp integration Phase 2.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, Lucide React, Google Maps Embed iframe.

---

## File Structure

```
app/
  darurat/page.tsx          # baru
  profil/page.tsx           # baru
  layanan/
    page.tsx                # baru
    aju/[jenis]/page.tsx    # baru
  masuk/page.tsx            # baru
src/
  data/
    darurat.ts              # baru — data kontak darurat
    profil.ts               # baru — data profil desa
    layanan.ts              # baru — daftar layanan
  components/
    Navbar.tsx              # modifikasi — tambah link Darurat
```

---

## Task 1: Update Navbar — Tambah Link Darurat

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Tambahkan link Darurat ke navLinks**

Ganti blok `const navLinks` di `src/components/Navbar.tsx:7-13` menjadi:

```typescript
const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Layanan", href: "/layanan" },
  { label: "Darurat", href: "/darurat" },
  { label: "Kabar", href: "/artikel" },
  { label: "Kontak", href: "/kontak" },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: add Darurat link to Navbar"
```

---

## Task 2: Data Darurat

**Files:**
- Create: `src/data/darurat.ts`

- [ ] **Step 1: Buat file data darurat**

```typescript
// src/data/darurat.ts

export type KategoriDarurat = "damkar" | "ambulans" | "poskesdes";

export interface EntriDarurat {
  id: string;
  kategori: KategoriDarurat;
  nama: string;
  alamat: string;
  telepon: string;
  teleponCadangan?: string;
  jamOperasional: string;
  deskripsi?: string;
  // Google Maps embed src (ambil dari google maps → share → embed)
  mapsEmbedSrc: string;
  icon: string; // lucide icon name
  warnaBg: string;
  warnaText: string;
}

export const dataDarurat: EntriDarurat[] = [
  {
    id: "damkar-1",
    kategori: "damkar",
    nama: "Pemadam Kebakaran Kecamatan Landasan Ulin",
    alamat: "Jl. Percy STS, Landasan Ulin, Kalimantan Selatan",
    telepon: "113", // nomor nasional
    teleponCadangan: "031-1234567",
    jamOperasional: "24 jam",
    deskripsi: "Melayani panggilan darurat kebakaran untuk wilayah Landasan Ulin dan sekitarnya.",
    mapsEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.5!2d114.9!3d-3.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMTgnMDAuMCJTIDExNMKwNTQnMDAuMCJF!5e0!3m2!1sen!2sid!4v1",
    icon: "Flame",
    warnaBg: "bg-orange-50",
    warnaText: "text-orange-600",
  },
  {
    id: "ambulans-1",
    kategori: "ambulans",
    nama: "Ambulans Desa Guntung Manggis",
    alamat: "Balai Desa Guntung Manggis, Kalimantan Selatan",
    telepon: "119", // nomor nasional
    teleponCadangan: "0812-3456-7890",
    jamOperasional: "24 jam",
    deskripsi: "Ambulans desa untuk darurat kesehatan warga Guntung Manggis.",
    mapsEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.5!2d114.9!3d-3.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMTgnMDAuMCJTIDExNMKwNTQnMDAuMCJF!5e0!3m2!1sen!2sid!4v2",
    icon: "Heart",
    warnaBg: "bg-red-50",
    warnaText: "text-red-600",
  },
  {
    id: "poskesdes-1",
    kategori: "poskesdes",
    nama: "Pos Kesehatan Desa Guntung Manggis",
    alamat: "Jl. Desa Guntung Manggis, Kalimantan Selatan",
    telepon: "0812-3456-7891",
    jamOperasional: "Senin-Jumat: 08.00 - 16.00 WIB",
    deskripsi: "Pelayanan kesehatan dasar, ibu hamil, balita, dan Imunisasi.",
    mapsEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.5!2d114.9!3d-3.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMTgnMDAuMCJTIDExNMKwNTQnMDAuMCJF!5e0!3m2!1sen!2sid!4v3",
    icon: "Syringe",
    warnaBg: "bg-emerald-50",
    warnaText: "text-emerald-600",
  },
];
```

> **Catatan:** `mapsEmbedSrc` di atas adalah placeholder. Koordinat aktual harus diambil dari Google Maps untuk lokasi nyata. Sementara biarkan placeholder, nanti ganti dengan koordinat asli.

- [ ] **Step 2: Commit**

```bash
git add src/data/darurat.ts
git commit -m "feat: add darurat data with damkar, ambulans, poskesdes entries"
```

---

## Task 3: Halaman Darurat

**Files:**
- Create: `app/darurat/page.tsx`
- Read: `src/data/darurat.ts`

- [ ] **Step 1: Buat halaman darurat**

```tsx
// app/darurat/page.tsx
import { Phone, MapPin, Clock, ChevronRight } from "lucide-react";
import { dataDarurat } from "@/src/data/darurat";

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
                      ? "🚒 Pemadam Kebakaran"
                      : item.kategori === "ambulans"
                      ? "🚑 Ambulans"
                      : "🏥 Pos Kesehatan Desa"}
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

          {/* Catatan bawah */}
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
```

- [ ] **Step 2: Commit**

```bash
git add app/darurat/page.tsx
git commit -m "feat: add /darurat page with damkar, ambulans, poskesdes info"
```

---

## Task 4: Data Profil

**Files:**
- Create: `src/data/profil.ts`

- [ ] **Step 1: Buat file data profil desa**

```typescript
// src/data/profil.ts

export interface PejabatDesa {
  nama: string;
  jabatan: string;
  foto?: string; // path ke /public/img/... atau null
}

export const profilDesa = {
  identitas: {
    namaDesa: "Desa Guntung Manggis",
    kecamatan: "Landasan Ulin",
    kabupaten: "Tanah Laut",
    provinsi: "Kalimantan Selatan",
    kodePos: "36553",
    luasWilayah: "4.250 Ha",
  },

  sejarah: `Desa Guntung Manggis merupakan desa yang terletak di Kecamatan Landasan Ulin, Kabupaten Tanah Laut, Provinsi Kalimantan Selatan. Desa ini dikenal dengan keindahan alamnya, terutama danau yang menjadi sumber kehidupan warga. Nama "Manggis" diambil dari buah manggis yang banyak tumbuh di daerah ini.`,
};

export const pejabatDesa: PejabatDesa[] = [
  { nama: "[Nama Kepala Desa]", jabatan: "Kepala Desa" },
  { nama: "[Nama Sekretaris]", jabatan: "Sekretaris Desa" },
  { nama: "[Nama Kaur 1]", jabatan: "Kaur Umum & Keuangan" },
  { nama: "[Nama Kaur 2]", jabatan: "Kaur Pembangunan" },
  { nama: "[Nama Kasi 1]", jabatan: "Kasi Pemerintahan" },
  { nama: "[Nama Kasi 2]", jabatan: "Kasi Kesejahteraan" },
];

export const visiMisi = {
  visi: "Terwujunya masyarakat Desa Guntung Manggis yang sejahtera, mandani, dan berdaya saing melalui pemanfaatan sumber daya alam dan teknologi digital.",
  misi: [
    "Meningkatkan kualitas dan akses layanan pemerintahan desa secara digital",
    "Mengembangkan potensi ekonomi lokal melalui pertanian, perkebunan, dan peternakan",
    "Memperkuat gotong royong dan partisipasi warga dalam pembangunan desa",
    "Meningkatkan kualitas pendidikan dan kesehatan masyarakat",
    "Melestarikan lingkungan hidup dan sumber daya alam desa",
  ],
};

export const demografi = {
  jumlahPenduduk: "31.000 Jiwa",
  jumlahRT: "51 RT",
  jumlahRW: "6 RW",
  mataPencaharian: ["Pertanian", "Perkebunan (Karet & Kelapa Sawit)", "Peternakan", "Pedagang", "Pegawai Negeri"],
};
```

- [ ] **Step 2: Commit**

```bash
git add src/data/profil.ts
git commit -m "feat: add profil desa data"
```

---

## Task 5: Halaman Profil

**Files:**
- Create: `app/profil/page.tsx`
- Read: `src/data/profil.ts`

- [ ] **Step 1: Buat halaman profil**

```tsx
// app/profil/page.tsx
import { MapPin, Users, Trees, Briefcase } from "lucide-react";
import {
  profilDesa,
  pejabatDesa,
  visiMisi,
  demografi,
} from "@/src/data/profil";

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
            Mengenal lebih dekat Desa Guntung Manggis — identitas, pemerintahan, dan potensi desa.
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
            <div className="lg:w-1/3 flex flex-col gap-4">
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
          <p className="text-sm text-stone-500 mb-6">Penanggung jawab pemerintahan Desa Guntung Manggis.</p>
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
              <p className="text-white leading-relaxed font-medium">"{visiMisi.visi}"</p>
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
```

- [ ] **Step 2: Commit**

```bash
git add app/profil/page.tsx
git commit -m "feat: add /profil page with village identity, history, government structure"
```

---

## Task 6: Data & Halaman Layanan

**Files:**
- Create: `src/data/layanan.ts`
- Create: `app/layanan/page.tsx`
- Create: `app/layanan/aju/[jenis]/page.tsx`

### 6a. Data Layanan

- [ ] **Step 1: Buat src/data/layanan.ts**

```typescript
// src/data/layanan.ts

export interface Layanan {
  id: string;
  slug: string;
  nama: string;
  deskripsi: string;
  icon: string; // lucide icon name
  bgColor: string;
  textColor: string;
  rtNotify: boolean;
  fields?: string[]; // field tambahan per jenis
}

export const daftarLayanan: Layanan[] = [
  {
    id: "surat-domisili",
    slug: "surat-domisili",
    nama: "Surat Keterangan Domisili",
    deskripsi: "Pengajuan surat keterangan domisili untuk keperluan administrasi.",
    icon: "Home",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    rtNotify: true,
  },
  {
    id: "surat-pengantar-rt",
    slug: "surat-pengantar-rt",
    nama: "Surat Pengantar RT",
    deskripsi: "Surat pengantar dari RT untuk keperluan tertentu.",
    icon: "FileText",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    rtNotify: true,
  },
  {
    id: "surat-usaha",
    slug: "surat-usaha",
    nama: "Surat Keterangan Usaha",
    deskripsi: "Surat keterangan usaha untuk mendukung kegiatan ekonomi warga.",
    icon: "Briefcase",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    rtNotify: true,
  },
  {
    id: "bantuan-sosial",
    slug: "bantuan-sosial",
    nama: "Pendaftaran Bantuan Sosial",
    deskripsi: "Pendaftaran untuk menerima bantuan sosial dari pemerintah.",
    icon: "Heart",
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
    rtNotify: true,
  },
  {
    id: "izin-keramaian",
    slug: "izin-keramaian",
    nama: "Izin Keramaian",
    deskripsi: "Izin untuk kegiatan keramaian atau kerumunan warga.",
    icon: "Users",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    rtNotify: false,
  },
  {
    id: "pembayaran",
    slug: "pembayaran",
    nama: "Pembayaran Retribusi",
    deskripsi: "Pembayaran retribusi dan iuran desa.",
    icon: "CreditCard",
    bgColor: "bg-teal-50",
    textColor: "text-teal-600",
    rtNotify: false,
  },
];

export const rtList = Array.from({ length: 51 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { value: n, label: `RT ${n}` };
});

export const rwList = Array.from({ length: 6 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { value: n, label: `RW ${n}` };
});
```

- [ ] **Step 2: Commit**

```bash
git add src/data/layanan.ts
git commit -m "feat: add layanan data with 6 service types and RT/RW lists"
```

### 6b. Halaman Landing Layanan

- [ ] **Step 1: Buat app/layanan/page.tsx**

```tsx
// app/layanan/page.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { daftarLayanan } from "@/src/data/layanan";

// Dynamic import lucide untuk icon
import * as LucideIcons from "lucide-react";

export default function LayananPage() {
  return (
    <main className="flex flex-col">

      {/* Hero */}
      <section className="bg-[#1B4332] pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">
            Layanan Desa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Layanan Desa Digital
          </h1>
          <p className="text-white/70 max-w-md text-sm">
            Ajukan berbagai keperluan administrasi desa secara online tanpa harus datang ke balai desa.
          </p>
        </div>
      </section>

      {/* Info banner */}
      <div className="bg-[#FEFCE8] border-b border-stone-200 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl py-3 flex items-center gap-2 text-sm text-stone-600">
          <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C] inline-block flex-shrink-0" />
          <span>
            Untuk mengajukan layanan, silakan{" "}
            <Link href="/masuk" className="text-[#EA580C] font-semibold hover:underline">
              masuk terlebih dahulu
            </Link>
            .
          </span>
        </div>
      </div>

      {/* Grid layanan */}
      <section className="py-16 lg:py-20 bg-stone-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {daftarLayanan.map((layanan) => {
              const IconComponent =
                (LucideIcons as Record<string, React.ComponentType<{ size: number; strokeWidth: number }>>)[
                  layanan.icon
                ] ?? LucideIcons.File;

              return (
                <Link
                  key={layanan.id}
                  href={`/layanan/aju/${layanan.slug}`}
                  className="bg-white rounded-xl p-5 border border-stone-200 hover:border-[#EA580C]/40 hover-lift group flex flex-col gap-3"
                >
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${layanan.bgColor}`}>
                    <IconComponent size={20} className={layanan.textColor} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-[#1B4332] group-hover:text-[#EA580C] transition-colors leading-snug mb-1">
                      {layanan.nama}
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      {layanan.deskripsi}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#EA580C] font-semibold">
                    Ajukan <ArrowRight size={12} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layanan/page.tsx
git commit -m "feat: add /layanan landing page with service grid"
```

### 6c. Halaman Formulir Pengajuan

- [ ] **Step 1: Buat app/layanan/aju/[jenis]/page.tsx**

```tsx
// app/layanan/aju/[jenis]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { daftarLayanan, rtList, rwList } from "@/src/data/layanan";

const STEPS = ["Data Diri", "Alamat", "Detail", "Konfirmasi"];

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-stone-700 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AjuPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.jenis as string;

  const layanan = daftarLayanan.find((l) => l.slug === slug);
  if (!layanan) {
    return (
      <main className="pt-32 pb-20 max-w-2xl mx-auto px-6">
        <p className="text-stone-500">Layanan tidak ditemukan.</p>
        <Link href="/layanan" className="text-[#EA580C] underline mt-4 block">
          Kembali ke Layanan
        </Link>
      </main>
    );
  }

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    nik: "",
    whatsapp: "",
    alamat: "",
    rt: "",
    rw: "",
    deskripsi: "",
  });

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Phase 1: belum ada backend — tampilkan sukses saja
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-md px-6 text-center">
          <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#1B4332] mb-2">
            Pengajuan Terkirim!
          </h1>
          <p className="text-stone-500 text-sm mb-8">
            Pengajuan <strong>{layanan.nama}</strong> Anda telah diterima. Village officer akan menghubungi Anda melalui WhatsApp.
          </p>
          <Link
            href="/layanan"
            className="inline-flex items-center gap-2 rounded-full bg-[#1B4332] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2D5016]"
          >
            Kembali ke Layanan
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20">
      <div className="mx-auto max-w-2xl px-6">

        {/* Back */}
        <Link
          href="/layanan"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-[#1B4332] mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Kembali
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold text-[#EA580C] uppercase tracking-wide mb-1">
            Formulir Pengajuan
          </p>
          <h1 className="text-2xl font-bold text-[#1B4332]">{layanan.nama}</h1>
          <p className="text-sm text-stone-500 mt-1">{layanan.deskripsi}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-[#EA580C]" : "bg-stone-200"
                }`}
              />
              <span
                className={`text-xs font-semibold hidden sm:block ${
                  i <= step ? "text-[#EA580C]" : "text-stone-400"
                }`}
              >
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            if (step < STEPS.length - 1) {
              e.preventDefault();
              setStep((s) => s + 1);
            } else {
              handleSubmit(e);
            }
          }}
          className="space-y-5 bg-white rounded-2xl border border-stone-200 p-6"
        >

          {/* Step 0: Data Diri */}
          {step === 0 && (
            <>
              <FormField label="Nama Lengkap *">
                <input
                  type="text"
                  required
                  value={form.nama}
                  onChange={(e) => update("nama", e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C]/30 focus:border-[#EA580C] transition"
                  placeholder="Masukkan nama lengkap"
                />
              </FormField>
              <FormField label="NIK (16 Digit) *">
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={form.nik}
                  onChange={(e) => update("nik", e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C]/30 focus:border-[#EA580C] transition"
                  placeholder="16 digit NIK"
                />
              </FormField>
              <FormField label="Nomor WhatsApp *">
                <input
                  type="tel"
                  required
                  value={form.whatsapp}
                  onChange={(e) => update("whatsapp", e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C]/30 focus:border-[#EA580C] transition"
                  placeholder="08xxxxxxxxxx"
                />
              </FormField>
            </>
          )}

          {/* Step 1: Alamat */}
          {step === 1 && (
            <>
              <FormField label="Alamat Lengkap *">
                <textarea
                  required
                  rows={3}
                  value={form.alamat}
                  onChange={(e) => update("alamat", e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C]/30 focus:border-[#EA580C] transition resize-none"
                  placeholder="Jl. ..., Desa Guntung Manggis"
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="RT *">
                  <select
                    required
                    value={form.rt}
                    onChange={(e) => update("rt", e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C]/30 focus:border-[#EA580C] transition bg-white"
                  >
                    <option value="">Pilih RT</option>
                    {rtList.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="RW *">
                  <select
                    required
                    value={form.rw}
                    onChange={(e) => update("rw", e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C]/30 focus:border-[#EA580C] transition bg-white"
                  >
                    <option value="">Pilih RW</option>
                    {rwList.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </FormField>
              </div>
            </>
          )}

          {/* Step 2: Detail */}
          {step === 2 && (
            <>
              <FormField label={`Keterangan / Keperluan *`}>
                <textarea
                  required
                  rows={5}
                  value={form.deskripsi}
                  onChange={(e) => update("deskripsi", e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C]/30 focus:border-[#EA580C] transition resize-none"
                  placeholder="Jelaskan keperluan pengajuan Anda..."
                />
              </FormField>
            </>
          )}

          {/* Step 3: Konfirmasi */}
          {step === 3 && (
            <>
              <div className="bg-stone-50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-stone-700 mb-3">Ringkasan Pengajuan</p>
                {[
                  ["Nama", form.nama],
                  ["NIK", form.nik],
                  ["WhatsApp", form.whatsapp],
                  ["Alamat", `${form.alamat}, RT ${form.rt}/RW ${form.rw}`],
                  ["Layanan", layanan.nama],
                  ["Keperluan", form.deskripsi],
                ].map(([key, val]) => (
                  <div key={key} className="flex gap-3">
                    <span className="text-stone-400 w-24 flex-shrink-0">{key}</span>
                    <span className="text-stone-700 font-medium">{val}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-stone-400">
                Dengan menekan "Ajukan", Anda menyatakan data yang diberikan adalah benar.
              </p>
            </>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
              >
                <ArrowLeft size={14} /> Kembali
              </button>
            )}
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#EA580C] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#C2410C] transition-colors"
            >
              {step < STEPS.length - 1 ? (
                <>Lanjut <ArrowRight size={14} /></>
              ) : (
                "Ajukan Sekarang"
              )}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layanan/aju/[jenis]/page.tsx
git commit -m "feat: add /layanan/aju/[jenis] multi-step pengajuan form"
```

---

## Task 7: Halaman Masuk (Login Placeholder)

**Files:**
- Create: `app/masuk/page.tsx`

- [ ] **Step 1: Buat halaman login placeholder**

```tsx
// app/masuk/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function MasukPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Phase 1: belum ada auth — show placeholder alert
    setTimeout(() => {
      setLoading(false);
      alert("Fitur login akan segera hadir! Phase 2: integration with village officer dashboard.");
    }, 1000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1B4332] mb-4">
            <span className="text-xl font-bold text-white">SM</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1B4332]">Masuk</h1>
          <p className="text-sm text-stone-500 mt-1">
            Masuk sebagai Village Officer untuk mengelola pengajuan warga.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C]/30 focus:border-[#EA580C] transition"
              placeholder="username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C]/30 focus:border-[#EA580C] transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-[#EA580C] py-3 text-sm font-bold text-white hover:bg-[#C2410C] transition-colors disabled:opacity-60"
          >
            {loading ? (
              "Memproses..."
            ) : (
              <>
                <LogIn size={14} /> Masuk
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-stone-400 mt-4">
          Warga ingin mengajukan layanan?{" "}
          <Link href="/layanan" className="text-[#EA580C] hover:underline font-semibold">
            Ajukan di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/masuk/page.tsx
git commit -m "feat: add /masuk login placeholder page"
```

---

## Task 8: Final Check

- [ ] **Step 1: Jalankan dev server dan verifikasi semua halaman**

```bash
npm run dev
```

Buka di browser:
- `http://localhost:3000/darurat` — cek tampil
- `http://localhost:3000/profil` — cek tampil
- `http://localhost:3000/layanan` — cek tampil
- `http://localhost:3000/layanan/aju/surat-domisili` — cek form berfungsi
- `http://localhost:3000/masuk` — cek tampil

- [ ] **Step 2: Commit Phase 1 selesai**

```bash
git add .
git commit -m "feat: complete Phase 1 - darurat, profil, layanan, masuk pages"
```

---

## Spec Coverage Check

| Spec Requirement | Task |
|---|---|
| Halaman Darurat (Damkar, Ambulans, Poskesdes + Maps) | Task 2, 3 |
| Halaman Profil (Identitas, Sejarah, Struktur, Visi Misi, Demografi) | Task 4, 5 |
| Landing Layanan + Form Pengajuan + Dropdown RT/RW | Task 6a, 6b, 6c |
| Halaman Login placeholder | Task 7 |
| Navbar update (tambah Darurat) | Task 1 |

**Spec gaps:** Tidak ada — semua requirement Phase 1 tercakup.
