-- OPM Fingerstyle — Initial Database Schema
-- Matches data model from 02-data-model.md

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE approval_status AS ENUM ('draft', 'pending_review', 'approved', 'rejected');
CREATE TYPE user_role AS ENUM ('admin', 'guitarist');
CREATE TYPE social_platform AS ENUM ('facebook', 'instagram', 'youtube', 'tiktok', 'spotify', 'website', 'x', 'other');
CREATE TYPE gear_category AS ENUM (
  'acoustic_guitar', 'classical_guitar', 'strings', 'capo', 'tuner',
  'pickup', 'microphone', 'audio_interface', 'amp', 'cable', 'stand', 'accessory'
);
CREATE TYPE article_status AS ENUM ('draft', 'published', 'archived');

-- =============================================================================
-- PROFILES (extends auth.users)
-- =============================================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'guitarist',
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- GUITARISTS
-- =============================================================================

CREATE TABLE guitarists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  real_name TEXT,
  location TEXT,
  bio_short TEXT NOT NULL,
  bio_full TEXT,
  profile_photo_url TEXT,
  youtube_channel_url TEXT,
  contact_email TEXT,
  approval_status approval_status NOT NULL DEFAULT 'pending_review',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_guitarists_slug ON guitarists(slug);
CREATE INDEX idx_guitarists_status ON guitarists(approval_status);
CREATE INDEX idx_guitarists_user ON guitarists(user_id);

-- =============================================================================
-- GUITARIST VIDEOS
-- =============================================================================

CREATE TABLE guitarist_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guitarist_id UUID NOT NULL REFERENCES guitarists(id) ON DELETE CASCADE,
  youtube_url TEXT NOT NULL,
  title TEXT,
  thumbnail_url TEXT,
  featured_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_videos_guitarist ON guitarist_videos(guitarist_id);

-- =============================================================================
-- TABLATURE LINKS
-- =============================================================================

CREATE TABLE tablature_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guitarist_id UUID NOT NULL REFERENCES guitarists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  song_name TEXT,
  source_label TEXT,
  external_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tabs_guitarist ON tablature_links(guitarist_id);

-- =============================================================================
-- SOCIAL LINKS
-- =============================================================================

CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guitarist_id UUID NOT NULL REFERENCES guitarists(id) ON DELETE CASCADE,
  platform social_platform NOT NULL,
  external_url TEXT NOT NULL
);

CREATE INDEX idx_socials_guitarist ON social_links(guitarist_id);

-- =============================================================================
-- GEAR PRODUCTS
-- =============================================================================

CREATE TABLE gear_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT,
  category gear_category NOT NULL,
  short_description TEXT,
  image_url TEXT,
  external_url TEXT,
  affiliate_url TEXT,
  sponsored BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gear_slug ON gear_products(slug);
CREATE INDEX idx_gear_category ON gear_products(category);

-- =============================================================================
-- ARTICLES
-- =============================================================================

CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT NOT NULL,
  featured_image_url TEXT,
  status article_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status);

-- =============================================================================
-- UPDATED_AT TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_guitarists BEFORE UPDATE ON guitarists FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_gear BEFORE UPDATE ON gear_products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_articles BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guitarists ENABLE ROW LEVEL SECURITY;
ALTER TABLE guitarist_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tablature_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE gear_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Helper: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper: get guitarist_id for current user
CREATE OR REPLACE FUNCTION my_guitarist_id()
RETURNS UUID AS $$
  SELECT id FROM guitarists WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- PROFILES
CREATE POLICY "Admins can do everything on profiles" ON profiles FOR ALL USING (is_admin());
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = auth.uid());

-- GUITARISTS
CREATE POLICY "Public can read approved guitarists" ON guitarists FOR SELECT USING (approval_status = 'approved');
CREATE POLICY "Admins can do everything on guitarists" ON guitarists FOR ALL USING (is_admin());
CREATE POLICY "Guitarists can read own record" ON guitarists FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Guitarists can update own record" ON guitarists FOR UPDATE USING (user_id = auth.uid());
-- Public insert for submissions (no auth required)
CREATE POLICY "Anyone can submit a guitarist profile" ON guitarists FOR INSERT WITH CHECK (approval_status = 'pending_review');

-- GUITARIST VIDEOS
CREATE POLICY "Public can read videos of approved guitarists" ON guitarist_videos FOR SELECT
  USING (EXISTS (SELECT 1 FROM guitarists WHERE guitarists.id = guitarist_videos.guitarist_id AND guitarists.approval_status = 'approved'));
CREATE POLICY "Admins can do everything on videos" ON guitarist_videos FOR ALL USING (is_admin());
CREATE POLICY "Guitarists can manage own videos" ON guitarist_videos FOR ALL
  USING (guitarist_id = my_guitarist_id());

-- TABLATURE LINKS
CREATE POLICY "Public can read tabs of approved guitarists" ON tablature_links FOR SELECT
  USING (EXISTS (SELECT 1 FROM guitarists WHERE guitarists.id = tablature_links.guitarist_id AND guitarists.approval_status = 'approved'));
CREATE POLICY "Admins can do everything on tabs" ON tablature_links FOR ALL USING (is_admin());
CREATE POLICY "Guitarists can manage own tabs" ON tablature_links FOR ALL
  USING (guitarist_id = my_guitarist_id());

-- SOCIAL LINKS
CREATE POLICY "Public can read socials of approved guitarists" ON social_links FOR SELECT
  USING (EXISTS (SELECT 1 FROM guitarists WHERE guitarists.id = social_links.guitarist_id AND guitarists.approval_status = 'approved'));
CREATE POLICY "Admins can do everything on socials" ON social_links FOR ALL USING (is_admin());
CREATE POLICY "Guitarists can manage own socials" ON social_links FOR ALL
  USING (guitarist_id = my_guitarist_id());

-- GEAR PRODUCTS
CREATE POLICY "Public can read active gear" ON gear_products FOR SELECT USING (active = TRUE);
CREATE POLICY "Admins can do everything on gear" ON gear_products FOR ALL USING (is_admin());

-- ARTICLES
CREATE POLICY "Public can read published articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can do everything on articles" ON articles FOR ALL USING (is_admin());

-- =============================================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role, display_name)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'guitarist'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
