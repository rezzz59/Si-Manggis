---
name: si-manggis-project-state
description: Last known state of Si-Manggis project (2026-05-30)
metadata:
  node_type: memory
  type: project
  originSessionId: 99ddef23-1c3b-4486-bc22-e68feacff484
---

# Si-Manggis — Project State (2026-05-30)

## Project Overview
Web Layanan Desa Digital — Next.js 16 + Tailwind CSS v4 + Supabase.
Root: `/media/ahmad/148f367b-161d-41da-916a-34a1663331bb/ahmad/Dokumen/PROJEK/si-manggis`

## Current Branch
`main` — all Phase 2 PDF letter feature is on main (af4ec2a)

## Tech Stack
- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss"`)
- **Icons:** Lucide React
- **Language:** TypeScript strict mode
- **Backend:** Supabase (Postgres + Fonnte WA integration)
- **Auth:** Custom session-based auth (`src/lib/auth.ts`)
- **PDF:** `@react-pdf/renderer` (server-side letter generation)

## Database
- Supabase project: `mxalsaqfwtlzybniqovh`
- Service role key exposed in env — security issue pending fix (Phase 3)

## Canonical Flow (End-to-End)

### Permohonan Flow (RT approval involved)
```
Warga submits FormLaporan (via /layanan)
    → POST /api/permohonan
    → INSERT permohonan (status=MENUNGGU, telepon=warga_wa)
    → sendFonnteWA to RT (WA number from rt table)
    → RT replies SETUJU/TOLAK via WhatsApp
    → Fonnte webhook → parseApprovalMessage
    → Update status: DISETUJAI_RT or DITOLAK_RT
    → Log to laporan_status_log
    → Notif WA to KELURAHAN_WA_NUMBER (env var)
    → Staff processes in /dashboard/permohonan/[id]
    → Staff sets status SELESAI
    → Staff clicks "Generate & Kirim Surat"
    → PDF generated + uploaded to Supabase Storage (bucket: surat)
    → WA sent to warga (telepon field) with PDF download link
```

### Pengaduan Flow (no RT involvement)
```
Warga submits form via /pengaduan
    → POST /api/pengaduan (public)
    → INSERT pengaduan (status=proses)
    → Staff processes in /dashboard/pengaduan
```

## Phase 1 Status (Done ✅)
- Duplicate pages consolidated: `/laporan` → `/layanan`, `/lacak` → `/cek-tiket`, `/masuk` → `/login`
- FormLaporan integrated in `/layanan`
- NIK 16-digit validation in `POST /api/permohonan`
- RT validation (reject if not found) in `POST /api/permohonan`
- DISETUJAI_RT in validStatuses
- Filter `DITOLAK_RT` in `/dashboard/permohonan`
- `deskripsi` shown in `/cek-tiket` PermohonanResult

## Phase 2 Status (Done ✅ — 2026-05-30)
All tasks completed:
- ✅ Task 1: `@react-pdf/renderer` installed
- ✅ Task 2: `src/components/surat-pdf-template.tsx` — dummy letter (DESA DIGITAL header, nama/NIK/layanan/tiket/tanggal/signature placeholder)
- ✅ Task 3: `app/api/surat/generate/route.ts` — generates PDF, uploads to Supabase Storage `surat/{tahun}/{bulan}/{tiket}.pdf`, sends Fonnte WA to warga (telepon field)
- ✅ Task 4: Storage bucket `surat` created in Supabase (public, PDF only)
- ✅ Task 5: Storage policies set (public read)
- ✅ Task 6: "Generate & Kirim Surat" button in `/dashboard/permohonan/[id]` (only shown when status=SELESAI and no surat_url yet). "Download Surat" button shown when surat_url exists. "Kirim Ulang WA" to resend notification.

## Phase 3 — Pending (Security)
- Fix service role key exposure in `supabase.ts` — split into anon (client) + admin (server)
- Fonnte webhook signature verification
- Rate limiting on public endpoints

## Key Files
| File | Purpose |
|------|---------|
| `src/lib/supabase.ts` | Client-side supabase (uses SERVICE KEY — security issue) |
| `src/lib/supabase-admin.ts` | Server-side admin client |
| `src/lib/auth.ts` | Custom session auth |
| `src/lib/fonnte.ts` | Fonnte WA API sender |
| `src/lib/fonnte-parser.ts` | Parse SETUJU/TOLAK messages |
| `src/lib/tiket.ts` | Generate unique tiket numbers |
| `src/components/surat-pdf-template.tsx` | PDF template for surat |
| `src/components/FormLaporan.tsx` | Canonical permohonan form |
| `src/components/RtDropdown.tsx` | RT dropdown from `/api/rt` |
| `src/components/StatusTracker.tsx` | Status progress visualization |
| `app/api/permohonan/route.ts` | POST (submit) + GET (list) — NIK/RT validation, WA to RT on submit |
| `app/api/permohonan/[id]/route.ts` | PATCH (staff update status) |
| `app/api/pengaduan/route.ts` | POST (submit) + GET (list) — public POST |
| `app/api/fonnte/webhook/route.ts` | Fonnte inbound WA handler |
| `app/api/surat/generate/route.ts` | Generate PDF + upload + WA to warga |
| `app/api/cek-tiket/[tiket]/route.ts` | Lookup by tiket |
| `app/dashboard/permohonan/page.tsx` | List view |
| `app/dashboard/permohonan/[id]/page.tsx` | Detail view with "Generate & Kirim Surat" |

## Design Specs & Plans
- `docs/superpowers/specs/2026-05-30-pdf-letter-generator-design.md` — PDF letter generator spec
- `docs/superpowers/plans/2026-05-30-pdf-letter-generator.md` — implementation plan (all done)
- `docs/mvpgap-permohonan-pengaduan.md` — gap analysis
- `docs/ALUR_END_TO_END.md` — canonical flow
- `docs/PROJECT_DOCUMENTATION.md` — project overview

## Environment Variables (from .env)
```
SUPABASE_URL=https://mxalsaqfwtlzybniqovh.supabase.co
SUPABASE_SERVICE_KEY=eyJ... (service role key)
AUTH_SECRET=...
AUTH_TRUST_HOST=true
FONNTE_TOKEN=mzWitTLjou1vywN89NJT
KELURAHAN_WA_NUMBER=083142298645
```

## Pending / Next Steps
1. **Test PDF generation end-to-end** — submit a permohonan, set to SELESAI, click Generate & Kirim Surat, verify PDF uploaded and WA sent
2. **Dashboard admin login** — reported broken on 2026-05-28, needs investigation
3. **Phase 3 security fixes** — service role key, Fonnte webhook signature, rate limiting
4. **WA notification to warga on pengaduan status change** — pengaduan doesn't have WA notif for warga yet (Phase 2 item)
5. **Download link in `/cek-tiket`** — currently warga can see SELESAI status but no direct surat download link yet

## Fonnte Pricing Context
- Plan: Free (sufficient for village-scale usage)
- 1,000 messages/month — enough for current flow (permohonan ~20-50/month)
- No AI chatbot needed — just outbound notifications
- Target: only receive notifications at Kelurahan, not send broadcast