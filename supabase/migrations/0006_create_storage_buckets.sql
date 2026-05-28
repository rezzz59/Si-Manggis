-- Enable storage if not already
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-assets', 'website-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read
CREATE POLICY "Public read website assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'website-assets');

-- Allow authenticated admin uploads
CREATE POLICY "Admin can upload website assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'website-assets');

CREATE POLICY "Admin can delete website assets"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'website-assets');
