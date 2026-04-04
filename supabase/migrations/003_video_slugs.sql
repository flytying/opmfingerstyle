-- Add slug column to guitarist_videos for SEO-friendly URLs
ALTER TABLE guitarist_videos ADD COLUMN slug TEXT;
CREATE UNIQUE INDEX idx_videos_slug ON guitarist_videos(slug);

-- Populate slugs for existing videos from title
UPDATE guitarist_videos
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      COALESCE(title, 'video'),
      '[^\w\s-]', '', 'g'
    ),
    '\s+', '-', 'g'
  )
) || '-' || SUBSTRING(id::text, 1, 8);
