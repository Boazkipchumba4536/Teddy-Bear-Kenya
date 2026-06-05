-- Brand + stock for curated catalog imports
alter table public.products
  add column if not exists brand text not null default '',
  add column if not exists in_stock boolean not null default true;

create index if not exists products_brand_idx on public.products (brand);
