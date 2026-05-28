# Alur End-to-End Si-Manggis

> Disimpan 2026-05-27. baseline alur yang sudah区 ada.

---

## Alur Permohonan (Canonical)

```
WARGA                    SISTEM                    RT                      STAFF KELURAHAN
  │                          │                       │                          │
  │  1. Submit form          │                       │                          │
  │  (nama, nik, alamat,     │                       │                          │
  │   telepon, jenis,        │                       │                          │
  │   sub_jenis, deskripsi,  │                       │                          │
  │   nomor_rt)             │                       │                          │
  │ ───────────────────────►│                       │                          │
  │                         │                       │                          │
  │                    2. INSERT permohonan         │                          │
  │                       (status=MENUNGGU)         │                          │
  │                    3. Kirim WA ke RT ──────────────────────────────────────►
  │                       (detail permohonan,        │                          │
  │                        minta SETUJU/TOLAK)      │                          │
  │                         │                       │                          │
  │  4. Tiket number        │                       │                          │
  │ ◄───────────────────────│                       │                          │
  │                         │                       │                          │
  │                         │  5. RT reply WA        │                          │
  │                         │  (SETUJU / TOLAK) ───►│                          │
  │                         │                       │                          │
  │                         │                  6. Fonnte webhook               │
  │                         │                  (parse SETUJU/TOLAK,            │
  │                         │                   update status,               │
  │                         │                   log ke laporan_status_log,   │
  │                         │                   konfirmasi RT,               │
  │                         │                   notif KE KELURAHAN)           │
  │                         │                       │                          │
  │                         │                       │  7. WA notifikasi ke     │
  │                         │                       │  KELURAHAN_WA_NUMBER     │
  │                         │                       │ ◄─────────────────────────
  │                         │                       │                          │
  │                         │                  8. Staff lihat di dashboard    │
  │                         │                  9. Staff update status         │
  │                         │                  (DIPROSES → SELESAI)         │
  │                         │                       │                          │
  │ 10. Cek tiket            │                       │                          │
  │    (cek-tiket page)     │                       │                          │
  │ ───────────────────────►│                       │                          │
  │                         │ 11. Return status      │                          │
  │ ◄───────────────────────│                       │                          │
  │                         │                       │                          │
  │ 12. Dapat SELESAI       │                       │                          │
  │    (download surat_url) │                       │                          │
```

---

## State Machine Permohonan

```
MENUNGGU
    │
    ├──[RT SETUJU via WA]──► DISETUJAI_RT
    │                           │
    │                      [RT TOLAK via WA]
    │                           │
    └──[RT TOLAK via WA]──► DITOLAK_RT
                               │
                          [Staff proses]
                               │
                          [Staff SELESAI]
                               │
                          SELESAI
                               │
                          [Staff TOLAK manual]
                               │
                          DITOLAK
```

Status di DB: `MENUNGGU` | `DISETUJAI_RT` | `DITOLAK_RT` | `DIPROSES` | `SELESAI` | `DITOLAK`

---

## Alur Pengaduan

```
WARGA                    SISTEM                    STAFF KELURAHAN
  │                          │                          │
  │  1. Submit form          │                          │
  │  (nama, telepon, email,  │                          │
  │   topik, pesan)           │                          │
  │ ───────────────────────►│                          │
  │                         │  2. INSERT pengaduan       │
  │                         │     (status=DIPROSES)     │
  │                         │                          │
  │                         │  3. Staff lihat di        │
  │                         │     dashboard             │
  │                         │                          │
  │                         │  4. Staff update status  │
  │                         │     (SELESAI / DITOLAK)  │
  │                         │                          │
  │  5. Cek tiket            │                          │
  │ ───────────────────────►│                          │
  │ ◄───────────────────────│                          │
```

State machine pengaduan: `DIPROSES` → `SELESAI` | `DITOLAK`

---

## Halaman Public

| URL | Tujuan | Catatan |
|-----|--------|---------|
| `/layanan` | Form permohonan (form utama warga) | HARUS include RT dropdown |
| `/cek-tiket` | Cek status permohonan + pengaduan | Canonical, sudah ada |
| `/lacak` | Alias cek-tiket untuk permohonan | Redirect ke `/cek-tiket` |
| `/laporan` | Form laporan (duplikat) | Redirect ke `/layanan` |
| `/masuk` | Redirect /login | Hapus atau redirect /login |
| `/pengaduan` | Form pengaduan public | BELUM ADA — perlu dibuat |

---

## Halaman Dashboard (Staff)

| URL | Tujuan |
|-----|--------|
| `/dashboard` | Overview |
| `/dashboard/permohonan` | List permohonan |
| `/dashboard/permohonan/[id]` | Detail + update status permohonan |
| `/dashboard/pengaduan` | List pengaduan |
| `/dashboard/pengaduan/[id]` | Detail + update status pengaduan |
| `/dashboard/aset` | Kelola aset website |
| `/dashboard/homepage` | Konfigurasi homepage |

