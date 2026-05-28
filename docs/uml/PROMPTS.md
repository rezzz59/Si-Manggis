# Prompt untuk Generate 10 Diagram UML — Si-Manggis

Berikut context lengkap sistem dan prompt untuk masing-masing diagram.
Copy-paste bagian yang kamu butuhkan sesuai diagram yang mau di-generate.

---

## Context Sistem: Si-Manggis

**Si-Manggis** adalah portal layanan digital desa untuk Kelurahan Guntungan Manggis,
dibangun dengan Next.js + Supabase (PostgreSQL + Storage + Auth).

### Aktor dalam Sistem

| Aktor | Peran | Cara Login |
|---|---|---|
| **Warga** | Kirim permohonan & pengaduan | Tanpa login (publik) |
| **RT (Ketua RT)** | Terima notifikasi WA, setujui/tolak permohonan | Tanpa login (via WhatsApp) |
| **Staff Kelurahan** | Proses permohonan & pengaduan | Login email/password via NextAuth |
| **Admin Website** | Kelola artikel, homepage, aset | Login email/password via NextAuth |

### Alur Permohonan (Surat/Layanan)

1. Warga submit form di `/layanan` → POST `/api/permohonan`
2. Sistem generate tiket unik (format: alfanumerik 8 karakter)
3. Sistem kirim WA notifikasi ke RT terkait via Fonnte API
4. RT menerima WA, baca detail permohonan
5. RT balas "SETUJU" atau "TOLAK [alasan]" via WhatsApp
6. Fonnte webhook (`/api/fonnte/webhook`) terima balasan
7. Sistem update status permohonan:
   - SETUJU → `DISETUJAI_RT` → notifikasi ke Kelurahan
   - TOLAK → `DITOLAK_RT`
8. Staff Kelurahan proses di dashboard → ubah status `DIPROSES` → `SELESAI`
9. Warga cek status di `/cek-tiket` dengan memasukkan nomor tiket

### Alur Pengaduan

1. Warga submit form pengaduan → POST `/api/pengaduan`
2. Sistem simpan dengan status `MENUNGGU`, generate tiket
3. Staff Kelurahan lihat pengaduan di dashboard
4. Staff ubah status → `DIPROSES` atau `DITOLAK`
5. Warga cek status via `/cek-tiket`

### Status Permohonan

```
MENUNGGU → DISETUJAI_RT → DIPROSES → SELESAI
              ↓
         DITOLAK_RT ──────→ DITOLAK
```

### Status Pengaduan

```
MENUNGGU → DIPROSES → SELESAI
              ↓
         DITOLAK
```

### Database Tables

- **staff** — id, email, password (bcrypt), nama
- **rt** — id, nomor_rt, nama_ketua, no_wa_rt, rw_id
- **permohonan** — id, tiket, nama, nik, alamat, telepon, layanan, sub_layanan, deskripsi, status, catatan, nomor_rt, rt_approved_at, rt_approved_via, kelurahan_approved_at, surat_url, lampiran_url[], created_at
- **pengaduan** — id, tiket, nama, telepon, email, topik, pesan, status, created_at
- **laporan_status_log** — id, laporan_id, from_status, to_status, changed_by, changed_at, note
- **artikel** — id, judul, slug, excerpt, konten, gambar_url, kategori, penulis, tgl_publish, is_featured, is_published
- **website_assets** — id, filename, storage_url, category, alt_text, caption, is_active, sort_order
- **homepage_config** — id, section, config (JSONB)

### API Endpoints

- `GET/POST /api/permohonan` — LIST (auth), CREATE (publik)
- `GET/PATCH /api/permohonan/[id]` — DETAIL (auth), UPDATE (auth)
- `GET/POST /api/pengaduan` — LIST (auth), CREATE (publik)
- `GET/PATCH /api/pengaduan/[id]` — DETAIL (auth), UPDATE (auth)
- `GET /api/cek-tiket/[tiket]` — Publik, lookup tiket
- `GET /api/rt` — Daftar RT (publik)
- `POST /api/fonnte/webhook` — Fonnte inbound WA webhook
- `POST /api/fonnte/send` — Kirim WA (admin)
- `GET/POST /api/artikel` — Artikel (public GET, admin POST)
- `GET/POST /api/assets` — Aset website (admin write)
- `GET/PATCH /api/homepage` — Konfigurasi homepage (admin write)

