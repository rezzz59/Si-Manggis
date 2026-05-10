-- supabase/migrations/0002_extend_permohonan_rt_fields.sql

ALTER TABLE public.permohonan
  ADD COLUMN IF NOT EXISTS nomor_rt        varchar(3),
  ADD COLUMN IF NOT EXISTS sub_layanan    varchar(100),
  ADD COLUMN IF NOT EXISTS deskripsi      text,
  ADD COLUMN IF NOT EXISTS lampiran_url   text[],
  ADD COLUMN IF NOT EXISTS fonnte_msg_id  varchar(100),
  ADD COLUMN IF NOT EXISTS rt_approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS rt_approved_via varchar(20) DEFAULT 'whatsapp',
  ADD COLUMN IF NOT EXISTS kelurahan_approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS surat_url      text;

ALTER TABLE public.permohonan
  DROP CONSTRAINT IF EXISTS permohonan_status_check;

ALTER TABLE public.permohonan
  ADD CONSTRAINT permohonan_status_check
  CHECK (status IN (
    'MENUNGGU', 'DISETUJAI_RT', 'DIPROSES', 'SELESAI',
    'DITOLAK_RT', 'DITOLAK'
  ));
