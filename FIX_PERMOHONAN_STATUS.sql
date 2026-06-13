-- =====================================================================
-- FIX: permohonan_status_check constraint violation
-- =====================================================================
-- Migrasi 0014 dan bagian 0017 yang menyentuh tabel `permohonan`
-- BELUM ter-apply di database remote.
--
-- File ini adalah gabungan idempotent yang aman dijalankan berkali-kali.
-- Paste ke Supabase Dashboard -> SQL Editor -> RUN.
-- =====================================================================

BEGIN;

-- 1. Tambah kolom eskalasi_at (dari migrasi 0014 & 0017)
ALTER TABLE public.permohonan
  ADD COLUMN IF NOT EXISTS eskalasi_at timestamptz;

-- 2. Pastikan kolom approval RT lainnya juga ada (dari 0017)
ALTER TABLE public.permohonan
  ADD COLUMN IF NOT EXISTS nomor_rt         varchar(3),
  ADD COLUMN IF NOT EXISTS fonnte_msg_id    varchar(100),
  ADD COLUMN IF NOT EXISTS rt_approved_at   timestamptz,
  ADD COLUMN IF NOT EXISTS rt_approved_via  varchar(30) DEFAULT 'whatsapp';

-- 3. Migrasi data: perbaiki typo status lama 'DISETUJAI_RT' -> 'DISETUJUI_RT'
UPDATE public.permohonan
SET status = 'DISETUJUI_RT'
WHERE status = 'DISETUJAI_RT';

-- 4. Drop constraint lama (yang masih punya typo dari migrasi 0002)
ALTER TABLE public.permohonan
  DROP CONSTRAINT IF EXISTS permohonan_status_check;

-- 5. Tambahkan constraint baru sesuai migrasi 0017 (flow approval RT WhatsApp)
ALTER TABLE public.permohonan
  ADD CONSTRAINT permohonan_status_check
  CHECK (status IN (
    'MENUNGGU',
    'MENUNGGU_KONFIRMASI_RT',
    'DISETUJUI_RT',
    'DITOLAK_RT',
    'RT_TIDAK_MERESPONS',
    'DIPROSES',
    'SELESAI',
    'DITOLAK',
    'ESKALASI_STAF'
  ));

-- 6. Tambah index untuk performa query approval/timeout
CREATE INDEX IF NOT EXISTS idx_permohonan_tiket
  ON public.permohonan (tiket);

CREATE INDEX IF NOT EXISTS idx_permohonan_nomor_rt
  ON public.permohonan (nomor_rt);

CREATE INDEX IF NOT EXISTS idx_permohonan_status_createdat_all
  ON public.permohonan (status, createdat);

CREATE INDEX IF NOT EXISTS idx_permohonan_status_menunggu_rt
  ON public.permohonan (createdat)
  WHERE status = 'MENUNGGU_KONFIRMASI_RT';

COMMENT ON COLUMN public.permohonan.eskalasi_at
  IS 'Dipakai sebagai deadline respons RT atau timestamp eskalasi, sesuai flow aplikasi.';

COMMIT;

-- =====================================================================
-- Verifikasi: jalankan query berikut setelah migrasi
-- =====================================================================
-- SELECT conname, pg_get_constraintdef(oid)
-- FROM pg_constraint
-- WHERE conrelid = 'public.permohonan'::regclass
--   AND conname = 'permohonan_status_check';
--
-- SELECT column_name FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'permohonan'
--   AND column_name IN ('eskalasi_at','nomor_rt','fonnte_msg_id');
