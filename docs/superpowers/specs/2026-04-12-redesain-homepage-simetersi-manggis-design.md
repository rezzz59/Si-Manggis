# Spec: Redesain Homepage Si-Manggis

**Tanggal:** 2026-04-12
**Status:** Disetujui user

---

## 1. Concept & Vision

Redesain homepage Si-Manggis menjadi portal kelurahan yang **profesional, terstruktur, dan berkarakter** — bukan template generik. Mirip portal pemerintahan Jawa Timur dalam struktur, tapi dengan identitas lokal Guntung Manggis (semi-perkotaan, 52 RT, program inovasi). Gaya visual mengikuti tutorial Shandika Galih — clean, Tailwind-based, institutional Indonesia — tapi dengan sentuhan "human-made" yang terasa sengaja dibuat, bukan generated AI.

---

## 2. Design Language

### Aesthetic Direction
Clean institutional Indonesia dengan karakter handmade. Bukan template Bootstrap. Bukan hasil generate AI. Terasa seperti dibuat developer yang tahu apa yang dia lakukan.

### Color Palette
- **Biru Utama:** `#1e40af` (blue-800) — navbar, hero, blok kiri
- **Biru Muda:** `#eff6ff` (blue-50) — background kolom kanan
- **Putih:** `#ffffff` — card background
- **Abu Card Border:** `#cbd5e1` (slate-300)
- **Hitam Teks:** `#1e293b` (slate-800)
- **Abu Teks:** `#64748b` (slate-500)
- **Aksen Oranye:** `#f97316` — tombol CTA突出, badge penting
- **Hijau Aksen:** `#16a34a` — program lingkungan (Bank Sampah)

### Typography
- Font: **Plus Jakarta Sans** (sudah ada di project)
- Heading: `font-bold`, `tracking-tight`
- Subheading: `text-sm`, `text-slate-500`
- Tidak ada gradient text

### Spatial System
- Padding: `px-4 sm:px-6 lg:px-8` (tidak selalu `px-6`)
- Gap card horizontal vs vertical BEDA — contoh `gap-y-6 gap-x-4`
- Section padding TIDAK selalu sama — hero `py-16 lg:py-24`, stats `py-6`, dll
- Margin antar section tidak selalu `mb-10` — variasikan

### Motion Philosophy
- **HANYA** hover lift pada card (subtle, `translateY(-2px)`)
- **TIDAK ADA** stagger animation fade-up
- **TIDAK ADA** pulse dot
- **TIDAK ADA** scroll bounce
- Kecepatan: 150ms ease, bukan 250ms

### Visual Assets
- Icons: Lucide React
- Images: foto asli kelurahan (bukan stock)
- Shadow: **hard shadow** (`box-shadow: 2px 3px 0 #cbd5e1`) — bukan blur halus
- Border radius: `rounded-sm` atau `rounded` — bukan `rounded-xl` everywhere

---

## 3. Layout & Structure

### Page Flow
```
Navbar (putih, fixed/sticky)
  ↓
Hero Section
  - Blok kiri (biru, 60%) → teks selamat datang + search bar
  - Blok kanan (foto berbingkai, 40%) → foto kelurahan
  ↓
Duo Section (2 kolom)
  - Kiri (biru #1e40af): Transparansi + Visi + Akses Cepat
  - Kanan (putih): Berita Terkini + Grid Layanan
  ↓
Statistik Bar (biru tua)
  ↓
Footer (gelap)
```

### Responsive Strategy
- Mobile: single column, stack vertikal
- md: 2 kolom di duo section
- lg: hero split 60/40, grid layanan 4 kolom

### Pacing
Section tidak selalu sama节奏 — hero besar dan breathable, duo section padat, stats bar ringkas.

---

## 4. Features & Interactions

### Navbar
- Logo SM + "Si-Manggis"
- Menu: Beranda, Layanan, Profil, Berita, Darurat
- Tombol CTA: "Dashboard" (biru tua, выступающий)
- Sticky dengan border bottom subtle

### Hero Section
- Kiri biru besar: "Selamat Datang di Portal Resmi Kelurahan Gunting Manggis"
- Subtitle: "Kota Banjarbaru, Kalimantan Selatan"
- Search bar: "Cari layanan, dokumen, berita..." dengan ikon magnifier
- Kanan: foto kelurahan berbingkai

### Kolom Kiri (Biru)
**Blok 1 — Transparansi**
- Judul + tombol "Lihat Semua"
- 3 kartu dokumen: RKPD, Perubahan APBDes, Laporan Keuangan

**Blok 2 — Visi & Potensi**
- Foto Lurah Zikru Rakhman
- Visi pembangunan + tombol "Lihat Selengkapnya"

**Blok 3 — Akses Cepat**
- 2 kartu besar: "Lapor!" (merah) + "Sistem Data" (oranye)

### Kolom Kanan (Putih)
**Blok 1 — Berita Terkini**
- Judul + tombol "Lihat Lebih Banyak"
- 2–3 kartu berita dengan thumbnail + judul

**Blok 2 — Layanan Publik**
- Grid 4×2 kartu layanan: Surat Keterangan, Data Penduduk, Izin Tempat, Bantuan Sosial, dll

### Footer
- Logo + tagline
- Navigasi links
- Kontak info
- Copyright

---

## 5. Component Inventory

### Card Dokumen (Transparansi)
- Background: `rgba(255,255,255,0.12)`
- Border radius: `rounded-sm`
- Shadow: hard shadow
- Hover: subtle lift

### Card Berita
- Thumbnail aspect ratio 16:9
- Tanggal badge (oranye)
- Title: bold, max 2 line
- Hover: image scale subtle

### Card Layanan
- Icon centered di atas
- Title bold centered
- Background putih, border slate-300
- Hover: border berubah biru

### Card Akses Cepat
- Background aksen (merah/oranye)
- Icon + judul besar
- Hard shadow

### Search Bar
- Background putih, rounded
- Icon magnifier di kiri
- Placeholder text
- Focus: ring biru

### Stat Bar
- Background biru gelap (#1e3a5f)
- 4 item stat (ikon + angka + label)
- Divider antar item

---

## 6. Technical Approach

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4 (tanpa config, `@import "tailwindcss"`)
- **Font:** Plus Jakarta Sans via next/font/google
- **Icons:** Lucide React
- **Images:** di `/public/img/`
- **Language:** TypeScript strict
- **Locale:** `lang="id"`

### File to Modify
- `app/page.tsx` — redesign homepage sepenuhnya
- `app/globals.css` — update CSS variables + hapus animasi lama yang tidak perlu

### Data Source
- `docs/riset-kelurahan.md` — semua data factual kelurahan

### Not in Scope (untuk iterasi pertama)
- Halaman layanan detail
- Halaman berita detail
- Form pengajuan surat
- Backend/database
