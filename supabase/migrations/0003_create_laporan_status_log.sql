-- supabase/migrations/0003_create_laporan_status_log.sql

CREATE TABLE IF NOT EXISTS public.laporan_status_log (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  laporan_id   text NOT NULL REFERENCES public.permohonan(id) ON DELETE CASCADE,
  from_status  varchar(30),
  to_status    varchar(30),
  changed_by   varchar(50),
  changed_at   timestamptz DEFAULT now(),
  note         text
);

CREATE INDEX IF NOT EXISTS idx_laporan_status_log_laporan_id ON public.laporan_status_log (laporan_id);
