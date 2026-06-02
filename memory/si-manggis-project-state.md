---
name: si-manggis-project-state
description: Canonical project state Si-Manggis (2026-05-30) — completed Phase 2, Phase 3 pending, complete onboarding guide
metadata:
  node_type: memory
  type: project
  originSessionId: 99ddef23-1c3b-4486-bc22-e68feacff484
---

# Si-Manggis — Project State (2026-05-30)

Web Layanan Desa Digital — Next.js 16 + Tailwind CSS v4 + Supabase.

**Root:** `/media/ahmad/148f367b-161d-41da-916a-34a1663331bb/ahmad/Dokumen/PROJEK/si-manggis`
**Git:** `https://github.com/rezzz59/Si-Manggis.git`
**Branch:** `main` (all done, currently on main)

## Apa yang Sudah Dibuat

Fitur utama: warga bisa submit permohonan (layanan RT) dan pengaduan. RT approve via WhatsApp. Staff proses di dashboard. Warga cek status via `/cek-tiket`.

Perbedaan permohonan vs pengaduan:
- **Permohonan:** harus approve RT dulu → WA notifikasi ke RT saat warga submit → RT approve/tolak via WA → notifikasi ke Kelurahan → staff proses
- **Pengaduan:** langsung ke Kelurahan, tanpa RT involvement → staff proses langsung

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss"`) — no tailwind.config.js
- **Icons:** Lucide React
- **Language:** TypeScript strict mode
- **Backend:** Supabase (Postgres + Fonnte WA integration)
- **Auth:** Custom session-based auth (`src/lib/auth.ts`) — JWT + cookies, bukan Supabase Auth
- **PDF:** `@react-pdf/renderer` (server-side)

## Canonical Flow — Permohonan

```
1. Warga submit via /layanan → FormLaporan.tsx
   → POST /api/permohonan
   → INSERT permohonan (status=MENUNGGU)
   → WA ke RT: "🔔 LAPORAN BARU — RT X"  ✅ DONE
   → WA ke warga: confirmasi + tiket  ✅ DONE

2. RT balas WA ke Fonnte: "SETUJU" atau "TOLAK [alasan]"
   → Fonnte webhook → POST /api/fonnte/webhook
   → parseApprovalMessage() → status: DISETUJAI_RT / DITOLAK_RT
   → Log to laporan_status_log
   → Konfirmasi balik ke RT ✅ DONE

3. Jika SETUJU → WA ke Kelurahan (KELURAHAN_WA_NUMBER) ✅ DONE

4. Staff proses di /dashboard/permohonan
   → PATCH /api/permohonan/[id] → ubah status
   → Tombol "Generate & Kirim Surat" ✅ DONE

5. Staff klik "Generate & Kirim Surat"
   → POST /api/surat/generate {permohonanId}
   → Generate PDF via @react-pdf/renderer ✅ DONE
   → Upload ke Supabase Storage (bucket: surat) ✅ DONE
   → Update kolom surat_url ✅ DONE
   → WA ke warga: "Surat Anda siap" + link download ✅ DONE
```

## Canonical Flow — Pengaduan

```
1. Warga submit via /pengaduan
   → POST /api/pengaduan
   → INSERT pengaduan (status=proses)
   → Langsung ke Kelurahan

2. Staff proses di /dashboard/pengaduan
   → PATCH /api/pengaduan/[id] → ubah status
```

## Database Schema — Tabel Utama

### permohonan
Kolom penting:
- `id, tiket, nama, nik, alamat, telepon, layanan, sub_layanan, deskripsi`
- `status` — ENUM: MENUNGGU | DISETUJAI_RT | DIPROSES | SELESAI | DITOLAK_RT | DITOLAK
- `nomor_rt, rt_approved_at, rt_approved_via`
- `kelurahan_approved_at`
- `surat_url` — link PDF dari Supabase Storage
- `fonnte_msg_id`
- `lampiran_url[]`
- `catatan`
- `createdat, updatedat`

### rt
- `id, nomor_rt, nama_ketua, no_wa_rt`

### pengaduan
- `id, tiket, nama, telepon, email, topik, pesan, status, lampiran_url[]`
- `createdat, updatedat`

### laporan_status_log
- `id, laporan_id, from_status, to_status, changed_by, changed_at, note`

### website_assets
- `id, storage_url, alt_text, createdat`

### homepage_config
- `id, section, content, updatedat`

### artikel
- `id, judul, slug, excerpt, konten, gambar_url, status, createdat`

## Supabase Storage Buckets

- `website-assets` — gambar untuk homepage/CMS (public, RLS: anyone read, authenticated write)
- `pengaduan-lampiran` — lampiran pengaduan (public upload, authenticated read)
- `surat` — PDF letter hasil generate (RLS: authenticated read, service role write)

## API Routes

