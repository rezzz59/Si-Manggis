CREATE TABLE IF NOT EXISTS public.artikel (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul        varchar(255) NOT NULL,
  slug         varchar(255) UNIQUE NOT NULL,
  excerpt      text,
  konten       text,
  gambar_url   text,
  kategori     varchar(100) DEFAULT 'berita',
  penulis      varchar(100) DEFAULT 'Admin',
  tgl_publish  date DEFAULT CURRENT_DATE,
  is_featured  boolean DEFAULT false,
  is_published boolean DEFAULT true,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE public.artikel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published articles"
  ON public.artikel FOR SELECT USING (is_published = true);

CREATE POLICY "Admin can manage articles"
  ON public.artikel FOR ALL USING (true);

-- Seed with existing articles
INSERT INTO public.artikel (judul, slug, excerpt, gambar_url, kategori, tgl_publish, is_featured) VALUES
  ('Perbaikan Jembatan Guntung Manggis, Dinas PUPR Kalseltel Gerak Cepat',
   'perbaikan-jembatan',
   'Dinas Pekerjaan Umum dan Penataan Ruang Kalimantan Selatan gerak cepat merespons perbaikan infrastruktur di Kelurahan Guntung Manggis.',
   '/img/Sekilas-Tentang-Danau-Seran.jpg',
   'berita',
   '2026-01-15',
   true),
  ('Pasar Murah Mandiri Komplek Wengga Kuda',
   'pasar-murah-wengga-kuda',
   'Program pasar murah mandiri di kompleks Wengga Kuda berhasil menjangkau ratusan warga dengan harga terjangkau.',
   '/img/Sekilas-Tentang-Danau-Seran.jpg',
   'kegiatan',
   '2025-02-20',
   false),
  ('Pemekaran 52 RT, Kelurahan Tumbuh Cepat',
   'pemekaran-rt-52',
   'Kelurahan Guntung Manggis resmi memiliki 52 RT setelah pemekaran wilayah pada Oktober 2025.',
   '/img/bg.png',
   'berita',
   '2025-10-01',
   false)
ON CONFLICT (slug) DO NOTHING;
