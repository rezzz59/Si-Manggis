# Fitur Laporan/Aduan via Fonnte — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Warga submit laporan/aduan dari web → notifikasi WA ke RT terkait → RT approve via bales WA → sistem lanjut ke Kelurahan → surat siap.

**Architecture:** Extends existing Supabase tables (`permohonan`) dengan kolom RT routing + tabel master `rt`. Fonnte outbound kirim WA ke RT; webhook inbound intercept balasan "SETUJU" RT untuk auto-approve. 1 nomor Fonnte central mengirim ke semua 52 RT.

**Tech Stack:** Next.js 16 (App Router), Supabase (Postgres), Fonnte WhatsApp API, Tailwind CSS v4, TypeScript strict mode.

---

## File Map

```
SUPABASE MIGRATIONS
supabase/migrations/0001_create_rt_table.sql
supabase/migrations/0002_extend_permohonan_rt_fields.sql
supabase/migrations/0003_create_laporan_status_log.sql

NEW API ROUTES
app/api/rt/route.ts                        — list all RT
app/api/fonnte/send/route.ts               — Fonnte outbound send WA
app/api/fonnte/webhook/route.ts            — Fonnte inbound webhook (balasan RT)

NEW COMPONENTS
src/components/RtDropdown.tsx              — dropdown pilih RT
src/components/FormLaporan.tsx             — form submit laporan (client)
src/components/StatusTracker.tsx           — lacak status warga (client)

NEW PAGES
app/laporan/page.tsx                        — halaman form submit laporan
app/lacak/page.tsx                         — halaman lacak status

MODIFIED FILES
app/page.tsx                               — add link "Ajukan Laporan" + Send icon
app/layanan/page.tsx                        — add CTA card ke /laporan
src/components/Navbar.tsx                   — add menu "Ajukan Laporan" & "Lacak Status"
app/api/permohonan/route.ts                 — extend POST: kirim WA ke RT on submit
app/api/cek-tiket/[tiket]/route.ts          — extend GET: return permohonan directly
app/dashboard/page.tsx                     — add "Disetujui RT" stat card + status colors
app/dashboard/permohonan/page.tsx           — add RT column + filter tabs + status colors
app/dashboard/permohonan/[id]/page.tsx     — add RT field, deskripsi, rt_approved_at + status buttons
src/lib/supabase.ts                         — extend Permohonan type
src/lib/fonnte.ts                           — utility kirim WA via Fonnte
src/lib/fonnte-parser.ts                    — parser balasan RT + normalisasi nomor
.env                                        — add FONNTE_TOKEN + KELURAHAN_WA_NUMBER
```

---

## Task 0: Supabase Migrations

Status: ✅ COMPLETED

- `0001_create_rt_table.sql` — Tabel `rt` + seed 52 RT ✅
- `0002_extend_permohonan_rt_fields.sql` — Kolom baru + status flow ✅
- `0003_create_laporan_status_log.sql` — Tabel audit trail ✅

---

## Task 1: Fonnte Outbound — Utility + API Route

Status: ✅ COMPLETED

- `src/lib/fonnte.ts` — Utility `sendFonnteWA()`
- `app/api/fonnte/send/route.ts` — Endpoint POST /api/fonnte/send
- `src/lib/fonnte-parser.ts` — `normalizePhone()` + `parseApprovalMessage()`

---

## Task 2: Fonnte Webhook — Inbound Balasan RT

Status: ✅ COMPLETED

- `app/api/fonnte/webhook/route.ts` — Webhook POST /api/fonnte/webhook
  - Lookup RT by phone number
  - Parse "SETUJU" / "TOLAK [alasan]"
  - Update status to DISETUJAI_RT or DITOLAK_RT
  - Log to laporan_status_log
  - Konfirmasi ke RT via WA
  - Notifikasi ke Kelurahan

---

## Task 3: Form Laporan + Halaman Submit

Status: ✅ COMPLETED

- `src/components/RtDropdown.tsx` — Dropdown 52 RT
- `app/api/rt/route.ts` — API list RT
- `src/components/FormLaporan.tsx` — Form lengkap (8 field + sub-jenis)
- `app/laporan/page.tsx` — Halaman submit

---

## Task 4: Extend POST /api/permohonan — Kirim WA ke RT

Status: ✅ COMPLETED

- Extend POST handler:
  - Accept new fields: `jenis`, `sub_jenis`, `deskripsi`, `nomor_rt`
  - Map `jenis` → `layanan`, `deskripsi` → `deskripsi`, `nomor_rt`
  - Insert with status `MENUNGGU`
  - After insert: lookup RT phone, send WA notification
  - Save fonnte_msg_id

---

## Task 5: Halaman Lacak Status

Status: ✅ COMPLETED

- `src/components/StatusTracker.tsx` — Timeline visual 4-step
- `app/lacak/page.tsx` — Search by tiket, show result + status tracker
- Extend `app/api/cek-tiket/[tiket]/route.ts` — Return permohonan directly

---

## Task 6: Link Navigation

Status: ✅ COMPLETED

- `app/page.tsx` — Add "Ajukan Laporan" card (Send icon) in JENIS_LAYANAN
- `app/layanan/page.tsx` — Add blue CTA card "Ajukan via WA RT" → /laporan
- `src/components/Navbar.tsx` — Add "Ajukan Laporan" + "Lacak Status" menu

---

## Task 7: Dashboard Kelurahan Extension

Status: ✅ COMPLETED

- `app/dashboard/page.tsx` — Add "Disetujui RT" stat card (ShieldCheck icon), update statusColors
- `app/dashboard/permohonan/page.tsx` — Add "RT" column (col 8), update filter tabs, update statusColors
- `app/dashboard/permohonan/[id]/page.tsx` — Add RT info, deskripsi, sub_layanan, rt_approved_at; update status buttons + colors

---

## Status Summary

| Task | Status |
|------|--------|
| Task 0 — Database Migrations | ✅ DONE |
| Task 1 — Fonnte Utility + Send API | ✅ DONE |
| Task 2 — Fonnte Webhook (Inbound) | ✅ DONE |
| Task 3 — Form Laporan + Submit Page | ✅ DONE |
| Task 4 — Extend POST permohonan (WA to RT) | ✅ DONE |
| Task 5 — Lacak Status Page | ✅ DONE |
| Task 6 — Navigation Links | ✅ DONE |
| Task 7 — Dashboard Extension | ✅ DONE |

---

## Pre-flight Checklist — Sebelum Bisa Testing

- [ ] **Nomor WA 52 RT** — isi `no_wa_rt` di tabel `rt` via Supabase dashboard
- [ ] **Webhook Fonnte** — set URL: `https://[domain]/api/fonnte/webhook`
- [ ] **Domain publik** — server harus accessible internet (localhost nggak bisa webhook)
- [ ] **Device Fonnte online** — HP yang di-scan QR harus nyala + internet

---

## Struktur Status Flow

```
MENUNGGU → DISETUJAI_RT → DIPROSES → SELESAI
    ↓            ↓
DITOLAK_RT    DITOLAK
```