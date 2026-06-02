-- Product reviews and ratings
create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

create index if not exists product_reviews_product_id_idx on public.product_reviews (product_id);

alter table public.product_reviews enable row level security;

create policy "Anyone can read product reviews"
  on public.product_reviews for select using (true);

create policy "Authenticated users insert own review"
  on public.product_reviews for insert
  with check (auth.uid() = user_id);

create policy "Users update own review"
  on public.product_reviews for update
  using (auth.uid() = user_id);

create policy "Users delete own review"
  on public.product_reviews for delete
  using (auth.uid() = user_id);