### Tech Stack

- Frontend: Next.js 16 (App Router), Tailwind CSS v4, Lucide icons
- Backend: Next.js API Routes (Route Handlers)
- Database: Supabase PostgreSQL
- Auth: NextAuth v5 (Credentials provider, JWT strategy)
- External: Fonnte WhatsApp API
- Storage: Supabase Storage (bucket: website-assets)

---

## PROMPTS UNTUK MASING-MASING DIAGRAM

Gunakan prompt di bawah ini sesuai diagram yang kamu mau generate.
Untuk tool diagram, gunakan PlantUML. Paste ke https://www.plantuml.com/plantuml/uml/

---

### 01 — Use Case Diagram

```
Buatkan Use Case Diagram untuk sistem portal layanan desa digital "Si-Manggis".

AKTOR:
1. Warga — bisa: Submit Permohonan, Submit Pengaduan, Cek Status Tiket
2. RT (Ketua RT) — bisa: Terima Notifikasi WA, Setujui Permohonan, Tolak Permohonan
3. Staff Kelurahan — bisa: Login Dashboard, Lihat Daftar Permohonan, Proses Permohonan, Lihat Daftar Pengaduan, Proses Pengaduan, Update Status
4. Admin Website — bisa: Login Dashboard, Kelola Artikel, Kelola Homepage, Upload Aset

USE CASES:
- Submit Permohonan Layanan
- Submit Pengaduan Warga
- Cek Status Tiket
- Terima Notifikasi WA (RT)
- Setujui Permohonan via WA
- Tolak Permohonan via WA
- Login ke Dashboard
- Kelola Permohonan (view + update status)
- Kelola Pengaduan (view + update status)
- Kelola Artikel
- Kelola Homepage
- Upload & Kelola Aset Website

SYSTEM BOUNDARY: "Sistem Si-Manggis"

Tolong buatkan dalam format PlantUML.
```

---

### 02 — Activity Diagram: Alur Permohonan

```
Buatkan Activity Diagram (Swimlane) untuk alur lengkap permohonan surat/layanan
pada sistem portal desa "Si-Manggis".

SWIMLANES (kolom):
1. Warga
2. Sistem Si-Manggis
3. RT (Ketua RT)
4. Staff Kelurahan

ACTIVITY FLOW:
1. Warga mengisi form permohonan di /layanan (nama, NIK, alamat, telepon, jenis layanan, nomor RT)
2. Sistem generate tiket unik dan simpan permohonan dengan status "MENUNGGU"
3. Sistem kirim WA notifikasi ke RT terkait via Fonnte API
4. RT terima WA, baca detail permohonan
5. RT mempertimbangkan approve atau tolak
6. Decision: RT menyetujui atau menolak?
   → SETUJU: RT balas "SETUJU" via WA
   → TOLAK: RT balas "TOLAK [alasan]" via WA
7. Fonnte webhook terima balasan dari RT
8. Sistem update status: "DISETUJAI_RT" atau "DITOLAK_RT"
9. Jika disetujui, sistem kirim notifikasi ke Staff Kelurahan via WA
10. Staff Kelurahan login ke dashboard, lihat permohonan yang sudah disetujui RT
11. Staff proses permohonan, ubah status → "DIPROSES"
12. Staff selesaikan permohonan, ubah status → "SELESAI"
13. Warga cek status di /cek-tiket dengan nomor tiket

Tolong buatkan dalam format PlantUML.
```

---

### 03 — Sequence Diagram: Permohonan

