ALTER TABLE artisan_profiles
  ADD COLUMN IF NOT EXISTS searchable_name TEXT;

CREATE INDEX IF NOT EXISTS idx_artisan_profiles_name_trgm
  ON artisan_profiles USING gin (searchable_name gin_trgm_ops);

ALTER TABLE buyer_profiles
  ADD COLUMN IF NOT EXISTS searchable_company_name TEXT;

CREATE INDEX IF NOT EXISTS idx_buyer_profiles_company_trgm
  ON buyer_profiles USING gin (searchable_company_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_products_artisan_published
  ON products (artisan_id, created_at DESC)
  WHERE status IN ('PUBLISHED','OUT_OF_STOCK');

CREATE INDEX IF NOT EXISTS idx_products_price_range
  ON products (retail_price)
  WHERE status = 'PUBLISHED';

CREATE INDEX IF NOT EXISTS idx_products_gi_eligible
  ON products (gi_eligible)
  WHERE gi_eligible = true AND status = 'PUBLISHED';

CREATE INDEX IF NOT EXISTS idx_orders_status_created
  ON orders (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_artisan_revenue
  ON orders (artisan_id, created_at DESC)
  WHERE status = 'DELIVERED';

CREATE INDEX IF NOT EXISTS idx_artisan_profiles_trust_low
  ON artisan_profiles (trust_score)
  WHERE trust_score < 30;

CREATE INDEX IF NOT EXISTS idx_buyer_profiles_trust_low
  ON buyer_profiles (trust_score)
  WHERE trust_score < 30;

CREATE INDEX IF NOT EXISTS idx_notifications_category_created
  ON notifications (category, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_rfqs_expiry_status
  ON rfqs (expiry_date, status)
  WHERE status IN ('OPEN','QUOTED','MATCHING');

CREATE INDEX IF NOT EXISTS idx_messages_conv_undelivered
  ON messages (conversation_id, created_at ASC)
  WHERE delivery_status = 'SENT';

CREATE INDEX IF NOT EXISTS idx_disputes_escalation
  ON disputes (created_at ASC, status)
  WHERE status IN ('OPEN','UNDER_REVIEW');

CREATE INDEX IF NOT EXISTS idx_artisan_profiles_region
  ON artisan_profiles (state, district)
  WHERE verified = true;

CREATE INDEX IF NOT EXISTS idx_ai_jobs_pending_type
  ON ai_jobs (job_type, queued_at ASC)
  WHERE status IN ('PENDING','RETRYING');

CREATE INDEX IF NOT EXISTS idx_product_embeddings_updated
  ON product_embeddings (updated_at ASC);