| Route | Method | Auth | Fungsi |
|-------|--------|------|--------|
| `/api/permohonan` | GET, POST | GET=staff, POST=public | List + submit permohonan |
| `/api/permohonan/[id]` | GET, PATCH | staff | Detail + update status |
| `/api/pengaduan` | GET, POST | GET=staff, POST=public | List + submit pengaduan |
| `/api/pengaduan/upload` | POST | public | Upload lampiran |
| `/api/fonnte/webhook` | POST | none (Fonnte) | Handle RT reply |
| `/api/surat/generate` | POST | staff | Generate PDF + WA warga |
| `/api/cek-tiket/[tiket]` | GET | public | Lookup by tiket |
| `/api/rt` | GET | public | List RT untuk dropdown |
| `/api/assets` | GET, POST | staff | CMS assets |

## Key Components

- `src/components/FormLaporan.tsx` — form permohonan warga (RT dropdown, NIK 16-digit validation, WA number field)
- `src/components/RtDropdown.tsx` — dropdown RT dari `/api/rt`
- `src/components/StatusTracker.tsx` — progress 6 status untuk /cek-tiket
- `src/components/surat-pdf-template.tsx` — template PDF surat (kop: DESA DIGITAL / KELURAHAN SETIABUDI)
- `src/lib/fonnte.ts` — Fonnte WA sender (normalizePhone untuk 08xx → 628xx)
- `src/lib/fonnte-parser.ts` — parse SETUJU/TOLAK dari pesan WA
- `src/lib/supabase.ts` — client (SERVICE KEY — security issue)
- `src/lib/supabase-admin.ts` — admin client (bypass RLS)
- `src/lib/auth.ts` — session auth (JWT + cookies)
- `src/lib/tiket.ts` — generate tiket unik

## Environment Variables

```
SUPABASE_URL=https://mxalsaqfwtlzybniqovh.supabase.co
SUPABASE_SERVICE_KEY=eyJ... (service role key)
AUTH_SECRET=...
AUTH_TRUST_HOST=true
FONNTE_TOKEN=mzWitTLjou1vywN89NJT
KELURAHAN_WA_NUMBER=083142298645
```

## Yang Belum Selesai

### Phase 2 — Belum (2 item)

1. **WA ke warga saat staff update status** — Sudah done untuk SELESAI (via Generate & Kirim Surat). Tapi untuk status lain (DITOLAK, DIPROSES) belum ada notifikasi WA otomatis.

2. **Pengaduan audit trail** — `laporan_status_log` tidak ditulis saat staff update status pengaduan. Perlu di-track seperti permohonan.

### Phase 3 — Belum (Security)

1. **Split service role** — `src/lib/supabase.ts` pakai SERVICE KEY di client side → risk. Perlu pisah: anon client untuk client, service role hanya di server-side (supabase-admin.ts).

2. **Fonnte webhook signature verification** — webhook `/api/fonnte/webhook` tidak verify signature dari Fonnte. Siapa pun bisa POST ke endpoint ini.

3. **Rate limiting** — endpoint publik (`/api/permohonan`, `/api/pengaduan`) tidak ada rate limit.

## Cara Kerja Fonnte

Fonnte adalah WhatsApp API provider (bukan AI chatbot). Dua arah:

- **Outbound:** app kirim WA via `sendFonnteWA()` — butuh `FONNTE_TOKEN` dari env
- **Inbound:** RT kirim WA → Fonnte forward ke webhook `/api/fonnte/webhook`

Fonnte pakai normalized phone: `08xxxxxxxxx` → `628xxxxxxxxx` (bisa langsung dipakai untuk kirim WA).

Paket yang dipakai: **Free** (1.000 pesan/bulan). Cukup untuk volume desa.

## Pages

| Path | Fungsi |
|------|--------|
| `/` | Homepage |
| `/layanan` | Form permohonan (FormLaporan) |
| `/pengaduan` | Form pengaduan |
| `/cek-tiket` | Cek status (by tiket or NIK) |
| `/dashboard/permohonan` | Staff: list + process permohonan |
| `/dashboard/pengaduan` | Staff: list + process pengaduan |
| `/login` | Staff login |

## Cara Melanjutkan

1. **Baca memory ini** — itu state proyek terkini
2. **Baca `docs/superpowers/plans/2026-05-30-pdf-letter-generator.md`** — detail implementasi PDF letter yang sudah done
3. **Run `npm run dev`** — development server di `http://localhost:3000`
4. **Test endpoint:** Gunakan Postman/curl atau browser untuk test API routes
5. **Supabase:** Login ke dashboard `https://supabase.com/dashboard/project/mxalsaqfwtlzybniqovh` untuk cek data, schema, storage

## Commit History (recent)

```
af4ec2a chore: remove machine-specific and generated files from Git history
cc12302 fix: allow Supabase Storage images in next/image
a607509 chore: update .gitignore to exclude docs, skills, agents, mcp config
0d0ca48 fix: NIK/RT validation di API, StatusTracker, Ditolak RT filter, clean route.ts
a6aeb9d fix: add NIK/RT validation, Ditolak RT filter, fix pengaduan controller
11c0c0a menambahkan laporan ke rt
de68ff0 fix: lazy init Supabase client to avoid build-time env var error
```

## Design Files (reference only — don't use directly)

- `reference/` — design image references (extract colors/layout, not as assets)
- `docs/` — project docs (mvpgap, ALUR_END_TO_END, PROJECT_DOCUMENTATION, UML diagrams)
- `docs/superpowers/specs/` — feature specs
- `docs/superpowers/plans/` — implementation plans