```
Buatkan Sequence Diagram untuk alur permohonan surat/layanan
pada sistem portal desa "Si-Manggis".

PARTICIPANTS (dari kiri ke kanan):
1. Warga
2. Frontend (/layanan)
3. API Route (/api/permohonan)
4. Supabase DB (permohonan table)
5. Fonnte WA API
6. RT (WhatsApp)
7. Fonnte Webhook (/api/fonnte/webhook)
8. Staff Kelurahan
9. Dashboard Frontend

SEQUENCE:
1. Warga → Frontend: Submit form permohonan (nama, NIK, alamat, telepon, jenis, nomor_rt)
2. Frontend → API Route: POST /api/permohonan (JSON body)
3. API Route → Supabase DB: INSERT permohonan (status=MENUNGGU, generate tiket)
4. Supabase DB → API Route: Return created data
5. API Route → Fonnte WA API: sendFonnteWA({target: no_wa_rt RT, message: detail permohonan})
6. Fonnte WA API → RT: WhatsApp message
7. RT → Fonnte WA API: Balas "SETUJU" via WhatsApp
8. Fonnte WA API → Fonnte Webhook: POST /api/fonnte/webhook ({from, message})
9. Fonnte Webhook → Supabase DB: UPDATE permohonan SET status='DISETUJAI_RT' WHERE nomor_rt=RT
10. Fonnte Webhook → Fonnte WA API: Kirim notifikasi ke Staff Kelurahan
11. Fonnte WA API → Staff Kelurahan: WhatsApp notification
12. Staff Kelurahan → Dashboard Frontend: Login → Buka halaman permohonan
13. Dashboard Frontend → API Route: GET /api/permohonan
14. API Route → Supabase DB: SELECT permohonan WHERE status='DISETUJAI_RT'
15. Supabase DB → API Route: Return data
16. API Route → Dashboard Frontend: {data: [...], total}
17. Staff Kelurahan → Dashboard Frontend: Ubah status → DIPROSES → SELESAI
18. Dashboard Frontend → API Route: PATCH /api/permohonan/[id] {status: 'SELESAI'}
19. Warga → Frontend: Cek tiket di /cek-tiket
20. Frontend → API Route: GET /api/cek-tiket/[tiket]
21. API Route → Supabase DB: SELECT WHERE tiket = X
22. Supabase DB → API Route: Return status
23. Frontend → Warga: Display status permohonan

Tolong buatkan dalam format PlantUML.
```

---

### 04 — Activity Diagram: Alur Pengaduan

```
Buatkan Activity Diagram (Swimlane) untuk alur lengkap pengaduan warga
pada sistem portal desa "Si-Manggis".

SWIMLANES:
1. Warga
2. Sistem Si-Manggis
3. Staff Kelurahan

ACTIVITY FLOW:
1. Warga mengisi form pengaduan di halaman pengaduan (nama, telepon, email, topik, pesan)
2. Sistem validasi field wajib (nama, topik, pesan)
3. Sistem generate tiket unik
4. Sistem simpan pengaduan dengan status "MENUNGGU"
5. Staff Kelurahan login ke dashboard
6. Staff buka halaman daftar pengaduan
7. Staff pilih pengaduan untuk diproses
8. Decision: Staff approve atau tolak?
   → Proses: Staff ubah status → "DIPROSES"
   → Tolak: Staff ubah status → "DITOLAK" + catatan alasan
9. Jika diproses, staff selesaikan → ubah status → "SELESAI"
10. Warga cek status di /cek-tiket dengan nomor tiket

Tolong buatkan dalam format PlantUML.
```

---

### 05 — Sequence Diagram: Pengaduan

