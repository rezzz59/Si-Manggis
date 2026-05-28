-- Storage bucket untuk lampiran pengaduan
INSERT INTO storage.buckets (id, name, public)
VALUES ('pengaduan-lampiran', 'pengaduan-lampiran', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read
CREATE POLICY "Public read pengaduan attachments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pengaduan-lampiran');

-- Allow anyone to upload (public insert, no auth required for warga)
CREATE POLICY "Public can upload pengaduan attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'pengaduan-lampiran');