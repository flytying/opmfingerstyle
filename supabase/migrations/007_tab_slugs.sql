-- Add slug column to tablature_links for SEO-friendly detail page URLs
ALTER TABLE tablature_links ADD COLUMN slug TEXT;
CREATE UNIQUE INDEX idx_tabs_slug ON tablature_links(slug);

-- Populate slugs for existing tabs from title + first 8 chars of UUID
UPDATE tablature_links
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        COALESCE(title, 'tab'),
        '[^\w\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
) || '-' || SUBSTRING(id::text, 1, 8);
