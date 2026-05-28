# Si-Manggis — Dokumentasi Proyek

## 1. Gambaran Proyek

### Apa Itu Si-Manggis?
**Si-Manggis** adalah portal layanan digital untuk **Kelurahan Guntungan Manggis**, Kecamatan Landasan Ulin, Kota Banjarbaru, Kalimantan Selatan. Portal ini dirancang untuk memfasilitasi warga dalam mengajukan permohonan surat dan layanan desa **tanpa harus datang langsung** ke kantor kelurahan, serta memungkinkan RT (Ketua RT) untuk menyetujui/menolak permohonan **via WhatsApp** — tanpa perlu login ke sistem.

### Tujuan
- Mempercepat proses permohonan surat/layanan warga
- Mengurangi beban warga yang harus datang langsung ke kelurahan
- Memberikan RT kemampuan menyetujui permohonan via WA
- Staff kelurahan bisa mengelola dan memproses permohonan via dashboard

### Lokasi & Konteks Wilayah
- **Kelurahan**: Guntungan Manggis
- **Kecamatan**: Landasan Ulin
- **Kota**: Banjarbaru
- **Provinsi**: Kalimantan Selatan
- **Kode Wilayah**: 63.72.02.1005
- **Kode Pos**: 70724
- **Jumlah RT**: 52 RT (setelah pemekaran Oktober 2025)

---

## 2. Fitur Utama

### 2.1 Permohonan Layanan (`/layanan`)
Warga bisa mengajukan permohonan surat/layanan dengan mengisi formulir:
- **Form**: Nama, NIK, Alamat, Nomor Telepon, Jenis Layanan, Keperluan
- **Tiket**: Sistem generate nomor tiket unik (8 karakter alfanumerik)
- **Notifikasi WA**: Sistem kirim detail permohonan ke WA RT terkait via Fonnte API
- **Persetujuan RT**: RT balas "SETUJU" atau "TOLAK [alasan]" via WhatsApp
- **Status Tracking**: Warga bisa cek status di `/cek-tiket`

### 2.2 Pengaduan Warga (`/pengaduan`)
Warga bisa menyampaikan pengaduan/komplain:
- **Form**: Nama, Nomor Telepon, Email (opsional), Topik, Pesan
- **Tiket**: Sistem generate nomor tiket unik
- **Proses**: Staff kelurahan proses via dashboard
- **Status Tracking**: Warga bisa cek status via `/cek-tiket`

### 2.3 Cek Tiket (`/cek-tiket`)
- Publik — tanpa login
- Input: nomor tiket
- Output: status permohonan/pengaduan terkini

### 2.4 Dashboard Staff (`/dashboard`)
- **Login**: Email + password via NextAuth
- **Manajemen Permohonan**: Lihat, proses, ubah status
- **Manajemen Pengaduan**: Lihat, proses, ubah status
- **Kelola Artikel**: CRUD berita/artikel
- **Kelola Homepage**: Konfigurasi section homepage (hero, stat bar, program)
- **Kelola Aset**: Upload gambar/dokumen ke Supabase Storage

### 2.5 Artikel & Berita (`/artikel`)
- Halaman publik daftar artikel
- Detail artikel
- Admin bisa membuat/edit artikel via dashboard

### 2.6 Halaman Darurat (`/darurat`)
- Nomor-nomor penting: Damkar, Ambulans (via Google Maps links)
- Fast access untuk warga dalam keadaan darurat

---

## 3. Struktur Teknis

### Stack
| Komponen | Teknologi |
|---|---|
| Frontend Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL) |
| Auth | NextAuth v5 (Credentials Provider) |
| External API | Fonnte WhatsApp API |
| Storage | Supabase Storage |
| Language | TypeScript (strict mode) |
| Deployment | Vercel (rekomendasi) |

### Struktur Direktori
```
app/
  page.tsx              # Homepage
  layout.tsx            # Root layout (Navbar + Footer)
  globals.css           # Global styles + Tailwind import
  favicon.ico
  login/                # Halaman login staff
  artikel/              # Daftar artikel (publik)
  layanan/              # Form permohonan layanan
  pengaduan/             # Form pengaduan
  laporan/              # Form pengaduan via WA RT
  cek-tiket/            # Cek status tiket (publik)
  darurat/              # Nomor darurat
  dashboard/            # Dashboard staff (auth required)
    layout.tsx          # Dashboard layout (sidebar)
    permohonan/        # Manajemen permohonan
    pengaduan/          # Manajemen pengaduan
    artikel/           # Kelola artikel
    homepage/          # Konfigurasi homepage
    aset/              # Kelola aset website
  api/                  # API Routes
    permohonan/
    pengaduan/
    cek-tiket/
    fonnte/
    rt/
    artikel/
    assets/
    homepage/
  login/
src/
  components/           # Komponen reusable
  lib/                  # Utilities (supabase, auth, fonnte)
  data/                 # Static data (layanan, program)
docs/
  uml/                  # Diagram UML sistem
```

