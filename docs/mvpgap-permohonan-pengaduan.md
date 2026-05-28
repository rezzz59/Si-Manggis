# MVP Gap Analysis — Alur Permohonan & Pengaduan

> Fokus: alur core MVP Si-Manggis. Disimpan 2026-05-27.

## Status Overall: MVP belum shippable

Keduanya sudah punya fondasi (tabel, API, form, webhook Fonnte), tapi ada **critical gaps** yang membuat belum bisa dipakai production.

---

## Alur Permohonan — Gap Analysis

### Yang Sudah Ada ✅
- Tabel `permohonan` lengkap (termasuk status fields, rt_approved_at, dll.)
- API `POST /api/permohonan` — generate tiket, simpan, trigger Fonnte WA ke RT
- API `PATCH /api/permohonan/[id]` — update status (staff)
- Frontend form `/layanan` dengan validasi dan redirect ke cek-tiket
- Webhook Fonnte `/api/fonnte` untuk terima balasan RT (SETUJU/TOLAK)
- Dashboard `/dashboard/permohonan` — list + update status
- State machine: MENUNGGU → DISETUJAI_RT → DIPROSES → SELESAI (ditolak branch)
- State machine diagram UML ✅

### Yang Belum / Belum Maksimal ❌

#### 🚨 CRITICAL (MVP blocker)

1. **Webhook Fonnte tidak jalan** — `src/app/api/fonnte/route.ts` tidak ada. Fonnte webhook ada di `src/app/api/fonnte/webhook/route.ts` — perlu dicek apakah ini benar di-hit oleh Fonnte.

2. **RT lookup by nomor_rt belum ada** — `src/app/api/rt/route.ts` perlu dicek apakah return data RT lengkap (nama_ketua, no_wa_rt) supaya form bisa show nama RT.

3. **Nomer RT tidak divalidasi ada di tabel RT** — form accept sembarang RT number.

4. **Notifikasi WA ke warga saat status berubah** — di state machine ada notifikasi WA ke warga saat SELESAI, tapi belum ada di code.

5. **Notifikasi WA ke Staff Kelurahan saat RT menyetujui** — di sequence diagram step 28 ada, tapi perlu dicek.

#### ⚠️ HIGH (membuat MVP tidak可信)

6. **Tidak ada NIK validation** — NIK harus 16 digit, belum divalidasi.

7. **No rate limiting pada endpoint publik** — potensi spam permohonan.

8. **Tidak ada audit trail** (`laporan_status_log`) — tidak ada log perubahan status permohonan.

9. **Duplicate pages** — `/cek-tiket` dan `/lacak` duplikat fungsional.

---

## Alur Pengaduan — Gap Analysis

### Yang Sudah Ada ✅
- Tabel `pengaduan` dengan field lengkap
- API `POST /api/pengaduan` — generate tiket, simpan
- API `PATCH /api/pengaduan/[id]` — update status
- Frontend form `/pengaduan`
- Dashboard `/dashboard/pengaduan` — list + update status
- State machine: MENUNGGU → DIPROSES → SELESAI / DITOLAK
- State machine diagram UML ✅

### Yang Belum / Belum Maksimal ❌

#### 🚨 CRITICAL

1. **No RT assignment** — pengaduan tidak ada kolom `nomor_rt`, padahal sequence diagram menunjukkan notifikasi ke RT juga ada.

2. **Notifikasi WA ke pelapor saat status berubah** — tidak ada.

3. **Tidak ada audit trail** (`laporan_status_log`) — pengaduan tidak punya log perubahan status.

#### ⚠️ HIGH

4. **Tidak ada NIK validation** (jika warga dimasukkan NIK).

5. **Duplicate pages** — `/laporan` vs `/pengaduan` — duplikat fungsional, perlu cleanup.

---

## State Machine Diagrams — Sudah Ada ✅

- `04-state-machine-permohonan.puml` & `.png`
- State machine umum di `SiManggis-StateMachine.png`

State machine sudah didokumentasikan dengan baik di UML. Code mengikuti state machine ini.

---

## Security Issues (affects both flows)

| Issue | Severity | Status |
|---|---|---|
| Fonnte webhook tanpa signature verification | 🚨 CRITICAL | Belum fix |
| Rate limiting endpoint publik | 🚨 CRITICAL | Belum ada |
| NIK tidak divalidasi 16 digit | 🚨 HIGH | Belum ada |
| nomor_rt tidak dicek ada di tabel RT | 🚨 HIGH | Belum ada |
| Service role key di browser (RLS bypass) | 🚨 CRITICAL | Belum fix |
| Staff IDOR (semua staff bisa ubah semua record) | ⚠️ MEDIUM | Belum ada RBAC |

---

## Prioritas Pengerjaan

### Sprint 1 — MVP Shippable
1. Fix webhook Fonnte (`/api/fonnte` route)
2. Validasi NIK 16 digit di form permohonan
3. Validasi nomor_rt ada di tabel RT
4. Cleanup duplicate pages (`/lacak`, `/laporan`, `/masuk`)
5. Endpoint RT lookup (`/api/rt`)

### Sprint 2 — completeness
6. Notifikasi WA ke warga saat status berubah
7. Notifikasi WA ke staff saat RT approve
8. Audit trail (laporan_status_log)
9. Rate limiting

### Sprint 3 — hardening
10. Fix keamanan (webhook signature, RLS, RBAC)
