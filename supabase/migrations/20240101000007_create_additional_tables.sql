-- 
-- Migration: 007 — Additional tables not in migration 003
-- 

-- Region stats for Craft Atlas (Req 21.5)
CREATE TABLE IF NOT EXISTS region_stats (
  region_code   TEXT PRIMARY KEY,
  artisan_count INTEGER NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Transit matrix for delivery estimates (Req 20.1)
CREATE TABLE IF NOT EXISTS transit_matrix (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_district TEXT NOT NULL,
  dest_pincode  TEXT NOT NULL,
  transit_days  INTEGER NOT NULL CHECK (transit_days BETWEEN 1 AND 60),
  courier       TEXT,
  UNIQUE (origin_district, dest_pincode)
);

CREATE INDEX idx_transit_matrix_origin ON transit_matrix (origin_district);
CREATE INDEX idx_transit_matrix_dest ON transit_matrix (dest_pincode);

-- Market signals for demand surge detection (Req 22.4)
CREATE TABLE IF NOT EXISTS market_signals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category      TEXT NOT NULL,
  current_index NUMERIC(10,4) NOT NULL DEFAULT 100,
  prev_index    NUMERIC(10,4) NOT NULL DEFAULT 100,
  source        TEXT,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category)
);

-- GI Tags registry (Req 22.3)
CREATE TABLE IF NOT EXISTS gi_tags (
  craft         TEXT PRIMARY KEY,
  tag_name      TEXT NOT NULL,
  ipindia_url   TEXT,
  state         TEXT,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notification preferences (Req 24.4)
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category       notification_category NOT NULL,
  email_enabled  BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (user_id, category)
);

-- Wholesale tiers (already in 003 but adding IF NOT EXISTS guard)
-- Already created in migration 003

-- Seed GI tags from IPINDIA registry
INSERT INTO gi_tags (craft, tag_name, ipindia_url, state) VALUES
  ('Pashmina', 'Kashmir Pashmina', 'https://ipindia.gov.in', 'Jammu & Kashmir'),
  ('Madhubani Painting', 'Mithila Madhubani Painting', 'https://ipindia.gov.in', 'Bihar'),
  ('Chikankari', 'Lucknow Chikankari', 'https://ipindia.gov.in', 'Uttar Pradesh'),
  ('Phulkari', 'Punjab Phulkari', 'https://ipindia.gov.in', 'Punjab'),
  ('Blue Pottery', 'Jaipur Blue Pottery', 'https://ipindia.gov.in', 'Rajasthan'),
  ('Bidriware', 'Bidriware', 'https://ipindia.gov.in', 'Karnataka'),
  ('Kancheepuram Silk', 'Kanchipuram Silk', 'https://ipindia.gov.in', 'Tamil Nadu'),
  ('Mysore Silk', 'Mysore Silk', 'https://ipindia.gov.in', 'Karnataka'),
  ('Channapatna Toys', 'Channapatna Toys', 'https://ipindia.gov.in', 'Karnataka'),
  ('Dhokra', 'Bastar Dhokra', 'https://ipindia.gov.in', 'Chhattisgarh'),
  ('Warli Painting', 'Warli Painting', 'https://ipindia.gov.in', 'Maharashtra')
ON CONFLICT (craft) DO NOTHING;

-- Seed sample transit matrix for major routes
INSERT INTO transit_matrix (origin_district, dest_pincode, transit_days, courier) VALUES
  ('LUCKNOW', '110001', 3, 'India Post'),
  ('LUCKNOW', '400001', 4, 'India Post'),
  ('LUCKNOW', '600001', 6, 'India Post'),
  ('JAIPUR', '110001', 2, 'India Post'),
  ('JAIPUR', '400001', 3, 'India Post'),
  ('VARANASI', '110001', 3, 'India Post'),
  ('VARANASI', '400001', 4, 'India Post'),
  ('SRINAGAR', '110001', 5, 'India Post'),
  ('BHOPAL', '110001', 3, 'India Post'),
  ('BHOPAL', '400001', 4, 'India Post')
ON CONFLICT (origin_district, dest_pincode) DO NOTHING;

-- Seed regional cost index for pricing engine (Req 7.2)
INSERT INTO regional_cost_index (district, state, index) VALUES
  ('LUCKNOW',   'Uttar Pradesh',  1.000),
  ('VARANASI',  'Uttar Pradesh',  0.900),
  ('JAIPUR',    'Rajasthan',      1.100),
  ('SRINAGAR',  'Jammu & Kashmir',1.300),
  ('BHOPAL',    'Madhya Pradesh', 0.850),
  ('HYDERABAD', 'Telangana',      1.100),
  ('BANGALORE', 'Karnataka',      1.200),
  ('CHENNAI',   'Tamil Nadu',     1.150),
  ('KOLKATA',   'West Bengal',    1.000),
  ('MUMBAI',    'Maharashtra',    1.250)
ON CONFLICT (district) DO NOTHING;
