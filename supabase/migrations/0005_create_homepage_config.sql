CREATE TABLE IF NOT EXISTS public.homepage_config (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section    varchar(100) UNIQUE NOT NULL,  -- 'hero', 'stat_bar', 'berita_1', dst.
  config     jsonb        NOT NULL DEFAULT '{}',
  updated_at timestamptz  DEFAULT now()
);

-- Default homepage sections
INSERT INTO public.homepage_config (section, config) VALUES
  ('hero', '{"asset_id": null, "title": "Gunting Manggis", "subtitle": "Portal Resmi Kelurahan"}'),
  ('stat_bar', '{"stats": [{"value": "52", "label": "RT"}, {"value": "2.500+", "label": "Warga"}, {"value": "8", "label": "Bank Sampah"}, {"value": "5", "label": "Program"}]}'),
  ('berita_featured', '{"artikel_ids": []}'),
  ('program_unggulan', '{"program_ids": []}'),
  ('footer', '{"tagline": "Dibuat dengan semangat gotong royong"}')
ON CONFLICT (section) DO NOTHING;

ALTER TABLE public.homepage_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read homepage config"
  ON public.homepage_config FOR SELECT USING (true);
CREATE POLICY "Admin can update homepage config"
  ON public.homepage_config FOR ALL USING (true);
