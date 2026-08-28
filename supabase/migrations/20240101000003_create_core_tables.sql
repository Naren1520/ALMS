-- 
-- Migration: 003 — Create All Core Tables
-- 
-- Covers all 31 tables specified in the design document.
-- Forward-reference issue: ai_jobs references ai_results and vice
-- versa. Resolved by: creating ai_results first, then ai_jobs,
-- then adding the FK from ai_jobs → ai_results via ALTER TABLE.
-- 

-- 
-- SECTION 1: Users & Authentication
-- 

CREATE TABLE users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        UNIQUE NOT NULL,
  password_hash TEXT        NOT NULL,           -- bcrypt/argon2 output (Req 1.9)
  role          user_role   NOT NULL,
  status        account_status NOT NULL DEFAULT 'UNVERIFIED',
  language_pref TEXT        NOT NULL DEFAULT 'en',
  -- Failed login tracking (Req 1.6) — stored in Redis, but also recorded here
  -- for persistence across server restarts
  failed_login_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until  TIMESTAMPTZ,                    -- set when account is locked
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pg_trgm GIN index for full-text search on email and name (Req 25.3)
-- (name lives in artisan_profiles/buyer_profiles; we index email here)
CREATE INDEX idx_users_email_trgm  ON users USING gin (email gin_trgm_ops);
CREATE INDEX idx_users_role        ON users (role);
CREATE INDEX idx_users_status      ON users (status);

-- ------------------------------------
-- Refresh tokens — rotating, single-use (Req 1.8)
-- ------------------------------------
CREATE TABLE refresh_tokens (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT        NOT NULL UNIQUE,    -- SHA-256 of the opaque token
  issued_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ NOT NULL,
  revoked_at  TIMESTAMPTZ                     -- NULL = still valid
);

CREATE INDEX idx_refresh_tokens_user_id   ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_hash      ON refresh_tokens (token_hash);
CREATE INDEX idx_refresh_tokens_expires   ON refresh_tokens (expires_at)
  WHERE revoked_at IS NULL;

-- 
-- SECTION 2: Artisan Profiles & Verification
-- 

