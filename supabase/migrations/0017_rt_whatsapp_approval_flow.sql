-- supabase/migrations/0017_rt_whatsapp_approval_flow.sql
--
-- Menyesuaikan schema permohonan untuk alur approval RT via WhatsApp.
-- Idempotent: aman di-apply berkali-kali.

-- 1. Pastikan kolom-kolom approval RT tersedia
ALTER TABLE public.permohonan
  ADD COLUMN IF NOT EXISTS nomor_rt varchar(3),
  ADD COLUMN IF NOT EXISTS fonnte_msg_id varchar(100),
  ADD COLUMN IF NOT EXISTS rt_approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS rt_approved_via varchar(30) DEFAULT 'whatsapp',
  ADD COLUMN IF NOT EXISTS eskalasi_at timestamptz;

-- 2. Perbarui constraint status agar sesuai flow terbaru
ALTER TABLE public.permohonan
  DROP CONSTRAINT IF EXISTS permohonan_status_check;

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

-- 3. Indeks untuk query approval, timeout, dan tracking tiket
CREATE INDEX IF NOT EXISTS idx_permohonan_tiket
  ON public.permohonan (tiket);

CREATE INDEX IF NOT EXISTS idx_permohonan_nomor_rt
  ON public.permohonan (nomor_rt);

CREATE INDEX IF NOT EXISTS idx_permohonan_status_createdat_all
  ON public.permohonan (status, createdat);

CREATE INDEX IF NOT EXISTS idx_permohonan_status_menunggu_rt
  ON public.permohonan (createdat)
  WHERE status = 'MENUNGGU_KONFIRMASI_RT';

-- 4. Pastikan tabel RT siap dipakai untuk routing nomor WhatsApp
ALTER TABLE public.rt
  ADD COLUMN IF NOT EXISTS no_wa_rt varchar(20);

CREATE INDEX IF NOT EXISTS idx_rt_nomor_rt
  ON public.rt (nomor_rt);

CREATE INDEX IF NOT EXISTS idx_rt_no_wa_rt
  ON public.rt (no_wa_rt)
  WHERE no_wa_rt IS NOT NULL;

COMMENT ON COLUMN public.rt.no_wa_rt IS 'Nomor WhatsApp RT untuk approval permohonan via Fonnte/WhatsApp.';
COMMENT ON COLUMN public.permohonan.eskalasi_at IS 'Dipakai sebagai deadline respons RT atau timestamp eskalasi, sesuai flow aplikasi.';