### Environment Variables (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=        # URL project Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Anon key Supabase
SUPABASE_SERVICE_KEY=            # Service role key (server-side only)
FONNTE_API_KEY=                  # API key Fonnte WhatsApp
AUTH_SECRET=                     # NextAuth secret (generate: openssl rand -base64 32)
FONNTE_WA_NUMBER=               # Nomor WA pengirim Fonnte
FONNTE_WEBHOOK_SECRET=          # Secret untuk verifikasi webhook (opsional)
NEXT_PUBLIC_DESA_EMAIL=         # Email default untuk login staff (opsional)
```

> ⚠️ **PENTING**: `SUPABASE_SERVICE_KEY` dan `FONNTE_API_KEY` HARUS di server-side ONLY. Jangan pernah expose ke client/frontend.

---

## 4. Alur Kerja Sistem

### Alur Permohonan
```
Warga → Form /layanan → Submit
         ↓
   API /api/permohonan (POST)
         ↓
   Generate tiket unik
         ↓
   Supabase DB (tabel: permohonan, status=MENUNGGU)
         ↓
   Fonnte API → Kirim WA ke RT terkait
         ↓
RT terima WA berisi detail permohonan
         ↓
RT balas "SETUJU" atau "TOLAK [alasan]" via WA
         ↓
Fonnte Webhook /api/fonnte/webhook terima balasan
         ↓
Sistem update status:
  - SETUJU → status=_disetujui_rt → Notifikasi ke Staff Kelurahan
  - TOLAK → status=ditolak_rt
         ↓
Staff Kelurahan login ke /dashboard
         ↓
Staff proses → ubah status: DIPROSES → SELESAI
         ↓
Warga cek status di /cek-tiket
```

### Alur Pengaduan
```
Warga → Form /pengaduan → Submit
         ↓
   API /api/pengaduan (POST)
         ↓
   Generate tiket + simpan (status=MENUNGGU)
         ↓
   Staff login /dashboard → lihat pengaduan
         ↓
   Staff proses → ubah status: DIPROSES → SELESAI
         ↓
   Warga cek status di /cek-tiket
```

### Status Permohonan
```
MENUNGGU → DISETUJAI_RT → DIPROSES → SELESAI
              ↓
         DITOLAK_RT ─────────→ DITOLAK
```

### Status Pengaduan
```
MENUNGGU → DIPROSES → SELESAI
              ↓
         DITOLAK
