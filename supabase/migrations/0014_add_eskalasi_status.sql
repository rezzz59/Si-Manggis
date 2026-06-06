-- supabase/migrations/0014_add_eskalasi_status.sql
--
-- Tambah status ESKALASI_STAF untuk fitur timeout 3-jam.
-- Idempotent: aman di-apply berkali-kali.

-- 1. Drop CHECK constraint lama, tambah baru yang include ESKALASI_STAF
ALTER TABLE public.permohonan DROP CONSTRAINT IF EXISTS permohonan_status_check;

ALTER TABLE public.permohonan
  ADD CONSTRAINT permohonan_status_check
  CHECK (status IN (
    'MENUNGGU',
    'DISETUJUI_RT',
    'DITOLAK_RT',
    'DIPROSES',
    'SELESAI',
    'DITOLAK',
    'ESKALASI_STAF'
  ));

-- 2. Tambah kolom eskalasi_at (NULLABLE — hanya terisi kalau permohonan di-eskalate)
ALTER TABLE public.permohonan
  ADD COLUMN IF NOT EXISTS eskalasi_at timestamptz;

-- 3. Tambah index untuk performa query cron (filter status MENUNGGU + sort createdat)
CREATE INDEX IF NOT EXISTS idx_permohonan_status_createdat
  ON public.permohonan (status, createdat)
  WHERE status = 'MENUNGGU';
