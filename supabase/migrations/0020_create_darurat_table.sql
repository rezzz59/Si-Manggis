-- supabase/migrations/0020_create_darurat_table.sql
--
-- Idempotent: aman di-apply berkali-kali.
--
-- Tabel nomor darurat
CREATE TABLE IF NOT EXISTS public.darurat (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kategori           varchar(50) NOT NULL, -- 'damkar', 'ambulans', 'poskesdes'
  nama                varchar(100) NOT NULL,
  alamat              text,
  telepon             varchar(20) NOT NULL,
  telepon_cadangan    varchar(20),
  jam_operasional     varchar(100),
  deskripsi           text,
  warna_bg            varchar(50),
  warna_text          varchar(50),
  is_active           boolean DEFAULT true,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

-- Tambah kolom kalau belum ada
ALTER TABLE public.darurat ADD COLUMN IF NOT EXISTS id uuid PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE public.darurat ADD COLUMN IF NOT EXISTS kategori varchar(50);
ALTER TABLE public.darurat ADD COLUMN IF NOT EXISTS nama varchar(100);
ALTER TABLE public.darurat ADD COLUMN IF NOT EXISTS alamat text;
ALTER TABLE public.darurat ADD COLUMN IF NOT EXISTS telepon varchar(20);
ALTER TABLE public.darurat ADD COLUMN IF NOT EXISTS telepon_cadangan varchar(20);
ALTER TABLE public.darurat ADD COLUMN IF NOT EXISTS jam_operasional varchar(100);
ALTER TABLE public.darurat ADD COLUMN IF NOT EXISTS deskripsi text;
ALTER TABLE public.darurat ADD COLUMN IF NOT EXISTS warna_bg varchar(50);
ALTER TABLE public.darurat ADD COLUMN IF NOT EXISTS warna_text varchar(50);
ALTER TABLE public.darurat ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE public.darurat ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.darurat ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Enable RLS
ALTER TABLE public.darurat ENABLE ROW LEVEL SECURITY;

-- Index
CREATE INDEX IF NOT EXISTS idx_darurat_kategori ON public.darurat(kategori);
CREATE INDEX IF NOT EXISTS idx_darurat_is_active ON public.darurat(is_active);