```
Buatkan Sequence Diagram untuk alur lengkap pengaduan warga
pada sistem portal desa "Si-Manggis".

PARTICIPANTS:
1. Warga
2. Frontend (halaman pengaduan)
3. API Route (/api/pengaduan)
4. Supabase DB (pengaduan table)
5. Staff Kelurahan
6. Dashboard Frontend

SEQUENCE:
1. Warga → Frontend: Submit form pengaduan (nama, telepon, email, topik, pesan)
2. Frontend → API Route: POST /api/pengaduan (JSON body)
3. API Route → Supabase DB: INSERT pengaduan (status='MENUNGGU', generate tiket)
4. Supabase DB → API Route: Return created data with tiket
5. API Route → Frontend: {data: {tiket: 'XYZ123'}, status: 201}
6. Frontend → Warga: Tampilkan konfirmasi dengan nomor tiket
7. Staff Kelurahan → Dashboard Frontend: Login
8. Dashboard Frontend → API Route: GET /api/pengaduan
9. API Route → Supabase DB: SELECT * FROM pengaduan ORDER BY createdat DESC
10. Supabase DB → API Route: Return list pengaduan
11. API Route → Dashboard Frontend: {data: [...], total}
12. Dashboard Frontend → Staff Kelurahan: Display daftar pengaduan
13. Staff Kelurahan → Dashboard Frontend: Pilih pengaduan untuk diproses
14. Dashboard Frontend → API Route: GET /api/pengaduan/[id]
15. API Route → Supabase DB: SELECT * FROM pengaduan WHERE id = X
16. Supabase DB → API Route: Return pengaduan detail
17. Staff Kelurahan → Dashboard Frontend: Update status → DIPROSES/SELESAI/DITOLAK
18. Dashboard Frontend → API Route: PATCH /api/pengaduan/[id] {status: 'SELESAI', catatan: '...'}
19. API Route → Supabase DB: UPDATE pengaduan SET status='SELESAI' WHERE id=X
20. Warga → Frontend: Cek tiket di /cek-tiket
21. Frontend → API Route: GET /api/cek-tiket/[tiket]
22. API Route → Supabase DB: SELECT WHERE tiket=X (cek permohonan dulu, lalu pengaduan)
23. Supabase DB → API Route: Return data
24. Frontend → Warga: Display status pengaduan

Tolong buatkan dalam format PlantUML.
```

---

### 06 — Class / Entity Relationship Diagram (Database Schema)

