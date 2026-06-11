-- Cruz Trade — seed data (5 sample listings)
-- Run in: Supabase Dashboard → SQL Editor
-- Creates one seed provider account + 5 listings across categories.
-- Safe to re-run — skips if seed user already exists.

do $$
declare
  v_uid uuid := '00000000-dead-beef-cafe-000000000001'::uuid;
begin

  -- ── Skip if already seeded ────────────────────────────────────────────────
  if exists (select 1 from auth.users where id = v_uid) then
    raise notice 'Seed user already exists — skipping.';
    return;
  end if;

  -- ── Create auth user ──────────────────────────────────────────────────────
  insert into auth.users (
    id, instance_id,
    email, encrypted_password, email_confirmed_at,
    role, aud,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    created_at, updated_at
  ) values (
    v_uid,
    '00000000-0000-0000-0000-000000000000',
    'seed@cruztrade.test',
    crypt('SeedPass123!', gen_salt('bf')),
    now(),
    'authenticated', 'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Maria Garcia"}',
    false,
    '', '', '', '',
    now(), now()
  );

  -- ── Wire up auth identity (required for login) ────────────────────────────
  insert into auth.identities (
    id, provider_id, user_id,
    identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) values (
    v_uid,
    'seed@cruztrade.test',
    v_uid,
    jsonb_build_object('sub', v_uid::text, 'email', 'seed@cruztrade.test'),
    'email',
    now(), now(), now()
  );

  -- ── Fill out profile (trigger created the row) ────────────────────────────
  update public.profiles set
    full_name           = 'Maria Garcia',
    username            = 'maria_sc',
    bio                 = 'Longtime Santa Cruz resident. I do garden work, help with tech, and rent my tools to neighbors.',
    neighborhood        = 'Santa Cruz — Westside',
    language_preference = 'en'
  where id = v_uid;

  -- ── 5 seed listings ───────────────────────────────────────────────────────
  insert into public.listings
    (user_id, type, title, description, category, price, price_unit,
     neighborhood, language, accepts_trade, trade_description)
  values

    -- 1. Home & garden service (EN, accepts trade)
    (v_uid, 'service',
     'Garden bed setup and seasonal planting',
     'I will help you plan, prep, and plant raised beds or in-ground gardens. Great for beginners — I teach as we go. I bring all my own tools. Available weekends and some weekday mornings.',
     'home_garden', 6500, 'per_hour',
     'Santa Cruz — Westside', 'en', true,
     'Happy to trade for homemade food, kombucha, sourdough, or other garden help.'),

    -- 2. Tech service (EN, no trade)
    (v_uid, 'service',
     'Computer setup and tech troubleshooting',
     'Slow laptop? Printer not working? Virus scare? I can help. 10+ years fixing neighbors'' tech. Specialties: Mac, iPhone, home Wi-Fi, printer setup. I come to you.',
     'tech', 5500, 'per_hour',
     'Santa Cruz — Westside', 'en', false, null),

    -- 3. Tool rental (EN, no trade)
    (v_uid, 'tool_rental',
     'DeWalt 20V cordless drill + full bit set',
     'Heavy-duty cordless drill, 2 batteries, fast charger, and a 40-piece bit set. Perfect for weekend projects. Pickup in Westside Santa Cruz. $20/day deposit held, returned on time.',
     'tools', 2000, 'per_day',
     'Santa Cruz — Westside', 'en', false, null),

    -- 4. Wellness service (ES, accepts trade)
    (v_uid, 'service',
     'Masaje terapéutico a domicilio',
     'Masajista certificada con 8 años de experiencia. Especialidad en alivio de dolor de espalda, cuello y hombros. Traigo mi propia mesa portátil y aceites naturales. Atiendo en Santa Cruz y Watsonville.',
     'wellness', 8000, 'flat',
     'Watsonville', 'es', true,
     'Acepto intercambio por clases de cocina, cuidado de jardín, o transporte local.'),

    -- 5. Transport service (EN, no trade)
    (v_uid, 'service',
     'Truck + muscle for moving and hauling',
     'I have a 2022 Ford F-250 and two strong arms. Help with furniture moves, dump runs, Craigslist pickups, or anything that needs a truck. Available most weekends. Watsonville to Half Moon Bay.',
     'transport', 7500, 'per_hour',
     'Capitola', 'en', false, null);

  raise notice 'Seed complete — 5 listings created under @maria_sc (seed@cruztrade.test / SeedPass123!)';

end $$;
