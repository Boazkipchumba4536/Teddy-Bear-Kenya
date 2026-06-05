-- =============================================================================
-- BearHug KE — run in Supabase Dashboard → SQL Editor
-- =============================================================================
-- NEW project: run each file in order (copy/paste full contents):
--   1. supabase/migrations/001_initial_schema.sql
--   2. supabase/migrations/002_product_images_storage.sql
--   3. supabase/migrations/003_security_fixes.sql
--   4. supabase/migrations/004_product_reviews.sql
--   5. This file (005) — OR run only 005 if 001–004 are already applied
-- =============================================================================

-- 005: brand + stock columns (required for catalog import / shop filters)
alter table public.products
  add column if not exists brand text not null default '',
  add column if not exists in_stock boolean not null default true;

create index if not exists products_brand_idx on public.products (brand);
