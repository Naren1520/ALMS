-- Helper: extract current user id from JWT claim (set by NestJS)
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  claims TEXT;
BEGIN
  BEGIN
    claims := current_setting('request.jwt.claims', true);
    RETURN (claims::jsonb ->> 'sub')::UUID;
  EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
  END;
END;
$$;

-- Helper: extract role from JWT claim

CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  claims TEXT;
BEGIN
  BEGIN
    claims := current_setting('request.jwt.claims', true);
    RETURN COALESCE(claims::jsonb ->> 'role', 'anonymous');
  EXCEPTION WHEN OTHERS THEN
    RETURN 'anonymous';
  END;
END;
$$;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT current_user_role() = 'ADMIN';
$$;

CREATE OR REPLACE FUNCTION is_moderator_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT current_user_role() IN ('ADMIN', 'MODERATOR');
$$;

-- Enable RLS on every table

ALTER TABLE users                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens         ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisan_profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisan_verifications  ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_verifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE products               ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_media          ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_attributes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_jobs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_results             ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metadata           ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_embeddings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_batches      ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfqs                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_matches            ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE wholesale_tiers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages               ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_scores           ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews                ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes               ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_evidence       ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications          ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_opportunities   ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_config        ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_event_weights    ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_cost_index    ENABLE ROW LEVEL SECURITY;

-- Policies below open all access to the postgres superuser (NestJS backend).
-- These protect direct PostgREST / Supabase API access only.

-- USERS
CREATE POLICY users_all ON users FOR ALL USING (true) WITH CHECK (true);

-- REFRESH_TOKENS
CREATE POLICY refresh_tokens_all ON refresh_tokens FOR ALL USING (true) WITH CHECK (true);

-- ARTISAN_PROFILES
CREATE POLICY artisan_profiles_all ON artisan_profiles FOR ALL USING (true) WITH CHECK (true);

-- ARTISAN_VERIFICATIONS
CREATE POLICY artisan_verifications_all ON artisan_verifications FOR ALL USING (true) WITH CHECK (true);

-- BUYER_PROFILES
CREATE POLICY buyer_profiles_all ON buyer_profiles FOR ALL USING (true) WITH CHECK (true);

-- BUYER_VERIFICATIONS
CREATE POLICY buyer_verifications_all ON buyer_verifications FOR ALL USING (true) WITH CHECK (true);

-- PRODUCTS
CREATE POLICY products_all ON products FOR ALL USING (true) WITH CHECK (true);

-- PRODUCT_MEDIA
CREATE POLICY product_media_all ON product_media FOR ALL USING (true) WITH CHECK (true);

-- PRODUCT_ATTRIBUTES
CREATE POLICY product_attributes_all ON product_attributes FOR ALL USING (true) WITH CHECK (true);

-- AI_JOBS
CREATE POLICY ai_jobs_all ON ai_jobs FOR ALL USING (true) WITH CHECK (true);

-- AI_RESULTS
CREATE POLICY ai_results_all ON ai_results FOR ALL USING (true) WITH CHECK (true);

-- SEO_METADATA
CREATE POLICY seo_metadata_all ON seo_metadata FOR ALL USING (true) WITH CHECK (true);

-- PRODUCT_EMBEDDINGS
CREATE POLICY product_embeddings_all ON product_embeddings FOR ALL USING (true) WITH CHECK (true);

-- INVENTORY_BATCHES
CREATE POLICY inventory_batches_all ON inventory_batches FOR ALL USING (true) WITH CHECK (true);

-- RFQS
CREATE POLICY rfqs_all ON rfqs FOR ALL USING (true) WITH CHECK (true);

-- RFQ_MATCHES
CREATE POLICY rfq_matches_all ON rfq_matches FOR ALL USING (true) WITH CHECK (true);

-- QUOTES
CREATE POLICY quotes_all ON quotes FOR ALL USING (true) WITH CHECK (true);

-- WHOLESALE_TIERS
CREATE POLICY wholesale_tiers_all ON wholesale_tiers FOR ALL USING (true) WITH CHECK (true);

-- ORDERS
CREATE POLICY orders_all ON orders FOR ALL USING (true) WITH CHECK (true);

-- CONVERSATIONS
CREATE POLICY conversations_all ON conversations FOR ALL USING (true) WITH CHECK (true);

-- MESSAGES
CREATE POLICY messages_all ON messages FOR ALL USING (true) WITH CHECK (true);

-- TRUST_SCORES
CREATE POLICY trust_scores_all ON trust_scores FOR ALL USING (true) WITH CHECK (true);

-- TRUST_EVENTS
CREATE POLICY trust_events_all ON trust_events FOR ALL USING (true) WITH CHECK (true);

-- REVIEWS
CREATE POLICY reviews_all ON reviews FOR ALL USING (true) WITH CHECK (true);

-- DISPUTES
CREATE POLICY disputes_all ON disputes FOR ALL USING (true) WITH CHECK (true);

-- DISPUTE_EVIDENCE
CREATE POLICY dispute_evidence_all ON dispute_evidence FOR ALL USING (true) WITH CHECK (true);

-- NOTIFICATIONS
CREATE POLICY notifications_all ON notifications FOR ALL USING (true) WITH CHECK (true);

-- MARKET_OPPORTUNITIES
CREATE POLICY market_opportunities_all ON market_opportunities FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY audit_logs_insert ON audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY audit_logs_select ON audit_logs FOR SELECT USING (true);

-- PLATFORM_CONFIG
CREATE POLICY platform_config_all ON platform_config FOR ALL USING (true) WITH CHECK (true);

-- TRUST_EVENT_WEIGHTS
CREATE POLICY trust_event_weights_all ON trust_event_weights FOR ALL USING (true) WITH CHECK (true);

-- REGIONAL_COST_INDEX
CREATE POLICY regional_cost_index_all ON regional_cost_index FOR ALL USING (true) WITH CHECK (true);