---

## Field Mapping

### Form Permohonan → API → DB

| Form Field | API body key | DB column | Status |
|-----------|-------------|-----------|--------|
| Nama | `nama` | `nama` | ✅ |
| NIK | `nik` | `nik` | ✅ (validasi 16 digit belum ada) |
| Alamat | `alamat` | `alamat` | ✅ |
| RT | `nomor_rt` | `nomor_rt` | ✅ |
| No. WA | `telepon` | `telepon` | ✅ |
| Jenis | `jenis` | `layanan` | ✅ |
| Sub Jenis | `sub_jenis` | `sub_layanan` | ✅ |
| Deskripsi/Keperluan | `deskripsi` | `deskripsi` | ⚠️ old form kirim `keperluan` ≠ `deskripsi` |
| — | — | `keperluan` | ❌ kolom tidak ada di DB |
| Keperluan (old) | `keperluan` | ❌وسع TABLE — hilang | Old form field `keperluan` tidak disimpan |

### Form Pengaduan → API → DB

| Form Field | API body key | DB column | Status |
|-----------|-------------|-----------|--------|
| Nama | `nama` | `nama` | ✅ |
| No. WA | `telepon` | `telepon` | ✅ |
| Email | `email` | `email` | ✅ |
| Topik | `topik` | `topik` | ✅ |
| Pesan | `pesan` | `pesan` | ✅ |

---

## Gap End-to-End

### Yang perlu diperbaiki agar flow jalan

| # | Gap | Severity | File |
|---|-----|----------|------|
| 1 | `/layanan` form tidak ada field `nomor_rt` — RT WA tidak pernah terpicu | CRITICAL | `app/layanan/page.tsx` |
| 2 | `/layanan` form kirim `keperluan` tapi DB column `deskripsi` — data hilang | HIGH | `app/layanan/page.tsx` |
| 3 | `/pengaduan` public form tidak ada | HIGH | perlu dibuat `app/pengaduan/page.tsx` |
| 4 | `PermohonanResult` (cek-tiket) tampilkan `keperluan` bukan `deskripsi` — kosong untuk submissions baru | MEDIUM | `app/cek-tiket/page.tsx` |
| 5 | `PermohonanResult` omits `DISETUJAI_RT` dari progress bar | MEDIUM | `app/cek-tiket/page.tsx` |
| 6 | `StatusTracker` tidak ada step untuk `DITOLAK` / `DITOLAK_RT` | MEDIUM | `src/components/StatusTracker.tsx` |
| 7 | WA notifikasi ke warga saat status berubah tidak ada | MEDIUM | `app/api/permohonan/[id]/route.ts` |
| 8 | `/lacak` hanya cek `permohonan`, tidak `pengaduan` | LOW | `app/lacak/page.tsx` |
| 9 | Duplicate pages belum di-cleanup | LOW | `/lacak`, `/laporan`, `/masuk` |

---

## Stage Progress (2026-05-28)

- [x] Phase 1 — `/layanan` consolidate form (FormLaporan integrated)
- [x] Phase 1 — `/laporan` redirects → `/layanan`
- [x] Phase 1 — `/lacak` redirects → `/cek-tiket`
- [x] Phase 1 — `/masuk` redirects → `/login`
- [ ] Phase 2 — `/pengaduan` public form (BELUM ADA)
- [ ] Phase 3 — Status tracker fixes (`DISETUJAI_RT` step, `deskripsi` display)
- [ ] Phase 3 — `StatusTracker` DITOLAK/DITOLAK_RT steps
- [ ] Phase 4 — WA notifikasi ke warga saat status berubah
- [ ] NIK validation 16 digit (API server-side)
- [ ] Security: webhook signature, RLS, RBAC

---

## Prioritas Pengerjaan

### Phase 1 — Form Canonical (ALUR JALAN)
1. Retrofit `/layanan` dengan field dari `FormLaporan` (`nomor_rt`, `sub_jenis`, `deskripsi`)
2. Buang field `keperluan` lama, pakai `deskripsi`
3. Redirect `/laporan` → `/layanan`

### Phase 2 — Public Pengaduan Form
4. Buat `/pengaduan` public form → `POST /api/pengaduan`
5. Redirect `/lacak` → `/cek-tiket`

### Phase 3 — Status Tracker Fixes
6. Fix `StatusTracker` → tampilkan semua status termasuk DITOLAK/DITOLAK_RT
7. Fix `PermohonanResult` di `/cek-tiket` → tampilkan `deskripsi`, `nomor_rt`, `sub_layanan`; perbaiki progress bar

### Phase 4 — Notifications
8. WA notifikasi ke warga saat status permohonan berubah (DISETUJAI_RT, DIPROSES, SELESAI, DITOLAK)

### Phase 5 — Cleanup
9. Hapus `/masuk` atau redirect ke `/login`
10. Rate limiting, keamanan webhook signature (Sprint 3)