CREATE TABLE artisan_profiles (
  id               UUID     PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name_enc    BYTEA    NOT NULL,           -- AES-256-GCM encrypted (Req 26.6)
  state            TEXT     NOT NULL,
  district         TEXT     NOT NULL,
  primary_craft    TEXT     NOT NULL,
  verified         BOOLEAN  NOT NULL DEFAULT false,
  trust_score      NUMERIC(5,2) NOT NULL DEFAULT 0
                   CHECK (trust_score BETWEEN 0 AND 100),
  monthly_capacity INTEGER  CHECK (monthly_capacity BETWEEN 1 AND 999999),
  lead_time_days   INTEGER  CHECK (lead_time_days BETWEEN 1 AND 365),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pg_trgm GIN index on a computed full_name column is not possible for BYTEA.
-- The application decrypts full_name and performs search in application layer,
-- or stores a normalised searchable version. A separate index on state/district:
CREATE INDEX idx_artisan_profiles_state_district ON artisan_profiles (state, district);
CREATE INDEX idx_artisan_profiles_craft          ON artisan_profiles (primary_craft);
CREATE INDEX idx_artisan_profiles_verified       ON artisan_profiles (verified);

CREATE TABLE artisan_verifications (
  id               UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id       UUID              NOT NULL REFERENCES users(id),
  status           verification_status NOT NULL DEFAULT 'PENDING',
  document_key     TEXT,                         -- R2 object key (private bucket)
  reviewed_by      UUID              REFERENCES users(id),
  rejection_reason TEXT,                         -- must be ≥10 chars if REJECTED (Req 2.6)
  submitted_at     TIMESTAMPTZ       NOT NULL DEFAULT now(),
  reviewed_at      TIMESTAMPTZ,
  CONSTRAINT chk_artisan_verification_rejection
    CHECK (
      status <> 'REJECTED'
      OR (rejection_reason IS NOT NULL AND length(rejection_reason) >= 10)
    )
);

CREATE INDEX idx_artisan_verifications_artisan ON artisan_verifications (artisan_id);
CREATE INDEX idx_artisan_verifications_status  ON artisan_verifications (status);

-- 
-- SECTION 3: Buyer Profiles & Verification
-- 

CREATE TABLE buyer_profiles (
  id                     UUID    PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  company_name           TEXT    NOT NULL,
  gst_number_enc         BYTEA   NOT NULL,           -- AES-256-GCM encrypted (Req 26.6)
  registered_address_enc BYTEA   NOT NULL,           -- AES-256-GCM encrypted
  business_category      TEXT    NOT NULL,
  annual_volume_inr      NUMERIC CHECK (annual_volume_inr > 0),
  verified               BOOLEAN NOT NULL DEFAULT false,
  trust_score            NUMERIC(5,2) NOT NULL DEFAULT 0
                         CHECK (trust_score BETWEEN 0 AND 100),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_buyer_profiles_verified ON buyer_profiles (verified);

CREATE TABLE buyer_verifications (
  id               UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id         UUID              NOT NULL REFERENCES users(id),
  status           verification_status NOT NULL DEFAULT 'PENDING',
  document_keys    TEXT[]            NOT NULL DEFAULT '{}',  -- R2 object keys
  reviewed_by      UUID              REFERENCES users(id),
  rejection_reason TEXT,
  submitted_at     TIMESTAMPTZ       NOT NULL DEFAULT now(),
  reviewed_at      TIMESTAMPTZ,
  CONSTRAINT chk_buyer_verification_rejection
    CHECK (
      status <> 'REJECTED'
      OR (rejection_reason IS NOT NULL AND length(rejection_reason) >= 10)
    )
);

CREATE INDEX idx_buyer_verifications_buyer  ON buyer_verifications (buyer_id);
CREATE INDEX idx_buyer_verifications_status ON buyer_verifications (status);

-- 
-- SECTION 4: Products
-- 

CREATE TABLE products (
  id                UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id        UUID           NOT NULL REFERENCES users(id),
  title             TEXT           NOT NULL
                    CHECK (length(title) BETWEEN 1 AND 200),    -- Req 10.2
  description_en    TEXT,
  description_hi    TEXT,
  category          TEXT,
  subcategory       TEXT,
  material          TEXT,
  craft_technique   TEXT,
  care_instructions TEXT,
  dimensions        TEXT,          -- nullable; flagged when missing (Req 6.2)
  retail_price      NUMERIC(10,2)  CHECK (retail_price > 0),
  wholesale_price   NUMERIC(10,2)  CHECK (wholesale_price > 0),
  moq               INTEGER        CHECK (moq >= 1),
  status            product_status NOT NULL DEFAULT 'DRAFT',
  inventory_qty     INTEGER        NOT NULL DEFAULT 0
                    CHECK (inventory_qty BETWEEN 0 AND 999999), -- Req 11.3
  lead_time_days    INTEGER        CHECK (lead_time_days BETWEEN 1 AND 365),
  gi_eligible       BOOLEAN        NOT NULL DEFAULT false,       -- Req 22.3
  created_at        TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_artisan_id ON products (artisan_id);
CREATE INDEX idx_products_status     ON products (status);
CREATE INDEX idx_products_category   ON products (category) WHERE status = 'PUBLISHED';
CREATE INDEX idx_products_craft_technique ON products (craft_technique);
-- Full-text search index (GIN) for PostgreSQL FTS (Req 9.2)
CREATE INDEX idx_products_fts ON products
  USING gin (to_tsvector('english',
    coalesce(title,'') || ' ' ||
    coalesce(description_en,'') || ' ' ||
    coalesce(category,'') || ' ' ||
    coalesce(craft_technique,'') || ' ' ||
    coalesce(material,'')
  ));

-- ------------------------------------
-- Product media (images — original + enhanced) (Req 5.3)
-- ------------------------------------
CREATE TABLE product_media (
  id           UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID     NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  r2_key_orig  TEXT     NOT NULL,    -- original upload R2 key
  r2_key_enh   TEXT,                 -- enhanced image R2 key (nullable until processed)
  is_active    BOOLEAN  NOT NULL DEFAULT true,
  sort_order   INTEGER  NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_media_product_id ON product_media (product_id);

-- ------------------------------------
-- Product attribute snapshots — versioned history (Req 10.3)
-- ------------------------------------
CREATE TABLE product_attributes (
  id           UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID     NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  snapshot     JSONB    NOT NULL,         -- full product state before update
  snapshot_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  snapshot_by  UUID     NOT NULL REFERENCES users(id)
);

CREATE INDEX idx_product_attributes_product_id ON product_attributes (product_id);
CREATE INDEX idx_product_attributes_snapshot_at ON product_attributes (snapshot_at DESC);

-- 
-- SECTION 5: AI Infrastructure
-- 
-- NOTE: ai_jobs has a FK to ai_results (output_result_id).
-- ai_results has a FK to ai_jobs (job_id).
-- We break the cycle by creating ai_results first (without the
-- jobs FK pointing back to it), then ai_jobs, then adding the
-- FK from ai_jobs.output_result_id via ALTER TABLE.
-- 

CREATE TABLE ai_results (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id      UUID        NOT NULL,    -- FK added after ai_jobs is created
  result_type ai_job_type NOT NULL,
  payload     JSONB       NOT NULL,    -- structured output (Req 6.7)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ai_jobs (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type         ai_job_type   NOT NULL,
  product_id       UUID          REFERENCES products(id),
  user_id          UUID          NOT NULL REFERENCES users(id),
  status           ai_job_status NOT NULL DEFAULT 'PENDING',
  attempt_count    INTEGER       NOT NULL DEFAULT 0
                   CHECK (attempt_count >= 0),
  input_payload    JSONB         NOT NULL,
  error_message    TEXT,
  output_result_id UUID          REFERENCES ai_results(id),
  queued_at        TIMESTAMPTZ   NOT NULL DEFAULT now(),
  started_at       TIMESTAMPTZ,
  completed_at     TIMESTAMPTZ
);

-- Now add the FK from ai_results → ai_jobs (safe, ai_jobs exists now)
ALTER TABLE ai_results
  ADD CONSTRAINT fk_ai_results_job_id
  FOREIGN KEY (job_id) REFERENCES ai_jobs(id);

CREATE INDEX idx_ai_jobs_product_id ON ai_jobs (product_id);
CREATE INDEX idx_ai_jobs_user_id    ON ai_jobs (user_id);
CREATE INDEX idx_ai_jobs_status     ON ai_jobs (status);
CREATE INDEX idx_ai_jobs_job_type   ON ai_jobs (job_type);
CREATE INDEX idx_ai_results_job_id  ON ai_results (job_id);

-- 
-- SECTION 6: SEO Metadata
-- 

CREATE TABLE seo_metadata (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       UUID        NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  meta_title       TEXT,       -- 50–60 chars (Req 8.1)
  meta_description TEXT,       -- 150–160 chars
  og_title         TEXT,       -- 60–90 chars
  og_description   TEXT,       -- 200–300 chars
  canonical_slug   TEXT        UNIQUE,   -- kebab-case, deduplicated
  hashtags         TEXT[],     -- 5–15 items, lowercase, #-prefixed (Req 8.2)
  keywords         TEXT[],     -- 10–30 items (Req 6.6)
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_seo_metadata_product_id ON seo_metadata (product_id);
CREATE INDEX idx_seo_metadata_slug       ON seo_metadata (canonical_slug);

-- 
-- SECTION 7: Semantic Search — Product Embeddings
-- 

CREATE TABLE product_embeddings (
  product_id  UUID        PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  embedding   vector(768) NOT NULL,    -- text-embedding-004, 768 dims (Req 9.1)
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- HNSW index for approximate nearest-neighbour search (Req 9.1, design §9)
-- m=16, ef_construction=64 for production scale (up to 1M products)
CREATE INDEX idx_product_embeddings_hnsw
  ON product_embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- 
-- SECTION 8: Inventory Batches
-- 

CREATE TABLE inventory_batches (
  id             UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id     UUID     NOT NULL REFERENCES products(id),
  prev_qty       INTEGER  NOT NULL
                 CHECK (prev_qty BETWEEN 0 AND 999999),
  new_qty        INTEGER  NOT NULL
                 CHECK (new_qty BETWEEN 0 AND 999999),
  change_reason  TEXT,
  actor_id       UUID     NOT NULL REFERENCES users(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_inventory_batches_product_id ON inventory_batches (product_id);
CREATE INDEX idx_inventory_batches_actor_id   ON inventory_batches (actor_id);
CREATE INDEX idx_inventory_batches_created_at ON inventory_batches (created_at DESC);

-- 
-- SECTION 9: B2B — RFQs, Matches, Quotes, Wholesale Tiers
-- 

CREATE TABLE rfqs (
  id                UUID       PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id          UUID       NOT NULL REFERENCES users(id),
  category          TEXT,
  product_id        UUID       REFERENCES products(id),
  required_qty      INTEGER    NOT NULL CHECK (required_qty >= 1),  -- Req 13.2
  target_unit_price NUMERIC(10,2),
  delivery_date     DATE       NOT NULL,
  delivery_city     TEXT       NOT NULL,
  delivery_state    TEXT       NOT NULL,
  spec_notes        TEXT       CHECK (length(spec_notes) <= 2000),  -- Req 13.2
  status            rfq_status NOT NULL DEFAULT 'OPEN',
  expiry_date       DATE       NOT NULL,                             -- 1–90 days (Req 13.6)
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_rfq_delivery_date
    CHECK (delivery_date >= (created_at::DATE + 7)),                -- Req 13.2
  CONSTRAINT chk_rfq_expiry_range
    CHECK (expiry_date BETWEEN created_at::DATE + 1 AND created_at::DATE + 90)
);

CREATE INDEX idx_rfqs_buyer_id   ON rfqs (buyer_id);
CREATE INDEX idx_rfqs_status     ON rfqs (status);
CREATE INDEX idx_rfqs_expiry     ON rfqs (expiry_date) WHERE status IN ('OPEN','QUOTED');

CREATE TABLE rfq_matches (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id      UUID        NOT NULL REFERENCES rfqs(id),
  artisan_id  UUID        NOT NULL REFERENCES users(id),
  match_score NUMERIC(5,2) NOT NULL CHECK (match_score BETWEEN 0 AND 100),
  factors     JSONB       NOT NULL,   -- top-3 scoring factor explanation (Req 13.4)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rfq_matches_rfq_id    ON rfq_matches (rfq_id);
CREATE INDEX idx_rfq_matches_artisan   ON rfq_matches (artisan_id);

CREATE TABLE quotes (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id            UUID         NOT NULL REFERENCES rfqs(id),
  artisan_id        UUID         NOT NULL REFERENCES users(id),
  unit_price        NUMERIC(10,2) NOT NULL CHECK (unit_price > 0),  -- Req 14.2
  moq               INTEGER      NOT NULL CHECK (moq >= 1),
  total_qty         INTEGER      NOT NULL CHECK (total_qty >= 1),
  est_delivery_date DATE         NOT NULL,
  production_notes  TEXT         CHECK (length(production_notes) <= 1000),
  status            quote_status NOT NULL DEFAULT 'PENDING',
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_quotes_rfq_id    ON quotes (rfq_id);
CREATE INDEX idx_quotes_artisan   ON quotes (artisan_id);
CREATE INDEX idx_quotes_status    ON quotes (status);

-- Up to 5 wholesale price tiers per product (Req 14.6)
CREATE TABLE wholesale_tiers (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  min_qty     INTEGER     NOT NULL CHECK (min_qty >= 1),
  unit_price  NUMERIC(10,2) NOT NULL CHECK (unit_price > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, min_qty)
);

CREATE INDEX idx_wholesale_tiers_product ON wholesale_tiers (product_id);

-- 
-- SECTION 10: Orders
-- 

CREATE TABLE orders (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id          UUID         NOT NULL REFERENCES users(id),
  artisan_id        UUID         NOT NULL REFERENCES users(id),
  product_id        UUID         NOT NULL REFERENCES products(id),
  qty               INTEGER      NOT NULL CHECK (qty >= 1),
  unit_price        NUMERIC(10,2) NOT NULL CHECK (unit_price > 0),
  order_type        order_type   NOT NULL,
  status            order_status NOT NULL DEFAULT 'PENDING',
  rfq_id            UUID         REFERENCES rfqs(id),
  quote_id          UUID         REFERENCES quotes(id),
  est_delivery_date DATE,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_buyer_id   ON orders (buyer_id);
CREATE INDEX idx_orders_artisan_id ON orders (artisan_id);
CREATE INDEX idx_orders_product_id ON orders (product_id);
CREATE INDEX idx_orders_status     ON orders (status);
CREATE INDEX idx_orders_created_at ON orders (created_at DESC);

-- 
-- SECTION 11: Messaging
-- 

-- One conversation per (artisan_id, buyer_id) pair (Req 15.1)
CREATE TABLE conversations (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id  UUID    NOT NULL REFERENCES users(id),
  buyer_id    UUID    NOT NULL REFERENCES users(id),
  rfq_id      UUID    REFERENCES rfqs(id),
  flagged     BOOLEAN NOT NULL DEFAULT false,  -- Req 15.7
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (artisan_id, buyer_id)
);

CREATE INDEX idx_conversations_artisan ON conversations (artisan_id);
CREATE INDEX idx_conversations_buyer   ON conversations (buyer_id);
CREATE INDEX idx_conversations_rfq     ON conversations (rfq_id);

CREATE TABLE messages (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  UUID          NOT NULL REFERENCES conversations(id),
  sender_id        UUID          NOT NULL REFERENCES users(id),
  content          TEXT          NOT NULL
                   CHECK (length(content) <= 2000),             -- Req 15.4
  content_trans    TEXT,                                         -- translated (Req 15.3)
  source_lang      TEXT,
  target_lang      TEXT,
  attachment_key   TEXT,                                         -- R2 key for file
  delivery_status  message_status NOT NULL DEFAULT 'SENT',
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation_id ON messages (conversation_id);
CREATE INDEX idx_messages_sender_id       ON messages (sender_id);
CREATE INDEX idx_messages_created_at      ON messages (created_at DESC);
CREATE INDEX idx_messages_delivery_status ON messages (delivery_status)
  WHERE delivery_status IN ('SENT','DELIVERED');

-- 
-- SECTION 12: Trust Scores & Events
-- 

-- trust_events references reviews and disputes, which don't exist yet.
-- FKs to those tables are added at the end of this migration.

CREATE TABLE trust_scores (
  user_id    UUID        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  score      NUMERIC(5,2) NOT NULL DEFAULT 0
             CHECK (score BETWEEN 0 AND 100),                   -- Req 17.1
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE trust_events (
  id               UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID             NOT NULL REFERENCES users(id),
  event_type       trust_event_type NOT NULL,
  base_weight      NUMERIC(5,2)     NOT NULL,
  applied_weight   NUMERIC(5,2)     NOT NULL,
  ref_order_id     UUID             REFERENCES orders(id),
  ref_review_id    UUID,            -- FK added after reviews table exists
  ref_dispute_id   UUID,            -- FK added after disputes table exists
  created_at       TIMESTAMPTZ      NOT NULL DEFAULT now()
);

CREATE INDEX idx_trust_events_user_id    ON trust_events (user_id);
CREATE INDEX idx_trust_events_event_type ON trust_events (event_type);
CREATE INDEX idx_trust_events_created_at ON trust_events (created_at DESC);

-- 
-- SECTION 13: Reviews
-- 

CREATE TABLE reviews (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID          NOT NULL UNIQUE REFERENCES orders(id),
  reviewer_id       UUID          NOT NULL REFERENCES users(id),
  reviewed_id       UUID          NOT NULL REFERENCES users(id),
  rating            SMALLINT      NOT NULL CHECK (rating BETWEEN 1 AND 5),  -- Req 18.2
  text_review       TEXT          CHECK (length(text_review) <= 1000),
  moderation_status review_status NOT NULL DEFAULT 'PENDING_MODERATION',
  artisan_reply     TEXT          CHECK (length(artisan_reply) <= 500),      -- Req 18.5
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_order_id     ON reviews (order_id);
CREATE INDEX idx_reviews_reviewed_id  ON reviews (reviewed_id);
CREATE INDEX idx_reviews_reviewer_id  ON reviews (reviewer_id);
CREATE INDEX idx_reviews_status       ON reviews (moderation_status);

-- 
-- SECTION 14: Disputes
-- 

CREATE TABLE disputes (
  id           UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID              NOT NULL REFERENCES orders(id),
  opened_by    UUID              NOT NULL REFERENCES users(id),
  category     dispute_category  NOT NULL,
  description  TEXT              NOT NULL
               CHECK (length(description) BETWEEN 10 AND 1000),  -- Req 19.2
  status       dispute_status    NOT NULL DEFAULT 'OPEN',
  assigned_to  UUID              REFERENCES users(id),
  resolution   dispute_resolution,
  rationale    TEXT              CHECK (rationale IS NULL OR length(rationale) >= 50),
  created_at   TIMESTAMPTZ       NOT NULL DEFAULT now(),
  resolved_at  TIMESTAMPTZ,
  CONSTRAINT chk_dispute_resolution_rationale
    CHECK (
      resolution IS NULL
      OR (rationale IS NOT NULL AND length(rationale) >= 50)
    )
);

CREATE INDEX idx_disputes_order_id    ON disputes (order_id);
CREATE INDEX idx_disputes_opened_by   ON disputes (opened_by);
CREATE INDEX idx_disputes_assigned_to ON disputes (assigned_to);
CREATE INDEX idx_disputes_status      ON disputes (status);
CREATE INDEX idx_disputes_created_at  ON disputes (created_at DESC);

CREATE TABLE dispute_evidence (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id   UUID    NOT NULL REFERENCES disputes(id),
  r2_key       TEXT    NOT NULL,
  file_type    TEXT    NOT NULL
               CHECK (file_type IN ('image/jpeg','image/png','application/pdf',
                                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document')),
  uploaded_by  UUID    NOT NULL REFERENCES users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_dispute_evidence_dispute ON dispute_evidence (dispute_id);

-- 
-- SECTION 15: Add deferred FKs now that all tables exist
-- 

ALTER TABLE trust_events
  ADD CONSTRAINT fk_trust_events_review
    FOREIGN KEY (ref_review_id) REFERENCES reviews(id),
  ADD CONSTRAINT fk_trust_events_dispute
    FOREIGN KEY (ref_dispute_id) REFERENCES disputes(id);

-- 
-- SECTION 16: Notifications
-- 

CREATE TABLE notifications (
  id          UUID                  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID                  NOT NULL REFERENCES users(id),
  category    notification_category NOT NULL,
  title       TEXT                  NOT NULL,
  body        TEXT                  NOT NULL,
  read        BOOLEAN               NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ           NOT NULL DEFAULT now()
);

-- Composite index for efficient per-user inbox queries (Req task spec)
CREATE INDEX idx_notifications_user_created
  ON notifications (user_id, created_at DESC);

-- Partial index for unread counts
CREATE INDEX idx_notifications_unread
  ON notifications (user_id)
  WHERE read = false;

-- 
-- SECTION 17: Market Opportunities
-- 

CREATE TABLE market_opportunities (
  id               UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       UUID    NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  market_type      TEXT    NOT NULL
                   CHECK (market_type IN ('DOMESTIC','INTERNATIONAL')),
  target_market    TEXT    NOT NULL,
  demand_level     TEXT    NOT NULL
                   CHECK (demand_level IN ('LOW','MEDIUM','HIGH','VERY_HIGH')),
  sales_channel    TEXT    NOT NULL,
  rationale        TEXT    NOT NULL,
  demand_driver    TEXT    CHECK (demand_driver IN (
                     'diaspora','tourism','design trend','institutional buyer'
                   )),
  cert_required    TEXT[],
  source_id        TEXT,
  data_attribution TEXT,
  last_updated     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_market_opportunities_product ON market_opportunities (product_id);
CREATE INDEX idx_market_opportunities_type    ON market_opportunities (market_type);

-- 
-- SECTION 18: Audit Logs (append-only; Req 26.7, 25.6)
-- 

CREATE TABLE audit_logs (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type   TEXT    NOT NULL,
  actor_id     UUID    REFERENCES users(id),          -- NULL for system events
  target_id    TEXT,                                   -- generic entity reference
  before_state JSONB,
  after_state  JSONB,
  ip_address   INET,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_actor_id   ON audit_logs (actor_id);
CREATE INDEX idx_audit_logs_event_type ON audit_logs (event_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at DESC);

-- 
-- SECTION 19: Platform Configuration
-- 

-- Generic key-value store for runtime-configurable values (Req 25.8)
CREATE TABLE platform_config (
  key        TEXT    PRIMARY KEY,
  value      JSONB   NOT NULL,
  updated_by UUID    REFERENCES users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trust event base weights and admin-configurable multipliers (Req 17.2, 25.8)
CREATE TABLE trust_event_weights (
  event_type  trust_event_type PRIMARY KEY,
  base_weight NUMERIC(5,2)     NOT NULL,
  multiplier  NUMERIC(5,2)     NOT NULL DEFAULT 1.0
              CHECK (multiplier BETWEEN 0.1 AND 3.0)    -- Req 17, design §13
);

-- Pricing engine regional cost index (Req 7.2, 25.8)
CREATE TABLE regional_cost_index (
  district   TEXT         PRIMARY KEY,
  state      TEXT         NOT NULL,
  index      NUMERIC(5,3) NOT NULL DEFAULT 1.0
             CHECK (index > 0)
);

CREATE INDEX idx_regional_cost_index_state ON regional_cost_index (state);
