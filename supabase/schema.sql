-- Cruz Trade — authoritative schema (fresh install)
-- Run in: Supabase Dashboard → SQL Editor → New query
-- For existing installs, run migrations/ in order instead.

-- ─── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists vector;           -- pgvector: must be before listings table

-- ─── regions ──────────────────────────────────────────────────────────────────
create table public.regions (
  id              text primary key,
  display_name    text not null,
  display_name_es text not null,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

insert into public.regions (id, display_name, display_name_es)
values ('santa-cruz', 'Santa Cruz County', 'Condado de Santa Cruz');

-- ─── profiles ─────────────────────────────────────────────────────────────────
create table public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  username            text unique,
  full_name           text,
  avatar_url          text,
  bio                 text,
  neighborhood        text,
  region              text not null default 'santa-cruz' references public.regions(id),
  language_preference text not null default 'en' check (language_preference in ('en','es')),
  is_verified         boolean not null default false,
  stripe_account_id   text,
  terms_accepted_at   timestamptz,
  terms_version       text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── listings ─────────────────────────────────────────────────────────────────
create table public.listings (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  type             text not null check (type in ('service','tool_rental')),
  title            text not null,
  description      text not null,
  category         text not null check (category in ('home_garden','tech','tools','wellness','creative','transport')),
  price            integer not null default 0,
  price_unit       text not null default 'flat' check (price_unit in ('flat','per_hour','per_day')),
  accepts_trade    boolean not null default false,
  trade_description text,
  neighborhood     text,
  region           text not null default 'santa-cruz' references public.regions(id),
  language         text not null default 'en' check (language in ('en','es','both')),
  is_active        boolean not null default true,
  embedding        vector(1536),                 -- pgvector for AI matching (Phase 2)
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index listings_user_id_idx   on public.listings(user_id);
create index listings_category_idx  on public.listings(category);
create index listings_region_idx    on public.listings(region);
create index listings_is_active_idx on public.listings(is_active);
create index listings_type_idx      on public.listings(type);

-- ─── transactions ─────────────────────────────────────────────────────────────
create table public.transactions (
  id                        uuid primary key default uuid_generate_v4(),
  listing_id                uuid not null references public.listings(id) on delete restrict,
  buyer_id                  uuid not null references public.profiles(id),
  seller_id                 uuid not null references public.profiles(id),
  type                      text not null check (type in ('payment','trade')),
  amount                    integer not null default 0,
  platform_fee              integer not null default 0,
  stripe_payment_intent_id  text,
  deposit_amount            integer not null default 0,
  deposit_status            text not null default 'none' check (deposit_status in ('none','held','released','forfeited')),
  status                    text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled','disputed')),
  scheduled_date            date,
  -- Phase 2: tool condition documentation
  pickup_photos             text[],
  return_photos             text[],
  condition_notes           text,
  -- Phase 2: recurring bookings
  is_recurring              boolean not null default false,
  recurrence_interval       text check (recurrence_interval in ('weekly','biweekly','monthly')),
  recurrence_end_date       date,
  parent_transaction_id     uuid references public.transactions(id),
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index transactions_buyer_id_idx    on public.transactions(buyer_id);
create index transactions_seller_id_idx   on public.transactions(seller_id);
create index transactions_listing_id_idx  on public.transactions(listing_id);
create index transactions_status_idx      on public.transactions(status);

-- ─── reviews ──────────────────────────────────────────────────────────────────
create table public.reviews (
  id             uuid primary key default uuid_generate_v4(),
  transaction_id uuid not null references public.transactions(id) on delete cascade,
  reviewer_id    uuid not null references public.profiles(id),
  reviewee_id    uuid not null references public.profiles(id),
  rating         integer not null check (rating between 1 and 5),
  body           text,
  created_at     timestamptz not null default now(),
  unique(transaction_id, reviewer_id)
);

create index reviews_reviewee_id_idx on public.reviews(reviewee_id);

-- ─── messages ─────────────────────────────────────────────────────────────────
create table public.messages (
  id                uuid primary key default uuid_generate_v4(),
  thread_id         uuid not null,
  sender_id         uuid not null references public.profiles(id),
  recipient_id      uuid not null references public.profiles(id),
  listing_id        uuid references public.listings(id) on delete set null,
  transaction_id    uuid references public.transactions(id) on delete set null,
  body              text not null,
  -- Phase 2: auto-translation
  body_original     text,
  body_translated   text,
  original_language text check (original_language in ('en','es')),
  is_read           boolean not null default false,
  created_at        timestamptz not null default now()
);

create index messages_thread_id_idx    on public.messages(thread_id);
create index messages_sender_id_idx    on public.messages(sender_id);
create index messages_recipient_id_idx on public.messages(recipient_id);
create index messages_is_read_idx      on public.messages(is_read);

-- ─── updated_at triggers ──────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger set_listings_updated_at
  before update on public.listings
  for each row execute procedure public.set_updated_at();

create trigger set_transactions_updated_at
  before update on public.transactions
  for each row execute procedure public.set_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.regions      enable row level security;
alter table public.profiles     enable row level security;
alter table public.listings     enable row level security;
alter table public.transactions enable row level security;
alter table public.reviews      enable row level security;
alter table public.messages     enable row level security;

-- regions: public read
create policy "regions are public"
  on public.regions for select using (true);

-- profiles
create policy "profiles are public"
  on public.profiles for select using (true);
create policy "users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- listings
create policy "active listings are public"
  on public.listings for select using (is_active = true);
create policy "owners can see their own inactive listings"
  on public.listings for select using (auth.uid() = user_id);
create policy "authenticated users can create listings"
  on public.listings for insert with check (auth.uid() = user_id);
create policy "owners can update their listings"
  on public.listings for update using (auth.uid() = user_id);
create policy "owners can delete their listings"
  on public.listings for delete using (auth.uid() = user_id);

-- transactions
create policy "transaction parties can view"
  on public.transactions for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "buyers can create transactions"
  on public.transactions for insert with check (auth.uid() = buyer_id);
create policy "transaction parties can update"
  on public.transactions for update
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- reviews
create policy "reviews are public"
  on public.reviews for select using (true);
create policy "reviewers can create reviews"
  on public.reviews for insert with check (auth.uid() = reviewer_id);

-- messages
create policy "message parties can view"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "authenticated users can send messages"
  on public.messages for insert with check (auth.uid() = sender_id);
create policy "recipients can mark as read"
  on public.messages for update using (auth.uid() = recipient_id);