```

---

## 5. Database Schema

### Tabel Utama

**staff** — Akun staff Kelurahan
- `id` (UUID, PK)
- `email` (VARCHAR, unique)
- `password` (VARCHAR, bcrypt hash)
- `nama` (VARCHAR)
- `created_at`, `updated_at`

**rt** — Data RT
- `id` (UUID, PK)
- `nomor_rt` (VARCHAR, unique, format "01"-"52")
- `nama_ketua` (VARCHAR)
- `no_wa_rt` (VARCHAR, nomor WhatsApp)
- `rw_id` (VARCHAR, nullable)

**permohonan** — Permohonan surat/layanan
- `id` (UUID, PK)
- `tiket` (VARCHAR, unique, 8 karakter)
- `nama`, `nik`, `alamat`, `telepon`
- `layanan` (VARCHAR, dari daftar layanan)
- `sub_layanan` (VARCHAR, nullable)
- `deskripsi` (TEXT, nullable)
- `nomor_rt` (VARCHAR, FK ke rt)
- `status` (VARCHAR, enum status)
- `catatan` (TEXT, nullable)
- `lampiran_url` (TEXT[], nullable)
- `fonnte_msg_id` (VARCHAR, nullable)
- `rt_approved_at`, `rt_approved_via`
- `kelurahan_approved_at`
- `surat_url` (VARCHAR, nullable)
- `created_at`, `updated_at`

**pengaduan** — Pengaduan warga
- `id` (UUID, PK)
- `tiket` (VARCHAR, unique)
- `nama`, `telepon`, `email` (nullable)
- `topik` (VARCHAR)
- `pesan` (TEXT)
- `status` (VARCHAR)
- `created_at`, `updated_at`

**artikel** — Berita/artikel
- `id`, `judul`, `slug` (unique), `excerpt`, `konten` (HTML/Markdown)
- `gambar_url` (VARCHAR, nullable)
- `kategori`, `penulis`, `tgl_publish`
- `is_featured`, `is_published`
- `created_at`, `updated_at`

**website_assets** — Aset/gambar website
- `id`, `filename`, `storage_url`
- `category` (VARCHAR)
- `alt_text`, `caption` (nullable)
- `is_active`, `sort_order`
- `metadata` (JSONB, nullable)
- `created_by` (FK ke staff)
- `created_at`, `updated_at`

**homepage_config** — Konfigurasi homepage
- `id`, `section` (VARCHAR, unique)
- `config` (JSONB)
- `updated_at`

**laporan_status_log** — Log perubahan status (audit trail)
- `id`, `laporan_id`, `from_status`, `to_status`
- `changed_by`, `changed_at`, `note`

---

## 6. Role & Akses

| Peran | Login | Akses |
|---|---|---|
| **Warga** | ❌ | Submit permohonan/pengaduan, cek tiket |
| **RT** | ❌ | Terima & balas WA (SETUJU/TOLAK) |
| **Staff Kelurahan** | ✅ | Proses permohonan/pengaduan via dashboard |
| **Admin Website** | ✅ | Kelola artikel, homepage, aset |

### Login Staff
- **URL**: `/login`
- **Credential**: Email + Password (NextAuth Credentials)
- **Session**: JWT strategy
- **Akun default**: Dibuat oleh developer, disimpan di tabel `staff`

---

## 7. API Routes

### Publik (tanpa auth)
```
POST /api/permohonan      → Warga submit permohonan
POST /api/pengaduan       → Warga submit pengaduan
GET  /api/cek-tiket/[tiket] → Lookup status tiket
GET  /api/rt              → Daftar RT
GET  /api/artikel         → Daftar artikel (published only)
GET  /api/cek-tiket/[tiket] → Cek status tiket permohonan/pengaduan
POST /api/fonnte/webhook  → Fonnte inbound WA webhook
```

### Proteksi (auth required)
```
GET/POST /api/permohonan          → List (auth), Create (public)
GET/PATCH /api/permohonan/[id]    → Detail, Update
GET/POST /api/pengaduan           → List (auth), Create (public)
GET/PATCH /api/pengaduan/[id]     → Detail, Update
POST /api/fonnte/send             → Kirim WA (admin only)
GET/POST /api/artikel             → List (public), Create (admin)
PUT/DELETE /api/artikel/[id]      → Update, Delete (admin)
GET/POST /api/assets              → List (public), Upload (admin)
GET/PUT /api/homepage            → Get/Update config (admin)
```

---

## 8. Fitur-Fitur Spesifik

### 8.1 Notifikasi WA via Fonnte
- Sistem kirim WA otomatis ketika:
  - Ada permohonan baru (ke RT terkait)
  - Permohonan disetujui RT (ke Staff Kelurahan)
- RT menyetujui/menolak via balasan WA
- Format balasan: `SETUJU` atau `TOLAK [alasan]`

**Konfigurasi Fonnte** (di `/src/lib/fonnte.ts`):
- API Key: dari `.env.local` → `FONNTE_API_KEY`
- Nomor pengirim: dari `.env.local` → `FONNTE_WA_NUMBER`
- Webhook endpoint: `/api/fonnte/webhook`

### 8.2 Generate Tiket
Tiket generated secara random menggunakan:
```typescript
// Format: 8 karakter alfanumerik uppercase
Math.random().toString(36).substring(2, 10).toUpperCase()
```
Unik — dicek sebelum insert ke database.

### 8.3 Daftar Layanan
Definisikan di `src/data/layanan.ts`. Setiap layanan punya:
- `id`, `nama`, `icon`, `warnaBg`, `warnaText`
- `estimasi` (estimasi waktu proses)
- `dokumen` (array, dokumen yang diperlukan)

### 8.4 Homepage Config
Konfigurasi section homepage tersimpan di tabel `homepage_config` sebagai JSONB. Admin bisa edit dari dashboard tanpa perlu deploy ulang.

### 8.5 Aset Website (Supabase Storage)
- Bucket: `website-assets`
- Admin bisa upload gambar/dokumen
- Dipakai di homepage, artikel, dll.

---

## 9. Deployment

### Persiapan
1. Buat project Supabase baru
2. Buat database sesuai schema (run migration files di `supabase/migrations/`)
3. Setup Supabase Storage bucket `website-assets`
4. Buat tabel `staff` dan insert akun admin awal
5. Buat tabel `rt` dan insert data RT (52 RT)
6. Dapatkan API key Fonnte dari https://fonnte.com

### Langkah Deployment (Vercel)
```bash
# 1. Clone repo
git clone <repo-url>
cd si-manggis