```
Buatkan Class Diagram / ER Diagram untuk database sistem portal desa "Si-Manggis"
menggunakan Supabase PostgreSQL.

ENTITIES (tables):

1. staff
   - id: UUID (PK)
   - email: VARCHAR (unique)
   - password: VARCHAR (bcrypt hash)
   - nama: VARCHAR
   - created_at: TIMESTAMPTZ
   - updated_at: TIMESTAMPTZ

2. rt
   - id: UUID (PK)
   - nomor_rt: VARCHAR (unique, format "01"-"52")
   - nama_ketua: VARCHAR
   - no_wa_rt: VARCHAR (nullable)
   - rw_id: VARCHAR (nullable)
   - created_at: TIMESTAMPTZ
   - updated_at: TIMESTAMPTZ

3. permohonan
   - id: UUID (PK)
   - tiket: VARCHAR (unique, auto-generated)
   - nama: VARCHAR
   - nik: VARCHAR (nullable)
   - alamat: TEXT
   - telepon: VARCHAR
   - layanan: VARCHAR
   - sub_layanan: VARCHAR (nullable)
   - deskripsi: TEXT (nullable)
   - nomor_rt: VARCHAR (FK → rt.nomor_rt)
   - status: VARCHAR (MENUNGGU, DISETUJAI_RT, DITOLAK_RT, DIPROSES, SELESAI, DITOLAK)
   - catatan: TEXT (nullable)
   - lampiran_url: TEXT[] (nullable)
   - fonnte_msg_id: VARCHAR (nullable)
   - rt_approved_at: TIMESTAMPTZ (nullable)
   - rt_approved_via: VARCHAR (nullable)
   - kelurahan_approved_at: TIMESTAMPTZ (nullable)
   - surat_url: VARCHAR (nullable)
   - created_at: TIMESTAMPTZ
   - updated_at: TIMESTAMPTZ

4. pengaduan
   - id: UUID (PK)
   - tiket: VARCHAR (unique)
   - nama: VARCHAR
   - telepon: VARCHAR
   - email: VARCHAR (nullable)
   - topik: VARCHAR
   - pesan: TEXT
   - status: VARCHAR (MENUNGGU, DIPROSES, SELESAI, DITOLAK)
   - created_at: TIMESTAMPTZ
   - updated_at: TIMESTAMPTZ

5. laporan_status_log
   - id: UUID (PK)
   - laporan_id: UUID (FK → permohonan.id)
   - from_status: VARCHAR
   - to_status: VARCHAR
   - changed_by: VARCHAR
   - changed_at: TIMESTAMPTZ
   - note: TEXT (nullable)

6. artikel
   - id: UUID (PK)
   - judul: VARCHAR
   - slug: VARCHAR (unique)
   - excerpt: TEXT (nullable)
   - konten: TEXT
   - gambar_url: VARCHAR (nullable)
   - kategori: VARCHAR
   - penulis: VARCHAR
   - tgl_publish: TIMESTAMPTZ
   - is_featured: BOOLEAN
   - is_published: BOOLEAN
   - created_at: TIMESTAMPTZ
   - updated_at: TIMESTAMPTZ

7. website_assets
   - id: UUID (PK)
   - filename: VARCHAR
   - storage_url: VARCHAR
   - category: VARCHAR
   - alt_text: VARCHAR
   - caption: TEXT (nullable)
   - is_active: BOOLEAN
   - sort_order: INTEGER
   - metadata: JSONB (nullable)
   - created_by: UUID (FK → staff.id)
   - created_at: TIMESTAMPTZ
   - updated_at: TIMESTAMPTZ

8. homepage_config
   - id: UUID (PK)
   - section: VARCHAR (unique: hero, stat_bar, berita_featured, program_unggulan, footer)
   - config: JSONB
   - updated_at: TIMESTAMPTZ

RELASI:
- permohonan.nomor_rt → rt.nomor_rt (many-to-one)
- laporan_status_log.laporan_id → permohonan.id (many-to-one)
- website_assets.created_by → staff.id (many-to-one)

Tolong buatkan dalam format PlantUML. Gunakan notation yang jelas untuk primary keys, foreign keys, dan relasi.
```

---

### 07 — State Machine Diagram (Status)

```
Buatkan State Machine Diagram untuk alur status permohonan dan pengaduan
pada sistem portal desa "Si-Manggis".

STATE MACHINE 1 — PERMOHONAN:
States:
- MENUNGGU (initial state setelah warga submit)
- DISETUJAI_RT (RT menekan SETUJU via WA)
- DITOLAK_RT (RT menekan TOLAK via WA)
- DIPROSES (Staff Kelurahan sedang memproses)
- SELESAI (final — permohonan selesai diproses)
- DITOLAK (final — permohonan ditolak)

Transitions:
- MENUNGGU → DISETUJAI_RT : RT setujui via WA webhook
- MENUNGGU → DITOLAK_RT : RT tolak via WA webhook
- DISETUJAI_RT → DIPROSES : Staff Kelurahan mulai proses
- DIPROSES → SELESAI : Staff Kelurahan selesaikan
- DIPROSES → DITOLAK : Staff Kelurahan tolak permohonan
- DITOLAK_RT → DIPROSES : Staff override (opsional)
- DISETUJAI_RT → DITOLAK : Staff tolak (override RT)

STATE MACHINE 2 — PENGADUAN:
States:
- MENUNGGU (initial state setelah warga submit)
- DIPROSES (Staff Kelurahan sedang memproses)
- SELESAI (final — pengaduan resolved)
- DITOLAK (final — pengaduan ditolak)

Transitions:
- MENUNGGU → DIPROSES : Staff Kelurahan proses
- MENUNGGU → DITOLAK : Staff Kelurahan tolak
- DIPROSES → SELESAI : Staff selesaikan
- DIPROSES → DITOLAK : Staff tolak

Tolong buatkan dalam format PlantUML, 2 diagram terpisah dalam satu file (oleh PlantUML split).
```

