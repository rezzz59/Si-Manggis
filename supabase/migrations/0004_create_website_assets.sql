CREATE TABLE IF NOT EXISTS public.website_assets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename    varchar(255) NOT NULL,
  storage_url text         NOT NULL,   -- full Supabase Storage URL
  category    varchar(50)  NOT NULL,   -- 'hero' | 'artikel' | 'general' | 'logo'
  alt_text    varchar(255) DEFAULT '',
  caption     varchar(500) DEFAULT '',
  is_active   boolean      DEFAULT true,
  sort_order  integer      DEFAULT 0,
  metadata    jsonb        DEFAULT '{}',
  created_by  varchar(100),
  created_at  timestamptz  DEFAULT now(),
  updated_at  timestamptz  DEFAULT now()
);

-- Index untuk query cepat per kategori
CREATE INDEX idx_website_assets_category   ON public.website_assets(category);
CREATE INDEX idx_website_assets_is_active  ON public.website_assets(is_active);
CREATE INDEX idx_website_assets_sort_order ON public.website_assets(sort_order);

-- Enable RLS
ALTER TABLE public.website_assets ENABLE ROW LEVEL SECURITY;

-- Policy: siapa pun bisa SELECT aktif
CREATE POLICY "Anyone can view active assets"
  ON public.website_assets FOR SELECT
  USING (is_active = true);

-- Policy: admin bisa INSERT/UPDATE/DELETE
CREATE POLICY "Admin can manage assets"
  ON public.website_assets FOR ALL
  USING (true);