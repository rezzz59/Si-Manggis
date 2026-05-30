-- Create surat storage bucket (PDF only)
INSERT INTO storage.buckets (id, name, public, allowed_mime_types)
VALUES ('surat', 'surat', true, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Allow public read
CREATE POLICY "Public read surat"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'surat');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated can upload surat"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'surat');

-- Allow owners to delete their own files
CREATE POLICY "Owner can delete surat"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'surat');
