INSERT INTO trust_event_weights (event_type, base_weight, multiplier)
VALUES
  ('IDENTITY_VERIFIED',         20.00, 1.0),
  ('BUSINESS_VERIFIED',         25.00, 1.0),
  ('ORDER_FULFILLED_ON_TIME',    5.00, 1.0),
  ('POSITIVE_REVIEW',            3.00, 1.0),
  ('DISPUTE_RESOLVED_FOR',       5.00, 1.0),
  ('RFQ_FULFILLED',              8.00, 1.0),
  ('ORDER_FULFILLED_LATE',      -3.00, 1.0),
  ('NEGATIVE_REVIEW',           -4.00, 1.0),
  ('DISPUTE_RESOLVED_AGAINST', -10.00, 1.0),
  ('LISTING_REJECTED',          -5.00, 1.0),
  ('ACCOUNT_FLAGGED',          -15.00, 1.0)
ON CONFLICT (event_type) DO NOTHING;

INSERT INTO platform_config (key, value)
VALUES
  ('bullmq_job_retry_limit', '3'),
  ('negotiation_counter_offer_pct', '10'),
  ('excess_inventory_discount_min_pct', '15'),
  ('excess_inventory_discount_max_pct', '25'),
  ('notification_retention_days', '90'),
  ('market_discovery_price_change_pct', '20'),
  ('market_demand_surge_threshold_pct', '30'),
  ('market_demand_surge_lookback_days', '30'),
  ('signed_url_ttl_private_secs',  '3600'),
  ('signed_url_ttl_product_secs',  '86400'),
  ('account_lockout_max_attempts', '5'),
  ('account_lockout_window_minutes', '15'),
  ('jwt_access_token_ttl_secs',   '900'),
  ('jwt_refresh_token_ttl_secs',  '604800')
ON CONFLICT (key) DO NOTHING;
