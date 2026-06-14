-- supabase/migrations/0018_create_layanan_table.sql
--
-- Idempotent: aman di-apply berkali-kali.
--

-- Buat tabel layanan kalau belum ada
CREATE TABLE IF NOT EXISTS public.layanan (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama          varchar(100) NOT NULL,
  icon          varchar(50),
  estimasi      varchar(100),
  dokumen       text[], -- array of string
  warna_bg      varchar(50),
  warna_text    varchar(50),
  is_active     boolean DEFAULT true,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Tambah kolom kalau belum ada ( Supabase auto-add column failed, jd pk ini)
ALTER TABLE public.layanan ADD COLUMN IF NOT EXISTS id uuid PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE public.layanan ADD COLUMN IF NOT EXISTS nama varchar(100);
ALTER TABLE public.layanan ADD COLUMN IF NOT EXISTS icon varchar(50);
ALTER TABLE public.layanan ADD COLUMN IF NOT EXISTS estimasi varchar(100);
ALTER TABLE public.layanan ADD COLUMN IF NOT EXISTS dokumen text[];
ALTER TABLE public.layanan ADD COLUMN IF NOT EXISTS warna_bg varchar(50);
ALTER TABLE public.layanan ADD COLUMN IF NOT EXISTS warna_text varchar(50);
ALTER TABLE public.layanan ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE public.layanan ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.layanan ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Enable RLS
ALTER TABLE public.layanan ENABLE ROW LEVEL SECURITY;

-- Buat index
CREATE INDEX IF NOT EXISTS idx_layanan_nama ON public.layanan(nama);
CREATE INDEX IF NOT EXISTS idx_layanan_is_active ON public.layanan(is_active);
