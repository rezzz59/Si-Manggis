# Desain Backend Si-Manggis — Fase 1

**Tanggal:** 2026-04-17
**Fase:** 1 — Autentikasi Staff + Cek Tiket Warga
**Stack:** Next.js 16 (App Router), Prisma + SQLite, NextAuth.js (Auth.js)

---

## 1. Goals

- Staff desa bisa login dan mengelola permohonan/pengaduan warga via dashboard.
- Warga bisa mengecek status permohonan atau pengaduan cukup dengan nomor tiket — tanpa login.
- Nomor tiket format `SM-2026-XXXXXX` (6 digit acak).

---

## 2. Database Schema (Prisma)

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Staff {
  id        String   @id @default(cuid())
  email     String   @unique
  nama      String
  password  String   // bcrypt hashed
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Permohonan {
  id        String   @id @default(cuid())
  tiket     String   @unique // format: SM-2026-XXXXXX
  nama      String
  nik       String?
  alamat    String
  layanan   String   // referensi ke dataLayanan
  keperluan String
  telepon   String
  status    String   @default("MENUNGGU") // MENUNGGU | DIPROSES | SELESAI | DITOLAK
  catatan   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Pengaduan {
  id        String   @id @default(cuid())
  tiket     String   @unique // format: SM-2026-XXXXXX
  nama      String
  telepon   String?
  email     String?
  topik     String
  pesan     String
  status    String   @default("MENUNGGU") // MENUNGGU | DIPROSES | SELESAI | DITOLAK
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 3. Auth Strategy

### Staff — NextAuth.js (Credentials Provider)

- Login via email + password (bcrypt).
- Session menggunakan JWT strategy.
- Protected routes: semua route di `/dashboard` dan `/api/permohonan`, `/api/pengaduan`.
- Middleware: Next.js middleware untuk proteksi route `/dashboard/*`.

### Warga — Tanpa Login

- Warga membuka `/cek-tiket`.
- Input nomor tiket → lihat status permohonan atau pengaduan.
- Tidak ada session, tidak ada akun.

---

## 4. API Endpoints

### Staff (Protected — butuh login staff)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/permohonan` | List semua permohonan (paginated, filter status) |
| GET | `/api/permohonan/[id]` | Detail permohonan |
| PATCH | `/api/permohonan/[id]` | Update status / catatan |
| GET | `/api/pengaduan` | List semua pengaduan |
| PATCH | `/api/pengaduan/[id]` | Update status |
| POST | `/api/auth/[...nextauth]` | Autentikasi NextAuth |

### Warga (Public — tanpa auth)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/cek-tiket/[tiket]` | Cari permohonan atau pengaduan berdasarkan nomor tiket |

---

## 5. Components

### Staff Side

- `/app/dashboard/layout.tsx` — shell layout dengan sidebar navigasi
- `/app/dashboard/page.tsx` — halaman utama: ringkasan permohonan & pengaduan terbaru
- `/app/dashboard/permohonan/page.tsx` — tabel list permohonan (filter status)
- `/app/dashboard/permohonan/[id]/page.tsx` — detail + form update status
- `/app/dashboard/pengaduan/page.tsx` — tabel list pengaduan
- `/app/dashboard/pengaduan/[id]/page.tsx` — detail + form update status
- `/app/api/auth/[...nextauth]/route.ts` — NextAuth handler
- `/app/api/permohonan/route.ts` — CRUD permohonan
- `/app/api/pengaduan/route.ts` — CRUD pengaduan
- `/app/api/cek-tiket/[tiket]/route.ts` — cek tiket warga

### Warga Side

- `/app/cek-tiket/page.tsx` — halaman publik, input nomor tiket
- `/app/cek-tiket/[tiket]/page.tsx` — hasil pencarian tiket

---

## 6. Seed Data

Staff default:
- Email: `admin@desaguntingmanggis.id`
- Password: `staff2026` (untuk demo — diubah di production)

---

## 7. Error Handling

- API return HTTP status code standar (200, 400, 401, 404, 500).
- Error response: `{ error: string, message: string }`.
- Tiket tidak ditemukan: 404 dengan message "Tiket tidak ditemukan".

---

## 8. Out of Scope (Fase 1)

- Registrasi staff baru dari UI.
- Export laporan (PDF/Excel).
- Notifikasi WhatsApp/email ke warga.
- Dashboard warga dengan login.
- Edit/hapus permohonan/pengaduan oleh staff.

---

## 9. Deployment Notes

- `DATABASE_URL` di `.env` menunjuk ke file SQLite lokal: `file:./dev.db`.
- Untuk production, migrate ke PostgreSQL dengan mengubah `provider` di `schema.prisma`.