# 2. Install dependencies
npm install

# 3. Setup environment variables di Vercel
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_KEY
# FONNTE_API_KEY
# FONNTE_WA_NUMBER
# AUTH_SECRET

# 4. Build
npm run build

# 5. Deploy
vercel deploy
```

### Local Development
```bash
npm run dev
# Buka http://localhost:3000

# Untuk testing WA webhook, gunakan ngrok:
ngrok http 3000
# Lalu set webhook URL di dashboard Fonnte
```

---

## 10. Konfigurasi Awal (First Setup)

### 1. Buat Akun Staff Admin
```sql
-- via Supabase SQL Editor
INSERT INTO staff (email, password, nama)
VALUES (
  'admin@kelurahan.go.id',
  -- password hash untuk 'password123' (bcrypt):
  '$2a$10$...',
  'Administrator'
);
```
Generate bcrypt hash: `node -e "console.log(require('bcryptjs').hashSync('password123', 10))"`

### 2. Setup Data RT
```sql
-- Insert data RT (52 RT)
INSERT INTO rt (nomor_rt, nama_ketua, no_wa_rt)
VALUES ('01', 'Nama Ketua RT 01', '6281234567890'),
       ('02', 'Nama Ketua RT 02', '6281234567891'),
       -- ... dst
       ('52', 'Nama Ketua RT 52', '6281234567840');
```

### 3. Setup Artikel Awal
Masuk ke dashboard → Artikel → Tambah artikel untuk konten awal.

### 4. Konfigurasi Homepage
Masuk ke dashboard → Homepage → Sesuaikan section sesuai kebutuhan.

---

## 11. Troubleshooting Umum

### WA tidak terkirim
- Cek `FONNTE_API_KEY` dan `FONNTE_WA_NUMBER` di environment
- Cek logs di `/api/fonnte/webhook` atau di dashboard Fonnte
- Pastikan nomor RT valid dan format: `628xxxxxxxxxx`

### RT tidak bisa approve via WA
- Pastikan format balasan persis: `SETUJU` atau `TOLAK [alasan]`
- Tidak boleh ada spasi ekstra di depan/belakang
- Cek apakah webhook `/api/fonnte/webhook` bisa diakses dari internet (gunakan ngrok untuk testing lokal)

### Staff tidak bisa login
- Cek apakah email ada di tabel `staff`
- Cek apakah password sudah di-hash dengan bcrypt
- Cek `AUTH_SECRET` di environment

### Tidak bisa akses dashboard
- Pastikan sudah login via `/login`
- Middleware redirect ke `/login` jika belum auth

---

## 12. Catatan untuk Teknis

### Keamanan (Security Notes)
1. **Public POST routes** tidak memiliki rate limiting — potensi spam
2. **Fonnte webhook** tidak ada signature verification — relies on phone matching
3. **Service key** di `supabase.ts` membuat RLS tidak efektif untuk API routes
4. Tidak ada input sanitization untuk text fields
5. Tidak ada CSRF token validation pada public forms

### Rekomendasi Perbaikan (Future Work)
1. Tambahkan rate limiting pada endpoint publik
2. Verifikasi signature webhook Fonnte
3. Implementasikan RLS dengan benar (pisahkan client vs server supabase)
4. Tambahkan validasi input yang lebih ketat
5. Tambahkan audit log untuk semua perubahan data

### Teknologi yang Bisa Ditambahkan
1. **Email notification** (nodemailer/resend) sebagai backup WA
2. **File upload** untuk lampiran permohonan
3. **Export laporan** (PDF/Excel) untuk staff
4. **Analytics dashboard** untuk melihat statistik permohonan
5. **Multi-language** (ID + EN) jika diperlukan

---

## 13. Kontak & Dukungan

Untuk pertanyaan teknis tentang sistem ini, hubungi developer yang membuat.

### Informasi Wilayah
- **Website**: https://guntungkelurahan.go.id (placeholder)
- **Alamat**: Kelurahan Guntungan Manggis, Kec. Landasan Ulin, Kota Banjarbaru, Kalimantan Selatan 70724
- **Kode Wilayah**: 63.72.02.1005

---

*Dokumentasi ini dibuat untuk keperluan handover sistem kepada operator baru.*
*Untuk pertanyaan teknis, silakan hubungi developer.*