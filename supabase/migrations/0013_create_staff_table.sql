-- supabase/migrations/0013_create_staff_table.sql
--
-- Idempotent: aman di-apply berkali-kali. Bisa add kolom yang hilang
-- ke tabel staff yang sudah ada, atau create tabel baru kalau belum ada.

CREATE TABLE IF NOT EXISTS public.staff (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         varchar(255) UNIQUE NOT NULL,
  nama          varchar(100) NOT NULL,
  password      text NOT NULL,                    -- bcrypt hash (bcryptjs)
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Add kolom yang hilang kalau tabel sudah ada tapi strukturnya beda
-- (mis. dibuat manual via dashboard tanpa created_at/updated_at)
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS nama varchar(100);
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS password text;

CREATE INDEX IF NOT EXISTS idx_staff_email ON public.staff(email);

-- RLS: only service_role can read/write from server. Tidak perlu policy publik
-- karena semua akses staff melalui API route (server-side) yang pakai supabaseAdmin.
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Tidak ada policy untuk role anon/authenticated. Service role bypass RLS otomatis.