---

### 08 — Component Architecture Diagram

```
Buatkan Component Diagram untuk arsitektur sistem portal desa "Si-Manggis".

KOMPONEN & STRUKTUR:

LAYER PRESENTATION (Frontend):
- Component: Web Browser (React 19, Next.js 16)
  - Sub: Navbar, Layout
  - Sub: Pages (/, /layanan, /pengaduan, /cek-tiket, /artikel, /login, /dashboard/*)
  - Sub: Forms (PermohonanForm, PengaduanForm)
  - Sub: Dashboard Components (TableList, StatusBadge, ActionButton)

LAYER APPLICATION (API Routes):
- Component: Next.js API Routes
  - /api/permohonan/route.ts (GET list, POST create)
  - /api/permohonan/[id]/route.ts (GET, PATCH)
  - /api/pengaduan/route.ts (GET list, POST create)
  - /api/pengaduan/[id]/route.ts (GET, PATCH)
  - /api/cek-tiket/[tiket]/route.ts (GET public lookup)
  - /api/rt/route.ts (GET daftar RT)
  - /api/fonnte/webhook/route.ts (POST inbound WA)
  - /api/fonnte/send/route.ts (POST send WA)
  - /api/artikel/route.ts (GET list, POST create)
  - /api/assets/route.ts (GET list, POST upload)
  - /api/homepage/route.ts (GET, PUT config)
- Component: NextAuth.js v5
  - /api/auth/[...nextauth]/route.ts
  - Middleware (edge protection)

LAYER DATA / SERVICE:
- Component: Supabase Client
  - supabase.ts (user-facing, service key)
  - supabase-admin.ts (admin bypass)
- Component: Supabase Services
  - PostgreSQL Database (tables: staff, rt, permohonan, pengaduan, artikel, website_assets, homepage_config, laporan_status_log)
  - Supabase Storage (bucket: website-assets)
  - Auth (NextAuth JWT sessions)
- Component: External Services
  - Fonnte WhatsApp API (send + webhook)
  - bcryptjs (password hashing)

DATA FLOW:
- Warga ↔ Web Browser ↔ API Routes ↔ Supabase DB
- RT ↔ Fonnte WA ↔ Webhook API ↔ Supabase DB
- Staff ↔ Dashboard ↔ API Routes (auth) ↔ Supabase DB

Tolong buatkan dalam format PlantUML.
```

---

### 09 — Business Process Overview Diagram

```
Buatkan Business Process Diagram (BPMN-style activity diagram)
untuk menggambarkan overview proses bisnis sistem portal desa "Si-Manggis"
dari perspektif seluruh aktor.

PROCESS: "Layanan Digital Desa Guntungan Manggis"

POOL 1 — WARGA:
- Submit Permohonan Layanan (isian: nama, NIK, alamat, telepon, jenis layanan, RT tujuan)
- Submit Pengaduan (isian: nama, telepon/email, topik, pesan)
- Lacak Status (masukkan nomor tiket, lihat status permohonan/pengaduan)

POOL 2 — RT (Ketua RT):
- Terima Notifikasi WA dari Sistem (detail permohonan masuk)
- Review Permohonan (cek kelengkapan data)
- Decision: Setujui atau Tolak?
  - SETUJU: Kirim balasan "SETUJU" via WA
  - TOLAK: Kirim balasan "TOLAK [alasan]" via WA
- Selesai (tidak perlu login ke sistem)

POOL 3 — STAFF KELURAHAN:
- Login ke Dashboard (email + password)
- Review Permohonan baru (cek yang sudah di-approve RT)
- Decision: Proses atau Tolak?
  - Proses: Update status → "DIPROSES"
  - Selesai: Update status → "SELESAI", generate surat jika perlu
  - Tolak: Update status → "DITOLAK", isi catatan penolakan
- Review Pengaduan baru
- Decision: Proses pengaduan?
  - Proses: Update status → "DIPROSES" → "SELESAI"
  - Tolak: Update status → "DITOLAK"
- Export / laporan data permohonan/pengaduan

POOL 4 — ADMIN WEBSITE:
- Login ke Dashboard
- Kelola Artikel (CRUD berita/artikel)
- Kelola Homepage (edit section config)
- Upload & Kelola Aset Website (gambar, dokumen)

Tolong buatkan dalam format PlantUML dengan swimlane yang jelas untuk setiap pool.
```

