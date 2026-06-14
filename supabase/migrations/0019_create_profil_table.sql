-- supabase/migrations/0019_create_profil_table.sql
--
-- Idempotent: aman di-apply berkali-kali.
--
-- Tabel profil desa (single row, update only)
CREATE TABLE IF NOT EXISTS public.profil (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_desa     varchar(100),
  kecamatan    varchar(100),
  kabupaten    varchar(100),
  provinsi     varchar(100),
  kode_pos     varchar(10),
  luas_wilayah varchar(100),
  foto_url     text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- Tambah kolom kalau belum ada
ALTER TABLE public.profil ADD COLUMN IF NOT EXISTS id uuid PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE public.profil ADD COLUMN IF NOT EXISTS nama_desa varchar(100);
ALTER TABLE public.profil ADD COLUMN IF NOT EXISTS kecamatan varchar(100);
ALTER TABLE public.profil ADD COLUMN IF NOT EXISTS kabupaten varchar(100);
ALTER TABLE public.profil ADD COLUMN IF NOT EXISTS provinsi varchar(100);
ALTER TABLE public.profil ADD COLUMN IF NOT EXISTS kode_pos varchar(10);
ALTER TABLE public.profil ADD COLUMN IF NOT EXISTS luas_wilayah varchar(100);
ALTER TABLE public.profil ADD COLUMN IF NOT EXISTS foto_url text;
ALTER TABLE public.profil ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.profil ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Enable RLS
ALTER TABLE public.profil ENABLE ROW LEVEL SECURITY;

-- Tabel pejabat desa
CREATE TABLE IF NOT EXISTS public.pejabat_desa (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama       varchar(100) NOT NULL,
  jabatan    varchar(100) NOT NULL,
  nip        varchar(50),
  telepon    varchar(20),
  foto_url   text,
  is_active  boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.pejabat_desa ADD COLUMN IF NOT EXISTS id uuid PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE public.pejabat_desa ADD COLUMN IF NOT EXISTS nama varchar(100);
ALTER TABLE public.pejabat_desa ADD COLUMN IF NOT EXISTS jabatan varchar(100);
ALTER TABLE public.pejabat_desa ADD COLUMN IF NOT EXISTS nip varchar(50);
ALTER TABLE public.pejabat_desa ADD COLUMN IF NOT EXISTS telepon varchar(20);
ALTER TABLE public.pejabat_desa ADD COLUMN IF NOT EXISTS foto_url text;
ALTER TABLE public.pejabat_desa ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE public.pejabat_desa ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.pejabat_desa ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

ALTER TABLE public.pejabat_desa ENABLE ROW LEVEL SECURITY;

-- Tabel demografi
CREATE TABLE IF NOT EXISTS public.demografi (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jumlah_penduduk varchar(20),
  jumlah_rt       integer,
  jumlah_rw       integer,
  mata_pencaharian text[], -- array string
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

ALTER TABLE public.demografi ADD COLUMN IF NOT EXISTS id uuid PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE public.demografi ADD COLUMN IF NOT EXISTS jumlah_penduduk varchar(20);
ALTER TABLE public.demografi ADD COLUMN IF NOT EXISTS jumlah_rt integer;
ALTER TABLE public.demografi ADD COLUMN IF NOT EXISTS jumlah_rw integer;
ALTER TABLE public.demografi ADD COLUMN IF NOT EXISTS mata_pencaharian text[];
ALTER TABLE public.demografi ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.demografi ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

ALTER TABLE public.demografi ENABLE ROW LEVEL SECURITY;
