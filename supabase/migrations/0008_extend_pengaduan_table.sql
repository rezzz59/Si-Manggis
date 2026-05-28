-- Extend pengaduan table: add lampiran_url and lokasi columns
ALTER TABLE public.pengaduan
  ADD COLUMN IF NOT EXISTS lampiran_url TEXT[],
  ADD COLUMN IF NOT EXISTS lokasi TEXT;

COMMENT ON COLUMN public.pengaduan.lampiran_url IS 'Array of uploaded photo URLs';
COMMENT ON COLUMN public.pengaduan.lokasi IS 'Geolocation string (lat,lng) or address';

-- Rename kolom topik ke kategori (opsional, biar konsisten)
-- ALTER TABLE public.pengaduan RENAME COLUMN topik TO kategori;

-- Buat constraint status baru untuk pengaduan
ALTER TABLE public.pengaduan DROP CONSTRAINT IF EXISTS pengaduan_status_check;
ALTER TABLE public.pengaduan
  ADD CONSTRAINT pengaduan_status_check
  CHECK (status IN ('DIPROSES', 'SELESAI', 'DITOLAK'));