---

### 10 — Security & Authorization Matrix Diagram

```
Buatkan Security & Authorization Matrix untuk sistem portal desa "Si-Manggis".
Buatkan dalam bentuk tabel matriks yang menunjukkan:
- ROWS: API Endpoint + Page
- COLUMNS: Actor (Warga, RT, Staff Kelurahan, Admin)
- CELLS: Auth requirement, what data they can access

MATRIX:

Endpoint/Page | Warga | RT | Staff | Admin
---|---|---|---|---
GET /api/permohonan | ❌ 401 | ❌ 401 | ✅ auth, all data | ✅ auth, all data
POST /api/permohonan | ✅ public | ❌ | ❌ | ❌
GET /api/permohonan/[id] | ❌ 401 | ❌ 401 | ✅ own data | ✅ all data
PATCH /api/permohonan/[id] | ❌ 401 | ❌ 401 | ✅ auth | ✅ auth
GET /api/pengaduan | ❌ 401 | ❌ 401 | ✅ auth | ✅ auth
POST /api/pengaduan | ✅ public | ❌ | ❌ | ❌
GET /api/pengaduan/[id] | ❌ 401 | ❌ 401 | ✅ auth | ✅ auth
PATCH /api/pengaduan/[id] | ❌ 401 | ❌ 401 | ✅ auth | ✅ auth
GET /api/cek-tiket/[tiket] | ✅ public | ✅ public | ✅ | ✅
GET /api/rt | ✅ public | ✅ public | ✅ | ✅
POST /api/fonnte/webhook | ✅ (phone match) | ✅ | ❌ | ❌
POST /api/fonnte/send | ❌ env token | ❌ | ❌ | ✅ auth
GET /api/artikel | ✅ public | ✅ | ✅ | ✅
POST /api/artikel | ❌ 401 | ❌ | ❌ | ✅ auth
GET/POST /api/assets | ✅ public read | ✅ | ✅ | ✅ auth write
GET/PUT /api/homepage | ✅ public read | ✅ | ✅ | ✅ auth write
/dashboard/* | ❌ redirect | ❌ redirect | ✅ auth | ✅ auth
/login | ✅ public | ✅ public | ✅ public | ✅ public
/layanan | ✅ public | ✅ | ✅ | ✅
/pengaduan | ✅ public | ✅ | ✅ | ✅
/cek-tiket | ✅ public | ✅ | ✅ | ✅

SECURITY NOTES yang perlu ditunjukkan:
1. Public POST routes tidak memiliki rate limiting → potential spam/DoS
2. Fonnte webhook tidak ada signature verification → relies on phone matching
3. supabase.ts menggunakan SUPABASE_SERVICE_KEY → RLS efektif tidak berjalan
4. Tidak ada input sanitization untuk text fields (topik, pesan, deskripsi)
5. Tidak ada CSRF token validation pada public forms

Tolong buatkan dalam format PlantUML. Gunakan bentuk tabel yang jelas.
Kirim juga explanation singkat untuk setiap security gap.
```

---

## Cara Pakai

1. Buka https://www.plantuml.com/plantuml/uml/
2. Paste prompt yang kamu butuhkan
3. Klik "Submit" → download PNG-nya
4. Atau install PlantUML di lokal: `sudo apt install plantuml`, lalu `plantuml diagram.puml`

Atau kalau pakai AI lain (ChatGPT, Claude, Gemini), tinggal kirimkan semua context
dan prompt yang kamu butuhkan. Context di atas sudah cukup lengkap untuk
generate diagram yang akurat.