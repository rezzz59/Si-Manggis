-- Tambah kolom untuk fitur Surat Pengantar RT (blanko BANJARBARU)
-- Semua nullable agar jenis permohonan lain tidak terganggu

ALTER TABLE permohonan
  ADD COLUMN IF NOT EXISTS tempat_lahir      text,
  ADD COLUMN IF NOT EXISTS tanggal_lahir     date,
  ADD COLUMN IF NOT EXISTS jenis_kelamin     text CHECK (jenis_kelamin IN ('L', 'P')),
  ADD COLUMN IF NOT EXISTS agama             text CHECK (agama IN ('Islam','Kristen','Katholik','Budha','Hindu')),
  ADD COLUMN IF NOT EXISTS status_kawin      text CHECK (status_kawin IN ('Kawin','Belum Kawin','Cerai Hidup','Cerai Mati')),
  ADD COLUMN IF NOT EXISTS pendidikan        text CHECK (pendidikan IN ('SD','SLTP','SLTA','D1','D2','D3','S1','S2','S3')),
  ADD COLUMN IF NOT EXISTS pekerjaan         text,
  ADD COLUMN IF NOT EXISTS keperluan         text,
  ADD COLUMN IF NOT EXISTS nama_ortu         text;
