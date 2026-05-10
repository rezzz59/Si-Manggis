-- supabase/migrations/0001_create_rt_table.sql

CREATE TABLE IF NOT EXISTS public.rt (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor_rt      varchar(3) UNIQUE NOT NULL,
  nama_ketua    varchar(100),
  no_wa_rt      varchar(20),
  rw_id         uuid,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Seed 52 RT
INSERT INTO public.rt (nomor_rt, nama_ketua, no_wa_rt)
SELECT
  LPAD(i::text, 2, '0'),
  CONCAT('Ketua RT ', LPAD(i::text, 2, '0')),
  NULL
FROM generate_series(1, 52) AS i
ON CONFLICT (nomor_rt) DO NOTHING;