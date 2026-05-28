-- Drop NOT NULL constraint on topik (form baru tidak kirim topik)
ALTER TABLE public.pengaduan ALTER COLUMN topik DROP NOT NULL;

-- Buat topik nullable (warga bisa kosongkan, staff bisa isi dari dashboard)
COMMENT ON COLUMN public.pengaduan.topik IS 'Kategori pengaduan — nullable, diisi dari dashboard jika kosong';