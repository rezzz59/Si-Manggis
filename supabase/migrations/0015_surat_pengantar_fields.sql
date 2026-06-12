-- supabase/migrations/0015_surat_pengantar_fields.sql
--
-- Tambah field-field untuk fitur Cetak Surat Pengantar Otomatis.
-- Idempotent: aman di-apply berkali-kali.

-- =============================================================
-- 1. Tambah kolom baru ke tabel permohonan (field-field blanko)
-- =============================================================
ALTER TABLE public.permohonan
  ADD COLUMN IF NOT EXISTS tempat_lahir       varchar(100),
  ADD COLUMN IF NOT EXISTS tanggal_lahir      date,
  ADD COLUMN IF NOT EXISTS jenis_kelamin      varchar(20),
  ADD COLUMN IF NOT EXISTS agama              varchar(20),
  ADD COLUMN IF NOT EXISTS status_kawin       varchar(20),
  ADD COLUMN IF NOT EXISTS pendidikan_terakhir varchar(10),
  ADD COLUMN IF NOT EXISTS pekerjaan          varchar(100),
  ADD COLUMN IF NOT EXISTS jenis_surat        varchar(50) DEFAULT 'Surat Pengantar';

-- =============================================================
-- 2. Tambah kolom NIP & TTD ke tabel rt (untuk tanda tangan digital)
-- =============================================================
ALTER TABLE public.rt
  ADD COLUMN IF NOT EXISTS nip         varchar(50),
  ADD COLUMN IF NOT EXISTS ttd_image_url text;
