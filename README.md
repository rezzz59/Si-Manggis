# Si-Manggis

**Portal Layanan Desa Digital** untuk Desa Guntung Manggis, Kalimantan Selatan. Sistem informasi yang memfasilitasi warga desa untuk mengakses layanan pemerintahan dan mendapatkan informasi secara mudah.

## Fitur

### Warga (Tanpa Login)
- **Beranda** — Informasi umum dan berita desa
- **Profil** — Identitas desa, sejarah, visi misi, struktur pemerintah
- **Layanan** — Daftar layanan pemerintahan desa
- **Darurat** — Informasi kontak darurat (Damkar, Ambulans, Poskesdes)
- **Kabar** — Artikel dan berita desa
- **Kontak** — Hubungi kantor desa
- **Cek Tiket** — Lacak status permohonan atau pengaduan

### Staff Desa (Login Required)
- **Dashboard Staff** — Ringkasan permohonan dan pengaduan
- **Kelola Permohonan** — Daftar, detail, dan update status permohonan surat
- **Kelola Pengaduan** — Daftar, detail, dan update status pengaduan warga

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Database:** Prisma ORM + SQLite
- **Auth:** NextAuth.js v5 (Credentials provider)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm / pnpm / bun

### Setup

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env  # jika ada, atau cek .env

# Generate Prisma client
npx prisma generate

# Buat tabel database
npx prisma db push

# Seed data awal (user staff default)
npm run db:seed
```

### Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Login Staff Default

| Field | Value |
|-------|-------|
| Email | `admin@desaguntungmanggis.id` |
| Password | `staff2026` |

Akses dashboard di [http://localhost:3000/login](http://localhost:3000/login)

## Database Commands

```bash
npx prisma generate    # Generate Prisma client
npx prisma db push     # Sync schema ke database
npx prisma studio      # Buka GUI database (http://localhost:5555)
npm run db:seed        # Seed data awal
```

## Project Structure

```
app/
  api/                 # API routes (auth, permohonan, pengaduan, cek-tiket)
  dashboard/           # Halaman staff (proteksi login)
  [halaman publik]     # Beranda, Profil, Layanan, Darurat, Kabar, Kontak, Cek Tiket

prisma/
  schema.prisma        # Database schema
  seed.ts             # Seed script

src/
  lib/                 # Prisma client, auth config, tiket generator
  components/          # Komponen reusable (Navbar, dll)
  data/               # Data statis (artikel, layanan, profil)
```

## Pengembangan

### Branch

- `main` — Branch utama (production-ready)
- `alamat` — Branch pengembangan fitur alamat & backend Fase 1

### Rencana

- **Fase 1:** Informasi darurat, profil desa, backend staff (CRUD permohonan/pengaduan) ✅
- **Fase 2:** Formulir permohonan surat, halaman pengaduan warga

---

Dibuat untuk Desa Guntung Manggis

- contributor refresh: Aby Wahyudi
